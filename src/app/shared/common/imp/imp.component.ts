import { environment } from '@/environments/environment';
import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { AuthService } from '~/shared/services/http/auth.service';
import { FormTemplateComponent } from '../base/form-Template.component';

@Component({
    selector: 'imp',
    templateUrl: './imp.component.html',
    styleUrls: ['./imp.component.less']
})
export class ImpComponent extends FormTemplateComponent {
    @Output() editDone = new EventEmitter<boolean>()
    visible: boolean = false;
    top: ElementRef
    @Input() topRightActionsTpl: ElementRef
    @Input() service: any;
    /*******************路由参数******************************** */
    @Input() router: any;
    @Input() jsonname: any;
    @Input() field: any = {};
    @Input() ParamKey: any;
    /* ******************查询属性******************************** */
    SearchModel: any = {};

    /* ******************数据地址******************************** */
    @Input() impurl: string = 'impurl';
    @Input() xlsurl: string = 'xlsurl';

    @Input() fields: any = {}
    @Input() modular: any = {}
    loading: boolean = false
    /**上传成功返回数据 */
    node: any;
    /* ******************分页属性******************************** */
    total: number = 0
    @Input() options: any = {
        total: 1, //总条数
        pageList: [15, 30, 45, 50, 100, 200] //每页显示条数
    }
    queryParams: any = {
        pageSize: 15,
        page: 1
    }
    /**是否动态 */
    @Input() isdynamic = false;
    /**动态字段 */
    @Input() dynamicfield: string;
    /**动态字段排序 */
    @Input() dynamisort: number = 0;
    /**动态字段显示 */
    @Input() dynamishow: string;
    /*按钮权限 */
    btnGroup: any = {};
    FileList: NzUploadFile;
    // 修改后返回事件
    @Output() Page = new EventEmitter();
    // 点击返回事件
    @Output() turnclick = new EventEmitter();
    // 按钮点击返回事件
    @Output() actionClick = new EventEmitter();
    /**上传地址 */
    @Input() ActionUrl: string;
    constructor(
        private fb: FormBuilder, private authService: AuthService,
        private breakpointObserver: BreakpointObserver,
    ) { super() }

    ngOnInit(): void {
        this.otherUrl = this.modular.otherUrl;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '700px'
            } else {
                this.width = '100%'
            }
        })
    }
    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        this.key = record.node && record.node.key ? record.node.key : '';
        this.visible = true;
    }
    //下载模版
    toExcelModel() {
        if (!localStorage.language) { localStorage.language = 'zh'; }
        this._service.downloadModel('download/excel/' + localStorage.language + '/' + this.otherUrl[this.xlsurl]);
    }
    //上传
    upExcel() {
        if (!this.key || this.key == null) { this.key = ''; }
        return this._service.upExcel(this.otherUrl[this.impurl] ? this.otherUrl[this.impurl] : ('api/' + this.modular.url), this.key);
    }
    //导入抬头添加token
    uploadingHeader() {
        const token = sessionStorage.ticket;
        return {
            token: token,
            // authorization: 'authorization-text',
            language: localStorage.language
        }
    }
    //导入方法
    isUpload: boolean = false;
    importChange({ file, fileList }: NzUploadChangeParam): void {
        const status = file.status;
        const name = file.name;
        if (status === 'uploading') {
            this.isUpload = true;
        }
        if (status !== 'uploading') {
            this.isUpload = false;
        }
        if (status === 'done') {
            if (file.response['code'] == 0) {
                this.node = file;
                this.message.success(`${file.name} ` + this.getTipsMsg('sucess.s_upload'));
               
             if (this.editDone) {
                    this.editDone.emit(file.response.data); this.avatar = null
                    this.visible = false
                }
            } else if (file.response['code'] == 1) {
                this.message.error(`${file.name} ` + this.getTipsMsg('fail.f_uploader') + file.response.message);
                fileList.pop();
            }
            this.isUpload = false;
        } else if (status === 'error') {
            this.message.error(`${file.name} ` + this.getTipsMsg('fail.f_uploader'));
            fileList.pop();
            this.isUpload = false;
        }
    }
    //导入文件条件
    beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
        new Observable((observer: Observer<boolean>) => {
            let lastName = this._service.getFileLast(file.name);
            const isExcel = lastName === 'xls' || lastName === 'xlsx';
            if (!isExcel) {
                this.message.warning(this.getTipsMsg('warning.excel'));
                observer.complete();
                return;
            }
            observer.next(isExcel);
            observer.complete();
        });
    close() {
        this.avatar = null
        this.visible = false
        this.editDone.emit(this.node)
    }
}
