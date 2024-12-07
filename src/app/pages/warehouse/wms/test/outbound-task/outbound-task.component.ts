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
  validateForm!: FormGroup;

  constructor(private fb: FormBuilder, private breakpointObserver: BreakpointObserver, private appService: AppService) {
    this.validateForm = this.fb.group({
      name: [null],
      code: [null],
      pwb_key: [null],
      psi_key: [null],
      pci_key: [null],
      psz_key: [null],
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
    this.visible = true;
    this.title = record.key ? this.appService.translate('btn.update') : this.appService.translate('btn.plus');
    if (record.node) {
      this.validateForm.patchValue({
        name: record.node.name,
        code: record.node.code,
        pwb_key: record.node.workbill_key,
        psi_key: record.node.psi_key,
        pci_key: record.node.pci_key,
        psz_key: record.node.psz_key,
      });
    }
  }
}
