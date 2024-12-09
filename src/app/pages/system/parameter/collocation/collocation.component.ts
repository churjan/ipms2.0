import { Component } from "@angular/core";
import { FormTemplateComponent } from "~/shared/common/base/form-Template.component";

@Component({
    selector: 'collocation',
    templateUrl: './collocation.component.html',
    styleUrls: [`./collocation.component.less`]
})
export class CollocationComponent extends FormTemplateComponent {
    /**表单类型 */
    formType = new Array(
        // { name: '文字输入', type: 'text', field: '', placeholder: '请输入', title: '标题' },
        // { name: '数字输入', type: 'number', field: '', placeholder: '请输入', title: '标题' },
        // { name: '多选', type: 'checkbox', field: '', placeholder: '', title: '标题', option: [] },
        // { name: '单选', type: 'radio', field: '', placeholder: '', title: '标题', option: [] },
        // { name: '后端选择器', type: 'select', field: '', placeholder: '', title: '标题', option: [] },
        // { name: '自定义选择器', type: 'select', field: '', placeholder: '', title: '标题', option: [] },
        // { name: '枚举选择器', type: 'select', field: '', placeholder: '', title: '标题', option: [] },
        // { name: '开关', type: 'switch', field: '', placeholder: '', title: '标题', option: [] }
    );
    /**单项属性 */
    SingleAttr: any = {};
    /**表单数据 */
    formList = new Array();
    /**选中层次 */
    selectIndex: number = -1
    async open(record: any) {
        this._service.comList('classdata', { pcode: 'jsontype' }, 'getlist').then(result => {
            let input = result.filter(r => /input/.test(r.code))
            let select = result.filter(r => !(/input/.test(r.code)))
            console.log(result, input, select)
            this.formType.push({ name: '输入型组件', code: 'input', sonlist: input })
            this.formType.push({ name: '选择型组件', code: 'select', sonlist: select })
        })
        this.visible = true
    }
    selectType({ name, code }, group, arr?) {
        let node: any = Object.assign({
            id: this.formList.length,
            name,
            type: code.replace('-' + group.code, ''),
            group: /input/.test(code) || /select/.test(code) ? group.code : '',
            field: '',
            placeholder: '请输入' + name,
            title: name + '标题'
        })
        if (/select/.test(group.code)) {
            node = Object.assign(node, { option: [] })
        }
        if (this.selectIndex >= 0 && this.formList[this.selectIndex].soncheck) {
            this.formList[this.selectIndex].sonlist.push(node);
        } else
            this.formList.push(node);
        this.SingleAttr = Object.assign({}, node, { type: code })
    }
    /**添加子项 */
    addSon() {
        this.selectIndex = this.formList.length - 1;
        if (this.selectIndex < 0) return;
        this.formList[this.selectIndex] = Object.assign(this.formList[this.selectIndex], {
            soncheck: true,
            isson: true,
            sonlist: []
        })
        console.log(this.formList)
    }
    /**退选子项 */
    cleanCheck() { }
    updata(ftsf) {
        if (ftsf) {
            let group = this.formType.find(fm => new RegExp(`${fm.code}`).test(ftsf));
            let fts = group.sonlist.find(g => g.code == ftsf);
            this.SingleAttr = Object.assign(this.SingleAttr, {
                name: fts.name,
                group: /input/.test(fts.code) || /select/.test(fts.code) ? group.code : '',
                field: '',
                placeholder: '请输入' + fts.name,
                title: fts.name + '标题'
            })
        }
        this.formList[this.SingleAttr.id] = Object.assign(this.formList[this.SingleAttr.id], this.SingleAttr, { type: this.SingleAttr.type.replace('-' + this.SingleAttr.group, '') })
    }
}