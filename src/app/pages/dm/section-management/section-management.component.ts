import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { EditSectionComponent } from './edit-section-management/edit-section-management.component';
import { ViewSectionManagementComponent } from './view-section-management/view-section-management.component';

@Component({
  selector: 'app-section-management',
  templateUrl: './section-management.component.html',
  styleUrls: ['./section-management.component.less']
})
export class SectionManagementComponent extends ListTemplateComponent {

  constructor(public router: Router) {
    super();
    this.modularInit("basWorksection");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  @ViewChild('edit', { static: false }) _edit: EditSectionComponent;
  @ViewChild('view', { static: false }) _view: ViewSectionManagementComponent;

  btnEvent(event) {
    switch (event.action) {
      case 'Look':
        this._view.open({ title: 'see', node: event.node })
        return;
    }
    super.btnEvent(event);
  }
  openModal(model: any) {
    this._edit.open(model)
  }

}
