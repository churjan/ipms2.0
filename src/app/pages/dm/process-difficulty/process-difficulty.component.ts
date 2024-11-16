import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { EditProcessDifficultyComponent } from './edit-process-difficulty/edit-process-difficulty.component';
import { ViewProcessDifficultyComponent } from './view-process-difficulty/view-process-difficulty.component';

@Component({
  selector: 'app-process-difficulty',
  templateUrl: './process-difficulty.component.html',
  styleUrls: ['./process-difficulty.component.less']
})
export class ProcessDifficultyComponent  extends ListTemplateComponent  {
  constructor(public router: Router,) {
    super();
    this.modularInit("bas-processlevel");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  @ViewChild('edit', { static: false }) _edit: EditProcessDifficultyComponent;
  @ViewChild('view', { static: false }) _view: ViewProcessDifficultyComponent;

  btnEvent(event) {
    switch (event.action) {
      case 'Look':
        this._view.open({ title: 'see', node: event.node })
        return;
    }
    super.btnEvent(event);
  }
  openModal(model: any) {
    // this._edit.open(model)
  }
}
