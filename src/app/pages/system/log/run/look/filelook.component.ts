import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RunLogService } from '~/pages/system/log/run/runLog.service';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { environment } from '@/environments/environment';

@Component({
    selector: 'filelook',
    templateUrl: './filelook.component.html',
    styleUrls: ['./filelook.component.less']
})
export class FileLookComponent extends FormTemplateComponent {
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private runLogService: RunLogService
    ) { super() }

    @Output() editDone = new EventEmitter()
    width: string
    visible: boolean = false
    data: string;


    ngOnInit() {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '340px'
            } else {
                this.width = '100%'
            }
        })
        this.otherUrl = this.modular.otherUrl;
    }

    open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node) {
            this.model = record.node;
            this._service.getPage(this.otherUrl.gettxturl, { key: record.node.key, path: record.node.path }, (result) => {
                this.data = result;
            }, (err) => { });
        }
        this.visible = true
    }

    FileDownload(ev?) {
        const url = environment.rootUrl + this.otherUrl.downloadurl + '?key=' + this.model.key + '&path=' + this.model.path;
        this._httpservice.download(url,  this.model.filename,null);
    }

    close(): void {
        this.avatar = null
        this.visible = false;
    }
}
