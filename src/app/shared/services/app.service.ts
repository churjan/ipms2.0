import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppConfig, modularList } from './AppConfig.service';
@Injectable({
    providedIn: 'root'
})
export class AppService {

    tagsList$ = new BehaviorSubject<any[]>(null)
    theme$ = new BehaviorSubject<string>(localStorage.getItem('theme'))

    constructor() { }

    clearAndLogout(redirectToLogin: boolean = false) {
        // localStorage.removeItem(environment.tokenKey)
        sessionStorage.removeItem('ticket')
        if (redirectToLogin) {
            location.href = "/#" + environment.loginPath
            return false
        }
        location.reload()
    }

    translate(key: string, Dynamic?): string {
        const translate = AppConfig.translate//JSON.parse(localStorage.getItem("translate"))
        if (!translate) return null;
        let value: string = null;
        if (key.indexOf('.') > 0) {
            let keyPath = key.split('.').map(item => {
                return "['" + item + "']"
            }).join('')
            if (!translate[key.split('.')[0]]) {
                if (modularList[key.split('.')[0]]) {
                    return value = modularList[key.split('.')[0]].fields.find(f => f.code == key.split('.')[1]).name;
                } else keyPath = "['common']" + keyPath;
            }
            if (!eval(`translate${keyPath}`))
                value = key.split('.')[1];
            else
                value = Dynamic ? eval(`translate${keyPath}`).replace('_', Dynamic) : eval(`translate${keyPath}`);
        } else {
            if (Dynamic) {
                value = translate.common ? translate.common[key].replace('_', Dynamic) : '';
            } else {
                value = translate.common ? translate.common[key] : '';
            }
        }

        return value
    }

    public static validateForm(validateForm: FormGroup) {
        for (const i in validateForm.controls) {
            if (validateForm.controls.hasOwnProperty(i)) {
                validateForm.controls[i].markAsDirty()
                validateForm.controls[i].updateValueAndValidity()
            }
        }
        if (!validateForm.valid) {
            return false
        }
        return true
    }

    formSubmit(validateForm: FormGroup, service: any, key: string = null, extraData = {}) {
        return new Promise((resolve, reject) => {
            let validateFormValue = {}
            let valid = true
            if (validateForm) {
                validateFormValue = validateForm.value
                for (let key in validateFormValue) {
                    if (typeof validateFormValue[key] == 'string') {
                        const temp = {}
                        temp[key] = validateFormValue[key].trim()
                        validateForm.patchValue(temp)
                    }
                }
                if (!AppService.validateForm(validateForm)) {
                    valid = false
                }
            }
            if (valid) {
                const formData = Object.assign(validateFormValue, extraData)
                if (key) {
                    service.update(formData, key).then(response => {
                        resolve(response)
                    }).catch(error => {
                        reject(error)
                    })
                } else {
                    service.add(formData).then(response => {
                        resolve(response)
                    }).catch(error => {
                        reject(error)
                    })
                }
            } else {
                reject()
            }
        })
    }
}
