import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ParameterService } from '~/pages/system/parameter/parameter.service';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { EditComponent } from './edit/edit.component';

@Component({
    selector: 'app-parameter',
    templateUrl: './parameter.component.html',
    styleUrls: ['./parameter.component.less']
})
export class ParameterComponent extends ListTemplateComponent {
    @ViewChild('edit', { static: false }) _edit: EditComponent;

    // tableColumns: any[] = []
  options: any[] = [];

    constructor(
        public parameterService: ParameterService,
        public router: Router,
    ) {
        super()
        this.modularInit("sysParameters");
        this.url = router.url.replace(/\//g, "_")
        if (this.url.indexOf("_") == 0) {
          this.url = this.url.substring(1, this.url.length)
        }
    }

    ngOnInit(): void {
        this._service.comList('Enum', { method: 'systemparametertype' }).then((v) => {
          this.options = v;
        })
        // this.tableColumns = this.parameterService.tableColumns()
    }

    openModal(model: any) {
      this._edit.open(model)
    }
}
