import { Component, Input } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { UtilService } from '~/shared/services/util.service';
import { OutControlService } from '../../outcontrol/outControl.service';
declare var $: any;
@Component({
    selector: 'planlook',
    templateUrl: './planlook.component.html',
    styleUrls: ['./planlook.component.css']
})
export class PlanLookComponent extends FormTemplateComponent {
    constructor(
        public outControlService: OutControlService,) { super(); }
    @Input() key: string;
    statelist: any[] = [];
    detailvisible: boolean = false;
    tableData: any[] = []
    tableColumns: any[] = []
    data: any
    tableDataOriginal: any[] = []
    currentField: string
    filterFieldsValue: any = {}
    filterFieldsVisible: any = {}
    loading: boolean = false
    detail: any = {}
    ngOnInit() {
        const that = this;
        this.winResize();
        $(window).resize(function () { that.winResize(); });
        this.tableColumns = this.outControlService.detailTableColumns()
        this._service.enumList('warehouseoutboundplanenum').then((result) => { this.statelist = result; });
    }
    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node) {
            this._service.getModel(this.modular.url, record.node.key, (params) => {
                this.model = params;
            }, function (err) { });
        } else { }
        this.visible = true
    }
    operation(item) {
        const that = this;
        this._service.getModel('admin/w_warehouseoutboundplanrelation/', item.wwopor_key, (r) => {
            this.detail = r
        })
        this._service.getPage(this.modular.otherUrl.detail, { key: item.wwopor_key, pageSize: 15, page: 1 }, (model) => {
            this.tableData = model.data
            this.detailvisible = true
        });
    }

    filterFieldOpen(visible: boolean, field: string) {
        if (visible) {
            this.currentField = field
        } else {
            this.currentField = null
        }
    }
    search(event?) {
        if (!event || event.key == "Enter") {
            this.loading = true
            setTimeout(() => {//异步执行过滤
                this.tableData = JSON.parse(JSON.stringify(this.tableDataOriginal))
                for (let key in this.filterFieldsValue) {
                    const value = this.filterFieldsValue[key]
                    if (value) {
                        this.tableData = this.searchFilter(this.tableData, key, value)
                    }
                }
                this.filterFieldsVisible[this.currentField] = false
                this.loading = false
            }, 400)
        }
    }

    reset() {
        this.filterFieldsValue[this.currentField] = null
        this.search()
    }

    searchFilter(data: Array<any>, field: string, value: string) {
        return data.filter(item => { return item[field].indexOf(value) >= 0 })
    }
    changeStatus(item: any) {
        if (item.state == 99) {//关闭、完成状态不允许再变更状态
            this.message.warning(this.getTipsMsg('autoOutControl.statusChangeWarn'))
            return false
        }
        this._modalService.confirm({
            nzTitle: this._appService.translate("confirm.confirmworkClose", item.state_name),
            nzContent: '',
            nzOnOk: () => {
                this._service.comPost('admin/w_warehouseoutboundplanrelation/extend/changestatus/', { key: item.wwopor_key, state: item.state }).then((result) => {
                    // this.operation({ wwopor_key: item.wwopor_key })
                    this._service.getModel(this.modular.url, this.model.key, (params) => {
                        this.model = params;
                    }, function (err) { });
                    this.message.success(this.getTipsMsg('sucess.s_update'));
                }, (msg) => { });
            }
        });
    }
    close(): void {
        this.avatar = null
        this.visible = false;
    }
    detailclose() {
        this.detailvisible = false;
    }
}
