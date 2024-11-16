import { Component, Output, OnInit, forwardRef, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilService } from '~/shared/services/util.service';
import { endOfMonth } from 'date-fns';
import { AppService } from '~/shared/services/app.service';
declare var $: any;
const C_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateSelectContent),
    multi: true
};
@Component({
    selector: 'date-select',
    templateUrl: './date.component.html',
    providers: [C_SWITCH_CONTROL_VALUE_ACCESSOR],
    styleUrls: ['./date.component.scss']
})
/**公共下拉 */
export class DateSelectContent implements ControlValueAccessor, OnInit, OnChanges {
    constructor(
        private service: UtilService,
        private message: NzMessageService,
        private appservice: AppService,
    ) {
        this.ranges[this.appservice.translate('placard.Today')] = [new Date(), new Date()];
        this.ranges[this.appservice.translate('placard.Month')] = [new Date(), endOfMonth(new Date())];
    }
    /**查询值 */
    searchvalue: string = "";
    /**选择对象 */
    selectModel: any[] | any = {};
    /**初始化数据源*/
    @Input() optionList: any[] = [];
    /**值 */
    @Input() sdate: any;
    /**初始值 */
    @Input() date: any;
    /**接口地址 */
    @Input() url: string;
    /**日期类型 */
    @Input() Mode: string = 'date';
    /**是否带时间 */
    @Input() ShowTime: boolean = false;
    /**自定义格式 */
    @Input() dateFormat = 'yyyy-MM-dd';
    /**是否为范围选择*/
    @Input() isRange = false;
    /**尺寸*/
    @Input() size = 'default';
    /**是否禁用 */
    @Input() isDisabled = false;
    /**数据源类型 */
    @Input() ranges: any = {};
    /**样式 */
    @Input() widthClass: string = ''
    /**选择后返回事件 */
    @Output() onSelect = new EventEmitter();
    /**双向绑定值改变 */
    writeValue(obj: any): void {
        if (UtilService.isNotEmpty(obj) == true || obj == 0) {
            this.date = obj;
        } else {
            this.date = null;
        }
    }
    /**改变*/
    ngOnChanges(changes: SimpleChanges) {
        if (changes.sdate) {
            if (!changes.sdate.currentValue.end && !changes.sdate.currentValue.start) {
                this.Reset();
            }
        }
    }
    registerOnChange(fn: any) { this.onChangeCallback = fn; }

    registerOnTouched(fn: any) { this.onTouchedCallback = fn; }

    private onTouchedCallback = (v: any) => { }

    private onChangeCallback = (v: any) => { }
    /**初始化 */
    ngOnInit() { }
    onChange(result: any): void {
        if (this.isRange == true) {
            let model: any = {}
            if (result.length > 1) {
                model.start = UtilService.dateFormat(result[0], this.dateFormat)
                model.end = UtilService.dateFormat(result[1], this.dateFormat)
            }
            if (this.onSelect) { this.onSelect.emit(model); }
        } else {
            let v = UtilService.dateFormat(result, this.dateFormat)
            if (this.onSelect) { this.onSelect.emit(v); }
            this.onChangeCallback(v);
            this.onTouchedCallback(v);
        }
    }
    Reset() { this.date = null; }
}