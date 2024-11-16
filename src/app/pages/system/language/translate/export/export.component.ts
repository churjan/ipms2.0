import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LanguageTranslateService } from '~/pages/system/language/translate/languageTranslate.service';
import { UtilService } from '~/shared/services/util.service';

@Component({
    selector: 'export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.less']
})
export class ExportComponent implements OnInit {

    @Input() languages: any[] = []
    width: string
    visible: boolean = false
    
    constructor(
        private breakpointObserver: BreakpointObserver,
        private languageTranslateService: LanguageTranslateService,
        private utilService: UtilService) { }

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

    download(item){
        this.languageTranslateService.export({language:item.language}).then((response: ArrayBuffer) =>{
            const blob = new Blob([response],{type:"application/vnd.ms-excel;charset=utf-8"})
            const fileName =  `${item.languagename}.xlsx`
            this.utilService.downloadBlob(blob,fileName)
        })
    }
}
