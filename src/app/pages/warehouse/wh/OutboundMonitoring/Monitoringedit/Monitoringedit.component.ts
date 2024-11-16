import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '~/pages/hr/employee/employee.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { CommonService } from '~/shared/services/http/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { UtilService } from '~/shared/services/util.service';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
    selector: 'Monitoringedit',
    templateUrl: './Monitoringedit.component.html',
    styleUrls: ['./Monitoringedit.component.less']
})
export class MonitoringEditComponent extends FormTemplateComponent {

    @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;
    @Output() editDone = new EventEmitter<boolean>()
    defaultCheckedKeys = ['0-0-0'];
    defaultSelectedKeys = ['0-0-0'];
    nodes: NzTreeNodeOptions[] = [];
    WarehouseTree = {
        maketree: true,
        moduletype: 103
    };
    selectnode = [];
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        public commonService: CommonService
    ) { super(); }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '500px'
            } else {
                this.width = '100%'
            }
        })
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        this._service.comList('LayoutStructure/extend', this.WarehouseTree, 'NewGetList').then((result) => {
            this.nodes = this.initMenus(result);
            // console.log(result);
        })
        this.visible = true
    }

    /**
     * 构建文件结构树。
     */
    initMenus(data, pkey?) {
        if (!data || data.length <= 0) return [];
        data = data.sort((a, c) => a.sort - c.sort);
        return data.map(item => {
            let extra = false;
            if (item.pkey == item.key) item.pkey = null;
            if (!pkey || pkey == '' || pkey == '0') {
                extra = data.find(d => d.key == item.pkey) ? false : true;
            }
            if ((!pkey && (!item.pkey || item.pkey == '' || item.pkey == '0')) || (pkey && item.pkey && item.pkey == pkey) || extra == true) {
                const temp = Object.assign(item, {
                    title: item.name + (item.code ? '[' + item.code + ']' : ''),
                    children: item.sonlist ? item.sonlist : []
                })
                if (item.sonlist && item.sonlist.length > 0) {
                    temp.children = this.initMenus(item.sonlist, item.key)
                }
                if (!item.sonlist || item.sonlist.length == 0) {
                    let s = data.filter(f => f.pkey && f.pkey != '' && f.pkey != '0' && item.key !== f.key);
                    temp.children = UtilService.uniq(this.initMenus(s, item.key))
                }
                if (temp.children.length == 0) temp.isLeaf = true;
                return temp
            }
        })
    }
    nzEvent(event: NzFormatEmitEvent): void {
        // console.log(event);
        // this.selectnode.push()
    }

    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false

        if (!event || event.key == "Enter") {
            this.submiting = true
            let selectnode = this.nzTreeComponent.getCheckedNodeList()
            selectnode.forEach(sn => {
                if (sn.level == 0) {
                    sn.children.forEach(sns => {
                        this._service.saveModel('admin/UnloadingStation/', 'post', { bls_key: sns.key, bls_pkey: sns.parentNode ? sns.parentNode.key : '' }, (sucess) => {
                        }, (err) => { this.submiting = false; })
                    });
                } else {
                    this._service.saveModel('admin/UnloadingStation/', 'post', { bls_key: sn.key, bls_pkey: sn.parentNode ? sn.parentNode.key : '' }, (sucess) => {
                    }, (err) => { this.submiting = false; })
                }
                this.submiting = false;
                this.close()
            })
            // super.save({ model: [] }, (v) => {
            //     this.submiting = false;
            // });
        }
    }

    close(): void {
        this.avatar = null
        this.visible = false;
        this.editDone.emit(true);
    }


}
