import { Component, OnInit } from '@angular/core';
import { CommonService } from '~/shared/services/http/common.service';
import { FileService } from '~/pages/system/file/file.service';

@Component({
    selector: 'app-file',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.less']
})
export class FileComponent implements OnInit {

    tableColumns: any[] = []

    constructor(
        public commonService: CommonService,
        public fileService: FileService
    ) { }

    ngOnInit(): void {
        this.tableColumns = this.fileService.tableColumns()
    }
}
