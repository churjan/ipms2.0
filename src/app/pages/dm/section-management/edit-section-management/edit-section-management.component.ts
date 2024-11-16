import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { SectionManagementService } from '../section-management.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'edit-section',
    templateUrl: './edit-section-management.component.html',
    styleUrls: ['./edit-section-management.component.less'],
})
export class EditSectionComponent extends FormTemplateComponent {
    @Input() record;
    form!: FormGroup;
    isLoading = false;
    @Output() editDone = new EventEmitter<boolean>()

    constructor(
        private fb: FormBuilder,
        private sms: SectionManagementService,
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
            isdefault: [null],
            sort: [null],
            key: [null]
        });
    }

    async open(record: any) {
        this.title = record.node ? this._appService.translate("btn.update") : this._appService.translate("btn.add")
        if (record.node) {
            this.key = record.node.key
            if (this.key) {
                this.sms.detail(this.key).then((data: any) => {
                    this.form.patchValue(data);
                });
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
            this.submit(null,null,this.form);
            if (this.form.status == 'VALID') {
                model = Object.assign({}, this.model, this.form.value);
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
