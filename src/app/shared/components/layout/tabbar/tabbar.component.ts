import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SimpleReuseStrategy } from '~/simple-reuse-strategy';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilService } from '~/shared/services/util.service';
import { AppService } from '~/shared/services/app.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { AppConfig } from '~/shared/services/AppConfig.service';
import { RequestService } from '~/shared/services/request.service';

@Component({
    selector: 'tabbar',
    templateUrl: './tabbar.component.html',
    styleUrls: ['./tabbar.component.less']
})
export class TabbarComponent implements OnInit {

    public tagSelectedIndex = 0
    public tagsList = []
    public routersData = []

    constructor(
        private router: Router,
        private titleService: Title,
        private activatedRoute: ActivatedRoute,
        private nzContextMenuService: NzContextMenuService,
        private message: NzMessageService,
        private cdf: ChangeDetectorRef,
        private utilService: UtilService,
        private appService: AppService,
        private request: RequestService
    ) { }

    ngOnInit(): void {
        this.routersData = this.utilService.getRoutersData()
        this.subscribeRouterChange()
        this.initPageInfo()
    }


    /* 
    //获取路由配置中的data数据
    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
            while (route.firstChild) {
                route = route.firstChild;
            }
            return route;
        }),
        mergeMap(route => route.data)
    )
    .subscribe(event => {

    }) */
    //监听路由变化
    subscribeRouterChange() {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            let routerData: any = this.findRouterItemByUrl(this.router.url)
            if (routerData && Object.keys(routerData).length > 0) {
                const pathKey = routerData.tree.join('_')
                const title = this.appService.translate(`common.url.${pathKey}`)
                if (pathKey.search('hanger') < 0||pathKey.search('padMonitor') < 0) {
                    this.GetUI(pathKey)
                }
                let sysName = sessionStorage.sysName ? sessionStorage.sysName : this.appService.translate("common.sysName");
                this.titleService.setTitle(sysName + (title ? "-" + title : ""))
                if (routerData.path != '/redirect') {
                    this.tagsList.forEach(item => item.isSelected = false)
                    const queryParams = this.activatedRoute.snapshot.queryParams
                    const result = this.tagsList.find(item => item.path == routerData.path)
                    if (!result) {
                        this.tagsList.push({ title: title, path: routerData.path, isSelected: true, params: queryParams })
                    } else {
                        this.tagsList.forEach(item => item.isSelected = item.path == routerData.path)
                        result.params = queryParams
                    }
                    this.tagSelectedIndex = this.tagsList.findIndex(item => item.isSelected)
                    this.appService.tagsList$.next(this.tagsList)
                    this.cdf.detectChanges()
                }
            }
        })
    }
    async GetUI(path) {
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

    //初始化页面信息：标题、选项卡标签等
    initPageInfo() {
        if (this.tagsList.length <= 0) {
            const url = this.router.url
            const homeRouterData = { path: '/home', tree: ['home'] }
            const homePathKey = homeRouterData.tree.join('_')
            const homeTitle = this.appService.translate(`common.url.${homePathKey}`)
            this.tagsList.push({ title: homeTitle, path: homeRouterData.path, isSelected: homeRouterData.path == url })
            let sysName = sessionStorage.sysName ? sessionStorage.sysName : this.appService.translate("common.sysName");
            this.titleService.setTitle(sysName + "-" + homeTitle)
            if (url == '/home') {
                let translatelist = new Array();
                this.request.GetUITranslate(AppConfig.slow).then((response: any) => {
                    translatelist = Object.assign(AppConfig.translate, response);
                    AppConfig.translate = Object.assign(AppConfig.translate, response);
                    localStorage.setItem("translate", JSON.stringify(translatelist))
                })
            }
            if (url != '/home') {
                let routerData: any = this.findRouterItemByUrl(url);
                const pathKey = routerData.tree.join('_')
                const title = this.appService.translate(`common.url.${pathKey}`)
                const queryParams = this.activatedRoute.snapshot.queryParams
                this.tagsList.push({ title: title, path: routerData.path, isSelected: true, params: queryParams })
                this.titleService.setTitle(sysName + (title ? "-" + title : ""))
            }
            this.tagSelectedIndex = this.tagsList.findIndex(item => item.isSelected)
            this.appService.tagsList$.next(this.tagsList)
        }
    }


    //根据给定路由地址查找该路由对应的数据
    findRouterItemByUrl(url: string) {
        const path = this.getFinalPath(url)
        return this.routersData.find(item => item.path == path)
    }

    getFinalPath(url: string) {
        if (url.indexOf("?") > 0) url = url.split("?")[0]
        if (url.indexOf("/exception") == 0) url = "/exception"
        return url
    }

    //切换选项卡标签
    tabChange(index) {
        this.tagSelectedIndex = index
        this.router.navigate([this.tagsList[index].path], { queryParams: this.tagsList[index].params })
    }

    //刷新选项卡标签
    reloadTag($event, index) {
        $event.stopPropagation()
        const delItem = this.tagsList[index]
        const path = delItem.path.replace(/\//g, '_')
        SimpleReuseStrategy.deleteRouteSnapshot(path)
        const jump = encodeURIComponent(this.router.url)
        this.router.navigate(['/redirect'], { queryParams: { path: jump } })
    }

    //关闭指定的一个选项卡标签
    closeTag($event, index) {
        $event.stopPropagation()
        if (this.tagsList.length <= 1) {
            this.message.warning(this.appService.translate("lastOneWarn"))
            return false
        }
        const delItem = this.tagsList[index]
        const path = delItem.path.replace(/\//g, '_')
        SimpleReuseStrategy.deleteRouteSnapshot(path)
        this.tagsList = this.tagsList.filter(p => p.path != delItem.path)
        this.appService.tagsList$.next(this.tagsList)
        const url = this.getFinalPath(this.router.url)
        if (url == delItem.path) {//关掉的是当前页面
            let jumpItem = this.tagsList[index - 1]
            if (!jumpItem) {
                jumpItem = this.tagsList[index + 1]
                if (!jumpItem) {
                    jumpItem = this.tagsList[0]
                }
            }
            this.router.navigate([jumpItem.path], { queryParams: jumpItem.params })
        }
    }

    //关闭其它选项卡标签
    closeOtherTags() {
        const url = this.getFinalPath(this.router.url)
        const curItem = this.tagsList.filter(item => {
            if (item.path === url || item.path == '/home') {
                return true
            } else {
                const path = item.path.replace(/\//g, '_')
                SimpleReuseStrategy.deleteRouteSnapshot(path)
                return false
            }
        })
        this.tagsList = curItem
        this.appService.tagsList$.next(this.tagsList)
    }

    //关闭全部选项卡标签
    closeAllTags() {
        const curItem = this.tagsList.filter(item => {
            if (item.path == '/home') {
                return true
            } else {
                const path = item.path.replace(/\//g, '_')
                SimpleReuseStrategy.deleteRouteSnapshot(path)
                return false
            }
        })
        this.tagsList = curItem
        this.appService.tagsList$.next(this.tagsList)
        this.router.navigateByUrl('/home')
    }

    //关闭右侧标签
    closeRightTags(i) {
        const curItem = this.tagsList.filter((item, index) => {
            if (index <= i || item.path == '/home') {
                return true
            } else {
                const path = item.path.replace(/\//g, '_')
                SimpleReuseStrategy.deleteRouteSnapshot(path)
                return false
            }
        })
        this.tagsList = curItem
        this.appService.tagsList$.next(this.tagsList)
        const jumpItem = this.tagsList[this.tagsList.length - 1]
        this.router.navigate([jumpItem.path], { queryParams: jumpItem.params })
    }


    contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
        this.nzContextMenuService.create($event, menu)
    }

    //暂时没用到
    closeMenu(): void {
        this.nzContextMenuService.close()
    }

}
