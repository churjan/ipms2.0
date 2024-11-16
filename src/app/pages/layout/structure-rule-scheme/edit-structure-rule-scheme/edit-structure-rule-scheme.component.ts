import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormArray,
    Validators,
} from '@angular/forms';

import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { StructureRuleSchemeService } from '~/pages/layout/structure-rule-scheme/structure-rule-scheme.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { TrackConfigComponent } from '../track-config/track-config.component';

@Component({
    selector: 'edit-structure-rule-scheme',
    templateUrl: './edit-structure-rule-scheme.component.html',
    styleUrls: ['./edit-structure-rule-scheme.component.less'],
})
export class EditStructureRuleSchemeComponent extends FormTemplateComponent {
    @Input() record;
    @Input() entrance = 2
    form!: FormGroup;
    isLoading = false;
    blsr_key = null;
    @Output() editDone = new EventEmitter<boolean>()
    @ViewChild('config', { static: false }) _config: TrackConfigComponent;


    get blsd_list(): FormArray {
        return this.form.get('blsd_list') as FormArray;
    }

    constructor(
        private fb: FormBuilder,
        private ems: EmbedModalService,
        private srss: StructureRuleSchemeService,
        private breakpointObserver: BreakpointObserver
    ) { super() }
    valueslist(v) { return v ? JSON.parse(v) : [] }
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '80%'
            } else {
                this.width = '99%'
            }
        })
        this.form = this.fb.group({
            code: [null, Validators.required],
            name: [null, Validators.required],
            blsd_list: this.fb.array([]),
        });
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node) {
            this.key = record.node.key
            this.record = record.node;
            if (this.key) {
                this.blsr_key = record.node.key;

                this.srss
                    .fetchSchemeConditionDetail({ blsr_key: this.key })
                    .then((data: any) => {
                        const blsd_list = [];
                        data.forEach((item) => {
                            this.blsd_list.push(this.newProjectPlan());

                            let values;
                            if (item.optionmode === 'select') {
                                values = {
                                    value: item.value,
                                    name: item.value_name
                                };
                            } else if (item.optionmode === 'extendselect') {
                                values = {
                                    value: item.value,
                                    description: item.value_name,
                                };
                            } else if (item.optionmode === 'enumselect') {
                                values = {
                                    value: Number(item.value),
                                    description: item.value_name,
                                };
                            } else if (item.optionmode === 'customselect') {
                                values = {
                                    value: item.value,
                                    name: item.value_name,
                                    valueslist: item.optionvalue ? JSON.parse(item.optionvalue) : []
                                };
                            } else if (item.optionmode.includes('input')) {
                                values = item.value;
                            }
                            blsd_list.push({
                                condition: {
                                    ...item,
                                    main_key: item.key,
                                    key: item.blr_key,
                                    name: item.blr_name,
                                    inputtype:
                                        (item.value === 'true' || item.value === 'false')
                                            ? 'Bool'
                                            : typeof item.value === 'number'
                                                ? 'Int'
                                                : typeof item.value === 'string' ? 'String' : 'null',
                                },
                                comparetype: item.comparetype,
                                value: values.value ? values.value : values,
                                value_name: values.name ? values.name : '',
                                valueslist: values.valueslist ? values.valueslist : [],
                            });
                        });
                        this.form.patchValue({
                            name: this.record.name,
                            code: this.record.code,
                            blsd_list,
                        });
                        // console.log('编辑', this.form.value)
                    });
            }
        } else {
            this.key = null;
            this.record = {};
        }
        this.visible = true
    }

    newProjectPlan(): FormGroup {
        return this.fb.group({
            condition: [null, [Validators.required]],
            comparetype: ['=', [Validators.required]],
            value: [null, [Validators.required]],
            value_name: [null],
            valueslist: [null]
        });
    }

    onAddFiled() {
        this.blsd_list.push(this.newProjectPlan());
    }

    onRemoveFiled(i) {
        this.blsd_list.removeAt(i);
    }

    onConditionChange(i) {
        this.blsd_list.at(i).patchValue({
            comparetype: '=',
            value: null,
        });
        setTimeout(() => {
            this.blsd_list.at(i).markAsPristine();
            this.blsd_list.at(i).updateValueAndValidity();
        }, 0);
    }

    setConditionVal() {
        const params = {
            blr_key: '',
            blr_name: '',
        };
    }


    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false
        if (!event || event.key == "Enter") {
            if (this.form.valid) {
                const { name, code, blsd_list } = this.form.value;
                if (!blsd_list.length) {
                    this.message.warning(
                        this._appService.translate('warning.noCondition')
                    );
                    return;
                }
                this.isLoading = true;
                const params = {
                    name,
                    code,
                    ...(this.record && { key: this.record.key }),
                    blsd_list: [],
                };
                blsd_list.forEach(({ comparetype, condition, value, value_name }) => {
                    // let value;
                    // let value_name;
                    // if (condition.optionmode === 'select') {
                    //     value = values.key;
                    //     value_name = values.name;
                    // } else if (condition.optionmode === 'enumselect') {
                    //     value = values.value;
                    //     value_name = values.description;
                    // } else if (condition.optionmode === 'customselect') {
                    //     value = values.value;
                    //     value_name = values.name;
                    // } else if (condition.optionmode.includes('input')) {
                    //     value = values;
                    //     value_name = values;
                    // }
                    params.blsd_list.push({
                        blr_key: condition.key,
                        blr_name: condition.name,
                        optionmode: condition.optionmode,
                        optionvalue: condition.optionvalue,
                        comparetype,
                        value,
                        value_name,
                        ...(condition.main_key && { key: condition.main_key }),
                        ...(this.record && { blsr_key: this.record.key }),
                    });
                });

                this.srss
                    .save(params)
                    .then(() => {
                        this.message.success(this.getTipsMsg('sucess.s_save'));
                        this.close();
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            } else {
                this.markControlsDirty(this.form);
            }
        }
    }

    close(): void {
        this.blsd_list.clear();
        this.form.reset();
        this.submiting = false;
        this.avatar = null
        this.visible = false
        if (this.editDone) this.editDone.emit(true)
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
}
