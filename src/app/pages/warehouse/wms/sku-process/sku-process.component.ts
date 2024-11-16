import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CommFlowthreeComponent } from '~/shared/common/comm-flow3/comm-flow3.component';
import { SectionListComponent } from './edit-sku-process/section-list/section-list.component';
@Component({
  selector: 'app-sku-process',
  templateUrl: './sku-process.component.html',
  styleUrls: ['./sku-process.component.less'],
})
export class SkuProcessComponent extends ListTemplateComponent {
  @ViewChild('flowLamination') _flowLamination;
  @ViewChild('flow3') _flow3: CommFlowthreeComponent;
  @ViewChild('sectionList') sectionListRef: SectionListComponent;

  @ViewChild('edit') editRef;

  constructor(public router: Router) {
    super();
    this.modularInit('wmsSkuprocess');
    this.url = router.url.replace(/^\//, '').replace(/\//g, '_');
  }

  ngOnInit(): void {}

  btnEvent(event) {
    super.btnEvent(event);
    switch (event.action) {
      case 'flow3':
        const { popm_key } = event.node;
        this._service.getModel(
          'admin/OperationProcessMaster/',
          popm_key,
          (data) => {
            const { key, name, worksectionlist } = data;
            const record = {
              title: 'PWRM',
              node: {
                key,
                name,
                bwi_key: worksectionlist[0]?.bwi_key,
              },
              power: {
                Iscopy: true,
                IsUpdate: true,
                wages: true,
                flowpower: true,
                mappower: true,
              },
              worksectionlist,
              fromPage: 'skuProcess',
            };
            this._flow3.open(record);
          }
        );
        return;
      case 'return':
        const record = {
          title: 'PWRM',
          skuProcessParams: {
            popm_key: event.node.node.key,
            popm_name: event.node.node.name,
          },
          fromPage: 'flow3',
          action: 'edit',
        };
        this.sectionListRef.open(record);
        return;
      case 'copy':
        this.sectionListRef.open(event);
        return;
      case 'preview':
        this._flow3.open(event);
        return;
    }
  }

  openModal(model: any) {
    this.editRef.open(model);
  }
}
