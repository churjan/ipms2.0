import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '~/shared/services/http/auth.service';
import { filter } from 'rxjs/operators';
import { AppService } from '~/shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilService } from '~/shared/services/util.service';

interface MenuInterface {
    title?: string;
    icon?: string;
    routerLink?: string | object;
    children?: MenuInterface[];
    show?: boolean,
    open?: boolean
}

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {

    public data: MenuInterface[] = []
    @Input() inlineCollapsed: boolean = false
    @Input() mode = 'inline'
    Permission: boolean = true
    private originalMenus: any
    paths: string[]

    constructor(
        private router: Router,
        public authService: AuthService,
        public appService: AppService,
        private message: NzMessageService) { }

    ngOnInit(): void {
        this.Permission = true
        this.paths = this.getAllPathByUrl(this.getCurrentUrl())
        this.authService.menu$.subscribe(response => {
            this.Permission = true
            this.originalMenus = response
            this.data = this.getMenus(this.originalMenus, this.paths)
            if (response && response['length'] == 0) this.Permission = false; else this.Permission = true;
        })
        // if (!this.data || this.data.length <= 0) { this.message.warning(this.appService.translate('warning.if_admin')) }
        this.watchRouterChange()
    }

    watchRouterChange() {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
            this.Permission = true
            this.paths = this.getAllPathByUrl(this.getCurrentUrl())
            if (!localStorage.setColumns) localStorage.setColumns = '';
            this.data = this.getMenus(this.originalMenus, this.paths)
            if (this.originalMenus && this.originalMenus.length == 0) this.Permission = false; else this.Permission = true;
        })
    }

    getCurrentUrl() {
        return this.router.url.indexOf("?") > 0 ? this.router.url.split("?")[0] : this.router.url
    }

    getMenus(menus, paths: Array<any>) {
        if (!menus || menus.length <= 0) return [];
        return menus.map(item => {
            if (item.ismenu == 1) { return null } else {
                const temp = {
                    title: item.title,
                    icon: item.icon,
                    ismenu: item.ismenu,
                    routerLink: item.url,
                    children: [],
                    show: true,
                    open: false
                }
                if (item.children && item.children.length > 0) {
                    let _children = this.getMenus(item.children ? item.children : item.sonlist, paths)
                    if (_children.find(_c => _c && _c.routerLink == paths[1]) && paths[0] != item.url) {
                        paths[0] = item.url
                    }
                    temp.children = UtilService.uniq(_children)
                }
                temp.open = paths.includes(item.url) && temp.children.length > 0
                return temp
            }
        })
    }

    getAllPathByUrl(url) {
        const urlSplit = url.split('/').filter(item => item)
        const box = []
        for (let i = 0; i < urlSplit.length; i++) {
            const temp = "/" + urlSplit.slice(0, i + 1).join("/")
            box.push(temp)
        }
        return box
    }
}
