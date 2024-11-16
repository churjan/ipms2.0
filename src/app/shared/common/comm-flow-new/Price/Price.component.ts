import { Component, Input } from "@angular/core";
import { FormTemplateComponent } from "../../base/form-Template.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
declare var $: any;

@Component({
    selector: 'Price',
    templateUrl: './Price.component.html',
    styleUrls: ['./Price.component.less']
})
export class PriceComponent extends FormTemplateComponent {
    constructor(
        private breakpointObserver: BreakpointObserver,) { super(); }
    @Input() note: any;
    /**数据源 */
    listOfData: any[] = [];
    i = 0;
    editId: string | null = null;
    /**宽 */
    _width = 0;
    pwidth = 0;
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            this.width = '99%'
        })
    }
    async open(record: any) {
        this.note = record.node;
        this.title = record.title;
        this._service.comList('PushPriceUI', { article_no: this.note }).then(r => {
            r.forEach((id, i) => id.id = i + 1)
            this.listOfData = r;
        })
        this.visible = true
    }

    submitForm(ev?) {
        if (this.submiting) return false;
        this.submiting = true
        this._service.comPost('admin/PushPrice', { article_no: this.note }).then(r => {
            this.message.success(this.getTipsMsg('sucess.PushPrice'))
            this.close();
            this.submiting = false;
        }).catch(e => this.submiting = false)
    }
    /**关闭 */
    close(): void {
        this.avatar = null
        this.visible = false
    }
}