import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OperationLogService } from '~/pages/system/log/operation/operationLog.service';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { DetailComponent } from './detail/detail.component';

@Component({
    selector: 'app-operation',
    templateUrl: './operation.component.html',
    styleUrls: ['./operation.component.less']
})
export class OperationComponent extends ListTemplateComponent {
    constructor(
        public router: Router,
        public operationLogService: OperationLogService
    ) {
        super();
        this.modularInit("sysLogoperation");
        this.url = router.url.replace(/\//g, "_")
        if (this.url.indexOf("_") == 0) {
          this.url = this.url.substring(1, this.url.length)
        }
    }
    @ViewChild('detail', { static: false }) _detail: DetailComponent;

    tableColumns: any[] = []


    ngOnInit(): void {
        this.tableColumns = this.operationLogService.tableColumns()
    }
    btnEvent(event) {
        switch (event.action){
        case 'Look':
            this._detail.open({ title: 'tagbind', node: event.node })
          return;
        case 'Exp':
          let params = [
            { code: 'code', value: this.SearchModel.code },
            { code: 'name', value: this.SearchModel.name }];
          super.Exp(params);
          return;
      }
      super.btnEvent(event);
    }
}
