import { EventEmitter, Input } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.less']
})
export class FilterComponent implements OnInit {

    @Output() editDone = new EventEmitter<any>() 
    @Output() onClose = new EventEmitter() 
    @Input() organizations: any[] = []
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        ) { }

    ngOnInit() {
        this.validateForm = this.fb.group({
            hoi_key: [null],
            name: [null],
            code: [null],
            attendanceid: [null],
            phone: [null],
            sex: [null]
        }) 
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if(!result.matches){
                this.width = '340px'
            }else{
                this.width = '100%'
            }
        })
    }

    open(queryParams:any = {}) {
        this.validateForm.setValue({
            hoi_key:        queryParams.hoi_key || null,
            name:           queryParams.name || null,
            code:           queryParams.code || null,
            attendanceid:   queryParams.attendanceid || null,
            phone:          queryParams.phone || null,
            sex:            queryParams.sex || null
        })
        this.visible = true
    }
    
    submitForm(event? :KeyboardEvent) {
        if(!event || event.key == "Enter"){ 
            for(let key in this.validateForm.value){
                if(typeof this.validateForm.value[key] == 'string'){
                    const temp = {}
                    temp[key] = this.validateForm.value[key].trim()
                    this.validateForm.patchValue(temp)
                }
            } 
            this.editDone.emit(this.validateForm.value) 
            this.close()
        }
    }

    /* reset(): void {
        this.validateForm.reset()
        this.editDone.emit(this.validateForm.value) 
        this.close()
    } */

    reset(): void {
        this.validateForm.reset()
    }

    close(){
        this.visible = false 
        this.onClose.emit()
    }
}
