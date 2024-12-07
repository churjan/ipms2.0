import { Component, EventEmitter, Output } from "@angular/core";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { FormTemplateComponent } from "~/shared/common/base/form-Template.component";
import { UtilService } from "~/shared/services/util.service";

@Component({
    selector: 'hangerdetail',
    templateUrl: './hangerdetail.component.html',
    styleUrls: ['./hangerdetail.component.less']
})
export class HangerDetailComponent extends FormTemplateComponent {
    constructor(private breakpointObserver: BreakpointObserver,) {
        super();
    }
    @Output() editDone = new EventEmitter<boolean>()
    OvrLoadGroupEnum = [
        { Description: "款式", value: 1 },
        { Description: "颜色", value: 3 },
        { Description: "尺码", value: 4 },
        { Description: "相同生产线", value: 10 },
        { Description: "相同虚拟线", value: 11 },
        { Description: "相同存储方案", value: 20 },
        { Description: "工序", value: 2 },
        { Description: "作业单", value: 0 }
    ]
    OverLoadOrderTypeEnum = [
        { Description: "先进先出", value: 1 },
        { Description: "先绑定先出", value: 0 }
    ]
    isgrouporder: boolean = false;
    node: any = {};
    /**分组 */
    overload_options = new Array();
    /**排序分组 */
    grouporder = new Array();
    /**可配置值 */
    orderOptions = [
        { Description: "作业单等级", value: 'Level' },
        { Description: "作业单交货日期", value: 'RequestDeliveryDate' },
        { Description: "作业单实际开始生产时间", value: 'Production_Start_Time ' }
    ];
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            this.width = '55%'
        })
        this.otherUrl = this.modular.otherUrl;
        this.columns = this.modular.flow;
    }
    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title);
        if (record.node) {
            let { overload_options } = record.node
            let _options = JSON.parse(overload_options);
            _options.forEach(_o => {
                if (_o == 0) this.isgrouporder = true;
                this.overload_options.push({ value: _o, value_name: this.OvrLoadGroupEnum.find(on => on.value == _o).Description })
            })
            this.node = Object.assign(this.node, record.node)
        } else {
            this.node = Object.assign(this.node, { overload_order: 1 })
        }
        this.visible = true
    }
    minus(data, i) {
        // this.overload_options.splice(i, 1)
        this.overload_options = this.overload_options.filter((nb, index) => index != i)
    }
    addoverload_options(item) {
        if (this.overload_options.filter(o => o.value == item.value).length > 0) {
            this.message.error(this.getTipsMsg('warning.valueNoRepeat'))
            return;
        }
        // this._service.comList('WorkBillOrders',{}).then(optin=>{
        //     this.orderOptions=optin
        // })
        if (item.value == 0) this.isgrouporder = true;
        this.overload_options = this.overload_options.concat(...[{ i: this.overload_options.length, value: item.value, value_name: item.Description }]);
    }
    move(index1, index2) {
        let array = [this.overload_options[index2], this.overload_options[index1]]
        let array1 = this.overload_options.filter((oa, i) => i < index1)
        let array2 = this.overload_options.filter((oa, i) => i > index2)
        this.overload_options = array1.concat(...array, ...array2)
    }
    moveChange(index1, index2) {
        let array = [this.grouporder[index2], this.grouporder[index1]]
        let array1 = this.grouporder.filter((oa, i) => i < index1)
        let array2 = this.grouporder.filter((oa, i) => i > index2)
        this.grouporder = array1.concat(...array, ...array2)
    }
    minusChange(data, i) {
        this.grouporder = this.grouporder.filter((nb, index) => index != i)
    }
    addGrouporder(item) {
        this.grouporder = this.grouporder.concat(...[{ i: this.grouporder.length, value: item.value, value_name: item.Description }]);
    }
    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false
        if (!event || event.key == "Enter") {
            if (UtilService.isEmpty(this.node.name)) {
                this.message.error(this.getTipsMsg('warning.Please_completedata', this.getTipsMsg('pmOverloadManagement.name')));
                return
            }
            if (UtilService.isEmpty(this.overload_options)) {
                this.message.error(this.getTipsMsg('warning.Please_completedata', this.getTipsMsg('pmOverloadManagement.overload_options')));
                return
            }
            if (UtilService.isEmpty(this.node.overload_order)) {
                this.message.error(this.getTipsMsg('warning.Please_completedata', this.getTipsMsg('pmOverloadManagement.overload_order')));
                return
            }
            let _options = new Array();
            this.overload_options.forEach(o => {
                if (o.value >= 0) {
                    _options.push(o.value)
                }
            });
            this.node = Object.assign(this.node, { overload_options: JSON.stringify(_options) })
            if (this.isgrouporder == true && this.grouporder && this.grouporder.length > 0) {
                let _group = new Array();
                this.grouporder.forEach(o => {
                    if (o.value >= 0) {
                        _group.push(o.value)
                    }
                });
                this.node = Object.assign(this.node, { group_order: JSON.stringify(_group) })
            }
            this.submiting = true;
            super.save({ url: this.otherUrl.OverloadGroup, doAction: 'post', model: this.node }, () => {
                this.submiting = false;
                this.editDone.emit(true)
                this.close();
            });
        }
    }
    close(): void {
        this.node = {};
        this.overload_options = new Array();
        this.visible = false
    }
}