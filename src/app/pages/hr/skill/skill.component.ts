import { environment } from "@/environments/environment";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ControlContainer, ControlValueAccessor, FormBuilder, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzFormatEmitEvent } from "ng-zorro-antd/tree";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { Observable, Observer } from "rxjs";
import { ZPageComponent } from "~/shared/components/zpage/zpage.component";
import { I18nPipe } from "~/shared/pipes/i18n.pipe";
import { AppConfig } from "~/shared/services/AppConfig.service";
import { SelectService } from "~/shared/services/http/select.service";
import { UtilService } from "~/shared/services/util.service";
import { SkillService } from "./skill.service";

@Component({
    selector: 'app-skill',
    templateUrl: './skill.component.html',
    styleUrls: ['./skill.component.less'],
    providers: [I18nPipe]
})
export class SkillComponent implements OnInit {
    btnJurisdiction:any[] = [];//获取图标和按钮名称

    openLeft:boolean = false;//是否开启左边树区域
    leftTreeTitle:string = "";//左边树区域标题
    isAdvancedSearch:boolean = true;//是否开启高级搜索
    isTablePage:boolean = true;//是否开启单独的翻页
    isCheck: boolean = true;//是否开启表格复选 默认开启
    isCheckAll: boolean = true;//是否开启表格全选 默认开启
    isNumber: boolean = true;//是否开启序列 默认开启
    isOperation: boolean = true;//是否开启表格内操作栏 默认关闭

    searchValue = '';//左侧树查询框的参数
    
    //查询参数
    queryParams = {
        keywords:"",//关键词
        hei_code:"",//工号
        hei_name:"",//名称
        poi_name:"",//工序名称
        poi_code:"",//工序编号
        sort:"",//以哪个字段进行排序
        dortDirections:"",//排序方式 支持的排序方式，取值为 'asc', 'desc', null
        page: 1,//当前第几页
        pageSize: 20,//每页显示条数
    };

    /* ******************表格属性******************************** */
    setOfCheckedId = new Set<string>();//表格回传回来的当前已选择的数据key
    tableLoading:boolean = false;
    tableData = [];
    columns: any[] = [];
    total:number = 0;//总条数

    // -----------------以下 弹窗参数-----------------
    isPopup:boolean = false;//是否打开窗口
    isPopupImport:boolean = false;//是否打开导出窗口
    isPopupConfirm:boolean = false;//是否打开删除窗口
    isLoading:boolean = false;//是否打开确定按钮的加载
    validateForm!: FormGroup;//校验
    popupType:string = "";//类型 add新增 update修改 del删除
    zpopupTiele:string = "";//弹窗标题
    delDataNum:number = 0;//删除条数
    skillValidateForm!: FormGroup;//技能管理校验

    fileList: NzUploadFile[] = [];

    @ViewChild('zpage') zpage: ZPageComponent;
    @ViewChild('skillLeftTable') skillLeftTable: ElementRef;
    @ViewChild('skillRightTable') skillRightTable: ElementRef;
    constructor(
      private skillService:SkillService,
      private fb: FormBuilder,
      private message: NzMessageService,
      private util:UtilService,
      private i18nPipe: I18nPipe,
      private selectService: SelectService){

    }

    //分配头部按钮的执行方法
    getTopBtn(event){
      switch(event.name){
        case "add": this.toAdd();break;
        case "del": this.toDel(true,null);break;
        // case "imp": this.toImport();break;
        case "exp": this.toExport();break;
        default: break;
      }
    }
    //分配表格按钮的执行方法
    getTableBtn(event){
      switch(event.name){
        case "update":this.toUpdate(event.item);break;
        case "del": this.toDel(false,event.item);break;
        // case "see": this.toSee(event.item);break;
        default: break;
      }
    }

    ngOnInit(): void {
        this.columns = this.skillService.tableColumns();

        //启动新增校验
        this.validateForm = this.fb.group({
          code: [null, [Validators.required]],//新增编号
          name: [null, [Validators.required]],//新增名称
          customcode: [null],//新增自定义编号
          description: [null],//新增描述
        });

        //技能管理校验
        this.skillValidateForm = this.fb.group({
          name:[null, [Validators.required]],//用户名
        });

        this.toSearch(1);
    }

    //查询
    toSearch(type:number=1){
      if(type==1){
        //需要把页码改为1的
        this.queryParams.page = 1;
      }
      this.tableLoading = true;
      this.skillService.getList(this.queryParams).then( (res:any) =>{
          this.tableData = res.data;
          this.total = res.total;
          this.zpage.getTableScrollToTop();//表格滚动条回滚到顶部
          this.setOfCheckedId.clear();//清除选中项
          this.tableLoading = false;
      },()=>{}).finally(()=>{
          this.tableLoading = false;
      });
    }
    //获取工序数据
    skillLeftLoading:boolean = false;
    skillDataLeft = [];
    skillPage:number = 1;
    skillSize:number = 20;
    skillLeftSelect:string = "";
    skillTotal:number = 0;
    toSkillSearch(type:number=1){
      if(type==1){
        //需要把页码改为1的
        this.skillPage = 1;
      }
      this.skillLeftLoading = true;
      this.selectService.operationDown({keywords:this.skillLeftSelect,page:this.skillPage,pagesize:this.skillSize}).then( (res:any) =>{
          this.skillDataLeft = res.data;
          this.skillTotal = res.total;
          if(type==1){
            this.skillLeftTable['elementRef'].nativeElement.querySelector('.ant-table-body').scrollTop = 0;//表格滚动条回滚到顶部
          }
      },()=>{}).finally(()=>{
          this.skillLeftLoading = false;
      });
    }
    
    //获取用户当前工序数据
    skillRightLoading:boolean = false;
    skillDataRight = [];
    skillRightPage:number = 1;
    skillRightSize:number = 20;
    skillRightSelect:string = "";
    skillRightTotal:number = 0;
    skillRightHeiKey:string = "";
    toSkillRightSearch(type:number=1){
      if(type==1){
        //需要把页码改为1的
        this.skillRightPage = 1;
      }
      this.skillRightLoading = true;
      this.selectService.employeeSkillDown({hei_key:this.skillValidateForm.get('name').value,keywords:this.skillRightSelect,page:this.skillRightPage,pagesize:this.skillRightSize}).then( (res:any) =>{
          this.skillDataRight = res;
          this.skillRightTotal = res.total;
          if(type==1){
            this.skillRightTable['elementRef'].nativeElement.querySelector('.ant-table-body').scrollTop = 0;//表格滚动条回滚到顶部
          }
      },()=>{}).finally(()=>{
          this.skillRightLoading = false;
      });
    }

    //页码改变的回调
    pageIndexChange(number){
      this.queryParams.page = number;
      this.toSearch(2);
    }
    pageIndexSkillChange(number){
      this.skillPage = number;
      this.toSkillSearch(2);
    }
    pageIndexSkillRightChange(number){
      this.skillRightPage = number;
      this.toSkillRightSearch(2);
    }

    //每页条数改变的回调
    pageSizeChange(number){
      this.queryParams.pageSize = number;
      this.toSearch(1);
    }
    pageSizeSkillChange(number){
      this.skillSize = number;
      this.toSkillSearch(1);
    }
    pageSizeSkillRightChange(number){
      this.skillRightSize = number;
      this.toSkillRightSearch(1);
    }

    //表格复选选中key的回传函数
    getCheckedId(idList){
      this.setOfCheckedId = idList;
    }

    //排序回调
    getSortList(list){}

    //重置查询内容
    resetSearch(){
      this.queryParams = {
          keywords:"",//关键词
          hei_code:"",//工号
          hei_name:"",//名称
          poi_name:"",//工序名称
          poi_code:"",//工序编号
          sort:"",//以哪个字段进行排序
          dortDirections:"",//排序方式 支持的排序方式，取值为 'asc', 'desc', null
          page: 1,//当前第几页
          pageSize: 20,//每页显示条数
      };
      this.tableLoading = true;
      this.skillService.getList(this.queryParams).then( (res:any) =>{
        this.tableData = res.data;
        this.total = res.total;
        this.tableLoading = false;
      },()=>{});
    }

    //重置表单内容
    resetForm(){
      this.skillValidateForm.setValue({name:""});
      this.skillValidateForm.reset();//重置表单校验
    }

    //获取技能管理用户下拉
    skillUserList:any[] = [];//技能管理用户下拉数据
    skillUserLoading:boolean = false;//远程获取数据时的加载
    skillUserI:number = 1;
    skillUserSum:number = 10;//默认 10条
    skillUserValue = "";//记录输入的值
    toUserDown(event){
      this.skillUserLoading = true;
      this.selectService.userDown({keywords:event,page:this.skillUserI,pagesize:999999}).then((res:any)=>{
          this.skillUserLoading = false;
          this.skillUserList = res.data;
          //判断这个查询的值 是否是最后那个值，不是的话 再进行查询
          if(this.skillUserValue !== event){
              this.toUserDown(this.skillUserValue);
          }
      }).finally(()=>{
          this.skillUserLoading = false;
      });
    }
    onUserSearch(event){
            this.skillUserValue = event;
            
            if(this.util.isAbnormalValue(event)){
                this.skillUserI = 1;
                this.skillUserList = [];
                //判断当前加载是否已经执行完成，未执行完成不进入方法
                if(!this.skillUserLoading){
                    this.toUserDown(event);
                }
            }else{
                if(event===""){
                    this.skillUserI = 1;
                    this.skillUserSum = 10;
                    this.skillUserList = [];
                }
                if(this.skillUserSum==10){
                    this.skillUserLoading = true;
                    this.selectService.userDown({page:this.skillUserI,pagesize:10}).then((res:any)=>{
                        this.skillUserSum = res.data.length;
                        this.skillUserLoading = false;
                        if(res.data.length==10 && this.skillUserI*10<res.total){
                            this.skillUserList = [...this.skillUserList, ...res.data];
                            this.skillUserI ++;
                        }else if(this.skillUserI==1){
                            this.skillUserList = res.data;
                        }
                    }).finally(()=>{
                        this.skillUserLoading = false;
                    });
                }
            }
    }

    //选择员工后，获取员工拥有的工序
    onUserSkill(event){
      // this.skillRightHeiKey = event;
      this.toSkillRightSearch(1);
    }

    //导入抬头添加token 和 语言
    uploadingHeader(){
      const token = sessionStorage.ticket ;
      return {
        token: token,
        language: localStorage.language
      }
    }
      

    //按钮-新增
    toAdd(){
      this.zpopupTiele = this.i18nPipe.transform('btn.add');
      this.popupType = "add";
      this.isPopup = true;

      this.toSkillSearch(1);
    }

    //给员工添加工序
    addUserSkill(item){
      if(this.util.isAbnormalValue(this.skillValidateForm.get('name').value)){
        this.skillService.addUserSkill({
          display: true,
          hei_key: this.skillValidateForm.get('name').value,
          poi_code: item.code,
          poi_key: item.key,
          poi_name: item.name
        }).then((res:any)=>{
          this.toSkillRightSearch();
          this.toSearch(2);
        },()=>{}).finally(()=>{

        })
      }else{
        this.message.warning(this.i18nPipe.transform('warning.noUser'));
      }
    }

    //给员工删除工序
    delUserSkill(item){
      if(this.util.isAbnormalValue(item)){
        this.skillService.delUserSkill({
          hei_code: item.hei_code,
          hei_key: item.hei_key,
          hei_name: item.hei_name,
          key: item.key,
          poi_code: item.poi_code,
          poi_key: item.poi_key,
          poi_name: item.poi_name
        }).then((res:any)=>{
          this.toSkillRightSearch();
        },()=>{}).finally(()=>{

        })
      }else{
        this.message.warning(this.i18nPipe.transform('warning.empty'));
      }
    }

    //按钮-查看
    // toSee(item){
    //   this.zpopupTiele = this.i18nPipe.transform('btn.see');
    //   this.popupType = "see";
    //   this.isLoading = true;
    //   this.isPopup = true;

    //   if(item.key!=null && item.key!=""){
    //     this.skillService.see(item.key).then( (res:any) =>{
    //       this.validateForm.setValue(
    //         {
    //           code:res.code,
    //           name:res.name,
    //           customcode:res.customcode,
    //           description:res.description
    //         }
    //       );
    //       this.isLoading = false;
    //     },()=>{});
    //   }
    // }

    //按钮-修改
    updateKey = "";//修改的记录id
    toUpdate(item){
      this.zpopupTiele = this.i18nPipe.transform('btn.update');
      this.popupType = "update";
      this.isPopup = true;
      this.toSkillSearch(1);
      this.onUserSearch(item.hei_name || '');
      this.skillValidateForm.patchValue({name: item.hei_key});
      this.toSkillRightSearch(1);
    }

    //按钮-导出
    toExport(){
      this.skillService.export("skillExport.xls",{keywords:this.queryParams.keywords})
    }

    //确认
    submit(){
      this.isLoading = true;
      //删除
      if(this.popupType=='del'){
        if(this.delType){
          if(this.setOfCheckedId.size>0){
            let keyList = [];
            for(let key of this.setOfCheckedId){
              keyList.push({key:key});
            }
            this.skillService.del(keyList).then( (res:any) =>{
              this.message.success(this.util.getComm('sucess.s_delete'));
              this.closePopup();
              this.resetSearch();
            },()=>{}).finally(() => {
              this.closePopup();
            });
          }else{
            this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
          }
        }else{
          this.skillService.del(this.oneDel).then( (res:any) =>{
            this.message.success(this.util.getComm('sucess.s_delete'));
            this.closePopup();
            this.resetSearch();
          },()=>{}).finally(() => {
            this.closePopup();
          });
        }
      }
    }

    //按钮-删除 type为true 为头部按钮删除，否则为单条删除 item单条内容
    delType:boolean = false;
    oneDel = [];
    toDel(type,item){
      this.popupType = "del";
      this.delType = type;
      if(type){
        if(this.setOfCheckedId.size>0){
          this.delDataNum = this.setOfCheckedId.size;
          this.isPopupConfirm = true;
        }else{
          this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
        }
      }else{
        if(item.key!=null && item.key!=""){
          this.delDataNum = 1;
          this.oneDel = [{key:item.key}];
          this.isPopupConfirm = true;
        }
      }
    }

    //下载模版
    toExcelModel(){
      this.skillService.downloadModel();
    }

    //关闭
    closePopup(){
      this.isPopup = false;
      this.isPopupConfirm = false;
      this.isPopupImport = false;
      this.isLoading = false;
      this.updateKey = "";//清空修改的key

      this.skillLeftLoading = false;
      this.skillDataLeft = [];
      this.skillPage = 1;
      this.skillSize = 20;
      this.skillLeftSelect = "";
      this.skillTotal = 0;

      this.skillUserList = [];//技能管理用户下拉数据
      this.skillUserLoading = false;//远程获取数据时的加载
      this.skillUserI = 1;
      this.skillUserSum = 10;//默认 10条
      this.skillUserValue = "";//记录输入的值

      this.skillValidateForm.patchValue({name: ""});

      this.skillRightLoading = false;
      this.skillDataRight = [];
      this.skillRightPage = 1;
      this.skillRightSize = 20;
      this.skillRightSelect = "";
      this.skillRightTotal = 0;
      this.skillRightHeiKey = "";

      this.resetForm();
    }

    //返回当前页面全部按钮信息
    getBtnGroup(list){
      this.btnJurisdiction = list;
    }
}