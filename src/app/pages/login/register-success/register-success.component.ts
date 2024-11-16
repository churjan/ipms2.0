import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '~/shared/services/app.service';

import * as moment from "moment"

@Component({
    selector: 'app-register-success',
    templateUrl: './register-success.component.html',
    styleUrls: ['./register-success.component.less'],
})
export class RegisterSuccessComponent implements OnInit {
    @Input() toggleType!: number;
    @Output() toggleTypeChange = new EventEmitter<number>();
    validateForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private message: NzMessageService,
        private appService: AppService,
        private loginService: LoginService
    ) {
        this.validateForm = this.fb.group({
            systemname: [{ value: null, disabled: true }, Validators.required],
            expirationtime: [
                { value: null, disabled: true },
                Validators.required,
            ],
            copyright: [{ value: null, disabled: true }, Validators.required],
        });
    }

    ngOnInit(): void {
        const { systemname, expirationtime, copyright } =
            this.loginService.registerData;

        this.validateForm.patchValue({
            systemname,
            expirationtime: moment(expirationtime).format("YYYY-MM-DD HH:mm:ss"),
            copyright,
        });
    }

    onNavigateTo(type: number) {
        this.toggleTypeChange.emit(type);
    }

    onReboot() {
        const msgId = this.message.loading(
            this.appService.translate('reBootLoading'),
            { nzDuration: 0 }
        ).messageId;
        this.loginService
            .checkRegister()
            .then(() => {
                this.onNavigateTo(0);
            })
            .finally(() => {
                this.message.remove(msgId);
            });
    }
}
