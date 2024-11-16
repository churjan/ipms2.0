import { ComponentFactoryResolver, ViewChild, Component, Directive } from '@angular/core';
// import { ToastConfig, ToastType } from 'src/app/shared/util/toast/toast-model';
import { BaseTemplateComponent } from './base-template.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServiceLocator } from '~/shared/services/AppConfig.service';
import { UtilService } from '~/shared/services/util.service';
import { ListShowComponent } from '../show/list-show.component';
import { FormGroup } from '@angular/forms';
import { environment } from '@/environments/environment';
declare var $: any;
@Directive()
export class ListTemplateComponent extends BaseTemplateComponent {
  constructor() {
    super();
    this._http = ServiceLocator.injector.get(HttpClient);
    // this._resolver = ServiceLocator.injector.get(ComponentFactoryResolver);
  }
  @ViewChild('listshow', { static: false }) _listshow: ListShowComponent;
  url: string = '';
  /**弹窗 */
  // _resolver: ComponentFactoryResolver;
  /**分类字段 */
  classField: string;
  /**列表数据 */
  list: any[] = [];
  /**汇总数据 */
  sumNode: any = {}
  /**查询对象 */
  SearchModel: any = { keywords: "" };
  /**高级查询对象 */
  seniorModel: any = {};
  /**资源定位 */
  modifyComponent: any;
  /**是否重置 */
  isReset: boolean;
  /**分页 */
  pageMap: any = {
    page: 1,
    pagesize: 15
  };
  /**抽屉 */
  visible: boolean;
  validateForm!: FormGroup
  public options: any = {
    total: 1, //总条数
    pageList: [15, 25, 35, 50, 100, 200] //每页显示条数
  };
  ngOnInit() {
    const that = this;
    this.winResize();
    // $(window).resize(function () { that.winResize(); });
  }
  GetList(data?, backCall?: any) {
    const that = this;
    let Model = Object.assign({ url: this.modular.url, other: null, data: null }, data)
    let _smodel: any = {};
    let SearchModel = Object.assign(this.SearchModel, this.seniorModel)
    for (let k in SearchModel) {
      if (UtilService.isNotEmpty(SearchModel[k])) { _smodel[k] = SearchModel[k]; }
      if (that.SearchModel[k] == 0) { _smodel[k] = this.SearchModel[k]; }
    }
    let body: Object = Object.assign({}, this.pageMap, _smodel, Model.other)
  }
  btnEvent(event) {
    switch (event.action.toLowerCase()) {
      case 'add':
        this.Add();
        break;
      case 'update':
        this.Update(event.node);
        break;
      case 'del':
        this.Delete(event.node);
        break;
      case 'extend':
        break;
    }
  }
  Add() {
    let _mo: {} | null;
    if (this.classField) { _mo[this.classField] = this.SearchModel[this.classField] }
    this.openModal({ title: 'plus', node: _mo });
  }

  Update(model?: any, list = this.list): void {
    let sModel = model;
    if (sModel == null || !sModel) {
      this.singleSelect(function (m) { sModel = m; }, list);
    }
    if (sModel && sModel !== null) { this.openModal({ title: 'update', node: sModel }); }
  }
  QueryInspection(code): boolean {
    return this.modular && this.columns.find(c => c.coums == code) ? true : false;
  }
  Delete(data?: any, backCall?: any) {
    const that = this;
    let node = Object.assign({ model: null, url: this.modular.url, list: this.list, keyfeild: this.keyfeild, namefeild: this.namefeild }, data)
    let delkey: any;
    let name: string;
    if (node.model) {
      // delkey = node.model[node.keyfeild];
      delkey = [node.model];
      name = node.model[node.namefeild];
    } else {
      this.multipleSelect(function (m) { delkey = m.delkey; name = m.name; }, node.list);
    }
    if (delkey) {
      this.Confirm('confirm.confirm_deln', name, (confirmType) => {
        if (confirmType == 'pass') {
          that._service.deleteModel(node.url, delkey, (data) => {
            this.message.success(this.getTipsMsg('sucess.s_delete'))
            that.GetList();
            if (backCall) backCall(data);
          }, function (msg) {
            this.message.error(this.getTipsMsg('fail.f_delete'))
          })
        }
      })
    }
  }
  //打开窗口
  protected openModal(model: any, component: any = null, opt = {}, other?: any, ComponentParam?: any, backCall?: any) {


  }
  onPage(event, data?: any) {
    if (event) { this.pageMap = event; }
    this.GetList({ data: data });
  }
  onSort(ev?) {
    this.SearchModel = Object.assign(this.SearchModel, ev);
    this.GetList();
  }
  Search(ev?, other = {}, FrontPag = false) {
    if (!(ev && ev.keyCode !== 13)) {
      this.pageMap.page = 1;
      if (FrontPag == false) {
        this.options.total = 0;
      }
      if (this.modular.Explist) {
        let _SearchModel = Object.assign({}, other, this.SearchModel, this.seniorModel);
        for (let l of this.modular.Explist) {
          if (UtilService.isEmpty(_SearchModel[l]) == true) {
            this.message.warning(this.getTipsMsg('checkdata.check_xx', this.getTipsMsg(this.fieldcode + '.' + l)));
            return
          }
        }
      }
      this.GetList();
    }
  }
  Reset(isRefresh = true, FrontPag = false) {
    this.pageMap.page = 1;
    if (FrontPag == false) {
      this.options.total = 0;
    }
    this.SearchModel = {};
    this.seniorModel = {};
    this.isReset = true;
    if (isRefresh == true) { this.Search(null, null, FrontPag); } else { this.list = []; this.sumNode = {} }
  }
  Exp(addparams, must = false, url = 'expurl') {
    let params: any = {}
    if (!addparams) { return; }
    for (let p in addparams) {
      let _d = this.modular.fields.find(x => p.search(x.code) >= 0);
      if (addparams[p] && _d && _d.type == 'time') { addparams[p] = this.dateFormat(addparams[p], 'yyyy-MM-dd') }
      if (addparams[p] && (addparams[p] != '' || addparams[p] != null)) {
        params[p] = addparams[p];
      }
    }
    this.downloadreport(this.otherUrl[url], params);
  }
  isseach(code): boolean {
    return this.modular && this.columns.find(c => c.coums == code) ? true : false;
  }
  /**下载报表 */
  downloadreport(expurl, params) {
    const nowdate = this.modular.title + this.getTipsMsg('btn.export') + UtilService.dateFormat(new Date(), 'yyyy-MM-dd') + '.xls';
    const downloadUrl = environment.baseUrl + '/' + expurl;

    this._httpservice.download(downloadUrl, nowdate, params);
  }
}