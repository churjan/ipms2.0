import { Component, OnInit } from '@angular/core';
import { RoleService } from '~/pages/system/role/role.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

@Component({
    selector: 'permission',
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.less']
})
export class PermissionComponent implements OnInit {

    width: string
    visible:boolean = false
    submiting: boolean = false
    key: string
    originalPermissions: any[]
    selectedPermissions: any[]
    permissions: any[]
    roleName: string

    constructor(
        private roleService: RoleService,
        private appService: AppService,
        private breakpointObserver: BreakpointObserver
        ) { }

    async ngOnInit() {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if(!result.matches){
                this.width = '300px'
            }else{
                this.width = '94%'
            }
        })
        // await this.roleService.getPermissions().then(({original,permissions}) => {
        //     this.originalPermissions = original
        //     this.permissions = permissions
        // })
    }

    async open(record: any) {
        this.roleName = record.name
        this.key = record.key
        await this.roleService.get(this.key).then(({permissions}) =>{
            this.selectedPermissions = permissions
        })
        this.visible = true
    }

    nzEvent(event: NzFormatEmitEvent){
        const selectedPermissions = JSON.parse(JSON.stringify(this.selectedPermissions))
        const obj = event.node.origin
        if(!obj.checked){
            const index = selectedPermissions.indexOf(obj.key)
            if(index >= 0){
                selectedPermissions.splice(index,1)
            }
        }else{
            RoleService.selectUpper(selectedPermissions,event.node)//选择所有上级
            selectedPermissions.push(obj.key)
        }
        RoleService.selectLower(selectedPermissions,obj.checked,obj.children)//选择/取消所有下级
        this.selectedPermissions = selectedPermissions
    }

    submitForm() {
        if(this.submiting) return false
    
        const menus = JSON.parse(JSON.stringify(this.originalPermissions))
        RoleService.setChecked(menus,this.selectedPermissions)
        const extraData = {name: this.roleName, menus: menus}

        this.submiting = true
        this.appService.formSubmit(null,this.roleService,this.key,extraData).then(() =>{
            this.close()
        }).finally(() =>{
            this.submiting = false
        })
    }

    close(): void {
        this.visible = false
    }

}
