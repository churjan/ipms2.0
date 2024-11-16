import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
@Component({
    selector: 'edit-difficulty',
    templateUrl: './edit-fabric-difficulty.component.html',
    styleUrls: ['./edit-fabric-difficulty.component.less'],
})
export class EditFabricDifficultyComponent extends FormTemplateComponent {
    // @Input() record;
    form!: FormGroup;
    isLoading = false;
    @Output() editDone = new EventEmitter<boolean>()

    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver
    ) { super() }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '30rem'
            } else {
                this.width = '100%'
            }
        })
        this.form = this.fb.group({
            code: [null, Validators.required],
            name: [null, Validators.required],
            level: [null],
            coefficient: [null],
        });
    }

    async open(record: any) {
        this.title = record.node ? this._appService.translate("btn.update") : this._appService.translate("btn.add")
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
