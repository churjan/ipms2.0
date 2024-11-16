import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { differenceInCalendarDays } from 'date-fns';
import { I18nPipe } from "~/shared/pipes/i18n.pipe";
import { UtilService } from "~/shared/services/util.service";

@Component({
    selector: 'app-retrieval',
    templateUrl: './retrieval.component.html',
    styleUrls: ['./retrieval.component.less'],
    providers: [I18nPipe]
})
export class RetrievalComponent implements OnInit {
    constructor(private fb: FormBuilder,private util:UtilService,private i18nPipe: I18nPipe) {}
    dateFormat = "yyyy-MM-dd";//时间格式化
    index = 0;
    typeList:any[] = [
      {code:1001,name:'Hanger'},
      {code:1002,name:'Warehouse'},
      {code:1003,name:'WebApi'},
      {code:1004,name:'ExternalApi'},
      {code:1007,name:'HEC'},
      {code:1008,name:'PAD'}
    ];
    levelList:any[] = [
      {code:2,name:'Information'},
      {code:3,name:'Warning'},
      {code:4,name:'Error'},
    ];
    tabs = [];
    validateForm!: FormGroup;
    today = new Date();
    contList:string[] = [];//检索的内容关键字集合
    time:string = "";//格式转换好的时间

    tabParameterList:any[] = [];//用于存储每个tab提交的参数

    disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) > 0;
  
    //关闭tab页
    closeTab({ index }: { index: number }): void {
      //删除对应内容关键字
      this.contList.splice(index,1);
      //删除对应内容参数记录
      this.tabParameterList.splice(index,1);
      //删除对应tabs
      this.tabs.splice(index, 1);
    }
  
    //新增tab页
    newTab(): void {
      if (this.validateForm.valid) {
        let cont = this.validateForm.get('content').value;
        this.time = this.toDateFormat(this.validateForm.get('time').value, 'yyyy-MM-dd');

        let type = this.validateForm.get('type').value;
        for(let item of this.typeList){
          if(type==item.code){
            type = item.name;
            break;
          }
        }
        let level = this.validateForm.get('level').value;
        for(let item of this.levelList){
          if(level==item.code){
            level = item.name;
            break;
          }
        }
        this.contList.push((cont||""));//关键字集合
        let titleName = ((cont!=null && cont!="")?this.i18nPipe.transform('popupField.content')+'：'+cont:'') + 
        ((type!=null && type!="")?" "+this.i18nPipe.transform('popupField.style')+"："+ type:'')  + 
        ((this.time!=null && this.time!="")?" "+this.i18nPipe.transform('popupField.time')+"："+ this.time:'') + 
        ((level!=null && level!="")?" "+this.i18nPipe.transform('popupField.level')+"："+ level:'') + 
        ((this.validateForm.get('code').value!=null && this.validateForm.get('code').value!="")?" "+this.i18nPipe.transform('popupField.line_code2')+"："+ this.validateForm.get('code').value:'') +
        ((this.validateForm.get('StationCode').value!=null && this.validateForm.get('StationCode').value!="")?" "+this.i18nPipe.transform('popupField.stationCode')+"："+ this.validateForm.get('StationCode').value:'');
        // let titleName = '内容：'+ (cont||"") +" 类型："+ type +" 时间：" + this.time+" 等级："+level+" 线号："+this.validateForm.get('code').value+" 站位号："+this.validateForm.get('StationCode').value;
        //如果条件一样将关闭之前的tab
        let closeTab = false;
        for(let [i, val] of this.tabs.entries()){
          if(titleName === val){
            //删除对应内容关键字
            this.contList.splice(i,1);
            //删除对应内容参数记录
            this.tabParameterList.splice(i,1);
            //删除对应tabs
            this.tabs.splice(i, 1);
            closeTab = true;
          }
        }
        //保存当前新ｔａｂ页的参数数据
        this.tabParameterList.push(this.validateForm.value);
        if(closeTab){
          //需要延迟执行 等待删除完后再执行
          setTimeout(() => {
            this.tabs.push(titleName);//tab页的标题
            this.index = this.tabs.length - 1;//跳转到最新的tab页
          }, 500);
        }else{
          this.tabs.push(titleName);//tab页的标题
          this.index = this.tabs.length - 1;//跳转到最新的tab页
        }
      } else {
        Object.values(this.validateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    } 

    //点击tab触发
    toTab(i){
      if(this.util.isAbnormalValue(i+"")){
        
        this.validateForm.patchValue(
          {
            content: this.tabParameterList[i].content || '',
            time: this.tabParameterList[i].time || '',
            type: this.tabParameterList[i].type || '',
            code: this.tabParameterList[i].code || '',
            StationCode: this.tabParameterList[i].StationCode || '',
            level: this.tabParameterList[i].level || ''
          }
        )
      }
    }

    /**日期格式化 */
    toDateFormat(Time: any, _format) {
      if (!Time || Time === '' || Time == null) { return ''; }
      let _time = Time._d ? Time._d : new Date(Time);
      return UtilService.dateFormat(_time, _format);
    }

    //重置
    reset(){
      this.validateForm.reset();//重置表单校验
      //校验必填项
      this.validateForm = this.fb.group({
        content: [],
        time: [null, [Validators.required]],
        type: [null, [Validators.required]],
        code: [null],
        StationCode: [null],
        level: [null],
      });
    }

    //选择类型后必填项增加一个code线号
    genderChange(e){
      if(e==1007 || e==1008){
        this.validateForm.get('code')!.setValidators(Validators.required);
      }else{
        this.validateForm.get('code')!.clearValidators();
      }
      this.validateForm.get('code')!.updateValueAndValidity();
    }

    ngOnInit(): void {
      //校验必填项
      this.validateForm = this.fb.group({
        content: [],
        time: [null, [Validators.required]],
        type: [null, [Validators.required]],
        code: [null],
        StationCode: [null],
        level: [null],
      });
    }
}