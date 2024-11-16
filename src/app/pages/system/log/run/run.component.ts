import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '~/shared/services/http/common.service';
import { RunLogService } from '~/pages/system/log/run/runLog.service';
import { UtilService } from '~/shared/services/util.service';
import { environment } from '@/environments/environment';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { FileLookComponent } from './look/filelook.component';

@Component({
    selector: 'app-run',
    templateUrl: './run.component.html',
    styleUrls: ['./run.component.less']
})
export class RunComponent extends ListTemplateComponent {
    constructor(
        private runLogService: RunLogService,
        private commonService: CommonService,
        private utilService: UtilService
    ) { super(); this.modularInit("sysLogrun"); }
    @ViewChild('filelook', { static: false }) _filelook: FileLookComponent;

    queryParams: {
        path: null,
        key: null
    }
    logFilePath: string = '/Log'
    paths: any[] = []
    data: any[] = []
    selectdata: any = { extensionname: 'folder' };


    ngOnInit(): void {
        // this.commonService.systemParameter('LogFilePath').then(response =>{
        //     if(response){
        //         this.logFilePath = `/${response}`
        //     }
        // })
        this.fetch()
    }
    /**获取数据 */
    fetch() {
        this.runLogService.list(this.queryParams).then((response: any) => {
            this.data = response;
            this.selectdata.data = response.length;
        })
    }
    /**
     * 查看文档
     */
    openFile(node) {
        if (node.extensionname !== 'folder') {
            this._filelook.open({ title: 'see', node: node })
        }
    }
    /**
     * 选择并打开文件
     */
    fileSelect(item?: any) {
        if (item) {
            const { path, key, extensionname, filename } = item
            if (extensionname == 'folder') {//文件夹
                const pathIndex = this.paths.findIndex(({ path }) => path == item.path)
                if (pathIndex >= 0) {
                    const nextIndex = pathIndex + 1
                    this.paths.splice(nextIndex, this.paths.length - nextIndex)
                } else {
                    this.paths.push(item)
                }
                this.queryParams = { path, key }
                this.fetch()
            } else {//文件
                // const filePath = path.replace('\\', this.logFilePath)
                // this.runLogService.download(filePath.substr(1, filePath.length - 1)).then((response: any) => {
                //     //const blob = new Blob([response],{type:"data:text/plain;charset=utf-8"})
                //     this.utilService.downloadBlob(new Blob([response]), filename)
                // })
            }
            this.selectdata = Object.assign({}, item)
        } else {
            this.paths = []
            this.queryParams = { path: null, key: null }
            this.fetch()
        }
    }
    /**下载 */
    mouseup(item) {
        const { path, key, extensionname, filename } = item
        if (extensionname !== 'folder') {
            const url = environment.rootUrl + 'api/FilesInfo/download/?key=' + key + '&path=' + path;
            this._httpservice.download(url, filename, null);
        }
    }

}
