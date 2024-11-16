import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '~/shared/services/app.service';
import { OrganizationService } from '~/shared/services/http/organization.service';
import { UtilService } from '~/shared/services/util.service';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

    @Input()
    set model(value){
        this.key = null
        if(value){
            const data = JSON.parse(JSON.stringify(value))
            if(Object.keys(data).length > 0){
                const form = {
                    name: data.name || null,
                    code: data.code || null,
                    description: data.description || null,
                    pkey: data.pkey || null
                }
                if(data.key){
                    this.key = data.key
                }
                this.validateForm.setValue(form)
            }
        }
    }
    @Output() onUpdate = new EventEmitter()
    @Output() onAdd = new EventEmitter()
    @Input() 
    set treeData(value){
        if(value){
            this.parents = this.utilService.buildSelectTree(value)
        }
    }
    parents: any[] = []
    validateForm!: FormGroup
    buttonVisible: boolean = false
    submiting: boolean = false
    key: string = null

    constructor(private fb: FormBuilder,
        private organizationService: OrganizationService,
        private utilService: UtilService,
        private appService: AppService
        ) { }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            pkey: [null],
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            description: [null,[Validators.maxLength(100)]]
        })
    }

    submitForm(){
        if(this.submiting) return false

        this.submiting = true
        this.appService.formSubmit(this.validateForm,this.organizationService,this.key).then((response: any) =>{
            const data = Object.assign(this.validateForm.value, {key:response.key})
            if(this.key){
                this.onUpdate.emit(data)
            }else{
                this.onAdd.emit(data)
            }
            this.reset()
        }).finally(() =>{
            this.submiting = false
        })
    }

    reset(){
        this.validateForm.reset()
        this.key = null
    }
  
}
