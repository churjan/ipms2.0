import { Component, Output, OnInit, forwardRef, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { I18nPipe } from '~/shared/pipes/i18n.pipe';
import { UtilService } from '~/shared/services/util.service';
declare var $: any;
const C_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomSelectContent),
    multi: true
};
@Component({
    selector: 'custom-select',
    templateUrl: './custom-select.component.html',
    providers: [C_SWITCH_CONTROL_VALUE_ACCESSOR, I18nPipe],
    styleUrls: ['./custom-select.component.scss']
})
/**公共下拉 */
export class CustomSelectContent implements ControlValueAccessor, OnInit, OnChanges {
    constructor(
        private i18n: I18nPipe,
        private message: NzMessageService
    ) { }
    /**初始化数据源*/
    @Input() optionList: any[] = [];
    /**初始值 */
    @Input() value: any[] | string;
    /**接口地址 */
    @Input() url: string;
    /**接口类型 */
    @Input() urltype: string;
    /**数据源类型 */
    @Input() Datatyle: string = '';
    /**其他查询参数 */
    @Input() other: any;
    /**标题 */
    @Input() title: string;
    /**绑定字段 */
    @Input() DataFiled = 'key';
    /**绑定内容首显字段类型 */
    @Input() DataTxt = 'name';
    /**绑定内容次显字段类型 */
    @Input() secondary = 'code';
    /**状态标记*/
    loading = true;
    flag = false;
    /**完全加载 */
    Fullload = false;
    /**数据分页*/
    pageMap: any = { page: 1, pagesize: `20` };
    /**是否必选项 */
    @Input() required = false;
    /**是否禁止 */
    @Input() isdisabled: boolean = false;
    /**是否查询 */
    @Input() isSeach = true;
    /**是否双值显 */
    @Input() isshow = true;
    /**是否多选*/
    @Input() multiple = false;
    /**是否联动*/
    @Input() linkage = false;
    /**是否停止获取*/
    @Input() isstop = false;
    /**联动数据*/
    @Input() set linkagedata(obj) {
        let Empty = true;
        for (let o in obj) {
            if (UtilService.isEmpty(obj[o]) == true) { obj[o] = ''; }
            if (UtilService.isNotEmpty(obj[o]) == true) { Empty = false; }
        }
        if (Empty == false) {
            this.other = this.other ? Object.assign(this.other, obj) : obj;
            // this.Search();
        }
    };
    /**是否可添加 */
    @Input() isAdd = false;
    /**
     * ComponentParam 模块选择
     * soncom 添加数据模块
     */
    @Input() AddConfiguration: any = {}
    /**选择后返回事件 */
    @Output() onSelect = new EventEmitter();
    /**双向绑定值改变 */
    writeValue(obj: any): void {
    }
    /**改变*/
    ngOnChanges(changes: SimpleChanges) {
    }
    registerOnChange(fn: any) { this.onChangeCallback = fn; }

    registerOnTouched(fn: any) { this.onTouchedCallback = fn; }

    private onTouchedCallback = (v: any) => { }

    private onChangeCallback = (v: any) => { }
    /**初始化 */
    ngOnInit() {
    }
    editId: string | null = null;
    addItem(): void {
        if (!this.optionList) this.optionList = []
        if (this.optionList.length - 1 >= 0 && this.optionList[this.optionList.length - 1].name == '') {
            this.message.error(this.i18n.transform('warning.Please_intactfront')); return;
        }
        this.optionList = [
            {
                // id: "1",
                name: '',
                value: ''
            },
            ...this.optionList
        ];
        this.optionList.forEach((v, i) => v.id = String(i + 1));
        this.editId = "1";
        this.clickItem(this.optionList)
    }
    /**开始编辑 */
    startEdit(id: string): void { this.editId = id; }
    /**取消编辑 */
    stopEdit(): void {
        this.editId = null;
        this.clickItem(this.optionList)
    }
    deleteRow(id: string): void {
        this.optionList = this.optionList.filter(d => d.id !== id);
        this.optionList.forEach((v, i) => v.id = i + 1)
        this.clickItem(this.optionList)
    }
    /**重置 */
    empty() {
        this.pageMap.page = 1;
        this.value = this.multiple == true ? [] : '';
        this.isstop = false;
        this.optionList = [];
    }
    /**输出选中值 */
    clickItem(v?) {
        this.onChangeCallback(v);
        this.onTouchedCallback(v);
        if (this.onSelect) { this.onSelect.emit(v); }
    }
}