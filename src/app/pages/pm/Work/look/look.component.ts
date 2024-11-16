import { Component, Input } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { UtilService } from '~/shared/services/util.service';
declare var $: any;
@Component({
    selector: 'work-look',
    templateUrl: './look.component.html',
    styleUrls: ['./look.component.css']
})
export class LookComponent extends FormTemplateComponent {
    constructor() { super(); }
    @Input() key: string;
    statelist: any[] = [];
    Explist: any[] = [];
    hangerList = new Array();
    list: any[];
    Extend: any = [];
    tab = 0;
    Result = 0;
    isseal = false;
    project = sessionStorage.project ? sessionStorage.project : '';
    inpara: any = { IsSeparate: false, height: this.winHeight + 138, Iscopy: false, flowmodel: "work", isedit: false, islook: true }
    ngOnInit() {
        const that = this;
        this.winResize();
        $(window).resize(function () { that.winResize(); });
        // this._service.enumList('workstatus', (result) => { this.statelist = result; });
    }
    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node) {
            this._service.getModel(this.modular.url, record.node.key, (response: any) => {
                this.model = response;
            })
        } else { }
        this.visible = true
    }
    GetList() {
        const that = this;
        this._service.getModel(this.modular.url, this.model.key, function (params) {
            that.model = params.data;
            // let data = Utils.dateFormat(new Date());
            // let _contrast = Utils.TimeComparison(that.model.requestdeliverydate, data);
            // that.Result = that.statelist.length > 0 ? that.statelist.findIndex(s => s.value == that.model.state) / (that.statelist.length - 1) * 100 : 0;
            // if (_contrast == true && that.Result < 100) { that.isseal = true; }
            // // if (params.data.pwe_entity) { that.Extend = params.data.pwe_entity; }
            // if (params.data.attribute_list) { that.Extend = params.data.attribute_list; }
        }, function (err) { });
        if (this.project == 'GIU') {
            this._service.getList(this.modular.otherUrl.Batching, { pwb_key: this.model.key }, function (params) {
                that.list = params.data;
            }, function (err) { });
        }
        this._service.getPage(that.otherUrl.furl, { pwb_key: that.model.key }, function (r) {
            if (r.data.partlist && r.data.partlist.length > 0) {
                that.Explist = new Array();
                r.data.partlist.forEach(dp => {
                    that.Explist.push({ part_key: dp.bpi_key, part_name: dp.bpi_name, part_code: dp.bpi_code, pwb_key: r.data.pwb_key });
                });
                if (that.Explist.length > 0) { that.check(that.Explist[0], 0); }
            }
        });
    }

    //交货日期和当前时间对比
    toTimeComparison(date) {
        // console.log(date)
        if (!date) return true;
        return UtilService.TimeComparison(UtilService.dateFormat(new Date()), date.substring(0, 10))
    }
    check(item, num) {
        const that = this;
        this._service.getList(this.otherUrl.Excipient, { part_key: item.part_key, pwb_key: item.pwb_key }, function (model) {
            // that.Excipientslist = model.data;
        });
    }
    getpath(url) { window.open(url); }
    getHanger() {
        this.tab = 3;
        // this._service.getList(this.otherUrl.hanger, { pwb_key: this.model.key }, (result) => {
        // },(err)=>{},'')
    }
    close(): void {
        this.avatar = null
        this.visible = false;
    }
}
