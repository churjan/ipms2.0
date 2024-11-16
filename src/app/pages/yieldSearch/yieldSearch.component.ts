import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '~/shared/services/util.service';
import { AuthService } from '~/shared/services/http/auth.service';
import { AppConfig, modularList } from '~/shared/services/AppConfig.service';
import { AppService } from '~/shared/services/app.service';
declare var $: any;

@Component({
  selector: 'app-yieldSearch',
  templateUrl: './yieldSearch.component.html',
  styleUrls: ['./yieldSearch.component.less']
})
export class YieldSearchComponent implements OnInit, AfterViewInit {
  constructor(
    private service: UtilService,
    private appService: AppService,
    public route: ActivatedRoute,
    private router: Router,
    private AuthService: AuthService) {
    document.title = sessionStorage.sysName ? sessionStorage.sysName : appService.translate('common.sysName');
    this.modular = modularList['reportYield'];
  }
  @Input() ComponentParam: any;
  project = sessionStorage.project;
  modular: any = {};
  // 按钮注解
  btnLis: any[] = [];
  transfer = [];
  field: any[] = [];
  model: any = { hangerid: '' };
  Basicinfor: any = {};
  oplist: any = [];
  /**数据源 */
  dataSet: any[] = [];
  /**汇总数据 */
  sumNode: any = {};
  /**时间 */
  date = new Date();
  siblings = [];
  /**分页 */
  page: number = 1;
  /**总数 */
  total: number = 0;
  tracking: any;
  tag: any = { pwb_key: '' };
  show = 0;
  data: any = {};
  isShowRouter = false;
  isChange: any;
  seachhanger: string = '';
  winHeight: number = window.innerHeight - 110;
  winWidth: number = window.innerWidth - 201;
  sibtyle: number = 1;
  fields: any = {};
  selectedIndex = 1;
  Locationtype = [{ label: this.appService.translate('placard.Within'), value: 0, completed: false, disabled: true, checked: true },
  { label: this.appService.translate('placard.Onmain'), value: 1, completed: false, disabled: true }]

  ngAfterViewInit() { }
  async ngOnInit() {
    // 订阅活动路由
    this.route.params.subscribe(params => {
      this.getlist();
      setTimeout(() => {
      }, 400);
    });
  }
  async getlist(model?) {
    if (model) { this.isChange = model; } else {
      this.isChange = this.route.snapshot.paramMap.get('id');
      this.transfer = (this.route.snapshot['_routerState'].url).split('/');
    }
    this.seachhanger = this.isChange;
    await this.service.getPage(this.modular.otherUrl.public, {
      hei_key: this.seachhanger,
      start_date: UtilService.dateFormat(this.date),
      end_date: UtilService.dateFormat(this.date)
    }, (v) => {
      this.dataSet = v.datalist ? v.datalist : [];
      this.sumNode = { quantity: v.sumnumber ? v.sumnumber : 0 };
    }, (err) => { });
  }
  /**更改当前页码 */
  PageIndexChange(ev) {
    this.page = parseInt(ev) ? parseInt(ev) : 1;
    this.getlist();
  }
  getHanger(event?: any) {
    if (!(event && event.keyCode !== 13)) {
      if (this.seachhanger) {
        if (this.isChange == this.seachhanger) {
          this.getlist();
        } else {
          if (this.transfer[1] !== 'hanger') {
            this.getlist(this.seachhanger);
          } else {
            this.router.navigate(['/hanger', this.seachhanger]);
          }
        }
      }
    }
  }
  getWidth(code) {
    let fieldmodel = this.modular.fields.find(c => c.code == code);
    return fieldmodel && fieldmodel.Width ? fieldmodel.Width + 'px' : '';
  }
  getAlign(code) {
    const _Align = this.modular.fields.find(m => m.code === code);
    return _Align && _Align.alignment ? _Align.alignment : 'center';
  }
  isSticky(buttonToggleGroup: any, id: string) {
    return buttonToggleGroup ? (buttonToggleGroup || []).indexOf(id) !== -1 : false;
  }
  getFields(code) {
    let fieldmodel = this.modular.fields.find(c => c.code == code);
    return fieldmodel && fieldmodel.open && fieldmodel.open == 'true' ? true : false;
  }
  dateFormat(Time: any, format) {
    if (!Time || Time === '' || Time == null) { return ''; }
    const date = new Date(Time.replace(/-/g, '/'));
    // return Utils.dateFormat(date, format);
  }
}
