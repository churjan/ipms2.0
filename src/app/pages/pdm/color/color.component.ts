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
import { UtilService } from "~/shared/services/util.service";
import { ColorService } from "./color.service";


@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.less'],
    providers: [I18nPipe]
})
export class ColorComponent implements OnInit {
    btnJurisdiction:any[] = [];//获取图标和按钮名称

    openLeft:boolean = false;//是否开启左边树区域
    leftTreeTitle:string = "";//左边树区域标题
    isAdvancedSearch:boolean = false;//是否开启高级搜索
    isTablePage:boolean = false;//是否开启单独的翻页
    isCheck: boolean = true;//是否开启表格复选 默认开启
    isCheckAll: boolean = true;//是否开启表格全选 默认开启
    isNumber: boolean = true;//是否开启序列 默认开启
    isOperation: boolean = false;//是否开启表格内操作栏 默认关闭

    searchValue = '';//左侧树查询框的参数
    
    //查询参数
    queryParams = {
        keywords:"",//关键词
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

    fileList: NzUploadFile[] = [];

    @ViewChild('zpage') zpage: ZPageComponent;
    constructor(private colorService:ColorService,private fb: FormBuilder,private message: NzMessageService,private util:UtilService,private i18nPipe: I18nPipe){

    }

    //分配头部按钮的执行方法
    getTopBtn(event){
      switch(event.name){
        case "add": this.toAdd();break;
        case "del": this.toDel(true,null);break;
        case "imp": this.toImport();break;
        case "exp": this.toExport();break;
        default: break;
      }
    }
    //分配表格按钮的执行方法
    getTableBtn(event){
      switch(event.name){
        case "update":this.toUpdate(event.item);break;
        case "del": this.toDel(false,event.item);break;
        case "see": this.toSee(event.item);break;
        default: break;
      }
    }

    ngOnInit(): void {
        this.openLeft = false;//关闭左边树
        this.isAdvancedSearch = false;//关闭高级搜索
        this.isTablePage = true;//开启单独翻页
        this.isOperation = true;//开启表格内容操作栏
        this.columns = this.colorService.tableColumns();

        //启动新增校验
        this.validateForm = this.fb.group({
          code: [null, [Validators.required]],//新增编号
          name: [null, [Validators.required]],//新增名称
          customcode: [null],//新增自定义编号
          description: [null],//新增描述
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
      this.colorService.getList(this.queryParams).then( (res:any) =>{
          this.tableData = res.data;
          this.total = res.total;
          this.zpage.getTableScrollToTop();//表格滚动条回滚到顶部
          this.setOfCheckedId.clear();//清除选中项
          this.tableLoading = false;
      },()=>{}).finally(()=>{
          this.tableLoading = false;
      });
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

    //重置查询内容
    resetSearch(){
      this.queryParams = {
          keywords:"",//关键词
          sort:"",//以哪个字段进行排序
          dortDirections:"",//排序方式 支持的排序方式，取值为 'asc', 'desc', null
          page: 1,//当前第几页
          pageSize: 20,//每页显示条数
      };
      this.tableLoading = true;
      this.colorService.getList(this.queryParams).then( (res:any) =>{
        this.tableData = res.data;
        this.total = res.total;
        this.tableLoading = false;
      },()=>{});
    }

    //重置表单内容
    resetForm(){
      this.validateForm.setValue({code:"",name:"",customcode:"",description:""});
      this.validateForm.reset();//重置表单校验
    }

    //按钮-新增
    toAdd(){
      this.zpopupTiele = this.i18nPipe.transform('btn.add');
      this.popupType = "add";
      this.isPopup = true;
    }

    //按钮-查看
    toSee(item){
      this.zpopupTiele = this.i18nPipe.transform('btn.see');
      this.popupType = "see";
      this.isLoading = true;
      this.isPopup = true;

      if(item.key!=null && item.key!=""){
        this.colorService.see(item.key).then( (res:any) =>{
          this.validateForm.setValue(
            {
              code:res.code,
              name:res.name,
              customcode:res.customcode,
              description:res.description
            }
          );
          this.isLoading = false;
        },()=>{});
      }
    }

    //按钮-修改
    updateKey = "";//修改的记录id
    toUpdate(item){
      this.zpopupTiele = this.i18nPipe.transform('btn.update');
      this.popupType = "update";
      this.isLoading = true;
      this.isPopup = true;
      if(item.key!=null && item.key!=""){
        this.colorService.see(item.key).then( (res:any) =>{
          this.updateKey = res.key;
          this.validateForm.setValue(
            {
              code:res.code,
              name:res.name,
              customcode:res.customcode,
              description:res.description
            }
          );
          this.isLoading = false;
        },()=>{});
      }
      
    }

    //按钮-导入
    toImport(){
      this.zpopupTiele = this.i18nPipe.transform('btn.import');
      this.isPopupImport = true;
    }

    //导入方法
    isUpload:boolean = false;
    importChange({ file, fileList }: NzUploadChangeParam): void {
      //处理显示列表
      let fileListNew = [...fileList];
      fileListNew = fileListNew.slice(-2);
      fileListNew = fileListNew.map(file => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      this.fileList = fileListNew;
      //------------下面处理接口
      const status = file.status;
      const name = file.name;

      if (status === 'uploading') {
        this.isUpload = true;
      }
      if (status !== 'uploading') {
        this.isUpload = false;
      }
      if (status === 'done') {
        if(file.response.code==0){
          this.message.success(`${file.name} ` + (file.response.message || this.util.getComm('sucess.s_imp')));
        }else{
          this.fileList.pop();//删除最后一个元素
          this.message.warning(`${file.name} ` + (file.response.message || ''));
        }
        
        this.isUpload = false;
      } else if (status === 'error') {
        this.fileList.pop();
        this.message.error(`${file.name} `+ this.util.getComm('fail.f_uploader'));
        this.isUpload = false;
      }
    }

    //导入抬头添加token
    uploadingHeader(){
            const token = sessionStorage.ticket ;
            return {
                token: token,
                language: localStorage.language
            }
    }

    //导入文件条件
    beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      let lastName = this.util.getFileLast(file.name);
      const isExcel = lastName === 'xls' || lastName === 'xlsx';
      if (!isExcel) {
        this.message.warning(this.util.getComm('warning.excel'));
        observer.complete();
        return;
      }
      // const isLt2M = file.size! / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //   this.message.warning(this.util.getComm('warning.imageSize'));
      //   observer.complete();
      //   return;
      // }
      // observer.next(isJpgOrPng && isLt2M);
      observer.next(isExcel);
      observer.complete();
    });

    //按钮-导出
    toExport(){
      this.colorService.export("colorExport.xls",{keywords:this.queryParams.keywords})
    }

    //确认
    submit(){
      this.isLoading = true;
      //新增
      if(this.popupType=='add'){
        if (this.validateForm.valid) {
          this.colorService.add(this.validateForm.value).then( (res:any) =>{
            this.message.success(this.util.getComm('sucess.s_add'));
            this.resetSearch();
            this.closePopup();
          },()=>{}).finally(()=>{
            this.isLoading = false;
          });
        } else {
          Object.values(this.validateForm.controls).forEach(control => {
            if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
            }
          });
          this.isLoading = false;
        }
      }
      //修改
      if(this.popupType=='update'){
        if (this.validateForm.valid) {
          let key = this.updateKey;
          let setData = {key,...this.validateForm.value};
          this.colorService.update(setData).then( (res:any) =>{
            this.message.success(this.util.getComm('sucess.s_update'));
            this.resetSearch();
            this.closePopup();
          },()=>{}).finally(()=>{
            this.isLoading = false;
          });
        } else {
          Object.values(this.validateForm.controls).forEach(control => {
            if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
            }
          });
          this.isLoading = false;
        }
      }
      if(this.popupType=='del'){
        if(this.delType){
          if(this.setOfCheckedId.size>0){
            let keyList = [];
            for(let key of this.setOfCheckedId){
              keyList.push({key:key});
            }
            this.colorService.del(keyList).then( (res:any) =>{
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
          this.colorService.del(this.oneDel).then( (res:any) =>{
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
      this.colorService.downloadModel();
    }

    //上传
    upExcel(){
      return this.colorService.upExcel();
    }

    //关闭
    closePopup(){
      this.isPopup = false;
      this.isPopupConfirm = false;
      this.isPopupImport = false;
      this.isLoading = false;
      this.isUpload = false;
      this.updateKey = "";//清空修改的key
      this.resetForm();
    }

    //返回当前页面全部按钮信息
    getBtnGroup(list){
      this.btnJurisdiction = list;
    }
}