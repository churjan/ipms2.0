// import { FormTemplateComponent } from 'src/app/common/Template/Form-Template.component';
// import { Component, Input } from '@angular/core';
// import { Utils } from 'src/app/shared/util/utils';
// import { ToastConfig, ToastType } from 'src/app/shared/toast/toast-model';
// declare var $: any;
// @Component({
//     selector: 'app-flow-info',
//     templateUrl: './flow-info.component.html'
// })
// export class FlowInfoComponent extends FormTemplateComponent {
//     constructor() { super();}
//     @Input() psi_key: string;
//     @Input() ispublic: boolean;
//     @Input() iscopy: boolean;
//     @Input() isedit: boolean = false;
//     pormType: any[];
//     newmodel: any;
//     fiel = 'styleflow';
//     inpara: any = { IsSeparate: true, IsUpdate: true, height: this.winHeight + 50, isedit: false }
//     winResize() {
//         this.winHeight = window.innerHeight - 257;
//         this.inpara.height = this.winHeight + 50;
//     }
//     ngOnInit() {
//         const that = this;
//         this.winResize();
//         $(window).resize(function () { that.winResize(); });
//         this.modularInit("comm_flow"); 
//         this.inpara.flowpower = sessionStorage.process && sessionStorage.process == 'true' ? true : false;
//         this.inpara.mappower = sessionStorage.processroute && sessionStorage.processroute == 'true' ? true : false;
//     }
//     GetList() {
//         this.otherUrl = this.otherUrl.style;
//         if (this.iscopy) { this.inpara.psi_key = this.psi_key; this.inpara.Iscopy = this.iscopy; }
//         if (!this.model && this.psi_key && this.psi_key != '') { this.model = { psi_key: this.psi_key } }
//         if (this.model) {
//             if (!this.psi_key && this.model.psi_key) { this.psi_key = this.model.psi_key; };
//             if (!this.model.key || this.model.key == null) { this.model.key = ''; }
//         }
//         if (this.model && this.model.key != '') {
//             this.GetModel();
//         } else {
//             this.newmodel = { psorm_key: '', psorm_name: '', psopm_code: '', psopm_name: '' };
//             if (!this.iscopy || this.iscopy !== true) {
//                 this.newmodel.psopm_code = Utils.shortUUID();
//             }
//             if (this.psi_key && (!this.iscopy || this.iscopy !== true)) {
//                 this.newmodel.psi_key = this.psi_key ? this.psi_key : '';
//                 this.newmodel.psopm_name = this.field['psopm_key'] + Utils.shortUUID();
//             }
//             if (this.ispublic && (!this.iscopy || this.iscopy !== true)) {
//                 this.newmodel.ispublic = this.ispublic;
//                 this.newmodel.psopm_name = this.field['commflow'] + Utils.shortUUID();
//             }
//         }
//     }
//     GetModel() {
//         const that = this;
//         let key = that.model.key ? that.model.key : '';
//         this._service.getPage(this.otherUrl.Styleget, { psopm_key: key }, function (result) {
//             that.newmodel = {};
//             that.newmodel = result.data;
//             that.getMap();
//         }, function () {
//             that._toastService.toast(new ToastConfig(ToastType.ERROR, '', that.tipsMsg.nodata, 3000));
//         });
//     }
//     getMap() {
//         const that = this;
//         let key = that.model.key ? that.model.key : '';
//         this._service.getList(this.otherUrl.map, { psopm_Key: key }, function (result) {
//             that.pormType = result.data;
//             const psorm = result.data.filter(s => s.isdefault == true);
//             if (psorm && psorm.length > 0) {
//                 that.newmodel.psorm_key = psorm[0].key;
//                 that.newmodel.psorm_name = psorm[0].name;
//                 that.newmodel.psorm_isdefault = psorm[0].isdefault;
//             }
//         });
//     }
//     mapselect(e) {
//         if (e) {
//             const por = this.pormType.find(po => po.key == e);
//             if (por) {
//                 this.newmodel.psorm_isdefault = por.isdefault;
//                 this.newmodel.psorm_name = por.name;
//             }
//         }
//     }
// }