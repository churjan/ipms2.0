import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { UtilService } from '~/shared/services/util.service';
import { CrudComponent } from '~/shared/common/crud/crud.component';

@Component({
    selector: 'OutboundEdit',
    templateUrl: './OutboundEdit.component.html',
    styleUrls: ['./OutboundEdit.component.less']
})
export class OutboundEditComponent extends FormTemplateComponent {
    constructor(private breakpointObserver: BreakpointObserver,) {
        super()
        this.url = 'wh_InStorage'
    }
    @ViewChild('crud', { static: false }) _crud: CrudComponent;

    @Output() editDone = new EventEmitter<boolean>()
    url = '';
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
                wwom_key: this.key ? this.key : '',
                psz_key: record.seach.psz_key ? record.seach.psz_key : '',
                pci_key: record.seach.pci_key ? record.seach.pci_key : '',
                psi_key: record.seach.psi_key ? record.seach.psi_key : '',
                som_key: record.seach.som_key ? record.seach.som_key : '',
                pwb_code: record.seach.pwb_code ? record.seach.pwb_code : '',
                pti_tagcode: record.seach.pti_tagcode ? record.seach.pti_tagcode : '',
                part_name: record.seach.part_name ? record.seach.part_name : '',
                bpi_key: record.seach.bpi_key ? record.seach.bpi_key : '',
                outdate_start: record.seach.outdate_start ? record.seach.outdate_start : '',
                outdate_end: record.seach.outdate_end ? record.seach.outdate_end : ''
            })
        } else {
            this.key = null;
        }
        this.visible = true
    }
    play(item) {
        this.Confirm('confirm.confirm_deln', this.getTipsMsg('confirm.confirm_delcheck'), (confirmType) => {
            if (confirmType == 'pass') {
                this._service.comPost(this.modular.otherUrl.closedetailurl, { key: item.key }).then((data) => {
                    this.message.success(this.getTipsMsg('sucess.s_close'))
                    this._crud.reloadData(false);
                })
            }
        })
    }
    close(): void {
        this.tab = 0;
        this.avatar = null
        this.visible = false
    }


}
