import { Component, OnInit } from '@angular/core';
import { LanguageVersionService } from '~/pages/system/language/version/languageVersion.service';

@Component({
    selector: 'app-version',
    templateUrl: './version.component.html',
    styleUrls: ['./version.component.less']
})
export class VersionComponent implements OnInit {

    tableColumns: any[] = []

    constructor(
        public languageVersionService: LanguageVersionService,
    ) { }

    ngOnInit(): void {
        this.tableColumns = this.languageVersionService.tableColumns()
    }

}
