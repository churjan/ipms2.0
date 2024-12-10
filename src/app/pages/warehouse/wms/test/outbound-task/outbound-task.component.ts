import { Component, OnInit, EventEmitter, Output, ViewChildren, QueryList } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AppService } from '~/shared/services/app.service';
import { CommonService } from '~/shared/services/http/common.service';
import { UtilService } from '~/shared/services/util.service';
import { TestService } from '../test.service';
import { TransferDirection, TransferItem } from 'ng-zorro-antd/transfer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InaSingleSelectComponent } from '~/shared/components/ina-single-select/ina-single-select.component';

@Component({
  selector: 'app-outbound-task',
  templateUrl: './outbound-task.component.html',
  styleUrls: ['./outbound-task.component.less'],
})
export class OutboundTaskComponent implements OnInit {
  @ViewChildren('customFieldsComponent') customFieldsComponents: QueryList<InaSingleSelectComponent>;
  @ViewChildren('dynamicFieldsComponent') dynamicFieldsComponents: QueryList<InaSingleSelectComponent>;
  @Output() editDone = new EventEmitter<boolean>();
  title: string;
  width: string;
  visible = false;
  record: any = {};
  validateForm!: FormGroup;
  isSubmitting = false;
  customFieldDicts = ['workbill_key', 'psi_key', 'pci_key', 'psz_key', 'current_infeed_key']; // 自定义字段字典
  dynamicFields: any[] = []; // 动态字段

  /**站位 */
  setting = {
    DataFiled: 'key',
    pKey: 'pkey',
    DataTxt: 'name',
    child: 'sonlist',
    url: 'LayoutStructure/extend',
  };
  stationRailtree = { maketree: true, moduletype: 101 };
  transferData: TransferItem[] = [];
  $asTransferItems = (data: unknown) => data as TransferItem[];
  stationType = ''; // 站位类型

  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private appService: AppService,
    private commonService: CommonService,
    private Service: UtilService,
    private ts: TestService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      name: [null, Validators.required],
      code: [null, Validators.required],
      control_key: [null, Validators.required],
      quantity: [null],
      state: [null],
      inboundtime: [null],
      type: [null],
      // isbox: [null],
      // box_number: [null],
    });
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      if (!result.matches) {
        this.width = '1200px';
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

    // 仓库控制
    const timestamp = new Date().getTime().toString()
    this.validateForm.patchValue({
      name:timestamp,
      code:timestamp,
      control_key: this.record.node.control_key,
    });
    this.createAndFillCustomFormFields();
    this.createDynamicFields();
    this.fetchStationList();
  }

  // 创建和填充自定义表单字段
  createAndFillCustomFormFields() {
    this.customFieldDicts.forEach((item) => {
      this.validateForm.addControl(item, new FormControl({value: null, disabled: true}));
      this.validateForm.patchValue({
        [item]: this.record.node[item],
      });
    });
  }

  // 创建动态表单字段
  createDynamicFields() {
    this.ts.fetchDynamicFields().then((data: any) => {
      this.dynamicFields = data;
      this.dynamicFields.forEach((item) => {
        this.validateForm.addControl(item.field, new FormControl(null));
      });
    });
  }

  // 自定义字段参数
  customFieldsParams(rawFormValue) {
    const conditions = [];
    this.customFieldDicts.forEach((item, index) => {
      const value = this.validateForm.getRawValue()[item];
      if (!value) {
        delete rawFormValue[item];
        return;
      }
      const selectedValueObj = this.customFieldsComponents.toArray()[index].selectedValueObj;
      const tempObj = {
        code: item,
        value: this.record.node[item],
        value_name: selectedValueObj.name || selectedValueObj.description || selectedValueObj.code,
      };
      conditions.push(tempObj);
      delete rawFormValue[item];
    });

    return conditions;
  }

  // 动态字段参数
  dynamicFieldsParams(rawFormValue) {
    const attributes = [];
    this.dynamicFields.forEach((item, index) => {
      const value = this.validateForm.getRawValue()[item.field];
      if (!value) {
        delete rawFormValue[item.field];
        return;
      }
      const selectedValueObj = this.dynamicFieldsComponents.toArray()[index].selectedValueObj;
      let tempObj = null;
      if (['input', 'judgment-input'].includes(item.optionmode)) {
        tempObj = {
          code: item.field,
          name: item.name,
          value,
        };
      } else if (item.optionmode === 'extendselect') {
        tempObj = {
          code: item.field,
          name: item.name,
          value,
          value_name: selectedValueObj.name,
        };
      } else if (item.optionmode === 'enumselect') {
        tempObj = {
          code: item.field,
          name: item.name,
          value,
          value_name: selectedValueObj.description,
        };
      } else if (item.optionmode === 'customselect') {
        tempObj = {
          code: item.field,
          name: item.name,
          value,
          value_name: selectedValueObj.name,
        };
      } else if (item.optionmode === 'select') {
        tempObj = {
          code: item.field,
          name: item.name,
          value,
          value_name: selectedValueObj.name,
        };
      }
      attributes.push(tempObj);
      delete rawFormValue[item.field];
    });

    return attributes;
  }

  // 获取站位类型
  fetchStationList() {
    this.Service.comList('classdata', { pcode: 'outtimerroute' }).then((response) => {
      this.stationType = response.data[0].code;
    });
  }

  onSelectStation(e) {
    this.commonService
      .structures({
        path: e.key,
        blst_group: 'In',
        stationtype: this.stationType,
      })
      .then((data: any) => {
        const leftTransferData = [];
        const rightTransferData = this.transferData.filter((item) => item.direction === 'right');
        const rightKeysSet = new Set(rightTransferData.map((item) => item.bls_key));
        data.forEach((item) => {
          if (!rightKeysSet.has(item.key)) {
            leftTransferData.push({
              station_name: item.pname,
              bls_code: item.code,
              bls_key: item.key,
              bls_name: item.name,
              direction: 'left',
            });
            this.transferData = [...leftTransferData, ...rightTransferData];
          }
        });
      });
  }

  close() {
    this.visible = false;
    this.validateForm.reset();
  }

  onSubmit() {
    if (this.isSubmitting) return;
    if (!this.validateForm.valid) {
      this.markControlsDirty(this.validateForm);
      return;
    }
    const rawFormValue = this.validateForm.getRawValue();
    const stationSelected = this.transferData
      .filter((x) => x.direction === 'right')
      .map((x) => ({
        bls_code: x.bls_code,
        bls_key: x.bls_key,
        bls_name: x.bls_name,
      }));
    const params = {
      conditions: this.customFieldsParams(rawFormValue),
      attributes: this.dynamicFieldsParams(rawFormValue),
      ...rawFormValue,
      routes: stationSelected,
    };
    console.log(params);
    return
    this.isSubmitting = true;
    this.ts
      .submitData(params)
      .then(() => {
        this.editDone.emit(true);
        this.visible = false;
        this.message.success(this.appService.translate('sucess.s_save'));
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  markControlsDirty(group: FormGroup | FormArray): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];

      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        this.markControlsDirty(abstractControl);
      } else {
        abstractControl.markAsDirty();
        abstractControl.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
}
