import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LanguageTranslateService } from '~/pages/system/language/translate/languageTranslate.service';
import { UtilService } from '~/shared/services/util.service';
import { AppService } from '~/shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.less']
})
export class ImportComponent implements OnInit {

    @Input() languages: any[] = []
    @ViewChild('file') fileControl: ElementRef
    @Output() importDone = new EventEmitter() 
    width: string
    visible: boolean = false
    langSelected: any
    
    constructor(
        private breakpointObserver: BreakpointObserver,
        private languageTranslateService: LanguageTranslateService,
        private utilService: UtilService,
        private message: NzMessageService,
        private appService: AppService
        ) { }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if(!result.matches){
                this.width = '300px'
            }else{
                this.width = '94%'
            }
        })
    }

    open(): void {
        this.visible = true
    }

    close(): void {
        this.visible = false
    }

    downloadTpl(){
        if(!this.langSelected) return false
        this.languageTranslateService.export({language:this.langSelected.language}).then((response: ArrayBuffer) =>{
            const blob = new Blob([response],{type:"application/vnd.ms-excel;charset=utf-8"})
            const fileName =  `${this.langSelected.languagename}.xlsx`
            this.utilService.downloadBlob(blob,fileName)
        })
    }

    importExcel(){
        if(!this.langSelected) return false
        const files = this.fileControl.nativeElement.files
        if(files.length <= 0) return false
        if(files[0].size > 20971520){
            this.message.warning(this.appService.translate("fileSizeWarn20MB"))
            this.fileControl.nativeElement.value = ''
            return false
        }
        const formData = new FormData()
        formData.append('fileName',files[0].name)
        formData.append('steam',files[0])
        this.languageTranslateService.import(formData,this.langSelected.language).then(() =>{
            this.fileControl.nativeElement.value = ''
            this.langSelected = null
            this.close()
            this.importDone.emit()
        })
    }
}
