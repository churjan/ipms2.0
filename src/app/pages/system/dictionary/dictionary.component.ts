import { Component, OnInit, ViewChild } from '@angular/core';
import { EditComponent } from './edit/edit.component';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';

@Component({
    selector: 'app-dictionary',
    templateUrl: './dictionary.component.html',
    styleUrls: ['./dictionary.component.less']
})
export class DictionaryComponent extends ListTemplateComponent {

    @ViewChild('editEle') editEle: EditComponent
    model: any
    width = 400;
    height = 200;
    id = -1;
    constructor() {
        super();
        this.modularInit("sysDictionary");
    }
    onSideResize({ width }: NzResizeEvent): void {
        cancelAnimationFrame(this.id);
        this.id = requestAnimationFrame(() => {
            this.width = width!;
        });
    }
    onclick(ev) {
        if (!ev) { this.SearchModel = {}; } else { this.SearchModel.psc_key = ev.key; }
    }
    onAction(ev) {
        switch (ev.action) {
            case 'add':
                this.model = {
                    pkey: ev.node ? ev.node.key : '',
                    pcode: ev.node ? ev.node.code : '',
                    sort: ev.node ? ev.node['sort'] + 1 : ''
                }
                return;
            case 'update':
                this._service.getModel(this.modular.url, ev.node.key, (response: any) => {
                    response = Object.assign({}, response)
                    this.model = { ...response, version: Math.random() }//添加version防止修改后再次点击同一个菜单没反应
                })
                return;
        }
    }

    ngOnInit(): void {
    }

    successAdd(ev) { }
    successUpdate(ev) { }
}
