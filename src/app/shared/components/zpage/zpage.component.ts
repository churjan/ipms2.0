import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { async, fromEvent } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { api, AuthService } from "~/shared/services/http/auth.service";
import { Router } from "@angular/router";
import { UtilService } from "~/shared/services/util.service";
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { RequestService } from "~/shared/services/request.service";
import { GlobalService } from "~/global";
@Component({
    selector: 'zpage',
    templateUrl: './zpage.component.html',
    styleUrls: ['./zpage.component.less']
})
export class ZPageComponent implements OnInit {
    constructor(
        private changeDetectorRef:ChangeDetectorRef,
        private authService: AuthService,
        public router: Router,
        private el: ElementRef,
        private util:UtilService,
        private request: RequestService,
        private global: GlobalService
    ) {
        //获取当前页面全部按钮信息
        let url = this.router.url.replace(/\//g, "_");
        if (url.indexOf("_") == 0) {
            url = url.substring(1, url.length)
        }
        if(this.global.munuList.length>0){
            this.getBtnGroup = this.authService.getBtnZAll(this.global.munuList,url);
            //判断操作中有几个是已文字显示，并记录有几个文字
            this.noIconNum = 0;
            this.noIconNameWidth = 0;
            for(let item of this.getBtnGroup.noFold){
                if(!item.icon){
                    this.noIconNum++;//存在几个非符号的操作按钮
                    this.noIconNameWidth = this.noIconNameWidth + item.name.length*14;//操作按钮中存在多少个文字并记录宽度 一个文字为14px
                }
            }
        }else{
            this.request.get(api.userMenu).then(response => {
                // response;
                let menuData = response;
                this.global.munuList = menuData;
                this.getBtnGroup = this.authService.getBtnZAll(menuData,url);
                //判断操作中有几个是已文字显示，并记录有几个文字
                this.noIconNum = 0;
                this.noIconNameWidth = 0;
                for(let item of this.getBtnGroup.noFold){
                    if(!item.icon){
                        this.noIconNum++;//存在几个非符号的操作按钮
                        this.noIconNameWidth = this.noIconNameWidth + item.name.length*14;//操作按钮中存在多少个文字并记录宽度 一个文字为14px
                    }
                }
            }).catch(()=>{
                let menuData = [];
                this.global.munuList = menuData;
                this.getBtnGroup = this.authService.getBtnZAll(menuData,url);
                //判断操作中有几个是已文字显示，并记录有几个文字
                this.noIconNum = 0;
                this.noIconNameWidth = 0;
                for(let item of this.getBtnGroup.noFold){
                    if(!item.icon){
                        this.noIconNum++;//存在几个非符号的操作按钮
                        this.noIconNameWidth = this.noIconNameWidth + item.name.length*14;//操作按钮中存在多少个文字并记录宽度 一个文字为14px
                    }
                }
            })
        }
    }

    @ViewChild('divTable') divTable: ElementRef;
    @Input() openLeft:boolean = false;//开启左边树区域 默认关闭
    @Input() isLeftSpinning:boolean = false;//开启左边树加载 默认关闭
    @Input() leftTreeTitle:string = ""; //左侧树标题
    @Input() leftTreeTool: ElementRef //左侧树头部工具方法主体
    @Input() leftTree: ElementRef //左侧树 主体
    @Input() leftTreeInput: ElementRef //左侧树查询框 主体
    @Input() topInput: ElementRef //头部搜索区
    @Input() zadvancedSearch: ElementRef //高级搜索 按钮区
    @Input() zadvancedIcon: ElementRef //高级搜索 图标按钮区
    @Input() zadvancedCont: ElementRef //头部高级搜索参数区

    getBtnGroup:any = {top:[],table:[],fold:[],noFold:[]};/*不在折叠中的按钮权限 */
    noIconNum = 0;//存在几个非符号的操作按钮
    noIconNameWidth = 0;//操作按钮中存在多少个文字并记录宽度 一个文字为14px
    isFold = 0;//是否存在折叠
    foldBtnGroup = [];/*在折叠中的按钮权限 */
    @Output() topBtn = new EventEmitter<any>();//调用子页面头部按钮事件
    @Output() tableBtn = new EventEmitter<any>();//调用子页面表格按钮事件

    @Input() tablePage: ElementRef //内容表格翻页区
    @Input() isTableHeadNum:boolean = true; //是否显示表头的序号名称 默认显示
    @Input() isAdvancedSearch:boolean = false;//是否开启高级查询的功能 默认关闭
    @Input() isTablePage:boolean = true;//是否开启单独翻页控件 默认开启
    @Input() isTableNoCustomize:boolean = true;//是否非自定义表格 默认开启
    @Input() noPageCustomTable: ElementRef //无分页 自定义表格html
    @Input() pageCustomTable: ElementRef //分页 自定义表格html
    zadvancedSearchActive:boolean = false;//控制高级查询内容淡入显示 默认关闭
    advancedActive: boolean = false;//控制高级查询的箭头 默认关闭
    filterOpen: boolean = false;//是否打开高级查询 默认关闭

    // 以下表格参数--------------------
    @Output() getSortList = new EventEmitter<any>();//将排序等参数回传给页面
    @Input() tableLoading:boolean = false;//表格是否加载
    @Input() tableData:any[] = [];//表格数据
    @Input() pageSize:number = 20;//每页条数
    @Input() tableSize:string = "small";//small | middle | default
    @Input() isColumns:boolean = true;//表格是否可以控制列表显示内容
    @Input() columns: any[] = [];//表格内容格式和表头
    @Input() isCheck: boolean = true;//是否开启表格复选 默认开启
    @Input() isCheckAll: boolean = true;//是否开启表格全选 默认开启
    @Input() isNumber: boolean = true;//是否开启序列 默认开启
    @Input() isOperation: boolean = false;//是否开启表格内操作栏 默认关闭
    @Input() isStatistics: boolean = false;//是否开始统计行 默认关闭
    @Input() sumNode: any = {};//统计行数据
    // @Input() operationWidth: number = 96;//操作栏宽度
    checked = false;//全选框的状态
    listOfCurrentPageData:  any[] = [];//当前数据备份
    @Output() getCheckedIdList = new EventEmitter<any>();//用于回调给页面 选中的数据key的
    setOfCheckedId = new Set<string>();//选中的数据key
    indeterminate = false;//全选复选框的状态
    @Input() format: ElementRef //表格内容格式化 自定义

    //动态修改表格内部宽高
    divTableWidth = 0;//记录当前表格div的宽度
    divTableHeight = 0;//记录当前表格div的高度
    tableWidthHeight: any = {};//表格内部的高宽 有分页的
    tableWidthHeightNo: any = {};//表格内部的高宽 无分页的
    @Output() getTableWidthHeightNo = new EventEmitter<any>();//用于回调给页面 自定义表格高度和宽度
    getTableStyle(){
        let tableWidth = this.divTable.nativeElement.clientWidth;//获取divTable对象元素的宽度
        let tableHeight = this.divTable.nativeElement.clientHeight;//获取divTable对象元素的高度
        if(tableHeight != null && typeof(tableHeight) != 'undefined' && tableWidth != null && typeof(tableWidth) != 'undefined'){
            this.divTableWidth = tableWidth;//记录
            this.divTableHeight = tableHeight;//记录
            //改变表格高宽
            this.tableWidthHeight = {x:(this.divTable.nativeElement.clientWidth - 15)+"px",y:(this.divTable.nativeElement.clientHeight - 50) + "px"};
            this.tableWidthHeightNo = {x:(this.divTable.nativeElement.clientWidth - 15)+"px",y:(this.divTable.nativeElement.clientHeight - 34) + "px"};
            this.getTableWidthHeightNo.emit({x:(this.divTable.nativeElement.clientWidth - 15)+"px",y:(this.divTable.nativeElement.clientHeight - 34) + "px"});//将表格高宽回传给子页面
        }
    }

    ngAfterViewInit() {
        //初始化动态样式
        this.getTableStyle();
        //重置渲染 否则会报错
        this.changeDetectorRef.detectChanges();
    }

    ngAfterViewChecked(): void {
        //检查是否在其他模块中改变过窗口大小，这里进行和之前记录的宽高进行对比 如果改变了 就再校对一边
        // if(this.divTableWidth!=this.divTable.nativeElement.clientWidth || this.divTableHeight!=this.divTable.nativeElement.clientHeight){
        //     this.getTableStyle();
        // }
    }

    url = this.router.url.replace(/\//g, "_");
    objColumns = {};
    ngOnInit(): void {
        //监控当前浏览器窗口是否变化
        fromEvent(window,"resize").subscribe((event:any)=>{
            this.getTableStyle();
        });

        //获取当前全局的 当前页面的列表头
        if(this.isColumns){
            //判断全局变量中是否存在当前页面表头的显示状态
            this.objColumns = JSON.parse(localStorage.getItem('columns'))?JSON.parse(localStorage.getItem('columns')):{};
            let isSession = false;//表示本地是否记录当前页面的表头
            //获取json对象的key 查询是否存在当前页面url的key
            for(let key in this.objColumns){
                if(key === this.url){
                    isSession = true;
                }
            }
            if(isSession){
                let oldColumns = this.objColumns[this.url];
                //本地存在该页面表头
                // let newColumns = oldColumns.concat(this.columns);
                // this.columns = this.cutarray(newColumns);//去重
                this.columns = this.cutarray(oldColumns,this.columns);
                let newColumns = [];
                for(let item of this.columns){
                    if(item.save){
                        newColumns.push(item);
                    }
                }
                this.objColumns[this.url] = newColumns;//将数据存入对应的json key 中
                localStorage.setItem('columns',JSON.stringify(this.objColumns));//存入本地保存
            }else{
                //本地不存在该页面表头 
                // this.allColumns = [...this.columns];//用于页面列表控制的下拉
                let newColumns = [];
                for(let item of this.columns){
                    if(item.save){
                        newColumns.push(item);
                    }
                }
                this.objColumns[this.url] = newColumns;//将数据存入对应的json key 中
                localStorage.setItem('columns',JSON.stringify(this.objColumns));//存入本地保存
            }
        }

    }

    //转为小写
    print = (v) => { return v ? v.toLowerCase() : '' }

    //数组去重 获取最新的
    cutarray(oldArr,newArr){
        let arr = [];
        for(let newItem of newArr){
            let bool = false;//表示是否已经存在本地记录
            for(let oldItem of oldArr){
                if(oldItem.code === newItem.code){
                    bool = true;//存在本地记录
                    arr.push({...newItem,show:oldItem.show});
                }
            }
            if(!bool){
                //不存在就直接可输出
                arr.push(newItem);
            }
        }
        return arr;
    }

    //控制表格表头的显示与否 value为是否打勾 code为列表code index为排在当前列表的第几个
    columnsControl(value,code,index){
        // 添加或删除 只要修改columns 对象中的show值即可
        for(let item of this.columns){
            if(item.code === code){
                item.show = value;
            }
        }
        let newColumns = [];//记录需要本地保存的列
        for(let item of this.columns){
            if(item.save){
                newColumns.push(item);
            }
        }
        this.objColumns[this.url] = newColumns;
        localStorage.setItem('columns',JSON.stringify(this.objColumns));//存入本地保存
    }

    onCurrentPageDataChange($event: []): void {
        this.listOfCurrentPageData = $event;
        this.refreshCheckedStatus();
    }

    //全选事件
    onAllChecked(value: boolean): void {
        this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.key, value));
        this.refreshCheckedStatus();
    }

    //单条复选事件
    onItemChecked(key: any, checked: boolean): void {
        this.updateCheckedSet(key, checked);
        this.refreshCheckedStatus();
    }

    //校验是否被全选 并修改全选复选框的状态
    refreshCheckedStatus(): void {
        this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.key));
        this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.key)) && !this.checked;
        this.getCheckedIdList.emit(this.setOfCheckedId);//将选择的key回调给当前页面
    }

    //记录或删除被选择的key
    updateCheckedSet(key: any, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(key);
        } else {
            this.setOfCheckedId.delete(key);
        }
    }

    //排序等参数回调给页面
    onQueryParamsChange(params): void {
        this.getSortList.emit(params);
    }

    //打开高级查询
    openSearch(){
        this.filterOpen = !this.filterOpen;
        if(this.filterOpen){
            setTimeout(()=>{
                this.zadvancedSearchActive = true;
            },100);
        }else{
            this.zadvancedSearchActive = false;
        }
    }

    //查询或翻页后将表格滚动条回归到顶部
    getTableScrollToTop(){
        this.el.nativeElement.querySelector('.ant-table-body').scrollTop = 0;
    }

    //头部按钮
    getTopBtn(name){
        name = name?name.toLowerCase():"";
        this.topBtn.emit({name:name});
    }

    //表格按钮
    getTableBtn(name,item){
        name = name?name.toLowerCase():"";
        this.tableBtn.emit({name:name,item:item});
    }

    //列宽拖拉功能
    onResize({ width }: NzResizeEvent, code: string): void {
        this.columns = this.columns.map(e => (e.code === code ? { ...e, width: `${width}px` } : e));
    }
    
}