import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '~/pages/system/role/role.service';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { EditComponent } from './edit/edit.component';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.less']
})
export class RoleComponent extends ListTemplateComponent {
    @ViewChild('edit', { static: false }) _edit: EditComponent;

    tableColumns: any[] = []

    constructor(public router: Router,
        public roleService: RoleService
    ) {
        super();
        this.modularInit("sysRole");
        this.url = router.url.replace(/\//g, "_")
        if (this.url.indexOf("_") == 0) {
          this.url = this.url.substring(1, this.url.length)
        }
    }

    ngOnInit(): void {
        this.tableColumns = this.roleService.tableColumns()
    }
    openModal(model: any) {
      this._edit.open(model)
    }

}
