import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NzResizeEvent } from "ng-zorro-antd/resizable";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { CrudComponent } from "~/shared/common/crud/crud.component";
import { AuthService } from "~/shared/services/http/auth.service";
import { UtilService } from "~/shared/services/util.service";
import { EditComponent } from "./version/edit/edit.component";
declare var $: any;
@Component({
    selector: 'app-language',
    templateUrl: './language.component.html',
    styleUrls: ['./language.component.less']
})
export class LanguageComponent extends ListTemplateComponent {
    constructor(private authService: AuthService, public router: Router,) {
        super();
        this.url = router.url.replace(/\//g, "_")
        if (this.url.indexOf("_") == 0) {
            this.url = this.url.substring(1, this.url.length)
        }
        this.modularInit("sysLanguage");
        this.btnGroup = this.authService.getBtn(this.url);
    }
    @ViewChild('crud', { static: false }) _crud: CrudComponent;
    @ViewChild('fixedTable', { static: false }) _fixedTable: ElementRef;
    @ViewChild('edit', { static: false }) _edit: EditComponent;
    Otherlanguag: string[] = []
    btnGroup: any;
    dynamicColumns: any[] = []
    loading = false;
    nodes: any = [];
    /**是否全选 */
    allChecked = false;
    /**选择框状态 */
    indeterminate = false;
    editId: string | null = null;
    btnGroupW() {
        let w = 32;
        if (this.btnGroup.single) {
            let n = this.btnGroup.single.filter(c => !c.icon);
            if (!n) n = new Array();
            n.forEach((w, i) => { w = w + (14 * w.name.length); });
            w = w + (this.btnGroup.single.length - n.length) * 14;
            w = w + ((this.btnGroup.single.length) * 18);
        }
        if (this.btnGroup.extend && this.btnGroup.extend.length > 0) w = w + 14;
        return w
    }
    print = (v) => { return v.toLowerCase() }
    transform(list) {
        this.list = new Array();
        let _body = new Array();
        let _columns = new Array();
        this.dynamicColumns = [...this.columns];
        this.Otherlanguag = list.title;
        list.title.map((l) => {
            _columns.push({ coums: l.language, width: "100px", type: 'number', name: l.languagename, data: l })
        });
        this.dynamicColumns.splice(1, 0, ..._columns)
        list.data.forEach((v) => {
            let model: any = { slo_key: v.key, default: v.originaltext }
            if (v.slt_list && v.slt_list.length > 0) {
                v.slt_list.forEach((s) => {
                    if (s.slv_language) {
                        model[s.slv_language + 'key'] = s.key ? s.key : '';
                        model[s.slv_language + 'slv_key'] = s.slv_key;
                        model[s.slv_language] = s.translatetext;
                    }
                });
            }
            list.title.map((ol) => {
                if (!model[ol.language + 'slv_key']) {
                    model[ol.language] = '';
                    model[ol.language + 'slv_key'] = ol.key;
                }
            });
            _body.push(model);
        });
        this.list = this.list.concat(..._body);
        this.loading = false;
        UtilService.uniq(this.list)
        this.searchData(true)
    }
    /**更新数据 */
    searchData(reset: boolean = false): void {
        if (reset) {
            this.pageMap.pageIndex = 1;
        }
        this.checkAll(false);
        this.getTableScrollToTop();
        this.loading = false;
        this.nodes = this.list
    }
    /**全选 */
    checkAll(value: boolean): void {
        if (!this.nodes) this.nodes = [];
        this.nodes.forEach(_d => {
            if (!_d.disabled) {
                _d.checked = value;
            }
        });
        this.selectRow();
    }
    /**选择 */
    select(item) {
        item.checked = !item.checked;
        this.selectRow();
    }
    /**选择 */
    selectRow() {
        const validData = this.nodes.filter(value => !value.disabled);
        const allChecked = validData.length > 0 && validData.every(value => value.checked === true);
        const allUnChecked = validData.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = !allChecked && !allUnChecked;
        this._crud.setOfCheckedId = validData.filter(v => v.checked == true);
    }
    /**更改页数 */
    PageSizeChange(ev): void {
        this.pageMap.pagesize = ev;
        this._crud.onPage(this.pageMap);
        this.loading = true;
    }
    /**更改当前页码 */
    PageIndexChange(ev) {
        this.pageMap.page = parseInt(ev) ? parseInt(ev) : 1;
        this._crud.onPage(this.pageMap);
        this.loading = true;
    }
    //查询或翻页后将表格滚动条回归到顶部
    getTableScrollToTop() {
        if (this._fixedTable)
            this._fixedTable['elementRef'].nativeElement.querySelector('.ant-table-body').scrollTop = 0;
    }
    /**宽度调整 */
    onResize({ width }: NzResizeEvent, col: string): void {
        let sw = this.columns.reduce((a, b) => {
            let aw = typeof a == 'number' ? a : parseInt(a.width.split('px')[0]);
            let bw = parseInt(b.width.split('px')[0]);
            return aw + bw;
        }, 0)
        if (sw < $('.ant-table-header').width()) {
            let dvalue = 0;
            let currenti = 0;
            this.columns = this.columns.map((e, i) => {
                let ew = Math.ceil($('#' + e.coums).width());
                if (e.coums === col) {
                    dvalue = ew - Math.ceil(width);
                    currenti = i;
                    return { ...e, width: `${Math.ceil(width)}px` }
                } else if (i == currenti + 1) {
                    return { ...e, width: `${ew + dvalue}px` }
                }
                return e.width ? e : { ...e, width: (ew + 'px') }
            });
        } else
            this.columns = this.columns.map(e => (e.coums === col ? { ...e, width: `${width}px` } : e));
    }
    /**版本新增 */
    version(column?) {
        this._edit.open({ title: 'version', node: column })
    }
    /**版本删除 */
    delver(column) {
        super.Delete({ url: this.otherUrl.VerUrl, model: column, namefeild: 'languagename' }, (v) => { this._crud.reloadData(false) })
    }
    startEdit(id: string): void {
        if (id.search('default') >= 0 || this.editId == id) return;
        this.editId = id;
    }

    stopEdit(ev, m, i, language): void {
        ev.stopPropagation();
        if (!(ev && ev.keyCode !== 13) || ev.type == "blur") {
            if (!m[language] || m[language] == '') {
                this.editId = null;
                return;
            }
            let model = {
                key: m[language + 'key'],
                slo_key: m.slo_key,
                slv_key: m[language + 'slv_key'],
                slv_language: language,
                translatetext: m[language]
            };
            this._service.saveModel(this.otherUrl.updata, 'put', model, (v) => {
                this._crud.GetList();
                this.editId = null;
            }, (err) => { })
            this.editId = null;
        }
    }
    operation(ev, data) {
        this._crud.onAction({ action: ev, node: data })
    }
    // clang(ev) {
    //   this.SearchModel.Language = ev;
    //   if (this.active == 'Exp') {
    //     let _SearchModel = Object.assign({}, this.SearchModel, this.seniorModel);
    //     super.Exp(_SearchModel);
    //   }
    //   if (this.active == 'Imp') {
    //     super.openModal({ modular: this.modular, xlsurl: this.otherUrl.xlsurl }, ImpTemplateComponent, { title: this.buttonList.imp, size: 'min' }, { key: ev }, null, (data) => {
    //       this.isExp = false;
    //     });

    //   }
    // }
}