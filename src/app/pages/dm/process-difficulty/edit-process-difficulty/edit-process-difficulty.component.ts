import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
    selector: 'edit-process',
    templateUrl: './edit-process-difficulty.component.html',
    styleUrls: ['./edit-process-difficulty.component.less'],
})
export class EditProcessDifficultyComponent extends FormTemplateComponent {
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver
    ) { super() }
    form!: FormGroup;
    isLoading = false;

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
            key: [null],
            code: [null, Validators.required],
            name: [null, Validators.required],
            coefficient: [null],
        });
    }

    async open(record: any) {
        this.title = this._appService.translate("btn" + record.title)
        if (record.node) {
            this.key = record.node.key
            if (this.key) {
                this._service.getModel(this.modular.url, this.key, (response: any) => {
                    this.form.patchValue(response)
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
            if (this.form.status == 'VALID') {
                model = Object.assign({}, this.model, { key: this.key }, this.form.value);
            } else { this.submiting = false; return }
            super.save({ url: this.modular.url, model: model }, (v) => {
                this.editDone.emit(this.key ? false : true);
                this.submiting = false;
                this.close()
            });
        }
    }
    close(): void {
        this.form.reset()
        this.submiting = false;
        this.avatar = null
        this.visible = false
    }
}
