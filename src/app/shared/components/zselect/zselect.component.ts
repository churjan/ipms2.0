import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AppConfig } from "~/shared/services/AppConfig.service";
import { RequestService } from "~/shared/services/request.service";
import { UtilService } from "~/shared/services/util.service";
import { ZSelectService } from "./zselect.service";

@Component({
    selector: 'zselect',
    templateUrl: './zselect.component.html',
    styleUrls: ['./zselect.component.less']
})
export class ZSelectComponent implements OnInit {
    constructor(
        private el: ElementRef,
        private util:UtilService,
        private zselectService:ZSelectService,
        private request: RequestService
    ){
        
    }

    //获取json中的接口路径
    apiJson = AppConfig.select;
    //是什么下拉数据
    @Input() urlTyle:string = "";
    //获取下拉数据的地址
    url:string = "";
    //使用key获取准确下拉数据的地址
    keyUrl:string = "";
    //样式 class
    @Input() getClass:string = "";
    //样式 style
    @Input() getStyle:string = "";
    //下拉数据
    list:any[] = [];
    //下拉加载状态
    loading:boolean = false;
    //所返回给父页面的下拉标识
    @Input() getValue:any;
    //回调函数
    @Output() reData = new EventEmitter<any>();
    //当前选中的值
    @Input() setValue:any;
    //是否开启搜索 默认关闭
    @Input() isSearch:boolean = false;
    //是否开启滚动下拉 默认关闭
    @Input() isScrollToBottom:boolean = false;

    //记录单独已key查出的下拉数据
    oneSelectData:any;

    //记录首次加载的下拉数据
    oldList:any[] = [];

    ngOnInit(): void {
        this.url = this.apiJson[this.urlTyle].url;//获取对应的分页下拉api地址
        this.keyUrl = this.apiJson[this.urlTyle].keyUrl;//获取使用key查询的api地址
        if(this.util.isAbnormalValue(this.setValue)){
            this.keyUrl = this.keyUrl + "/" + this.setValue;
            this.loading = true;
            this.zselectService.getList(this.keyUrl).then((res:any)=>{
                this.list = [res];
                this.oneSelectData = res;
                this.oldList = this.list;
            },()=>{}).finally(()=>{
                this.loading = false;
            });
        }
    }
    
    //查询方法
    listI:number = 1;//高级查询使用
    listSum:number = 10;//当前页面总条数 默认一页10条
    listValue = "";//记录输入款式值
    toDown(event){
        this.loading = true;
        this.zselectService.getList(this.url,{keywords:event,page:1,pagesize:999999}).then((res:any)=>{
            this.loading = false;
            this.list = res.data;
            //判断这个查询的值 是否是最后那个值，不是的话 再进行查询
            if(this.listValue !== event){
                this.toDown(this.listValue);
            }
        },()=>{}).finally(()=>{
            this.loading = false;
        });
    }
    onSearch(event){
        if(this.isScrollToBottom){
            this.listValue = event; 
            if(this.util.isAbnormalValue(event)){
                this.listI = 1;
                this.list = [];
                //判断当前加载是否已经执行完成，未执行完成不进入方法
                if(!this.loading){
                    this.toDown(event);
                }
            }else{
                
                if(event===""){
                    this.listI = 1;
                    this.listSum = 10;
                    this.list = [];
                }
                if(this.listSum==10){
                    this.loading = true;
                    this.zselectService.getList(this.url,{page:this.listI,pagesize:10}).then((res:any)=>{
                        this.listSum = res.data.length;
                        this.loading = false;
                        
                        if(res.data.length==10 && this.listI*10<res.total){
                            //1.判断是否为空 为第一次加载
                            if(this.util.isAbnormalValue(this.oneSelectData) && this.list.length==0){
                                this.list.push(this.oneSelectData);
                            }
                            let data = res.data.filter((item) => item.key != (this.util.isAbnormalValue(this.oneSelectData)?this.oneSelectData.key:''));
                            this.list = [...this.list, ...data];
                            this.listI ++;
                        }else if(this.listI==1){
                            this.list = res.data;
                        }
                    },()=>{}).finally(()=>{
                            this.loading = false;
                    });
                }
            }
        }else{
            
        }
    }
    getList(event){
        if(this.isScrollToBottom){
            this.onSearch(event)
        }else{
            this.loading = true;
            this.zselectService.getList(this.url).then((res:any)=>{
                this.list = res.data;
            },()=>{}).finally(()=>{
                this.loading = false;
            });
        }
    }

    //回传选中的数据
    getData(e){
        this.reData.emit({name:this.getValue,id:this.setValue});
    }
}