import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
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
            key: [null],
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            companyname: [null],
            phone: [null],
            class: [null],
            address: [null],
            moblile: [null],
            fax: [null],
            email: [null],
            postcode: [null],
            contactername: [null]
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
            this.submiting = true
            super.save(null, () => {
                this.submiting = false;
                this.editDone.emit(true)
                this.close();
            });
        }
    }

    close(): void {
        this.validateForm.reset()
        this.avatar = null
        this.visible = false
    }


}
