import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '~/pages/hr/employee/employee.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { CommonService } from '~/shared/services/http/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';

@Component({
    selector: 'classEdit',
    templateUrl: './classEdit.component.html',
    styleUrls: ['./classEdit.component.less']
})
export class ClassEditComponent extends FormTemplateComponent {

    @Output() editDone = new EventEmitter<boolean>();
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', url: 'styleclass' }
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
            pkey: [null],
            key: [null],
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            description: [null]
        })
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record && record.node.key) {
            this.key = record.node.key
            this._service.getModel(this.modular.otherUrl[this.Nickname], this.key, (response: any) => {
                if (response) {
                    this.validateForm.patchValue(response)
                }
            })
        } else {
            this.key = null;
            this.validateForm.patchValue({ pkey: record.node ? record.node.pkey : null })
        }
        this.visible = true
    }

    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false

        if (!event || event.key == "Enter") {
            const { pkey, key } = this.validateForm.value;
            if (pkey && key && pkey == key) {
                this.message.error(this.getTipsMsg('warning.icbcfo'))
                this.submiting = true;
                return
            }
            let model: any = {}
            this.submit();
            if (this.validateForm.status == 'VALID') {
                model = Object.assign({}, this.model, this.validateForm.value);
            } else { this.submiting = false; return }
            this.submiting = true
            super.save({ url: this.otherUrl.class,model:model }, (v) => {
                this.editDone.emit(this.key ? false : true);
                this.submiting = false;
                this.close()
            })
        }
    }

    close(): void {
        this.validateForm.reset()
        this.avatar = null
        this.visible = false
    }


}
