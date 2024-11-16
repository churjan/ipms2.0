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
    /** */
    tabs: Array<{ name: string; content: string; disabled: boolean }> = [];
    selectedIndex = 27;
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver
    ) { super() }

    ngOnInit(): void {
        for (let i = 0; i < 3; i++) {
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
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            style: [null, [Validators.required]],
            standard_time: [null],
            standard_wages: [null],
            notspectaculars: [null],
            custom_code: [null],
            poc_key: [null],
            requrement: [null],
            qc_requrement: [null],
            description: [null],
            create_time: [null]
        })
    }

    async open(record: any) {
        this.title = record.node ? this._appService.translate("btn.update") : this._appService.translate("btn.add")
        if (record.node) {
            this.key = record.node.key
            if (this.key) {
                this._service.getModel(this.modular.url, this.key, (response: any) => {
                    this.validateForm.patchValue(response)
                })
            }
        } else {
            this.key = null
        }
        this.visible = true
    }

    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false
        if (!event || event.key == "Enter") {
            this.submiting = true;
            let model: any = {}
            this.submit();
            if (this.validateForm.status == 'VALID') {
                model = Object.assign({}, this.model, this.validateForm.value);
            } else { this.submiting = false; return }
            super.save({ url: this.modular.url, model: model }, (v) => {
                this.editDone.emit(this.key ? false : true);
                this.submiting = false;
                this.close()
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
