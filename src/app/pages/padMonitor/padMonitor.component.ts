import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { CrudComponent } from "~/shared/common/crud/crud.component";
import { I18nPipe } from "~/shared/pipes/i18n.pipe";
import { AppConfig, modularList } from "~/shared/services/AppConfig.service";
import { UtilService } from "~/shared/services/util.service";
import { InfeedDetailsComponent } from "./InfeedDetails/InfeedDetails.component";



@Component({
    selector: 'app-padMonitor',
    templateUrl: './padMonitor.component.html',
    styleUrls: ['./padMonitor.component.less'],
    providers: [I18nPipe]
})
export class PadMonitorComponent extends ListTemplateComponent {
    constructor(public route: ActivatedRoute,
        private util: UtilService,) {
        super();
        this.modularInit("padMonitor");
    }
    getBody: any;
    isChange: any;
    transfer = [];
    Footer: any = {}
    @ViewChild('crud', { static: false }) _crud: CrudComponent;
    @ViewChild('InfeedDetails', { static: false }) _InfeedDetails: InfeedDetailsComponent;
    async ngOnInit() {
        // 订阅活动路由
        this.route.params.subscribe(params => {
            this.getlist();
            setTimeout(() => { this._crud.reloadData(false); }, 600);
        });
    }
    async getlist(model?) {
        if (model) { this.isChange = model; } else {
            this.isChange = this.route.snapshot.paramMap.get('id');
            if (this.route.snapshot.queryParams.keywords) { this.isChange = this.route.snapshot.queryParams.keywords }
            this.transfer = (this.route.snapshot['_routerState'].url).split('/');
        }
        if (this.isChange && this.isChange != '') {
            this.getBody = { line_key: this.isChange, columns: 'columns' + this.isChange }
            this._service.comList('layoutstructure/linecarriers', this.getBody, '', false).then((s) => {
                this.Footer = s
            })
            // this._crud.reloadData(false);
        }
    }
    btnEvent(event) {
        switch (event.action) {
            case 'refresh':
                // let { station_code } = event.node
                // if (this.util.isAbnormalValue(station_code)) {
                //     this._service.comList('layoutstructure/station/',{ station_code: station_code }).then((res: any) => {
                //     }, () => { }).finally(() => { });
                // } else {
                //     this.message.create('warning', this.util.getComm('warning.noKey'));
                // }
                return;
            case 'allrefresh':
                // this.getlist();
                return;
        }
    }
    infeedCode = "";//进轨code
    stationCode = "";//用于单条刷新
    toInfeedDetails(infeed_code, station_code) {
        this.stationCode = "";//重置
        if (this.util.isAbnormalValue(station_code)) {
            this.stationCode = station_code;
        }
        if (this.util.isAbnormalValue(infeed_code)) {
            this._InfeedDetails.open({ title: 'placard.detailInfo', node: { station_code: this.stationCode, infeed_code: infeed_code } })
        } else {
            this.message.create('warning', this.util.getComm('warning.noKey'));
        }
    }
}