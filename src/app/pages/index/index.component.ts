import { Component, OnInit } from '@angular/core';
import { environment } from '@/environments/environment';
@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
    
    isGangDai=environment.isGangDai

    constructor() {

    }

    ngOnInit(): void {
        
    }

}
