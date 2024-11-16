import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'account-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {

  public currentUrl: string
  public isMobile: boolean = false
  public mode: string = 'inline'

  constructor(private router: Router,
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
        this.mode = result.matches ? 'horizontal' : 'inline'
        this.isMobile = result.matches
    })
  }
}
