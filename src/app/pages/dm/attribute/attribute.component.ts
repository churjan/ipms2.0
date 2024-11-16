import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { CrudComponent } from "~/shared/common/crud/crud.component";
import { EditComponent } from "./edit/edit.component";

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.less']
})
export class AttributeComponent extends ListTemplateComponent {
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('edit', { static: false }) _edit: EditComponent;
  selcet: any = {}
  constructor(public router: Router,) {
    super();
    this.modularInit("basAttribute", router.url);
  }

  ngOnInit(): void {
  }
  onclick(ev) {
    if (ev) { this._crud.SearchModel.code = ev.code; this.selcet = ev } else {
      this._crud.SearchModel.code = ''; this.selcet = {}
    }
    this._crud.Search()
  }
  openModal(model: any) {
    if (this._crud.SearchModel.code) {
      if (!model.node) { model.node = {} }
      model.node.code = this.selcet.code ? this.selcet.code : ''
      model.node.name = this.selcet.name ? this.selcet.name : ''
    }
    this._edit.open(model)
  }

}