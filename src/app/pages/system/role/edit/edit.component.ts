import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '~/pages/system/role/role.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { AuthService } from '~/shared/services/http/auth.service';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent extends FormTemplateComponent {

    @Output() editDone = new EventEmitter<boolean>()
    public title: string
    public width: string
    public visible: boolean = false
    validateForm!: FormGroup
    public submiting: boolean = false
    menusData: any[]
    originalPermissions: any[] = [] //接口一定要传这个参数所以在这里再写一遍
    selectedPermissions: any[] = [] //接口一定要传这个参数所以在这里再写一遍
    defaultSelectedKeys: any[] = [];
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private authService: AuthService
    ) {
        super()
    }
    async ngOnInit() {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '500px'
            } else {
                this.width = '94%'
            }
        })
        this.validateForm = this.fb.group({
            name: [null, [Validators.required]],
            description: [null, [Validators.maxLength(100)]],
            haveoperationprocess: [null],
            haveoperationprocessroute: [null],
            havewages: [null],
            menus: [null],
            key: [null]
        })
        this.authService.getUserMenu();
    }

    async open(record: any) {
        this.title = record.node && record.node.key ? this._appService.translate("btn.update") : this._appService.translate("btn.plus")
        if (record.node) {
            this.key = record.node.key
            //接口一定要传这个参数所以在这里再写一遍
            this._service.getModel(this.modular.url, this.key, (result) => {
                this.validateForm.patchValue(result);
                this.menusData = this.initMenus(result.menus);
                // console.log( this.menusData)
            })
        } else {
            this.key = null;
            this.menusData = this.initMenus(this.authService.menuData);
        }
        this.visible = true
    }
    initMenus(data, i?) {
        if (!data || data.length <= 0) return []
        return data.map(item => {
            let temp: any = {
                title: item.name,
                icon: item.icon,
                key: item.key,
                children: [],
                checked: item.ischecked,
                isLeaf: false,
                ismenu: item.ismenu,
                i: i ? i : 0
            }
            if (item.ischecked == true) this.defaultSelectedKeys.push(item.key)
            if (item.sonlist && item.sonlist.length > 0) {
                temp.children = this.initMenus(item.sonlist)
                temp.expanded = true;
            }
            if (temp.children && item.menubuttondtolist && item.menubuttondtolist.length > 0) {
                if (item.menubuttondtolist && item.menubuttondtolist.length > 0) {
                    temp.children.push(...this.initMenus(item.menubuttondtolist, 1));
                    temp.type = "menubuttondtolist";
                    temp.expanded = true;
                } else {
                    temp.isLeaf = true
                }
            }
            if (!temp.children || temp.children.length == 0) {

                if (item.menubuttondtolist && item.menubuttondtolist.length > 0) {
                    temp.children = this.initMenus(item.menubuttondtolist);
                    temp.type = "menubuttondtolist";
                    temp.expanded = true;
                } else {
                    temp.isLeaf = true
                }
            }
            return temp
        })
    }
    retunMenus(data) {
        if (!data || data.length <= 0) return []
        return data.map(item => {
            let temp = Object.assign({ isLeaf: false }, item)
            delete temp.children;
            temp.ischecked = item.checked
            if (item.children && item.children.length > 0) {
                if (item.type) {
                    let _btn = item.children.filter(n => n.i == 1)
                    let _son = item.children.filter(n => n.i != 1)
                    temp[item.type] = this.retunMenus(_btn);
                    temp.sonlist = this.retunMenus(_son);
                } else {
                    temp.sonlist = this.retunMenus(item.children);
                }

            }
            return temp
        })
    }
    submitForm() {
        if (this.submiting) return false;
        this.validateForm.patchValue({ menus: this.retunMenus(this.menusData) })
        let model: any = {}
        this.submit();
        if (this.validateForm.status == 'VALID') {
            model = Object.assign({}, this.model, this.validateForm.value);
        } else { this.submiting = false; return }
        this.submiting = true;
        super.save({ url: this.modular.url, model: model}, (v) => {
            this.editDone.emit(this.key ? false : true)
            this.close()
            this.submiting = false
        });
    }

    close(): void {
        this.validateForm.reset();
        this.defaultSelectedKeys = [];
        this.visible = false
    }

}
