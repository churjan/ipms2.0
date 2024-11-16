import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-custom-table',
    templateUrl: './custom-table.component.html',
    styleUrls: ['./custom-table.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomTableComponent),
            multi: true,
        },
    ],
})
export class CustomTableComponent implements OnInit {
    tableList: any[] = [];
    editCache: any = {};

    constructor() {}

    ngOnInit(): void {
        
    }

    onAddRow() {
        this.tableList = [
            ...this.tableList,
            {
                name: '',
                value: '',
            },
        ];
        this.updateEditCache();
        this.editCache[this.tableList.length - 1].edit = true;
    }

    onDeleteRow(i) {
        this.tableList = this.tableList.filter((item, idx) => idx !== i);
        this.updateEditCache();

        this.onValueUpdate()
    }

    updateEditCache() {
        this.tableList.forEach((item, idx) => {
            this.editCache[idx] = {
                edit: false,
                data: { ...item },
            };
        });
    }

    onStartEdit(idx) {
        this.editCache[idx].edit = true;
    }

    onSaveEdit(i) {
        Object.assign(this.tableList[i], this.editCache[i].data);
        this.editCache[i].edit = false;

        this.onValueUpdate()

    }

    onCancelEdit(i) {
        this.editCache[i] = {
            data: { ...this.tableList[i] },
            edit: false,
        };
    }

    /**
     * ControlValueAccessor Start
     */
     onValueUpdate() {
        this.propagateOnChange(this.tableList);
    }

    writeValue(value) {
        if (Array.isArray(value)) {
            this.tableList = value;
        }else{
            this.tableList=[]
        }
        this.updateEditCache();
    }

    propagateOnChange: (value: any) => void = (_: any) => {};
    propagateOnTouched: (value: any) => void = (_: any) => {};
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
