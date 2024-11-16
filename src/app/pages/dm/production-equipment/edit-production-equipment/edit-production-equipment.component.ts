import { Component, OnInit, Input } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormArray,
    Validators,
} from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { ProductionEquipmentService } from '../production-equipment.service';

import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';

@Component({
    selector: 'app-edit-production-equipment',
    templateUrl: './edit-production-equipment.component.html',
    styleUrls: ['./edit-production-equipment.component.less'],
})
export class EditProductionEquipmentComponent extends FormTemplateComponent {
    form!: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private pes: ProductionEquipmentService,
        private ems: EmbedModalService
    ) {
        super()
        this.form = this.fb.group({
            code: [null, Validators.required],
            name: [null, Validators.required],
            brand: [null],
            specification: [null,],
            purchasedate: [null],
            planretirementdate: [null],
            state: [null],
            nature: [null],
            repaircount: [null],
            suppliername: [null],
            description: [null],
        });
    }
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '33rem'
            } else {
                this.width = '100%'
            }
        })
    }
    async open(record: any) {
        this.title = record.node ? this._appService.translate("btn.update") : this._appService.translate("btn.add")
        if (record.node) {
            this.key = record.node.key
            if (this.key) {
                this.pes.detail(this.key).then((data: any) => {
                    this.form.patchValue({
                        code: data.code,
                        name: data.name,
                        brand: data.brand,
                        specification: data.specification,
                        purchasedate: data.purchasedate,
                        planretirementdate: data.planretirementdate,
                        state: data.state,
                        nature: data.nature,
                        repaircount: data.repaircount,
                        suppliername: data.suppliername,
                        description: data.description,
                    });
                });
            }
        } else {
            this.key = null
        }
        this.visible = true
    }

    onSubmit() {
        if (this.form.valid) {
            const {
                code,
                name,
                brand,
                specification,
                purchasedate,
                planretirementdate,
                state,
                nature,
                repaircount,
                suppliername,
                description,
            } = this.form.value;
            let params: any = {
                code,
                name,
                brand,
                specification,
                purchasedate: purchasedate ? moment(purchasedate).format('YYYY-MM-DD') : null,
                planretirementdate:
                    planretirementdate ? moment(planretirementdate).format('YYYY-MM-DD') : null,
                state,
                nature,
                repaircount,
                suppliername,
                description,
            };

            if (this.key) {
                params = {
                    ...params,
                    key: this.key,
                };
            }

            this.isLoading = true;
            this.pes
                .edit(params)
                .then(() => {
                    this.message.success(
                        this._appService.translate('sucess.s_save')
                    );
                    this.ems.modalClose$.next({
                        type: 'app-edit-production-equipment',
                        bool: true,
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

    close(): void {
        this.form.reset()
        this.submiting = false;
        this.avatar = null
        this.visible = false
    }
}
