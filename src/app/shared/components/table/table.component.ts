import { Component, Input, OnInit, Output, EventEmitter, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

interface tableColumns {
    title: string,
    code?: string,
    width?: string,
    align?: string,
    fixed?: string,
    sort?: boolean,
    sortPriority?: number | boolean,
    sortFn?: any
    headTpl?: string
    tpl?: string
}

@Component({
    selector: 'itable',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.less']
})
export class TableComponent implements OnInit,AfterViewInit {

    @Input() lastColumnTpl: ElementRef
    @Input() lastColumnWidth: string = "80px"
    @Input() lastColumnTitle: string = null
    @Input() columns: tableColumns[] = []
    @Input() tpls: object = {}

    @Output() onPaginationParamsChange = new EventEmitter()
    indeterminate: boolean = false
    @Input() loading: boolean = false
    checked: boolean = false
    @Input() xScroll: string = "600px"
    @Input() yScroll: string = null
    yAutoScroll: string = null
    @Input() total: number = 0
    @Input() data: any[] = []
    @Input() frontPagination: boolean = false
    @Input() pageIndex: number = 1
    @Input() pageSize: number = environment.defaultPageSize
    listOfCurrentPageData: readonly any[] = []
    @Input() setOfCheckedId = new Set<string>()
    @Output() setOfCheckedIdChange = new EventEmitter<any>()
    @Input() showSelection: boolean = true
    @Input() showIndex: boolean = true
    pageSizeOptions :number[] =  [10, 15, 20, 30, 40, 50,200]

    @Input() top: ElementRef
    @Input() drawerTitleHeight: number = 48
    @Input() maskAlert: boolean = false
    
    constructor(
        private eventManager: EventManager,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.eventManager.addGlobalEventListener('window','keydown',$event =>{
            if($event.code =='KeyA' && $event.shiftKey){
                this.data.forEach(item =>{
                    if(this.checked){
                        this.setOfCheckedId.delete(item.key)
                    }else{
                        this.setOfCheckedId.add(item.key)
                    }
                })
                this.refreshCheckedStatus()
            }
        })
        this.eventManager.addGlobalEventListener('window','resize',$event =>{
            this.computeTableYScroll($event.currentTarget.innerHeight)
        })
    }

    ngAfterViewInit(){
        if(!this.yAutoScroll){
            setTimeout(() =>{
                this.computeTableYScroll(window.innerHeight)
                this.cd.detectChanges()
            },200)
        }
    }

    computeTableYScroll(innerHeight){
        if(!this.yScroll){
            const innerTopHeight = this.top?.nativeElement.offsetHeight || 0
            let height = 48 + 36 + 15 + innerTopHeight + 40 + 56
            if(this.maskAlert){//弹出框
                height = 48 + 36 + this.drawerTitleHeight + 10 + innerTopHeight + 40 + 56
            }
            this.yAutoScroll = (innerHeight - height) + "px"
        }
    }

    onQueryParamsChange(params: any): void {
        const { pageSize, pageIndex, sort } = params
        this.onPaginationParamsChange.emit({
            sort: sort.filter(item => item.value),
            pageIndex,
            pageSize
        })
    }

    onCurrentPageDataChange(listOfCurrentPageData: readonly any[]): void {
        this.listOfCurrentPageData = listOfCurrentPageData
        this.refreshCheckedStatus()
        this.setOfCheckedId.clear()
    }

    onAllChecked(checked: boolean): void {
        this.listOfCurrentPageData.forEach(({ key }) => this.updateCheckedSet(key, checked))
        this.refreshCheckedStatus()
    }

    onItemChecked(key: string, checked: boolean): void {
        this.updateCheckedSet(key, checked)
        this.refreshCheckedStatus()
    }

    updateCheckedSet(key: string, checked: boolean): void {
        if (!checked) {
            this.setOfCheckedId.delete(key)
        } else {
            this.setOfCheckedId.add(key)
        }
    }

    refreshCheckedStatus(): void {
        this.checked = this.listOfCurrentPageData.length > 0 && this.listOfCurrentPageData.every(({ key }) => this.setOfCheckedId.has(key))
        this.indeterminate = this.listOfCurrentPageData.some(({ key }) => this.setOfCheckedId.has(key)) && !this.checked
        this.setOfCheckedIdChange.emit(this.setOfCheckedId)
    }

}
