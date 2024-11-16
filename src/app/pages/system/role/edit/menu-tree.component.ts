import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { RoleService } from '~/pages/system/role/role.service';
/**
 * 菜单树组件
 */
@Component({
    selector: 'ina-menu-tree',
    template: `
    <nz-tree
    [nzData]="data"
    nzShowLine
    nzCheckable
    nzMultiple
    nzShowIcon="false"
    nzExpandAll
    [nzCheckStrictly]="true"
    [nzCheckedKeys]="selectedPermissions"
    [nzSelectedKeys]="defaultSelectedKeys"
    (nzClick)="nzEvent($event)"
    (nzExpandChange)="nzEvent($event)"
    (nzCheckBoxChange)="nzEvent($event)"></nz-tree>
  `
})

export class MenuTreeComponent {

    @Input() data: any[]
    @Output() selected = new EventEmitter();
    isShow = true;
    constructor(private router: Router) { }
    @Input() pData;
    @Input() defaultSelectedKeys;
    selectedPermissions: any[] = [] //接口一定要传这个参数所以在这里再写一遍
    nzEvent(event: NzFormatEmitEvent) {
        if (this.selectedPermissions.length == 0 && this.defaultSelectedKeys.length != 0) {
            this.selectedPermissions = this.selectedPermissions.concat(this.defaultSelectedKeys)
        }
        const selectedPermissions = JSON.parse(JSON.stringify(this.selectedPermissions))
        const obj = event.node.origin
        if (!obj.checked) {
            const index = selectedPermissions.indexOf(obj.key)
            if (index >= 0) {
                selectedPermissions.splice(index, 1)
            }
        } else {
            RoleService.selectUpper(selectedPermissions, event.node)//选择所有上级
            selectedPermissions.push(obj.key)
        }
        RoleService.selectLower(selectedPermissions, obj.checked, obj.children)//选择/取消所有下级
        this.selectedPermissions = selectedPermissions
    }
}
