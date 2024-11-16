import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '~/shared/services/http/common.service';
import { TagsService } from '~/pages/pm/tags/tags.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppConfig } from "~/shared/services/AppConfig.service";
import { ZPageComponent } from '~/shared/components/zpage/zpage.component';
import { SelectService } from '~/shared/services/http/select.service';
import { UtilService } from '~/shared/services/util.service';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { environment } from '@/environments/environment';
import { RequestService } from '~/shared/services/request.service';
import { I18nPipe } from '~/shared/pipes/i18n.pipe';


@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.less'],
    providers: [I18nPipe]
})
export class TagsComponent implements OnInit {
    openLeft: boolean = false;//是否开启左边树区域
    leftTreeTitle: string = "";//左边树区域标题
    isAdvancedSearch: boolean = true;//是否开启高级搜索
    isTablePage: boolean = true;//是否开启单独的翻页
    isCheck: boolean = true;//是否开启表格复选 默认开启
    isCheckAll: boolean = true;//是否开启表格全选 默认开启
    isNumber: boolean = true;//是否开启序列 默认开启
    isOperation: boolean = true;//是否开启表格内操作栏 默认关闭
    pageSizeOptions = [20, 30, 100, 200, 300, 400];

    //查询参数
    queryParams = {
        keywords: "",
        pwb_key: "",//作业单号key
        psi_key: "",//款式key
        bpi_key: "",//部件key
        bpi_ismain: "",//是否主部件
        style: "",//类型
        tagcode: "",//条码
        statestr: "",//状态
        sort: "",//以哪个字段进行排序
        dortDirections: "",//排序方式 支持的排序方式，取值为 'asc', 'desc', null
        page: 1,//当前第几页
        pageSize: 20,//每页显示条数
        serialcode_start: "",//流水号区间开始
        serialcode_end: "",//流水号区间结束
        serialcode: "",//流水号
    };
    statestr: any[] = [];//状态
    searchtype: string = '0'//查询类型
    /* ******************表格属性******************************** */
    setOfCheckedId = new Set<string>();//表格回传回来的当前已选择的数据key
    tableLoading: boolean = false;
    tableData = [];
    columns: any[] = [];
    total: number = 0;//总条数

    // -----------------以下 弹窗参数-----------------
    isPopup: boolean = false;//是否打开窗口
    isPopupImport: boolean = false;//是否打开导出窗口
    isPopupConfirm: boolean = false;//是否打开删除窗口
    isLoading: boolean = false;//是否打开确定按钮的加载
    validateForm!: FormGroup;//校验
    popupType: string = "";//类型 add新增 update修改 del删除
    zpopupTiele: string = "";//弹窗标题
    delDataNum: number = 0;//删除条数

    //-----------------以下 标签重生产弹窗参数-----------------
    isPopupReProduction: boolean = false;//是否打开标签重生产窗口
    reProductionData = [];//标签重生产数据
    ReProductionCurrentPageData: any[] = [];//当前标签重生产数据备份
    reProductionLoading: boolean = false;//是否打开标签重生产表格加载
    reProductionIndeterminate: boolean = false;
    reProductionChecked: boolean = false;
    setOfReProductionCheckedId = new Set<string>();//标签重生产已选择的数据key

    //----------------以下 查看弹窗参数----------------------------
    isPopupSee: boolean = false;//是否打开查看弹窗
    isSeeLoading: boolean = false;
    seeData = {};//基本信息
    finishedData: any[] = [];//成品码数据
    partsData: any[] = [];//部件码数据

    //--------------以下 条形码弹窗参数 ----------------------------
    isPopupBarCode: boolean = false;//是否打开查看弹窗
    barCode: string = "";//条形码值

    //--------------以下 打印弹窗参数 ----------------------------
    isPrintLoading: boolean = false;//是否打开加载
    isPopupPrint: boolean = false;//是否打开查看弹窗
    barCodeList: any[] = [];//条形码code集合

    @ViewChild('zpage') zpage: ZPageComponent;
    constructor(
        public tagsService: TagsService,
        private fb: FormBuilder,
        private message: NzMessageService,
        private selectService: SelectService,
        private util: UtilService,
        private request: RequestService,
        private i18nPipe: I18nPipe
    ) { }

    //分配头部按钮的执行方法
    getTopBtn(event) {
        switch (event.name) {
            case "printing": this.DefaultPrint(); this.toPrint(); break;
            case "imp": this.toImport(); break;
            default: break;
        }
    }
    //分配表格按钮的执行方法
    getTableBtn(event) {
        switch (event.name) {
            case "adj": this.toReProduction(event.item); break;
            case "details": this.toProgress(event.item); break;
            case "see": this.toSee(event.item); break;
            default: break;
        }
    }

    ngOnInit(): void {
        this.onTypeSearch();
        this.onStateSearch();
        // this.onWrokSearch(null);

        this.searchtype = localStorage.getItem("searchtype") ? localStorage.getItem("searchtype") : '0'
        this.columns = this.tagsService.tableColumns();
        this.toSearch(1);
    }

    //重置查询
    resetSearch(type) {
        if (type == 1) {
            this.queryParams = {
                keywords: "",
                pwb_key: "",//作业单号key
                psi_key: "",//款式key
                bpi_key: "",//部件key
                bpi_ismain: "",//是否主部件
                style: "",//类型
                tagcode: "",//条码
                statestr: "",//状态
                sort: "",//以哪个字段进行排序
                dortDirections: "",//排序方式 支持的排序方式，取值为 'asc', 'desc', null
                serialcode_start: "",//流水号区间开始
                serialcode_end: "",//流水号区间结束
                serialcode: "",//流水号
                page: 1,//当前第几页
                pageSize: 20,//每页显示条数
            };
        }
        if (type == 2) {
            this.queryParams.pwb_key = "";
            this.queryParams.psi_key = "";
            this.queryParams.bpi_key = "";
            this.queryParams.bpi_ismain = "";
            this.queryParams.style = "";
            this.queryParams.tagcode = "";
            this.queryParams.statestr = "";
            this.statestr = [];
            this.queryParams.sort = "";
            this.queryParams.dortDirections = "";
            this.queryParams.page = 1;
            this.queryParams.pageSize = 20;
            serialcode_start: "";//流水号区间开始
            serialcode_end: "";//流水号区间结束
            serialcode: "";//流水号
        }
        this.toSearch(1);
    }

    //重置表单内容
    resetForm() {
        // this.validateForm.setValue({code:"",name:"",customcode:"",description:""});
        this.validateForm.reset();//重置表单校验
    }

    //查询
    toSearch(type: number = 1) {
        if (type == 1) {
            //需要把页码改为1的
            this.queryParams.page = 1;
        }
        this.tableLoading = true;
        this.queryParams.statestr = this.statestr.join(",");
        this.tagsService.getList(this.queryParams).then((res: any) => {
            this.tableData = res.data;
            this.total = res.total;
            this.zpage.getTableScrollToTop();//表格滚动条回滚到顶部
            this.setOfCheckedId.clear();//清除选中项
            this.tableLoading = false;
        }, () => { }).finally(() => {
            this.tableLoading = false;
        });
    }
    /**流水号查询类型修改 */
    searchtypechange() {
        localStorage.setItem("searchtype", this.searchtype)
    }
    //页码改变的回调
    pageIndexChange(number) {
        this.queryParams.page = number;
        this.toSearch(2);
    }

    //每页条数改变的回调
    pageSizeChange(number) {
        this.queryParams.pageSize = number;
        this.toSearch(1);
    }

    //表格复选选中key的回传函数
    getCheckedId(idList) {
        this.setOfCheckedId = idList;
    }

    //排序回调
    getSortList(list) { }

    //按钮-标签重生产
    reProductionKey = "";
    toReProduction(item) {
        if (this.util.isAbnormalValue(item.key)) {
            this.reProductionKey = item.key;
            this.zpopupTiele = this.i18nPipe.transform('btn.re_production');
            this.isPopupReProduction = true;
            this.reProductionLoading = true;
            this.tagsService.new({ pti_key: item.key, seq: 1 }).then((res: any) => {
                this.reProductionData = res;
            }, () => { }).finally(() => {
                this.reProductionLoading = false;
            })
        } else {
            this.message.create('warning', this.util.getComm('warning.NoNote'));
        }
    }

    //按钮-标签重生产-删除
    delReProduction() {
        if (this.setOfReProductionCheckedId.size > 0) {
            let keyList = [];
            for (let key of this.setOfReProductionCheckedId) {
                keyList.push({ key: key });
            }
            this.tagsService.delReProduction(keyList).then((res: any) => {
                this.message.success(this.util.getComm('sucess.s_delete'));
                this.reProductionLoading = true;
                this.tagsService.new({ pti_key: this.reProductionKey, seq: 1 }).then((res: any) => {
                    this.reProductionData = res;
                }, () => { }).finally(() => {
                    this.reProductionLoading = false;
                })
            });
        } else {
            this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
        }
    }

    //按钮-标签重生产-删除全部完工信息
    delAllReProduction() {
        if (this.setOfReProductionCheckedId.size > 0) {
            this.tagsService.delAllReProduction({ key: this.reProductionKey }).then((res: any) => {
                this.message.success(this.util.getComm('sucess.s_delete'));
                this.reProductionLoading = true;
                this.tagsService.new({ pti_key: this.reProductionKey, seq: 1 }).then((res: any) => {
                    this.reProductionData = res;
                }, () => { }).finally(() => {
                    this.reProductionLoading = false;
                })
            });
        } else {
            this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
        }
    }

    //按钮-查看
    toSee(item) {
        if (this.util.isAbnormalValue(item.key)) {
            this.zpopupTiele = this.i18nPipe.transform('btn.see');
            this.isPopupSee = true;
            this.isSeeLoading = true;
            this.tagsService.see(item.key).then((res: any) => {
                this.seeData = res;
                this.tagsService.parts({ tagcode: item.tagcode }).then((res2: any) => {
                    for (let one of res2) {
                        if (one.style == 1) {
                            this.finishedData = one.pti_list;
                        }
                        if (one.style == 2) {
                            this.partsData = one.pti_list;
                        }
                    }
                })
            }, () => { }).finally(() => {
                this.isSeeLoading = false;
            });

        } else {
            this.message.create('warning', this.util.getComm('warning.NoNote'));
        }
    }
    //按钮-查看-搜索
    toSeeIn(item) {
        if (this.util.isAbnormalValue(item.key)) {
            this.isSeeLoading = true;
            this.tagsService.see(item.key).then((res: any) => {
                this.seeData = res;
                this.tagsService.parts({ tagcode: item.tagcode }).then((res2: any) => {
                    for (let one of res2) {
                        if (one.style == 1) {
                            this.finishedData = one.pti_list;
                        }
                        if (one.style == 2) {
                            this.partsData = one.pti_list;
                        }
                    }
                }, () => { })
            }, () => { }).finally(() => {
                this.isSeeLoading = false;
            });

        } else {
            this.message.create('warning', this.util.getComm('warning.NoNote'));
        }
    }

    //条形码
    toBarCode(code) {
        this.zpopupTiele = this.i18nPipe.transform('popupField.bar_code');
        this.isPopupBarCode = true;
        this.barCode = code;
    }

    //按钮-导入
    toImport() {
        this.zpopupTiele = this.i18nPipe.transform('btn.import');
        this.isPopupImport = true;
    }

    //按钮-进度详情
    toProgress(item) {
        window.open('#/hanger/' + item.tagcode);
    }
    configItem: any = {};
    isCollapsed = false;
    Custom: any = {}
    // allDail = new Array();
    allChecked = false;
    indeterminate = true;
    node: any = {}
    DefaultPrint() {
        this.request.getSync('../assets/address/printSet.json', (data) => {
            let _allDail = new Array();
            data.allDail.forEach(da => {
                _allDail.push({
                    label: this.i18nPipe.transform('pmTags.' + da),
                    value: da,
                    checked: data.showDail.find(s => s == da) ? true : false
                })
            })
            this.configItem = Object.assign(data, { allDail: _allDail });
            this.Custom = Object.assign({}, {
                boxW: (data.boxW / 43) * 5,
                boxH: (data.boxH / 43) * 5,
                showDail: data.showDail,
                lineheight: this.proportion(data.contentTitle["height"], 'px'),
                // 属性值样式设置
                datawidth: this.proportion(data.contentData.width, '%', data.boxW - 22),
                Datafontsize: this.proportion(data.contentData["font-size"], 'px'),
                // 属性名样式设置
                titlewidth: this.proportion(data.contentTitle.width, '%', data.boxW - 22),
                titlefontsize: this.proportion(data.contentTitle["font-size"], 'px'),
                // 孔洞样式设置
                ishole: data.ishole,
                rheight: this.proportion(data.reserved.height, '%', data.boxH),
                // 副标题样式设置
                istime: data.istime,
                theight: this.proportion(data.subtitle.height, 'px'),
                // 条形码参数设置
                bartype: data.bartype,
                size: data.size,
                barheight: this.proportion(data.barcode.height, '%', data.boxH),
                barwidth: this.proportion(data.barcode.width, '%', data.boxW - 22),
                bartextalign: data.barcode["text-align"],
                bcwidth: data.bcwidth
            });
        });
    }
    //按钮-打印
    toPrint() {
        if (this.setOfCheckedId.size > 0) {
            this.barCodeList = [];//重置
            this.zpopupTiele = this.i18nPipe.transform('btn.print_preview');
            this.isPopupPrint = true;
            this.isPrintLoading = true;
            this.isCollapsed = true;
            this.util.comList('SystemInfo/getuisetting', { key: 'printSet' }, '', false).then((v) => {
                if (v) {
                    this.node = JSON.parse(v.settingstr);
                    if (this.node.printset) {
                        this.configItem = Object.assign(this.configItem, this.node[this.node.printset])
                        let data = this.configItem;
                        this.Custom = Object.assign({}, {
                            boxW: (data.boxW / 43) * 5,
                            boxH: (data.boxH / 43) * 5,
                            // showDail: data.showDail,
                            lineheight: this.proportion(data.contentTitle["height"], 'px'),
                            // 属性值样式设置
                            datawidth: this.proportion(data.contentData.width, '%', data.boxW - 22),
                            Datafontsize: this.proportion(data.contentData["font-size"], 'px'),
                            // 属性名样式设置
                            titlewidth: this.proportion(data.contentTitle.width, '%', data.boxW - 22),
                            titlefontsize: this.proportion(data.contentTitle["font-size"], 'px'),
                            // 孔洞样式设置
                            ishole: data.ishole,
                            rheight: this.proportion(data.reserved.height, '%', data.boxH),
                            // 副标题样式设置
                            istime: data.istime,
                            theight: this.proportion(data.subtitle.height, 'px'),
                            // 条形码参数设置
                            bartype: data.bartype,
                            size: data.size,
                            barheight: this.proportion(data.barcode.height, '%', data.boxH),
                            barwidth: this.proportion(data.barcode.width, '%', data.boxW - 22),
                            bartextalign: data.barcode["text-align"],
                            bcwidth: data.bcwidth
                        });
                    }
                };
            })
            let date = UtilService.dateFormat(new Date())
            for (let item of this.tableData) {
                for (let item2 of this.setOfCheckedId) {
                    if (item2 == item.key) {
                        if (item.style != 1 && item.style != 3) {
                            item.time = date;
                            this.barCodeList.push(item);
                        }
                    }
                }
            }
            this.isPrintLoading = false;
        } else {
            this.message.create('warning', this.util.getComm('checkdata.check_leastoneledata'));
        }
    }
    proportion(obj, unit, all?): number {
        let convert: number
        switch (unit) {
            case '%':
                convert = (Math.round(Number(obj.replace(unit, '')) * all) / 100);
                break;
            case 'px':
                convert = obj.replace(unit, '')
                break;
            case 'num':
                convert = Math.round((obj / all) * 10000) / 100
                break;
            default:
                break;
        }
        return convert
    }
    transform(n) {
        return Number(n)
    }
    updateAllChecked(): void {
        this.indeterminate = false;
        if (this.allChecked) {
            if (!this.Custom.showDail) this.Custom.showDail = new Array()
            this.configItem.allDail = this.configItem.allDail.map(item => {
                // this.Custom.showDail.push(item.value)
                this.log(true, item.value)
                return {
                    ...item,
                    checked: true
                };
            });
        } else {
            this.configItem.allDail = this.configItem.allDail.map(item => {
                this.log(false, item.value)
                return {
                    ...item,
                    checked: false
                };
            });
            // this.Custom.showDail = new Array()
        }
    }

    log(ev, id): void {
        if (!this.configItem.showDail) this.configItem.showDail = new Array()
        if (ev == true) {
            if (this.configItem.showDail.find(ss => ss == id)) { return; } else this.configItem.showDail.push(id)
        } else {
            let num = this.configItem.showDail.findIndex(s => s == id)
            this.configItem.showDail.splice(num, 1)
        }
        if (this.configItem.allDail.every(item => item.checked === false)) {
            this.allChecked = false;
            this.indeterminate = false;
        } else if (this.configItem.allDail.every(item => item.checked === true)) {
            this.allChecked = true;
            this.indeterminate = false;
        } else {
            this.indeterminate = true;
        }
    }
    update() {
        const { boxW, boxH, titlefontsize, titlewidth, lineheight, Datafontsize, datawidth, ishole, istime, rheight, theight } = this.Custom;
        let { bartype, size, barwidth, barheight, barmargin, bartextalign, bcwidth } = this.Custom;
        this.configItem.boxW = (boxW / 5) * 43;
        this.configItem.boxH = (boxH / 5) * 43;
        /**属性样式设置 */
        this.configItem.contentBack = Object.assign(this.configItem.contentBack, {
            height: lineheight ? (lineheight + 'px') : this.configItem.contentBack.height,
        })
        /**属性名样式设置 */
        this.configItem.contentTitle = Object.assign(this.configItem.contentTitle, {
            'font-size': titlefontsize ? (titlefontsize + 'px') : this.configItem.contentTitle["font-size"],
            width: titlewidth ? (this.proportion(titlewidth, 'num', this.configItem.boxW - 22) + '%') : this.configItem.contentTitle.width,
            height: lineheight ? (lineheight + 'px') : this.configItem.contentTitle.height,
            "line-height": lineheight ? (lineheight + 'px') : this.configItem.contentTitle["line-height"],
        })
        /**属性值样式设置 */
        this.configItem.contentData = Object.assign(this.configItem.contentData, {
            'font-size': Datafontsize ? (Datafontsize + 'px') : this.configItem.contentData["font-size"],
            width: datawidth ? (this.proportion(datawidth, 'num', this.configItem.boxW - 22) + '%') : this.configItem.contentData.width,
            height: lineheight ? (lineheight + 'px') : this.configItem.contentData.height,
            "line-height": lineheight ? (lineheight + 'px') : this.configItem.contentData["line-height"],
        })
        /**孔洞样式设置 */
        this.configItem.ishole = ishole;
        this.configItem.reserved = Object.assign(this.configItem.reserved, {
            // width: this.Custom.rwidth ? (this.Custom.rwidth + 'px') : this.configItem.reserved.width,
            height: rheight ? (this.proportion(rheight, 'num', this.configItem.boxH) + '%') : this.configItem.reserved.height,
        })
        /**副标题样式设置 */
        this.configItem.istime = istime;
        this.configItem.subtitle = Object.assign(this.configItem.subtitle, {
            // width: this.Custom.twidth ? (this.Custom.twidth + 'px') : this.configItem.subtitle.width,
            height: theight ? (theight + 'px') : this.configItem.subtitle.height,
        })
        /**条形码参数设置 */
        this.configItem.bartype = bartype ? bartype : this.configItem.bartype;
        this.configItem.size = size ? size : this.configItem.size;
        if (bartype == 'qr') {
            // console.log(this.configItem, this.proportion(size, 'num', this.configItem.boxW - 22), this.proportion(size, 'num', this.configItem.boxH))
            this.configItem.barcode = Object.assign(this.configItem.barcode, {
                width: barwidth ? this.proportion(size, 'num', this.configItem.boxW - 22) + '%' : this.configItem.barcode.width,
                height: barheight ? this.proportion(size + 20, 'num', this.configItem.boxH) + '%' : this.configItem.barcode.height,
            })
        } else {
            this.configItem.barcode = Object.assign(this.configItem.barcode, {
                width: barwidth ? this.proportion(barwidth, 'num', this.configItem.boxW - 22) + '%' : this.configItem.barcode.width,
                height: barheight ? this.proportion(barheight, 'num', this.configItem.boxH) + '%' : this.configItem.barcode.height,
                margin: barmargin ? barmargin : this.configItem.barcode.margin,
                "text-align": bartextalign ? bartextalign : this.configItem.barcode["text-align"],
            })
            this.configItem.bcwidth = bcwidth ? bcwidth : this.configItem.bcwidth
        }
    }
    setSubmit() {
        const { boxW, boxH } = this.Custom
        let body = Object.assign({}, this.node)
        body.printset = 'print' + boxW + "*" + boxH
        body[body.printset] = this.configItem
        this.util.saveModel('SystemInfo/saveuisetting', 'post', { key: 'printSet', settingstr: JSON.stringify(body) }, (s) => { this.message.success(this.i18nPipe.transform('sucess.s_Config')) })
    }
    //具体打印方法
    printSubmit() {
        const printContent = document.getElementById("printPaly");
        let WindowPrt = window.open('print', 'print', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
        WindowPrt.document.write(printContent.innerHTML);
        // this.printStyle(WindowPrt,"/plan/tags/tags-print.css",null);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
    }

    //获取款式
    styleList: any[] = [];//款式数据
    styleLoading: boolean = false;//远程获取款式数据时的加载
    styleI: number = 1;
    styleSum: number = 10;//当前页面总条数 默认一页10条
    styleValue = "";//记录输入款式值
    toStyleDown(event) {
        this.styleLoading = true;
        this.selectService.styleDown({ keywords: event, page: this.styleI, pagesize: 999999 }).then((res: any) => {
            this.styleLoading = false;
            this.styleList = res.data;
            //判断这个查询的值 是否是最后那个值，不是的话 再进行查询
            if (this.styleValue !== event) {
                this.toStyleDown(this.styleValue);
            }
        }).finally(() => {
            this.styleLoading = false;
        });
    }
    onStyleSearch(event) {
        this.styleValue = event;

        if (this.util.isAbnormalValue(event)) {
            this.styleI = 1;
            this.styleList = [];
            //判断当前加载是否已经执行完成，未执行完成不进入方法
            if (!this.styleLoading) {
                this.toStyleDown(event);
            }
        } else {
            if (event === "") {
                this.styleI = 1;
                this.styleSum = 10;
                this.styleList = [];
            }
            if (this.styleSum == 10) {
                this.styleLoading = true;
                this.selectService.styleDown({ page: this.styleI, pagesize: 10 }).then((res: any) => {
                    this.styleSum = res.data.length;
                    this.styleLoading = false;
                    if (res.data.length == 10 && this.styleI * 10 < res.total) {
                        this.styleList = [...this.styleList, ...res.data];
                        this.styleI++;
                    } else if (this.styleI == 1) {
                        this.styleList = res.data;
                    }
                }).finally(() => {
                    this.styleLoading = false;
                });
            }
        }
    }

    //获取部件
    bpiList: any[] = [];//数据
    bpiLoading: boolean = false;//远程获取数据时的加载
    onBpiSearch(event) {
        this.bpiLoading = true;
        this.selectService.bpiDown({ keywords: event }).then((res: any) => {
            this.bpiList = res.data;
        }).finally(() => {
            this.bpiLoading = false;
        });
    }

    //获取类型
    typeList: any[] = [];//数据
    typeLoading: boolean = false;//远程获取数据时的加载
    onTypeSearch() {
        this.typeLoading = true;
        this.selectService.typeDown({ method: 'barcode' }).then((res: any) => {
            this.typeList = res;
        }).finally(() => {
            this.typeLoading = false;
        });
    }

    //获取作业单
    workList: any[] = [];//数据
    workLoading: boolean = false;//远程获取数据时的加载
    workI: number = 1;
    workSum: number = 10;//默认 10条
    workValue = "";//记录输入的值
    toWorkDown(event) {
        this.workLoading = true;
        this.selectService.workDown({ keywords: event, page: this.workI, pagesize: 999999 }).then((res: any) => {
            this.workLoading = false;
            this.workList = res.data;
            //判断这个查询的值 是否是最后那个值，不是的话 再进行查询
            if (this.workValue !== event) {
                this.toWorkDown(this.workValue);
            }
        }).finally(() => {
            this.workLoading = false;
        });
    }
    onWrokSearch(event) {
        this.workValue = event;

        if (this.util.isAbnormalValue(event)) {
            this.workI = 1;
            this.workList = [];
            //判断当前加载是否已经执行完成，未执行完成不进入方法
            if (!this.workLoading) {
                this.toWorkDown(event);
            }
        } else {
            if (event === "") {
                this.workI = 1;
                this.workSum = 10;
                this.workList = [];
            }
            if (this.workSum == 10) {
                this.workLoading = true;
                this.selectService.workDown({ page: this.workI, pagesize: 10 }).then((res: any) => {
                    this.workSum = res.data.length;
                    this.workLoading = false;
                    if (res.data.length == 10 && this.workI * 10 < res.total) {
                        this.workList = [...this.workList, ...res.data];
                        this.workI++;
                    } else if (this.workI == 1) {
                        this.workList = res.data;
                    }
                }).finally(() => {
                    this.workLoading = false;
                });
            }
        }
    }


    //获取状态
    stateList: any[] = [];//数据
    stateLoading: boolean = false;//远程获取数据时的加载
    onStateSearch() {
        this.stateLoading = true;
        this.selectService.typeDown({ method: 'tagstatus' }).then((res: any) => {
            this.stateList = res;
        }).finally(() => {
            this.stateLoading = false;
        });
    }

    //上传
    upExcel() {
        return this.tagsService.upExcel();
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
            if (file.response.code == 0) {
                this.message.success(`${file.name} ` + file.response.message);
            } else {
                this.message.warning(`${file.name} ` + file.response.message);
            }

            this.isUpload = false;
        } else if (status === 'error') {
            this.message.error(`${file.name} ` + this.util.getComm('fail.f_uploader'));
            this.isUpload = false;
        }
    }

    //导入抬头添加token
    uploadingHeader() {
        const token = sessionStorage.ticket;
        return {
            token: token,
            language: localStorage.language
        }
    }

    //导入文件条件
    beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
        new Observable((observer: Observer<boolean>) => {
            let lastName = this.util.getFileLast(file.name);
            const isExcel = lastName === 'xls' || lastName === 'xlsx';
            if (!isExcel) {
                this.message.warning(this.util.getComm('warning.excel'));
                observer.complete();
                return;
            }
            // const isLt2M = file.size! / 1024 / 1024 < 2;
            // if (!isLt2M) {
            //   this.message.warning(this.util.getComm('warning.imageSize'));
            //   observer.complete();
            //   return;
            // }
            // observer.next(isJpgOrPng && isLt2M);
            observer.next(isExcel);
            observer.complete();
        });

    //按钮-导出
    toExport() {
        this.tagsService.export("tagsExport.xls", { keywords: this.queryParams.keywords })
    }

    //下载模版
    toExcelModel() {
        this.tagsService.downloadModel();
    }

    //关闭
    closePopup() {
        this.isPopup = false;
        this.isPopupConfirm = false;
        this.isPopupReProduction = false;//重生产窗口关闭
        this.setOfReProductionCheckedId.clear();
        this.isPopupImport = false;//导入窗口关闭
        this.isUpload = false;
        this.isPopupSee = false;//查看窗口关闭
        this.seeData = {};
        this.isSeeLoading = false;
        this.finishedData = [];
        this.partsData = [];
        this.isPopupBarCode = false;//条形码窗口关闭
        this.isPopupPrint = false;//打印窗口关闭
        this.isPrintLoading = false;//打印加载关闭
        this.isCollapsed = true;//自定义设置关闭
        // this.resetForm();
    }

    onReProductionCurrentPageDataChange($event: []): void {
        this.ReProductionCurrentPageData = $event;
        this.refreshReProductionCheckedStatus();
    }

    //标签重生产-全选
    onAllReProductionChecked(value: boolean): void {
        this.ReProductionCurrentPageData.forEach(item => this.updateReProductionCheckedSet(item.key, value));
        this.refreshReProductionCheckedStatus();
    }

    //标签重生产-单条复选事件
    onItemReProductionChecked(key: any, checked: boolean): void {
        this.updateReProductionCheckedSet(key, checked);
        this.refreshReProductionCheckedStatus();
    }

    //标签重生产-记录或删除被选择的key
    updateReProductionCheckedSet(key: any, checked: boolean): void {
        if (checked) {
            this.setOfReProductionCheckedId.add(key);
        } else {
            this.setOfReProductionCheckedId.delete(key);
        }
    }

    //校验是否被全选 并修改全选复选框的状态
    refreshReProductionCheckedStatus(): void {
        this.reProductionChecked = this.ReProductionCurrentPageData.every(item => this.setOfReProductionCheckedId.has(item.key));
        this.reProductionIndeterminate = this.ReProductionCurrentPageData.some(item => this.setOfReProductionCheckedId.has(item.key)) && !this.reProductionChecked;
    }
}
