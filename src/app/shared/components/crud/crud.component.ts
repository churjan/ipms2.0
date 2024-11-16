import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { environment } from 'src/environments/environment';
import { AppService } from '~/shared/services/app.service';
import { UtilService } from '~/shared/services/util.service';
import * as moment from 'moment';

@Component({
    selector: 'crud',
    templateUrl: './crud.component.html',
    styleUrls: ['./crud.component.less']
})
export class CrudComponent implements OnInit {
    /**顶部 */
    top: ElementRef
    /**搜索操作 */
    @ViewChild("searchActionsBody") searchActionsEle: ElementRef
    /**顶部右侧 */
    @Input() topRightActionsTpl: ElementRef
    /**服务 */
    @Input() service: any
    /**列表数据 */
    data: Array<any>
    /**加载 */
    loading: boolean = false
    /**条数汇总 */
    total: number = 0
    /**查询参数 */
    queryParams: any = {
        pageSize: environment.defaultPageSize,
        page: 1
    }
    /***验证表单 */
    validateForm!: FormGroup
    /**选中参数 */
    setOfCheckedId = new Set<string>()
    /*显示高级搜索*/
    @Input() showAdvancedSearch: boolean = false
    /**样式显示 */
    advancedActive: boolean = false
    /**打开过滤器返回事件 */
    @Output() onFilterOpen = new EventEmitter<any>()
    /**重置返回事件 */
    @Output() onReset = new EventEmitter()
    /**过滤器开启 */
    filterOpen: boolean = false
    /**关键字默认文字 */
    @Input() keywordPlaceholder: string = null
    /**关键字绑定字段 */
    @Input() keywordKey: string = 'keywords'
    /**列表url地址对应字段 */
    @Input() listFun: string = 'list'
    /**额外查询参数 */
    @Input()
    set extraQueryParams(value: object) {
        this.queryParams = Object.assign(this.queryParams, value)
        this.extraQueryParamsCopy = value
    }
    /**额外查询参数复制 */
    extraQueryParamsCopy: any = {}
    /**显示页面容器 */
    @Input() showInPageContainer: boolean = true
    /**显示表格顶部 */
    @Input() showTableTop: boolean = true
    /**是否显示 */
    @Input() ready: boolean = true
    /**额外重置参数 */
    @Input() exceptResetParams: string[] = []

    /* ******************表格属性******************************** */
    /**最后一列 */
    @Input() lastColumnTpl: ElementRef
    /**最后一列宽度 */
    @Input() lastColumnWidth: string = "80px"
    /**最后一列标题 */
    @Input() lastColumnTitle: string = null
    /**列表表头 */
    @Input() columns: any[] = []
    /**格式化对象 */
    @Input() tpls: object = {}
    /**显示所选内容 */
    @Input() showSelection: boolean = true
    /**显示索引 */
    @Input() showIndex: boolean = true
    /**x轴滚动 */
    @Input() xScroll: string = "600px"
    /**y轴滚动 */
    @Input() yScroll: string = null
    /**是否在前端对数据进行分页，如果在服务器分页数据或者需要在前端显示全部数据时传入 false */
    @Input() frontPagination: boolean = false
    /**遮挡层 */
    @Input() maskAlert: boolean = false
    /**抽屉标题高度 */
    @Input() drawerTitleHeight: number = 48

    constructor(
        private fb: FormBuilder,
        private appService: AppService,
        private message: NzMessageService,
        private modal: NzModalService,
        private utilService: UtilService,
    ) { }

    ngOnInit(): void {
        const validateForm = {}
        validateForm[this.keywordKey] = [null]
        this.validateForm = this.fb.group(validateForm)
        if (!this.keywordPlaceholder) {
            this.keywordPlaceholder = this.appService.translate("inputdata.input_xx2", this.appService.translate("placard.keyword"))
        }
        setTimeout(() => {
            this.top = this.searchActionsEle
        }, 200)
    }

    //关键词搜索
    keywordSearch() {
        for (let key in this.validateForm.value) {
            if (typeof this.validateForm.value[key] == 'string') {
                const temp = {}
                temp[key] = this.validateForm.value[key].trim()
                this.validateForm.patchValue(temp)
            }
        }
        this.queryByParams(this.validateForm.value)
    }

    //重置
    reset() {
        /* this.validateForm.reset()
        this.keywordSearch() */

        this.validateForm.reset()
        const exceptResetParams = {}
        if (this.exceptResetParams?.length > 0) this.exceptResetParams.forEach(field => exceptResetParams[field] = this.queryParams[field])
        const { pageSize } = this.queryParams
        const extraQueryParamsCopy = JSON.parse(JSON.stringify(this.extraQueryParamsCopy))
        this.queryParams = Object.assign(extraQueryParamsCopy, exceptResetParams, { pageSize, page: 1 })
        this.loadDataFromServer()
        this.advancedActive = false
        this.onReset.emit()
    }

    //高级搜索
    advancedSearch(queryParams) {
        const length = Object.values(queryParams).filter((item: any) => {
            if (item instanceof Array) {
                return item.length > 0
            } else {
                return item !== null
            }
        }).length
        this.advancedActive = length > 0 ? true : false
        this.queryByParams(queryParams)
    }

    queryByParams(params) {
        this.queryParams = Object.assign(this.queryParams, params, { page: 1 })
        this.loadDataFromServer()
    }

    loadDataFromServer(): void {
        this.loading = true
        const fun = `this.service.${this.listFun}(this.queryParams)`
        eval(fun).then(({ total, data }) => {
            this.total = total
            this.data = data
        }).finally(() => {
            this.loading = false
        })
    }

    onQueryParamsChange(params): void {
        const { pageSize, pageIndex, sort } = params
        this.queryParams = Object.assign(this.queryParams, { page: pageIndex, pageSize, sort })
        this.loadDataFromServer()
    }
    /**重置 */
    reloadData(bool) {
        if (bool) {
            //不重置搜索条件，只重置页码
            this.queryParams = Object.assign(this.queryParams, { page: 1 })
        }
        this.loadDataFromServer()
    }

    //删除
    delete(record?) {
        let data = []
        if (!record) {
            data = [...this.setOfCheckedId].map(item => {
                return { key: item }
            })
            if (data.length <= 0) {
                this.message.warning(this.appService.translate("checkdata.check_leastoneledata"))
                return false
            }
        } else {
            data = [{ key: record.key }]
        }
        this.modal.confirm({
            nzTitle: this.appService.translate("confirm.confirm_del"),
            nzMaskClosable: true,
            nzOnOk: () => {
                this.service.del(data).then(() => {
                    this.loadDataFromServer()
                })
            }
        })
    }
    /**下载 */
    download() {
        this.service.export(this.queryParams).then((response: ArrayBuffer) => {
            const blob = new Blob([response], { type: "application/vnd.ms-excel;charset=utf-8" })
            const fileName = `${moment(Date.now()).format("YYYYMMDDHHmmss")}.xlsx`
            this.utilService.downloadBlob(blob, fileName)
        })
    }
}
