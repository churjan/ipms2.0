import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonService } from '~/shared/services/http/common.service';
@Component({
    selector: 'app-single-select',
    templateUrl: './single-select.component.html',
    styleUrls: ['./single-select.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SingleSelectComponent),
            multi: true,
        },
    ],
})
export class SingleSelectComponent implements OnInit, ControlValueAccessor {
    @Input() label: string = 'label';
    @Input() valueKey: string = 'value';
    @Input() valueFields?: any;
    @Input() path;
    @Input() customContent;
    @Input() disabled = false;
    @Input() width = 'auto';
    @Input() isShowClear = true;
    @Input() isCodeName = false; // name前面是否显示code
    selectItem;
    list: any[] = [];
    constructor(private commonService: CommonService) { }

    ngOnInit(): void {
        if (this.path) {
            this.fetchList().then((data: any) => {
                let list = [];
                if (data)
                    list = Array.isArray(data) ? data : data.data;
                if (this.isCodeName) {
                    list.forEach(item => {
                        item.name = item.code + item.name
                    })
                }
                this.list = list;
            });
        } else if (this.customContent) {
            this.list = JSON.parse(this.customContent);
        }
    }

    fetchList() {
        return this.commonService.selectList(this.path);
    }

    /**
     * ControlValueAccessor Start
     */
    onValueUpdate(value) {
        if (value === null) {
            this.propagateOnChange(value);
            return;
        }

        let dic = {};
        if (Array.isArray(this.valueFields)) {
            for (let item of this.valueFields) {
                dic[item] = value[item];
            }
        } else if (typeof this.valueFields == 'string') {
            dic = value[this.valueFields];
        } else {
            dic = value;
        }

        this.propagateOnChange(dic);
    }

    compareFn = (o1: any, o2: any) => {
        // 处理值为0的情况
        if (o1 === 0 && o2 && o2[this.valueKey] === 0) {
            return o1 === o2[this.valueKey];
        }

        if (o2 === 0 && o1 && o1[this.valueKey] === 0) {
            return o2 === o1[this.valueKey];
        }

        return o1 && o2
            ? (o1[this.valueKey] || o1) === (o2[this.valueKey] || o2)
            : o1 === o2;
    };

    writeValue(value) {
        if (![null, undefined, ''].includes(value)) {
            this.selectItem = value;
        } else {
            this.selectItem = null;
        }
    }

    propagateOnChange: (value: any) => void = (_: any) => { };
    propagateOnTouched: (value: any) => void = (_: any) => { };
    registerOnChange(fn: any) {
        this.propagateOnChange = fn;
    }
    registerOnTouched(fn: any) {
        this.propagateOnTouched = fn;
    }
    /**
     * ControlValueAccessor End
     */
}
