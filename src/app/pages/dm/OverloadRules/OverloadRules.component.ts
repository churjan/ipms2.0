import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';

@Component({
  selector: 'app-OverloadRules',
  templateUrl: './OverloadRules.component.html',
  styleUrls: ['./OverloadRules.component.less']
})
export class OverloadRulesComponent extends ListTemplateComponent {

  constructor(public router: Router) {
    super();
    this.modularInit("basOverloadRules",router.url);
  }
  setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', child: 'sonlist', url: 'LayoutStructure/extend' }

  btnEvent(event) {
    super.btnEvent(event);
  }

}
