import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { AppService } from '~/shared/services/app.service';
import { SkuProcessService } from '../sku-process.service';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { SectionListComponent } from './section-list/section-list.component';
@Component({
  selector: 'app-edit-sku-process',
  templateUrl: './edit-sku-process.component.html',
  styleUrls: ['./edit-sku-process.component.less'],
})
export class EditSkuProcessComponent extends FormTemplateComponent {
  @ViewChild('skuCondition') skuConditionRef;
  @ViewChild('sectionList') sectionListRef: SectionListComponent;

  @Output() editDone = new EventEmitter<boolean>();
  @Output() out = new EventEmitter<any>();
  record: any = {};
  title = '';
  isVisible = false;

  // 工序流列表
  skuList = [];
  selectedRowKey: string | null = null;
  page = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    loading: false,
  };

  isBtnLoading = false;

  subscription$;

  constructor(private appService: AppService, private sps: SkuProcessService) {
    super();
    this.modularInit('commFlow');
  }

  ngOnInit(): void {
    this.subscription$ = this.sps.subscription$.subscribe(() => {
      this.onClose(true);
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  open(record) {
    this.record = record;
    this.title = this.appService.translate('btn.' + record.title);
    this.isVisible = true;
    if (record.node) {
      this.sps.viewSkuProcess(record.node.key).then((data: any) => {
        this.record.data = data;
        // 初始化
        this.skuConditionRef.initVal();

        this.selectedRowKey = data.popm_key;
        this.skuList.forEach((item) => {
          item.checked = item.popm_key === this.selectedRowKey;
        });
      });
    }
  }

  onQueryParamsChange(params) {
    const { pageIndex, pageSize } = params;
    this.page.pageIndex = pageIndex;
    this.page.pageSize = pageSize;
    this.fetchList();
  }

  fetchList() {
    this.page.loading = true;
    const params = {
      page: this.page.pageIndex,
      pagesize: this.page.pageSize,
    };
    this.sps
      .fetchSkuList(params)
      .then((res: any) => {
        this.skuList = res.data;
        this.page.total = res.total;
        this.skuList.forEach((item) => {
          item.checked = item.popm_key === this.selectedRowKey;
        });
      })
      .finally(() => {
        this.page.loading = false;
      });
  }

  onSelectRow(rowDataKey: string): void {
    this.selectedRowKey = rowDataKey;
    this.skuList.forEach((item) => {
      item.checked = item.popm_key === rowDataKey;
    });
  }

  // 新增工序流
  onOperateProcessFlow(data) {
    const valid = this.skuConditionRef.checkValid();
    if (!valid) return;

    const { operateType, item } = data;

    if (operateType === 'add') {
      const record = {
        title: 'plus',
        action:'add',
        skuProcessParams: {
          ...(this.record.node && { key: this.record.node.key }),
          condtions: valid,
        },
        fromPage: 'editSkuProcess',
      };
      this.sectionListRef.open(record);
    } else if (operateType === 'preview') {
      const record = {
        title: 'preview',
        action: 'preview',
        skuProcessParams: {
          ...(this.record.node && { key: this.record.node.key }),
          condtions: valid,
          popm_key:item.popm_key,
          popm_name:item.popm_name,
        },
        node: {
          key: item.popm_key,
          name: item.popm_name,
        },
        fromPage: 'skuProcess',
      };
      this.out.emit(record);
    } else if (operateType === 'copy') {
      const record = {
        title: 'copy',
        action:'copy',
        skuProcessParams: {
          ...(this.record.node && { key: this.record.node.key }),
          popm_name: data.item.popm_name,
          popm_key: data.item.popm_key,
          condtions: valid,
        },
        fromPage: 'editSkuProcess',
      };
      this.sectionListRef.open(record);
    }
  }

  onClose(bool = false) {
    this.editDone.emit(bool);
    this.resetVal();
  }

  onOut(e) {
    this.out.emit(e);
  }

  resetVal() {
    this.isVisible = false;
    this.record = {};
    this.skuList = [];
    this.selectedRowKey = null;
    this.page = {
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      loading: false,
    };
  }

  onSubmit() {
    if (this.isBtnLoading) return;

    // 校验
    const valid = this.skuConditionRef.checkValid();
    if (!valid) return;
    if (!this.selectedRowKey) {
      this.message.warning(this.appService.translate('warning.CPWRM'));
      return;
    }

    const params = {
      ...(this.record.node && { key: this.record.node.key }),
      popm_key: this.selectedRowKey,
      blsd_list: valid.blsd_list,
    };
    this.sps
      .saveSkuProcess(params)
      .then(() => {
        this.message.success(this.appService.translate('sucess.s_save'));
        this.onClose(true);
      })
      .finally(() => {
        this.isBtnLoading = false;
      });
  }
}
