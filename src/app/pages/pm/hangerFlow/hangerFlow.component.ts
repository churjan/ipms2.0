import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { BehaviorSubject, combineLatest, fromEvent } from "rxjs";
import { ZPageComponent } from "~/shared/components/zpage/zpage.component";
import { UtilService } from "~/shared/services/util.service";
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from "ng-zorro-antd/tree-view";
import { auditTime, map } from "rxjs/operators";
import { SelectService } from "~/shared/services/http/select.service";
import { HangerFlowService } from "./hangerFlow.service";
import { I18nPipe } from "~/shared/pipes/i18n.pipe";
interface FlatNode {
    expandable: boolean;
    name: string;
    level: number;
    key:string;
}
class FilteredTreeResult {
    constructor(public treeData: any[], public needsToExpanded: any[] = []) {}
}
  
function filterTreeData(data: any[], value: string): FilteredTreeResult {
    const needsToExpanded = new Set<any>();
    const _filter = (node: any, result: any[]): any[] => {
      if (node.name.search(value) !== -1) {
        result.push(node);
        return result;
      }
      if (Array.isArray(node.children)) {
        const nodes = node.children.reduce((a, b) => _filter(b, a), [] as any[]);
        if (nodes.length) {
          const parentNode = { ...node, children: nodes };
          needsToExpanded.add(parentNode);
          result.push(parentNode);
        }
      }
      return result;
    };
    const treeData = data.reduce((a, b) => _filter(b, a), [] as any[]);
    return new FilteredTreeResult(treeData, [...needsToExpanded]);
}

@Component({
    selector: 'app-hanger-flow',
    templateUrl: './hangerFlow.component.html',
    styleUrls: ['./hangerFlow.component.less'],
    providers: [I18nPipe]
})
export class HangerFlowComponent implements OnInit {
    openLeft: boolean = true;//是否开启左边树区域
    isLeftSpinning: boolean = false;//是否开启左边树加载状态
    leftTreeTitle: string = this.i18nPipe.transform('popupField.work_line');//左边树区域标题
    isAdvancedSearch: boolean = false;//是否开启高级搜索
    isTablePage: boolean = false;//是否开启单独的翻页
    isTableNoCustomize: boolean = false;//是否为非自定义表格 默认开启
    isCheck: boolean = false;//是否开启表格复选 默认开启
    isCheckAll: boolean = false;//是否开启表格全选 默认开启
    isNumber: boolean = false;//是否开启序列 默认开启
    isOperation: boolean = false;//是否开启表格内操作栏 默认关闭

    //查询参数
    queryParams = {
      key:"",//树 key
      date:"",//时间
    };
    dateFormat = 'yyyy-MM-dd';

    /* ******************表格属性******************************** */
    toScroll = {};//自定义表格高宽
    setOfCheckedId = new Set<string>();//表格回传回来的当前已选择的数据key
    tableLoading: boolean = false;
    tableData = [];
    columns: any[] = [];
    total: number = 0;//总条数

    // -----------------以下软满容量配置 弹窗参数-----------------
    zpopupTiele:string = "";//弹窗标题
    isPopup:boolean = false;//是否打开窗口
    isPopupImport:boolean = false;//是否打开导出窗口
    isPopupConfirm:boolean = false;//是否打开删除窗口
    isLoading:boolean = false;//是否打开确定按钮的加载
    validateFormAllLine!: FormGroup;//校验
    validateFormOneLine!: FormGroup;//校验

    isAllLine:boolean = false;//全线窗口开关
    isAllLineSubmit:boolean = false;//全线配置按钮状态开关
    // isOneLine:boolean = false;//站位窗口开关
    isOneLineSubmit:boolean = false;//站位配置按钮状态开关
    isLineDetails:boolean = false;//进轨站位详情开关
    isLineDetailsSubmit:boolean = false;//进轨站位详情状态开关

    lineDownList = [];//生产线下拉
    lineDownLoading:boolean = false;//生产线下拉加载

    lineDetailsList = [];//站位信息列表
    carrierData = [];//载具信息
    isLineDetailsTableLoading:boolean = false;//载具表格 是否加载
    

    //树----------------------------------------
    nodes = [];//季度树 数据
    searchValue = '';//左侧树查询框的参数
    flatNodeMap = new Map<FlatNode, any>();
    nestedNodeMap = new Map<any, FlatNode>();
    expandedNodes: any[] = [];
    originData$ = new BehaviorSubject(this.nodes);
    searchValue$ = new BehaviorSubject<string>('');
    selectListSelection = new SelectionModel<FlatNode>();

    transformer = (node: any, level: number): FlatNode => {
      const existingNode = this.nestedNodeMap.get(node);
      const flatNode =
        existingNode && existingNode.name === node.name
          ? existingNode
          : {
              expandable: !!node.children && node.children.length > 0,
              name: node.name,
              key: node.key,
              level
            };
      this.flatNodeMap.set(flatNode, node);
      this.nestedNodeMap.set(node, flatNode);
      return flatNode;
    };
  
    treeControl = new FlatTreeControl<FlatNode, any>(
      node => node.level,
      node => node.expandable,
      {
        trackBy: flatNode => this.flatNodeMap.get(flatNode)!
      }
    );
  
    treeFlattener = new NzTreeFlattener<any, FlatNode, any>(
      this.transformer,
      node => node.level,
      node => node.expandable,
      node => node.children
    );
  
    dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
    filteredData$ = combineLatest([
      this.originData$,
      this.searchValue$.pipe(
        auditTime(300),
        map(value => (this.searchValue = value))
      )
    ]).pipe(map(([data, value]) => (value ? filterTreeData(data, value) : new FilteredTreeResult(data))));

    hasChild = (_: number, node: FlatNode): boolean => node.expandable;

    @ViewChild('zpage') zpage: ZPageComponent;
    constructor(
        private hangerFlowService:HangerFlowService,
        private fb: FormBuilder,
        private message: NzMessageService,
        private util:UtilService,
        private selectService: SelectService,
        private elementRef: ElementRef,
        private i18nPipe: I18nPipe
    ){

    }

    ngOnInit(): void {
        this.onLineSearch();
        this.columns = this.hangerFlowService.tableColumns();

        //启动单线容量校验
        this.validateFormOneLine = this.fb.group({
            volume: [null, [Validators.required]],//容量
        });
        //启动全线容量校验
        this.validateFormAllLine = this.fb.group({
            line_key: [null, [Validators.required]],//产线key
            volume: [null, [Validators.required]],//容量
        });
    }

    //分配头部按钮的执行方法
    getTopBtn(event){
        switch(event.name){
            // case "allrefresh": this.toAllRefresh();break;
            
            default: break;
        }
    }

    //分配表格按钮的执行方法
    getTableBtn(event){
        switch(event.name){
            // case "refresh": this.toOneRefresh(event.item.station_code);break;
            default: break;
        }
    }

    //获取自定义表格高宽（用于滚动和自适应）
    getTableWidthHeight(scroll){
      this.toScroll = scroll;
    }

    //表格复选选中key的回传函数
    getCheckedId(idList){
      this.setOfCheckedId = idList;
    }

    //排序回调
    getSortList(list){}

    //查询
    oldTableData = [];//记录表格数据
    toSearch(){
        this.tableLoading = true;
        this.hangerFlowService.getList(this.queryParams).then( (res:any) =>{
          this.tableData = res;
          this.zpage.getTableScrollToTop();//表格滚动条回滚到顶部
          this.setOfCheckedId.clear();//清除选中项
          this.tableLoading = false;
        },()=>{}).finally(()=>{
          this.tableLoading = false;
        });
    }

    //时间格式转换
    queryParamsDate = "";
    onDateChange(event){
      let date = new Date(event);
      this.queryParams.date = date.getFullYear() + '-' + (date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1)) + '-' + (date.getDate()>9?date.getDate():'0'+date.getDate());
    }

    //重置
    resetSearch(){
      this.queryParams = {
        key:"",//树 key
        date:"",//时间
      };
      this.tableLoading = false;
      this.tableData = [];
      this.hangerFlowService.getList(this.queryParams).then( (res:any) =>{
        this.tableData = res.data;
        this.tableLoading = false;
      },()=>{});
    }

    //获取生产线树
    onLineSearch(){
        this.isLeftSpinning = true;
        this.hangerFlowService.treeDown({group:'Line'}).then((res:any)=>{
          //用于左边分类树 使用
          let treeData = [];
          for(let item of res){
            treeData.push({name:item.name+"["+item.code+"]",key:item.key});
          }
          this.nodes = treeData;
  
          this.originData$ = new BehaviorSubject(this.nodes);
          this.filteredData$ = combineLatest([
            this.originData$,
            this.searchValue$.pipe(
              auditTime(300),
              map(value => (this.searchValue = value))
            )
          ]).pipe(map(([data, value]) => (value ? filterTreeData(data, value) : new FilteredTreeResult(data))));
  
          this.filteredData$.subscribe(result => {
                this.dataSource.setData(result.treeData);
                
                const hasSearchValue = !!this.searchValue;
                if (hasSearchValue) {
                  if (this.expandedNodes.length === 0) {
                      this.expandedNodes = this.treeControl.expansionModel.selected;
                      this.treeControl.expansionModel.clear();
                  }
                  this.treeControl.expansionModel.select(...result.needsToExpanded);
                } else {
                  if (this.expandedNodes.length) {
                      this.treeControl.expansionModel.clear();
                      this.treeControl.expansionModel.select(...this.expandedNodes);
                      this.expandedNodes = [];
                  }
                }
            });
  
        }).finally(()=>{
          this.isLeftSpinning = false;
        });
    }
  
    //刷新tree
    toReloadTree(){
        this.isLeftSpinning = true;
        this.hangerFlowService.treeDown({group:'Line'}).then((res:any)=>{
          //用于左边软件分类树 使用
          let treeData = [];
          for(let item of res){
            treeData.push({name:item.name+"["+item.code+"]",key:item.key});
          }
          this.nodes = treeData;
  
          this.originData$ = new BehaviorSubject(this.nodes);
          this.filteredData$ = combineLatest([
              this.originData$,
              this.searchValue$.pipe(
                auditTime(300),
                map(value => (this.searchValue = value))
              )
          ]).pipe(map(([data, value]) => (value ? filterTreeData(data, value) : new FilteredTreeResult(data))));
          this.filteredData$.subscribe(result => {
              this.dataSource.setData(result.treeData);
          
              const hasSearchValue = !!this.searchValue;
              if (hasSearchValue) {
                  if (this.expandedNodes.length === 0) {
                      this.expandedNodes = this.treeControl.expansionModel.selected;
                      this.treeControl.expansionModel.clear();
                  }
                  this.treeControl.expansionModel.select(...result.needsToExpanded);
              } else {
                  if (this.expandedNodes.length) {
                      this.treeControl.expansionModel.clear();
                      this.treeControl.expansionModel.select(...this.expandedNodes);
                      this.expandedNodes = [];
                  }
              }
          });
        }).finally(()=>{
            this.isLeftSpinning = false;
        });
        this.treeKey = "";//清空选择key
        this.queryParams.key = "";//工作线 清空
        this.tableData = [];//清空 表格数据
    }
  
    //左边树
    treeKey = "";//记录选中的key
    nzTreeEvent(node) {
        this.selectListSelection.toggle(node);
        if(this.util.isAbnormalValue(node.key)){
          if(node.key != this.treeKey){
            this.treeKey = node.key;
            this.queryParams.key = node.key;
            this.toSearch();
          }else{
            this.treeKey = "";
            this.queryParams.key = "";
            this.tableData = [];//清空 表格数据
          }
        }else{
          this.message.create('warning', this.util.getComm('warning.NoNote'));
        }
    }

    //重置表单内容
    resetForm() {
      // this.validateForm.setValue({code:"",bqi_key:"",psi_key:"",pci_key:""});
      this.validateFormAllLine.clearValidators();
      this.validateFormAllLine.reset();//重置表单校验

      this.validateFormOneLine.clearValidators();
      this.validateFormOneLine.reset();//重置表单校验
    }

    //关闭窗口
    closePopup(){
      this.resetForm();
    }

    //获取当前弹窗内容高度
    popupContHeight = 0;
    contHeight(height){
      this.popupContHeight = height;
    }
}