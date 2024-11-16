import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '~/shared/services/util.service';
import { AuthService } from '~/shared/services/http/auth.service';
import { AppConfig } from '~/shared/services/AppConfig.service';
import { AppService } from '~/shared/services/app.service';
declare var $: any;

@Component({
  selector: 'parts_info',
  templateUrl: './parts_info.component.html',
  styleUrls: ['./parts_info.component.less']
})
export class PartsInforComponent implements OnInit {
  constructor(
    private service: UtilService,
    private appService: AppService,
    public route: ActivatedRoute,
    private router: Router,
    private AuthService: AuthService) {
    document.title = window.localStorage.sysName;
  }
  @Input() ComponentParam: any;
  project = sessionStorage.project;
  @Input() modular;
  // 按钮注解
  btnLis: any[] = [];
  transfer = [];
  field: any[] = [];
  model: any = { hangerid: '' };
  @Input() oplist: any = [];
  historylist: any[] = [];;
  @Input() siblist: any[] = [];
  @Input() siblings = [];
  @Input() sibtyle: number = 1;
  fields: any = {};
  Index = 0;
  @Output() editDone = new EventEmitter<boolean>()
  ngOnInit() {
    this.btnEvent(this.siblist[this.sibtyle])
  }
  btnEvent(action?) {
    if (action) { this.sibtyle = action; }
    let _d = this.siblist.find(vd => vd.style == this.sibtyle);
    this.siblings = _d ? _d.pti_list : [];
  }
  print = (v) => { return v.toLowerCase() }

  toString(arr: any, model?, columns?) {
    let string = '';
    if (columns.detail) {
      columns.detail.forEach(fd => { string = string + model[fd]; });
    } else {
      if (!arr) {
        if (!model || !model[this.print(columns.coums)]) {
          if (columns.type) { if (columns.type == 'boolean') { return "×"; } }
          return '';
        }
        arr = model[this.print(columns.coums)];
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
  open(event, columns, data) {
    this.editDone.emit(data[columns.coums])
  }
}
