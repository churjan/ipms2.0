import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { EditPartSingletonPOComponent } from "./edit/edit-PartSingletonPO.component";

@Component({
    selector: 'app-PartSingleton-PO',
    templateUrl: './PartSingletonPO.component.html',
    styleUrls: ['./PartSingletonPO.component.less']
})
export class PartSingletonPOComponent extends ListTemplateComponent {

    constructor(public router: Router) {
        super();
        this.modularInit("basPartsingleton");
        this.url = router.url.replace(/\//g, "_")
        if (this.url.indexOf("_") == 0) {
            this.url = this.url.substring(1, this.url.length)
        }
    }
    @ViewChild('edit', { static: false }) _edit: EditPartSingletonPOComponent;
    btnEvent(event) {
      switch (event.action) {
        case 'Look':
        //   this._view.open({ title: 'see', node: event.node })
          return;
      }
      super.btnEvent(event);
    }
    openModal(model: any) {
      this._edit.open(model)
    }
}