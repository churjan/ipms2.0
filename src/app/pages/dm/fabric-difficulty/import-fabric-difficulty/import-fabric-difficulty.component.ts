import { Component, OnInit } from '@angular/core';
import { FabricDifficultyService } from '../fabric-difficulty.service';
import { AppService } from '~/shared/services/app.service';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '@/environments/environment';

@Component({
    selector: 'app-import-fabric-difficulty',
    templateUrl: './import-fabric-difficulty.component.html',
    styleUrls: ['./import-fabric-difficulty.component.less'],
})
export class ImportFabricDifficultyComponent implements OnInit {
    fileList = [];
    isLoading = false;
    constructor(
        private fds: FabricDifficultyService,
        private appService: AppService,
        private ems: EmbedModalService,
        private message: NzMessageService
    ) { }

    ngOnInit(): void { }

    beforeUpload = (file): boolean => {
        this.fileList = [file];
        return false;
    };

    onUpload() {
        this.isLoading = true;
        const formData = new FormData();
        formData.append('file', this.fileList[0]);
        this.fds
            .import(formData)
            .then(() => {
                this.message.success(
                    this.appService.translate('sucess.s_upload')
                );
                this.ems.modalClose$.next(true);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    onDownloadTpl() {
        const language =
            (localStorage.getItem('language') || navigator.language).indexOf('zh') != -1 ? 'zh' : 'EN';
        // const url = `http://192.168.92.3:5002/download/excel/${language}/FabricDifficulty.xls`;
        const url = environment.rootUrl + `download/excel/${language}/FabricDifficulty.xls`;

        window.open(url);
    }

    //导入抬头添加token 和 语言
    uploadingHeader(){
              const token = sessionStorage.ticket ;
              return {
                  token: token,
                  language: localStorage.language
              }
    }
}
