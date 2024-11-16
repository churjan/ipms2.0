import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormArray,
    Validators,
} from '@angular/forms';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { QualityItemManagementService } from '../quality-item-management.service';

@Component({
    selector: 'app-edit-quality-item-management-catalog',
    templateUrl: './edit-quality-item-management-catalog.component.html',
    styleUrls: ['./edit-quality-item-management-catalog.component.less'],
})
export class EditQualityItemManagementCatalogComponent extends FormTemplateComponent {
    qualityClassList: any[] = [];
    form!: FormGroup;
    isLoading = false;
    @Output() editDone = new EventEmitter<boolean>()
    constructor(
        private fb: FormBuilder,
        private qims: QualityItemManagementService,
    ) { super() }

    ngOnInit(): void {
        this.form = this.fb.group({
            pkey: [null],
            name: [null, Validators.required],
            code: [null, Validators.required],
            description: [null],
            key: [null]
        });
        this.fetchCatalog();
    }
    async open(record: any) {
        this.title = record.node ? this._appService.translate("btn.update") : this._appService.translate("btn.add")
        if (record.node) {
            this.key = record.node.key
            if (this.key) {
                const { key, pkey, name, code, description } = record.node;
                this.form.patchValue({
                    key,
                    pkey,
                    name,
                    code,
                    description,
                });
            } else if (record.node.pkey) {
                this.form.patchValue({
                    pkey: record.node.pkey,
                });
            }
        } else {
            this.key = null
        }
        this.visible = true
    }

    fetchCatalog() {
        this.qims.fetchCatalog().then((data: any) => {
            data.forEach((item) => {
                item.title = `${item.name}[${item.code}]`;
                item.isLeaf = false;
            });
            this.qualityClassList = this.recursion(data, null);
        });
    }

    recursion(data, pkey) {
        const filterData = data.filter((item) => item.pkey == pkey);
        if (filterData) {
            filterData.forEach((item) => {
                item.children = this.recursion(data, item.key);
                item.isLeaf = item.children.length ? false : true;
            });
        }
        return filterData;
    }
    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false
        if (!event || event.key == "Enter") {
            this.submiting = true;
            let model: any = {}
            this.submit(null, null, this.form);
            if (this.form.status == 'VALID') {
                model = Object.assign({}, this.model, this.form.value);
            } else { this.submiting = false; return }
            super.save({ url: this.modular.otherUrl[this.Nickname], model: model }, (v) => {
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
