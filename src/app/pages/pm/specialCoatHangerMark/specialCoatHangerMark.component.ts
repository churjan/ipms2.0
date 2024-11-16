import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from '~/shared/services/util.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import * as moment from 'moment';
import { ZPageComponent } from '~/shared/components/zpage/zpage.component';
import { SpecialCoatHangerMarkService } from './specialCoatHangerMark.service';
import { SelectService } from '~/shared/services/http/select.service';
import { I18nPipe } from '~/shared/pipes/i18n.pipe';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
@Component({
    selector: 'app-special-coat-hangerMark',
    templateUrl: './specialCoatHangerMark.component.html',
    styleUrls: ['./specialCoatHangerMark.component.less'],
    providers: [I18nPipe]
})
export class SpecialCoatHangerMarkComponent implements OnInit {
    @ViewChild('ltree', { static: false }) nzTreeComponent: NzTreeComponent;
    @ViewChild('zpage') zpage: ZPageComponent;
    constructor(
      private specialCoatHangerMarkService:SpecialCoatHangerMarkService,
      private fb: FormBuilder,
      private message: NzMessageService,
      private util:UtilService,
      private selectService:SelectService,
      private i18nPipe: I18nPipe){

    }

    openLeft:boolean = true;//是否开启左边树区域
    isLeftSpinning:boolean = false;//是否开启左边树加载状态
    leftTreeTitle:string = this.i18nPipe.transform('popupField.work_station');//左边树区域标题
    isAdvancedSearch:boolean = true;//是否开启高级搜索
    isTablePage:boolean = true;//是否开启单独的翻页
    isCheck: boolean = true;//是否开启表格复选 默认开启
    isCheckAll: boolean = true;//是否开启表格全选 默认开启
    isNumber: boolean = true;//是否开启序列 默认开启
    isOperation: boolean = false;//是否开启表格内操作栏 默认关闭

    searchValue = '';//左侧树查询框的参数
    
    //查询参数
    queryParams = {
        //sort:"",//以哪个字段进行排序
        //dortDirections:"",//排序方式 支持的排序方式，取值为 'asc', 'desc', null
        page: 1,//当前第几页
        pageSize: 20,//每页显示条数

        destinationLocation:"",//工作站key
        som_key:"",//订单号key
        pwb_key:"",//作业单号key
        psi_key:"",//款式名称key
        pci_key:"",//颜色名称key
        psz_key:"",//尺码名称key
        isabnormal:null,//是否异常
    };

    sexList:any[] = [];//性别数据
    roleList:any[] = [];//角色数据
    worktypeList:any[] = [];//工种数据
    nationList:any[] = [];//民族数据
    educationList:any[] = [];//文化程度数据
    marriageList:any[] = [];//婚姻数据

    /* ******************表格属性******************************** */
    setOfCheckedId = new Set<string>();//表格回传回来的当前已选择的数据key
    tableLoading:boolean = false;
    tableData = [];
    columns: any[] = [];
    total:number = 0;//总条数

    nodes = [];//组织机构树 数据

    // treeSelectNodes = [];//部门数据
    treeSelectExpandKeys = [];
    loading = false;
   
    //-------------------- 标记异常 ---------------------
    isPopupMark = false;
    isPopupMarkConfirm = false;
    markText = "";


    //分配头部按钮的执行方法
    getTopBtn(event){
      switch(event.name){
        case "mark": this.toMark();break;

        default: break;
      }
    }
    //分配表格按钮的执行方法
    getTableBtn(event){
      switch(event.name){
        // case "update":this.toMark(event.item);break;

        default: break;
      }
    }

    //获取订单下拉
    orderList:any[] = [];//数据
    orderLoading:boolean = false;//远程获取数据时的加载
    orderI:number = 1;
    orderSum:number = 20;//默认 10条
    orderValue = "";//记录输入的值
    toOrderDown(event){
        this.orderLoading = true;
        this.selectService.orderDown({keywords:event,page:1,pagesize:999999}).then((res:any)=>{
            this.orderLoading = false;
            this.orderList = res.data;
            //判断这个查询的值 是否是最后那个值，不是的话 再进行查询
            if(this.orderValue !== event){
                this.toOrderDown(this.orderValue);
            }
        }).finally(()=>{
            this.orderLoading = false;
        });
    }
    onOrderSearch(event){
            this.orderValue = event;
            if(typeof (event) === "undefined"){
                return;
            }
            if(this.util.isAbnormalValue(event)){
                this.orderList = [];
                //判断当前加载是否已经执行完成，未执行完成不进入方法
                if(!this.orderLoading){
                    this.toOrderDown(event);
                }
            }else{
                if(event===""){
                    this.orderList = [];
                }
                if(this.orderSum==20){
                    this.orderLoading = true;
                    this.selectService.orderDown({page:this.orderI,pagesize:20}).then((res:any)=>{
                        this.orderSum = res.data.length;
                        this.orderLoading = false;
                        if(res.data.length==20 && this.orderI*20<res.total){
                            this.orderList = [...this.orderList, ...res.data]; 
                            this.orderI ++;
                        }
                    }).finally(()=>{
                        this.orderLoading = false;
                    });
                }
            }
    }

    //获取作业单下拉
    workList:any[] = [];//数据
    workLoading:boolean = false;//远程获取数据时的加载
    workI:number = 1;
    workSum:number = 20;//默认 10条
    workValue = "";//记录输入的值
    toWorkDown(event){
        this.workLoading = true;
        this.selectService.workDown({keywords:event,page:1,pagesize:999999}).then((res:any)=>{
            this.workLoading = false;
            this.workList = res.data;
            //判断这个查询的值 是否是最后那个值，不是的话 再进行查询
            if(this.workValue !== event){
                this.toOrderDown(this.workValue);
            }
        }).finally(()=>{
            this.workLoading = false;
        });
    }
    onWorkSearch(event){
            this.workValue = event;
            if(typeof (event) === "undefined"){
                return;
            }
            if(this.util.isAbnormalValue(event)){
                this.workList = [];
                //判断当前加载是否已经执行完成，未执行完成不进入方法
                if(!this.workLoading){
                    this.toOrderDown(event);
                }
            }else{
                if(event===""){
                    this.workList = [];
                }
                if(this.workSum==20){
                    this.workLoading = true;
                    this.selectService.workDown({page:this.workI,pagesize:20}).then((res:any)=>{
                        this.workSum = res.data.length;
                        this.workLoading = false;
                        if(res.data.length==20 && this.workI*20<res.total){
                            this.workList = [...this.workList, ...res.data]; 
                            this.workI ++;
                        }
                    }).finally(()=>{
                        this.workLoading = false;
                    });
                }
            }
    }

    //获取款式名称
    styleList:any[] = [];//数据
    styleLoading:boolean = false;//远程获取数据时的加载
    onStyleSearch(event){
        this.styleLoading = true;
        this.selectService.styleDown({keywords:event}).then((res:any)=>{
            this.styleList = res.data;
        }).finally(()=>{
            this.styleLoading = false;
        });
    }

    //获取颜色名称
    colorList:any[] = [];//数据
    colorLoading:boolean = false;//远程获取数据时的加载
    onColorSearch(event){
        this.colorLoading = true;
        this.selectService.colorDown({keywords:event}).then((res:any)=>{
            this.colorList = res.data;
        }).finally(()=>{
            this.colorLoading = false;
        });
    }

    //获取尺码名称
    sizeList:any[] = [];//数据
    sizeLoading:boolean = false;//远程获取数据时的加载
    onSizeSearch(event){
        this.sizeLoading = true;
        this.selectService.sizeType({keywords:event}).then((res:any)=>{
            this.sizeList = res.data;
        }).finally(()=>{
            this.sizeLoading = false;
        });
    }

    //获取异常
    abnormalList = []
    onAbnormalSearch(){
      this.abnormalList = [{name:this.i18nPipe.transform('format.yes'),key:true},{name:this.i18nPipe.transform('format.no'),key:false}];
    }
    
    ngOnInit(): void {
        this.columns = this.specialCoatHangerMarkService.tableColumns();

        this.toReloadTree();
    }

    //获取数据1为需要将页码拨回1的 2是不需要
    toSearch(type:number=1){
      if(type==1){
        //需要把页码改为1的
        this.queryParams.page = 1;
      }
      this.tableLoading = true;
      this.specialCoatHangerMarkService.getList(this.queryParams).then((response:any) =>{
          let newData = response.data;
          for(let i = 0;i < newData.length;i++){
            newData[i].key = new Date().getTime()+i;
          }
          this.tableData = newData;
          this.total = response.total;
          this.zpage.getTableScrollToTop();//表格滚动条回滚到顶部
          this.setOfCheckedId.clear();//清除选中项
          this.tableLoading = false;
      })
    }

    //重置查询参数
    resetQueryParams(type){
      if(type==1){
        this.queryParams = {
          //sort:"",//以哪个字段进行排序
          //dortDirections:"",//排序方式 支持的排序方式，取值为 'asc', 'desc', null
          page: 1,//当前第几页
          pageSize: 20,//每页显示条数
          
          destinationLocation:"",//工作站key
          som_key:"",
          pwb_key:"",//作业单号key
          psi_key:"",//款式名称key
          pci_key:"",//颜色名称key
          psz_key:"",//尺码名称key
          isabnormal:null,//是否异常
        };
      }
      if(type==2){
        //高级搜索重置
        this.queryParams.som_key = "";
        this.queryParams.pwb_key = "",//作业单号key
        this.queryParams.psi_key = "",//款式名称key
        this.queryParams.pci_key = "",//颜色名称key
        this.queryParams.psz_key = "",//尺码名称key
        this.queryParams.isabnormal = null,//是否异常
        this.queryParams.page = 1;
        this.queryParams.pageSize = 20;
        //this.queryParams.sort = "";
        //this.queryParams.dortDirections = "";
      }
      this.toSearch(1);
    }

    //格式化树数据
    toTreeFormat(list){
      let dataArray = [];
      for(let item of list){
        if(item.sonlist){
          let objTemp = {
            title: item.name+'['+item.code+']',
            key: item.key,
            expanded: false,
            children:this.toTreeFormatIn(item.sonlist)
          }
          dataArray.push(objTemp);
        }else{
          let objTemp = {
            title: item.name+'['+item.code+']',
            key: item.key,
            isLeaf: true,
          }
          dataArray.push(objTemp);
        }
      }
      return dataArray;
    }
    //格式化树数据内部循环
    toTreeFormatIn(dataList){
      let dataArray = [];
      for(let i = 0;i < dataList.length; i++){
        if(dataList[i].sonlist){
          let objTemp = {
            title: dataList[i].name+'['+dataList[i].code+']',
            key: dataList[i].key,
            expanded: false,
            children:this.toTreeFormatIn(dataList[i].sonlist)
          }
          dataArray.push(objTemp);
        }else{
          let objTemp = {
            title: dataList[i].name+'['+dataList[i].code+']',
            key: dataList[i].key,
            isLeaf: true,
          }
          dataArray.push(objTemp);
        }
      }
      return dataArray;
    }

    //刷新组织机构数据
    toReloadTree(){
      this.searchValue = "";
      this.isLeftSpinning = true;
      this.specialCoatHangerMarkService.newGetList({maketree:true,moduletype:104}).then((response:any) =>{
        this.nodes = this.toTreeFormat(response);
        // this.treeSelectNodes = this.util.toSelectTree(response,'key','pkey');
        this.isLeftSpinning = false;
        this.queryParams.destinationLocation = "";
      });
      this.queryParams.som_key = "";
      this.queryParams.pwb_key = "";
      this.queryParams.psi_key = "";//款式名称key
      this.queryParams.pci_key = "";//颜色名称key
      this.queryParams.psz_key = "";//尺码名称key
      this.queryParams.isabnormal = null;//是否异常
      this.queryParams.page = 1;
      this.queryParams.pageSize = 20;
      this.toSearch(1);
    }

    nzTreeEvent(event: NzFormatEmitEvent): void {
      if(event.keys.length>0){
        this.queryParams.destinationLocation = event.keys[0];
      }else{
        this.queryParams.destinationLocation = "";
      }
      
      this.toSearch(1);
    }

    nzEvent(event: NzFormatEmitEvent): void {
      if(this.searchValue===""){
        
      }
    }

    //页码改变的回调
    pageIndexChange(number){
      this.queryParams.page = number;
      this.toSearch(2);
    }

    //每页条数改变的回调
    pageSizeChange(number){
      this.queryParams.pageSize = number;
      this.toSearch(1);
    }

    //表格复选选中key的回传函数
    getCheckedId(idList){
        this.setOfCheckedId = idList;
    }
  
    //排序回调
    getSortList(list){}

    //表格内名称点击事件
    toHangerid(data){
      if(this.util.isAbnormalValue(data.hangerid)){
        window.open('#/hanger/'+data.hangerid);
      }else{
        this.message.success(this.util.getComm('warning.empty'));
      }
    }

    //重置表单内容
    resetForm(){
        
    }

    //打开标记异常询问窗口
    toMark(){
      if(this.setOfCheckedId.size>0){
        this.isPopupMark = true;
      }else{
        this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
      }
    }

    //标记异常-确定
    toMarkSub(){
      if(this.setOfCheckedId.size>0){
        let params = [];
        for(let item of this.setOfCheckedId){
          params.push({hangerid:item});
        }
        this.isPopupMarkConfirm = true;
        this.specialCoatHangerMarkService.mark(params).then((response:any) =>{
          this.message.success(this.util.getComm('sucess.s_mark'));
          this.isPopupMark = false;
          this.isPopupMarkConfirm = false;
          this.toSearch(1);
        },()=>{});
      }else{
        this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
      }
    }
  
    //关闭
    closePopup(){
      this.isPopupMark = false;
      this.isPopupMarkConfirm = false;

      this.resetForm();
    }
}
