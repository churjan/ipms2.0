import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { CommFlowthreeComponent } from '~/shared/common/comm-flow3/comm-flow3.component';
import { SkuProcessService } from '../../sku-process.service';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.less'],
})
export class SectionListComponent extends FormTemplateComponent {
  @Output() editDone = new EventEmitter<boolean>();
  @Output() out = new EventEmitter<any>();

  record: any = {};
  title = '';
  isVisible = false;

  popm_name = '';
  popm_key = '';
  partList = [];
  workSectionList = [];

  isBtnLoading = false;

  constructor(private sps: SkuProcessService) {
    super();
    this.modularInit('commFlow');
  }

  ngOnInit(): void {}

  open(record) {
    // console.log('section-list', record);
    this.record = record;
    this.title = this._appService.translate('btn.' + record.title);
    this.isVisible = true;

    this.popm_key = this.record.skuProcessParams.popm_key;

    if (['copy', 'edit'].includes(this.record.action)) {
      this.assignmentVal();
    } else if (this.record.action === 'add') {
      // 获取部件和工段
      this.fetchWorkSectionAndPart();
    }
  }

  assignmentVal() {
    this._service.getModel(
      'admin/OperationProcessMaster/',
      this.popm_key,
      (data) => {
        this.popm_name = data.name;
        this.partList = data.partlist;
        this.workSectionList = data.worksectionlist;
      }
    );
  }

  fetchWorkSectionAndPart() {
    this.sps.fetchWorkSectionAndPart().then((data: any) => {
      // 获取部件
      if (data?.sku_parts?.length) {
        const { name, code, key, class_code, class_name } = data.sku_parts[0];
        this.partList = [
          {
            bpi_code: code,
            bpi_name: name,
            bpi_key: key,
            bpi_class_code: class_code,
            bpi_class_name: class_name,
            bpi_ismain: true,
            bpi_sort: 1,
          },
        ];
      }

      // 获取工段
      if (data?.sku_worksections?.length) {
        const { code, name, key } = data.sku_worksections[0];
        this.workSectionList = [
          {
            bwi_code: code,
            bwi_name: name,
            bwi_key: key,
            bwi_sort: 1,
          },
        ];
      }
    });
  }

  onSubmit() {
    if (this.isBtnLoading) return;
    if (!this.popm_name) {
      this.message.error('请输入工序流名称');
      return;
    }
    this.isBtnLoading = true;

    if (this.record.action === 'copy') {
      const params = {
        key: this.popm_key,
        name: this.popm_name,
        partlist: this.partList,
        worksectionlist: this.workSectionList,
      };
      // 复制工序流
      this._service.saveModel(
        'admin/OperationProcessMaster/Extend/Copy/',
        'post',
        params,
        (new_popm_key) => {
          this.popm_key = new_popm_key;
          this.isBtnLoading = false;
          this.saveSkuProcess();
        },
        () => {
          this.isBtnLoading = false;
        }
      );
    } else {
      const params = {
        ...(this.popm_key && { key: this.popm_key }),
        name: this.popm_name,
        partlist: this.partList,
        worksectionlist: this.workSectionList,
      };
      // 生成/修改工序流
      this._service.saveModel(
        'admin/OperationProcessMaster/',
        'post',
        params,
        (popm_key) => {
          this.popm_key = popm_key;
          this.isBtnLoading = false;
          if (this.record.action === 'edit') {
            this.onBack();
          } else {
            this.saveSkuProcess();
          }
        },
        () => {
          this.isBtnLoading = false;
        }
      );
    }
  }

  saveSkuProcess() {
    const { key, condtions } = this.record.skuProcessParams;
    const params = {
      ...(key && { key }),
      popm_key: this.popm_key,
      blsd_list: condtions.blsd_list,
    };
    // sku 和工序流绑定
    this.sps.saveSkuProcess(params).then(() => {
      this.message.success(this.getTipsMsg('sucess.s_sku_binding_process'));
      this.onBack();
    });
  }

  onClose(bool = false) {
    if (bool) {
      this.editDone.emit(true);
    }
    this.isVisible = false;
    this.popm_name = '';
    this.partList = [];
    this.workSectionList = [];
  }

  onBack() {
    const record = {
      action: 'flow3',
      node: {
        popm_key: this.popm_key,
      },
    };
    this.onClose(true);
    this.out.emit(record);
  }
}
