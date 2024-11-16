import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoginService } from '../login.service';
import { AppService } from '~/shared/services/app.service';
import { environment } from '@/environments/environment';
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit {
    @Input() toggleType!: number;
    @Output() toggleTypeChange = new EventEmitter<number>();
    validateForm!: FormGroup;
    isBtnLoading = false;
    uploadUrl = environment.baseUrl + 'FilesInfo/'
    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private message: NzMessageService,
        private appService: AppService,
    ) {
        this.validateForm = this.fb.group({
            code: [null, Validators.required],
        });
    }

    ngOnInit(): void { }

    onNavigateTo(type: number) {
        this.toggleTypeChange.emit(type);
    }

    onCheck() {
        this.isBtnLoading = true;
        this.loginService
            .register({ registerStr: this.validateForm.value.code })
            .then(() => {
                this.message.success(this.appService.translate("login.registerSuccessMsg"));
                this.loginService.checkRegister().then(() => {
                    this.onNavigateTo(3);
                })
            })
            .finally(() => {
                this.isBtnLoading = false;
            });
    }

    //导入抬头添加token 和 语言
    uploadingHeader() {
        const token = sessionStorage.ticket ;
        return {
            token: token,
            language: localStorage.language ? localStorage.language : 'zh'
        }
    }
}
