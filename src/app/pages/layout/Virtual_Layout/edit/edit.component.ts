import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonService } from '~/shared/services/http/common.service';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { TransferChange, TransferItem, TransferSelectChange } from 'ng-zorro-antd/transfer';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent extends FormTemplateComponent {

    @Output() editDone = new EventEmitter<boolean>()
    key: string
    node: any = {};
    blslist: TransferItem[] = [];
    bvst_list: TransferItem[] = [];
    list: TransferItem[] = [];
    $asTransferItems = (data: unknown): TransferItem[] => data as TransferItem[];
    /**是否禁用 */
    Disable: boolean = false;
    seachbls: string = '';
    selectbls = new Array();
    selecttitle = "";
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        public commonService: CommonService
    ) { super(); }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            code: [{ value: null, disabled: this.Disable }, [Validators.required],],
            name: [{ value: null, disabled: this.Disable }, [Validators.required],],
            key: [null]
        })
        this.getBls({ blst_group: 'Line' }, (r) => { if (r) { r.forEach(bv => { bv.display = true; this.selectbls.push(bv); }); } });
    }
    getBls(other?, modlelist?) {
        let body = Object.assign({}, { keywords: this.seachbls }, other)
        this._service.comList('LayoutStructure/extend', body, 'NewGetList').then((r) => {
            if (modlelist) { modlelist(r) }
        })
    }
    clickItem(data) {
        this.selecttitle = data.code + '[' + data.name + ']'
        let body = Object.assign({}, { pkey: data.key, maketree: true, moduletype: 101, blst_group: 'Station' });
        this.getBls(body, (v) => {
            if (v) {
                this.list = this.list.filter(b => b.direction == 'right');
                this.blslist = v[0].sonlist;
                let _blslist = new Array();
                this.blslist.forEach(bv => {
                    bv.title = bv.code + '[' + bv.name + ']'
                    bv.direction = 'left';
                    let i = this.list.findIndex(b => b.direction == 'right' && b.bls_key == bv.key);
                    if (i < 0) {
                        _blslist.push(bv);
                    }
                });
                this.list = this.list.concat(_blslist);
            }
        });
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node) {
            this.key = record.node.key;
            this._service.getModel(this.modular.url, this.key, (response: any) => {
                this.validateForm.patchValue(response);
                this.model = response;
                let bvm = new Array();
                this.bvst_list = response.bvls_list;
                this.bvst_list.forEach(l => {
                    // if (l.group == 'Station') {
                    l.title = l.code + '[' + l.name + ']'
                    l.direction = 'right';
                    l.group = 'Station';
                    bvm.push(l);
                    // }
                });
                this.list = this.list.concat(bvm);
            })
        } else {
            this.key = null;
        }
        this.visible = true
    }

    change(ret: TransferChange): void {
        const listKeys = ret.list.map(l => l.key);
        const hasOwnKey = (e: TransferItem): boolean => e.hasOwnProperty('key');
        if (ret.to === 'left') {
            const Keys = ret.list.map(l => l.bls_key);
            this.bvst_list = this.bvst_list.filter(bv => !Keys.includes(bv.bls_key));
            let _blslist = new Array();
            const setlistKeys = this.bvst_list.map(l => l.bls_key);
            if (this.blslist && this.blslist.length > 0)
                this.blslist.forEach(bl => {
                    if (!setlistKeys.includes(bl.key)) {
                        bl.direction = 'left';
                        _blslist.push(bl)
                    }
                })
            let _bvst_list = this.bvst_list.filter(b => b.group == 'Station');
            this.list = _blslist.concat(_bvst_list);
        } else if (ret.to === 'right') {
            const setlistKeys = this.bvst_list.map(l => l.bls_key);
            let _blslist = this.blslist.filter(bv => !listKeys.includes(bv.key) && !setlistKeys.includes(bv.key));
            this.blslist.forEach(e => {
                if (listKeys.includes(e.key) && hasOwnKey(e)) {
                    this.bvst_list.unshift({
                        title: e.code + '[' + e.name + ']',
                        bls_pkey: e.pkey,
                        bls_key: e.key,
                        bls_name: e.name,
                        direction: 'right',
                        bls_code: e.code,
                        blst_key: e.blst_key,
                        group: e.group
                    })
                }
            })
            let _bvst_list = this.bvst_list.filter(b => b.group == 'Station');
            this.list = _blslist.concat(_bvst_list);
        }
    }
    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false
        if (!event || event.key == "Enter") {
            let model: any = {}
            this.submit();
            if (this.validateForm.status == 'VALID') {
                model = Object.assign({}, this.model, this.validateForm.getRawValue());
            } else {this.submiting = false; return }
            model.bvls_list = this.list.filter(l => l.direction = 'right')
            this.submiting = true
            super.save({ model: model }, (v) => {
                this.validateForm.patchValue(v);
                this.key = v.key
                this.submiting = false;
                this.title = this._appService.translate("btn.update")
            });
        }
    }

    close(): void {
        this.validateForm.reset();
        this.bvst_list = [];
        this.list = [];
        this.avatar = null
        this.selecttitle = '';
        this.blslist = [];
        this.visible = false;
        this.submiting = false;
        this.Disable = false;
        this.editDone.emit(false);
    }


}
