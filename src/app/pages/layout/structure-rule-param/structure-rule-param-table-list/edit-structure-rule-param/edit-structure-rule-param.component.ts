import { Component, OnInit, Input } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormArray,
    Validators,
} from '@angular/forms';

import { AppService } from '~/shared/services/app.service';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { StructureRuleParamService } from '../../structure-rule-param.service';

import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-edit-structure-rule-param',
    templateUrl: './edit-structure-rule-param.component.html',
    styleUrls: ['./edit-structure-rule-param.component.less'],
})
export class EditStructureRuleParamComponent implements OnInit {
    @Input() record;
    form!: FormGroup;
    isLoading = false;

    get optionmode(): FormControl {
        return this.form.get('optionmode') as FormControl;
    }

    constructor(
        private fb: FormBuilder,
        private appService: AppService,
        private srps: StructureRuleParamService,
        private ems: EmbedModalService,
        private message: NzMessageService
    ) {
        this.form = this.fb.group({
            name: [null, Validators.required],
            field: [null, Validators.required],
            optionmode: [null, Validators.required],
            optionvalue: [null, Validators.required],
            weight: [null],
            group: [null],
            isdisabled: [false],
            sort: [null],
        });
    }

    ngOnInit(): void {
        if (this.record) {
            this.srps.detail(this.record.key).then((data: any) => {
                this.form.patchValue({
                    name: data.name,
                    field: data.field,
                    optionmode: data.optionmode,
                    weight: data.weight,
                    isdisabled: data.isdisabled,
                    sort: data.sort,
                    group:data.group
                });
                if (['extendselect','select', 'enumselect','fullselect'].includes(data.optionmode)) {
                    this.form.patchValue({
                        optionvalue: data.optionvalue,
                    });
                } else if (['customselect'].includes(data.optionmode)) {
                    this.form.patchValue({
                        optionvalue: JSON.parse(data.optionvalue),
                    });
                } else if (
                    ['input', 'judgment-input'].includes(data.optionmode)
                ) {
                    this.form.patchValue({
                        optionvalue: data.inputtype,
                    });
                }
            });
        }
    }

    onOptionModeChange() {
        this.form.patchValue({
            optionvalue: null,
        });
    }

    onSubmit() {
        if (this.form.valid) {
            const {
                name,
                field,
                optionmode,
                optionvalue,
                weight,
                isdisabled,
                sort,
                group
            } = this.form.value;

            let params: any = {
                name,
                field,
                optionmode,
                weight,
                isdisabled,
                sort,
                group
            };

            if (['extendselect','select', 'enumselect','fullselect'].includes(optionmode)) {
                params = {
                    ...params,
                    optionvalue,
                };
            } else if (['customselect'].includes(optionmode)) {
                params = {
                    ...params,
                    optionvalue: JSON.stringify(optionvalue),
                };
            } else if (['input', 'judgment-input'].includes(optionmode)) {
                params = {
                    ...params,
                    inputtype: optionvalue,
                };
            }

            if (this.record) {
                params = {
                    ...params,
                    key: this.record.key,
                };
            }

            this.isLoading = true;
            this.srps
                .save(params)
                .then(() => {
                    this.message.success(
                        this.appService.translate('sucess.s_save')
                    );
                    this.ems.modalClose$.next({
                        type: 'app-edit-structure-rule-param',
                        bool: true
                    });
                })
                .finally(() => {
                    this.isLoading = false;
                });
        } else {
            this.markControlsDirty(this.form);
        }
    }

    markControlsDirty(group: FormGroup | FormArray): void {
        Object.keys(group.controls).forEach((key: string) => {
            const abstractControl = group.controls[key];
            if (
                abstractControl instanceof FormGroup ||
                abstractControl instanceof FormArray
            ) {
                this.markControlsDirty(abstractControl);
            } else {
                abstractControl.markAsDirty();
                abstractControl.updateValueAndValidity({ onlySelf: true });
            }
        });
    }

    onClose() {
        this.ems.modalClose$.next({
            type: 'app-edit-structure-rule-param',
            bool: false
        });
    }
}
