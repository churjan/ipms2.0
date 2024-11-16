import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { LoginService } from '../login.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '~/shared/services/app.service';
@Component({
    selector: 'app-install',
    templateUrl: './install.component.html',
    styleUrls: ['./install.component.less'],
})
export class InstallComponent implements OnInit {
    @Input() toggleType: number;
    @Input() prevToggleType: number;
    @Output() toggleTypeChange = new EventEmitter<number>();
    computerData;

    constructor(
        private message: NzMessageService,
        private appService: AppService,
        public loginService: LoginService
    ) { }

    ngOnInit(): void {
        this.loginService.fecthComputerData().then((data) => {
            this.computerData = JSON.stringify(data);
        });
    }

    onNavigateTo(type?: number) {
        if (type) {
            this.toggleTypeChange.emit(type);
        } else {
            if (this.prevToggleType === 3) {
                this.toggleTypeChange.emit(3);
            } else {
                this.toggleTypeChange.emit(0);
            }
        }
    }

    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    trfil = (v) => { return this.appService.translate(v) }
    onReboot() {
        const msgId = this.message.loading(
            this.appService.translate('placard.reBootLoading'),
            { nzDuration: 0 }
        ).messageId;
        this.loginService
            .checkRegister()
            .then(() => {
                this.onNavigateTo(0);
            })
            .finally(() => {
                this.message.remove(msgId);
            });
    }
}
