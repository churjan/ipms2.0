import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '~/shared/services/app.service';
import { CommonService } from '~/shared/services/http/common.service';
@Component({
  selector: 'app-outbound-task',
  templateUrl: './outbound-task.component.html',
  styleUrls: ['./outbound-task.component.less'],
})
export class OutboundTaskComponent implements OnInit {
  title: string;
  width: string;
  visible = false;
  record: any = {};
  validateForm!: FormGroup;

  constructor(private fb: FormBuilder, private breakpointObserver: BreakpointObserver, private appService: AppService) {
    this.validateForm = this.fb.group({
      name: [null],
      code: [null],
      control_key: [null],
      workbill_key: [null],
      psi_key: [null],
      pci_key: [null],
      psz_key: [null],
      quantity: [null],
      state: [null],
      inboundtime: [null],
      type: [null],
    });
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      if (!result.matches) {
        this.width = '1000px';
      } else {
        this.width = '100%';
      }
    });
  }

  async open(record: any = {}) {
    console.log(record);
    this.record = record;
    this.visible = true;
    this.title = this.appService.translate('placard.taskout');

    this.fillFormFields();
  }

  fillFormFields() {
    if (this.record.node) {
      const { control_key, psi_key, pci_key, psz_key, workbill_key, current_infeed_key } = this.record.node;
      this.validateForm.patchValue({
        control_key,
        psi_key,
        pci_key,
        psz_key,
        workbill_key,
        current_infeed_key,
      });
    }
  }

  close() {}
}
