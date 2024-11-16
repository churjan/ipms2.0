import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmbedModalService } from './embed-modal.service';
@Component({
    selector: 'app-embed-modal',
    templateUrl: './embed-modal.component.html',
    styleUrls: ['./embed-modal.component.less'],
})
export class EmbedModalComponent implements OnInit {
    @Input() width = '520px';
    @Input() marginTop = '100px';
    @Input() bodyHeight = 'auto';
    @Input() maskClosable = true;
    @Input() title;
    @Input() isVisible = false;
    @Output() isVisibleChange = new EventEmitter();
    @Input() componentName;
    @Input() noPadding;
    constructor(private ems: EmbedModalService) {}

    ngOnInit(): void {}

    onClose() {
        this.isVisibleChange.emit(false);
        this.ems.modalClose$.next({
            type:this.componentName,
            bool:false
        });
    }
}
