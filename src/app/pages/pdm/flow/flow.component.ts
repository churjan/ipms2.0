import { Component, ViewChild } from "@angular/core";
import { I18nPipe } from "~/shared/pipes/i18n.pipe";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { CrudComponent } from "~/shared/common/crud/crud.component";
import { Router } from "@angular/router";
import { CommFlowthreeComponent } from "~/shared/common/comm-flow3/comm-flow3.component";
import { MiddlePageComponent } from "~/shared/common/comm-flow3/Middlepage/Middlepage.component";

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.less'],
  providers: [I18nPipe]
})
export class FlowComponent extends ListTemplateComponent {
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('flow3', { static: false }) _flow3: CommFlowthreeComponent;
  @ViewChild('Middlepage', { static: false }) _Middlepage: MiddlePageComponent;
  /**分流方案权限  */
  UseDiversionScheme: boolean;
  /**路线图计算方式  */
  routecalculation = 1;
  /**款式工序流版本  */
  sversion = 1;
  /**是否开启备用站*/
  isoverload = false;
  /**是否显示配比*/
  routertype = false;
  /**版本权限 */
  versionPower: any = 1;
  /**特殊权限 */
  btnstationset: any = {};
  /**默认数据 */
  default = { parts: [], worksections: [] }
  power: any = {}
  constructor(public router: Router) {
    super();
    this.modularInit("commFlow", router.url);
  }

  ngOnInit(): void {
    this.otherUrl = this.modular.otherUrl;
    this.columns = this.modular.Mastercolumns;
    this._service.getModel('SystemInfo/getoperationprocessconfig', '', (r) => {
      this.isoverload = r.schemeoverload;
      this.routertype = r.distributionmode;
      this.routecalculation = r.routecalculation;
      if (r.styleprocessversion) this.versionPower = r.styleprocessversion;
      this.btnstationset = r.UseDiversionScheme && r.UseDiversionScheme == 'true' ? true : false;
      this.default.parts = r.default_parts ? r.default_parts : []
      this.default.worksections = r.default_worksections ? r.default_worksections : []
    }, (err) => {
      this.isoverload = false;
    })
  }
  btnEvent(event) {
    this.power = Object.assign(this.power, { routecalculation: this.routecalculation, sversion: this.sversion })
    switch (event.action) {
      case 'Update':
        this._service.getModel('admin/OperationProcessMaster/', event.node.key, (s) => {
          let body = Object.assign({}, s, { flowstate: true, bwi_key: s.worksectionlist[0].bwi_key })
          this._flow3.open({ title: 'PWRM', node: body, type: 'S', power: this.power, worksectionlist: s.worksectionlist, UseDiversionScheme: this.UseDiversionScheme })
        })
        break;
      case 'Reflux':
        let body = Object.assign({}, event.node)
        this._service.comPost(this.otherUrl.Reflux, body).then((result) => {
          this._crud.reloadData(null)
          this.message.success(this.getTipsMsg('sucess.s_set'));
        }, (msg) => { });
        break;
      case 'return':
        this._Middlepage.open(event.node)
        return
    }
    super.btnEvent(event);
  }
}