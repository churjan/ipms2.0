import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from '~/shared/services/app.service';
import { ParameterService } from '~/pages/system/parameter/parameter.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonService } from '~/shared/services/http/common.service';

@Component({
    selector: 'JsonFile',
    templateUrl: './JsonFile.component.html',
    styleUrls: ['./JsonFile.component.less']
})
export class JsonFileComponent implements OnInit {

    @Output() editDone = new EventEmitter<boolean>()
    title: string
    width: string
    visible: boolean = false
    validateForm!: FormGroup;
    listOfControl: Array<{ id: number; controlInstance: string }> = [];
    submiting: boolean = false
    key: string
    types: Array<any>
    constructor(
        private fb: FormBuilder,
        private parameterService: ParameterService,
        private breakpointObserver: BreakpointObserver,
        private appService: AppService,
        private commonService: CommonService
    ) { }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '500px'
            } else {
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            type: [null, [Validators.required]],
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            value: [null, [Validators.required]],
            description: [null, [Validators.maxLength(100)]],
            sort: [100, [Validators.required]]
        })
    }
    addField(e?: MouseEvent): void {
        if (e) {
            e.preventDefault();
        }
        const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

        const control = {
            id,
            controlInstance: `passenger${id}`
        };
        const index = this.listOfControl.push(control);
        this.validateForm.addControl(
            this.listOfControl[index - 1].controlInstance,
            new FormControl(null, Validators.required)
        );
    }

    removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
        e.preventDefault();
        if (this.listOfControl.length > 1) {
            const index = this.listOfControl.indexOf(i);
            this.listOfControl.splice(index, 1);
            this.validateForm.removeControl(i.controlInstance);
        }
    }
    async open(record: any) {
        await this.commonService.enum("systemparametertype").then((response: any) => {
            this.types = response
        })
        this.title = record ? this.appService.translate("update") : this.appService.translate("add")
        if (record) {
            this.key = record.key
            this.parameterService.get(record.key).then(response => {
                this.validateForm.setValue(response)
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
            this.appService.formSubmit(this.validateForm, this.parameterService, this.key).then(() => {
                this.editDone.emit(this.key ? false : true)
                this.close()
            }).finally(() => {
                this.submiting = false
            })
        }
    }

    close(): void {
        this.validateForm.reset()
        this.visible = false
    }

}
