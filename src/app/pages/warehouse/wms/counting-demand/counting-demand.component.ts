import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { DateSelectContent } from "~/shared/selectInput/date/date.component";

@Component({
  selector: 'app-counting-demand',
  templateUrl: './counting-demand.component.html',
  styleUrls: ['./counting-demand.component.less']
})
export class CountingDemandComponent extends ListTemplateComponent {
  @ViewChild('dateselect', { static: false }) _dateselect: DateSelectContent;

  constructor(public router: Router) {
    super();
    this.modularInit('wmsCountingdemand');
    this.url = router.url.replace(/^\//, '').replace(/\//g, '_');
  }
  

  ngOnInit(): void {
  }

  onReset(){this._dateselect.Reset()}

}
