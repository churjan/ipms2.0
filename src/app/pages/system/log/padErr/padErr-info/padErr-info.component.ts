import { Component } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';

@Component({
  selector: 'app-padErr-info',
  templateUrl: './padErr-info.component.html',
  styleUrls: ['./padErr-info.component.less']
})
export class PadErrInfoComponent extends FormTemplateComponent {

  constructor() { super(); }

  ngOnInit() { }
  async open(record: any) {
    this.title = this._appService.translate(record.title)
    this.model = record.node;
    this.visible = true
  }
  JsonFormat(data, typle = 'JSON') { return data ? data : null; }
  close(): void {
    this.avatar = null
    this.visible = false
  }
}
