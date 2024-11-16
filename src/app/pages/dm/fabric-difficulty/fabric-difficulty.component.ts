import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { EditFabricDifficultyComponent } from './edit-fabric-difficulty/edit-fabric-difficulty.component';
import { ViewFabricDifficultyComponent } from './view-fabric-difficulty/view-fabric-difficulty.component';

@Component({
  selector: 'app-fabric-difficulty',
  templateUrl: './fabric-difficulty.component.html',
  styleUrls: ['./fabric-difficulty.component.less']
})
export class FabricDifficultyComponent extends ListTemplateComponent {
  @ViewChild('edit', { static: false }) _edit: EditFabricDifficultyComponent;
  @ViewChild('view', { static: false }) _view: ViewFabricDifficultyComponent;

  constructor(public router: Router,) {
    super();
    this.modularInit("basFabric-difficulty");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
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
