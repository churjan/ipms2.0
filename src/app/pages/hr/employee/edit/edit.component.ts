import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '~/pages/hr/employee/employee.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { CommonService } from '~/shared/services/http/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from 'moment';
import { environment } from '@/environments/environment';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

    @Output() editDone = new EventEmitter<boolean>() 
    @Input() organizations: Array<any>
    title: string
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    submiting: boolean = false
    key: string
    workTypes: Array<any> = []
    educations: Array<any> = []
    nations: Array<any> = []
    marriages: Array<any> = []
    avatar: string

    constructor(
        private fb: FormBuilder,
        private employeeService: EmployeeService,
        private breakpointObserver: BreakpointObserver,
        private message: NzMessageService,
        private appService: AppService,
        public commonService: CommonService
        ) { }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if(!result.matches){
                this.width = '800px'
            }else{
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            hoi_key: [null],
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            attendanceid: [null],
            phone: [null],
            idnumber: [null],
            sex: [null],
            birthday: [null],
            education: [null],
            address: [null,[Validators.maxLength(100)]],
            worktype: [null],
            cardnumber: [null],
            employmentdate: [null],
            resignationdate: [null],
            age: [null,[Validators.min(0)]],
            nation: [null],
            height: [null,[Validators.min(0)]],
            weight: [null,[Validators.min(0)]],
            //marriage: [null],
            remark: [null]
        })
    }

    //导入抬头添加token 和 语言
    uploadingHeader(){
              const token = sessionStorage.ticket ;
              return {
                  token: token,
                  language: localStorage.language
              }
    }
        

    async open(record: any) {
        await this.commonService.dictionary("worktype").then((response: any) =>{
            if(response) this.workTypes = response
        })
        await this.commonService.dictionary("education").then((response: any) =>{
            if(response) this.educations = response
        })
        await this.commonService.dictionary("nation").then((response: any) =>{
            if(response) this.nations = response
        })
        await this.commonService.dictionary("marriage").then((response: any) =>{
            if(response) this.marriages = response
        })
        this.title = record ? this.appService.translate("update") : this.appService.translate("add")
        if(record){
            this.key = record.key
            this.employeeService.get(this.key).then((response: any) =>{
                this.validateForm.setValue({
                    hoi_key: response.hoi_key || null,
                    name: response.name || null,
                    code: response.code || null,
                    attendanceid: response.attendanceid || null,
                    phone: response.phone || null,
                    idnumber: response.idnumber || null,
                    sex: response.sex || null,
                    birthday: response.birthday || null,
                    education: response.education || null,
                    address: response.address || null,
                    worktype: response.worktype || null,
                    cardnumber: response.cardnumber || null,
                    employmentdate: response.employmentdate || null,
                    resignationdate: response.resignationdate || null,
                    age: response.age || null,
                    nation: response.nation || null,
                    height: response.height || null,
                    weight: response.weight || null,
                    //marriage: response.marriage || null,
                    remark: response.remark || null
                }) 
                this.avatar = response.picture || null
            })
        }else{
            this.key = null
        }
        this.visible = true
    }
    
    submitForm(event? :KeyboardEvent) {
        if(this.submiting) return false
        
        if(!event || event.key == "Enter"){
        
            const { employmentdate, resignationdate, birthday } = this.validateForm.value
            if(employmentdate){
                this.validateForm.patchValue({employmentdate: moment(employmentdate).format("YYYY-MM-DD")})
            }
            if(resignationdate){
                this.validateForm.patchValue({resignationdate: moment(resignationdate).format("YYYY-MM-DD")})
            }
            if(birthday){
                this.validateForm.patchValue({birthday: moment(birthday).format("YYYY-MM-DD")})
            }

            const extraData = {picture: this.avatar}

            this.submiting = true
            this.appService.formSubmit(this.validateForm,this.employeeService,this.key,extraData).then(() =>{
                this.editDone.emit(this.key ? false : true)
                this.close()
            }).finally(() =>{
                this.submiting = false
            })
        }
    }

    close(): void {
        this.validateForm.reset()
        this.avatar = null
        this.visible = false
    }

    beforeUpload = (file: any): boolean =>{
        if(file.size > 20971520){
            this.message.warning(this.appService.translate("fileSizeWarn20MB"))
            return false
        }
        const allowTypes = ['image/png','image/jpeg','image/gif']
        if(!allowTypes.includes(file.type)){
            this.message.warning(this.appService.translate("fileTypeError"))
            return false
        }
        const formData  = new FormData()
        formData.append("file",file)
        this.commonService.upload(formData).then((response :any) =>{
            this.avatar = response[0].data.path
        })
        return false
    }

}
