import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '~/shared/services/app.service';
import { TestService } from '../test.service';
import { InaSingleSelectComponent } from '~/shared/components/ina-single-select/ina-single-select.component';

@Component({
  selector: 'app-outbound-task',
  templateUrl: './outbound-task.component.html',
  styleUrls: ['./outbound-task.component.less'],
})
export class OutboundTaskComponent implements OnInit {
  @ViewChildren('customFieldsComponent') customFieldsComponents: QueryList<InaSingleSelectComponent>;
  @ViewChildren('dynamicFieldsComponent') dynamicFieldsComponents: QueryList<InaSingleSelectComponent>;
  title: string;
  width: string;
  visible = false;
  record: any = {};
  validateForm!: FormGroup;
  customFieldDicts = ['workbill_key', 'psi_key', 'pci_key', 'psz_key', 'current_infeed_key']; // 自定义字段字典
  dynamicFields: any[] = []; // 动态字段

  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private appService: AppService,
    private ts: TestService
  ) {
    this.validateForm = this.fb.group({
      name: [null],
      code: [null],
      control_key: [null],
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

    // 仓库控制
    this.validateForm.patchValue({
      control_key: this.record.node.control_key,
    });
    this.createAndFillCustomFormFields();
    this.createDynamicFields();
  }

  // 创建和填充自定义表单字段
  createAndFillCustomFormFields() {
    this.customFieldDicts.forEach((item) => {
      this.validateForm.addControl(item, new FormControl(null));
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
      const value = this.validateForm.value[item];
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
      const value = this.validateForm.value[item.field];
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

  close() {
    this.visible = false;
  }

  onSubmitForm() {
    const rawFormValue = this.validateForm.getRawValue();
    const params = {
      conditions: this.customFieldsParams(rawFormValue),
      attributes: this.dynamicFieldsParams(rawFormValue),
      ...rawFormValue,
    };
    console.log(params);
  }
}
