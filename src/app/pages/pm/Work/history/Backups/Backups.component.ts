import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
declare var $: any;
@Component({
  selector: 'Backups-test',
  templateUrl: './Backups.component.html',
  styleUrls: ['./Backups.component.less']
})
export class BackupsComponent extends FormTemplateComponent {
  constructor(private breakpointObserver: BreakpointObserver,) { super(); }
  /**上级传入参数 */
  node: any = {};
  record: any = {};
  /**历史记录 */
  operation: any[] = [];
  /**参数 */
  _body: any = {};
  /**右侧信息 */
  pos: any;
  /**左侧信息 */
  old_pos: any;
  /*****************************工序流********************************/
  /**工序流 */
  newFlow: any = {};
  /**工序流暂存数据*/
  newOP: any[] = [];
  oldOp: any[] = [];
  /**标签页选择 */
  selectedIndex = 0;
  /**调整对象 */
  param: any = {};
  /**选中参数 */
  selectoeder: any = {};
  /****************************权限**********************************/
  /**路线图计算方式  */
  routecalculation = 1;
  /**工段操作权限 */
  bwi_list = new Array();
  /****************************工段**********************************/
  /**预览工段 */
  divider = new Array();
  /**工段*/
  section: any[] = [];
  /**选中工段 */
  nzSelected: string = '';
  /**是否显示配比*/
  routertype = false;
  /**工序流总工序 */
  options: any[] = [];
  initialdata: any;
  /**初始化 */
  ngOnInit(): void {
    this.otherUrl = this.modular.otherUrl;
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (!result.matches) { this.width = '800px' } else { this.width = '100%' }
    });
  }
  /**打开弹窗 */
  async open(record: any) {
    this.title = this._appService.translate("btn." + record.title);
    this.record = record;
    this.otherUrl = this.modular.otherUrl;
    if (record && record.node) {
      this.node = record.node;
      this.key = record.node.key;
      this._service.comList('operationprocesssnapshot', { other_key: this.node.popm_key }, 'getlist').then((v) => {
        this.operation = v;
      })
      if (sessionStorage.bwi_list) {
        let _bwi_list = JSON.parse(sessionStorage.bwi_list);
        if (!this.bwi_list) { this.bwi_list = []; }
        if (_bwi_list) { _bwi_list.forEach(_b => { if (_b && _b != null && _b != undefined) { this.bwi_list.push(_b); } }) }
      }
      this._service.getModel('SystemInfo/getoperationprocessconfig', '', (r) => {
        this.routertype = r.distributionmode;
        this.routecalculation = r.routecalculation;
      }, (err) => { })
      this._body = this.node.new ? { key: this.node.new.key, old_key: this.node.old.key } : { old_key: this.node.old.key };
      if (!this._body.key) {
        this._body = Object.assign(this._body, { popm_key: this.node.popm_key })
      }
      if (record.power.com == true) {
        this.node.opp_type = this.node.opp_type ? this.node.opp_type : parseInt(sessionStorage.opp_type);
        if (!this.node.opp_type || this.node.opp_type == 1) {
          this.node.opp_type = 1;
        }
        this._service.enumList('OperationProcessTypeEnum').then(result => { this.node.opp_type_name = result.find(v => v.value == this.node.opp_type).description });

      }
      this.getList(this._body);
    } else {
      this.key = null
    }
    this.visible = true
  }
  getList(body) {
    this._service.getPage(this.otherUrl.historyflow, body, (result) => {
      if (result) {
        this.pos = result.newdata.pos;
        this.old_pos = result.olddata.old_pos;
        if (!result.olddata.olddata.partlist) { result.olddata.olddata.partlist = []; }
        this.HandleData(result.newdata, result.olddata);
      }
    }, (err) => { });
  }
  oldChange(opera) {
    this._body = Object.assign(this._body, { old_key: opera.key });
    this.getList(this._body);
  }
  newChange(opera) {
    this._body = Object.assign(this._body, { key: opera.key, pwb_key: "", psopm_key: "" });
    this.getList(this._body);
  }
  /**数据重组 */
  HandleData(newdata, olddata, is?) {
    this.newFlow = newdata.data;
    this.section = new Array();
    if (newdata.data.worksectionlist && newdata.data.worksectionlist.length > 0) {
      this.section = newdata.data.worksectionlist;
    }
    this.bwi_list.forEach(bwi => {
      if (bwi && this.section.find(sec => sec.bwi_key == bwi.key)) { bwi.hidd = true; }
    });
    if (this.newFlow.partlist && this.newFlow.partlist.length > 0) {
      let oldpartlist = new Array();
      this.newFlow.partlist.forEach((x, fpnum) => {
        x.isfold = false;
        let oldpart = olddata.olddata.partlist.find(o => o.bpi_key == x.bpi_key);
        if (!oldpart) {
          oldpart = {
            bpi_class_code: x.bpi_class_code, bpi_class_name: x.bpi_class_name,
            bpi_code: x.bpi_code, bpi_ismain: x.bpi_ismain, bpi_key: x.bpi_key,
            bpi_name: x.bpi_name, isfold: x.isfold, sort: fpnum, worksectionlist: []
          }
        }
        oldpartlist.push(oldpart);
        x.bpi_sort = x.bpi_sort ? x.bpi_sort : fpnum;
      });
      this.initialdata = oldpartlist;
      if (this.section && this.section.length > 0) {
        this.sectionCheck(this.section[0], 0);
      } else { this.preview(); this.preview(this.initialdata, this.oldOp) }
    } else { this.newFlow.partlist = []; }
  }
  /**工段判定 */
  Jurisdiction(sec) {
    const that = this;
    if (sec) {
      if (!that.bwi_list) { that.bwi_list = []; }
      let issec = that.bwi_list.find(bwi => bwi.key == sec.bwi_key);
      return !issec ? false : true;
    }
    return false;
  }
  /**工段选择 */
  sectionCheck(seckey, num, olddata = this.oldOp, oldlist = this.initialdata) {
    this.nzSelected = seckey.bwi_code;
    if (!this.newFlow.partlist || this.newFlow.partlist === null) { this.newFlow.partlist = []; }
    this.options = new Array();
    this.newFlow.partlist.forEach((part, pi) => {
      let oldpart = oldlist.find(o => o.bpi_key == part.bpi_key);
      if (!oldpart) { oldpart = { bpi_key: part.bpi_key, bpi_name: part.bpi_name, worksectionlist: [] }; }

      const ol = oldpart.worksectionlist.find(x => x.bwi_key === seckey.bwi_key);
      if (!ol) {
        let _ol = { bwi_key: seckey.bwi_key, bwi_sort: num, detaillist: [] }
        oldpart.worksectionlist.push(_ol);
        olddata[oldpart.bpi_name] = _ol.detaillist;
      } else {
        if (!ol.detaillist || ol.detaillist === null) { ol.detaillist = []; }
        ol.detaillist.forEach(p => {
          p.title = '[' + p.poi_code + ']' + p.poi_name
          if (!p.routelist) { p.routelist = []; }
          let total = p.routelist.reduce(function (total, currentValue, currentIndex, arr) {
            return currentValue.percentage ? (total + currentValue.percentage) : total;
          }, 0);
          p.routelist.map((v) => { if (!v.percentage) { v.percentage = 0 }; v.percent = total > 0 ? ((v.percentage / total) * 100).toFixed(0) + '%' : '0%'; })
        });
        olddata[oldpart.bpi_name] = ol.detaillist;
      }
      const b = part.worksectionlist.find(x => x.bwi_key === seckey.bwi_key);
      if (!b) {
        let _b = { bwi_key: seckey.bwi_key, bwi_name: seckey.bwi_name, bwi_sort: num, detaillist: [] }
        part.worksectionlist.push(_b);
        this.newOP[part.bpi_name] = _b.detaillist;
      } else {
        if (!b.detaillist || b.detaillist === null) { b.detaillist = []; }
        b.detaillist.forEach((p, di) => {
          if (pi == this.selectedIndex && seckey.bwi_key == b.bwi_key) {
            let _options: any = {
              title: p.poi_name + '-' + p.poi_code,
              name: p.poi_name, code: p.poi_code,
              sort: di + 1
            }
            if (p.pyso_operationticket) { _options.pyso_operationticket = p.pyso_operationticket; }
            this.options.push(_options)
          }
          if (p.psopd_key) { p.psopd_key = ''; }
          p.pfd_name = this.tipsMsg.noset;
          p.pod_name = this.tipsMsg.noset;
          p.title = '[' + p.poi_code + ']' + p.poi_name;
          if (!p.routelist) { p.routelist = []; }
          let total = p.routelist.reduce(function (total, currentValue, currentIndex, arr) {
            return currentValue.percentage ? (total + currentValue.percentage) : total;
          }, 0);
          p.routelist.map((v) => { if (!v.percentage) { v.percentage = 0 }; v.percent = total > 0 ? ((v.percentage / total) * 100).toFixed(0) + '%' : '0%'; })
        });
        this.newOP[part.bpi_name] = b.detaillist;
      }
    });
  }
  /**预览 */
  preview(data = this.newFlow, deposit = this.newOP) {
    const that = this;
    this.nzSelected = '';
    data.partlist.forEach((part, pi) => {
      if (!part || part === null) { return; }
      if (part.worksectionlist) {
        deposit[part.bpi_name] = [];
        that.options = new Array();
        this.section.forEach((element, i) => {
          if (element.bwi_key != '') {
            let sec = part.worksectionlist.find(w => w.bwi_key == element.bwi_key);
            if (sec) {
              sec.detaillist.forEach(de => {
                if (de.psopd_key) { de.psopd_key = ''; }
                that.options.push(de.poi_name + '-' + de.poi_code)
                deposit[part.bpi_name].push(de);
                if (!that.divider.find(d => d == sec.bwi_name)) {
                  that.divider.push(sec.bwi_name);
                } else { that.divider.push(''); }
              });
            }
          }
        });
      }
    });
  }
  /**文字滚动 */
  mouseover(event, op) {
    let dom = document.getElementById(op.poi_code);
    if (dom)
      op.isscroll = dom.scrollWidth > dom.offsetWidth;
  }
  /**一键折叠 */
  Fold(par, i) { par.isfold = !par.isfold; }
  close(): void {
    this.avatar = null
    this.visible = false
  }
}
