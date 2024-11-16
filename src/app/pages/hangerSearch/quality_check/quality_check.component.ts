import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
declare var $: any;

@Component({
  selector: 'quality_check',
  templateUrl: './quality_check.component.html',
  styleUrls: ['./quality_check.component.less']
})
export class QualityCheckComponent implements OnInit {
  constructor() {
    document.title = window.localStorage.sysName;
  }
  @Output() editDone = new EventEmitter<boolean>()
  @Input() ComponentParam: any;
  project = sessionStorage.project;
  @Input() modular;
  transfer = [];
  field: any[] = [];
  model: any = { hangerid: '' };
  @Input() oplist: any = [];
  @Input() historylist: any[] = [];;
  siblist: any[] = [];
  siblings = [];
  @Input() quality: any[] = [];
  @Input() tracking: any;
  tag: any = { pwb_key: '' };
  show = 0;
  data: any = {};
  isShowRouter = false;
  isChange: any;
  seachhanger: string = '';
  sibtyle: number = 1;
  fields: any = {};
  selectedIndex = 1;
  ngOnInit() { }
  qualitytitle(coums, data) {
    if (coums.type == 'object') {
      let type = 'object'
      let title = data[coums.detail[0]] ? data[coums.detail[0]] + (data[coums.detail[1]] ? coums.delimiter.replace('_', data[coums.detail[1]]) : '') : '';
      return title;
    }
    if (coums.type == 'number') {
      return !data[coums.coums] || data[coums.coums] == 0 ? '0' : data[coums.coums];
    }
    return data[coums.coums] ? data[coums.coums] : '';
  }
  get3(data) {
    if (this.editDone) { this.editDone.emit(data) }
  }
}
