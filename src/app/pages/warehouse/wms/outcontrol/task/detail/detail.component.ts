import { Component, OnInit } from '@angular/core';
import { AppService } from '~/shared/services/app.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OutControlService } from '~/pages/warehouse/wms/outcontrol/outControl.service';
import { OutControlTaskService } from '~/pages/warehouse/wms/outtask/outControlTask.service';

@Component({
    selector: 'detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {

    title: string
    width: string
    visible: boolean = false
    queryParams: any = {}
    loading: boolean = false
    tableColumns: any[] = []
    dataOriginal: any
    data: any
    filterFieldsVisible: any = {}
    filterFieldsValue: any = {}
    currentField: string
    tableDataOriginal: any[] = []
    tableData: any[] = []
    outControlTaskdata:any = {}
    
    constructor(
        private breakpointObserver: BreakpointObserver,
        public outControlService: OutControlService,
        private outControlTaskService: OutControlTaskService,
        private appService :AppService
    ) { }

    async ngOnInit() {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if(!result.matches){
                this.width = '99%'
            }else{
                this.width = '99%'
            }
        })
        this.tableColumns = this.outControlService.detailTableColumns()
    }

    open(record: any): void {
        this.title = this.appService.translate("btn.see")+"（"+record.name+"）"
        this.queryParams = {key: record.key}
        this.loadDataFromServer(record.key)
        this.visible = true
    }

    loadDataFromServer(key:string): void {
        this.loading = true
        this.outControlTaskService.getModel(key).then((response:any ) =>{
            this.outControlTaskdata = response
        })
        this.outControlService.detail(this.queryParams).then((response: any[]) => {
            this.data = response
            if(this.data?.outdetails){
                this.tableDataOriginal = this.data.outdetails.sort((a: any, b: any) =>   {return Date.parse(b.createtime) - Date.parse(a.createtime)})
                this.tableData = this.data.outdetails.sort((a: any, b: any) => {return Date.parse(b.createtime) - Date.parse(a.createtime)})
            }
        }).finally(() =>{
            this.loading = false
        })
    }

    filterFieldOpen(visible: boolean, field: string){
        if(visible){
            this.currentField = field
        }else{
            this.currentField = null
        }
    }

    search(event?){
        if(!event || event.key == "Enter"){
            this.loading = true
            setTimeout(() =>{//异步执行过滤
                this.tableData = JSON.parse(JSON.stringify(this.tableDataOriginal))
                for(let key in this.filterFieldsValue){
                    const value = this.filterFieldsValue[key]
                    if(value){
                        this.tableData = this.searchFilter(this.tableData, key, value)
                    }
                }
                this.filterFieldsVisible[this.currentField] = false
                this.loading = false
            },400)
        }
    }

    reset(){
        this.filterFieldsValue[this.currentField] = null
        this.search()
    }

    searchFilter(data: Array<any>, field: string, value: string){
        return data.filter(item =>{return item[field].indexOf(value) >= 0})
    }
    
    close(): void {
        this.visible = false
        this.data={}
        this.outControlTaskdata = {}
    }
}
