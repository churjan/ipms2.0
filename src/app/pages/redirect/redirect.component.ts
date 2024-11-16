import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.less']
})
export class RedirectComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    const originalPath = this.activatedRoute.snapshot.queryParamMap.get('path')
    if(originalPath){
      this.router.navigateByUrl(decodeURIComponent(originalPath))
    }else{
      this.router.navigateByUrl('/exception/404')
    }
  }

}
