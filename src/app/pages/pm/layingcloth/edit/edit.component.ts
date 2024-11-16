import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { UtilService } from '~/shared/services/util.service';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent extends FormTemplateComponent {

    @Output() editDone = new EventEmitter<boolean>()
    pfsrd_list: any = new Array();
    use_list: any = new Array();
    tab = 0;
    count = { time: 0, key: '' };
    isPreview: boolean = false;
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
    ) { super() }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            key: [null],
            code: [UtilService.dateFormat(new Date(), 'yyyyMMddHHmmssfff'), [Validators.required]],
            bed_no: [null, [Validators.required]],
            cloth_width: [null, [Validators.required]],
            cloth_length: [null, [Validators.required]],
            maker_code: [null],
            maker_length: [null],
            request_quantity: [null],
            real_quantity: [{ value: null, disabled: true }, [Validators.required]],
            pfsrd_list: [[]],
            create_hei_key: [sessionStorage.userkey],
            create_hei_name: [sessionStorage.username],
            create_time: [UtilService.dateFormat(new Date())],
            state: [0],
            state_name: [this.getTipsMsg('placard.new_built')]
        })
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node && record.node.key) {
            this.key = record.node.key
            this._service.getModel(this.modular.url, this.key, (response: any) => {
                this.validateForm.patchValue(response)
                let realnum = 0;
                response.pfsrd_list.forEach(vp => {
                    vp.itself = {
                        code: vp.pwb_code,
                        psi_key: vp.psi_key,
                        psi_name: vp.psi_name,
                        pci_name: vp.pci_name,
                        psz_name: vp.psz_name,
                        quantity: vp.quantity,
                    }
                    vp.pfsur_list.forEach(pfsu => {
                        realnum = realnum + pfsu.real_quantity;
                    });
                })
                this.validateForm.patchValue({ real_quantity: realnum })
                this.count = { time: 0, key: '' };
                this.pfsrd_list = response.pfsrd_list;
            })
        } else {
            this.key = null;
            this.validateForm.patchValue(record.node)
        }
        this.visible = true
    }
    onSelect(event, item) {
        if (event && event.key != '') {
            item.pwb_code = event.code;
            item.psi_name = event.psi_name;
            item.pci_name = event.pci_name;
            item.psz_name = event.psz_name;
            item.quantity = event.quantity;
        }
    }
    i = 0;
    editId: string | null = null;
    adddetail(list = [], m?): void {
        if (!m) {
            if (this.pfsrd_list.length > 0) { this.i = this.pfsrd_list.length + 1; }
            if (this.pfsrd_list[this.i - 2] && (this.pfsrd_list[this.i - 2]['pwb_key'] == '' || this.pfsrd_list[this.i - 2]['quantity'] == 0)) {
                this.message.error(this.getTipsMsg('warning.Pleasecomplete'));
                return;
            }
            this.pfsrd_list = [
                { id: `${this.i}`, pwb_key: '', psi_name: '', pci_name: '', psz_name: '', quantity: 0 },
                ...this.pfsrd_list
            ];
            this.startEdit(`${this.i}`);
            this.i++;
        } else {
            if (list.length > 0) { this.i = list.length + 1; }
            if (list[this.i - 2] && (list[this.i - 2]['psz_key'] == '' || list[this.i - 2]['quantity'] == 0)) {
                this.message.error(this.getTipsMsg('warning.Pleasecomplete'));
                return;
            }
            this.pfsrd_list[this.editId].pfsur_list = [{ id: `${this.i}` }, ...list];
        }
    }
    startEdit(id: string): void {
        this.editId = id;
    }
    stopEdit(): void {
        let quantity = this.pfsrd_list.reduce((p, k) => {
            Object.keys(p).forEach(l => p[l] += k.quantity)
            return p
        }, { quantity: 0 })
        this.validateForm.patchValue(quantity)
        this.editId = null;
        this.pfsrd_list.forEach((l, i) => l.id = i + 1);
    }
    openExt(item, ev, i) {
        this.tab = 99;
        if (!item.pfsur_list) { item.pfsur_list = []; }
        this.editId = item.id ? item.id : i;
        if (!this.pfsrd_list[this.editId]) { this.pfsrd_list[this.editId] = []; }
        this.pfsrd_list[this.editId].pfsur_list = item.pfsur_list;
    }
    returnup() {
        this.tab = 0;
    }
    totalc(sod_list?) {
        let realnum = 0;
        this.pfsrd_list.forEach(sl => {
            sl.pfsur_list.forEach(pfsu => {
                realnum = realnum + pfsu.real_quantity;
            });
        });
        this.validateForm.patchValue({ real_quantity: realnum })
        this.model.real_quantity = realnum;
    }
    del(sod_list = [], i, m?) {
        let _list = sod_list.filter((k, num) => num !== i);
        if (!m)
            this.pfsrd_list = _list ? _list : [];
        else
            this.pfsrd_list[this.editId].pfsur_list = _list ? _list : [];
    }
    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false
        if (!event || event.key == "Enter") {
            if (!this.pfsrd_list || this.pfsrd_list.length <= 0) {
                this.message.error(this.getTipsMsg('inputdata.input_pfialod'));
                return;
            }
            if (this.pfsrd_list.length > 0) {
                let validity = [
                    { fild: "pwb_key", tigmsg: "check_pwb" },
                    { fild: "quantity", tigmsg: "input_total" },
                    { fild: "pfsur_list", tigmsg: "input_pfialod" }]
                if (this.pfsrd_list.find((pf, i) => this.Test(pf, validity, i) == false)) { return; }
            }
            this.validateForm.patchValue({ pfsrd_list: this.pfsrd_list })
            let model: any = {}
            this.submit();
            if (this.validateForm.status == 'VALID') {
                model = Object.assign({}, this.model, this.validateForm.value);
            } else { this.submiting = false; return }
            this.submiting = true;
            super.save({ model: model }, () => {
                this.submiting = false;
                this.editDone.emit(true)
                this.close();
            });
        }
    }

    Test(model, validity = this.modular.validity, i?, Empty = true): boolean {
        const that = this;
        let _results: boolean = true;
        validity.forEach(by => {
            let bf = typeof by == 'object' ? by.fild : by;
            if (_results == false) { return; }
            /**判空 */
            if (Empty == true && UtilService.isEmpty(model[bf]) == true) {
                _results = false;
                let _t = this.getTipsMsg('inputdata.input_xx', this.getTipsMsg('pmLayingcloth.' + bf));
                that.message.error(i ? this.getTipsMsg('placard.No') + i : '' + _t);
                return;
            }
            if (UtilService.isEmpty(model[bf]) == true) { return false; }
        });
        return _results;
    }
    detail_cutting: any[] = [];
    list_WorkPlan: any[] = [];
    list_cloth: any[];
    list_cutting: any;
    detail_cut: any;
    preview() {
        this.isPreview = true;
        this.list_cloth = new Array();
        this.list_cutting = new Array();
        this.detail_cut = new Array();
        this.list_WorkPlan = new Array();
        if (this.isPreview != true) {
            this._service.getModel(this.modular.url, this.validateForm.value.key, (result) => {
                this.model = result.data;
            }, function () { });
            this._service.getList(this.otherUrl.cutUrl, { pfsrm_key: this.model.key }, (params) => {
                this.list_cutting = params.data;
            }, function (err) { })
        } else {
            let realnum = 0;
            this.pfsrd_list.forEach(sl => {
                sl.pfsur_list.forEach(pfsu => {
                    realnum = realnum + pfsu.real_quantity;
                });
            });
            this.model = Object.assign(this.model, this.validateForm.value, { real_quantity: realnum })
            if (!this.model.pfsrd_list) this.model.pfsrd_list = [];
            this.list_WorkPlan = this.model.pfsrd_list ? this.model.pfsrd_list : [];
        }
    }
    Track(data, i) {
        this.detail_cutting = [];
        if (!this.list_WorkPlan) { return; }
        this.list_cloth = !data.pfsur_list ? [] : data.pfsur_list;
        if (this.list_cutting && this.list_cutting.details) {
            this.list_cutting.details.forEach(wd => {
                if (wd.pfsrd_key === data.key) {
                    this.detail_cut = wd;
                    this.detail_cutting.push(this.detail_cut);
                }
            });
        }
    }
    close(): void {
        this.validateForm.reset();
        this.isPreview = false;
        this.pfsrd_list = [];
        this.tab = 0;
        this.avatar = null
        this.visible = false
    }


}
