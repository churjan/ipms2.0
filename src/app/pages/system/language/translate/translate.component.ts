import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudComponent } from '~/shared/components/crud/crud.component';
import { LanguageTranslateService } from '~/pages/system/language/translate/languageTranslate.service';
import { StartService } from '~/shared/services/http/start.service';

@Component({
    selector: 'app-translate',
    templateUrl: './translate.component.html',
    styleUrls: ['./translate.component.less']
})
export class TranslateComponent implements OnInit {

    @ViewChild('crud')  crud: CrudComponent
    languages: any[] = []
    editFlag: string = null
    editKey: string = null
    tableColumns: any[] = []

    constructor(
        public languageTranslateService: LanguageTranslateService,
        private startService :StartService
    ) { }

    async ngOnInit(){
        await this.languageTranslateService.list().then(({ title }) => {
            this.languages = title
            const columns = []
            this.languages.forEach(item =>{
                if(!columns.find(ite =>ite.flag == item.language)){
                    columns.push({
                        name: item.languagename,
                        flag: item.language
                    })
                }
            })
            this.tableColumns = this.languageTranslateService.tableColumns(columns)
        })
    }

    importDone(){
        this.crud.reloadData(true)
        localStorage.removeItem('translate')
        this.startService.translate()
    }
    
    startEdit(key: string, flag: string){
        this.editFlag = flag
        this.editKey = key
    }

    stopEdit(record,flag){
        const data = {
            key:            record[flag+'_key'] || null,
            slo_key:        record.key,
            slv_language:   flag,
            slv_key:        this.languages.find(item =>item.language == flag).key,
            translatetext:  record[flag]
        }
        this.languageTranslateService.translate(data).then((response: any) =>{
            record[flag+'_key'] = response.key
            localStorage.removeItem('translate')
            this.startService.translate()
            this.editFlag = null
            this.editKey = null
        })
    }

}
