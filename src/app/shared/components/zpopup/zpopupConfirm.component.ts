import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'zpopup-confirm',
    templateUrl: './zpopupConfirm.component.html',
    styleUrls: ['./zpopupConfirm.component.less']
})
export class ZPopupConfirmComponent implements OnInit {
    @Input() zpopupConfirmFoot: ElementRef;//底部按钮
    bjOpacity = 0;//默认透明 遮罩层
    opacity = 0;//默认透明 内容层
    @Input() delDataNum:number = 0;//删除条数
    @Input() type:number = 0;//0为默认删除弹窗 1为自定义弹窗
    @Input() text:string = "";//自定义提示
    @Output() getClosePopup = new EventEmitter<any>();//关闭当前窗口

    closePopup(){
        this.getClosePopup.emit();
    }
    ngOnInit(): void {
        setTimeout(() => {
            this.bjOpacity = 1; 
        }, 10);
        setTimeout(() => {
            this.opacity = 1; 
        }, 10);
    }

}