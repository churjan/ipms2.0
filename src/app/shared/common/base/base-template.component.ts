import { OnInit, Input, Component, Directive } from '@angular/core';
// import { AppService } from 'src/app/app.service';
// import { ToastService } from 'src/app/shared/util/toast/toast.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppConfig, modularList, ServiceLocator } from '~/shared/services/AppConfig.service';
import { RequestService } from '~/shared/services/request.service';
import { UtilService } from '~/shared/services/util.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '~/shared/services/app.service';
import { environment } from '@/environments/environment';
import { AuthService } from '~/shared/services/http/auth.service';
@Directive()
export class BaseTemplateComponent implements OnInit {
  constructor() {
    this._service = ServiceLocator.injector.get(UtilService);
    this._appService = ServiceLocator.injector.get(AppService);
    this.message = ServiceLocator.injector.get(NzMessageService);
    // this._pop = ServiceLocator.injector.get(PopupsService);
    this._modalService = ServiceLocator.injector.get(NzModalService);
    this._http = ServiceLocator.injector.get(HttpClient);
    this._httpservice = ServiceLocator.injector.get(RequestService);
    this._authService = ServiceLocator.injector.get(AuthService);
  }
  /**加载 */
  isSpinning = false;
  /**服务 */
  _http: HttpClient;
  _httpservice: RequestService;
  /**接口服务 */
  _service?: UtilService;
  _appService?: AppService;
  /**警告服务 */
  message: NzMessageService;
  // _toastService: ToastService;
  /**弹窗服务 */
  _modalService: NzModalService;
  _authService: AuthService;
  // _pop: PopupsService;
  /**模块对象 */
  @Input() modular: any;
  /**模块名 */
  fieldcode: string = '';
  /**字段 */
  @Input() field: any = {};
  /**列表 */
  @Input() columns: any = [];
  /**提示 */
  tipsMsg = AppConfig.tipsMsg;
  /**按钮 */
  buttonList = AppConfig.buttonList;
  /**公共地址 */
  Config = AppConfig.Config;
  /**关联地址 */
  otherUrl: any = {};
  winHeight: number = window.innerHeight - 265;
  winWidth: number = window.innerWidth - 201;
  /**语言类型 */
  language = 'zh';
  /**父级模块 */
  @Input() ComponentParam: any;
  /**选中字段 */
  namefeild = 'name';
  /**选中关键字段 */
  keyfeild = 'key'
  /**路由 */
  url: string = ''
  /**项目 */
  project = sessionStorage.project;
  /**菜单 */
  menuData
  print = (v) => { return v.toLowerCase() }
  ngOnInit() { }
  GetList() { }
  winResize() {
    this.winHeight = window.innerHeight - 365;
    this.winWidth = window.innerWidth - 201;
  }
  /**页面文字数据获取 */
  modularInit(modularName, url?, isget = true, language = 'zh') {

    // let translatelist = new Array();
    // let slow=AppConfig.slow.find(s=>s.modular==modularName);
    // this._httpservice.GetUITranslate([slow]).then((response: any) => {
    //     translatelist = Object.assign(AppConfig.translate, response);
    //     AppConfig.translate = Object.assign(AppConfig.translate, response);
    //     localStorage.setItem("translate", JSON.stringify(translatelist))
    // })
    // localStorage.setItem("translate", JSON.stringify(translatelist))
    setTimeout(() => {
      this.menuData = this._authService.menuData;
    }, 500)
    if (url) {
      this.url = url.replace(/\//g, "_")
      if (this.url.indexOf("_") == 0) {
        this.url = this.url.substring(1, this.url.length)
      }
      AppConfig.btnGroup = this._authService.getBtn(this.url)
    }
    this.fieldcode = modularName;
    if (modularList) {
      let _modular = modularList[modularName] ? modularList[modularName] : {};
      this.modular = _modular;
      const that = this;
      if (!_modular.fields) _modular.fields = []
      _modular.fields = AppConfig.fields[modularName];
      if (localStorage.setColumns2 && UtilService.isNotEmpty(localStorage.setColumns2)) {
        let _ssc = JSON.parse(localStorage.setColumns2)
        if (_ssc && _ssc[modularName]) {
          this.columns.push(..._ssc[modularName])
        } else
          if (AppConfig.columns[modularName])
            AppConfig.columns[modularName].forEach(col => {
              this.columns.push({ coums: col })
            });
      } else {
        if (AppConfig.columns[modularName])
          AppConfig.columns[modularName].forEach(col => {
            this.columns.push({ coums: col })
          });
      }
      that.modularset(_modular, isget);
    }
  }
  modularset(d, isget) {
    const that = this;
    this.otherUrl = d.otherUrl ? d.otherUrl : {};
    this.modular.columns = this.columns;
    if (d.fields) {
      let _AllColumns = new Array();
      let j = /^[\u4E00-\u9FFF]/;
      d.fields.forEach(element => {
        let N = element.name
        let _W = N.length * (j.test(N) ? 12 * 2 : 12);
        let ColumnsNode: any = {
          format: element.format,//格式
          alignment: element.alignment,//对齐
          type: element.type,//类型
          width: element.width ? element.width + 'px' : '120px',//列宽
          StandardLine: element.StandardLine,
          delimiter: element.delimiter,//显示间隔符
          field: element.field,//数据字典
          extend: element.extend,//扩展自定义
          open: element.open,//打开链接
          disabled: element.disabled,//禁止修改
          nzRight: element.nzRight ? element.nzRight : false,//右定位
          nzLeft: element.nzLeft ? element.nzLeft : false,//左定位
          stateclass: element.stateclass,//状态类型
          minwidth: _W//最小列宽
        }
        that.field[element.code] = element.name;
        let cfi = this.columns.findIndex(c => c.coums == element.code);
        if (cfi >= 0) {
          this.columns[cfi] = Object.assign(this.columns[cfi], ColumnsNode);
          ColumnsNode.check = true;
          this.columns[cfi].width = this.columns[cfi].widthnum ? this.columns[cfi].widthnum + 'px' : this.columns[cfi].width
        }


        if (element.noshow != true) _AllColumns.push(Object.assign({ coums: element.code, disable: element.disabled }, ColumnsNode))
      });
      // _AllColumns = _AllColumns.sort((a) => { return a.disable != true ? -1 : 99 })
      let l: any = UtilService.isNotEmpty(localStorage.AllColumns) ? JSON.parse(localStorage.AllColumns) : {};
      l[this.fieldcode] = l[this.fieldcode] ? l[this.fieldcode] : _AllColumns
      // sessionStorage.AllColumns = JSON.stringify(l);
      localStorage.setItem("AllColumns", JSON.stringify(l))
    }
    if (isget == true) { this.GetList(); }
  }
  /**日期格式化 */
  dateFormat(Time: any, _format) {
    if (!Time || Time === '' || Time == null) { return ''; }
    let _time = Time._d ? Time._d : new Date(Time);
    return UtilService.dateFormat(_time, _format);
  }
  //获取实体处理模式
  protected doAction(key: any) { return key && key != '' ? "put" : "post"; }
  //单选
  singleSelect(fun, _models) {
    let _sm = _models.filter(x => x.checked == true);
    if (!_sm || _sm.length <= 0) {
      this.message.error(this._appService.translate('checkdata.check_data'))
      return;
    }
    if (_sm.length > 1) {
      this.message.error(this._appService.translate('checkdata.check_singledata'))
      return;
    }
    fun(_sm[0]);
  }

  //多选数据
  multipleSelect(fun, _models, keyfeild = this.keyfeild, namefeild = this.namefeild) {
    let _sm = _models.filter(x => x.checked === true);
    if (!_sm || _sm.length <= 0) {
      this.message.error(this._appService.translate('checkdata.check_leastoneledata'))
      return;
    }
    let _keys = new Array();
    let _keyslist = new Array();
    let _names = new Array();
    _sm.forEach(m => {
      _keys.push(m[keyfeild]);
      _keyslist.push({ key: m[keyfeild] });
      if (!m[namefeild] && namefeild != 'code') { _names.push(m.code); } else { _names.push(m[namefeild]); }
    });
    fun({ delkey: _keys.join(","), name: _names.join(","), smodel: _sm, dellist: _keyslist });
  }
  /**文字提取 */
  getTipsMsg(condition, Dynamic?): string {
    return this._appService.translate(condition, Dynamic);
  }
  /**确认框提示 */
  Confirm(delkey, name?, backCall?) {
    const that = this;
    let title = that.getTipsMsg(delkey) + (!name || name == '' ? '' : name);
    this._modalService.confirm({
      nzTitle: title,
      nzOnOk: () => backCall('pass'),
      nzOnCancel: () => backCall('fail'),
    });
  }
  /**模板下载 */
  Down(url = 'xlsurl') {
    if (!this.otherUrl[url]) {
      this.message.error(this._appService.translate('msgdata.notemp'))
      return;
    }
    if (!localStorage.language) { localStorage.language = 'zh'; }
    let xlsurl = environment.rootUrl + 'download/excel/' + localStorage.language + '/' + this.otherUrl[url];
    window.open(xlsurl);
  }
}