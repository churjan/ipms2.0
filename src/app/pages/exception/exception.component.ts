import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '~/shared/services/app.service';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.less']
})
export class ExceptionComponent implements OnInit {

  code = 404;
  data = {
    403: {
      image: 'url(/assets/images/403.svg)',
      desc: null
    },
    404: {
      image: 'url(/assets/images/404.svg)',
      desc: null
    },
    500: {
      image: 'url(/assets/images/500.svg)',
      desc: null
    }
  };

  constructor(route: ActivatedRoute, private appService:AppService) {
    route.params.subscribe(params => {
      this.code = parseInt(params.code)
      if (!this.data[this.code]) {
        this.code = 404;
      }
    });
  }

  ngOnInit() {
    this.data[403].desc = this.appService.translate("errorNoPermission")
    this.data[404].desc = this.appService.translate("errorNotFound")
    this.data[500].desc = this.appService.translate("errorSystem")
  }

}
