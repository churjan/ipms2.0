import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { UtilService } from '~/shared/services/util.service';

@Component({
    selector: 'InStorageEdit',
    templateUrl: './InStorageEdit.component.html',
    styleUrls: ['./InStorageEdit.component.less']
})
export class InStorageEditComponent extends FormTemplateComponent {
    constructor(private breakpointObserver: BreakpointObserver,) {
        super()
        this.url = 'wh_InStorage'
    }

    @Output() editDone = new EventEmitter<boolean>()
    url = '';
    list: any = new Array();
    body: any = {};
    tab = 0;
    count = { time: 0, key: '' };
    isPreview: boolean = false;

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node && record.node.key) {
            this.key = record.node.key
            this.body = Object.assign({}, {
                wwim_key: this.key ? this.key : '',
                psz_key: record.seach.psz_key ? record.seach.psz_key : '',
                pci_key: record.seach.pci_key ? record.seach.pci_key : '',
                psi_key: record.seach.psi_key ? record.seach.psi_key : '',
                som_key: record.seach.som_key ? record.seach.som_key : '',
                pwb_code: record.seach.pwb_code ? record.seach.pwb_code : '',
                pti_tagcode: record.seach.pti_tagcode ? record.seach.pti_tagcode : '',
                part_name: record.seach.part_name ? record.seach.part_name : '',
                bpi_key: record.seach.bpi_key ? record.seach.bpi_key : '',
                indate_start: record.seach.indate_start ? record.seach.indate_start : '',
                indate_end: record.seach.indate_end ? record.seach.indate_end : ''
            })
        } else {
            this.key = null;
        }
        this.visible = true
    }
    close(): void {
        this.isPreview = false;
        this.tab = 0;
        this.avatar = null
        this.visible = false
    }


}
