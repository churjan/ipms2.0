import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RecordComponent } from './record/record.compontent';
import { TechnologyComponent } from './technology/technology.compontent';
import { AnswersListComponent } from './record/answers-list.component';
import { UtilService } from '~/shared/services/util.service';
import { AuthService } from '~/shared/services/http/auth.service';
import { AppConfig, modularList } from '~/shared/services/AppConfig.service';
import { AppService } from '~/shared/services/app.service';
import { PartsInforComponent } from './parts_info/parts_info.component';
declare var $: any;

@Component({
  selector: 'app-hanger',
  templateUrl: './hanger.component.html',
  styleUrls: ['./hanger.component.less']
})
export class HangerComponent implements OnInit, AfterViewInit {
  constructor(
    private service: UtilService,
    private appService: AppService,
    public route: ActivatedRoute,
    private router: Router,
    private AuthService: AuthService) {
    document.title = sessionStorage.sysName ? sessionStorage.sysName : appService.translate('common.sysName');
    this.modular = modularList['hanger'];
  }
  @ViewChild('answers', { static: false }) _answers: AnswersListComponent;
  @ViewChild('parts_info', { static: false }) _parts_info: PartsInforComponent;

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
  historylist: any[] = [];;
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
  winHeight: number = window.innerHeight - 110;
  winWidth: number = window.innerWidth - 201;
  sibtyle: number = 1;
  fields: any = {};
  selectedIndex = 1;
  /**模式 */
  Module: number = 0;
  Locationtype = [{ label: this.appService.translate('placard.Within'), value: 0, completed: false, disabled: true, checked: true },
  { label: this.appService.translate('placard.Onmain'), value: 1, completed: false, disabled: true }]
  winResize() {
    // let offset = $("#hanger").offset();
    // this.winHeight = window.innerHeight - offset.top;
    // this.winWidth = window.innerWidth - offset.left;
  }
  ngAfterViewInit() { }
  async ngOnInit() {
    const that = this;
    // this.winResize();
    // $(window).resize(function () {
    //   // that.winResize();
    // });
    // 订阅活动路由
    this.route.params.subscribe(params => {
      this.getlist();
      setTimeout(() => { }, 400);
    });
  }
  async getlist(model?) {
    this.Module = parseInt(UtilService.getQueryString('Module'));
    if (!this.Module) this.Module = localStorage.getItem("Module") ? parseInt(localStorage.getItem("Module")) : 0
    if (model) { this.isChange = model; } else {
      this.isChange = this.route.snapshot.paramMap.get('id');
      if (this.route.snapshot.queryParams.keywords) { this.isChange = this.route.snapshot.queryParams.keywords }
      this.transfer = (this.route.snapshot['_routerState'].url).split('/');
    }
    if (this.isChange && this.isChange != '') {
      this.seachhanger = this.isChange;
      await this.service.getPage(this.modular.url, { keywords: this.seachhanger, seq: '1', Module: this.Module }, (v) => {
        this.Basicinfor = v;
        if (this.Basicinfor.phr_entity && this.Basicinfor.phr_entity.currenttype <= 0) {
          this.Locationtype[0].checked = true;
          this.Locationtype[1].checked = false;
        } else {
          this.Locationtype[1].checked = true;
          this.Locationtype[0].checked = false;
        }
        // this.Locationtype.forEach(element => {
        //   if (this.Basicinfor.phr_entity && this.Basicinfor.phr_entity.currenttype == element.value) {
        //     element.checked = true;
        //   } else { element.checked = false; }
        // });
        if (v.tagcode) { this.getDetail(v.tagcode); }
        if (!v.tagcode) {
          this.oplist = null;
          this.historylist = null;
          // that.siblings = new MatTableDataSource([]);
          this.quality = null;
          this.tracking = null;
        }
        if (v.tag) {
          this.tag = v.tag;
          this.tag.pwb_code = v.tag.pwb_code;
          this.tag.pwb_key = v.tag.pwb_key;
          this.data = {
            key: this.tag.pwb_key,
            psi_key: this.tag.psi_key
          };
        } else { this.tag.pwb_key = ''; }
      }, (err) => {
        this.model = { hangerid: this.isChange };
        this.oplist = null;
        this.historylist = null;
        this.quality = null;
        this.tracking = null;
        // this.Basicinfor = {}
      });
    }
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
            this.router.navigate(['/hanger', this.seachhanger], { queryParams: { Module: this.Module } });
          }
        }
      }
    }
  }
  selectTab(n) {
    this.show = n.index;
    if (this.Basicinfor.tagcode) { this.getDetail(this.Basicinfor.tagcode); }
  }
  getDetail(tagcode) {
    const that = this;
    let mo: any = { tagcode: tagcode ,Module:this.Module };
    if (this.show == 1) { mo = { tagcode: tagcode ,Module:this.Module}; }
    this.service.getPage(this.modular.detailurl[this.show], mo, function (v) {
      switch (that.show) {
        case 0:
          v.forEach(l => {
            if (l.pwrd_list) {
              let total = 0;
              total = l.pwrd_list.reduce(function (total, currentValue, currentIndex, arr) {
                return currentValue.percentage ? (total + currentValue.percentage) : total;
              }, 0);
              l.pwrd_list.forEach((p) => { p.percent = total > 0 ? ((p.percentage / total) * 100).toFixed(2) + '%' : '0%'; })

            }
          })
          that.oplist = v;
          return;
        case 1:
          that.historylist = v;
          return;
        case 2:
          that.siblist = v;
          let _d = v.find(vd => vd.style == that.sibtyle);
          that.siblings = _d.pti_list;
          that._parts_info.Index = 1;
          return;
        case 3:
          that.quality = v;
          that.tracking = v.qualitytracking;
          return;
      }
    }, function (err) {
      that.oplist = [];
      that.historylist = [];
      that.siblings = [];
      that.quality = [];
      that.tracking = [];
    });
  }
  /**标签进度详情 */
  get2(key) {
    const that = this;
    // const dialogRef = this.dialog.open(TechnologyComponent, { height: '765px', width: that.winWidth + 'px', data: { key: key } });
    // dialogRef.afterClosed().subscribe(result => { });
  }
  get3(model) {
    const that = this;
    this._answers.open({ title: 'qir', node: model });
  }
  getFields(code) {
    let fieldmodel = this.modular.fields.find(c => c.code == code);
    return fieldmodel && fieldmodel.open && fieldmodel.open == 'true' ? true : false;
  }
  open(ev, column, data) {
    if (this.getFields(column) == true) {
      ev.stopPropagation();
      if (column == 'tagcode') {
        this.chack(data.tagcode)
      }
      if (column == 'id') {
        this.chack(data.id)
      }
    }
    return null
  }
  chack(data) {
    this.seachhanger = data;
    this.getHanger();
  }
  handleIndexChange(e: number): void { }
  /**sku工序流切换 */
  switch() {
    if (this.Module == 0) this.Module = 1; else this.Module = 0;
    localStorage.setItem("Module", JSON.stringify(this.Module))
  }
}
