import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmbedDrawerService } from './embed-drawer.service';

@Component({
    selector: 'app-embed-drawer',
    templateUrl: './embed-drawer.component.html',
    styleUrls: ['./embed-drawer.component.less'],
})
export class EmbedDrawerComponent implements OnInit {
    @Input() maskClosable = true;
    @Input() title;
    @Input() isVisible = false;
    @Output() isVisibleChange = new EventEmitter();
    @Input() componentName;
    constructor(private eds: EmbedDrawerService) {}

    ngOnInit(): void {}

    onClose() {
        this.isVisibleChange.emit(false);
        this.eds.drawerClose$.next(false);
    }
}
