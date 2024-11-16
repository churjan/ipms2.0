import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StatisticsinService } from '~/pages/warehouse/wms/statisticsin/statisticsin.service';
import * as moment from "moment"

@Component({
  selector: 'statisticsin-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.less']
})
export class SyncComponent implements OnInit {

    @Output() editDone = new EventEmitter<any>() 
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    blsKey: string = null
    queryByParams:object=null

    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private message: NzMessageService,
        public statisticsinService: StatisticsinService,
        private appService: AppService
        ) { }

    ngOnInit() {
        this.validateForm = this.fb.group({
          dateRange: [null, [Validators.required]]
        }) 
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if(!result.matches){
                this.width = '500px'
            }else{
                this.width = '100%'
            }
        })
    }

    open() {
        this.visible = true
    }
    
    submitForm(event? :KeyboardEvent) {
      if(!event || event.key == "Enter")
      {  
        for (const i in this.validateForm.controls) 
        {
          if (this.validateForm.controls.hasOwnProperty(i)) 
          {
              this.validateForm.controls[i].markAsDirty()
              this.validateForm.controls[i].updateValueAndValidity()
          }
        }
      if (!this.validateForm.valid) 
      {
          return false
      }
      const validateForm = this.validateForm.value
      const start_time = moment(validateForm.dateRange[0]).format("YYYY-MM-DD")
      const end_time = moment(validateForm.dateRange[1]).format("YYYY-MM-DD")
      this.statisticsinService.sync({Start_Time:start_time,End_Time:end_time})

      this.close()
    }
  }

    close(): void {
        this.validateForm.reset()
        this.visible = false
    }
  }