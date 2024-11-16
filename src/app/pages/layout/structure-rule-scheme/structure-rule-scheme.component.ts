import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { EditStructureRuleSchemeComponent } from './edit-structure-rule-scheme/edit-structure-rule-scheme.component';
import { TrackConfigComponent } from './track-config/track-config.component';

@Component({
  selector: 'app-structure-rule',
  templateUrl: './structure-rule-scheme.component.html',
  styleUrls: ['./structure-rule-scheme.component.less']
})
export class StructureRuleSchemeComponent extends ListTemplateComponent {

  constructor(public router: Router) {
    super();
    this.modularInit("structureRuleScheme");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  @ViewChild('edit', { static: false }) _edit: EditStructureRuleSchemeComponent;
  @ViewChild('config', { static: false }) _config: TrackConfigComponent;


  btnEvent(event) {
    switch (event.action) {
      case 'station':
        this._config.open({ title: 'placard.config', node: event.node })
        return;
    }
    super.btnEvent(event);
  }
  openModal(model: any) {
    this._edit.open(model)
  }

}
