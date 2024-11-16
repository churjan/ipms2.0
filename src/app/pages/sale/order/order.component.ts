import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzUploadChangeParam } from "ng-zorro-antd/upload";
import { ZPageComponent } from "~/shared/components/zpage/zpage.component";
import { AppConfig } from "~/shared/services/AppConfig.service";
import { SelectService } from "~/shared/services/http/select.service";
import { UtilService } from "~/shared/services/util.service";
import { OrderSaleService } from "./order.service";
import { differenceInCalendarDays } from 'date-fns';
import { I18nPipe } from "~/shared/pipes/i18n.pipe";

@Component({
  selector: 'app-order-sale',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less'],
  providers: [I18nPipe]
})
export class OrderSaleComponent implements OnInit {
  btnList = [];//当前页面按钮信息
  openLeft: boolean = false;//是否开启左边树区域
  leftTreeTitle: string = "";//左边树区域标题
  isAdvancedSearch: boolean = true;//是否开启高级搜索
  isTablePage: boolean = true;//是否开启单独的翻页
  isCheck: boolean = true;//是否开启表格复选 默认开启
  isCheckAll: boolean = true;//是否开启表格全选 默认开启
  isNumber: boolean = true;//是否开启序列 默认开启
  isOperation: boolean = true;//是否开启表格内操作栏 默认关闭

  // project = sessionStorage.project//全局项目分类
  dateFormat = "yyyy-MM-dd";//时间格式化

  // 日期弹窗打开关闭事件
  disableEndDate: Date = null;
  disableStartDate: Date = null;
  inputOpenChange(data2) {
    this.disableEndDate = new Date(data2.requestdeliverydate);
    this.disableStartDate = new Date(data2.start_time);
  }

  // 开始时间限制无效日期 
  startDisabledDate = (current: Date): boolean => {
    // current > 结束时间 为无效(current采用当页日期00:00:00时刻，直接getTime处理当天比较错误)
    return differenceInCalendarDays(current, this.disableEndDate) > 0 || differenceInCalendarDays(current, new Date()) < 0
  }

  // 结束时间限制无效日期
  endDisabledDate = (current: Date): boolean => {
    // disableStartDate 与 disableEndDate 之间的时间为 true
    return (differenceInCalendarDays(current, this.disableStartDate) < 0 || differenceInCalendarDays(current, this.disableEndDate) > 0)
  }

  //查询参数
  queryParams = {
    page: 1,//当前第几页
    pageSize: 20,//每页显示条数
    keywords: "",//关键词
    sci_key: "",//客户
    state: "",//订单状态
    sale_channel: "",//渠道
    requestdeliverydate: null,//交货日期
    requestdeliverydate_start: "",//交货日期
    requestdeliverydate_end: "",//交货日期
    create_time: null,//创建日期
    create_time_start: "",
    create_time_end: "",
    code: "",//订单编号
    salername: "",//销售人员
    sort: "",
    dortDirections: ""
  };

  /* ******************表格属性******************************** */
  setOfCheckedId = new Set<string>();//表格回传回来的当前已选择的数据key
  tableLoading: boolean = false;
  tableData = [];
  columns: any[] = [];
  total: number = 2;//总条数


  // -----------------以下 弹窗参数-----------------
  isPopup: boolean = false;//是否打开窗口
  isPopupConfirm: boolean = false;//是否打开删除窗口
  isPopupImport: boolean = false;//是否打开导出窗口
  isLoading: boolean = false;//是否打开确定按钮的加载
  validateForm!: FormGroup;//校验
  popupType: string = "";//类型 add新增 update修改 del删除
  zpopupTiele: string = "";//弹窗标题
  delDataNum: number = 0;//删除条数

  //新增里的交货时间限制
  disabledAddEndDate = (startValue: Date): boolean => {
    if (!startValue || !this.validateForm.get('requestdeliverydate').value) {
      return false;
    }
    return new Date(this.validateForm.get('requestdeliverydate').value).getTime() >= this.startValue.getTime();
  };

  //------------------以下 信息详情中的表格参数------------------
  i = 0;
  editId: string | null = null;
  editStyle: string | null = null;
  editColor: string | null = null;
  editSize: string | null = null;
  editNum: string | null = null;
  editRequestdeliveryDate: string | null = null;//交货日期
  listOfData: any[] = [];

  ///------------------以下 排单--------------------------
  isPopupArrange: boolean = false;//是否打开窗口
  isArrangeLoading: boolean = false;//是否在加载
  orderData: any = {};//订单数据
  orderStyleList: any[] = [];//订单款式数据
  tableToArrangeListLoading: boolean = false;//预计排单数据加载
  toArrangeList: any[] = [];//预计排单数据
  arrangeList: any[] = [];//已排单数据

  startValue: Date | null = null;
  endValue: Date | null = null;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  @ViewChild('zpage') zpage: ZPageComponent;
  constructor(
    public orderService: OrderSaleService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private selectService: SelectService,
    private util: UtilService,
    private i18nPipe: I18nPipe
  ) { }

  fallback = './assets/images/nofille.jpg';

  //分配头部按钮的执行方法
  getTopBtn(event) {
    switch (event.name) {
      case "add": this.toAdd(); break;
      case "orderalldel": this.toDel(true, null); break;
      case "imp": this.toImport(); break;
      case "exp": this.toExport(); break;
      default: break;
    }
  }
  //分配表格按钮的执行方法
  getTableBtn(event) {
    switch (event.name) {
      case "orderupdate": this.toUpdate(event.item); break;
      case "see": this.toSee(1, event.item); break;
      case "orderconfirm": this.toSee(2, event.item); break;
      case 'arrange': this.toArrange(event.item, 1); break;
      case 'ksarrange': this.ksArrange(event.item); break;
      case "orderdel": this.toDel(false, event.item); break;
      default: break;
    }
  }
  //绑定控件回调下拉参数的方法
  getSelectValue(event) {
    let list = event.name.split("_");
    switch (list[0]) {
      case 'style':
        this.listOfData[list[1]].psi_key = event.id;
        break;
      case 'color':
        this.listOfData[list[1]].pci_key = event.id;
        break;
      case 'size':
        this.listOfData[list[1]].psz_key = event.id;
        break;
      default: break;
    }
  }

  ngOnInit(): void {
    this.columns = this.orderService.tableColumns();
    let d = new Date();
    // this.tableData = [
    //   { key: '1212', order_no: '202212140014006', name: '成品码', quantity: 12, requestdelivery_date: d, distributionChannel: '', salesman: '张三', state: 1, expired: 0, creation_date: d },
    //   { key: '12123', order_no: '202212140014006', name: '成品码', quantity: 12, requestdelivery_date: d, distributionChannel: '', salesman: '张三', state: 3, expired: 1, creation_date: d },
    // ];

    //启动校验
    this.validateForm = this.fb.group({
      code: [null, [Validators.required]],//订单编号
      sci_key: [null],//客户
      businesstyle: [null],//业务类型
      salername: [null, [Validators.required]],//销售人员
      sale_channel: [null],//销售渠道
      total: [0, [Validators.required]],//数量
      taking_time: [null, [Validators.required]],//受理日期
      requestdeliverydate: [null, [Validators.required]],//交货日期
      creat_name: [null],
      create_time: [null],
      remark: [null],//备注
    });

    this.toSearch(1);

    //获取业务类型
    this.toBusinessTypeDown();

    //获取订单状态
    this.toStateSeniorSearchDown();

    //获取销售渠道
    this.toDistributionChannelDown();

    // console.log(this.businessTypeList)
  }

  //查询
  toSearch(type: number = 1) {
    if (type == 1) {
      //需要把页码改为1的
      this.queryParams.page = 1;
    }
    this.tableLoading = true;
    let params = {
      page: this.queryParams.page,//当前第几页
      pageSize: this.queryParams.pageSize,//每页显示条数
      keywords: this.queryParams.keywords,//关键词
      sci_key: this.queryParams.sci_key,//客户
      state: this.queryParams.state,//订单状态
      sale_channel: this.queryParams.sale_channel,//渠道
      requestdeliverydate_start: this.queryParams.requestdeliverydate_start,//交货日期
      requestdeliverydate_end: this.queryParams.requestdeliverydate_end,//交货日期
      create_time_start: this.queryParams.create_time_start,
      create_time_end: this.queryParams.create_time_end,
      code: this.queryParams.code,//订单编号
      salername: this.queryParams.salername,//销售人员
      sort: this.queryParams.sort,
      dortDirections: this.queryParams.dortDirections
    }
    this.orderService.getList(params).then((res: any) => {
      this.tableData = res.data;
      this.total = res.total;
      if (type == 1) {
        this.zpage.getTableScrollToTop();//表格滚动条回滚到顶部
      }
      this.setOfCheckedId.clear();//清除选中项
      this.tableLoading = false;
    }, () => { }).finally(() => {
      this.tableLoading = false;
    });
  }

  //重置查询
  resetSearch(type) {
    if (type == 1) {
      this.queryParams = {
        page: 1,//当前第几页
        pageSize: 20,//每页显示条数
        keywords: "",//关键词
        sci_key: "",//客户
        state: "",//订单状态
        sale_channel: "",//渠道
        requestdeliverydate: null,//交货日期
        requestdeliverydate_start: "",//交货日期
        requestdeliverydate_end: "",//交货日期
        create_time: null,//创建日期
        create_time_start: "",
        create_time_end: "",
        code: "",//订单编号
        salername: "",//销售人员
        sort: "",
        dortDirections: ""
      };
    }
    if (type == 2) {
      this.queryParams.sci_key = "";
      this.queryParams.state = "";
      this.queryParams.sale_channel = "";
      this.queryParams.requestdeliverydate = null;
      this.queryParams.requestdeliverydate_start = "";
      this.queryParams.requestdeliverydate_end = "";
      this.queryParams.create_time = null;
      this.queryParams.create_time_start = "";
      this.queryParams.create_time_end = "";
      this.queryParams.code = "";
      this.queryParams.salername = "";
      this.queryParams.sort = "";
      this.queryParams.dortDirections = "";
      this.queryParams.page = 1;
      this.queryParams.pageSize = 20;
    }
    this.toSearch(1);
  }

  //时间段日期数据处理
  onDateToDateChange(result: Date[], type) {
    if (type == "requestdeliverydate") {
      this.queryParams.requestdeliverydate_start = UtilService.dateFormat(result[0]);
      this.queryParams.requestdeliverydate_end = UtilService.dateFormat(result[1]);
    }
    if (type == "create_time") {
      this.queryParams.create_time_start = UtilService.dateFormat(result[0]);
      this.queryParams.create_time_end = UtilService.dateFormat(result[1]);
    }
  }

  //单天时间处理
  onDateChange(result: Date, type) {
    if (type == "create_time") {
      UtilService.dateFormat(result);
    }
  }

  //表格状态
  formatOne = (percent: number) => {
    if (percent == 5) {
      return this.i18nPipe.transform('placard.new_built');
    }
    if (percent == 30) {
      return this.i18nPipe.transform('placard.determine_production');
    }
    if (percent == 60) {
      return this.i18nPipe.transform('placard.production');
    }
    if (percent == 100) {
      return this.i18nPipe.transform('placard.complete');
    }
  };

  //重置表单内容
  resetForm() {
    // this.validateForm.setValue({code:"",name:"",customcode:"",description:""});
    //重置数据

    this.validateForm.reset();//重置表单校验
  }

  //页码改变的回调
  pageIndexChange(number) { }

  //每页条数改变的回调
  pageSizeChange(number) { }

  //表格复选选中key的回传函数
  getCheckedId(idList) {
    this.setOfCheckedId = idList;
  }

  //排序回调
  getSortList(list) { }

  //获取销售渠道
  distributionChannelList: any[] = [];//销售渠道下拉
  distributionChannelLoading: boolean = false;
  toDistributionChannelDown() {
    this.distributionChannelLoading = true;
    this.selectService.distributionChannelDown({ pcode: 'distributionchannel' }).then((res: any) => {
      this.distributionChannelList = res.data;
    }, () => { }).finally(() => {
      this.distributionChannelLoading = false;
    });
  }

  //表格中格式化销售渠道
  toFormatSaleChannel(key) {
    for (let item of this.distributionChannelList) {
      if (key === item.key) {
        return item.name;
      }
    }
  }

  //交货日期和当前时间对比
  toTimeComparison(date) {
    return UtilService.TimeComparison(UtilService.dateFormat(new Date()), date.substring(0, 10))
  }

  //获取业务类型
  businessTypeList: any[] = [];//业务类型下拉
  businessTypeLoading: boolean = false;
  toBusinessTypeDown() {
    this.businessTypeLoading = true;
    this.selectService.EnumDown({ method: 'ordertypeenum' }).then((res: any) => {
      this.businessTypeList = res;
    }, () => { }).finally(() => {
      this.businessTypeLoading = false;
    });
  }

  //高级查询 获取客户
  customerSeniorSearchSList: any[] = [];//客户下拉
  customerSeniorSearchLoading: boolean = false;
  customerSeniorSearchI: number = 1;//高级查询使用
  customerSeniorSearchSum: number = 10;//当前页面总条数 默认一页10条
  customerSeniorSearchValue = "";//记录输入款式值
  toCustomerSeniorSearchDown(event) {
    this.customerSeniorSearchLoading = true;
    this.selectService.customerDown({ keywords: event, page: 1, pagesize: 999999 }).then((res: any) => {
      this.customerSeniorSearchLoading = false;
      this.customerSeniorSearchSList = res.data;
      //判断这个查询的值 是否是最后那个值，不是的话 再进行查询
      if (this.customerSeniorSearchValue !== event) {
        this.toCustomerSeniorSearchDown(this.customerSeniorSearchValue);
      }
    }).finally(() => {
      this.customerSeniorSearchLoading = false;
    });
  }
  onCustomerSeniorSearch(event) {
    this.customerSeniorSearchValue = event;

    if (this.util.isAbnormalValue(event)) {
      this.customerSeniorSearchI = 1;
      this.customerSeniorSearchSList = [];
      //判断当前加载是否已经执行完成，未执行完成不进入方法
      if (!this.customerSeniorSearchLoading) {
        this.toCustomerSeniorSearchDown(event);
      }
    } else {
      if (event === "") {
        this.customerSeniorSearchI = 1;
        this.customerSeniorSearchSum = 10;
        this.customerSeniorSearchSList = [];
      }
      if (this.customerSeniorSearchSum == 10) {
        this.customerSeniorSearchLoading = true;
        this.selectService.customerDown({ page: this.customerSeniorSearchI, pagesize: 10 }).then((res: any) => {
          this.customerSeniorSearchSum = res.data.length;
          this.customerSeniorSearchLoading = false;
          if (res.data.length == 10 && this.customerSeniorSearchI * 10 < res.total) {
            this.customerSeniorSearchSList = [...this.customerSeniorSearchSList, ...res.data];
            this.customerSeniorSearchI++;
          } else if (this.customerSeniorSearchI == 1) {
            this.customerSeniorSearchSList = res.data;
          }
        }).finally(() => {
          this.customerSeniorSearchLoading = false;
        });
      }
    }
  }

  //新增窗口 获取客户
  customerList: any[] = [];//客户下拉
  customerLoading: boolean = false;
  customerI: number = 1;//高级查询使用
  customerSum: number = 10;//当前页面总条数 默认一页10条
  customerValue = "";//记录输入款式值
  upCustomerOldData: any = {};//修改时 先将获取的值存入这个参数
  toCustomerDown(event) {
    this.customerLoading = true;
    this.selectService.customerDown({ keywords: event, page: 1, pagesize: 999999 }).then((res: any) => {
      this.customerLoading = false;
      this.customerList = res.data;
      //判断这个查询的值 是否是最后那个值，不是的话 再进行查询
      if (this.customerValue !== event) {
        this.toCustomerDown(this.customerValue);
      }
    }).finally(() => {
      this.customerLoading = false;
    });
  }
  onCustomerSearch(event) {
    this.customerValue = event;

    if (this.util.isAbnormalValue(event)) {
      this.customerI = 1;
      this.customerList = [];
      //判断当前加载是否已经执行完成，未执行完成不进入方法
      if (!this.customerLoading) {
        this.toCustomerDown(event);
      }
    } else {
      if (event === "") {
        this.customerI = 1;
        this.customerSum = 10;
        this.customerList = [];
      }
      if (this.customerSum == 10) {
        this.customerLoading = true;
        this.selectService.customerDown({ page: this.customerI, pagesize: 10 }).then((res: any) => {
          this.customerSum = res.data.length;
          this.customerLoading = false;
          if (res.data.length == 10 && this.customerI * 10 < res.total) {
            //1.判断是否为空 为第一次加载
            if (this.util.isAbnormalValue(this.upCustomerOldData) && this.customerList.length == 0) {
              this.customerList.push(this.upCustomerOldData);
            }
            let data = res.data.filter((item) => item.key != (this.util.isAbnormalValue(this.upCustomerOldData) ? this.upCustomerOldData.key : ''));

            this.customerList = [...this.customerList, ...data];
            this.customerI++;
          } else if (this.customerI == 1) {
            this.customerList = res.data;
          }
        }).finally(() => {
          this.customerLoading = false;
        });
      }
    }
  }

  //高级查询 获取订单状态
  stateSeniorSearchList: any[] = [];//订单状态下拉
  stateSeniorSearchLoading: boolean = false;
  toStateSeniorSearchDown() {
    this.stateSeniorSearchLoading = true;
    this.selectService.EnumDown({ method: 'orderstatus' }).then((res: any) => {
      this.stateSeniorSearchList = res;
    }, () => { }).finally(() => {
      this.stateSeniorSearchLoading = false;
    });
  }

  //获取款式
  styleList: any[] = [];//款式下拉
  styleLoading: boolean = false;
  toStyleDown() {
    this.styleLoading = true;
    this.selectService.styleDown({ page: 1, pagesize: 999999 }).then((res: any) => {
      this.styleList = res.data;
    }, () => { }).finally(() => {
      this.styleLoading = false;
    });
  }

  //获取颜色
  colorList: any[] = [];//颜色下拉
  colorLoading: boolean = false;
  toColorDown() {
    this.colorLoading = true;
    this.selectService.colorDown({ page: 1, pagesize: 999999 }).then((res: any) => {
      this.colorList = res.data;
    }, () => { }).finally(() => {
      this.colorLoading = false;
    });
  }

  //获取尺寸
  sizeList: any[] = [];//尺寸下拉
  sizeLoading: boolean = false;
  toSizeDown() {
    this.sizeLoading = true;
    this.selectService.sizeType({ page: 1, pagesize: 999999 }).then((res: any) => {
      this.sizeList = res.data;
    }, () => { }).finally(() => {
      this.sizeLoading = false;
    });
  }

  //按钮-新增
  toAdd() {
    this.zpopupTiele = this.i18nPipe.transform('btn.add');
    this.popupType = "add";
    this.isPopup = true;

    //获取订单编号
    this.orderService.getOrderId().then((res: any) => {
      this.validateForm.patchValue({ code: res })
    }, () => { }).finally(() => {

    });

    //获取业务类型
    this.toBusinessTypeDown();

    //获取销售渠道
    this.toDistributionChannelDown();

    //获取款式
    this.toStyleDown();

    //获取颜色
    this.toColorDown();

    //获取尺寸
    this.toSizeDown();
  }

  //按钮-删除
  delType: boolean = false;
  oneDel = [];
  toDel(type, item) {
    this.popupType = "del";
    this.delType = type;
    if (type) {
      if (this.setOfCheckedId.size > 0) {
        for (let item of this.tableData) {
          for (let check of this.setOfCheckedId) {
            if (check === item.key) {
              if (item.state != 0) {
                return this.message.create('warning', this.util.getComm('warning.noOrderConfirmDel'));
              }
            }
          }
        }
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

  //按钮-导入
  toImport() {
    this.zpopupTiele = this.i18nPipe.transform('btn.import');
    this.isPopupImport = true;
  }

  //导入抬头添加token 和 语言
  uploadingHeader() {
    const token = sessionStorage.ticket;
    return {
      token: token,
      language: localStorage.language
    }
  }

  //导入方法
  importChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') { }
    if (status === 'done') {
      if (file.response.code == 0)
        this.message.success(`${file.name} ` + this.getComm('sucess.s_upload'));
      else
        this.message.error(`${file.name} ` + this.getComm('fail.f_uploader') + file.response.message);
    } else if (status === 'error') {
      this.message.error(`${file.name} ` + this.getComm('fail.f_uploader'));
    }
  }

  //按钮-导出
  toExport() {
    this.orderService.export("orderExport.xls", { keywords: this.queryParams.keywords });
  }

  //排单窗口中-判断是否可以一件排单
  toAllArrange() {
    for (let item of this.orderStyleList) {
      if (item.quantity - item.workedquantity > 0) {
        return false;
      }
    }
    return true;
  }

  //按钮-排单
  som_key = "";//订单key
  toArrange(item, index) {
    if (item.state > 0) {
      this.zpopupTiele = this.i18nPipe.transform('btn.arrange');
      this.isPopupArrange = true;
      this.isArrangeLoading = true;
      if (this.util.isAbnormalValue(item.key)) {
        this.som_key = item.key;
        //获取订单信息
        this.orderService.see(item.key).then((res: any) => {
          this.orderData = res;
        }, () => { });
        //获取详情 和 作业单排单信息
        this.orderService.seeOrderArrangeDetail({ som_key: item.key }).then((res1: any) => {
          this.orderStyleList = res1;
          this.orderService.seeOrderToWork({ som_key: item.key }).then((res2: any) => {
            this.arrangeList = res2;
          }, () => { }).finally(() => {
            this.isArrangeLoading = false;
          });
        }, () => { });
      } else {
        this.message.warning(this.util.getComm('warning.noKey'));
      }
    } else {
      return this.message.warning(this.util.getComm('warning.toConfirmArrange'));
    }
  }

  //单条添加安排
  getOneAddArrange(item) {
    //订单数量已排满
    if (item.quantity - item.workedquantity == 0) {
      return this.message.warning(this.util.getComm('warning.fullArrange'));
    }

    let sum = 0;//计算当前排单数量总和
    for (let one of this.toArrangeList) {
      if (one.key === item.key) {
        sum = sum + one.noquantity;
      }
    }
    // console.log(sum);
    if (sum >= item.quantity - item.workedquantity) {
      return this.message.warning(this.util.getComm('warning.fullArrange'));
    }
    this.tableToArrangeListLoading = true;

    let one = {
      id: new Date().getTime() + "",
      start_time: UtilService.dateFormat(new Date(this.orderData.taking_time)),
      end_time: UtilService.dateFormat(new Date(item.requestdeliverydate)),
      noquantity: item.quantity - item.workedquantity - sum,
      ...item
    }
    this.toArrangeList = [...this.toArrangeList, one];
    // console.log(this.toArrangeList);
    this.tableToArrangeListLoading = false;
  }

  //单条删减
  getOneAubtractionArrange(id) {
    this.toArrangeList = this.toArrangeList.filter(d => d.id !== id);
  }

  //排单-一键安排
  allArrange() {
    this.toArrangeList = [];
    let list = [];
    for (let item of this.orderStyleList) {
      if (item.quantity - item.workedquantity > 0) {
        item.id = item.key;
        item.start_time = UtilService.dateFormat(new Date(this.orderData.taking_time));
        item.end_time = UtilService.dateFormat(new Date(item.requestdeliverydate));
        item.noquantity = item.quantity - item.workedquantity;
        list.push(item);
      }
    }

    this.toArrangeList = list;
  }

  //生成作业单
  batchSaveByOrder() {
    if (this.toArrangeList.length > 0) {
      let data = [];
      for (let item of this.toArrangeList) {
        data.push(
          {
            pci_name: item.pci_name,
            psi_name: item.psi_name,
            psz_name: item.psz_name,
            quantity: item.noquantity,
            requestdeliverydate: item.end_time,
            sod_key: item.key,
            start_time: item.start_time
          }
        );
      }
      this.orderService.batchSaveByOrder(data).then((res: any) => {
        this.message.success(this.util.getComm('sucess.s_create'));
        this.toArrangeList = [];
        //获取订单信息
        this.isArrangeLoading = true;
        this.orderService.see(this.som_key).then((res: any) => {
          this.orderData = res;
        }, () => { });
        //获取详情 和 作业单排单信息
        this.orderService.seeOrderArrangeDetail({ som_key: this.som_key }).then((res1: any) => {
          this.orderStyleList = res1;
          this.orderService.seeOrderToWork({ som_key: this.som_key }).then((res2: any) => {
            this.arrangeList = res2;
          }, () => { }).finally(() => {
            this.isArrangeLoading = false;
          });
        }, () => { });
      }, () => { });
    } else {
      this.message.warning(this.util.getComm('warning.noArrange'));
    }
  }

  //按钮-一键排单
  ksArrange(item) {
    if (this.util.isAbnormalValue(item.key)) {
      this.orderService.ksArrange({ key: item.key }).then((res: any) => {
        this.message.success(this.util.getComm('sucess.s_ks'));
        this.toSearch(2);
      }, () => { });
    } else {
      this.message.warning(this.getComm('warning.noKey'));
    }
  }

  //修改排单列表中的时间方法
  setArrangeDateChange(i, event, type) {
    let date = new Date(event);
    if (type === "requestdeliverydate") {
      this.toArrangeList[i].end_time = UtilService.dateFormat(date);
    }
    if (type === "start_time") {
      this.startValue = date;
      this.toArrangeList[i].start_time = UtilService.dateFormat(date);
    }
  }

  //按钮-修改
  updateKey = "";//修改的记录id
  updateItem: any = {};//记录当前修改的对象
  toUpdate(item) {
    if (item.state == 0) {
      this.zpopupTiele = this.i18nPipe.transform('btn.update');
      this.popupType = "update";
      this.isLoading = true;
      if (item.key != null && item.key != "") {
        this.orderService.see(item.key).then((res: any) => {
          this.updateItem = res;
          this.updateKey = res.key;
          this.validateForm.setValue(
            {
              code: res.code,
              sci_key: res.sci_key,
              businesstyle: parseInt(res.businesstyle),
              salername: res.salername,
              sale_channel: res.sale_channel,
              total: res.total,
              taking_time: res.taking_time,
              requestdeliverydate: res.requestdeliverydate,
              creat_name: res.create_name,
              create_time: res.create_time,
              remark: res.remark
            }
          );
          for (let item of res.sod_list) {
            this.listOfData.push(
              {
                key: item.key,
                psi_key: item.psi_key || '',
                pci_key: item.pci_key || '',
                psz_key: item.psz_key || '',
                quantity: item.quantity || '',
                requestdeliverydate: item.requestdeliverydate || ''
              }
            );
          }

          //给客户下拉添加数据（单条）
          this.upCustomerOldData = { key: res.sci_key, name: res.sci_name, code: res.sci_code };
          this.customerList.push(this.upCustomerOldData);

          this.isPopup = true;
        }, () => { }).finally(() => {
          this.isLoading = false;
        });
      }
    } else {
      this.toSee(1, item);
    }

  }

  //按钮-查看
  isPopupSee: boolean = false;
  isSeeLoading: boolean = false;
  seeData: any = {};
  seeDataTable = [];
  saleChannel = "";//销售渠道名称
  seeOrderArrangeDetail: any[] = [];//获取订单中详情排单列表
  toSee(type, item) {//type 1为查看 2为有确认生产按钮的查看
    if (type == 1) {
      this.zpopupTiele = this.i18nPipe.transform('btn.see');
      this.popupType = "see";
    }
    if (type == 2) {
      this.zpopupTiele = this.i18nPipe.transform('btn.determine_production');
      this.popupType = "confirm";
    }
    this.isSeeLoading = true;
    if (item.key != null && item.key != "") {
      this.orderService.see(item.key).then((res: any) => {
        this.saleChannel = this.toFormatSaleChannel(res.sale_channel);
        this.seeData = res;
        this.seeDataTable = [];
        for (let item of res.sod_list) {
          this.seeDataTable.push(
            {
              key: item.key,
              psi_code: item.psi_code || '',
              psi_name: item.psi_name || '',
              pci_name: item.pci_name || '',
              psz_name: item.psz_name || '',
              quantity: item.quantity || '',
              requestdeliverydate: item.requestdeliverydate || ''
            }
          );
        }

        this.isPopupSee = true;

        //拿到查看排单所需的详情信息
        this.orderService.seeOrderArrangeDetail({ som_key: item.key }).then((res2: any) => {
          this.seeOrderArrangeDetail = res2;
        }, () => { });

      }, () => { }).finally(() => {
        this.isSeeLoading = false;
      });
    }
  }

  //查看窗口-排单按钮-打开
  isSeeArrange: boolean = false;
  seeArrangeList: any = {};//用于记录当前排单数据
  toSeeInArrange(data) {
    if (this.util.isAbnormalValue(data.key)) {
      let list = {
        quantity: 0,
        inventorytotal: 0,
        workedquantity: 0,
        arrangeList: []
      };
      for (let item of this.seeOrderArrangeDetail) {
        if (item.key === data.key) {
          list.quantity = item.quantity || 0;
          list.inventorytotal = item.inventorytotal || 0;
          list.workedquantity = item.workedquantity || 0;
        }
      }

      //使用订单当前中的排单key获取单独款式排班数据
      this.orderService.seeOrderToWork({ sod_key: data.key }).then((res: any) => {
        // console.log(res)
        list.arrangeList = res;
        this.seeArrangeList = list;
      }, () => { });

      this.isSeeArrange = true;
    } else {
      this.message.warning(this.getComm('warning.noKey'));
    }
  }

  //查看窗口-排单按钮-关闭
  closeSeeInArrange() {
    this.isSeeArrange = false;
  }

  //窗口内按钮-确认生产
  isPopupConfirmProduce: boolean = false;
  toConfirmProduce() {
    this.isPopupConfirmProduce = true;
  }

  //窗口内按钮-确认生产-打开提示窗口
  subConfirmProduce() {
    if (this.util.isAbnormalValue(this.seeData.key)) {
      if (this.seeData.state == 0) {
        this.orderService.confirm({ key: this.seeData.key }).then((res: any) => {
          this.message.success(this.util.getComm('sucess.s_determine_production'));
          this.toSearch(2);
          this.closePopup();
        }, () => { });
      } else {
        this.message.warning(this.util.getComm('warning.noConfirm'));
      }
    }
  }

  //确认
  submit() {

    //新增
    if (this.popupType == 'add') {
      if (this.listOfData.length == 0) {
        return this.message.warning(this.i18nPipe.transform('warning.noStyleData'));
      }
      if (this.validateForm.valid) {
        //检测详细里数据是否都填写了
        for (let i = 0; i < this.listOfData.length; i++) {
          if (!this.util.isAbnormalValue(this.listOfData[i].psi_key)) {
            // this.message.warning(this.i18nPipe.transform('placard.numberData',(i+1))+this.util.getComm('fail.f_non_existent')+this.util.getComm('popupField.psi2'));
            this.message.warning(this.i18nPipe.transform('warning.noOrder'));
            return this.isLoading = false;
          }
          if (!this.util.isAbnormalValue(this.listOfData[i].pci_key)) {
            this.message.warning(this.i18nPipe.transform('warning.noOrder'));
            // this.message.warning(this.i18nPipe.transform('placard.numberData',(i+1))+this.util.getComm('fail.f_non_existent')+this.util.getComm('popupField.pci2'));
            return this.isLoading = false;
          }
          if (!this.util.isAbnormalValue(this.listOfData[i].psz_key)) {
            // this.message.warning(this.i18nPipe.transform('placard.numberData',(i+1))+this.util.getComm('fail.f_non_existent')+this.util.getComm('popupField.psz2'));
            this.message.warning(this.i18nPipe.transform('warning.noOrder'));
            return this.isLoading = false;
          }
          if (!this.util.isAbnormalValue(this.listOfData[i].quantity)) {
            // this.message.warning(this.i18nPipe.transform('placard.numberData',(i+1))+this.util.getComm('fail.f_non_existent')+this.util.getComm('popupField.num'));
            this.message.warning(this.i18nPipe.transform('warning.noOrder'));
            return this.isLoading = false;
          }
          if (!this.util.isAbnormalValue(this.listOfData[i].requestdeliverydate)) {
            // this.message.warning(this.i18nPipe.transform('placard.numberData',(i+1))+this.util.getComm('fail.f_non_existent')+this.util.getComm('popupField.requestdeliveryDate'));
            this.message.warning(this.i18nPipe.transform('warning.noOrder'));
            return this.isLoading = false;
          }
        }

        this.isLoading = true;
        let params = {
          code: this.validateForm.get('code').value,//订单编号
          sci_key: this.validateForm.get('sci_key').value,//客户
          businesstyle: this.validateForm.get('businesstyle').value,//业务类型
          salername: this.validateForm.get('salername').value,//销售人员
          sale_channel: this.validateForm.get('sale_channel').value,//销售渠道
          total: this.validateForm.get('total').value,//数量
          taking_time: this.validateForm.get('taking_time').value ? UtilService.dateFormat(this.validateForm.get('taking_time').value) : '',//受理日期
          requestdeliverydate: UtilService.dateFormat(this.validateForm.get('requestdeliverydate').value),//交货日期
          remark: this.validateForm.get('remark').value,//备注
          sod_list: this.listOfData
        };
        this.orderService.add(params).then((res: any) => {
          this.message.success(this.util.getComm('sucess.s_add'));
          this.resetSearch(1);
          this.closePopup();
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
        this.isLoading = false;
      }
    }
    //修改
    if (this.popupType == 'update') {
      if (this.validateForm.valid) {
        if (this.listOfData.length == 0) {
          return this.message.warning(this.i18nPipe.transform('warning.noStyleData'));
        }
        //检测详细里数据是否都填写了
        for (let i = 0; i < this.listOfData.length; i++) {
          if (!this.util.isAbnormalValue(this.listOfData[i].psi_key)) {
            this.message.warning(this.util.getComm('placard.numberData', i + 1) + this.util.getComm('fail.f_non_existent') + this.util.getComm('popupField.psi2'));
            return this.isLoading = false;
          }
          if (!this.util.isAbnormalValue(this.listOfData[i].pci_key)) {
            this.message.warning(this.util.getComm('placard.numberData', i + 1) + this.util.getComm('fail.f_non_existent') + this.util.getComm('popupField.pci2'));
            return this.isLoading = false;
          }
          if (!this.util.isAbnormalValue(this.listOfData[i].psz_key)) {
            this.message.warning(this.util.getComm('placard.numberData', i + 1) + this.util.getComm('fail.f_non_existent') + this.util.getComm('popupField.psz2'));
            return this.isLoading = false;
          }
          if (!this.util.isAbnormalValue(this.listOfData[i].quantity)) {
            this.message.warning(this.util.getComm('placard.numberData', i + 1) + this.util.getComm('fail.f_non_existent') + this.util.getComm('popupField.num'));
            return this.isLoading = false;
          }
          if (!this.util.isAbnormalValue(this.listOfData[i].requestdeliverydate)) {
            this.message.warning(this.util.getComm('placard.numberData', i + 1) + this.util.getComm('fail.f_non_existent') + this.util.getComm('popupField.requestdeliveryDate'));
            return this.isLoading = false;
          }
        }

        this.isLoading = true;
        let params = {
          key: this.updateKey,
          code: this.validateForm.get('code').value,//订单编号
          sci_key: this.validateForm.get('sci_key').value,//客户
          businesstyle: this.validateForm.get('businesstyle').value,//业务类型
          salername: this.validateForm.get('salername').value,//销售人员
          sale_channel: this.validateForm.get('sale_channel').value,//销售渠道
          total: this.validateForm.get('total').value,//数量
          taking_time: this.validateForm.get('taking_time').value,//受理日期
          requestdeliverydate: this.validateForm.get('requestdeliverydate').value,//交货日期
          create_time: this.validateForm.get('create_time').value,
          creat_name: this.validateForm.get('creat_name').value,
          remark: this.validateForm.get('remark').value,//备注
          state: this.updateItem.state,
          state_name: this.updateItem.state_name,
          sod_list: this.listOfData
        };
        this.orderService.update(params).then((res: any) => {

          this.message.success(this.util.getComm('sucess.s_update'));
          this.toSearch(2);
          this.closePopup();
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
        this.isLoading = false;
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
          this.orderService.del(keyList).then((res: any) => {
            this.message.success(this.util.getComm('sucess.s_delete'));
            this.closePopup();
            this.toSearch(2);
          }, () => { }).finally(() => {
            this.closePopup();
          });
        } else {
          this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
        }
      } else {
        this.orderService.del(this.oneDel).then((res: any) => {
          this.message.success(this.util.getComm('sucess.s_delete'));
          this.closePopup();
          this.toSearch(2);
        }, () => { });
      }
    }
  }

  /* 以下是信息详情 方法 */
  onListDateChange(i, event) {
    let date = new Date(event);
    this.listOfData[i].requestdeliverydate = UtilService.dateFormat(date);
  }

  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
      {
        key: `${this.i}`,
        psi_key: '',
        pci_key: '',
        psz_key: '',
        quantity: '',
        requestdeliverydate: ''
      }
    ];
    this.editId = this.i + "";
    this.editStyle = this.i + "";
    this.editColor = this.i + "";
    this.editSize = this.i + "";
    this.editNum = this.i + "";
    this.editRequestdeliveryDate = this.i + "";//交货日期
    this.i++;
  }

  deleteRow(key: string): void {
    this.listOfData = this.listOfData.filter(d => d.key !== key);
    this.detailsSum();//同步数量
  }

  //选中款式时将名称进行显示
  showStyle(i, key) {
    let name = "";
    for (let item of this.styleList) {
      if (item.key === key) {
        name = item.name;
      }
    }
    this.listOfData[i].styleName = name;
  }

  //选中颜色时将名称进行显示
  showColor(i, key) {
    let name = "";
    for (let item of this.colorList) {
      if (item.key === key) {
        name = item.name;
      }
    }
    this.listOfData[i].colorName = name;
  }

  //选中尺寸时将名称进行显示
  showSize(i, key) {
    let name = "";
    for (let item of this.sizeList) {
      if (item.key === key) {
        name = item.name;
      }
    }
    this.listOfData[i].sizeName = name;
  }

  //累加详情数量
  detailsSum() {
    let sum = 0;
    for (let item of this.listOfData) {
      sum = sum + (item.quantity ? item.quantity : 0);
    }
    this.validateForm.patchValue({ total: sum ? sum : '' });
  }

  //排单数量累加
  arrangeSum(item) {
    let sum = 0;//计算当前排单数量总和
    for (let one of this.toArrangeList) {
      if (one.key === item.key) {
        sum = sum + one.noquantity;
      }
    }
    if (sum > item.quantity - item.workedquantity) {
      let ynum = 0;
      for (let one of this.toArrangeList) {
        if (one.key === item.key && one.id != item.id) {
          ynum = ynum + one.noquantity;
        }
      }
      item.noquantity = item.quantity - item.workedquantity - ynum;
      return this.message.warning(this.util.getComm('warning.fullArrange'));
    }
  }

  /**文字提取 */
  getComm(condition, Dynamic?): string {
    const translate = AppConfig.translate.common;
    if (!translate) return null;
    let value: string = null;
    if (condition.indexOf('.') > 0) {
      const keyPath = condition.split('.').map(item => {
        return "['" + item + "']"
      }).join('');
      value = Dynamic ? eval(`translate${keyPath}`).replace('_', Dynamic) : eval(`translate${keyPath}`);
    }
    return value
  }

  //返回当前页面全部按钮信息
  getBtnGroup(list) {
    for (let item of list) {
      if (item.action.toLowerCase() == "add") {
        this.btnList.push({ add: { icon: item.icon, name: item.name, permission: item.juris.toLowerCase() } });
      }
    }
  }

  //上传
  upExcel() {
    return this.orderService.upExcel();
  }

  //关闭
  closePopup() {
    this.zpopupTiele = "";
    this.popupType = "";
    this.isPopupConfirmProduce = false;

    this.customerList = [];//客户下拉
    this.customerLoading = false;
    this.customerI = 1;//高级查询使用
    this.customerSum = 10;//当前页面总条数 默认一页10条
    this.customerValue = "";//记录输入款式值
    this.isPopup = false;
    this.listOfData = [];
    this.updateKey = "";
    this.upCustomerOldData = {};
    this.updateItem = {};
    this.isPopupConfirm = false;
    this.isPopupImport = false;

    this.isPopupSee = false;
    this.isSeeLoading = false;
    this.seeData = [];
    this.seeDataTable = [];
    this.saleChannel = "";

    this.isPopupConfirm = false;

    this.isPopupArrange = false;//是否打开窗口
    this.isArrangeLoading = false;//是否在加载
    this.orderData = {};//订单数据
    this.orderStyleList = [];//订单款式数据
    this.tableToArrangeListLoading = false;//预计排单数据加载
    this.toArrangeList = [];//预计排单数据
    this.arrangeList = [];//已排单数据
    this.som_key = "";


    this.resetForm();
  }

}