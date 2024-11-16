import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent extends FormTemplateComponent {
    setting = { DataFiled: 'code', pKey: 'pkey', DataTxt: 'name', url: 'w_customattribute/extend' }

    @Output() editDone = new EventEmitter<boolean>()
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
    ) { super() }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '55%'
            } else {
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            code: [null, [Validators.required]],
            name: [null],
            value: [null, [Validators.required]],
            value_name: [null, [Validators.required]],
            remark: [null, [Validators.maxLength(200)]],
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
            if (record.node) { this.validateForm.patchValue(record.node) }
            this.key = null
        }
        this.visible = true
    }
    onSelect(ev) {
        this.validateForm.patchValue({ name: ev.name})
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
