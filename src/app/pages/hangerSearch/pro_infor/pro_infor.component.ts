import { Component, OnInit, Input } from '@angular/core';
declare var $: any;

@Component({
  selector: 'pro_infor',
  templateUrl: './pro_infor.component.html',
  styleUrls: ['./pro_infor.component.less']
})
export class ProInforComponent implements OnInit {
  constructor() { }
  @Input() modular: any = {};
  @Input() oplist: any = [];
  async ngOnInit() { }
  print = (v) => { return v.toLowerCase() }
  toString(arr: any, model?, columns?) {
    let string = '';
    if (columns.detail) {
      columns.detail.forEach(fd => { string = string + model[fd]; });
    } else {
      if (!arr) {
        if (!model.ptpr_entity || !model.ptpr_entity[this.print(columns.coums)]) {
          if (columns.type) { if (columns.type == 'boolean') { return "×"; } }
          return '';
        }
        arr = model.ptpr_entity[this.print(columns.coums)];
      }
      if (typeof arr == 'boolean') {
        if (!arr || arr == null) { return ''; }
        return arr == true ? "√" : "×";
      }
      if (typeof arr == "string" || typeof arr == 'number') { return arr; }
      arr.forEach((x, i) => {
        if (!x.bls_code) { x.bls_code = ''; }
        string += (x.bls_code + ' ' + (i % 2 === 0 ? '\n' : ''));
      });
    }
    return string;
  }
}
