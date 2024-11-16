import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OutControlService } from '~/pages/warehouse/wms/outcontrol/outControl.service';

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.less']
})
export class FilterComponent implements OnInit {

    @Output() editDone = new EventEmitter<any>()
    @Output() onClose = new EventEmitter()
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    controls: any[]

    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private outControlService: OutControlService
    ) { }

    ngOnInit() {
        this.validateForm = this.fb.group({
            control_key: [null],
            name: [null],
            code: [null],
            relation_key: [null],
        })
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '340px'
            } else {
                this.width = '100%'
            }
        })
        this.outControlService.all().then((response: any) => {
            this.controls = response
        })
    }

    open(queryParams: any = {}) {
        this.validateForm.setValue({
            control_key: queryParams.control_key || null,
            name: queryParams.ssot_ordercode || null,
            code: queryParams.ssot_pickingordercode || null,
            relation_key: queryParams.ssot_pickingordercode || null
        })
        this.visible = true
    }

    submitForm(event?: KeyboardEvent) {
        if (!event || event.key == "Enter") {
            for (let key in this.validateForm.value) {
                if (typeof this.validateForm.value[key] == 'string') {
                    const temp = {}
                    temp[key] = this.validateForm.value[key].trim()
                    this.validateForm.patchValue(temp)
                }
            }
            const queryParams = this.validateForm.value
            this.editDone.emit(queryParams)
            // this.close()
        }
    }

    /* reset(): void {
        this.validateForm.reset()
        const queryParams = this.validateForm.value
        this.editDone.emit(queryParams) 
        this.close()
    } */

    reset(): void {
        this.validateForm.reset()
    }

    close() {
        this.visible = false
        this.onClose.emit()
    }
}
