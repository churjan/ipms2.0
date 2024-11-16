import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'copyright',
    templateUrl: './copyright.component.html',
    styleUrls: ['./copyright.component.less']
})
export class CopyrightComponent implements OnInit {
    @Input() Copyright: string = '';
    public year: number

    constructor() { }

    ngOnInit(): void {
        this.year = (new Date()).getFullYear()
    }
}
