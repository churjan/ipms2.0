import { Component, EventEmitter, Output } from "@angular/core";
import { FormTemplateComponent } from "~/shared/common/base/form-Template.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, Validators } from "@angular/forms";
import { TransferDirection, TransferItem } from "ng-zorro-antd/transfer";

@Component({
    selector: 'planedit',
    templateUrl: './planedit.component.html',
    styleUrls: ['./planedit.component.less']
})
export class PlanEditComponent extends FormTemplateComponent {
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver
    ) { super(); }
    @Output() editDone = new EventEmitter<boolean>()
    /**是否禁用 */
    Disable: boolean = false;
    /**出货口 */
    transferData: TransferItem[] = []
    stationSelected: Array<any> = []
    /**方案配置 */
    planlist: Array<any> = []
    /**布局结构参数 */
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', child: 'sonlist', url: 'LayoutStructure/extend' };
    /**树状站位筛选条件 */
    stationRailtree = { maketree: true, moduletype: 101 };
    stationType: any;
    stations: Array<any> = []
    nzSelectedIndex = 0;
    $asTransferItems = (data: unknown) => data as TransferItem[]
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '99%'
            } else {
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            code: [{ value: null, disabled: this.Disable }, [Validators.required]],
            name: [{ value: null, disabled: this.Disable }, [Validators.required]],
            state: [{ value: null, disabled: this.Disable },],
            type: [null],
            start_time: [{ value: null, disabled: this.Disable },],
            requestdeliverydate: [{ value: null, disabled: this.Disable },],
            level: [null],
            remark: [{ value: null, disabled: this.Disable }],
            quantity: [null, Validators.compose([, Validators.min(0), Validators.pattern('^(?!0$).*')])],
            routes: [null],
            outrelations: [[]],
            inboundtime: [null, Validators.compose([, Validators.min(0), Validators.pattern('^(?!0$).*')])],
            key: [null]
        })
    }
    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title);
        this.stationSelected = []
        this.transferData = []
        await this._service.comList('classdata', { pcode: "outtimerroute" }).then(response => {
            this.stationType = response.data[0].code;
        })
        if (record.node && record.node.key) {
            this.key = record.node.key;
            this._service.getModel(this.modular.url, this.key, (result) => {
                this.validateForm.patchValue(result)
                this.validateForm.controls.code.disable()
                this.validateForm.controls.name.disable()
                // this.validateForm.controls.quantity.disable()
                this.Disable = true;
                //获取当前剩下的所有站位（因为中间可能有被删除了），然后在已选站位中也要删掉已经被删除的站位
                const totalkeys = this.stations.map(({ key }) => key)
                if (result.routes instanceof Array) {
                    this.stationSelected = result.routes.filter(({ out_infeed_key }) => totalkeys.includes(out_infeed_key))
                    let data = new Array()
                    result.routes.forEach(item => {
                        const direction: TransferDirection = 'right'
                        const temp = {
                            title: item.bls_name,
                            code: item.bls_code,
                            direction: direction,
                            checked: false,
                            key: item.bls_key
                        }
                        this.stationSelected.push(item);
                        data.push(temp)
                    })
                    this.transferData = this.transferData.concat(data)
                    let pdata = new Array()
                    result.outrelations.forEach(item => {
                        const temp = {
                            wwor_name: item.wwor_name,
                            wwor_key: item.wwor_key,
                            quantity: item.quantity,
                            key: item.wwopor_key
                        }
                        pdata.push(temp)
                    });
                    this.planlist = this.planlist.concat(pdata)
                }
            }, (eer) => { });
        }
        this.visible = true
    }
    onSelect(ev) {
        if (ev) {
            this.validateForm.patchValue({ som_key: ev.som_key, psi_key: ev.psi_key, pci_key: ev.pci_key, psz_key: ev.psz_key })
        }
    }
    filterOption(inputValue: string, item: any): boolean {
        return item.title.indexOf(inputValue) > -1
            || item.code.indexOf(inputValue) > -1
            || item.pname.indexOf(inputValue) > -1
    }
    getstation(ev) {
        if (ev) {
            // this.commonService.structures({ path: ev.key, blst_group: 'In', stationtype: this.stationType }).then((response: any) => {
            //     this.stations = response;
            //     let data = new Array()
            //     this.stations.forEach(item => {
            //         const temp = {
            //             title: item.name,
            //             code: item.code,
            //             pname: item.pname,
            //             direction: 'left',
            //             checked: false,
            //             key: item.key
            //         }
            //         data.push(temp)
            //     })
            //     this.transferData = this.transferData.concat(data)
            // })
            let body = Object.assign({}, { path: ev.key, blst_group: 'In', stationtype: this.stationType });
            this._service.comList('w_LayoutStructure', body, 'getlist').then((response: any) => {
                // if (response[0].sonlist) {
                //     response[0].sonlist.forEach(l => {
                //         if (l.sonlist)
                //             this.stations.push(...l.sonlist)
                //     })
                // }
                // let data = new Array()
                // this.stations.forEach(item => {
                //     const temp = {
                //         title: item.name,
                //         code: item.code,
                //         pname: item.pname,
                //         direction: 'left',
                //         checked: false,
                //         key: item.key
                //     }
                //     data.push(temp)
                // })
                this.stations = response;
                let data = new Array()
                this.stations.forEach(item => {
                    const temp = {
                        title: item.name,
                        code: item.code,
                        pname: item.pname,
                        direction: 'left',
                        checked: false,
                        key: item.key
                    }
                    data.push(temp)
                })
                this.transferData = this.transferData.concat(data)
            })
        }
    }
    transferChange(ret: any): void {
        if (ret.from == "left" && ret.to == "right" && ret.list) {
            ret.list.forEach(item => {
                this.stationSelected.push({
                    bls_name: item.title,
                    bls_code: item.code,
                    bls_key: item.key
                })
            })
        } else if (ret.from == "right" && ret.to == "left" && ret.list) {
            ret.list.forEach(({ key }) => {
                const index = this.stationSelected.findIndex(({ out_infeed_key }) => out_infeed_key == key)
                if (index >= 0) {
                    this.stationSelected.splice(index, 1)
                }
            })
        }
    }

    submitForm(event?: KeyboardEvent, i?) {
        if (this.submiting) return false
        if (!event || event.key == "Enter") {
            let { key } = this.validateForm.value;
            let model: any = {}
            // if (this.nzSelectedIndex == 1 && key) {
            //     if (this.planlist[i - 1] && (!this.planlist[i - 1].wwor_key || !this.planlist[i - 1].quantity)) {
            //         this.message.error(this.getTipsMsg('warning.Pleasecomplete'));
            //         return
            //     }
            //     let p = this.planlist[i];
            //     model = {
            //         key: p.key || '',
            //         wwop_key: key,
            //         wwor_key: p.wwor_key,
            //         quantity: p.quantity
            //     }
            //     this._service.saveModel('admin/w_warehouseoutboundplanrelation', 'post', model, (result) => {
            //         this.message.success(this.getTipsMsg('sucess.s_save'));
            //         this.submiting = false;
            //         this.planlist[i].key = result.key
            //     }, (msg) => { this.submiting = false });
            // } else {
            this.validateForm.patchValue({ routes: this.stationSelected, outrelations: this.planlist })
            this.submit();
            if (this.validateForm.status == 'VALID') {
                let { key, code, name, state, type, quantity, level, start_time, requestdeliverydate, remark } = this.validateForm.controls
                model = Object.assign({}, this.model, {
                    key: key.value,
                    code: code.value,
                    name: name.value,
                    state: state.value,
                    type: type.value,
                    quantity: quantity.value,
                    level: level.value,
                    start_time: start_time.value,
                    requestdeliverydate: requestdeliverydate.value,
                    remark: remark.value
                }, this.validateForm.value);
            } else { return }

            this.submiting = true;
            super.save({ model: model }, (v) => {
                // this.editDone.emit(true)
                this.close()
            });
            // }
        }
    }
    add() {
        if (this.planlist.length > 0 && !this.planlist[this.planlist.length - 1].wwor_key) {
            let { quantity } = this.validateForm.controls;
            if (quantity.value > 0 && !this.planlist[this.planlist.length - 1].quantity) {
                this.message.error(this.getTipsMsg('warning.Pleasecomplete'));
                return
            }
        }
        this.planlist = this.planlist.concat(...[{
            wwor_key: '',
            quantity: 0
        }]);
    }
    del(data, i) {
        // if (data.key) {
        //     this._service.deleteModel('admin/w_warehouseoutboundplanrelation/', [{ key: data.key }], (v) => {
        //         this.message.success(this.getTipsMsg('sucess.s_delete'))
        //         this.planlist = this.planlist.filter(pf => pf.key != data.key)
        //     })
        // } else {
        this.planlist = this.planlist.filter((pf, pi) => pi != i)
        // }
    }
    close(): void {
        this.validateForm.reset()
        this.validateForm.controls.code.enable();
        this.validateForm.controls.name.enable();
        this.stations = new Array();
        this.Disable = false;
        this.visible = false;
        this.planlist = new Array();
        this.nzSelectedIndex = 0;
        this.editDone.emit(false);
    }
}