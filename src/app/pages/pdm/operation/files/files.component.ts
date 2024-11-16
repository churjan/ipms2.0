import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    selector: 'files',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.less']
})
export class FilesComponent extends FormTemplateComponent {
    constructor(
        private breakpointObserver: BreakpointObserver,
    ) { super(); }

    @Output() editDone = new EventEmitter<boolean>()
    title: string
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    submiting: boolean = false;
    avatar: string
    /**菜单列表 */
    operdocuments: Array<{}> = [];
    /**图片列表 */
    fileList: NzUploadFile[] = [];
    /**选中 */
    selected: any = {};
    UploadFormat = '*';
    previewImage: string | undefined = '';
    previewVisible = false;

    ngOnInit(): void {
        this.otherUrl = this.modular.otherUrl;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
    }

    //上传
    upExcel() {
        return environment.rootUrl + 'api/FilesInfo/';
    }
    /**上传头 */
    uploadingHeader() { // 请求 header
        const token = sessionStorage.ticket;
        return { token: token, language: localStorage.language }
    }
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title)
        if (record.node) {
            this.key = record.node.key
            this._service.comList('ClassData', { pcode: 'operationclass', name: '' }, 'getlist').then((result) => {
                this.operdocuments = result;
                if (this.operdocuments.length > 0)
                    this.canDeactivate(0, 0)
            });
        } else {
            this.key = null
        }
        this.visible = true
    }
    canDeactivate: NzTabsCanDeactivateFn = (fromIndex: number, toIndex: number) => {
        const _type: any = this.operdocuments[toIndex];
        this.selected = _type;
        this._service.getList(this.otherUrl.operurl, { poi_key: this.key, class: _type.key }, result => {
            this.fileList = new Array();
            result.forEach(f => {
                let bfi_thumb_path = f.isfull != true ? environment.imgUrl + f.bfi_thumb_path : f.bfi_thumb_path
                this.fileList.push({
                    uid: f.key,
                    name: f.bfi_originalname,
                    status: 'done',
                    url: bfi_thumb_path,
                    thumbUrl: f.isfull != true ? environment.imgUrl + f.bfi_path : f.bfi_path,
                    response: f
                })
            })
        }, msg => { });
        return true;
    }
    handlePreview = async (file: NzUploadFile): Promise<void> => {
        if (!file.thumbUrl && !file.preview) {
            file.preview = await getBase64(file.originFileObj!);
        }
        this.previewImage = file.thumbUrl || file.preview;
        window.open(file.thumbUrl);
    };
    index = 0;
    SelectChange(ev) {
        this.index = ev.index;
        let node = this.operdocuments[ev.index];
        let _Format = node['description'].split(',');
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
                    this.message.success(`${name} ` + this.getTipsMsg('sucess.s_upload'));
                    let model = {
                        poi_key: this.key,
                        bfi_key: fr['data']['key'],
                        class: this.selected.key,
                        bfi_originalname: fr['data']['name'],
                        isdefault: false
                    }
                    this._service.saveModel(this.otherUrl.operurl, 'add', model, (s) => {
                        this.canDeactivate(0, this.index)
                        // file.onSuccess!(s, file.file!, event);
                    })
                } else if (fr['code'] == 1) {
                    this.message.error(`${name} ` + this.getTipsMsg('fail.f_uploader') + fr.message);
                    let d = this.fileList.findIndex(f => f.uid == file.uid);
                    if (this.fileList.length > 0 && d != -1) { this.fileList.splice(d, 1); }
                    return;
                }
            })
        } else if (status === 'error') {
            this.message.error(`${file.name} ` + this.getTipsMsg('fail.f_uploader'));
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
                let model = file.response;
                this._service.deleteModel(this.otherUrl.operurl, [file.response], (s) => {
                    let d = this.fileList.filter(f => f.response.key != model.key);
                    that.fileList = d;
                    this.message.success(this._appService.translate('sucess.s_delete'));
                }, (e) => { })
            },
            nzCancelText: this._appService.translate('btn.cancel'),
            nzOnCancel: () => { }
        });
    }

    Download = (file: any) => {
        /**获取文件扩展名 */
        const fileExt = this._service.getFileLast(file.thumbUrl);
        // const image = new Image();
        // image.setAttribute('crossOrigin', 'anonymous');
        // const canvas = document.createElement('canvas');
        // canvas['width']=image.width;
        // canvas['height']=image.height;
        // canvas['download'] = file.name;
        // var d = document.getElementById("cavasimg");
        // var imgdata = canvas.toDataURL(fileExt)
        // var fixtype = function (type) {

        //     type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');

        //     var r = type.match(/png|jpeg|bmp|gif/)[0];

        //     return 'image/' + r;

        // };
        // imgdata = imgdata.replace(fixtype(fileExt), 'image/octet-stream');

        // var filename = '' + new Date().getSeconds() + '.' + fileExt;
        // this.savaFile(imgdata,filename);
        /**图片下载 */
        // var filename = '' + new Date().getSeconds() + '.' + fileExt;
        // savaFile(imgdata,filename);
        if (/^img\[jpeg|jpg|pen|gif]/.test(fileExt)) {
            const image = new Image();
            // 解决跨域canvas污染问题
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = file.thumbUrl;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas['width'] = image.width;
                canvas['height'] = image.height;
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                let url = canvas.toDataURL(file.thumbUrl);
                var fixtype = function (type) {

                    type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');

                    var r = type.match(/png|jpeg|bmp|gif/)[0];

                    return 'image/' + r;

                };
                url = url.replace(fixtype(fileExt), 'image/octet-stream');
                const a = document.createElement('a');
                const ev = new MouseEvent('click');
                a.href = url;
                a.download = file.name;
                // canvas.download = file.name;
                // canvas.href = file.thumbUrl;
                // canvas.click();
                a.dispatchEvent(ev)
                document.execCommand("SaveAs");
            }
        }
    }
    close(): void {
        this.avatar = null
        this.visible = false
    }


}
