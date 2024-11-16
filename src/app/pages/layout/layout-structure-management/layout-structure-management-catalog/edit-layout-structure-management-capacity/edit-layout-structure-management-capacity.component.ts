import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AppService } from "~/shared/services/app.service";
import { LayoutStructureManagementService } from "../../layout-structure-management.service";
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { UtilService } from "~/shared/services/util.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-edit-layout-structure-management-capacity',
    templateUrl: './edit-layout-structure-management-capacity.component.html',
    styleUrls: ['./edit-layout-structure-management-capacity.component.less'],
})
export class EditLayoutStructureManagementCapacityComponent implements OnInit {
    validateForm!: FormGroup;//校验
    validateFormAllLine!: FormGroup;//校验
    lineList:any[] = [];//线位数据
    selectKey = "";//选中的节点
    tableData = [];//表格数据
    isLeftSpinning:boolean = false;
    setOfCheckedId = new Set<string>();//表格回传回来的当前已选择的数据key
    //查询参数
    queryParams = {
        //sort:"",//以哪个字段进行排序
        //dortDirections:"",//排序方式 支持的排序方式，取值为 'asc', 'desc', null
        page_index: 1,//当前第几页
        page_size: 20,//每页显示条数
        line_key:"",//生产线key
        station_code:"",//站位编号
    };
    tableLoading:boolean = false;
    total:number = 0;//总条数
    
    lineDownList:any[] = [];//线位下拉数据
    isAllLine:boolean = false;//全线窗口开关
    isAllLineSubmit:boolean = false;//全线配置按钮状态
    isOneLine:boolean = false;//结构窗口开关
    isOneLineSubmit:boolean = false;//结构配置按钮状态

    //软满（容量）数据 ---------------------------
    editId: string | null = null;
    startEdit(id: string): void {
      this.editId = id;
    }

    //修改软满（容量）回车键
    keyupEnter(){
      this.editId = null;//焦点取消 会 触发stopEdit() 
    }

    //修改容量
    stopEdit(id,val): void {
      if(val==0 || val==="0"){
        this.editId = null;
        return;
      }
      if(this.util.isAbnormalValue(id)){
        let setData = {bls_key:id,volume:val};
        this.lsms.upCapacity(setData).then( (res:any) =>{
            this.message.success(this.util.getComm('sucess.s_adjustmentinfo'));
            this.editId = null;
        },()=>{}).finally(()=>{
            this.isOneLineSubmit = false;
        });
      }else{
        this.message.warning(this.util.getComm('warning.noKey'));
      }
    }

    ngOnInit(): void {
        this.fetchCatalog();

        //启动单线容量校验
        this.validateForm = this.fb.group({
          volume: [null, [Validators.required]],//容量
        });
        //启动全线容量校验
        this.validateFormAllLine = this.fb.group({
          line_key: [null, [Validators.required]],//产线key
          volume: [null, [Validators.required]],//容量
        });
    }
    constructor(
        public appService: AppService,
        private lsms: LayoutStructureManagementService,
        private el: ElementRef,
        private util:UtilService,
        private message: NzMessageService,
        private fb: FormBuilder
    ) {}

    //获取线位
    fetchCatalog() {
        this.isLeftSpinning = true;
        this.lsms.getLine({group:'Line'}).then((data: any) => {
            this.lineList = [];
            for(let item of data){
                this.lineList.push({ title: item.name, key: item.key, isLeaf: true});
            }
            this.lineDownList = this.lineList;
            this.isLeftSpinning = false;
        });
    }

    //查询
    toSearch(type){
      if(type==1){
        //需要把页码改为1的
        this.queryParams.page_index = 1;
      }
      this.tableLoading = true;
      this.lsms.getCapacity(this.queryParams).then((data: any) => {
        this.tableData = [];
        this.tableData = data.data;
        this.total = data.total;
        if(type==1){
          this.getTableScrollToTop();
        }
        this.tableLoading = false;
      },()=>{}).catch(err => {
        this.tableLoading = false;
      });
    }

    //重置查询参数
    resetQueryParams(){
      this.queryParams.page_index = 1;
      this.queryParams.page_size = 20;
      this.queryParams.station_code = "";

      this.toSearch(1);
    }

    //选中tree
    treeKey = "";//记录选中的key 选中的树节点
    nzEvent(event): void {
      if(event.keys[0] != this.treeKey){
        this.treeKey = event.keys[0];
        this.queryParams.line_key = event.keys[0];
        this.validateFormAllLine.patchValue({line_key:event.keys[0]});
      }else{
        this.queryParams.line_key = "";
        this.treeKey = "";
        this.validateFormAllLine.patchValue({line_key:""});
      }
      
      this.toSearch(1);
    }

    //全线配置中的下拉框和tree的联动
    toTreeKey(key){
      this.treeKey = key;//树的key
      this.selectKey = key;//树的key
      this.queryParams.line_key = key;
      this.toSearch(1);
    }

    //页码改变的回调
    pageIndexChange(number){
        this.queryParams.page_index = number;
        this.toSearch(2);
    }
  
    //每页条数改变的回调
    pageSizeChange(size){
        this.queryParams.page_size = size;
        this.toSearch(1);
    }
  
    //表格复选选中key的回传函数
    getCheckedId(idList){
        this.setOfCheckedId = idList;
    }
    
    //排序回调
    getSortList(list){}

    //全线配置
    toAllLine(){
      this.isAllLine = true;
      this.resetAllForm();
      this.validateFormAllLine.patchValue({line_key:this.treeKey});
    }

    //全线配置-提交
    onAllLineSubmit(){
      if (this.validateFormAllLine.valid) {
        this.lsms.upAllCapacity(this.validateFormAllLine.value).then( (res:any) =>{
          this.message.success(this.util.getComm('sucess.s_adjustmentinfo'));
          this.toSearch(1);
          this.isAllLine = false;
          this.isAllLineSubmit = false;
        },()=>{}).finally(()=>{
          this.isAllLineSubmit = false;
        });
      }else {
        Object.values(this.validateFormAllLine.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        this.isAllLineSubmit = false;
      }
    }

    //全线配置-取消
    onAllLineClose(){
      // this.validateFormAllLine.reset();//重置表单校验
      this.isAllLine = false;
    }

    //重置单线表单内容
    resetForm(){
      this.bls_key = "";
      this.validateForm.setValue({volume:null});
      this.validateForm.reset();//重置表单校验
    }

    //打开进轨配置窗口
    bls_key = "";//记录需要配置的key
    toConfig(data){
      if(this.util.isAbnormalValue(data.bls_key)){
        this.bls_key = data.bls_key;
        this.isOneLine = true;
      }else{
        this.message.warning(this.util.getComm('warning.noKey'));
      }
    }

    //进轨配置-提交
    onOneLineSubmit(){
      if (this.validateForm.valid) {
        this.isOneLineSubmit = true;
        let setData = {bls_key:this.bls_key,...this.validateForm.value};
        this.lsms.upCapacity(setData).then( (res:any) =>{
          this.message.success(this.util.getComm('sucess.s_adjustmentinfo'));
          this.resetForm();
          this.toSearch(2);
          this.isOneLine = false;
          this.isOneLineSubmit = false;
        }).finally(()=>{
          this.isOneLineSubmit = false;
        });
      } else {
        Object.values(this.validateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        this.isOneLineSubmit = false;
      }
    }

    //重置表单内容
    resetAllForm(){
      this.validateFormAllLine.clearAsyncValidators();
      this.validateFormAllLine.reset();//重置表单校验
    }

    //进轨配置-取消
    onOneLineClose(){
      this.resetForm();
      this.isOneLine = false;
    }

    closePopup(){
      this.isAllLine = false;
    }

    //查询或翻页后将表格滚动条回归到顶部
    getTableScrollToTop(){
      this.el.nativeElement.querySelector('.ant-table-body').scrollTop = 0;
    }
}