import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '~/pages/hr/employee/employee.service';
import { UtilService } from '~/shared/services/util.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import * as moment from 'moment';
import { ZPageComponent } from '~/shared/components/zpage/zpage.component';
import { I18nPipe } from '~/shared/pipes/i18n.pipe';
import { SelectService } from '~/shared/services/http/select.service';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.less'],
    providers: [I18nPipe]
})
export class EmployeeComponent implements OnInit {
    @ViewChild('ltree', { static: false }) nzTreeComponent: NzTreeComponent;
    @ViewChild('zpage') zpage: ZPageComponent;
    constructor(
      private employeeService:EmployeeService,
      private fb: FormBuilder,
      private message: NzMessageService,
      private util:UtilService,
      private selectService: SelectService,
      private i18nPipe: I18nPipe
      ){

    }

    openLeft:boolean = true;//是否开启左边树区域
    isLeftSpinning:boolean = false;//是否开启左边树加载状态
    leftTreeTitle:string = this.i18nPipe.transform('popupField.organization');//左边树区域标题
    isAdvancedSearch:boolean = true;//是否开启高级搜索
    isTablePage:boolean = true;//是否开启单独的翻页
    isCheck: boolean = true;//是否开启表格复选 默认开启
    isCheckAll: boolean = true;//是否开启表格全选 默认开启
    isNumber: boolean = true;//是否开启序列 默认开启
    isOperation: boolean = true;//是否开启表格内操作栏 默认关闭

    searchValue = '';//左侧树查询框的参数
    
    //查询参数
    queryParams = {
        //sort:"",//以哪个字段进行排序
        //dortDirections:"",//排序方式 支持的排序方式，取值为 'asc', 'desc', null
        page: 1,//当前第几页
        pageSize: 20,//每页显示条数
        hoi_key:"",//组织机构key
        keywords:"",//关键词
        sex:"",//性别
        sri_key:"",//角色
        name:"",//名称
        code:"",//工号
        attendanceid:"",//考勤卡号
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

    //----------------以下 员工详情 -----------------------------
    isPopupUser:boolean = false;
    userData = {};//员工数据

    // -----------------以下 弹窗参数-----------------
    isPopup:boolean = false;//是否打开窗口
    isPopupImport:boolean = false;//是否打开导出窗口
    isPopupConfirm:boolean = false;//是否打开删除窗口
    syncText:string = this.i18nPipe.transform('confirm.confirm_sync');//同步用户信息窗口提示内容
    isSyncLoading:boolean = false;//同步用户信息窗口按钮状态
    isPopupSyncConfirm:boolean = false;//是否打开同步用户信息窗口
    isLoading:boolean = false;//是否打开确定按钮的加载
    validateForm!: FormGroup;//校验
    popupType:string = "";//类型 add新增 update修改 del删除
    zpopupTiele:string = "";//弹窗标题
    delDataNum:number = 0;//删除条数

    treeSelectNodes = [];//部门数据
    treeSelectExpandKeys = [];
    loading = false;
    avatarUrl?: string ="";

    //---------------------用户管理 ------------------
    isPopupRole:boolean = false;//是否打开窗口
    isRoleLoading:boolean = false;//是否打开确定按钮的加载
    roleValidateForm!: FormGroup;//用户管理校验
    roleDataLeft = [];//当前登录的用户全部角色
    roleLeftLoading:boolean = false;
    roleDataRight = [];//当前选中的用户全部角色
    roleRightLoading:boolean = false;
    worksectionDataLeft = [];//当前登录的用户全部工段
    worksectionLeftLoading:boolean = false;
    worksectionDataRight = [];//当前选中的用户全部工段
    worksectionRightLoading:boolean = false;
    select_sui_key = "";//选中员工的sui_key
    select_hei_key = "";//选中员工的hei_key

    //---------------------技能管理 ------------------
    
    isPopupSkill:boolean = false;//是否打开窗口
    isSkillLoading:boolean = false;//是否打开确定按钮的加载
    skillValidateForm!: FormGroup;//技能管理校验

    skillDataLeft = [];//当前登录的用户全部技能
    skillLeftLoading:boolean = false;
    skillLeftSelect:string = "";////当前登录的用户全部技能中查询的关键字
    skillPage:number = 1;//当前第几页
    skillPageSize:number = 10;//每页显示条数
    skillTotal:number = 0;

    skillDataRight = [];//当前选中的用户全部技能
    skillRightLoading:boolean = false;
    skillRightSelect:string = "";////当前选中的用户全部技能中查询的关键字
    skillRightPage:number = 1;//当前第几页
    skillRightPageSize:number = 10;//每页显示条数
    skillRightTotal:number = 0;

    isSkillUserListLoading:boolean = false;
    skillUserList = [];//技能管理用户下拉数据

    //--------------------- 设备权限 ------------------
    isPopupAuthority:boolean = false;//是否打开窗口
    isAuthorityLoading:boolean = false;//是否打开确定按钮的加载
    uploadStationDataLeft = [];//当前登录的用户全部上载站
    uploadStationLeftLoading:boolean = false;
    uploadStationDataRight = [];//当前选中的用户全部上载站
    uploadStationRightLoading:boolean = false;
    hangLineDataLeft = [];//当前登录的用户全部实体线
    hangLineLeftLoading:boolean = false;
    hangLineDataRight = [];//当前选中的用户全部实体线
    hangLineRightLoading:boolean = false;
    hangVirtuallyLineDataLeft = [];//当前登录的用户全部虚拟线
    hangVirtuallyLineLeftLoading:boolean = false;
    hangVirtuallyLineDataRight = [];//当前选中的用户全部虚拟线
    hangVirtuallyLineRightLoading:boolean = false;

    //分配头部按钮的执行方法
    getTopBtn(event){
      switch(event.name){
        case "add": this.toAdd();break;
        case "del": this.toDel(true,null);break;
        case "imp": this.toImport();break;
        case "exp": this.toExport();break;
        case "sync": this.toOpenSync();break;
        default: break;
      }
    }
    //分配表格按钮的执行方法
    getTableBtn(event){
      switch(event.name){
        case "update":this.toUpdate(event.item);break;
        case "del": this.toDel(false,event.item);break;
        case "role": this.toRole(event.item);break;
        case "skill":this.toSkill(event.item);break;
        case "authority":this.toAuthority(event.item);break;
        default: break;
      }
    }
    
    ngOnInit(): void {
        this.columns = this.employeeService.tableColumns();

        //启动新增校验
        this.validateForm = this.fb.group({
          picture: [null],//头像key
          photo: [null],//头像地址
          hoi_key: [null],//部门
          code: [null, [Validators.required]],//工号
          name: [null, [Validators.required]],//名称
          idnumber: [null],//身份证
          sex: [null],//性别
          worktype: [null],//工种
          employmentdate: [null],//入职时间
          resignationdate: [null],//离职时间
          attendanceid: [null],//考勤卡号
          cardnumber: [null],//工资卡号
          phone: [null],//联系方式
          address: [null],//联系地址
          birthday: [null],//出生年月
          age: [null],//年龄
          nation: [null],//民族
          education: [null],//文化程度
          wedded: [null],//婚姻
          height: [null],//身高
          weight: [null],//体重
          remark: [null],//备注
        });

        //用户管理校验
        this.roleValidateForm = this.fb.group({
          username:[null, [Validators.required]],//用户名
          password:[null, [Validators.required]],//密码
          expiredate: [null],//到期时间
          disable: [null],//是否禁用
        });

        //技能管理校验
        this.skillValidateForm = this.fb.group({
          name:[null, [Validators.required]],//用户名
        });

        this.getFirst();
        this.toReloadTree();
    }

    //提前获取 性别 角色 等数据
    getFirst(){
      this.employeeService.classdata({pcode:'sex'}).then((response:any) =>{this.sexList = response.data;});
      this.employeeService.classdata({pcode:'worktype'}).then((response:any) =>{this.worktypeList = response.data;});
      this.employeeService.classdata({pcode:'nation'}).then((response:any) =>{this.nationList = response.data;});
      this.employeeService.classdata({pcode:'education'}).then((response:any) =>{this.educationList = response.data;});
      this.employeeService.classdata({pcode:'marriage'}).then((response:any) =>{this.marriageList = response.data;});
      
      //获取角色下拉
      // this.employeeService.role().then((response:any) =>{this.roleList = response;});
    }

    //获取数据1为需要将页码拨回1的 2是不需要
    toSearch(type:number=1){
      if(type==1){
        //需要把页码改为1的
        this.queryParams.page = 1;
      }
      this.tableLoading = true;
      this.employeeService.getList(this.queryParams).then((response:any) =>{
          this.tableData = response.data;
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
          hoi_key:"",//组织机构key
          keywords:"",//关键词
          sex:"",//性别
          sri_key:"",//角色
          name:"",//名称
          code:"",//工号
          attendanceid:"",//考勤卡号
        };
      }
      if(type==2){
        //高级搜索重置
        this.queryParams.sex = "";
        this.queryParams.sri_key = "";
        this.queryParams.name = "";
        this.queryParams.code = "";
        this.queryParams.attendanceid = "";
        this.queryParams.page = 1;
        this.queryParams.pageSize = 20;
        //this.queryParams.sort = "";
        //this.queryParams.dortDirections = "";
      }
      this.toSearch(1);
    }

    //刷新组织机构数据
    toReloadTree(){
      this.searchValue = "";
      this.isLeftSpinning = true;
      this.employeeService.getTreeListAll().then((response:any) =>{
        this.nodes = this.util.toStyleTree(response,'key','pkey','children','0');
        this.treeSelectNodes = this.util.toSelectTree(response,'key','pkey');
        this.isLeftSpinning = false;
        this.queryParams.hoi_key = "";
      });
      this.queryParams.hoi_key = "";
      this.queryParams.keywords = "";
      this.queryParams.sex = "";
      this.queryParams.sri_key = "";
      this.queryParams.name = "";
      this.queryParams.code = "";
      this.queryParams.attendanceid = "";
      this.queryParams.page = 1;
      this.queryParams.pageSize = 20;
      this.toSearch(1);
    }

    //修改头像
    beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
      if (!isJpgOrPng) {
        this.message.warning(this.util.getComm('warning.imageType'));
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 15;
      // console.log(file.size! / 1024 / 1024,isLt2M)
      if (!isLt2M) {
        this.message.warning(this.util.getComm('warning.imageSize'));
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

    private getBase64(img: File, callback: (img: string) => void): void {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result!.toString()));
      reader.readAsDataURL(img);
    }

    //上传头像
    handleChange(info: { file: NzUploadFile }): void {
      switch (info.file.status) {
        case 'uploading':
          this.loading = true;
          break;
        case 'done':
          this.getBase64(info.file!.originFileObj!, (img: string) => {
            this.loading = false;
            this.avatarUrl = img;
          });
          if(this.util.isAbnormalValue(info.file.response[0].data.path)){
            this.validateForm.patchValue({picture: info.file.response[0].data.key});//将返回的图片的key
            this.validateForm.patchValue({photo: info.file.response[0].data.path});//将返回的图片地址
          }else{
            this.validateForm.patchValue({picture: ""});
            this.validateForm.patchValue({photo: ""});
          }
          break;
        case 'error':
          this.message.error(this.util.getComm('fail.f_uploader'));
          this.loading = false;
          break;
      }
    }

    nzTreeEvent(event: NzFormatEmitEvent): void {
      if(event.keys.length>0){
        this.queryParams.hoi_key = event.keys[0];
      }else{
        this.queryParams.hoi_key = "";
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
    isUserLoading:boolean = false;//用户详情加载状态
    toName(data){
      if(this.util.isAbnormalValue(data.key)){
        
        this.isPopupUser = true;
        this.isUserLoading = true;
        this.employeeService.getName(data.key).then(res=>{
          this.userData = res;
          this.isUserLoading = false;
        })
      }else{
        this.message.success(this.util.getComm('warning.empty'));
      }
    }

    //重置表单内容
    resetForm(){
        this.validateForm.clearAsyncValidators();
        this.validateForm.reset();//重置表单校验
    }
  
    //按钮-新增
    toAdd(){
        this.zpopupTiele = this.i18nPipe.transform('btn.add');
        this.popupType = "add";
        this.isPopup = true;
    }
  
    //按钮-修改
    updateKey = "";//修改的记录id
    toUpdate(item){
      this.zpopupTiele = this.i18nPipe.transform('btn.update');
      this.popupType = "update";
      this.isLoading = true;
      this.isPopup = true;
      if(this.util.isAbnormalValue(item.key)){
        this.employeeService.see(item.key).then( (res:any) =>{
          this.updateKey = res.key;
          this.validateForm.setValue(
            {
              photo: res.photo?(environment.imgUrl+res.photo):'',//头像地址
              picture: res.picture || '',//头像key
              hoi_key: res.hoi_key || '',//部门
              code: res.code || '',//工号
              name: res.name || '',//名称
              idnumber: res.idnumber || '',//身份证
              sex: res.sex || '',//性别
              worktype: res.worktype || '',//工种
              employmentdate: res.employmentdate || '',//入职时间
              resignationdate: res.resignationdate || '',//离职时间
              attendanceid: res.attendanceid || '',//考勤卡号
              cardnumber: res.cardnumber || '',//工资卡号
              phone: res.phone || '',//联系方式
              address: res.address || '',//联系地址
              birthday: res.birthday || '',//出生年月
              age: res.age || '',//年龄
              nation: res.nation || '',//民族
              education: res.education || '',//文化程度
              wedded: res.wedded || '',//婚姻
              height: res.height || '',//身高
              weight: res.weight || '',//体重
              remark: res.remark || '',//备注
            }
          );
          this.avatarUrl = this.validateForm.get('photo').value;
          this.isLoading = false;
        });
      }else{
        this.message.warning(this.util.getComm('warning.empty'));
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
          this.message.warning((file.response.message || ''));
        }
        this.isUpload = false;
        this.resetQueryParams(1);//重置查询条件
        this.toSearch(1);
      } else if (status === 'error') {
        this.message.error(`${file.name} `+ this.util.getComm('fail.f_uploader'));
        this.isUpload = false;
      }
    }
  
    //导入抬头添加token 和 语言
    uploadingHeader(){
      const token = sessionStorage.ticket ;
      return {
          token: token,
          language: localStorage.language
      }
    }

    //导入文件条件
    beforeUploadExcel = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
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
      this.employeeService.export(
        "informationExport.xls",
        {
          keywords:this.queryParams.keywords,//关键词
          hoi_key:this.queryParams.hoi_key,//组织机构key
          sex:this.queryParams.sex,//性别
          sri_key:this.queryParams.sri_key,//角色
          name:this.queryParams.name,//名称
          code:this.queryParams.code,//工号
          attendanceid:this.queryParams.attendanceid,//考勤卡号
        }
      )
    }

    //按钮-同步用户信息
    toOpenSync(){
      this.isPopupSyncConfirm = true;
    }
    //按钮-同步用户信息-执行
    toSync(){
      this.isSyncLoading = true;
      this.employeeService.sync().then((res:any)=>{
        this.message.success(this.util.getComm('sucess.s_sync'));
        this.isPopupSyncConfirm = false;
        this.isSyncLoading = false;
        this.toSearch(1);
      }).finally(()=>{
        this.isSyncLoading = false;
      });
    }

    //按钮-用户管理 
    toRoleUsername = "";//当前修改对象的账户
    toRoleUserKey = "";//当前修改对象的账户key
    toRole(item){
        this.zpopupTiele = this.i18nPipe.transform('btn.role');
        this.popupType = "user";
        this.isPopupRole = true;
        this.isRoleLoading = true;

        //获取用户基本信息
        if(this.util.isAbnormalValue(item.key)){
          this.employeeService.getUserAccount(item.key).then((res:any)=>{
            this.isRoleLoading = false;
            this.toRoleUsername = res.username || '';
            this.toRoleUserKey = res.key || '';
            this.roleValidateForm.setValue(
              {
                username:res.username || '',//用户名
                password:res.password || '',//密码
                expiredate:res.expiredate || '',//到期时间
                disable:res.disable,//是否禁用
              }
            )
            this.select_sui_key = res.key;
            this.select_hei_key = res.hei_key;
            this.roleRightLoading = true;
            //获取选中用户角色
            this.employeeService.getUserRoles(this.select_sui_key).then((resRoles:any)=>{
              this.roleRightLoading = false;
              this.roleDataRight = resRoles;

            })
            //获取选中用户工段
            this.worksectionRightLoading = true;
            this.employeeService.getUserWorksection(this.select_hei_key).then((resWorksection:any)=>{
              this.worksectionRightLoading = false;
              this.worksectionDataRight = resWorksection;
            })
          });
        }else{
          this.message.warning(this.util.getComm('warning.empty'));
        }
        
        //获取当前用户角色
        this.roleLeftLoading = true;
        this.employeeService.getLoginUserRoles().then((res:any)=>{
          this.roleLeftLoading = false;
          this.roleDataLeft = res;
        })

        //获取当前用户工段
        this.worksectionLeftLoading = true;
        this.employeeService.getLoginUserWorksection().then((res:any)=>{
          this.worksectionLeftLoading = false;
          this.worksectionDataLeft = res;
        })
    }

    //判断这个角色是否可以删除
    toRoleIsDel(item){
      let isDel = false;
      for(let data of this.roleDataLeft){
        //只要roleDataLeft中存在 就可以删除
        if(item.sri_key==data.sri_key){
          isDel = true;
        }
      }
      return isDel;
    }

    //判断这个工段是否可以删除
    toWorksectionIsDel(item){
      let isDel = false;
      for(let data of this.worksectionDataLeft){
        //只要worksectionDataLeft中存在 就可以删除
        if(item.bwi_key==data.key){
          isDel = true;
        }
      }
      return isDel;
    }

    //添加角色
    roleAdd(item){
      //判断是否和现有的角色重复
      for(let o of this.roleDataRight){
        if(o.sri_key===item.sri_key){
          this.message.warning(this.util.getComm('warning.repeatRole'));
          return
        }
      }
      if(this.util.isAbnormalValue(item.sui_key) && this.util.isAbnormalValue(this.toRoleUsername)){
        let data = {
          display: true,
          hei_key: item.hei_key,
          sri_key: item.sri_key,
          sri_name: item.sri_name,
          sui_key: this.select_sui_key,
          username: this.toRoleUsername
        }
        this.employeeService.empAddRole(data).then(res2=>{
          this.message.success(this.util.getComm('sucess.s_increase'));
          
          //获取选中用户角色
          this.roleRightLoading = true;
          this.employeeService.getUserRoles(this.select_sui_key).then((resRoles:any)=>{
            this.roleRightLoading = false;
            this.roleDataRight = resRoles;
          })

          //获取当前用户角色
          this.roleLeftLoading = true;
          this.employeeService.getLoginUserRoles().then((res:any)=>{
            this.roleLeftLoading = false;
            this.roleDataLeft = res;
          })
        })
      }else{
        this.message.warning(this.util.getComm('warning.NoNote'));
      }
    }

    //移除角色
    roleDel(item){
      if(this.util.isAbnormalValue(item.sui_key) && this.util.isAbnormalValue(this.toRoleUsername)){
        let data = [
          {
            display: true,
            hei_key: item.hei_key,
            hei_name: item.hei_name,
            key: item.key,
            sri_key: item.sri_key,
            sri_name: item.sri_name,
            sui_key: item.sui_key,
            sui_name: item.sui_name,
          }
        ];
        this.employeeService.empDelRole(data).then(res2=>{
          this.message.success(this.util.getComm('sucess.s_remove'));
          
          //获取选中用户角色
          this.roleRightLoading = true;
          this.employeeService.getUserRoles(this.select_sui_key).then((resRoles:any)=>{
            this.roleRightLoading = false;
            this.roleDataRight = resRoles;
          })

          //获取当前用户角色
          this.roleLeftLoading = true;
          this.employeeService.getLoginUserRoles().then((res:any)=>{
            this.roleLeftLoading = false;
            this.roleDataLeft = res;
          })
        })
      }else{
        this.message.warning(this.util.getComm('warning.NoNote'));
      }
    }

    //添加工段
    worksectionAdd(item){
      //判断是否和现有的工段重复
      for(let o of this.worksectionDataRight){
        if(o.bwi_key===item.key){
          this.message.warning(this.util.getComm('warning.repeatWorksection'));
          return
        }
      }
      if(this.util.isAbnormalValue(item.key) && this.util.isAbnormalValue(this.select_hei_key)){
        let data = {
          bwi_key: item.key,
          bwi_name: item.name,
          display: true,
          hei_key: this.select_hei_key
        }
        this.employeeService.empAddWorksection(data).then(res2=>{
          this.message.success(this.util.getComm('sucess.s_increase'));

          //获取选中用户工段
          this.worksectionRightLoading = true;
          this.employeeService.getUserWorksection(this.select_hei_key).then((resWorksection:any)=>{
            this.worksectionRightLoading = false;
            this.worksectionDataRight = resWorksection;
          })

          //获取当前用户工段
          this.worksectionLeftLoading = true;
          this.employeeService.getLoginUserWorksection().then((res:any)=>{
            this.worksectionLeftLoading = false;
            this.worksectionDataLeft = res;
          })
        })
      }else{
        this.message.warning(this.util.getComm('warning.NoNote'));
      }
    }

    //移除工段
    worksectionDel(item){
      if(this.util.isAbnormalValue(item.bwi_key) && this.util.isAbnormalValue(item.hei_key)){
        let data = [
          {
            bwi_key: item.bwi_key,
            bwi_name: item.bwi_name,
            display: true,
            hei_key: item.hei_key,
            hei_name: item.hei_name,
            key: item.key
          }
        ];
        this.employeeService.empDelWorksection(data).then(res2=>{
          this.message.success(this.util.getComm('sucess.s_remove'));
          
          //获取选中用户工段
          this.worksectionRightLoading = true;
          this.employeeService.getUserWorksection(this.select_hei_key).then((resWorksection:any)=>{
            this.worksectionRightLoading = false;
            this.worksectionDataRight = resWorksection;
          })

          //获取当前用户工段
          this.worksectionLeftLoading = true;
          this.employeeService.getLoginUserWorksection().then((res:any)=>{
            this.worksectionLeftLoading = false;
            this.worksectionDataLeft = res;
          })
        })
      }else{
        this.message.warning(this.util.getComm('warning.NoNote'));
      }
    }

    //按钮-技能管理
    toSkill(item){
        this.zpopupTiele = this.i18nPipe.transform('btn.skill');
        this.isPopupSkill = true;
        this.isSkillLoading = false;
        //加载用户下拉数据
        this.isSkillUserListLoading = true;
        this.employeeService.userList().then((res:any)=>{
          this.skillUserList = res;
          this.isSkillUserListLoading = false;
          this.skillValidateForm.patchValue({name:item.key});
        })

        this.employeeService.getUserAccount(item.key).then((res:any)=>{
          if(this.util.isAbnormalValue(res.hei_key)){
            this.select_hei_key = res.hei_key;
          }else{
            return this.message.warning(this.util.getComm('warning.NoNote'));
          }
          //加载当前登录用户的技能
          this.toLoginSkill();

          //加载选中用户的技能
          this.toUserSkill();
        })
    }

    //按钮-设备权限
    userKey:string = "";//选中的员工的key
    toAuthority(item){
      this.userKey = item.key;
      this.uploadStationDataLeft = [];
      this.uploadStationDataRight = [];
      this.zpopupTiele = this.i18nPipe.transform('btn.authority');

      this.uploadStationLeftLoading = true;
      this.employeeService.layoutStructure({maketree:true,moduletype:2,removein:true}).then((res:any)=>{
        let list = [];
        for(let item of res){
          for(let inItem of item.sonlist){
            list.push({key:inItem.key,name:inItem.name,code:inItem.code});
          }
        }
        this.uploadStationDataLeft = list;
        this.uploadStationLeftLoading = false;
      }).finally(()=>{
        this.uploadStationLeftLoading = false;
      });

      this.uploadStationRightLoading = true;
      this.employeeService.userLayoutStructure({hei_key:item.key}).then((res:any)=>{
        this.uploadStationDataRight = res;
        this.uploadStationRightLoading = false;
      }).finally(()=>{
        this.uploadStationRightLoading = false;
      })

      this.isPopupAuthority = true;
      this.isAuthorityLoading = false;
    }

    //按钮-设备权限-窗口tab切换时调用的函数
    authorityTabChange(data){
      if(data.index==0){//tab0
        this.uploadStationDataLeft = [];
        this.uploadStationDataRight = [];
        this.uploadStationLeftLoading = true;
        this.employeeService.layoutStructure({maketree:true,moduletype:2,removein:true}).then((res:any)=>{
          let list = [];
          for(let item of res){
            for(let inItem of item.sonlist){
              list.push({key:inItem.key,name:inItem.name,code:inItem.code});
            }
          }
          this.uploadStationDataLeft = list;
          this.uploadStationLeftLoading = false;
        }).finally(()=>{
          this.uploadStationLeftLoading = false;
        });

        this.uploadStationRightLoading = true;
        this.employeeService.userLayoutStructure({hei_key:this.userKey}).then((res:any)=>{
          this.uploadStationDataRight = res;
          this.uploadStationRightLoading = false;
        }).finally(()=>{
          this.uploadStationRightLoading = false;
        })
      }
      if(data.index==1){//tab1
        //全部实体线
        this.hangLineDataLeft = [];
        this.hangLineDataRight = [];
        this.hangLineLeftLoading = true;
        this.employeeService.hangLine({maketree:true,BLST_Group:'Line'}).then((res:any)=>{
          // let list = [];
          // for(let item of res){
          //   list.push({name:item.line_name+"["+item.line_code+"]",key:item.line_key,code:item.line_code});
          // }
          this.hangLineDataLeft = res;
          this.hangLineLeftLoading = false;
        }).finally(()=>{
          this.hangLineLeftLoading = false;
        });
        //用户配置的实体线
        this.hangLineRightLoading = true;
        this.employeeService.userHangLine({hei_key:this.userKey}).then((res:any)=>{
          this.hangLineDataRight = res;
          this.hangLineRightLoading = false;
        }).finally(()=>{
          this.hangLineRightLoading = false;
        });
      }
      if(data.index==2){//tab2
        //全部虚拟线
        this.hangVirtuallyLineLeftLoading = true;
        this.employeeService.LayoutVirtual().then((res:any)=>{
          this.hangVirtuallyLineDataLeft = res;
          this.hangVirtuallyLineLeftLoading = false;
        }).finally(()=>{
          this.hangVirtuallyLineLeftLoading = false;
        });
        //用户虚拟线
        this.hangVirtuallyLineRightLoading = true;
        this.employeeService.userLayoutVirtual({hei_key:this.userKey}).then((res:any)=>{
          this.hangVirtuallyLineDataRight = res;
          this.hangVirtuallyLineRightLoading = false;
        }).finally(()=>{
          this.hangVirtuallyLineRightLoading = false;
        });
      }
    }

    //按钮-设备权限-添加上载站
    uploadStationAdd(item){
      this.employeeService.addLayoutStructure({station_key:item.key,hei_key:this.userKey}).then((res:any)=>{
        this.message.success(this.i18nPipe.transform('sucess.s_uploadStation'));
        //更新用户上载站
        this.uploadStationRightLoading = true;
        this.employeeService.userLayoutStructure({hei_key:this.userKey}).then((res:any)=>{
          this.uploadStationDataRight = res;
          this.uploadStationRightLoading = false;
        }).finally(()=>{
          this.uploadStationRightLoading = false;
        })
      }).finally(()=>{});
    }

    //按钮-设备权限-移除上载站
    uploadStationDel(item){
      this.employeeService.delLayoutStructure([{key:item.key}]).then((res:any)=>{
        this.message.success(this.i18nPipe.transform('sucess.s_del_uploadStation'));
        //更新用户上载站
        this.uploadStationRightLoading = true;
        this.employeeService.userLayoutStructure({hei_key:this.userKey}).then((res:any)=>{
          this.uploadStationDataRight = res;
          this.uploadStationRightLoading = false;
        }).finally(()=>{
          this.uploadStationRightLoading = false;
        })
      }).finally(()=>{});
    }

    //按钮-设备权限-添加吊挂实体线
    hangLineAdd(item){
      this.employeeService.addHangLine({line_key:item.key,hei_key:this.userKey}).then((res:any)=>{
        this.message.success(this.i18nPipe.transform('sucess.s_hangLine'));
        //更新用户吊挂实体线
        this.hangLineRightLoading = true;
        this.employeeService.userHangLine({hei_key:this.userKey}).then((res:any)=>{
          this.hangLineDataRight = res;
          this.hangLineRightLoading = false;
        }).finally(()=>{
          this.hangLineRightLoading = false;
        });
      }).finally(()=>{});
    }

    //按钮-设备权限-移除吊挂实体线
    hangLineDel(item){
      this.employeeService.delHangLine([{key:item.key}]).then((res:any)=>{
        this.message.success(this.i18nPipe.transform('sucess.s_del_hangLine'));
        //更新用户吊挂实体线
        this.hangLineRightLoading = true;
        this.employeeService.userHangLine({hei_key:this.userKey}).then((res:any)=>{
          this.hangLineDataRight = res;
          this.hangLineRightLoading = false;
        }).finally(()=>{
          this.hangLineRightLoading = false;
        });
      }).finally(()=>{});
    }

    //按钮-设备权限-添加吊挂虚拟线
    hangVirtuallyLineAdd(item){
      this.employeeService.addHangVirtuallyLine({blv_key:item.key,hei_key:this.userKey}).then((res:any)=>{
        this.message.success(this.i18nPipe.transform('sucess.s_hangVirtuallyLine'));
        //更新用户吊挂虚拟线
        this.hangVirtuallyLineRightLoading = true;
        this.employeeService.userLayoutVirtual({hei_key:this.userKey}).then((res:any)=>{
          this.hangVirtuallyLineDataRight = res;
          this.hangVirtuallyLineRightLoading = false;
        }).finally(()=>{
          this.hangVirtuallyLineRightLoading = false;
        });
      }).finally(()=>{});
    }

    //按钮-设备权限-移除吊挂虚拟线
    hangVirtuallyLineDel(item){
      this.employeeService.delHangVirtuallyLine([{key:item.key}]).then((res:any)=>{
        this.message.success(this.i18nPipe.transform('sucess.s_del_hangVirtuallyLine'));
        //更新用户吊挂实体线
        this.hangVirtuallyLineRightLoading = true;
        this.employeeService.userLayoutVirtual({hei_key:this.userKey}).then((res:any)=>{
          this.hangVirtuallyLineDataRight = res;
          this.hangVirtuallyLineRightLoading = false;
        }).finally(()=>{
          this.hangVirtuallyLineRightLoading = false;
        });
      }).finally(()=>{});
    }

    //加载当前登录用户的技能
    toLoginSkill(){
      this.skillLeftLoading = true;
      let params = {
        keywords:this.skillLeftSelect,
        page:this.skillPage,
        pagesize:this.skillPageSize
      }
      this.employeeService.getLoginSkill(params).then((res:any)=>{
        this.skillDataLeft = res.data;
        this.skillTotal = res.total;
      }).finally(()=>{
        this.skillLeftLoading = false;
      })
    }

    //技能管理-登录用户技能数据的页码改变的回调
    pageIndexSkillChange(number){
      this.skillPage = number;
      this.toLoginSkill();
    }

    //加载选中用户的技能
    toUserSkill(){
      this.skillRightLoading = true;
      let params = {
        keywords:this.skillRightSelect,
        page:this.skillRightPage,
        pagesize:this.skillRightPageSize,
        hei_key:this.select_hei_key
      }
      this.employeeService.getUserSkill(params).then((res:any)=>{
        this.skillDataRight = res.data;
        this.skillRightTotal = res.total;
      }).finally(()=>{
        this.skillRightLoading = false;
      })
    }

    //技能管理-选中用户技能数据的页码改变的回调
    pageIndexUserSkillChange(number){
      this.skillRightPage = number;
      this.toUserSkill();
    }

    //技能管理-用户查询
    onSkillUserSearch(event){}
  
    //确认
    submit(){
        this.isLoading = true;
        //新增
        if(this.popupType=='add'){
          if (this.validateForm.valid) {
            const {employmentdate,resignationdate,birthday} = this.validateForm.value;
            //将时间格式化
            this.validateForm.patchValue({employmentdate: this.util.isAbnormalValue(employmentdate)?moment(employmentdate).format("yyyy-MM-DD"):''})
            this.validateForm.patchValue({resignationdate: this.util.isAbnormalValue(resignationdate)?moment(resignationdate).format("yyyy-MM-DD"):''})
            this.validateForm.patchValue({birthday: this.util.isAbnormalValue(birthday)?moment(birthday).format("yyyy-MM-DD"):''})

            this.employeeService.empadd(this.validateForm.value).then(res=>{
              
              this.toSearch(1);
              this.closePopup();
            }).finally(()=>{
              this.isLoading = false;
            })
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
            this.employeeService.empupdate(setData).then( (res:any) =>{
              this.message.success(this.util.getComm('sucess.s_update'));
              this.toSearch(2);
              this.closePopup();
            }).finally(()=>{
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
        //删除
        if(this.popupType=='del'){
          if(this.delType){
            if(this.setOfCheckedId.size>0){
              let keyList = [];
              for(let key of this.setOfCheckedId){
                keyList.push({key:key});
              }
              this.employeeService.empdel(keyList).then( (res:any) =>{
                this.message.success(this.util.getComm('sucess.s_delete'));
                this.toSearch(1);
                this.closePopup();
              }).finally(() => {
                this.closePopup();
              });
            }else{
              this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
            }
          }else{
            this.employeeService.del(this.oneDel).then( (res:any) =>{
              // this.message.success(this.util.getComm('sucess.s_delete'));
              this.toSearch(1);
              this.closePopup();
            }).finally(() => {
              this.closePopup();
            });
          }
        }
        //用户管理
        if(this.popupType=='user'){
          if (this.roleValidateForm.valid) {
            let key = this.toRoleUserKey;
            const {expiredate} = this.roleValidateForm.value;
            this.roleValidateForm.patchValue({expiredate: this.util.isAbnormalValue(expiredate)?moment(expiredate).format("yyyy-MM-DD"):''})
            let setData = {key:key,hei_key:this.select_hei_key,...this.roleValidateForm.value};
            this.isRoleLoading = true;
            this.employeeService.updateUser(setData).then( (res:any) =>{
              this.message.success(this.util.getComm('sucess.s_save'));
              this.isRoleLoading = false;
            }).finally(()=>{
              this.isRoleLoading = false;
            });
          } else {
            Object.values(this.roleValidateForm.controls).forEach(control => {
              if (control.invalid) {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf: true });
              }
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
      this.employeeService.downloadModel();
    }

    //上传
    upExcel(){
      return this.employeeService.upExcel();
    }
  
    //关闭
    closePopup(){
        this.isPopup = false;
        this.isPopupConfirm = false;
        this.isPopupImport = false;
        this.isPopupUser = false;
        this.isPopupRole = false;
        this.isPopupSkill = false;

        this.isLoading = false;
        this.isRoleLoading = false;
        this.isSkillLoading = false;

        this.isPopupSyncConfirm = false;

        this.isPopupAuthority = false;
        this.isAuthorityLoading = false;

        this.avatarUrl = "";//清空头像
        this.resetForm();
    }

    //------------------- 技能管理穿梭框 方法 ---------------
    skillFilterOption(inputValue: string, item: any): boolean {
      return item.description.indexOf(inputValue) > -1;
    }
  
    skillSearch(ret: {}): void {}
  
    skillSelect(ret: {}): void {}
  
    skillChange(ret: {}): void {}
}
