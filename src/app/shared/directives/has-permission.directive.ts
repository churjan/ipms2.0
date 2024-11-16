import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UtilService } from '../services/util.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/http/auth.service';

@Directive({
     selector: '[hasPermission]'
    })
export class HasPermissionDirective{

    @Input() 
    set hasPermission(permissions: string[]) {
        const current = JSON.parse(this.utilService.aesDecrypt(localStorage.getItem("userInfo")))
        if(!current?.isadmin){//普通用户
            this.authService.permissions$.subscribe((result: string[]) =>{
                this.checkHasPermission(result, permissions)
            })
        }else{//超级管理员
            if(environment.production){//生产环境
                this.authService.permissions$.subscribe((result: string[]) =>{
                    this.checkHasPermission(result, permissions)
                })
            }else{//开发环境
                this.checkHasPermission([], permissions ,true)
            }
        }
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private utilService: UtilService,
        private authService : AuthService
        ) { }

    checkHasPermission(userPermissions: string[], permissions: string[], superAdmin: boolean = false){
        let bool = false
        if(!superAdmin){
            for(let i=0; i<permissions.length; i++){
                if(userPermissions?.includes(permissions[i])){
                    bool = true
                    break
                }
            }
        }else{
            bool = true
        }
        this.viewContainer.clear()
        if(permissions.includes('reverse')){
            if (!bool) {
                this.viewContainer.createEmbeddedView(this.templateRef)
            } else {
                this.viewContainer.clear()
            }
        }else{
            if (bool) {
                this.viewContainer.createEmbeddedView(this.templateRef)
            } else {
                this.viewContainer.clear()
            }
        }
        
    }
}
