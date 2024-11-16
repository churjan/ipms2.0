import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '~/shared/services/app.service';

@Component({
    selector: 'conditions',
    templateUrl: './conditions.component.html',
    styleUrls: ['./conditions.component.less']
})
export class ConditionsComponent implements OnInit {

    @Input() data: Array<any> = []
    @Output() dataChange = new EventEmitter<Array<any>>()
    @Input() fieldOptions: any
    @Input() valueOptions: Array<object> = []
    @Input() canDeleteAll: boolean = false
    operators = ['=', '!=', '<', '<=', '>', '>=']


    constructor(
        private message: NzMessageService,
        private appService: AppService
    ) { }

    ngOnInit() { }

    add() {
        let data = []
        if (this.data?.length > 0) {
            data = JSON.parse(JSON.stringify(this.data))
        }
        data.push(
            {
                field: null,
                operator: null,
                value: null,
                key: null
            }
        )
        this.data = data
        this.dataChange.emit(this.data)
    }

    checkSelected(key: string) {
        const temp = this.data.map(({ field }) => field)
        return temp.includes(key)
    }

    delete(index) {
        const data = JSON.parse(JSON.stringify(this.data))
        if (!this.canDeleteAll && data.length <= 1) return false
        data.splice(index, 1)
        this.data = data
        this.dataChange.emit(this.data)
    }

    verify() {
        const conditions: Array<any> = this.data
        for (let i = 0; i < conditions.length; i++) {
            if (!conditions[i].field) {
                this.message.warning(this.appService.translate("checkdata.conditionFieldEmptyWarn"))
                return false
            }
            if (!conditions[i].operator) {
                this.message.warning(this.appService.translate("checkdata.conditionOperatorEmptyWarn"))
                return false
            }
            if (!conditions[i].value) {
                this.message.warning(this.appService.translate("checkdata.conditionValueEmptyWarn"))
                return false
            }
        }
        return true
    }

    ChangeAttr(condition: any, item) {
        item.optionmode = condition ? condition.optionmode : '';
        item.optionvalue = condition ? condition.optionvalue : '';
        item.inputtype = condition ? condition.inputtype : '';
        item.type = condition ? condition.inputtype : '';
        if (item.optionmode == "customselect")
            item.valueslist = item.optionvalue ? JSON.parse(item.optionvalue) : [];
        // item.value = !condition || item.field != condition.field ? null : item.value;
    }
    testing(ev, item) {
        if (item.inputtype == 'Int' && (ev.code == "NumpadDecimal")) {
            this.message.error(this.appService.translate('warning.total'))
            item.value = parseInt(item.value);
            item.Status = 'error';
            return
        }
    }
}
