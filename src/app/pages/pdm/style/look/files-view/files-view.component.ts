import { Component, EventEmitter, Output } from '@angular/core';
import {  FormGroup } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { NzTabsCanDeactivateFn } from 'ng-zorro-antd/tabs';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { environment } from '@/environments/environment';
const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
@Component({
    selector: 'stylefiles-view',
    templateUrl: './files-view.component.html',
    styleUrls: ['./files-view.component.less']
})
export class FilesViewComponent extends FormTemplateComponent {
    constructor(
        private breakpointObserver: BreakpointObserver,
    ) { super(); }

    @Output() editDone = new EventEmitter<boolean>()
    title: string
    width: string
    validateForm!: FormGroup
    submiting: boolean = false;
    avatar: string
    /**菜单列表 */
    stylecuments: Array<{}> = [];
    /**图片列表 */
    fileList: NzUploadFile[] = [];
    /**选中 */
    selected: any = {};
    UploadFormat = '*';
    previewImage: string | undefined = '';
    previewVisible = false;
    previewNmae: string | undefined = '';

    ngOnInit(): void {
        this.otherUrl = this.modular.otherUrl;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '99%'
            }
        })
        // this.key = record.node.key
        this._service.comList('ClassData', { pcode: 'styledocument', name: '' }, 'getlist').then((result) => {
            this.stylecuments = result;
            this.canDeactivate(0, 0)
        });
    }

    //上传
    upExcel() {
        return environment.rootUrl + 'api/FilesInfo/';
    }
    /**上传头 */
    uploadingHeader() {
        const token =sessionStorage.ticket ;
        return {
            token: token,
            language: localStorage.language
        }
    }
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title)
    }
    canDeactivate: NzTabsCanDeactivateFn = (fromIndex: number, toIndex: number) => {
        const _type: any = this.stylecuments[toIndex];
        this.selected = _type;
        this._service.getList(this.otherUrl.styleurl, { psi_key: this.key, class: _type.key }, result => {
            // console.log(result)
            this.fileList = new Array();
            result.forEach(f => {
                this.fileList.push({
                    uid: f.key,
                    name: f.bfi_originalname,
                    status: 'done',
                    url: f.bfi_thumb_path ? environment.rootUrl + f.bfi_thumb_path.replace('/', "") : ('assets/img/filetype/' + f.bfi_extension + '.png'),
                    thumbUrl: environment.rootUrl + f.bfi_path.replace('/', ""),
                    previewExtension: f.bfi_extension,
                    response: f
                })
            })
        }, msg => { });
        return true;
    }
    handlePreview = async (file: NzUploadFile): Promise<void> => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj!);
        }
        if (file.previewExtension == 'pdf') {
            window.open(file.thumbUrl)
        } else {
            this.previewImage = file.url || file.preview;
            this.previewVisible = true;
            this.previewNmae = file.name
        }
    };
    index = 0;
    SelectChange(ev) {
        this.index = ev.index;
        let node = this.stylecuments[ev.index];
        let _Format = node['description'] ? node['description'].split(',') : '';
        let _UploadFormat = '*';
        _Format.forEach(element => { _UploadFormat = _UploadFormat + ',' + '.' + element });
        this.UploadFormat = _UploadFormat;
    }
    uploadChange({ file, fileList }: NzUploadChangeParam) {
        const status = file.status;
        const name = file.name;
        if (status === 'done') {
            file.response.forEach(fr => {
                if (fr['code'] == 0) {
                    this.message.success(`${file.name} ` + this.getTipsMsg('sucess.s_upload'));
                    let model = {
                        psi_key: this.key,
                        bfi_key: fr['data']['key'],
                        class: this.selected.key,
                        name: fr['data']['name'],
                        isdefault: false
                    }
                    this._service.saveModel(this.otherUrl.styleurl, 'add', model, (s) => {
                        // file.onSuccess!(s, file.file!, event);
                        this.canDeactivate(0, this.index)
                    })
                } else if (fr['code'] == 1) {
                    this.message.error(`${file.name} ` + this.getTipsMsg('fail.f_uploader') + fr.message);
                    let d = this.fileList.findIndex(f => f.uid == file.uid);
                    if (this.fileList.length > 0 && d != -1) { this.fileList.splice(d, 1); }
                    return;
                }
            })
        } else if (status === 'error') {
            this.message.error(`${name} ` + this.getTipsMsg('fail.f_uploader'));
        }
    }
    delete = (file: any) => {
        const that = this;
        this._modalService.confirm({
            nzTitle: this._appService.translate('confirm.confirm_deln'),
            nzContent: file.name,
            nzOkText: this._appService.translate('btn.Confirmed'),
            nzOkType: 'primary',
            nzOkDanger: true,
            nzOnOk: () => {
                let model = file.response.constructor == Array ? file.response[0].data : file.response;
                this._service.deleteModel(this.otherUrl.styleurl, [model], (s) => {
                    let d = this.fileList.filter(f => f.response.key != model.key);
                    that.fileList = d;
                    this.message.success(this._appService.translate('sucess.s_delete'));
                }, (e) => { })
            },
            nzCancelText: this._appService.translate('btn.cancel'),
            nzOnCancel: () => { }
        });
    }


}
