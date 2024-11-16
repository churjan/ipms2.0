import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '~/pages/hr/employee/employee.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TransferDirection, TransferItem } from 'ng-zorro-antd/transfer';
import { RoleService } from '~/pages/system/role/role.service';

@Component({
    selector: 'setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.less']
})
export class SettingComponent implements OnInit {

    width: string
    visible: boolean = false
    validateForm!: FormGroup
    submiting: boolean = false
    userInfoKey: string
    userAccountKey: string
    roles: TransferItem[]
    userSelectedRolesOriginal: any[]

    constructor(
        private fb: FormBuilder,
        private employeeService: EmployeeService,
        private roleService: RoleService,
        private breakpointObserver: BreakpointObserver
        ) { }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if(!result.matches){
                this.width = '500px'
            }else{
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            username: [null, [Validators.required]],
            password: ["888888"],
            disable: [0]
        })
    }

    open(record: any): void {
        this.userInfoKey = record.key
        this.employeeService.userAccount(record.key).then((response: any) =>{
            this.validateForm.setValue({
                username: response.username || null,
                password: response.password || "888888",
                disable: response.disable || 0,
            }) 
            this.userAccountKey = response.key
            this.allRoles()
        })
        this.visible = true
    }

    /* 角色 begin ******************************************************************************** */
    allRoles(){
        this.roleService.all().then((response: any[]) =>{
            this.getUserRoles(response)
        })
    }

    getUserRoles(allRoles){
        this.employeeService.userRoles(this.userAccountKey).then((response: any) =>{
            this.userSelectedRolesOriginal = response
            this.roles = []
            allRoles.forEach(item => {
                const result = response.find(ite =>ite.sri_key == item.key)
                const direction: TransferDirection = result ? 'right' : 'left'
                const temp = {
                    title: item.name,
                    direction: direction,
                    key: item.key
                }
                this.roles.push(temp)
            })
        })
    }

    roleChange(ret: any): void {
        if(ret.from =="left" && ret.to == "right" && ret.list){
            ret.list.forEach(item =>{
                const data = {
                    sui_key: this.userAccountKey,
                    sri_key: item.key,
                    hei_key: this.userInfoKey
                }
                this.employeeService.addRole(data).then(response =>{
                    this.userSelectedRolesOriginal.push(response)
                })
            })
        }else if(ret.from =="right" && ret.to == "left" && ret.list){
            const keys = ret.list.map(({key}) => {
                const index = this.userSelectedRolesOriginal.findIndex(item =>item.sri_key == key)
                if(index >= 0){
                    const key = this.userSelectedRolesOriginal[index].key
                    this.userSelectedRolesOriginal.splice(index,1)
                    return {key: key}
                }
            })
            this.employeeService.delRole(keys)
        }       
    }
    /* 角色 end ******************************************************************************** */
    
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
            formData.hei_key = this.userInfoKey
            formData.key = this.userAccountKey
            this.submiting = true
            this.employeeService.userAccountUpdate(formData).then(() =>{
                this.close()
            }).finally(() =>{
                this.submiting = false
            })
        }
    }

    close(): void {
        this.validateForm.reset()
        this.visible = false
    }

}
