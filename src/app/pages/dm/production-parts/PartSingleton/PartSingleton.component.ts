import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
    selector: 'PartSingleton',
    templateUrl: './PartSingleton.component.html',
    styleUrls: ['./PartSingleton.component.less'],
})
export class PartSingletonComponent extends FormTemplateComponent {
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver
    ) { super() }
    form!: FormGroup;
    isLoading = false;
    Disable = false;
    @Output() editDone = new EventEmitter<boolean>()


    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '30rem'
            } else {
                this.width = '100%'
            }
        })
        this.form = this.fb.group({
            key: [null, Validators.required],
            singleton_bpi_key: [null, Validators.required],
        });
        this.otherUrl = this.modular.otherUrl;
    }

    async open(record: any) {
        this.title = record.title;
        if (record.node) {
            this.key = record.node.key
            if (this.key) {
                this._service.getModel(this.otherUrl.PartSingleton, this.key, (response: any) => {
                    this.form.patchValue(response);
                    this.form.controls.key.disable()
                    this.Disable = true;
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
            this.submit(null, null, this.form);
            if (this.form.status == 'VALID') {
                model = Object.assign({}, this.model, { key: this.key }, this.form.value);
            } else { this.submiting = false; return }
            super.save({ url: this.otherUrl.PartSingleton, model: model }, (v) => {
                this.editDone.emit(this.key ? false : true);
                this.submiting = false;
                this.close()
            });
        }
    }
    close(): void {
        this.form.controls.key.enable()
        this.form.reset()
        this.Disable = false;
        this.submiting = false;
        this.avatar = null
        this.visible = false
    }
}
