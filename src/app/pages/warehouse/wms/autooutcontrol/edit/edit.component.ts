import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { AutoOutControlService } from '~/pages/warehouse/wms/autooutcontrol/autoOutControl.service';
import * as moment from 'moment';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

    @Output() editDone = new EventEmitter<boolean>() 
    title: string
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    submiting: boolean = false
    key: string
    schemes: Array<any> = []
    
    constructor(
        private fb: FormBuilder,
        private autoOutControlService: AutoOutControlService,
        private breakpointObserver: BreakpointObserver,
        private appService: AppService
        ) { }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if(!result.matches){
                this.width = '500px'
            }else{
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            name:    [null, [Validators.required]],
            outtime: [null],
            details: [null, [Validators.required]]
        }) 
    }

    async open(record: any) {
        await this.autoOutControlService.schemes().then((response: any) =>{
            this.schemes = response
        })
        this.title = record ? this.appService.translate("update") : this.appService.translate("add")
        if(record){
            this.key = record.key
            this.autoOutControlService.get(this.key).then((response: any) =>{
                this.validateForm.setValue(response)
            })
        }else{
            this.key = null
        }
        this.visible = true
    }
    
    submitForm(event? :KeyboardEvent) {
        if(this.submiting) return false
        
        if(!event || event.key == "Enter"){
            
            const { details, outtime } = this.validateForm.value
            const extraData: any = {}
            if(details){
                extraData.details = details.map((item: string) =>{
                    return {ssor_key: item}
                })
            }
            
            if(outtime){
                this.validateForm.patchValue({outtime: moment(outtime).format("YYYY-MM-DD HH:mm:ss")})
            }

            this.submiting = true
            this.appService.formSubmit(this.validateForm,this.autoOutControlService,this.key,extraData).then(() =>{
                this.editDone.emit(this.key ? false : true)
                this.close()
            }).finally(() =>{
                this.submiting = false
            })
        }
    }

    close(): void {
        this.validateForm.reset()
        this.visible = false
    }

}
