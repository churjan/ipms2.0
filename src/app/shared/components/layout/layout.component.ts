import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '~/shared/services/http/auth.service';
import { AppService } from '~/shared/services/app.service';
import { ThemeService } from '~/shared/services/theme.service';
import { environment } from '@/environments/environment';


@Component({
    selector: 'layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit, AfterViewInit {
    public isCollapsed: boolean = true
    public siderWidth: string = '208px' //styles/theme/var.less 中的@menu-width也要同步修改
    public current: any = {}
    public language: any
    public NavTabs: boolean = false;
    public sysName: string;
    public languageName: string;
    public tableCW: boolean = true//列宽权限
    public project = sessionStorage.project;
    @Input() siderMode: string = 'side'

    @Input()
    get collapsed(): boolean {
        return this.isCollapsed
    }
    set collapsed(val: boolean) {
        this.isCollapsed = val
    }

    constructor(
        private breakpointObserver: BreakpointObserver,
        private modal: NzModalService,
        public authService: AuthService,
        public themeService: ThemeService,
        public appService: AppService) {
        // this.authService.systemnameUrl()
        this.authService.Registerverify().then((c) => {
            document.title = document.title != c['fullsystemname'] ? c['fullsystemname'] : document.title;
            this.sysName = sessionStorage.sysName;
        });
        this.authService.getUserMenu()
        // document.title = sessionStorage.sysName;
    }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
            this.siderMode = result.matches ? 'over' : 'side'
            this.collapsed = result.matches
        })
        this.authService.userInfo$.subscribe(response => {
            this.current = response
        })
        this.authService.language$.subscribe(response => {
            this.language = response;
            let _language = localStorage.getItem('language')
            if (!_language) {
                // _language = navigator.language
                if (!_language) {
                    _language = 'Zh'
                }
                localStorage.setItem('language', _language)
            }
            if (this.language)
                this.language.find(l => { if (l.language == _language) return this.languageName = l.languagename })
        })
        this.sysName = sessionStorage.sysName;
        document.title = sessionStorage.sysName;
		if(localStorage.tableCW){
            this.tableCW = JSON.parse(localStorage.tableCW)
        }        this.authService.getUserInfo()
        this.authService.getLanguage()
    }
    ngAfterViewInit() {
        window.setTimeout(v => { this.NavTabs = true; }, 800);
    }
    animationRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData
    }

    languageChange(language) {
        localStorage.removeItem('translate')
        localStorage.setItem('language', language)
        location.reload()
    }

    themeChange(type: any) {
        this.themeService.toggleTheme(type).then(() => {
            localStorage.setItem("theme", type)
            this.appService.theme$.next(type)
        })
    }

    logout() {
        this.modal.confirm({
            nzTitle: this.appService.translate("confirm.confirm_logout"),
            nzMaskClosable: true,
            nzOnOk: () => {
                this.authService.logout()
                location.reload();
            }
        })
    }
    search() {
        // console.log( this.sysName)
        window.open('#/hanger/', sessionStorage.sysName);
    }
    LCD() {
        window.open(environment.ip + ':5040/SettingsPage.html?key=' + sessionStorage.userkey, sessionStorage.usercode);
    }
    // 表格列宽操作权限
    tableAuthority() {
        localStorage.setItem("tableCW", JSON.stringify(this.tableCW))

    }
}
