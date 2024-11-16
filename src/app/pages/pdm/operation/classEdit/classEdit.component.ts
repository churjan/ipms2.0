import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';

@Component({
    selector: 'classEdit',
    templateUrl: './classEdit.component.html',
    styleUrls: ['./classEdit.component.less']
})
export class ClassEditComponent extends FormTemplateComponent {

    @Output() editDone = new EventEmitter<boolean>();
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', url: 'OperationClass' }
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
    selectedIndex = 27;
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private appService: AppService,
    ) { super(); }

    ngOnInit(): void {
        for (let i = 0; i < 8; i++) {
            this.tabs.push({
                name: `Tab ${i}`,
                disabled: i === 28,
                content: `Content of tab ${i}`
            });
        }
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            key: [null],
            pkey: [null],
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            isdefault: [null],
            description: [null]
        })
    }

    async open(record: any) {
        this.title = this.appService.translate("btn." + record.title)
        if (record.node && record.node.key) {
            this.key = record.node.key
            this._service.getModel(this.modular.otherUrl[this.Nickname], this.key, (response: any) => {
                if (response) {
                    this.validateForm.patchValue(response)
                }
            })
        } else {
            this.key = null;
            this.validateForm.setValue({
                key: null,
                pkey: record.node.pkey || null,
                name: null,
                code: null,
                isdefault: null,
                description: null
            })
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
            const { pkey, key } = this.validateForm.value;
            if (pkey && key && pkey == key) {
                this.message.error(this.getTipsMsg('warning.icbcfo'))
                this.submiting = false;
                return
            }
            this.submiting = true
            super.save({ url: this.modular.otherUrl[this.Nickname], model: model }, (v) => {
                this.editDone.emit(this.key ? false : true);
                this.submiting = false;
                this.close()
            });
        }
    }

    close(): void {
        this.validateForm.reset()
        this.avatar = null
        this.visible = false
    }


}
