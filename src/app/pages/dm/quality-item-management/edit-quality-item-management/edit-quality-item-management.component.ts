import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { QualityItemManagementService } from '../quality-item-management.service';

@Component({
    selector: 'app-edit-quality-item-management',
    templateUrl: './edit-quality-item-management.component.html',
    styleUrls: ['./edit-quality-item-management.component.less'],
})
export class EditQualityItemManagementComponent extends FormTemplateComponent {
    @Input() record;
    qualityClassList: any[] = [];
    form!: FormGroup;
    isLoading = false;
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', url: 'QualityCauseClass' }

    @Output() editDone = new EventEmitter<boolean>()

    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private qims: QualityItemManagementService,
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
            bqcc_key: [null, Validators.required],
            name: [null, Validators.required],
            code: [null, Validators.required],
            handlemethod: [null, Validators.required],
            sort: [null],
            key: [null]
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
