import { Component, OnInit } from '@angular/core';
import { CommonService } from '~/shared/services/http/common.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TransferDirection } from 'ng-zorro-antd/transfer';
import { EmployeeService } from '~/pages/hr/employee/employee.service';

@Component({
    selector: 'group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.less']
})
export class GroupComponent implements OnInit {

    title: string
    width: string
    visible: boolean = false
    data: Array<any> = []
    userAccountKey: string
    userInfoKey: string
    selecteds: Array<any> = []

    constructor(
        private breakpointObserver: BreakpointObserver,
        private commonService: CommonService,
        private employeeService: EmployeeService
    ) { }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if(!result.matches){
                this.width = '400px'
            }else{
                this.width = '100%'
            }
        })
    }
    
    async open(record: any){
        this.title = record.name
        this.userInfoKey = record.key
        let all = []
        await this.commonService.groups().then((response: any[]) =>{
            all = response
        })
        await this.employeeService.userAccount(record.key).then((response: any) =>{
            this.userAccountKey = response.key
        })
        await this.employeeService.userGroups(this.userAccountKey).then((response: any) =>{
            this.selecteds = response
            this.data = []
            all.forEach(item => {
                const result = response.find(ite =>ite.pgi_key == item.key)
                const direction: TransferDirection = result ? 'right' : 'left'
                const temp = {
                    title: item.name,
                    direction: direction,
                    key: item.key
                }
                this.data.push(temp)
            })
        })
        this.visible = true
    }

    change(ret: any): void {
        if(ret.from =="left" && ret.to == "right" && ret.list){
            ret.list.forEach(({key}) =>{
                const data = {
                    sui_key: this.userAccountKey,
                    hei_key: this.userInfoKey,
                    pgi_key: key
                }
                this.employeeService.addGroup(data).then(response =>{
                    this.selecteds.push(response)
                })
            })
        }else if(ret.from =="right" && ret.to == "left" && ret.list){
            const keys = ret.list.map(({key}) => {
                const index = this.selecteds.findIndex(item =>item.pgi_key == key)
                if(index >= 0){
                    const key = this.selecteds[index].key
                    this.selecteds.splice(index,1)
                    return {key: key}
                }
            })
            this.employeeService.delGroup(keys)
        }       
    }

    close(): void {
        this.visible = false
    }

}
