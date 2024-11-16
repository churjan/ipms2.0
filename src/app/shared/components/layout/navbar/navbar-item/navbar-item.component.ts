import { Component, Input, OnInit } from '@angular/core';

interface MenuInterface {
    title?: string;
    icon?: string;
    routerLink?: string | object;
    children?: MenuInterface[];
    show?: boolean,
    open?: boolean
}

@Component({
    selector: '[navbar-item]',
    templateUrl: './navbar-item.component.html',
    styleUrls: ['./navbar-item.component.less']
})
export class NavbarItemComponent implements OnInit{

    @Input() data: MenuInterface[] = []
    @Input() inlineCollapsed: boolean
    @Input() paths: string[]
    
    constructor( ) {  }

    ngOnInit() {
        
    }

}
