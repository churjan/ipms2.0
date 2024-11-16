import { Component, OnInit,ElementRef,ViewChild, ChangeDetectorRef } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AppService } from '~/shared/services/app.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, combineLatest, Observable, fromEvent } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';
import { EditComponent } from './edit/edit.component';
import { UtilService } from '~/shared/services/util.service';
import { api, AuthService } from '~/shared/services/http/auth.service';
import { FormBuilder, FormGroup, Validators,FormControl,ValidationErrors } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { OrganizationService } from './organization.service';
import { SelectService } from '~/shared/services/http/select.service';
import { I18nPipe } from '~/shared/pipes/i18n.pipe';
import { GlobalService } from '~/global';
import { RequestService } from '~/shared/services/request.service';

export interface TreeNode {
  id: string;//数据编号
  key?: string;//tree的排序编码
  name: string;
  code: string;
  description?: string;
  expand?: boolean;//当前是否展开
  level?: number;//展开后的头部缩进宽度
  children?: TreeNode[];
  parent?: TreeNode;
}

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.less'],
    providers: [I18nPipe]
})
export class OrganizationComponent implements OnInit {
    btnJurisdiction:any = {top:[],table:[]};//获取图标和按钮名称
    listTable:any[] = [];//未处理的列表数据
    @ViewChild('divTable') divTable: ElementRef;
    listLoading: boolean = false; 
    checked = false;
    indeterminate = false;
    listOfCurrentPageData: readonly TreeNode[] = [];
    setOfCheckedId = new Set<string>();

    queryName:string ="";

    // -----------------以下 弹窗参数-----------------
    isPopupConfirm:boolean = false;//是否打开删除窗口
    popupType:string = "";//类型 add新增 update修改 del删除
    zpopupTiele:string = "";//弹窗标题
    delDataNum:number = 0;//删除条数

    //以下是新增表单参数
    modalTitle:string = "";//弹窗标题
    isAddVisible:boolean = false;//是否打开删除窗口
    isAddOkLoading:boolean = false;//是否打开确定按钮的加载
    addValidateForm!: FormGroup;
    treeSelectExpandKeys = [];
    treeSelectValue?: string;//组织父级id
    treeSelectNodes = [];
    organizationName?: string;//组织名称
    organizationCode?: string;//组织编号
    organizationDescription?: string;//描述
    treeSelectOnChange($event: string): void {}

    listOfMapData: TreeNode[] = [];
    mapOfExpandedData: { [key: string]: TreeNode[] } = {};

    //以下是 与款式分类关系 弹窗参数 ---------------------
    isSetupVisible:boolean = false;//是否打开与款式分类关系窗口
    isSetupLoading:boolean = false;//是否打开与款式分类关系 确定按钮的加载
    setupNodes = [];//款式树
    setupTableLoading:boolean = false;//表格加载
    setupData = [];//与款式分类关系 表格数据
  
    

    constructor(
        public router: Router,
        private appService: AppService,
        private organizationService: OrganizationService,
        private modal :NzModalService,
        private authService: AuthService,
        private request: RequestService,
        private el:ElementRef,
        private fb: FormBuilder,
        private message: NzMessageService,
        private changeDetectorRef:ChangeDetectorRef,
        private util:UtilService,
        private selectService: SelectService,
        private i18nPipe: I18nPipe,
        private global:GlobalService) {
          
    }

    //重置
    resetSearch(){
      this.queryName = "";
      this.getList();
    }

    //查询
    toSearch(){
      this.getList();
    }

    //红色提醒
    toRed(name){
      if(this.util.isAbnormalValue(this.queryName)){
        return name.indexOf(this.queryName) != -1;
      }else{
        return false;
      }
    }

    //展开
    collapse(array: TreeNode[], data: TreeNode, $event: boolean): void {
        if (!$event) {
          if (data.children) {
            data.children.forEach(d => {
              const target = array.find(a => a.key === d.key)!;
              target.expand = false;
              this.collapse(array, target, false);
            });
          } else {
            return;
          }
        }
    }

    //格式化数据
    convertTreeToList(root: TreeNode): TreeNode[] {
        const stack: TreeNode[] = [];
        const array: TreeNode[] = [];
        const hashMap = {};
        stack.push({ ...root, level: 0, expand: true });
      
        while (stack.length !== 0) {
              const node = stack.pop()!;
              this.visitNode(node, hashMap, array);
              if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                  stack.push({ ...node.children[i], level: node.level! + 1, expand: true, parent: node });
                }
              }
        }
        return array;
    }
    
    //格式化方法
    visitNode(node: TreeNode, hashMap: { [key: string]: boolean }, array: TreeNode[]): void {
        if (!hashMap[node.key]) {
          hashMap[node.key] = true;
          array.push(node);
        }
    }

    //用于表格自适应窗口-----------------------------
    divTableWidth = 0;//记录当前表格div的宽度
    divTableHeight = 0;//记录当前表格div的高度
    tableWidthHeight: any = {};//表格内部的高宽
    getTableStyle(){
        let tableWidth = this.divTable.nativeElement.clientWidth;//获取divTable对象元素的宽度
        let tableHeight = this.divTable.nativeElement.clientHeight;//获取divTable对象元素的高度
        if(tableHeight != null && typeof(tableHeight) != 'undefined' && tableWidth != null && typeof(tableWidth) != 'undefined'){
            this.divTableWidth = tableWidth;//记录
            this.divTableHeight = tableHeight;//记录
            //改变表格高宽
            this.tableWidthHeight = {x:(this.divTable.nativeElement.clientWidth - 15)+"px",y:(this.divTable.nativeElement.clientHeight - 50) + "px"};
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
        if(this.divTableWidth!=this.divTable.nativeElement.clientWidth || this.divTableHeight!=this.divTable.nativeElement.clientHeight){
            this.getTableStyle();
        }
    }

    //分配头部按钮的执行方法
    getTopBtn(name){
      name = name?name.toLowerCase():"";//全部转成小写并处理空数据
      switch(name){
        case "add": this.add();break;
        case "update": this.edit();break;
        case "del": this.del();break;
        case "setup": this.setup();break;
      }
    }

    ngOnInit(): void {
      //监控当前浏览器窗口是否变化
      fromEvent(window,"resize").subscribe((event:any)=>{
          this.getTableStyle();
      })

      //开启校验
      this.addValidateForm = this.fb.group({
        pkey: [null, ],
        name: [null, [Validators.required]],
        code: [null, [Validators.required]],
        type: [null, ],
        type_name:[null, ],
        description: [null, ]
      });

      //获取当前页面全部按钮信息
      let url = this.router.url.replace(/\//g, "_");
      if (url.indexOf("_") == 0) {
          url = url.substring(1, url.length)
      }
      
      if(this.global.munuList.length>0){
        this.btnJurisdiction = this.authService.getBtnZAll(this.global.munuList,url);//获取用户当前拥有的权限按钮标签
      }else{
          this.request.get(api.userMenu).then(response => {
              // response;
              let menuData = response;
              this.global.munuList = menuData;
              this.btnJurisdiction = this.authService.getBtnZAll(this.global.munuList,url);//获取用户当前拥有的权限按钮标签
          }).catch(()=>{
              let menuData = [];
              this.global.munuList = menuData;
              this.btnJurisdiction = this.authService.getBtnZAll(this.global.munuList,url);//获取用户当前拥有的权限按钮标签
          })
      }
      //获取
      this.getList();
      
    }

    //获取部门类型
    typeList:any[] = [];
    isType:boolean = false;
    getTypeList(){
      this.isType = true;
      this.selectService.orgtype().then((res:any)=>{
        this.typeList = res.data;
        this.isType = false;
      },()=>{})
    }
    typeSelectOnChange(event: string): void {
      let type_name = "";
      for(let item of this.typeList){
        if(event===item.code){
          type_name = item.name;
        }
      }
      this.addValidateForm.patchValue({ type_name: type_name });
    }

    //获取数据
    getList(){
        this.listLoading = true;
        this.organizationService.getListAll().then((response:any) =>{
          this.listTable = response;//存储数据用于校验
          this.setOfCheckedId.clear();//清理选中的元素
          this.listOfMapData = this.util.toTree(response,'key','pkey');//格式化后端传过来的数据
          this.listOfMapData.forEach(item => {
              //格式化表格数据
              this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
          });
          //新增下拉组织树数据格式化
          this.treeSelectNodes = this.util.toSelectTree(response,'key','pkey');
          this.listLoading = false;
        }).finally(()=>{
          this.listLoading = false;
        });
    }

    //复选对象操作
    refreshCheckedStatus(): void {
      this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
      this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
    }

    //当前页面展示数据改变的回调函数
    onCurrentPageDataChange($event: readonly TreeNode[]): void {
      this.listOfCurrentPageData = $event;
      this.refreshCheckedStatus();
    }

    //勾选
    onItemChecked(key: string, checked: boolean): void {
      this.updateCheckedSet(key, checked);
      this.refreshCheckedStatus();
    }

    //全选
    onAllChecked(value: boolean): void {
      this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.key, value));
      this.refreshCheckedStatus();
    }

    //更新复选对象
    updateCheckedSet(key: string, checked: boolean): void {
      if (checked) {
        this.setOfCheckedId.add(key);
      } else {
        this.setOfCheckedId.delete(key);
      }
    }

    //按钮-新增
    add(){
      this.modalTitle = this.i18nPipe.transform('btn.add');
      this.popupType = "add";
      this.isAddVisible = true;
      this.getTypeList();
    }

    //新增-提交
    handleOk(): void {
      if(this.popupType === "add"){
        if (this.addValidateForm.valid) {
          for(let o of this.listTable){
            if(o.code===this.addValidateForm.get('code').value){
              this.message.warning(this.util.getComm('warning.noCode'));
              return ;
            }
          }
          this.isAddOkLoading = true;
          this.organizationService.add(this.addValidateForm.value).then( (res:any) =>{
            this.message.success(this.util.getComm('sucess.s_add'));
            this.closePopup();
            this.getList();
          }).finally(()=>{
            this.isAddOkLoading = false;
          });
        }else {
          Object.values(this.addValidateForm.controls).forEach(control => {
            if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
            }
          });
        }
      }
      
      if(this.popupType === "update"){
        if (this.addValidateForm.valid) {
          //如果当前组织编码和原先的一样 这跳过这个查重
          if(this.editCode!=this.addValidateForm.get('code').value){
            for(let o of this.listTable){
              if(o.code===this.addValidateForm.get('code').value){
                this.message.warning(this.util.getComm('warning.noCode'));
                return ;
              }
            }
          }
          this.isAddOkLoading = true;
          let list = {
            key:this.editKey,
            pkey:this.addValidateForm.get('pkey').value,
            name:this.addValidateForm.get('name').value,
            code:this.addValidateForm.get('code').value,
            type:this.addValidateForm.get('type').value,
            type_name:this.addValidateForm.get('type_name').value,
            description:this.addValidateForm.get('description').value
          }
          this.organizationService.update(list).then( (res:any) =>{
            this.message.success(this.util.getComm('sucess.s_update'));
            this.closePopup();
            this.getList();
          }).finally(()=>{
            this.isAddOkLoading = false;
          });
        }else {
          Object.values(this.addValidateForm.controls).forEach(control => {
            if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
            }
          });
        }
      }

      if(this.popupType === "del"){
        let keyList = [];
        for(let key of this.setOfCheckedId){
          keyList.push({key:key});
        }
        this.organizationService.del(keyList).then( (res:any) =>{
          this.message.success(this.util.getComm('sucess.s_delete'));
          this.closePopup();
          this.getList();
        });
      }
    }

    //按钮-修改
    editKey = "";//当前修改选中的key
    editCode = "";//当前修改选择的组织编号
    edit(){
      this.modalTitle = this.i18nPipe.transform('btn.update');
      this.popupType = "update";
      if(this.setOfCheckedId.size==0){
        this.message.create('warning', this.util.getComm('checkdata.check_data'));
      }else if(this.setOfCheckedId.size==1){
        this.isAddVisible = true;
        let key = "";
        for(let item of this.setOfCheckedId){
          key = item;
        }
        this.getTypeList();

        this.organizationService.see(key).then( (res:any) =>{
          this.resetForm();
          this.editKey = res.key;
          this.editCode = res.code;
          this.addValidateForm.setValue(
            {
              pkey:res.pkey || "",
              name:res.name || "",
              code:res.code || "",
              type:res.type!=null?res.type:"",
              type_name:res.type_name || "",
              description:res.description || ""
            }
          );
          this.isAddOkLoading = false;
        }).finally(()=>{
          this.isAddOkLoading = false;
        });
      }else{
        this.message.create('warning', this.util.getComm('checkdata.check_singledata'));
      }
    }

    //按钮-删除
    del(){
      if(this.setOfCheckedId.size<=0){
        this.message.create('warning', this.util.getComm('checkdata.check_data'));
      }else{
        this.modalTitle = this.i18nPipe.transform('btn.delete');
        this.popupType = "del";
        this.delDataNum = this.setOfCheckedId.size;
        this.isPopupConfirm = true;
      }
    }

    //按钮-与款式分类关系
    setup(){
      if(this.setOfCheckedId.size==0){
        this.message.create('warning', this.util.getComm('checkdata.check_data'));
      }else if(this.setOfCheckedId.size==1){
        this.modalTitle = this.i18nPipe.transform('btn.setup');
        this.popupType = "setup";
        this.isSetupVisible = true;
        this.isSetupLoading = true;
        this.setupTableLoading = true;
        this.organizationService.getStyleTree().then( (res:any) =>{
          this.setupNodes = this.util.toStyleTree(res,'key','pkey');
          this.isSetupLoading = false;
        });

        let key = "";
        for(let item of this.setOfCheckedId){
          key = item;
        }
        this.organizationService.getSetup({hoi_key:key}).then( (res:any) =>{
          this.setupData = res;
          this.setupTableLoading = false;
        });
      }else{
        this.message.create('warning', this.util.getComm('checkdata.check_singledata'));
      }
    }

    //与款式分类关系 树点击事件
    nzSetupEvent(event: NzFormatEmitEvent): void {}

    //重置表单内容
    resetForm(){
      this.addValidateForm.reset();//重置表单校验
      this.delDataNum = 0;
      this.addValidateForm.setValue({pkey:"",name:"",code:"",type:"",type_name:"",description:""});
      this.addValidateForm.reset();//重置表单校验
    }

    //关闭
    closePopup(){
      this.isAddVisible = false;
      this.isPopupConfirm = false;

      this.isAddOkLoading = false;
      this.popupType = "";

      this.isSetupVisible = false;
      this.isSetupLoading = false;
      
      this.resetForm();
  }
}
