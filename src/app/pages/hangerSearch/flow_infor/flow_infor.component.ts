import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '~/shared/services/util.service';
import { AuthService } from '~/shared/services/http/auth.service';
import { AppConfig } from '~/shared/services/AppConfig.service';
import { AppService } from '~/shared/services/app.service';
declare var $: any;

@Component({
  selector: 'flow_infor',
  templateUrl: './flow_infor.component.html',
  styleUrls: ['./flow_infor.component.less']
})
export class FlowInforComponent implements OnInit {
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
  @Input() historylist: any[] = [];;
  siblist: any[] = [];
  siblings = [];
  quality: any[] = [];
  tracking: any;
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
}
