import { Component, EventEmitter, Output } from "@angular/core";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { FormTemplateComponent } from "~/shared/common/base/form-Template.component";
import { UtilService } from "~/shared/services/util.service";

@Component({
    selector: 'setGrouping',
    templateUrl: './setGrouping.component.html',
    styleUrls: ['./setGrouping.component.less']
})
export class setGroupingComponent extends FormTemplateComponent {
    constructor(private breakpointObserver: BreakpointObserver,) {
        super();
    }
    @Output() editDone = new EventEmitter<boolean>()
    node: any = {};
    treeList = new Array();
    y = 'calc(100vh - 595px)';
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '80%'
            } else {
                this.width = '100%'
            }
        })
        this.otherUrl = this.modular.otherUrl;
        this.columns = this.modular.flow;
        // this.fetchCatalog();
    }

    // fetchCatalog() {
    //     this._service.comList('LayoutStructure/extend', { moduletype: 106, BLST_Group: 'Station' }, 'NewGetList').then((data: any) => {
    //         this.treeList = this.recursion(data, '', 0);
    //     });
    // }
    // recursion(data, pkey, level) {
    //     let filterData = data.filter((item) => item.pkey === pkey);
    //     if (pkey == '') { filterData = data.filter((item) => item.pkey === pkey || item.pkey === null); }
    //     if (filterData) {
    //         filterData.forEach((item) => {
    //             item.title = `${item.name}[${item.code}]`;
    //             if (level === 1) {
    //                 item.children = [];
    //             } else {
    //                 item.children = this.recursion(data, item.key, level + 1);
    //             }
    //             item.isLeaf = !item.children.length;
    //         });
    //     }
    //     return filterData;
    // }
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title);
        if (record.node) { this.node = Object.assign(this.node, record.node) }
        this.visible = true
    }
    // nzEvent(e: any) {
    //     if (e.keys.length) {
    //         if (e.node.origin.children.length) {
    //             this.node.pos_list = Array.from(
    //                 new Set([...this.node.pos_list, ...e.node.origin.children])
    //             );
    //         } else {
    //             this.node.pos_list = Array.from(
    //                 new Set([...this.node.pos_list, e.node.origin])
    //             );
    //         }
    //     }
    // }
    // onDelete(i) {
    //     this.node.pos_list.splice(i, 1);
    //     this.node.pos_list = [... this.node.pos_list];
    // }
    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false
        if (!event || event.key == "Enter") {
            if (UtilService.isEmpty(this.node.key)) {
                this.message.error(this.getTipsMsg('checkdata.check_xx', 'pmOverloadManagement.key'));
                return
            }
            this.submiting = true;
            super.save({ url: this.otherUrl.OverloadStation, doAction: 'post', model: this.node }, () => {
                this.submiting = false;
                this.editDone.emit(true)
                this.close();
            });
        }
    }
    close(): void {
        this.node = {};
        this.visible = false
    }
}