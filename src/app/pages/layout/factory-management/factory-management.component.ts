import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';

@Component({
  selector: 'app-factory-management',
  templateUrl: './factory-management.component.html',
  styleUrls: ['./factory-management.component.less']
})
export class FactoryManagementComponent extends ListTemplateComponent {

  constructor(public router: Router) {
    super();
    this.modularInit("layoutFactory", router.url);
  }

  ngOnInit(): void {
  }

}
