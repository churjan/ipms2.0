import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StockService } from '~/pages/warehouse/wms/stock/stock.service';
import { AppService } from '~/shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'caltime-stock',
  templateUrl: './caltime.component.html',
  styleUrls: ['./caltime.component.less']
})
export class CaltimeComponent implements OnInit {

  @Output() editDone = new EventEmitter<any>() 
  width: string
  visible: boolean = false
  validateForm!: FormGroup
  queryByParams:object=null
  relTime: any
 
  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private message: NzMessageService,
    private stockService: StockService,
    private appService: AppService
    ) { }


    ngOnInit() {
      this.validateForm = this.fb.group({
          quantity: [null, [Validators.required]]
      }) 
      this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
          if(!result.matches){
              this.width = '300px'
          }else{
              this.width = '100%'
          }
      })
  }
  open(queryByParams:object) {
    this.relTime=""
    this.queryByParams=queryByParams
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
      for (const i in this.validateForm.controls) {
          if (this.validateForm.controls.hasOwnProperty(i)) {
              this.validateForm.controls[i].markAsDirty()
              this.validateForm.controls[i].updateValueAndValidity()
          }
      }
      if (!this.validateForm.valid) {
          return false
      }

      const formData: any = this.validateForm.value

      const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId

      this.queryByParams = Object.assign(this.queryByParams, {quantity:formData.quantity})
      this.stockService.clatimeurl(this.queryByParams).then(response => {
        this.relTime=response
      //  this.close()
    }).finally(() =>{
        this.message.remove(msgId)
    })
      
  
  }
}

close(): void {
  this.validateForm.reset()
  this.visible = false
}

}
