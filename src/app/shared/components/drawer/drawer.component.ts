import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild, DoCheck } from '@angular/core';
import { flyIn, fadeIn, zoomIn } from '../../../simple-animate';

@Component({
    selector: 'idrawer',
    templateUrl: './drawer.component.html',
    styleUrls: ['./drawer.component.less'],
    animations: [flyIn, fadeIn, zoomIn]
})
export class DrawerComponent implements OnInit, DoCheck {

    @ViewChild('body') body: ElementRef
    @Input() showHeader: boolean = true
    @Input() maskClose: boolean = false
    @Input() content: ElementRef
    @Input() footer: ElementRef
    @Input() btnTpl: ElementRef
    @Input() title: string
    @Input() issearch: boolean = false
    @Input() searchwidth: string = "100%"
    @Input()
    set justifyContent(value) {
        this.justifyContentValue = value
        if (value == 'center') {
            this.maxHeight = "100%"
            this.maxWidth = "100%"
        }
    }
    @Input() justifyContentValue: string = "flex-end"
    @Input()
    set headerHeight(value: string) {
        this.headFootTotalHeight = (parseInt(value.replace("px", "")) + parseInt(this.footHeight.replace("px", ""))) + "px"
        this.headHeight = value
    }
    @Input()
    set footerHeight(value: string) {
        this.headFootTotalHeight = (parseInt(value.replace("px", "")) + parseInt(this.headHeight.replace("px", ""))) + "px"
        this.footHeight = value
    }
    @Input() bodyPadding: string = "20px"
    @Input() width: string = "400px"
    @Input() height: string
    @Output() onBodyClick = new EventEmitter()
    @Output() onClose = new EventEmitter()
    autoHeight: string
    headFootTotalHeight: string = "106px"
    headHeight: string = "54px"
    footHeight: string = "52px"
    maxHeight: string = "100%"
    maxWidth: string = "100%"

    constructor(

    ) { }

    ngOnInit(): void {

    }

    ngDoCheck() {
        if (this.height) return false
        const bodyHeight = this.body?.nativeElement.offsetHeight;
        if (bodyHeight) {
            let extraHeight = 40
            if (this.showHeader) {
                extraHeight = extraHeight + parseInt(this.headHeight.replace("px", ""))
            }
            if (this.footer) {
                extraHeight = extraHeight + parseInt(this.footHeight.replace("px", ""))
            }
            this.autoHeight = (bodyHeight + extraHeight) + 'px'
        }
    }

    bodyClick($event) {
        $event.stopPropagation()
        this.onBodyClick.emit()
    }

    close() {
        this.onClose.emit()
    }

    maskClick() {
        if (!this.maskClose) return false
        this.close()
    }

}
