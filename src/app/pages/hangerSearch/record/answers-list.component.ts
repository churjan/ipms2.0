import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
declare var $: any;
export interface DialogData { key: any; }
@Component({
  selector: 'answers',
  templateUrl: './answers-list.component.html',
  styleUrls: ['./answers-list.component.css']
})
export class AnswersListComponent extends FormTemplateComponent {
  constructor() {
    super();
  }
  // tipList = AppConfig.tipsMsg;
  // 按钮注解
  // buttonList = AppConfig.buttonList;
  // hangermodular = AppConfig.hanger;
  // fields: any = {};
  // key = this.data.key;
  // model: any;
  list: any;
  // quality: string[] = ['poi_code', 'poi_name', 'date_back', 'question', 'answer', 'qcvalue', 'decisionresult', 'handlemethod']
  ngOnInit() { this.otherUrl = this.modular.otherUrl; }
  async open(record: any) {
    this.title = this._appService.translate('btn.' + record.title);
    if (record.node ) {
      this.list = record.node;
    } else {
      this.key = null
    }
    this.visible = true
  }
  close(): void {
    this.avatar = null
    this.visible = false
  }

}
