import { EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { CommonService } from '~/shared/services/http/common.service';
import { OutControlTaskService } from '~/pages/warehouse/wms/outtask/outControlTask.service';
import { TransferDirection, TransferItem } from 'ng-zorro-antd/transfer';
import { UtilService } from '~/shared/services/util.service';
import { InaSingleSelectComponent } from '~/shared/components/ina-single-select/ina-single-select.component';
@Component({
  selector: 'task-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class EditComponent implements OnInit {
  @ViewChildren('customComponent') customComponents: QueryList<InaSingleSelectComponent>;
  @Output() editDone = new EventEmitter<boolean>();

  title: string;
  width: string;
  visible: boolean = false;
  validateForm!: FormGroup;
  submiting: boolean = false;
  key: string;
  transferData: TransferItem[] = [];
  $asTransferItems = (data: unknown) => data as TransferItem[];
  /**布局结构参数 */
  setting = {
    DataFiled: 'key',
    pKey: 'pkey',
    DataTxt: 'name',
    child: 'sonlist',
    url: 'LayoutStructure/extend',
  };
  /**树状站位筛选条件 */
  stationRailtree = { maketree: true, moduletype: 101 };
  stationType = ''; // 站位类型

  customFields: any[] = []; // 自定义字段
  constructor(
    private fb: FormBuilder,
    private outControlTaskService: OutControlTaskService,
    private breakpointObserver: BreakpointObserver,
    private appService: AppService,
    private commonService: CommonService,
    private Service: UtilService
  ) {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      control_key: [null, [Validators.required]],
      relation_key: [null, [Validators.required]],
      quantity: [null],
      state: [null],
      inboundtime: [null, Validators.compose([Validators.min(0), Validators.pattern('^(?!0$).*')])],
      type: [null],
    });
  }

  async ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      if (!result.matches) {
        this.width = '1000px';
      } else {
        this.width = '100%';
      }
    });
  }

  async open(record: any = {}) {
    // 站位类型
    await this.Service.comList('classdata', { pcode: 'outtimerroute' }).then((response) => {
      this.stationType = response.data[0].code;
    });
    this.title = record.key ? this.appService.translate('btn.update') : this.appService.translate('btn.plus');

    // 自定义字段构建表单
    await this.outControlTaskService.fetchCustomFields().then((data: any) => {
      this.customFields = data;
      this.customFields.forEach((item) => {
        this.validateForm.addControl(item.field, new FormControl(null));
      });
    });

    if (record.key) {
      // 编辑状态下禁止修改
      ['name', 'control_key', 'relation_key', 'code'].forEach((controlName) => {
        this.validateForm.get(controlName).disable();
      });

      this.key = record.key;
      await this.outControlTaskService.getModel(this.key).then((data: any) => {
        this.validateForm.patchValue({
          name: data.name,
          code: data.code,
          control_key: data.control_key,
          relation_key: data.relation_key,
          quantity: data.quantity ?? 0,
          state: data.state.toString(),
          inboundtime: data.inboundtime,
          type: data.type.toString(),
        });

        // 自定义属性
        data.attributes.forEach((item) => {
          this.validateForm.patchValue({
            [item.code]: item.value,
          });
        });

        const rightTransferData = [];
        data.routes.forEach((item) => {
          rightTransferData.push({
            station_name: item.station_name,
            bls_code: item.bls_code,
            bls_key: item.bls_key,
            bls_name: item.bls_name,
            direction: 'right',
          });
        });
        this.transferData = rightTransferData;
      });
    }

    this.visible = true;
  }

  onSelectStation(ev) {
    if (ev) {
      this.commonService
        .structures({
          path: ev.key,
          blst_group: 'In',
          stationtype: this.stationType,
        })
        .then((data: any) => {
          const leftTransferData = [];
          const rightTransferData = this.transferData.filter((item) => item.direction === 'right');
          const rightTransferDataSet = new Set(rightTransferData.map((item) => item.bls_key));
          data.forEach((item) => {
            if (!rightTransferDataSet.has(item.key)) {
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
  }

  filterOption(inputValue: string, item: any): boolean {
    return (
      item.station_name.indexOf(inputValue) > -1 ||
      item.bls_name.indexOf(inputValue) > -1 ||
      item.bls_code.indexOf(inputValue) > -1
    );
  }

  submitForm(event?: KeyboardEvent) {
    if (this.submiting) return false;

    if (!event || event.key == 'Enter') {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      if (this.validateForm.status != 'VALID') return;

      for (const i in this.validateForm.controls) {
        if (this.validateForm.controls.hasOwnProperty(i)) {
          this.validateForm.controls[i].markAsDirty();
          this.validateForm.controls[i].updateValueAndValidity();
        }
      }
      if (!this.validateForm.valid) {
        return false;
      }

      const stationSelected = this.transferData
        .filter((x) => x.direction === 'right')
        .map((x) => ({
          bls_code: x.bls_code,
          bls_key: x.bls_key,
          bls_name: x.bls_name,
        }));

      // 自定义属性
      const rawFormValue = this.validateForm.getRawValue();
      const attributes = [];
      this.customFields.forEach((item, index) => {
        const value = this.validateForm.value[item.field];
        if (!value) {
          delete rawFormValue[item.field];
          return;
        }
        const selectedValueObj = this.customComponents.toArray()[index].selectedValueObj;
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

      const extraData = {
        ...rawFormValue,
        attributes,
        routes: stationSelected,
      };
      this.submiting = true;
      this.appService
        .formSubmit(null, this.outControlTaskService, this.key, extraData)
        .then(() => {
          this.editDone.emit(this.key ? false : true);
          this.close();
        })
        .finally(() => {
          this.submiting = false;
        });
    }
  }

  close(): void {
    this.visible = false;

    this.key = null;
    this.validateForm.reset();
    this.transferData = [];

    ['name', 'control_key', 'relation_key', 'code'].forEach((controlName) => {
      this.validateForm.get(controlName).enable();
    });
  }
}
