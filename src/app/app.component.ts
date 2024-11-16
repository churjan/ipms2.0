import { Component, OnInit } from '@angular/core';
import { StartService } from '~/shared/services/http/start.service';
import { ThemeService } from './shared/services/theme.service';
import { MenuService } from './pages/system/menu/menu.service';
import { AuthService } from './shared/services/http/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {


    public inited: boolean = false

    constructor(
        private authService: AuthService,
        private startService: StartService,
        private menuService: MenuService,
        private themeService: ThemeService) { }

    async ngOnInit() {
        await this.authService.systemnameUrl();
        await this.startService.translate();
        const theme: any = localStorage.getItem("theme") || null
        await this.themeService.toggleTheme(theme)
        this.inited = true
        this.subscribeChangeMenu()
    }
    subscribeChangeMenu() {
        this.menuService.menu_change$.subscribe(response => {
            if (response) {
                this.startService.ChangeMenutranslate(response)
            }
        })
    }

}
