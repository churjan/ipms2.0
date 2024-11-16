import { environment } from "@/environments/environment";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ControlContainer, ControlValueAccessor, FormBuilder, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzFormatEmitEvent } from "ng-zorro-antd/tree";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { BehaviorSubject, combineLatest,Observable, Observer } from "rxjs";
import { ZPageComponent } from "~/shared/components/zpage/zpage.component";
import { AppConfig } from "~/shared/services/AppConfig.service";
import { SelectService } from "~/shared/services/http/select.service";
import { UtilService } from "~/shared/services/util.service";
import { SelectionModel } from '@angular/cdk/collections';
import { SizeService } from "./size.service";
import { FlatTreeControl } from '@angular/cdk/tree';
import { auditTime, map } from 'rxjs/operators';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
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
    selector: 'app-size',
    templateUrl: './size.component.html',
    styleUrls: ['./size.component.less'],
    providers: [I18nPipe]
})
export class SizeComponent implements OnInit {
    openLeft:boolean = false;//是否开启左边树区域
    isLeftSpinning:boolean = false;//是否开启左边树加载状态
    leftTreeTitle:string = this.i18nPipe.transform('size.group');//左边树区域标题
    isAdvancedSearch:boolean = false;//是否开启高级搜索
    isTablePage:boolean = true;//是否开启单独的翻页
    isCheck: boolean = true;//是否开启表格复选 默认开启
    isCheckAll: boolean = true;//是否开启表格全选 默认开启
    isNumber: boolean = true;//是否开启序列 默认开启
    isOperation: boolean = true;//是否开启表格内操作栏 默认关闭
    
    //查询参数
    queryParams = {
        keywords:"",//关键词
        group:"",//分类
        sort:"",//以哪个字段进行排序
        dortDirections:"",//排序方式 支持的排序方式，取值为 'asc', 'desc', null
        page: 1,//当前第几页
        pageSize: 20,//每页显示条数
    };

    /* ******************表格属性******************************** */
    setOfCheckedId = new Set<string>();//表格回传回来的当前已选择的数据key
    tableLoading:boolean = false;
    tableData = [];
    columns: any[] = [];
    total:number = 0;//总条数

    // -----------------以下 弹窗参数-----------------
    isPopup:boolean = false;//是否打开窗口
    isPopupImport:boolean = false;//是否打开导出窗口
    isPopupConfirm:boolean = false;//是否打开删除窗口
    isLoading:boolean = false;//是否打开确定按钮的加载
    validateForm!: FormGroup;//校验
    popupType:string = "";//类型 add新增 update修改 del删除
    zpopupTiele:string = "";//弹窗标题
    delDataNum:number = 0;//删除条数

    fileList: NzUploadFile[] = [];

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
      private sizeService:SizeService,
      private fb: FormBuilder,
      private message: NzMessageService,
      private util:UtilService,
      private selectService: SelectService,
      private i18nPipe: I18nPipe){

    }

    //分配头部按钮的执行方法
    getTopBtn(event){
      switch(event.name){
        case "add": this.toAdd();break;
        case "del": this.toDel(true,null);break;
        case "imp": this.toImport();break;
        case "exp": this.toExport();break;
        default: break;
      }
    }
    //分配表格按钮的执行方法
    getTableBtn(event){
      switch(event.name){
        case "update":this.toUpdate(event.item);break;
        case "del": this.toDel(false,event.item);break;
        case "see": this.toSee(event.item);break;
        default: break;
      }
    }

    ngOnInit(): void {
        // this.leftTreeTitle = "工作站";
        this.onTypeSearch();
        this.columns = this.sizeService.tableColumns();
        // this.tableData = [
        //   {key:'12',code:'D570',name:'D570',customcode:'01',description:''},
        //   {key:'24545',code:'Y7',name:'Y7',customcode:'02',description:''},
        // ];

        //启动新增校验
        this.validateForm = this.fb.group({
          code: [null, [Validators.required]],//新增编号
          name: [null, [Validators.required]],//新增名称
          group: [null],//分类
          customcode: [null],//新增自定义编号
          sort:[null],//排序
          description: [null],//新增描述
        });

        this.toSearch(1);
    }

    //查询
    toSearch(type:number=1){
      if(type==1){
        //需要把页码改为1的
        this.queryParams.page = 1;
      }
      this.tableLoading = true;
      this.sizeService.getList(this.queryParams).then( (res:any) =>{
        this.tableData = res.data;
        this.total = res.total;
        this.zpage.getTableScrollToTop();//表格滚动条回滚到顶部
        this.setOfCheckedId.clear();//清除选中项
        this.tableLoading = false;
      },()=>{}).finally(()=>{
          this.tableLoading = false;
      });
    }

    //获取分类
    onTypeSearch(){
      this.isLeftSpinning = true;
      this.selectService.sizeType().then((res:any)=>{
        //用于左边分类树 使用
        let treeData = [];
        for(let item of res){
          treeData.push({name:item,key:item});
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
      this.selectService.sizeType().then((res:any)=>{
        //用于左边软件分类树 使用
        let treeData = [];
        for(let item of res){
          treeData.push({name:item,key:item});
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
      this.queryParams.group = "";
      this.queryParams.page = 1;
      this.queryParams.pageSize = 20;
      this.toSearch(1);
    }

    //左边树
    treeKey = "";//记录选中的key
    nzTreeEvent(node) {
      this.selectListSelection.toggle(node);
      
      if(this.util.isAbnormalValue(node.key)){
        if(node.key != this.treeKey){
          this.treeKey = node.key;
          this.queryParams.group = node.key;
        }else{
          this.queryParams.group = "";
        }
        this.toSearch(1)
      }else{
        this.message.create('warning', this.util.getComm('warning.NoNote'));
      }
    }

    //页码改变的回调
    pageIndexChange(number){
      this.queryParams.page = number;
      this.toSearch(2);
    }

    //每页条数改变的回调
    pageSizeChange(number){
      this.queryParams.pageSize = number;
      this.toSearch(1);
    }

    //表格复选选中key的回传函数
    getCheckedId(idList){
      this.setOfCheckedId = idList;
    }

    //排序回调
    getSortList(list){}

    //重置查询内容
    resetSearch(){
      this.queryParams = {
          keywords:"",//关键词
          group:"",//分类
          sort:"",//以哪个字段进行排序
          dortDirections:"",//排序方式 支持的排序方式，取值为 'asc', 'desc', null
          page: 1,//当前第几页
          pageSize: 20,//每页显示条数
      };
      this.toSearch(1);
    }

    //重置表单内容
    resetForm(){
      this.validateForm.setValue({code:"",name:"",group:"",customcode:"",sort:"",description:""});
      this.validateForm.reset();//重置表单校验
    }

    //按钮-新增
    toAdd(){
      this.zpopupTiele = this.i18nPipe.transform('btn.add');
      this.popupType = "add";
      this.isPopup = true;
    }

    //按钮-查看
    toSee(item){
      this.zpopupTiele = this.i18nPipe.transform('btn.see');
      this.popupType = "see";
      this.isLoading = true;
      this.isPopup = true;

      if(item.key!=null && item.key!=""){
        this.sizeService.see(item.key).then( (res:any) =>{
          this.validateForm.setValue(
            {
              code:res.code,
              name:res.name,
              group:res.group,
              customcode:res.customcode,
              sort:res.sort,
              description:res.description
            }
          );
          this.isLoading = false;
        },()=>{});
      }
    }

    //按钮-修改
    updateKey = "";//修改的记录id
    toUpdate(item){
      this.zpopupTiele = this.i18nPipe.transform('btn.update');
      this.popupType = "update";
      this.isLoading = true;
      this.isPopup = true;
      if(item.key!=null && item.key!=""){
        this.sizeService.see(item.key).then( (res:any) =>{
          this.updateKey = res.key;
          this.validateForm.setValue(
            {
              code:res.code || '',
              name:res.name || '',
              group:res.group || '',
              customcode:res.customcode || '',
              sort:res.sort || '',
              description:res.description || ''
            }
          );
        },()=>{}).finally(()=>{
          this.isLoading = false;
        });
      }
      
    }

    //按钮-导入
    toImport(){
      this.zpopupTiele = this.i18nPipe.transform('btn.import');
      this.isPopupImport = true;
    }

    //导入方法
    isUpload:boolean = false;
    importChange({ file, fileList }: NzUploadChangeParam): void {
      //处理显示列表
      let fileListNew = [...fileList];
      fileListNew = fileListNew.slice(-2);
      fileListNew = fileListNew.map(file => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      this.fileList = fileListNew;
      //------------下面处理接口
      const status = file.status;
      const name = file.name;

      if (status === 'uploading') {
        this.isUpload = true;
      }
      if (status !== 'uploading') {
        this.isUpload = false;
      }
      if (status === 'done') {
        if(file.response.code==0){
          this.message.success(`${file.name} ` + (file.response.message || this.util.getComm('sucess.s_imp')));
        }else{
          this.fileList.pop();
          this.message.warning(`${file.name} ` + (file.response.message || ''));
        }
        this.isUpload = false;
      } else if (status === 'error') {
        this.fileList.pop();//删除最后一个元素
        this.message.error(`${file.name} `+ this.util.getComm('fail.f_uploader'));
        this.isUpload = false;
      }
    }

    //导入抬头添加token
    uploadingHeader(){
      const token =sessionStorage.ticket ;
      return {
          token: token,
          language: localStorage.language
      }
    }

    //导入文件条件
    beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      let lastName = this.util.getFileLast(file.name);
      const isExcel = lastName === 'xls' || lastName === 'xlsx';
      if (!isExcel) {
        this.message.warning(this.util.getComm('warning.excel'));
        observer.complete();
        return;
      }
      // const isLt2M = file.size! / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //   this.message.warning(this.util.getComm('warning.imageSize'));
      //   observer.complete();
      //   return;
      // }
      // observer.next(isJpgOrPng && isLt2M);
      observer.next(isExcel);
      observer.complete();
    });

    //按钮-导出
    toExport(){
      this.sizeService.export("sizeExport.xls",{keywords:this.queryParams.keywords})
    }

    //确认
    submit(){
      this.isLoading = true;
      //新增
      if(this.popupType=='add'){
        if (this.validateForm.valid) {
          this.sizeService.add(this.validateForm.value).then( (res:any) =>{
            this.message.success(this.util.getComm('sucess.s_add'));
            this.resetSearch();
            this.closePopup();
          },()=>{}).finally(()=>{
            this.isLoading = false;
          });
        } else {
          Object.values(this.validateForm.controls).forEach(control => {
            if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
            }
          });
          this.isLoading = false;
        }
      }
      //修改
      if(this.popupType=='update'){
        if (this.validateForm.valid) {
          let key = this.updateKey;
          let setData = {key,...this.validateForm.value};
          this.sizeService.update(setData).then( (res:any) =>{
            this.message.success(this.util.getComm('sucess.s_update'));
            this.toSearch(2);
            this.closePopup();
          },()=>{}).finally(()=>{
            this.isLoading = false;
          });
        } else {
          Object.values(this.validateForm.controls).forEach(control => {
            if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
            }
          });
          this.isLoading = false;
        }
      }
      //删除
      if(this.popupType=='del'){
        if(this.delType){
          if(this.setOfCheckedId.size>0){
            let keyList = [];
            for(let key of this.setOfCheckedId){
              keyList.push({key:key});
            }
            this.sizeService.del(keyList).then( (res:any) =>{
              this.message.success(this.util.getComm('sucess.s_delete'));
              this.closePopup();
              this.resetSearch();
            },()=>{}).finally(() => {
              this.closePopup();
            });
          }else{
            this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
          }
        }else{
          this.sizeService.del(this.oneDel).then( (res:any) =>{
            this.message.success(this.util.getComm('sucess.s_delete'));
            this.closePopup();
            this.resetSearch();
          },()=>{}).finally(() => {
            this.closePopup();
          });
        }
      }
    }

    //按钮-删除 type为true 为头部按钮删除，否则为单条删除 item单条内容
    delType:boolean = false;
    oneDel = [];
    toDel(type,item){
      this.popupType = "del";
      this.delType = type;
      if(type){
        if(this.setOfCheckedId.size>0){
          this.delDataNum = this.setOfCheckedId.size;
          this.isPopupConfirm = true;
        }else{
          this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
        }
      }else{
        if(item.key!=null && item.key!=""){
          this.delDataNum = 1;
          this.oneDel = [{key:item.key}];
          this.isPopupConfirm = true;
        }
      }
    }

    //下载模版
    toExcelModel(){
      this.sizeService.downloadModel();
    }

    //上传
    upExcel(){
      return this.sizeService.upExcel();
    }

    //关闭
    closePopup(){
      this.isPopup = false;
      this.isPopupConfirm = false;
      this.isPopupImport = false;
      this.isLoading = false;
      this.updateKey = "";//清空修改的key
      this.resetForm();
    }
}