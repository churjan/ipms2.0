import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    avatar: string
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
    ) { super() }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            station_code: [{ value: null, disabled: true }, [Validators.required]],
            pwb_code: [null, [Validators.required]],
            bpi_code: [null, [Validators.required]],
            sort: [null],
            enable: [null],
            key: [null]
        })
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node && record.node.key) {
            this.key = record.node.key
            this._service.getModel(this.modular.url, this.key, (response: any) => {
                this.validateForm.patchValue(response)
                this.model = Object.assign({}, response)
            })
        } else {
            this.key = null;
            this.model = Object.assign({}, record.node)
            this.validateForm.patchValue(record.node)
        }
        this.visible = true
    }
    onSelect(event) {
        this.validateForm.addControl('bpi_code', new FormControl(null, Validators.required))
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
            super.save({ model: model }, () => {
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
