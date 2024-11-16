import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { EditComponent } from './edit/edit.component';
declare var $: any;
@Component({
  selector: 'Virtual_Layout',
  templateUrl: './Virtual_Layout.component.html',
  styleUrls: ['./Virtual_Layout.component.css']
})
export class VirtualLayoutComponent extends ListTemplateComponent {
  @ViewChild('edit', { static: false }) _edit: EditComponent;

  url: string = '';
  constructor(public router: Router, private fb: FormBuilder,) {
    super();
    this.modularInit("layoutVirtual");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  multikey: string = '';
  isReset: boolean;
  issearch: boolean = false;
  btnEvent(event) {
    super.btnEvent(event);
  }
  openModal(model: any) {
    this._edit.open(model)
  }
  ngOnInit(): void {
  }
}
