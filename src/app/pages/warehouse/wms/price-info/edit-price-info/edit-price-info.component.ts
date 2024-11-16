import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AppService } from '~/shared/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceInfoService } from '../price-info.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilService } from '~/shared/services/util.service';

@Component({
    selector: 'app-edit-price-info',
    templateUrl: './edit-price-info.component.html',
    styleUrls: ['./edit-price-info.component.less'],
})
export class EditPriceInfoComponent implements OnInit {
    @Output() editDone = new EventEmitter<boolean>();
    record = null;
    form!: FormGroup;
    title = '';
    isVisible = false;
    isBtnLoading = false;

    constructor(
        private fb: FormBuilder,
        private appService: AppService,
        private pis: PriceInfoService,
        private message: NzMessageService,
        private util: UtilService
    ) {
        this.form = this.fb.group({
            pinming: [null, [Validators.required]],
            xiangxing: [null, [Validators.required]],
            wages: [null, [Validators.required]],
        });
    }

    ngOnInit(): void {}

    open(record) {
        this.record = record;
        this.title = this.appService.translate('btn.' + record.title);
        this.isVisible = true;
        if (record.node) {
            this.form.patchValue({
                pinming: record.node.pinming,
                xiangxing: record.node.xiangxing,
                wages: record.node.wages,
            });
        }
    }

    onSubmit() {
        if (this.form.valid) {
            const { pinming, xiangxing, wages } = this.form.value;
            const params = {
                ...(this.record.node && { key: this.record.node.key }),
                pinming,
                xiangxing,
                wages,
            };
            this.isBtnLoading = true;
            this.pis
                .editPriceInfo(params)
                .then(() => {
                    this.message.success(
                        this.util.getComm(
                            this.record.node
                                ? 'sucess.s_update'
                                : 'sucess.s_add'
                        )
                    );

                    this.isVisible = false;
                    this.editDone.emit(true);
                    this.form.reset();
                })
                .finally(() => {
                    this.isBtnLoading = false;
                });
        }
    }

    onClose() {
        this.isVisible = false;
        this.editDone.emit(false);
        this.form.reset();
    }
}
