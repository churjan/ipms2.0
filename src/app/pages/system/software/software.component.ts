import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CrudComponent } from '~/shared/components/crud/crud.component';
import { AppService } from '~/shared/services/app.service';
import { SoftwareService } from '~/pages/system/software/software.service';
import { SoftwareCategoryService } from '~/shared/services/http/softwareCategory.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZPageComponent } from '~/shared/components/zpage/zpage.component';
import { SelectService } from '~/shared/services/http/select.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilService } from '~/shared/services/util.service';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { environment } from '@/environments/environment';
import { I18nPipe } from '~/shared/pipes/i18n.pipe';



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
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.less'],
  providers: [I18nPipe]
})
export class SoftwareComponent implements OnInit {
  openLeft: boolean = true;//是否开启左边树区域
  isLeftSpinning: boolean = false;//是否开启左边树加载状态
  leftTreeTitle: string = "软件分类";//左边树区域标题
  isAdvancedSearch: boolean = false;//是否开启高级搜索
  isTablePage: boolean = true;//是否开启单独的翻页
  isCheck: boolean = true;//是否开启表格复选 默认开启
  isCheckAll: boolean = true;//是否开启表格全选 默认开启
  isNumber: boolean = true;//是否开启序列 默认开启
  isOperation: boolean = true;//是否开启表格内操作栏 默认关闭

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

  //查询参数
  queryParams = {
    keywords: "",//关键字
    ssc_key: "",//软件分类key
    sort: "",//以哪个字段进行排序
    dortDirections: "",//排序方式 支持的排序方式，取值为 'asc', 'desc', null
    page: 1,//当前第几页
    pageSize: 20,//每页显示条数
  };

  /* ******************表格属性******************************** */
  setOfCheckedId = new Set<string>();//表格回传回来的当前已选择的数据key
  tableLoading: boolean = false;
  tableData = [];
  columns: any[] = [];
  total: number = 0;//总条数

  //-------------以下 树弹窗参数 -------------------
  treeValidateForm!: FormGroup;//校验

  // -----------------以下 弹窗参数-----------------
  isPopup: boolean = false;//是否打开窗口
  isTreePopup: boolean = false;//是否打开树窗口
  isPopupConfirm: boolean = false;//是否打开删除窗口
  isLoading: boolean = false;//是否打开确定按钮的加载
  isTreeLoading: boolean = false;//是否打开树窗口
  validateForm!: FormGroup;//校验
  sscLoading: boolean = false;//是否打开软件分类加载
  popupType: string = "";//类型 add新增 update修改 del删除
  zpopupTiele: string = "";//弹窗标题
  zpopupTreeTiele: string = "";//树弹窗标题
  popupTreeType: string = "";//树弹窗类型 add新增 update修改 del删除
  delDataNum: number = 0;//删除条数

  softTypeList: any[] = [];//软件分类数据
  softTypeLoading: boolean = false;//远程获取季度数据时的加载

  upFileUrl: string = this.softwareService.getUpFileUrl();//上传API的地址
  fileList: NzUploadFile[] = [];

  handleFileChange(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    // fileList = fileList.slice(-2);
    if (fileList.length > 0) {
      this.validateForm.patchValue({ bfi_key: this.util.isAbnormalValue(fileList[fileList.length - 1].response) ? (fileList[fileList.length - 1].response[0].data != null ? fileList[fileList.length - 1].response[0].data.key : '') : '' });
      this.fileList = [fileList[fileList.length - 1]];//每次都保存最后一次的数据
    }
    // fileList = fileList.map(file => {
    //   if (file.response) {
    //       file.url = file.response[file.response.length-1].data.path;
    //       this.validateForm.patchValue({bfi_key:file.response[file.response.length-1].data.key});
    //   }
    //   return file;
    // });
    // this.fileList = fileList;
  }

  @ViewChild('zpage') zpage: ZPageComponent;
  constructor(
    private softwareService: SoftwareService,
    private selectService: SelectService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private util: UtilService, private i18nPipe: I18nPipe
  ) {

  }
  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  ngOnInit(): void {
    //获取左边树 软件分类数据
    this.onQuarterSearch();

    this.toSearch(1);

    //启动校验
    this.treeValidateForm = this.fb.group({
      code: [null, [Validators.required]],//编号
      name: [null, [Validators.required]],//名称
      sort: [null],//排序
    });

    //启动校验
    this.validateForm = this.fb.group({
      ssc_key: [null, [Validators.required]],//软件分类key
      vercode: [null, [Validators.required]],//版本号
      bfi_key: [null, [Validators.required]],//文件
      sort: [null, [Validators.required]],//排序
      info: [null]//更新内容
    });
  }

  //分配头部按钮的执行方法
  getTopBtn(event) {
    switch (event.name) {
      case "add": this.toAdd(); break;
      case "del": this.toDel(true, null); break;
      default: break;
    }
  }
  //分配表格按钮的执行方法
  getTableBtn(event) {
    switch (event.name) {
      case "see": this.toSee(event.item); break;
      case "del": this.toDel(false, event.item); break;
      default: break;
    }
  }

  //重置表单内容
  resetForm() {
    this.treeValidateForm.setValue({ code: "", name: "", sort: "" });
    this.treeValidateForm.clearValidators();
    this.treeValidateForm.reset();//重置树表单校验
    this.validateForm.setValue({ ssc_key: "", vercode: "", bfi_key: "", sort: "", info: "" });
    this.validateForm.clearValidators();
    this.validateForm.reset();//重置表单校验
  }

  //页码改变的回调
  pageIndexChange(number) {
    this.queryParams.page = number;
    this.toSearch(2);
  }

  //每页条数改变的回调
  pageSizeChange(number) {
    this.queryParams.pageSize = number;
    this.toSearch(1);
  }

  //表格复选选中key的回传函数
  getCheckedId(idList) {
    this.setOfCheckedId = idList;
  }

  //排序回调
  getSortList(list) { }

  //查询
  toSearch(type: number = 1) {
    if (type == 1) {
      //需要把页码改为1的
      this.queryParams.page = 1;
    }
    this.tableLoading = true;
    this.softwareService.getList(this.queryParams).then((res: any) => {
      //动态获取表头
      this.columns = this.softwareService.tableColumns();
      this.tableData = res.data;
      this.total = res.total;
      this.zpage.getTableScrollToTop();//表格滚动条回滚到顶部
      this.setOfCheckedId.clear();//清除选中项
      this.tableLoading = false;
    }, () => { }).finally(() => {
      this.tableLoading = false;
    });
  }

  //重置查询内容
  resetSearch(type) {
    if (type == 1) {
      this.queryParams.keywords = "";
      this.queryParams.sort = "";
      this.queryParams.dortDirections = "";
      this.queryParams.page = 1;
      this.queryParams.pageSize = 20;
    }
    if (type == 2) {
      this.queryParams.sort = "";
      this.queryParams.dortDirections = "";
      this.queryParams.page = 1;
      this.queryParams.pageSize = 20;
    }
    this.toSearch(1);
  }

  //左边树 软件分类选择
  treeKey = "";//记录选中的key
  nzTreeEvent(node) {
    this.selectListSelection.toggle(node);

    if (this.util.isAbnormalValue(node.key)) {
      if (node.key != this.treeKey) {
        this.treeKey = node.key;
        this.queryParams.ssc_key = node.key;
      } else {
        this.queryParams.ssc_key = "";
      }
      this.toSearch(1)
    } else {
      this.message.create('warning', this.util.getComm('warning.NoNote'));
    }
  }

  //刷新软件分类数据
  toReloadTree() {
    this.isLeftSpinning = true;
    this.selectService.softwareType().then((res: any) => {
      //用于左边软件分类树 使用
      let treeData = [];
      for (let item of res) {
        treeData.push({ name: item.name, key: item.key });
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

      //用于季度下拉 使用
      this.softTypeList = res;
    }).finally(() => {
      this.isLeftSpinning = false;
    });
    this.treeKey = "";//清空选择key
    this.queryParams.page = 1;
    this.queryParams.pageSize = 20;
    this.toSearch(1);
  }

  //添加软件分类
  toAddTree() {
    this.zpopupTreeTiele = this.i18nPipe.transform('btn.plus');
    this.isTreePopup = true;
    this.popupTreeType = "add";
  }

  //修改软件分类
  updateTreeKey = "";
  toUpdateTree(item) {
    this.zpopupTreeTiele = this.i18nPipe.transform('btn.update');
    this.isTreePopup = true;
    this.popupTreeType = "update";
    this.isTreeLoading = true;
    if (this.util.isAbnormalValue(item.key)) {
      this.updateTreeKey = item.key;
      this.softwareService.treeSee(this.updateTreeKey).then((res: any) => {
        this.isTreeLoading = false;
        this.treeValidateForm.setValue(
          {
            code: res.code || '',
            name: res.name || '',
            sort: res.sort
          }
        );
      }, () => { }).finally(() => {
        this.isTreeLoading = false;
      });
    } else {
      this.message.create('warning', this.util.getComm('warning.NoNote'));
    }
  }

  //按钮-新增
  toAdd() {
    this.zpopupTiele = this.i18nPipe.transform('btn.plus');
    this.popupType = "add";
    this.isPopup = true;
    this.validateForm.patchValue({ ssc_key: this.treeKey });
  }

  //按钮-删除
  delType: boolean = false;
  oneDel = [];
  toDel(type, item) {
    this.popupType = "del";
    this.delType = type;
    if (type) {
      if (this.setOfCheckedId.size > 0) {
        this.delDataNum = this.setOfCheckedId.size;
        this.isPopupConfirm = true;
      } else {
        this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
      }
    } else {
      if (item.key != null && item.key != "") {
        this.delDataNum = 1;
        this.oneDel = [{ key: item.key }];
        this.isPopupConfirm = true;
      }
    }
  }

  //按钮-查看
  toSee(item) {
    this.zpopupTiele =  this.i18nPipe.transform('btn.see');
    this.popupType = "see";
    this.isLoading = true;
    this.isPopup = true;
    this.selectService.softwareType().then((res: any) => {
      this.softTypeList = res;
    })

    if (item.key != null && item.key != "") {
      this.softwareService.see(item.key).then((res: any) => {
        this.validateForm.setValue(
          {
            ssc_key: res.ssc_key || '',//软件分类key
            vercode: res.vercode || '',//版本号
            bfi_key: res.bfi_originalname || '',//文件
            sort: res.sort || '',//排序
            info: res.info || '' //更新内容
          }
        );
        this.isLoading = false;
      }, () => { });
    }

  }

  //树 方法
  treeSubmit() {
    //树新增
    if (this.popupTreeType == "add") {
      if (this.treeValidateForm.valid) {
        this.isTreeLoading = true;
        this.softwareService.treeAdd(this.treeValidateForm.value).then((res: any) => {
          this.message.success(this.util.getComm('sucess.s_add'));
          this.isTreeLoading = false;
          this.isTreePopup = false;
          this.toReloadTree();
        }, () => { }).finally(() => {
          this.isTreeLoading = false;
        });
      } else {
        Object.values(this.treeValidateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
    //树 修改
    if (this.popupTreeType == "update") {
      if (this.util.isAbnormalValue(this.updateTreeKey)) {
        let key = this.updateTreeKey;
        let setData = { key, ...this.treeValidateForm.value };
        this.softwareService.treeUpdate(setData).then((res: any) => {
          this.message.success(this.util.getComm('sucess.s_update'));
          this.isTreeLoading = false;
          this.isTreePopup = false;
          this.toReloadTree();
        }, () => { }).finally(() => {
          this.isLoading = false;
        });
      } else {
        this.message.error(this.util.getComm('fail.f'));
      }
    }
  }

  //树 删除
  treeDel(item) {
    if (this.util.isAbnormalValue(item.key)) {
      let list = [];
      list.push(item);
      this.isLeftSpinning = true;
      this.softwareService.treeDel(list).then((res: any) => {
        this.message.success(this.util.getComm('sucess.s_delete'));
      }, () => { }).finally(() => {
        this.toReloadTree();
      })
    } else {
      this.message.create('warning', this.util.getComm('warning.NoNote'));
    }
  }

  submit() {
    //新增
    if (this.popupType == "add") {
      if (this.validateForm.valid) {
        this.isLoading = true;
        this.softwareService.add(this.validateForm.value).then((res: any) => {
          this.message.success(this.util.getComm('sucess.s_add'));
          this.closePopup();
          this.toSearch(1);
        }, () => { }).finally(() => {
          this.isLoading = false;
        })
      } else {
        Object.values(this.validateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
    //删除
    if (this.popupType == 'del') {
      if (this.delType) {
        if (this.setOfCheckedId.size > 0) {
          let keyList = [];
          for (let key of this.setOfCheckedId) {
            keyList.push({ key: key });
          }
          this.softwareService.del(keyList).then((res: any) => {
            this.toSearch(1);
            this.message.success(this.util.getComm('sucess.s_delete'));
            this.closePopup();
          }, () => { }).finally(() => {
            this.closePopup();
          });
        } else {
          this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
        }
      } else {
        this.softwareService.del(this.oneDel).then((res: any) => {
          this.toSearch(1);
          this.message.success(this.util.getComm('sucess.s_delete'));
          this.closePopup();
        }, () => { }).finally(() => {
          this.closePopup();
        });
      }
    }
  }

  //获取软件分类
  onQuarterSearch() {
    this.softTypeLoading = true;
    this.selectService.softwareType().then((res: any) => {
      //用于左边软件分类树 使用
      let treeData = [];
      for (let item of res) {
        treeData.push({ name: item.name, key: item.key });
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

      //用于软件分类下拉 使用
      this.softTypeList = res;
    }).finally(() => {
      this.softTypeLoading = false;
    });
  }

  //导入抬头添加token 和 语言
  uploadingHeader() {
    const token = sessionStorage.ticket;
    return {
      token: token,
      language: localStorage.language
    }
  }

  //关闭
  closePopup() {
    this.isPopup = false;
    this.isPopupConfirm = false;
    this.isLoading = false;
    this.popupType = "";

    this.isTreePopup = false;
    this.isTreeLoading = false;
    this.popupTreeType = "";
    this.fileList = [];

    this.resetForm();
  }

}
