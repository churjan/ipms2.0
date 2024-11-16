import { environment } from '@/environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '~/shared/services/http/auth.service';
import { LoginService } from './login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
    public validateForm: FormGroup;
    public passwordVisible: boolean = false;
    public submiting: boolean = false;
    toggleType = 0;
    prevToggleType = 0;
    /**系统名称 */
    sysName: string;
    /**版权 */
    Copyright: string;
    /**版本 */
    version=environment.version;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        public loginService: LoginService
    ) {
        this.validateForm = this.fb.group({
            username: [null, [Validators.required]],
            password: [null, [Validators.required]],
        });
    }

    ngOnInit() {
        // this.toggleType=0
        // localStorage.setItem('isGangDai','1') // '0':非钢带 '1':钢带

        // 判断机器是否已经注册
        this.loginService.checkRegister().finally(() => {
            // this.authService.systemnameUrl()
            const node = this.loginService.registerData;
            document.title = node.fullsystemname && document.title != node.fullsystemname ? node.fullsystemname : document.title;
            sessionStorage.sysName = document.title;
            window.localStorage.sysName = document.title;
            this.sysName = document.title;
            this.Copyright = node.copyright;
            if (this.loginService.registerStatus === 0) {
                this.toggleType = 1
            }
        })
    }
}
