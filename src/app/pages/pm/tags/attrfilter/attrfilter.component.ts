import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'attrfilter',
    templateUrl: './attrfilter.component.html',
    styleUrls: ['./attrfilter.component.less']
})
export class AttrfilterComponent implements OnInit {

    @Input() data: Array<any> = []
    @Output() dataChange = new EventEmitter<Array<any>>()
    @Input() fieldOptions: Array<any> = []
    @Input() valueOptions = {}
    @Input() fieldKey: string = 'pca_englishname'
    @Input() valueKey: string = 'attribute_value'
    @Input() multiple: boolean = false

    constructor() { 

    }

    ngOnInit(){
        
    }

    add(){
        let data = []
        if(this.data?.length > 0){
            data = JSON.parse(JSON.stringify(this.data))
        }
        const temp = {}
        temp[this.fieldKey] = null
        temp[this.valueKey] = null
        data.push(temp)
        this.data = data
        this.dataChange.emit(this.data)
    }

    checkSelected(key: string){
        return this.data.map(item =>item[this.fieldKey]).includes(key)
    }

    del(index){
        const data = JSON.parse(JSON.stringify(this.data))
        data.splice(index,1)
        this.data = data
        this.dataChange.emit(this.data)
    }

}
