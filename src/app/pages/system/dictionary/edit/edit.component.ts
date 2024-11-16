import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { AppService } from '~/shared/services/app.service';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent extends FormTemplateComponent {
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', url: 'classdata' }

    @Input() set _model(value) {
        this.key = null
        if (value) {
            const data = JSON.parse(JSON.stringify(value))
            if (Object.keys(data).length > 0) {
                const form = {
                    key: data.key || null,
                    pkey: data.pkey || null,
                    pcode: data.pcode || null,
                    name: data.name || null,
                    code: data.code || null,
                    sort: data.sort || 100,
                    description: data.description || null,
                }
                if (data.key) {
                    this.key = data.key
                }
                this.validateForm.patchValue(form)
            }
        }
    }
    @Output() onUpdate = new EventEmitter()
    @Output() onAdd = new EventEmitter()
    @Input() treeData: any[]
    validateForm!: FormGroup
    submiting: boolean = false
    contextButton: any
    key: string = null

    constructor(
        private fb: FormBuilder,
        private appService: AppService
    ) { super() }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            key: [null],
            pkey: [null],
            pcode: [null],
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            description: [null, [Validators.maxLength(100)]],
            sort: [100]
        })
    }
    upset(event) {
        if (event)
            this.validateForm.patchValue({ pcode: event.code })
    }
    submitForm() {
        if (this.submiting) return false
        this.submiting = true
        super.save(null, (sucess) => {
            if (this.onUpdate) this.onUpdate.emit(sucess)
            this.reset()
        })
    }

    reset() {
        this.validateForm.reset()
        const value = this.validateForm.value
        value.sort = 100
        this.validateForm.setValue(value)
        this.key = null
        this.submiting = false
    }


}
