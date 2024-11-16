import { Component, ElementRef, EventEmitter, Injectable, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fromEvent } from "rxjs";

@Component({
    selector: 'zpopup',
    templateUrl: './zpopup.component.html',
    styleUrls: ['./zpopup.component.less']
})
export class ZPopupComponent implements OnInit {
    elWidthRatio:number = 0;//当前窗口最大宽度比例
    elHeightRatio:number = 0;//当前窗口最大高度比例
    @Input() isLoading:boolean = false;//是否在加载
    @Input() zpopupCont: ElementRef;//内容
    @Input() zpopupFoot: ElementRef;//底部按钮

    @Input() width:number = 600;//自定义宽度 默认600px
    @Input() height:number = 700;//自定义宽度 默认700px
    @Input() popupTitle:string = "";//标题
    bjOpacity = 0;//默认透明 遮罩层
    opacity = 0;//默认透明 内容层
    @Output() getClosePopup = new EventEmitter<any>();//关闭当前窗口

    @ViewChild('contHeight') setContHeight: ElementRef;
    @Output() getContHeight = new EventEmitter<any>();//关闭当前窗口

    constructor(private el: ElementRef) {

    }

    //页面渲染完成后执行
    ngAfterViewInit() {
       this.elWidthRatio = this.el.nativeElement.firstElementChild.clientWidth/1712;//按照1712px为 1 比例
       this.elHeightRatio = this.el.nativeElement.firstElementChild.clientHeight/885;//按照885px为 1 比例
       
       this.contHeight();
    //    console.log(this.elWidth+":"+this.elHeight);
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.bjOpacity = 1; 
        }, 10);
        setTimeout(() => {
            this.opacity = 1; 
        }, 10);

        
        //监控当前浏览器窗口是否变化
        fromEvent(window,"resize").subscribe((event:any)=>{
            this.contHeight();
        })
    }

    closePopup(){
        this.getClosePopup.emit();
    }

    //将内容的高度返回给父页面 随窗口大小变动
    contHeight(){
        this.getContHeight.emit(this.setContHeight.nativeElement.clientHeight);//将内容高度返回
    }

}