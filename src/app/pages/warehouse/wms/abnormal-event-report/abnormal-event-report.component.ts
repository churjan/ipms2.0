import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import * as moment from 'moment';

@Component({
  selector: 'app-abnormal-event-report',
  templateUrl: './abnormal-event-report.component.html',
  styleUrls: ['./abnormal-event-report.component.less'],
})
export class AbnormalEventReportComponent extends ListTemplateComponent {
  @ViewChild('crud') crud: CrudComponent;

  date = [];
  requiredParams = {};
  constructor(public router: Router) {
    super();
    this.modularInit('wmsAbnormaleventreport');
    this.url = router.url.replace(/^\//, '').replace(/\//g, '_');
  }

  ngOnInit(): void {
    this.date = [new Date(), new Date()];
    this.requiredParams = {
      createdate_start: moment(this.date[0]).format('YYYY-MM-DD'),
      createdate_end: moment(this.date[1]).format('YYYY-MM-DD'),
    };
    setTimeout(() => {
      this.crud.Search();
    }, 0);
  }


  btnEvent(event) {
    super.btnEvent(event);
  }

  onChange(date) {
    this.requiredParams = {
      createdate_start: moment(date[0]).format('YYYY-MM-DD'),
      createdate_end: moment(date[1]).format('YYYY-MM-DD'),
    };
    setTimeout(() => {
      this.crud.Search();
    }, 0);
  }
}
