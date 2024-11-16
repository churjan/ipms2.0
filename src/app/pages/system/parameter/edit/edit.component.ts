import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '~/shared/services/app.service';
import { ParameterService } from '~/pages/system/parameter/parameter.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonService } from '~/shared/services/http/common.service';
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
    types: Array<any>
    customlist: Array<any>;
    model: any = {}
    constructor(
        private fb: FormBuilder,
        private parameterService: ParameterService,
        private breakpointObserver: BreakpointObserver,
        private appService: AppService,
        private commonService: CommonService,
    ) { super(); }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '80%'
            } else {
                this.width = '99%'
            }
        })
        this.validateForm = this.fb.group({
            key: [null],
            type: [null, [Validators.required]],
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            alternativetype: [null, [Validators.required]],
            alternativevalues: [''],
            valueslist: [[]],
            value: [null, [Validators.required]],
            description: [null],
            sort: [100]
        })
    }

    async open(record: any) {
        await this.commonService.enum("systemparametertype").then((response: any) => {
            this.types = response
        })
        this.title = this._appService.translate("btn." + record.title)
        if (record.node) {
            this.key = record.node.key
            this.parameterService.get(record.node.key).then(response => {
                if (response['alternativetype'] == 'customselect')
                    response['valueslist'] = response['alternativevalues'] ? JSON.parse(response['alternativevalues']) : [];
                this.model = Object.assign({}, response)
                if (this.model.alternativetype == 'switch')
                    this.model.value = this.model.value == 'true' ? true : false
                this.validateForm.patchValue(response)
            })
        } else {
            this.key = null
        }
        this.visible = true
    }
    changConversion(id, ev) {
        if (ev && this.model.alternativetype != this.validateForm.get('alternativetype').value) {
            this.model.alternativetype = ev.code;
            this.model.alternativevalues = null;
            this.model.value = '';
            if (this.model.alternativetype == 'switch') {
                this.model.value = false;
                this.validateForm.patchValue({ value: false })
            }
            this.validateForm.patchValue({ alternativetype: ev.code, alternativevalues: '' })
        } else {
            this.model = Object.assign(this.model, this.validateForm.value);
        }
        // this.model[id] = this.validateForm.get(id).value;
        // this.submitForm(ev);
    }
    submitForm(event?: KeyboardEvent) {
        if (this.model.alternativetype == 'customselect') {
            this.validateForm.patchValue({ alternativevalues: JSON.stringify(this.model.valueslist) })
            this.model.alternativevalues = JSON.stringify(this.model.valueslist);
            this.validateForm.patchValue(this.model)
        }
        if (this.model.alternativetype == 'json') {
            try {
                JSON.parse(this.model.value);
            } catch (e) {
                return this.message.error(this.getTipsMsg('warning.jsonFormat'))
            }
        }
        if (this.submiting) return false
        if (!event || event.key == "Enter") {
            this.submiting = true
            this.appService.formSubmit(this.validateForm, this.parameterService, this.key).then(() => {
                this.editDone.emit(this.key ? false : true)
                this.close()
            }).finally(() => {
                this.submiting = false
            })
        }
    }

    close(): void {
        this.validateForm.reset();
        this.model = {};
        this.visible = false
    }

}
