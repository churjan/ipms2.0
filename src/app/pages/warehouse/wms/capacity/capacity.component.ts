import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CapacityService } from '~/pages/warehouse/wms/capacity/capacity.service';
import { CommonService } from '~/shared/services/http/common.service';
import { SimpleReuseStrategy } from '~/simple-reuse-strategy';

@Component({
    selector: 'app-capacity',
    templateUrl: './capacity.component.html',
    styleUrls: ['./capacity.component.less']
})
export class CapacityComponent implements OnInit,OnDestroy {

    @ViewChild('innerTop') innerTop: ElementRef
    top: ElementRef

    loading: boolean = false
    total: number = 0
    data: any[] = []
    pageSize: number = environment.defaultPageSize
    page: number = 1
    validateForm!: FormGroup
    lines: any[] = []
    tableColumns: any[] = []
    timer: any
    
    constructor(
        private fb: FormBuilder,
        private capacityService: CapacityService,
        private commonService: CommonService,
        private router: Router
    ) { }

    ngOnInit(){
        this.tableColumns = this.capacityService.tableColumns()
        this.validateForm = this.fb.group({
            inTimeControl:[false],
            keywords: [null],
            code: [null]
        })
        this.commonService.structures({"blst_group": "line"}).then((response: any) =>{
            if(response?.length > 0){
                this.lines = response
                this.validateForm.patchValue({code: response[0].code})
                this.loadDataFromServer()
            }
        })
        const cacheTimer = sessionStorage.getItem('capacityTimer')
        if(cacheTimer){
            sessionStorage.removeItem('capacityTimer')
            clearInterval(Number(cacheTimer))
        }
        setTimeout(() =>{
            this.top = this.innerTop
        },20)
    }

    search(){
        this.page = 1
        this.loadDataFromServer()
    }

    resetSearch(){
        //this.validateForm.reset()
        this.validateForm.patchValue({keywords: null})
        this.search()
    }

    loadDataFromServer(): void {
        this.loading = true
        for(let key in this.validateForm.value){
            if(typeof this.validateForm.value[key] == 'string'){
                const temp = {}
                temp[key] = this.validateForm.value[key].trim()
                this.validateForm.patchValue(temp)
            }
        }
        this.capacityService.list(this.validateForm.value).then(({data, total}) => {
            this.total = total
            this.data = data
        }).finally(() =>{
            this.loading = false
        })
    }

    inTimeControlChange(value: boolean){
        if(value){//开启
            clearInterval(this.timer)
            this.timer = setInterval(() =>{
                const key = this.router.url.replace(/\//g,'_')
                if(key == '_warehouse_capacity'){
                    this.loadDataFromServer()
                }else{//库区容量页面切换或关闭
                    if(!SimpleReuseStrategy.handlers['_warehouse_capacity']){//库区容量页面关闭
                        clearInterval(this.timer)
                    }
                }
            },5000)
            sessionStorage.setItem('capacityTimer',this.timer)
        }else{//关闭
            clearInterval(this.timer)
        }
    }

    ngOnDestroy(){
        clearInterval(this.timer)
    }
}
