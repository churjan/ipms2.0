import { Component, EventEmitter, Output } from "@angular/core";
import { FormTemplateComponent } from "~/shared/common/base/form-Template.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, Validators } from "@angular/forms";
import { TransferDirection, TransferItem } from "ng-zorro-antd/transfer";

@Component({
    selector: 'TaskOutEdit',
    templateUrl: './TaskOutEdit.component.html',
    styleUrls: ['./TaskOutEdit.component.less']
})
export class TaskOutEditComponent extends FormTemplateComponent {
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
    /**布局结构参数 */
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', child: 'sonlist', url: 'LayoutStructure/extend' };
    /**树状站位筛选条件 */
    stationRailtree = { maketree: true, moduletype: 101 };
    stations: Array<any> = []
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
            som_key: [{ value: null, disabled: this.Disable }],
            pwb_key: [{ value: null, disabled: this.Disable }],
            psi_key: [{ value: null, disabled: this.Disable },],
            pci_key: [{ value: null, disabled: this.Disable },],
            psz_key: [{ value: null, disabled: this.Disable },],
            bpi_key: [{ value: null, disabled: this.Disable },],
            inventory_type: [{ value: null, disabled: this.Disable }],
            num: [{ value: null, disabled: this.Disable }, Validators.compose([, Validators.min(0), Validators.pattern('^(?!0$).*')])],
            wwti_list: [null, [Validators.required]],
            key: [null]
        })
    }
    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title);
        this.stationSelected = []
        this.transferData = []
        if (record.node && record.node.key) {
            this.key = record.node.key;
            this._service.getModel(this.modular.url, this.key, (result) => {
                this.validateForm.patchValue(result)
                this.validateForm.controls.num.disable()
                this.Disable = true;
                //获取当前剩下的所有站位（因为中间可能有被删除了），然后在已选站位中也要删掉已经被删除的站位
                const totalkeys = this.stations.map(({ key }) => key)
                if (result.wwti_list instanceof Array) {
                    this.stationSelected = result.wwti_list.filter(({ out_infeed_key }) => totalkeys.includes(out_infeed_key))
                    let data = new Array()
                    result.wwti_list.forEach(item => {
                        const direction: TransferDirection = 'right'
                        const temp = {
                            title: item.out_infeed_name,
                            code: item.out_infeed_code,
                            direction: direction,
                            checked: false,
                            key: item.out_infeed_key
                        }
                        this.stationSelected.push(item);
                        data.push(temp)
                    })
                    this.transferData = this.transferData.concat(data)
                }
            }, (eer) => { });
        } else if(record.node){ this.validateForm.patchValue(record.node) }
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
            let body = Object.assign({}, { pkey: ev.key, maketree: true, moduletype: 101, BLST_Group: 'Station' });
            this._service.comList('LayoutStructure/extend', body, 'NewGetList').then((response: any) => {
                if (response[0].sonlist) {
                    response[0].sonlist.forEach(l => {
                        if (l.sonlist)
                            this.stations.push(...l.sonlist)
                    })
                }
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
                    out_infeed_name: item.title,
                    out_infeed_code: item.code,
                    out_infeed_key: item.key
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

    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false

        if (!event || event.key == "Enter") {
            this.validateForm.patchValue({ wwti_list: this.stationSelected })
            let model: any = {}
            this.submit();
            if (this.validateForm.status == 'VALID') {
                model = Object.assign({}, this.model, this.validateForm.value);
            } else { return }

            this.submiting = true;
            super.save({ model: model }, (v) => {
                this.editDone.emit(true)
                this.close()
            });
        }
    }
    close(): void {
        this.validateForm.reset()
        this.validateForm.controls.num.enable();
        this.stations = new Array();
        this.Disable = false;
        this.visible = false
    }
}