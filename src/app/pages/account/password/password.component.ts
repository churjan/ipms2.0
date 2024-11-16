import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '~/shared/services/app.service';
import { AuthService } from '~/shared/services/http/auth.service';

@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.less']
})
export class PasswordComponent implements OnInit {

    validateForm!: FormGroup
    submiting: boolean = false

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private message: NzMessageService,
        private appService: AppService
        ) { }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            password: [null, [Validators.required]],
            newpassword: [null, [Validators.required]],
            confignewpwd: [null, [Validators.required]]
        })
    }
    
    submitForm(event? :KeyboardEvent) {
        if(this.submiting) return false
        
        if(!event || event.key == "Enter"){
            for (const i in this.validateForm.controls) {
                if (this.validateForm.controls.hasOwnProperty(i)) {
                    this.validateForm.controls[i].markAsDirty()
                    this.validateForm.controls[i].updateValueAndValidity()
                }
            }
            if (!this.validateForm.valid) {
                return false
            }

            const formData = this.validateForm.value
            if(formData.newpassword != formData.confignewpwd){
                this.message.warning(this.appService.translate("account.confirmPasswordError"))
                return false
            }
            this.submiting = true
            this.authService.changePassword(formData).then(() =>{
                this.authService.logout()
            }).finally(() =>{
                this.submiting = false
            })
        }
    }
}
