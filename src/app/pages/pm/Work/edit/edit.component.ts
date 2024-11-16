import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '~/pages/hr/employee/employee.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { CommonService } from '~/shared/services/http/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { UtilService } from '~/shared/services/util.service';
import { CommFlowthreeComponent } from '~/shared/common/comm-flow3/comm-flow3.component';
import { FlowLaminationComponent } from '../flowLamination/flowLamination.component';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent extends FormTemplateComponent {
    @ViewChild('flow3', { static: false }) _flow3: CommFlowthreeComponent;
    @ViewChild('flowLamination', { static: false }) _flowLamination: FlowLaminationComponent;
    @Output() editDone = new EventEmitter<boolean>()
    key: string
    node: any = {};
    nations: Array<any> = []
    marriages: Array<any> = []
    avatar: string
    /**是否禁用 */
    Disable: boolean = false;
    /** */
    tabs: Array<{ name: string; content: string; disabled: boolean }> = [];
    selectedIndex = 0;
    /**当天 */
    today = new Date();
    create_time = new Date();
    requestdeliverydate = null;
    workFlow: any = {}
    newworkFlow: any = Object.assign({}, { other_node: {}, type: 'W' })
    flowpower: any
    mappower: any;
    wages: any;
    attribute = new Array();
    /**是否显示新工序流 */
    isflowLamin: boolean = false;
    /**是否禁止新工序流 */
    disflowLamin: boolean = false;
    /**是否显示工序流 */
    isFlow: boolean = false;
    disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.create_time) < 0;
    disabledDate2 = (current: Date): boolean => {
        let v = this.validateForm.getRawValue();
        this.requestdeliverydate = v.requestdeliverydate;
        return differenceInCalendarDays(current, this.create_time) < 0 || differenceInCalendarDays(current, this.requestdeliverydate) > 0
    };
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        public commonService: CommonService
    ) { super(); }

    ngOnInit(): void {
        this.tabs = this.modular.workmenu;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            code: [{ value: null, disabled: this.Disable }],
            mixcode: [{ value: null, disabled: this.Disable }],
            // sci_key: [null],
            psi_key: [{ value: null, disabled: this.Disable }, [Validators.required],],
            pci_key: [{ value: null, disabled: this.Disable }, [Validators.required]],
            psz_key: [{ value: null, disabled: this.Disable }, [Validators.required]],
            quantity: [{ value: null, disabled: this.Disable }, [Validators.required]],
            start_time: [null, [Validators.required]],
            requestdeliverydate: [null, [Validators.required]],
            state: [{ value: null, disabled: this.Disable }],
            create_time: [{ value: null, disabled: this.Disable }],
            level: [null],
            // istransport: [{ value: null, disabled: this.Disable }],
            attributes: [null],
            remark: [null],
            key: [null]
        })
        this.flowpower = sessionStorage.process && sessionStorage.process == 'true' ? true : false;
        this.mappower = sessionStorage.processroute && sessionStorage.processroute == 'true' ? true : false;
        this.wages = sessionStorage.havewages && sessionStorage.havewages == 'true' ? true : false;
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        this._service.comList('w_customattribute/extend', {}, 'getattribute').then(v => {
            this.attribute = v;
        })
        this.isflowLamin = record.isflowLamin
        this.isFlow = record.isFlow
        if (record.node && record.node.key) {
            this.key = record.node.key;
            record.node.opp_type = record.node.opp_type ? record.node.opp_type : parseInt(sessionStorage.opp_type);
            this.workFlow = { title: 'PWRM', node: record.node, type: 'W', power: { Iscopy: true, IsUpdate: true, flowpower: this.flowpower, mappower: this.mappower } }
            this._service.getModel(this.modular.url, this.key, (response: any) => {
                // console.log(this.newworkFlow, response)
                if (this.isflowLamin == true) {
                    this._service.comList('WorkBillOperationProcess/Extend/GetByWorkbill', { pwb_key: response.key }).then((v) => {
                        let flowpower = sessionStorage.process && sessionStorage.process == 'true' ? true : false;
                        let mappower = sessionStorage.processroute && sessionStorage.processroute == 'true' ? true : false;
                        let wages = sessionStorage.havewages && sessionStorage.havewages == 'true' ? true : false;
                        this.newworkFlow = Object.assign(this.newworkFlow, {
                            node: {},
                            other_node: response,
                            power: {
                                Iscopy: true,
                                IsUpdate: record.node.state != 0 ? false : true,
                                wages: wages,
                                flowpower: flowpower,
                                mappower: mappower
                            },
                        })
                        if (v) {
                            this.newworkFlow = Object.assign(this.newworkFlow, {
                                title: 'PWRM',
                                node: {
                                    pwb_key: response.key,
                                    psi_key: response.psi_key,
                                    flowstate: true,
                                    state: response.state
                                }
                            })

                            this._service.getModel('admin/OperationProcessMaster/', v.popm_key, (s) => {
                                let { key, name, is_back_flow } = s
                                this.newworkFlow.node = Object.assign(this.newworkFlow.node, { key: key, name: name, is_back_flow: is_back_flow })
                                this.newworkFlow.worksectionlist = s.worksectionlist;
                                if (s.worksectionlist.length > 0) { this.newworkFlow.node.bwi_key = s.worksectionlist[0].bwi_key }
                            })
                            this.disflowLamin = false;
                        } else {
                            this.disflowLamin = true;
                            if (record.node.state == 0) {
                                this.newworkFlow = Object.assign(this.newworkFlow, { title: 'CPWRM', isNull: true })
                            } else {
                                this.message.error(this.getTipsMsg('warning.noNewcreate'))
                            }
                        }
                    })
                    // console.log(this.newworkFlow)
                }
                this.validateForm.patchValue(response);
                this.model = this.validateForm.value;
                if (record.node.state != 0) {
                    this.validateForm.controls.code.disable()
                    this.validateForm.controls.mixcode.disable()
                    this.validateForm.controls.quantity.disable()
                    this.Disable = true;
                }
                this.attribute.forEach(a => {
                    let { code, name, value, value_name, remark } = response.attributes.find(f => f.code == a.code)
                    a = Object.assign(a, { code, name, value, value_name, remark })
                })
                this.create_time = new Date(response.create_time);
                this.requestdeliverydate = new Date(response.requestdeliverydate);
            })
        } else if (record.node) {
            this.key = null;
            this.validateForm.patchValue(record.node)
            this.validateForm.patchValue({
                code: 'C' + record.node.code + '_1',
                create_hei_key: sessionStorage.userkey,
                create_name: sessionStorage.username,
                create_time: UtilService.dateFormat(new Date()),
                state: '0',
                state_name: this.getTipsMsg('placard.new_built')
            });
        } else {
            this.key = null;
            this._service.comList('getcode/workbill', {}).then((v) => {
                this.validateForm.patchValue({ code: v })
            })
            this.validateForm.controls.code.enable()
            this.validateForm.controls.mixcode.enable()
            this.validateForm.controls.quantity.enable()
            this.validateForm.patchValue({
                create_hei_key: sessionStorage.userkey,
                create_name: sessionStorage.username,
                create_time: UtilService.dateFormat(new Date()),
                state: '0',
                state_name: this.getTipsMsg('placard.new_built')
            });
        }
        this.visible = true
    }
    btnEvent(event) {
        switch (event.action) {
            case "flowLamin":
                let body: any = Object.assign({}, this.newworkFlow)
                let { psi_key, state } = this.validateForm.value;
                this._service.comList('WorkBillOperationProcess/Extend/GetByWorkbill', { pwb_key: this.key }).then((v) => {
                    body = Object.assign(body, { title: 'CPWRM', node: {} })
                    if (v) {
                        this.newworkFlow = Object.assign(this.newworkFlow, {
                            title: 'PWRM',
                            node: {
                                key: v.popm_key,
                                pwb_key: this.key,
                                psi_key: psi_key,
                                flowstate: true,
                                state: state
                            }
                        })
                        this._service.getModel('admin/OperationProcessMaster/', v.popm_key, (s) => {
                            let { key, name, is_back_flow } = s
                            body.node = Object.assign(this.newworkFlow.node, { key: key, name: name, is_back_flow: is_back_flow })
                            body.worksectionlist = s.worksectionlist;
                            if (s.worksectionlist.length > 0) { body.node.bwi_key = s.worksectionlist[0].bwi_key }
                            this._flow3.open(body);
                        })
                    } else {
                        if (event.node.state == 0) {
                            body.isNull = true;
                            this._flowLamination.open(body)
                        } else {
                            this.message.error(this.getTipsMsg('warning.noNewcreate'))
                        }
                    }
                })
                return
            case 'return':
                this._flowLamination.open(event.node)
                return
            case 'copyset':
                this._flowLamination.open(event.node)
                return
        }
    }

    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false

        if (!event || event.key == "Enter") {
            const { requestdeliverydate, start_time, create_time } = this.validateForm.value
            if (requestdeliverydate) {
                this.validateForm.patchValue({ requestdeliverydate: moment(requestdeliverydate).format("YYYY-MM-DD") })
            }
            if (start_time) {
                this.validateForm.patchValue({ start_time: moment(start_time).format("YYYY-MM-DD") })
            }
            if (create_time) {
                this.validateForm.patchValue({ create_time: moment(create_time).format("YYYY-MM-DD") })
            }
            if (this.attribute && this.attribute.length > 0) {
                let _attribute = new Array();
                this.attribute.forEach(a => {
                    const { code, name, value, value_name, remark } = a;
                    if (UtilService.isNotEmpty(value)) _attribute.push({ code, name, value, value_name, remark })
                })
                this.validateForm.patchValue({ attributes: _attribute })
            }
            let model: any = {}
            this.submit();
            if (this.validateForm.status == 'VALID') {
                model = Object.assign({}, this.model, this.validateForm.value);
            } else { return }

            this.submiting = true
            super.save({ model: model }, (v) => {
                this.validateForm.patchValue(v);
                this.create_time = new Date(v.create_time);
                this.requestdeliverydate = new Date(v.requestdeliverydate);
                this.key = v.key
                this.workFlow = { title: 'PWRM', node: v, type: 'W', power: { Iscopy: true, IsUpdate: true, flowpower: this.flowpower, mappower: this.mappower } }
                this.tabs[1].disabled = false;
                this.submiting = false;
                this.title = this._appService.translate("btn.update")
                this.selectedIndex = this.selectedIndex + 1;
            });
        }
    }

    close(): void {
        this.validateForm.reset()
        this.avatar = null
        this.visible = false;
        this.Disable = false
        this.attribute = new Array();
        this.validateForm.controls.code.enable()
        this.validateForm.controls.mixcode.enable()
        this.validateForm.controls.quantity.enable()
        this.editDone.emit(false);
    }


}
