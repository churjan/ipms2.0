import { Component, Input, OnInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '~/shared/services/app.service';
import { MenuService } from '~/pages/system/menu/menu.service';
import { UtilService } from '~/shared/services/util.service';
import { NodeComponent } from '../node/node.component';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

    @Input()
    set model(value) {
        this.nodes = []
        this.key = null
        if (value) {
            if (value.ismenu == 1) {
                this.validateForm.get('url').clearValidators();
            } else {
                this.validateForm.get('url').setValidators([Validators.required])
            }
            const data = JSON.parse(JSON.stringify(value))
            if (Object.keys(data).length > 0) {
                const form = {
                    name: data.name || null,
                    url: data.url || null,
                    icon: data.icon || null,
                    sort: data.sort || 100,
                    pkey: data.pkey || null,
                    ismenu: (!data.ismenu||data.ismenu == 0 ? false : true) || false,
                }
                if (data.menubuttondtolist) {
                    this.nodes = data.menubuttondtolist
                }
                if (data.key) {
                    this.key = data.key
                }
                this.validateForm.setValue(form)
            }
        }
    }
    @Input() nodeEdit: NodeComponent
    @Output() onUpdate = new EventEmitter()
    @Output() onAdd = new EventEmitter()
    @Input()
    set treeData(value) {
        if (value) {
            this.parents = this.utilService.buildSelectTree(value)
        }
    }
    parents: any[] = []
    validateForm!: FormGroup
    submiting: boolean = false
    nodes: any[] = []
    sonnodes: any[] = []
    contextButton: any
    key: string = null
    type: string
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', url: 'MenuInfo' }
    constructor(private fb: FormBuilder,
        private nzContextMenuService: NzContextMenuService,
        private message: NzMessageService,
        private appService: AppService,
        private menuService: MenuService,
        private utilService: UtilService) { }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            pkey: [null],
            icon: [null],
            url: [null, [Validators.required]],
            name: [null, [Validators.required]],
            sort: [100],
            ismenu: [false]
        })
        this.type = this.menuService.type
    }
    ismenuChange(ev?) {
        let { ismenu } = this.validateForm.value;
        if (ismenu == true) {
            this.validateForm.get('url').clearValidators();
        } else {
            this.validateForm.get('url').setValidators([Validators.required])
        }
    }
    urlChange() {
        const value = this.validateForm.value
        let url = null
        if (value.url) url = value.url.substring(1, value.url.length)
        if (!url) return false
        const pathKey = url.replace(/\//g, "_")
        let name = null
        name = value.name ? value.name : this.appService.translate(`url.${pathKey}`)
        if (!name && this.type != 'padmenu') {//系统菜单才要检测
            this.message.warning(this.appService.translate("common.msgdata.emptyUrlWarn"))
            return false
        }
        value.name = name
        value.ismenu = value.ismenu == 0 ? false : true
        if (value.ismenu == true) {
            this.validateForm.get('url').clearValidators();
        } else {
            this.validateForm.get('url').setValidators([Validators.required])
        }
        this.validateForm.setValue(value)
    }

    nodeSave(data) {
        let list = data.isextend == false ? this.nodes : this.sonnodes;
        if (!data.key) {
            const result = this.nodes.find(item => item.action == data.action);
            if (result) {
                this.message.warning(this.appService.translate("common.msgdata.nodeExistWarn"))
                return false
            }
            this.nodes.push(data)
        } else {
            let button = this.nodes.find(item => item.key == data.key)
            button = Object.assign(button, data);
        }
    }

    contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, item: any): void {
        this.nzContextMenuService.create($event, menu)
        this.contextButton = item
    }

    delButton() {
        const index = this.nodes.findIndex(item => item.key == this.contextButton.key)
        if (index >= 0) {
            this.nodes.splice(index, 1)
        }
    }

    nodeEditOpen(record?) {
        this.nodeEdit.open(record)
    }

    submitForm() {
        this.ismenuChange();
        if (this.submiting) return false
        let menuButtonDtoList = this.nodes.concat(this.sonnodes)
        let { ismenu } = this.validateForm.value;
        const extraData: any = { ismenu: ismenu == false ? 0 : 1, menuButtonDtoList: menuButtonDtoList }
        if (this.type == "padmenu") {//平板菜单
            extraData.isPad = true
        }

        this.submiting = true
        this.appService.formSubmit(this.validateForm, this.menuService, this.key, extraData).then((response: any) => {
            const data = Object.assign(this.validateForm.value, extraData, { key: response.key })
            if (this.key) {
                this.onUpdate.emit(data)
            } else {
                this.onAdd.emit(data)
            }
            this.reset()
        }).finally(() => {
            this.submiting = false
        })
    }

    reset() {
        this.validateForm.reset()
        const value = this.validateForm.value
        value.sort = 100
        this.validateForm.setValue(value)
        this.key = null
        this.nodes = []
    }


}
