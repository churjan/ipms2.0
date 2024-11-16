import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { UtilService } from '~/shared/services/util.service';

@Component({
    selector: 'InfeedDetails',
    templateUrl: './InfeedDetails.component.html',
    styleUrls: ['../padMonitor.component.less']
})
export class InfeedDetailsComponent extends FormTemplateComponent {

    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver, private util: UtilService,
    ) { super() }
    @Output() editDone = new EventEmitter<boolean>()
    lineDetailsList = [];//站位信息列表
    carrierData = [];//载具信息
    isLineDetailsTableLoading: boolean = false;//载具表格 是否加载
    //获取当前弹窗内容高度
    popupContHeight = 0;

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '99%'
                this.popupContHeight = (window.innerHeight - 82) * 0.99;
            } else {
                this.width = '100%'
            }
        })
    }

    async open(record: any) {
        this.title = this._appService.translate(record.title);
        this.visible = true
        //进轨信息
        this._service.comList('layoutstructure/infeed', { infeed_code: record.node.infeed_code }, '', false).then((res: any) => {
            this.lineDetailsList = res;
        }, () => { }).finally(() => {
        });
        //载具列表
        this.isLineDetailsTableLoading = true;
        this._service.comList('layoutstructure/infeed', { infeed_code: record.node.infeed_code }, 'carriers', false).then((res: any) => {
            this.carrierData = res;
        }, () => { }).finally(() => {
            this.isLineDetailsTableLoading = false;
        });
    }
    close(): void {
        this.avatar = null
        this.visible = false
    }


}
