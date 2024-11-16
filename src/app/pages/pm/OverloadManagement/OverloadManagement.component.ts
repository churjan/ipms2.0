import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { CrudComponent } from "~/shared/common/crud/crud.component";
import { UtilService } from "~/shared/services/util.service";
import { ControllerComponent } from "./controller/controller.component";
import { HangerDetailComponent } from "./hangerdetail/hangerdetail.component";
import { ProgrammeComponent } from "./programme/programme.component";
import { setGroupingComponent } from "./setGrouping/setGrouping.component";

@Component({
    selector: 'OverloadManagement',
    templateUrl: './OverloadManagement.component.html',
    styleUrls: ['./OverloadManagement.component.less']
})
export class OverloadManagement extends ListTemplateComponent {
    constructor(public router: Router,) {
        super();
        this.modularInit("pmOverloadManagement", router.url.replace(/\//g, "_"));
    }
    @ViewChild('crud', { static: false }) _crud: CrudComponent;
    @ViewChild('controller', { static: false }) _controller: ControllerComponent;
    @ViewChild('hangerdetail', { static: false }) _hangerdetail: HangerDetailComponent;
    @ViewChild('programme', { static: false }) _programme: ProgrammeComponent;
    @ViewChild('setGrouping', { static: false }) _setGrouping: setGroupingComponent;
    /**超载站列表 */
    stationList = new Array();
    /**载具信息固定参数 */
    getBody: any = {}
    /**控制器列表 */
    controllerList = new Array();
    /**超载站列表 */
    setGroupList = new Array();
    /**方案列表 */
    programmeList = new Array();
    /**是否选择分组 */
    chackPog: boolean;
    /**绑定方案列表 */
    bindprogrammeList = new Array();
    /**选中对象 */
    seleckNode: any = Object.assign({})
    /**方案详细 */
    pro_detail = new Array();
    ngOnInit(): void {
        this.getGroup();
    }
    getGroup() {
        this._service.comList('OverloadGroup', {}, 'GetList').then((v) => {
            v.forEach(vi => {
                vi.active = true;
                if (vi.pos_list) {
                    vi.pos_list.forEach(vp => vp.running = vp.running != null ? vp.running : true)
                }
            })
            this.stationList = v;
        })

    }
    getProgramme(node) {
        this._service.getList('admin/LayoutStructureScheme/', node, (s) => {
            this.bindprogrammeList = s
            this._service.comList('LayoutStructureSchemeRules', { type: 3 }, 'getlist').then((v) => {
                s.forEach(vv => {
                    // console.log(v, s, s.filter(sp => sp.blsr_key != vv.key))
                    let _pro = v.findIndex(sp => vv.blsr_key == sp.key);
                    if (_pro >= 0) {
                        v.splice(_pro, 1)
                    }
                })
                this.programmeList = v;
            })
        })
    }
    getDetail(item) {
        item.chack = true;
        this.bindprogrammeList.forEach(bp => bp.chack = bp.blsr_key != item.blsr_key ? false : true)
        this.programmeList.forEach(p => p.chack = p.key != item.blsr_key ? false : true)
        this._service.comList('LayoutStructureSchemeRulesDetail', { blsr_key: item.blsr_key }, 'getlist').then(schdet => {
            this.pro_detail = schdet
        })
    }
    onclick(panel, field, ev) {
        if (panel) {
            this.getBody = {};
            this.pro_detail = new Array();
            if (field == 'bls_code') {
                this.chackPog = false;
                let { data, pog_key, pog_name } = panel
                this.stationList.forEach(s => {
                    s.check = false
                    if (s.key == pog_key) {
                        s.pos_list.forEach(pc => pc.check = data.bls_key == pc.bls_key ? true : false);
                    } else {
                        s.pos_list.forEach(pc => pc.check = false);
                    }
                })
                this.seleckNode = { bls_key: data.bls_key }
                this.getProgramme(this.seleckNode)
                this.getBody = Object.assign(this.getBody, { station_key: data.bls_key, pog_key: pog_key, pog_name: pog_name })
                setTimeout(() => {
                    this._crud.Search();
                }, 300);
            } else {
                this.chackPog = true;
                this.stationList.forEach(s => {
                    if (s.key == panel.key) {
                        s.check = true;
                    } else {
                        s.check = false
                    }
                    s.pos_list.forEach(pc => pc.check = false);
                })
                this.getBody = Object.assign(this.getBody, { pog_key: panel.key, pog_name: panel.name })
                this.btnEvent({ action: 'controller', node: this.getBody })
            }
            // console.log(this.stationList)
        }
    }
    btnEvent(event, ev?) {
        if (ev) ev.stopPropagation();
        switch (event.action) {
            case 'controller':
                this._service.getList(this.otherUrl.ControlScheme, { pog_key: event.node.pog_key }, (sucess) => {
                    let nopermit = sucess.filter(ns => ns.permit == false)
                    let permit = sucess.filter(s => s.permit == null || s.permit == true)
                    nopermit.sort((a, b) => a.sort = b.sort)
                    permit.sort((a, b) => a.sort = b.sort)
                    // console.log(nopermit, permit)
                    this.controllerList = new Array();
                    this.controllerList.push(...nopermit, ...permit)
                });
                break;
            case 'controller_add':
                this._controller.open({ title: event.action, node: event.node ? event.node : { pog_key: this.getBody.pog_key, pog_name: this.getBody.pog_name } })
                break;
            case 'controller_updata':
                event.node.permit = event.node.permit != null ? event.node.permit : true;
                let _cd = Object.assign({}, event.node, { pog_key: this.getBody.pog_key, pog_name: this.getBody.pog_name })
                this._controller.open({ title: event.action, node: _cd })
                break;
            case 'controller_del':
                const that = this;
                let delkey: any;
                let name: string;
                delkey = [event.node];
                name = event.node.blsr_name;
                if (delkey) {
                    this.Confirm('confirm.confirm_deln', name, (confirmType) => {
                        if (confirmType == 'pass') {
                            that._service.deleteModel(this.otherUrl.ControlScheme, delkey, (data) => {
                                this.message.success(this.getTipsMsg('sucess.s_delete'))
                                this.btnEvent({ action: 'controller', node: this.getBody })
                            }, function (msg) {
                                this.message.error(this.getTipsMsg('fail.f_delete'))
                            })
                        }
                    })
                }
                break;
            // case 'hangerdetail':
            //     this._hangerdetail.open({ title: event.action, node: event.node })
            //     break;
            case "switch":
                this._service.comPost('admin/OverloadGroup/Extend/SetRunning', { key: event.node.bls_key, running: event.ev }).then((s) => {
                    this.getGroup();
                })
                break;
            case "plusGroup_add":
                this._hangerdetail.open({ title: event.action })
                break;
            case "plusGroup_update":
                this._hangerdetail.open({ title: event.action, node: event.node })
                break;
            case "plusGroup_del":
                let Groupdelkey: any;
                let Groupname: string;
                Groupdelkey = [event.node];
                Groupname = event.node.name;
                if (Groupdelkey) {
                    this.Confirm('confirm.confirm_deln', Groupname, (confirmType) => {
                        if (confirmType == 'pass') {
                            this._service.deleteModel(this.otherUrl.OverloadGroup, Groupdelkey, (data) => {
                                this.message.success(this.getTipsMsg('sucess.s_delete'))
                                this.getGroup();
                            }, function (msg) {
                                this.message.error(this.getTipsMsg('fail.f_delete'))
                            })
                        }
                    })
                }
                break;
            case "setGrouping":
                // this._setGrouping.open({ title: event.action, node: event.node })
                this._service.comList('LayoutStructure/extend', { moduletype: 106, BLST_Group: 'Station' }, 'NewGetList').then((record) => {
                    this.setGroupList = record;
                })
                break;
            case "bls_del":
                let blskey: any;
                let blsname: string;
                blskey = [{ key: event.node.bls_key }];
                blsname = event.node.bls_name;
                if (blskey) {
                    this.Confirm('confirm.confirm_deln', blsname, (confirmType) => {
                        if (confirmType == 'pass') {
                            this._service.deleteModel(this.otherUrl.OverloadStation, blskey, (data) => {
                                this.message.success(this.getTipsMsg('sucess.s_delete'))
                                this.getGroup();
                            }, function (msg) {
                                this.message.error(this.getTipsMsg('fail.f_delete'))
                            })
                        }
                    })
                }
                break;
            case "hangid_del":
                let hangidkey: any;
                let hangidname: string;
                hangidkey = { carrier_code: event.node.carrier_code, infeed_code: event.node.destinationlocation_code };
                hangidname = event.node.carrier_code;
                if (hangidkey) {
                    this._service.comPost(this.otherUrl.carrierAbnormal, hangidkey).then((data) => {
                        this.message.success(this.getTipsMsg('sucess.s_delete'))
                        this._crud.Search();
                    }).catch(function (msg) {
                        this.message.error(this.getTipsMsg('fail.f_delete'))
                    })
                }
                break;
            // case "programme":
            //     this._service.getList('admin/LayoutStructureScheme/', { bls_key: event.node.bls_key }, (s) => {
            //         this._service.comList('LayoutStructureSchemeRules', { type: 3 }, 'getlist').then((v) => {
            //             let _gramme = new Array()
            //             v.forEach(vv => {
            //                 console.log(v, s, s.filter(sp => sp.blsr_key != vv.key))
            //                 let _pro = s.find(sp => sp.blsr_key == vv.key);
            //                 if (_pro) {
            //                     let { name, code, type } = vv;
            //                     _gramme.unshift({ isbinding: true, key: _pro.key, name, code });
            //                 } else
            //                     _gramme.push(vv)
            //             })
            //             this.programmeList = _gramme;
            //         })
            //     })
            //     break;
            default:
                break;
        }
        super.btnEvent(event);
    }
    saveScheme(item, data) {
        this._service.saveModel('admin/LayoutStructureScheme/', 'post', { bls_key: this.seleckNode.bls_key, blsr_key: item.key }, (S) => {
            this.message.success(this.getTipsMsg('sucess.s_save'));
            this.getProgramme(this.seleckNode)
            this.getGroup();
        })
    }
    delScheme(item, data) {
        this._service.deleteModel('admin/LayoutStructureScheme/', [item], (s) => {
            this.message.success(this.getTipsMsg('sucess.s_clean'))
            this.getProgramme(this.seleckNode);
            this.getGroup();
        })
    }
    submitForm(node, event?: KeyboardEvent) {
        if (!event || event.key == "Enter") {
            if (UtilService.isEmpty(node.key)) {
                this.message.error(this.getTipsMsg('checkdata.check_xx', 'pmOverloadManagement.key'));
                return
            }
            this._service.saveModel(this.otherUrl.OverloadStation, 'post', node, (result) => {
                this.message.success(this.getTipsMsg('sucess.s_save'));
                this.getGroup();
            }, (msg) => { });
        }
    }
}