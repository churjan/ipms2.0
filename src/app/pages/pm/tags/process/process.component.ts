import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tag-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.less']
})
export class ProcessComponent implements OnInit {

    @Input() data :Array<any>
    constructor() { }

    ngOnInit(): void {

    }

}
