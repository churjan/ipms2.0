import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { PadErrInfoComponent } from './padErr-info/padErr-info.component';
declare var $: any;
@Component({
  selector: 'app-padErr',
  templateUrl: './padErr.component.html',
  styleUrls: ['./padErr.component.less']
})
export class PadErrComponent extends ListTemplateComponent {

  constructor(public router: Router, private fb: FormBuilder) {
    super(); this.modularInit("sysLogrun");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  @ViewChild('edit', { static: false }) _edit: PadErrInfoComponent;
  ngOnInit(): void { }
  btnEvent(event) {
    switch (event.action) {
      case 'Look':
        this._edit.open({ title: 'btn.see', node: event.node })
        return;
      case 'Exp':
        let _SearchModel = Object.assign({}, this.SearchModel, this.seniorModel);
        super.Exp(_SearchModel);
        return;
    }
    super.btnEvent(event);
  }
}
