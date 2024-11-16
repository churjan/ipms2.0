import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { environment } from 'src/environments/environment';
import { UtilService } from './shared/services/util.service';
import { AuthService } from './shared/services/http/auth.service';
import { RequestService } from './shared/services/request.service';
import { AppConfig } from './shared/services/AppConfig.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {

    whites = ['home', 'exception', 'redirect', 'account', 'hangerquery']
    guests = [environment.loginPath]

    constructor(
        private router: Router,
        private notification: NzNotificationService,
        private authService: AuthService,
        private utilService: UtilService,
        private request: RequestService
    ) { }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        // 判断是否钢带
        const isGangDai = localStorage.getItem('isGangDai') === '1' ? true : false
        environment.isGangDai = isGangDai

        if (this.guests.find(guest => state.url.startsWith(guest))) {
            // if (localStorage.getItem(environment.tokenKey)) {
            if (sessionStorage.ticket) {
                const result = this.utilService.parseUrlParams(state.url)['redirect']
                const redirect = result ? decodeURIComponent(result) : '/'
                this.router.navigateByUrl(redirect)
            }
            return true
        }
        // if (!localStorage.getItem(environment.tokenKey)) {
        if (!sessionStorage.ticket) {
            this.router.navigateByUrl(`${environment.loginPath}?redirect=${encodeURIComponent(state.url)}`)
            this.notification.error('系统提示', '登录信息或已失效，请重新登录！')
            return Promise.resolve(false)
        }
        let path = location.hash.replace('#', '').replace(/^\/+/, '').replace(/\//g, '_')
        for (let i = 0; i < this.whites.length; i++) {
            if (!path) return true //排除根路径页面
            if (path.indexOf(this.whites[i]) == 0) {
                return true
            }
        }
        let standby = localStorage.lastUrl.replace(/^\/+/, '').replace(/\//g, '_');
        if (path.search('hanger') < 0 || path.search('hangersrecord') >= 0) {
            this.GetUI(standby != 'home' ? standby : path);
        }
        //路由权限检测
        this.authService.permissions$.subscribe((result: string[]) => {
            if (result) {
                if (!result.includes(path)) {
                    location.href = '/'
                }
            }
        })
        if (this.authService.menuData.length == 0)
            this.authService.getUserMenu()
        return true
    }
    async GetUI(path) {
        if (path.search('Custom') >= 0) {
            path = path.replace('Custom', "")
        }
        let num = path.search('_')
        let modularName = path.replace(/\_/g, "")
        modularName = modularName.slice(0, num) + modularName.charAt(num).toUpperCase() + modularName.slice(num + 1)
        if (modularName == 'sysLogpaderr') modularName = 'sysLogrun';
        let slow = AppConfig.slow.find(s => s.modular == modularName);
        let oth = AppConfig.slow.filter(s => s.modular != modularName);
        if (!AppConfig.translate[modularName] && slow) {
            let translatelist = new Array();
            await this.request.GetUITranslate([slow]).then((response: any) => {
                translatelist = Object.assign(AppConfig.translate, response);
                AppConfig.translate = Object.assign(AppConfig.translate, response);
                localStorage.setItem("translate", JSON.stringify(translatelist))
            })
            await this.request.GetUITranslate(oth).then((response: any) => {
                translatelist = Object.assign(AppConfig.translate, response);
                AppConfig.translate = Object.assign(AppConfig.translate, response);
                localStorage.setItem("translate", JSON.stringify(translatelist))
            })
            localStorage.setItem("translate", JSON.stringify(translatelist))
        }
    }
}
