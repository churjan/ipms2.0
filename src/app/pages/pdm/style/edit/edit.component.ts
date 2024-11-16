import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent extends FormTemplateComponent {
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', url: 'StyleClass' }

    @Output() editDone = new EventEmitter<boolean>()
    title: string
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    submiting: boolean = false
    key: string
    workTypes: Array<any> = []
    educations: Array<any> = []
    nations: Array<any> = []
    marriages: Array<any> = []
    avatar: string
    /** */
    tabs: Array<{ name: string; content: string; disabled: boolean }> = [];
    selectedIndex = 0;
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
    ) { super() }

    ngOnInit(): void {
        this.tabs = this.modular.tabinfo;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            psc_key: [null],
            companyname: [null],
            brand: [null],
            year: [null],
            season: [null],
            sex: [null],
            designer: [null],
            barcode: [null],
            producemode: [null],
            description: [null, [Validators.maxLength(200)]],
            custom_code: [null],
            default_binding_qty: [null],
            key: [null]
        })
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node && record.node.key) {
            this.key = record.node.key
            this._service.getModel(this.modular.url, this.key, (response: any) => {
                this.validateForm.patchValue(response)
            })
        } else {
            this.key = null
        }
        this.visible = true
    }
    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false

        if (!event || event.key == "Enter") {
            let model: any = {}
            this.submit();
            if (this.validateForm.status == 'VALID') {
                model = Object.assign({}, this.model, this.validateForm.value);
            } else { this.submiting = false; return }
            this.submiting = true;
            super.save(null, (v) => {
                this.submiting = false;
                this.editDone.emit(true)
                this.close();
            });
        }
    }

    close(): void {
        this.validateForm.reset()
        this.submiting = false;
        this.avatar = null
        this.visible = false
    }


}
