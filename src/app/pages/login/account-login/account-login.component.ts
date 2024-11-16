import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '~/shared/services/http/auth.service';
import { UtilService } from '~/shared/services/util.service';
import { LoginService } from '../login.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '~/shared/services/app.service';

@Component({
    selector: 'app-account-login',
    templateUrl: './account-login.component.html',
    styleUrls: ['./account-login.component.less'],
})
export class AccountLoginComponent implements OnInit {
    @Input() toggleType: number;
    @Output() toggleTypeChange = new EventEmitter<number>();
    validateForm: FormGroup;
    passwordVisible = false;
    submiting = false;
    title: string;

    constructor(
        private fb: FormBuilder,
        private utilService: UtilService,
        private authService: AuthService,
        private message: NzMessageService,
        private appService: AppService,
        public loginService: LoginService
    ) {
        this.validateForm = this.fb.group({
            username: [null, [Validators.required]],
            password: [null, [Validators.required]],
        });
        this.authService.Register('Register/VerifyRegisterTxt/', {}, (success) => {
            let today = UtilService.DateReverse(UtilService.dateFormat(new Date(), 'yyyy-MM-dd'));
            let expirationtime = UtilService.DateReverse(success.expirationtime);
            let date = UtilService.DateMinus(today, expirationtime);
            // if (this.sys != success.systemname) { this.sys = success.systemname; sessionStorage.sys = success.systemname; }
            window.localStorage.expire = date;
            if (date > 15) { return; } else if (date < 0) {
                this.message.error(this.appService.translate('placard.regexpired'))
                this.onNavigateTo(3)
                return;
            }
            this.title = this.appService.translate('placard.arestill', date);
            if (date < 3) { this.message.warning(this.title) }
        }, function (msg) { });
    }

    ngOnInit(): void { }

    submitForm($event?: KeyboardEvent) {
        if (this.submiting) return false;

        if (!$event || $event.key == 'Enter') {
            for (const i in this.validateForm.controls) {
                if (this.validateForm.controls.hasOwnProperty(i)) {
                    this.validateForm.controls[i].markAsDirty();
                    this.validateForm.controls[i].updateValueAndValidity();
                }
            }
            if (!this.validateForm.valid) {
                return false;
            }

            this.submiting = true;
            this.authService
                .login(this.validateForm.value)
                .then(() => {
                    const result =
                        this.utilService.getQueryVariable('redirect');
                    const redirect = result
                        ? '/#/' + decodeURIComponent(result)
                        : '/';
                    //this.router.navigateByUrl(redirect)
                    location.href = redirect;
                })
                .finally(() => {
                    this.submiting = false;
                });
        }
    }

    onNavigateTo(type: number) {
        this.toggleTypeChange.emit(type);
    }
}
