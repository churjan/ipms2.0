import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { AppService } from '~/shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-sku-condition',
  templateUrl: './sku-condition.component.html',
  styleUrls: ['./sku-condition.component.less'],
})
export class SkuConditionComponent implements OnInit {
  form!: FormGroup;
  @Input() record: any;

  get blsd_list(): FormArray {
    return this.form.get('blsd_list') as FormArray;
  }

  // blsr_key:布局结构规则方案Key

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      blsd_list: this.fb.array([]),
    });
  }

  ngOnInit(): void {}

  initVal() {
    const rule_details = this.record.data.rule_details;
    const blsd_list = [];
    rule_details.forEach((item) => {
      this.blsd_list.push(this.newProjectPlan());

      let values;
      if (item.optionmode === 'select') {
        values = {
          value: item.value,
          name: item.value_name,
        };
      } else if (item.optionmode === 'extendselect') {
        values = {
          value: item.value,
          description: item.value_name,
        };
      } else if (item.optionmode === 'enumselect') {
        values = {
          value: Number(item.value),
          description: item.value_name,
        };
      } else if (item.optionmode === 'customselect') {
        values = {
          value: item.value,
          name: item.value_name,
          valueslist: item.optionvalue ? JSON.parse(item.optionvalue) : [],
        };
      } else if (item.optionmode.includes('input')) {
        values = item.value;
      }
      blsd_list.push({
        condition: {
          ...item,
          main_key: item.key,
          key: item.blr_key,
          name: item.blr_name,
          inputtype:
            item.value === 'true' || item.value === 'false'
              ? 'Bool'
              : typeof item.value === 'number'
              ? 'Int'
              : typeof item.value === 'string'
              ? 'String'
              : 'null',
        },
        comparetype: item.comparetype,
        value: values.value ? values.value : values,
        value_name: values.name ? values.name : '',
        valueslist: values.valueslist ? values.valueslist : [],
      });
    });
    this.form.patchValue({
      blsd_list,
    });
  }

  newProjectPlan(): FormGroup {
    return this.fb.group({
      condition: [null, [Validators.required]],
      comparetype: ['=', [Validators.required]],
      value: [null, [Validators.required]],
      value_name: [null],
      valueslist: [null],
    });
  }

  onAddFiled() {
    this.blsd_list.push(this.newProjectPlan());
  }

  onRemoveFiled(i) {
    this.blsd_list.removeAt(i);
  }

  onConditionChange(i) {
    this.blsd_list.at(i).patchValue({
      comparetype: '=',
      value: null,
    });
    setTimeout(() => {
      this.blsd_list.at(i).markAsPristine();
      this.blsd_list.at(i).updateValueAndValidity();
    }, 0);
  }

  markControlsDirty(group: FormGroup | FormArray): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];
      if (
        abstractControl instanceof FormGroup ||
        abstractControl instanceof FormArray
      ) {
        this.markControlsDirty(abstractControl);
      } else {
        abstractControl.markAsDirty();
        abstractControl.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  checkValid() {
    if (this.form.valid) {
      const { blsd_list } = this.form.value;
      // if (!blsd_list.length) {
      //   this.message.warning(this.appService.translate('warning.noCondition'));
      //   return;
      // }
      const params = {
        blsd_list: [],
      };
      blsd_list.forEach(({ comparetype, condition, value, value_name }) => {
        params.blsd_list.push({
          blr_key: condition.key,
          blr_name: condition.name,
          optionmode: condition.optionmode,
          optionvalue: condition.optionvalue,
          comparetype,
          value,
          value_name,
          ...(condition.main_key && { key: condition.main_key }),
          ...(this.record.data && { blsr_key: this.record.data.blsr_key }),
        });
      });
      return params;
    } else {
      this.markControlsDirty(this.form);
      return false;
    }
  }
}
