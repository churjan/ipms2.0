import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { BehaviorSubject, combineLatest, fromEvent } from "rxjs";
import { ZPageComponent } from "~/shared/components/zpage/zpage.component";
import { UtilService } from "~/shared/services/util.service";
import { StationSupervisoryControlService } from "./stationSupervisoryControl.service";
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from "ng-zorro-antd/tree-view";
import { auditTime, map } from "rxjs/operators";
import { SelectService } from "~/shared/services/http/select.service";
import { I18nPipe } from "~/shared/pipes/i18n.pipe";
import { TransferItem, TransferSelectChange } from "ng-zorro-antd/transfer";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { CrudComponent } from "~/shared/common/crud/crud.component";
import { Router } from "@angular/router";
import { EditStructureRuleSchemeComponent } from "../structure-rule-scheme/edit-structure-rule-scheme/edit-structure-rule-scheme.component";
declare var $: any;
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  key: string;
}
class FilteredTreeResult {
  constructor(public treeData: any[], public needsToExpanded: any[] = []) { }
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
  selector: 'app-station-supervisory-control',
  templateUrl: './stationSupervisoryControl.component.html',
  styleUrls: ['./stationSupervisoryControl.component.less'],
  providers: [I18nPipe]
})
export class StationSupervisoryControlComponent extends ListTemplateComponent {
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('edit', { static: false }) _edit: EditStructureRuleSchemeComponent;
  openLeft: boolean = true;//是否开启左边树区域
  isLeftSpinning: boolean = false;//是否开启左边树加载状态
  leftTreeTitle: string = "生产线";//左边树区域标题
  isAdvancedSearch: boolean = false;//是否开启高级搜索
  isTablePage: boolean = false;//是否开启单独的翻页
  isTableNoCustomize: boolean = true;//是否为非自定义表格 默认开启
  isCheck: boolean = false;//是否开启表格复选 默认开启
  isCheckAll: boolean = false;//是否开启表格全选 默认开启
  isNumber: boolean = true;//是否开启序列 默认开启
  isOperation: boolean = true;//是否开启表格内操作栏 默认关闭



  //查询参数
  queryParams = {
    line_key: "",//生产线
  };

  /* ******************表格属性******************************** */
  setOfCheckedId = new Set<string>();//表格回传回来的当前已选择的数据key
  tableLoading: boolean = false;
  tableData = [];
  // columns: any[] = [];
  total: number = 0;//总条数

  // -----------------以下软满容量配置 弹窗参数-----------------
  zpopupTiele: string = "";//弹窗标题
  isPopup: boolean = false;//是否打开窗口
  isPopupImport: boolean = false;//是否打开导出窗口
  isPopupConfirm: boolean = false;//是否打开删除窗口
  isLoading: boolean = false;//是否打开确定按钮的加载
  validateFormAllLine!: FormGroup;//校验
  validateFormOneLine!: FormGroup;//校验
  validateFormSKU!: FormGroup;//校验
  validateFormAllSKU!: FormGroup;//校验
  isAllLine: boolean = false;//全线窗口开关
  isAllLineSubmit: boolean = false;//全线配置按钮状态开关
  // isOneLine:boolean = false;//站位窗口开关
  isOneLineSubmit: boolean = false;//站位配置按钮状态开关
  isLineDetails: boolean = false;//进轨站位详情开关
  isLineDetailsSubmit: boolean = false;//进轨站位详情状态开关

  lineDownList = [];//生产线下拉
  lineDownLoading: boolean = false;//生产线下拉加载

  lineDetailsList = [];//站位信息列表
  carrierData = [];//载具信息
  isLineDetailsTableLoading: boolean = false;//载具表格 是否加载
  isSku: boolean = false;//sku配置开关
  isSkuSubmit: boolean = false;//sku配置状态开关
  isRuleSet: boolean = false;//规则设置开关
  isRuleSetSubmit: boolean = false;//规则设置状态开关
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
  getBody: any = { line_key: '' }
  @ViewChild('zpage') zpage: ZPageComponent;
  constructor(
    private stationSupervisoryControlService: StationSupervisoryControlService,
    private fb: FormBuilder,
    // private message: NzMessageService,
    private util: UtilService,
    private selectService: SelectService,
    private elementRef: ElementRef,
    private i18nPipe: I18nPipe,
    private service: UtilService,
    public router: Router
  ) {
    super();
    this.modularInit("layoutStationSupervisoryControl", router.url);
  }

  ngOnInit(): void {
    this.onLineSearch();
    // this.columns = this.stationSupervisoryControlService.tableColumns();
    //启动单线容量校验
    this.validateFormOneLine = this.fb.group({
      volume: [null, [Validators.required]],//容量
    });
    //启动全线容量校验
    this.validateFormAllLine = this.fb.group({
      line_key: [null, [Validators.required]],//产线key
      volume: [null, [Validators.required]],//容量
    });
    //启动sku配置校验
    this.validateFormSKU = this.fb.group({
      bls_key: [null, [Validators.required]],//产线key
      sku_composition: [null],//sku组合方式
      sku_maximum: [0],//可存最大sku数
      volume: [null, [Validators.required]]
    });
    this.validateFormAllSKU = this.fb.group({
      infeed_keys: [null, [Validators.required]],//产线key
      sku_composition: [null, [Validators.required]],//sku组合方式
      sku_maximum: [null, [Validators.required]],//可存最大sku数
    });
  }
  btnEvent(event) {
    switch (event.action) {
      case "allrefresh": this.toAllRefresh(); break;
      case "allConfig": this.toAllConfig(); break;
      case "allsetsku": this.toAllSetsku(); break;
      case "refresh": this.toOneRefresh(event.node.station_code); break;
      default: break;
    }
  }
  //分配头部按钮的执行方法
  // getTopBtn(event) {
  //   switch (event.name) {
  //     case "allrefresh": this.toAllRefresh(); break;
  //     case "allconfig": this.toAllConfig(); break;
  //     case "allsetsku": this.toAllSetsku(); break;
  //     default: break;
  //   }
  // }

  //分配表格按钮的执行方法
  // getTableBtn(event) {
  //   switch (event.name) {
  //     case "refresh": this.toOneRefresh(event.item.station_code); break;
  //     default: break;
  //   }
  // }

  //表格复选选中key的回传函数
  getCheckedId(idList) {
    this.setOfCheckedId = idList;
  }

  //排序回调
  getSortList(list) { }

  //查询
  oldTableData = [];//记录表格数据
  toSearch() {
    this.tableLoading = true;
    if (this.util.isAbnormalValue(this.getBody.line_key)) {
      this.stationSupervisoryControlService.getList(this.getBody).then((res: any) => {
        // this.tableData = res;
        this._crud.list = res;
        this.oldTableData = this._crud.list;//记录表格数据 用于前端刷新
        // this.oldTableData = this.tableData;
        this.total = res.total;
        this.zpage.getTableScrollToTop();//表格滚动条回滚到顶部
        this.setOfCheckedId.clear();//清除选中项
        this.tableLoading = false;
      }, () => { }).finally(() => {
        this.tableLoading = false;
      });
    } else {
      this.tableLoading = false;
      this.tableData = [];
    }
  }

  //前端查询
  tableSearchValue = "";//前端查询条件
  toTableSearch() {
    let list = [];
    for (let item of this.oldTableData) {
      if (item.station_type_name.indexOf(this.tableSearchValue) != -1) {
        list.push(item);
      }
    }
    this.tableData = list;
  }

  //前端查询重置
  resetSearch() {
    this.tableSearchValue = "";
    this.tableData = this.oldTableData;
  }

  //获取生产线树
  onLineSearch() {
    this.isLeftSpinning = true;
    this.selectService.lineDown().then((res: any) => {
      //用于左边分类树 使用
      let treeData = [];
      for (let item of res) {
        treeData.push({ name: item.line_name + "[" + item.line_code + "]", key: item.line_key });
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

    }).finally(() => {
      this.isLeftSpinning = false;
    });
  }


  //刷新tree
  toReloadTree() {
    this.isLeftSpinning = true;
    this.selectService.lineDown().then((res: any) => {
      //用于左边软件分类树 使用
      let treeData = [];
      for (let item of res) {
        treeData.push({ name: item.line_name + "[" + item.line_code + "]", key: item.line_key });
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
    }).finally(() => {
      this.isLeftSpinning = false;
    });
    this.treeKey = "";//清空选择key
    this.queryParams.line_key = "";//生产线 清空
    this.tableData = [];//清空 表格数据
  }

  //获取生产线下拉数据
  lineDown() {
    this.selectService.lineDown().then((res: any) => {
      this.lineDownList = [];
      for (let item of res) {
        this.lineDownList.push({ name: item.line_name + "[" + item.line_code + "]", key: item.line_key });
      }
    }, () => { }).finally(() => {
      this.lineDownLoading = false;
    });
  }

  //左边树
  treeKey = "";//记录选中的key
  nzTreeEvent(node) {
    this.selectListSelection.toggle(node);
    if (this.util.isAbnormalValue(node.key)) {
      if (node.key != this.treeKey) {
        this.treeKey = node.key;
        this.queryParams.line_key = node.key;
        this.tableSearchValue = "";//前端查询重置查询条件
        this.toSearch();
      } else {
        this.treeKey = "";
        this.queryParams.line_key = "";
        this.tableData = [];//清空 表格数据
        this.tableSearchValue = "";//前端查询重置查询条件
      }
    } else {
      this.message.create('warning', this.util.getComm('warning.NoNote'));
    }
  }
  onclick(node) {
    // if (node) { this._crud.SearchModel.line_key = node.line_key; } else {
    //   this._crud.SearchModel.line_key = '';
    // }
    if (node) {
      this.getBody = Object.assign(this.getBody, { line_key: node.line_key })
      this._crud.Search()
    }
  }
  //按钮-生产线刷新
  toAllRefresh() {
    this.toSearch();
  }

  //表格按钮-单条刷新
  toOneRefresh(station_code) {
    this.tableLoading = true;
    if (this.util.isAbnormalValue(station_code)) {
      this.stationSupervisoryControlService.oneLine({ station_code: station_code }).then((res: any) => {
        let _index = this._crud.list.findIndex(el => el.station_code == station_code);
        let Before = this._crud.list.filter((el, i) => i < _index);
        let after = this._crud.list.filter((el, i) => i > _index);
        let _list = [...Before, res, ...after]
        this._crud.list = _list;
        this.oldTableData = this._crud.list;
        // this._crud.list.forEach((el, index) => {
        //   if (el.station_code == station_code) {
        //     this.oldTableData = this._crud.list;
        //   }
        // });
      }, () => { }).finally(() => {
        this.tableLoading = false;
      });
    } else {
      this.tableLoading = false;
      this.message.create('warning', this.util.getComm('warning.noKey'));
    }
  }

  //按钮-生产线软满容量配置
  toAllConfig() {
    this.lineDown();
    this.zpopupTiele = this.i18nPipe.transform('placard.capacity');//"生产线软满容量配置"
    this.isAllLine = true;
    if (this.util.isAbnormalValue(this.treeKey)) {
      this.validateFormAllLine.patchValue({ line_key: this.treeKey });
    } else {
      this.validateFormAllLine.patchValue({ line_key: "" });
    }
  }

  //窗口-生产线软满容量配置-提交
  onAllLineSubmit() {
    this.isAllLineSubmit = true;
    if (this.validateFormAllLine.valid) {
      this.stationSupervisoryControlService.lineUpdate(this.validateFormAllLine.value).then((res: any) => {
        this.message.success(this.util.getComm('sucess.s_set'));
        this.toSearch();
        this.closePopup();
      }, () => { }).finally(() => {
        this.isAllLineSubmit = false;
      });
    } else {
      Object.values(this.validateFormAllLine.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.isAllLineSubmit = false;
    }
  }
  //待补充数量数据 ---------------------------
  editsup//修改的待补充数量值
  oldsup//记录未修改的值
  //进轨软满（容量）数据 ---------------------------
  editId: string | null = null;
  oldVolume: number = 0;//记录未修改的值
  editVolume: number = 0;//修改的软满的值
  @ViewChild('infeedVolume') infeedVolume: ElementRef;
  startEdit(id: string, volume: number, station_type?): void {
    this.editId = id;
    if (station_type && station_type == 2) {
      this.oldsup = volume;
      this.editsup = volume;
    } else {
      this.oldVolume = volume;//记录未修改的值
      this.editVolume = volume;
    }

    setTimeout(() => {
      this.infeedVolume.nativeElement.focus();
    }, 100);
  }

  //修改进轨软满（容量）回车键
  keyupEnter(stationCode, infeedKey, val, item, station_type?) {
    this.editId = null;//焦点取消 会 触发stopEdit() 
    if (station_type && station_type == 2) {
      this.stopEditsup(stationCode, infeedKey, val, item);
    } else {
      this.stopEdit(stationCode, infeedKey, val, item);
    }
  }

  //修改进轨容量
  stopEdit(stationCode, infeedKey, val, { sku_composition, sku_maximum }): void {
    if (this.util.isAbnormalValue(stationCode) && this.util.isAbnormalValue(infeedKey)) {
      if (this.oldVolume == this.editVolume) {
        this.editId = null;
        return;
      }
      if (val == 0 || val === "0") {
        this.editId = null;
        return;
      }
      let setData = { bls_key: infeedKey, volume: this.editVolume, sku_composition: sku_composition, sku_maximum: sku_maximum };
      this.stationSupervisoryControlService.oneInfeedsUpdate(setData).then((res: any) => {
        //前端修改进轨容量进行显示（由于后端有延迟，只要接口连通，就直接前端修改值，进行显示）
        this.tableData.forEach((el, index) => {
          if (el.station_code == stationCode) {
            let data = el;
            for (let i = 0; i < data.infeeds.length; i++) {
              if (data.infeeds[i].infeed_key == infeedKey) {
                data.infeeds[i].volume = this.editVolume;
              }
            }
            this.tableData[index] = data;
          }
        });

        this.message.success(this.util.getComm('sucess.s_set'));
        this.toOneRefresh(stationCode)
        this.editId = null;
      }, () => { }).finally(() => {
        this.isOneLineSubmit = false;
      });
    } else {
      this.message.warning(this.util.getComm('warning.noKey'));
    }
  }
  //修改待补充数量
  stopEditsup(stationCode, infeedKey, val, item): void {
    if (this.util.isAbnormalValue(stationCode) && this.util.isAbnormalValue(infeedKey)) {
      if (this.oldsup == this.editsup) {
        this.editId = null;
        return;
      }
      // if (val == 0 || val === "0") {
      //   this.editId = null;
      //   return;
      // }
      let setData = { Infeed_Code: infeedKey, volume: this.editsup };
      this.service.saveModel('admin/layoutstructure/volume/infeeds/supplementqty/', 'post', setData, (s) => {
        //前端修改进轨容量进行显示（由于后端有延迟，只要接口连通，就直接前端修改值，进行显示）
        this.tableData.forEach((el, index) => {
          if (el.station_code == stationCode) {
            let data = el;
            for (let i = 0; i < data.infeeds.length; i++) {
              if (data.infeeds[i].infeed_code == infeedKey) {
                data.infeeds[i].supplementqty = this.editsup;
              }
            }
            this.tableData[index] = data;
          }
        });
        this.message.success(this.util.getComm('sucess.s_set'));
        this.editId = null;
      }, (err) => {
        this.message.warning(this.util.getComm('warning.noKey'));
      })
    }
  }
  //站位详情
  infeedCode = "";//进轨code
  stationCode = "";//用于单条刷新
  toInfeedDetails(infeed_code, station_code) {
    this.stationCode = "";//重置
    if (this.util.isAbnormalValue(station_code)) {
      this.stationCode = station_code;
    }
    if (this.util.isAbnormalValue(infeed_code)) {
      this.infeedCode = infeed_code;
      this.zpopupTiele = this.i18nPipe.transform('placard.detailInfo');
      this.isLineDetails = true;
      this.isLineDetailsSubmit = true;
      //调整载具表格高度

      //进轨信息
      this.stationSupervisoryControlService.infeedInfo({ infeed_code: infeed_code }).then((res: any) => {
        this.lineDetailsList = res;
      }, () => { }).finally(() => {
        this.isLineDetailsSubmit = false;
      });
      //载具列表
      this.isLineDetailsTableLoading = true;
      this.stationSupervisoryControlService.carriersList({ infeed_code: infeed_code }).then((res: any) => {
        this.carrierData = res;
      }, () => { }).finally(() => {
        this.isLineDetailsTableLoading = false;
      });
    } else {
      this.message.create('warning', this.util.getComm('warning.noKey'));
    }
  }
  //sku配置
  setSku(data) {
    this.zpopupTiele = this.i18nPipe.transform('placard.setsku') + '(' + data.infeed_code + ')';//"sku配置"
    this.isSku = true;
    if (this.util.isAbnormalValue(data.sku_composition) || this.util.isAbnormalValue(data.sku_maximum)) {
      this.validateFormSKU.patchValue({ bls_key: data.infeed_key, volume: data.volume, sku_composition: data.sku_composition, sku_maximum: data.sku_maximum });
    } else {
      this.validateFormSKU.patchValue({ bls_key: data.infeed_key, volume: data.volume, sku_maximum: 0 });
    }
  }
  //窗口保存
  skuSubmit() {
    this.isSkuSubmit = true;
    if (this.validateFormSKU.valid) {
      const { bls_key, sku_composition, sku_maximum, volume } = this.validateFormSKU.value
      let valueModel = {
        bls_key: bls_key,
        volume: volume,
        sku_composition: sku_composition || '',
        sku_maximum: sku_maximum || 0
      }
      this.stationSupervisoryControlService.oneInfeedsUpdate(valueModel).then((res: any) => {
        this.message.success(this.util.getComm('sucess.s_set'));
        this.toSearch();
        this.closePopup();
      }, () => { }).finally(() => {
        this.isSkuSubmit = false;
      });
    } else {
      Object.values(this.validateFormSKU.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.isSkuSubmit = false;
    }
  }
  isallSku: boolean = false;
  isallSkuSubmit: boolean = false;
  stationlist: TransferItem[] = [];
  selecttitle = "";
  seachbls: string = '';
  //按钮-sku批量配置
  toAllSetsku() {
    this.zpopupTiele = this.i18nPipe.transform('placard.setsku');//"sku配置"
    this.isallSku = true;
  }
  $asTransferItems = (data: unknown): TransferItem[] => data as TransferItem[];
  //进轨获取
  clickItem(data) {
    this.selecttitle = data.code + '[' + data.name + ']'
    let body = Object.assign({}, { keywords: this.seachbls, Line_Key: data.key, blst_group: 'In', ModuleType: '105' });
    this.service.comList('LayoutStructure/extend', body, 'NewGetList').then((r) => {
      this.stationlist = this.stationlist.filter(b => b.direction == 'right');
      let blslist = r;
      let _blslist = new Array();
      blslist.forEach(bv => {
        bv.title = bv.code + '[' + bv.name + ']'
        bv.direction = 'left';
        let i = this.stationlist.findIndex(b => b.direction == 'right' && b.bls_key == bv.key);
        if (i < 0) {
          _blslist.push(bv);
        }
      });
      this.stationlist = this.stationlist.concat(_blslist);
    })
  }
  //选择
  Select(data, ev, items, onItemSelect) {
    if (ev.shiftKey == true) {
      let min = this._getMin(items);
      if (min || min == 0) {
        let num = items.findIndex(i => i.key == data.key);
        items.forEach((sv, n) => {
          if ((n > min && n < num) || (n > num && n < min)) {
            onItemSelect(sv);
          }
          if (n == num) {
            onItemSelect(sv);
          }
        });
      }
    } else {
      onItemSelect(data);
    }
  }
  _getMin(items) {
    let temp = [];
    items.find((sv, i) => {
      if (sv.checked === true) { temp.push(i); }
    });
    return (temp && temp.length > 0) ? Math.max(...temp) : null;
  }
  change(event) {
    const listKeys = event.list.map(l => l.key);
    const hasOwnKey = (e: TransferItem): boolean => e.hasOwnProperty('key');
    this.stationlist = this.stationlist.map(e => {
      if (listKeys.includes(e.key) && hasOwnKey(e)) {
        if (event.to === 'left') {
          delete e.hide;
        } else if (event.to === 'right') {
          e.hide = false;
        }
      }
      return e;
    });
  }
  //sku批量窗口保存
  allskuSubmit() {
    this.isallSkuSubmit = true;
    let valueModel = new Array();
    let list = this.stationlist.filter(s => s.direction == 'right');
    list.forEach(ls => {
      valueModel.push(ls.key)
    });
    this.validateFormAllSKU.patchValue({ infeed_keys: valueModel })
    if (this.validateFormAllSKU.valid) {
      this.service.saveModel('admin/layoutstructure/volume/infeeds/sku', 'post', this.validateFormAllSKU.value, (res: any) => {
        this.message.success(this.util.getComm('sucess.s_set'));
        this.toSearch();
        this.closePopup();
      }, () => {
        this.isallSkuSubmit = false;
      })
    } else {
      Object.values(this.validateFormAllSKU.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.isallSkuSubmit = false;
    }

  }
  RuleScheme = new Array();
  RuleSet = new Array();
  searchInfeed: any;//进轨code
  SearchScheme: string = '';//方案查询
  SearchSetScheme: string = '';//绑定方案查询
  //规则设置
  ruleSet(data) {
    this.zpopupTiele = this.i18nPipe.transform('placard.ruleSetting') + '(' + data.infeed_code + ')';//"规则设置"
    this.isRuleSet = true;
    this.searchInfeed = data;
    this.getRuleScheme();
    this.getScheme()
  }
  //获取绑定方案数据
  getScheme(body: any = {}) {
    body = Object.assign({}, body, { bls_key: this.searchInfeed.infeed_key })
    this._service.comList('LayoutStructureScheme', body, 'getlist').then((list) => {
      this.RuleSet = list;
    });
  }
  //获取方案数据
  getRuleScheme(body: any = {}) {
    this._service.comList('LayoutStructureSchemeRules', body, 'getlist').then((list) => {
      this.RuleScheme = list;
    })
  }
  //设置规则方案
  setScheme({ key, name, code }) {
    this._service.comPost('admin/LayoutStructureScheme', {
      bls_key: this.searchInfeed.infeed_key,
      blsr_code: code,
      blsr_key: key,
      blsr_name: name,
      display: true
    }).then((sucess) => {
      this.message.success(this.util.getComm('sucess.s_set'));
      this.getScheme()
    })
  }
  //查询方案
  searchScheme(ev?) {
    if (this.SearchSetScheme) {
      this.RuleSet = this.RuleSet.filter(
        (item) =>
          item.blsr_code.includes(this.SearchSetScheme) ||
          item.blsr_name.includes(this.SearchSetScheme)
      );
    } else {
      this.RuleSet = this.RuleSet;
    }
  }
  //添加新方案
  addScheme() {
    this._edit.open({ title: "plus" })
  }
  //修改方案
  updataScheme(data) {
    this._edit.open({ title: "update", node: data })
  }
  //取消方案设置
  delScheme(data) {
    this._service.deleteModel('admin/LayoutStructureScheme/', [{ key: data.key }], (success) => {
      this.message.success(this.util.getComm('sucess.s_Cancel'));
      this.getScheme()
    })
  }
  //刷新站位详情
  toInfeedDetailsRefresh() {
    if (this.util.isAbnormalValue(this.infeedCode)) {
      this.isLineDetailsSubmit = true;
      //进轨信息
      this.stationSupervisoryControlService.infeedInfo({ infeed_code: this.infeedCode }).then((res: any) => {
        this.lineDetailsList = res;
      }, () => { }).finally(() => {
        this.isLineDetailsSubmit = false;
      });
      //载具列表
      this.isLineDetailsTableLoading = true;
      this.stationSupervisoryControlService.carriersList({ infeed_code: this.infeedCode }).then((res: any) => {
        this.carrierData = res;
      }, () => { }).finally(() => {
        this.isLineDetailsTableLoading = false;
      });
    } else {
      this.message.create('warning', this.util.getComm('warning.noKey'));
    }
  }
  //跳转到衣架查询页面
  toTagcode(tagcode) {
    window.open('#/hanger/' + tagcode);
  }

  //标记载具异常
  carrierAbnormal(carrier_code, infeed_code) {
    if (this.util.isAbnormalValue(carrier_code) && this.util.isAbnormalValue(infeed_code)) {
      this.stationSupervisoryControlService.carrierAbnormal({ carrier_code: carrier_code, infeed_code: infeed_code }).then((res1: any) => {
        this.toInfeedDetailsRefresh();
        this.message.success(this.util.getComm('sucess.s_remove'));

        //同时刷新该条数据
        this.toOneRefresh(this.stationCode);
      }, () => { });
    } else {
      this.message.create('warning', this.util.getComm('warning.noKey'));
    }
  }

  //重置表单内容
  resetForm() {
    // this.validateForm.setValue({code:"",bqi_key:"",psi_key:"",pci_key:""});
    this.validateFormAllLine.clearValidators();
    this.validateFormAllLine.reset();//重置表单校验

    this.validateFormOneLine.clearValidators();
    this.validateFormOneLine.reset();//重置表单校验

    this.validateFormSKU.clearValidators();
    this.validateFormSKU.reset();//重置表单校验

    this.validateFormAllSKU.clearValidators();
    this.validateFormAllSKU.reset();
  }

  //关闭窗口
  closePopup() {
    this.zpopupTiele = "";
    this.isAllLine = false;
    this.isAllLineSubmit = false;

    // this.stationCode = "";//当前选中的站位code
    // this.infeedKey = "";//当前选中的进轨key
    // this.isOneLine = false;
    this.isOneLineSubmit = false;

    this.isLineDetails = false;
    this.isLineDetailsSubmit = false;

    this.infeedCode = "";
    this.isLineDetailsTableLoading = false;

    this.isSku = false;
    this.isSkuSubmit = false;

    this.isallSku = false;
    this.isallSkuSubmit = false;
    this.stationlist = new Array();

    this.isRuleSet = false;
    this.isRuleSetSubmit = false;
    this.RuleSet = new Array();
    this.SearchScheme = '';//方案查询
    this.SearchSetScheme = '';//绑定方案查询
    this.resetForm();
  }

  //获取当前弹窗内容高度
  popupContHeight = 0;
  contHeight(height) {
    this.popupContHeight = height;
  }
}