import { Component, EventEmitter, Output } from "@angular/core";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { FormTemplateComponent } from "~/shared/common/base/form-Template.component";
import { UtilService } from "~/shared/services/util.service";

@Component({
    selector: 'controller',
    templateUrl: './controller.component.html',
    styleUrls: ['./controller.component.less']
})
export class ControllerComponent extends FormTemplateComponent {
    constructor(private breakpointObserver: BreakpointObserver) { super(); }

    @Output() editDone = new EventEmitter<boolean>()
    node: any = { permit: true, blsd_list: [] };
    ngOnInit(): void {
        // this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
        //     this.width = '50%'
        // })
        this.otherUrl = this.modular.otherUrl;
        this.columns = this.modular.flow;
    }
    async open(record: any) {
        if (record.node) { this.node = Object.assign(this.node, record.node) }
        this.title = this._appService.translate("placard." + record.title, this.node.pog_name);
        this.visible = true
    }
    onConditionChange(data, item) {
        let { optionmode, optionvalue, inputtype } = data;
        let optionlist = new Array();
        let Datatyle = new Array();
        if (optionmode == "customselect") optionlist = JSON.parse(optionvalue)
        item = Object.assign(item, { inputtype, optionmode, optionvalue, comparetype: "=" }, optionlist.length > 0 ? { optionlist: optionlist } : { optionmode, optionvalue })
        // console.log(Datatyle, data)
        if (optionmode == 'fullselect') { Datatyle = data.optionvalue.split('/'); item.Datatyle = Datatyle[Datatyle.length - 1] }
    }
    addblsd_list() { this.node.blsd_list = this.node.blsd_list.concat(...[{}]) }
    minus(data, i) {
        // this.node.blsd_list.splice(i, 1);
        this.node.blsd_list = this.node.blsd_list.filter((nb, index) => index != i)
    }
    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false
        if (!event || event.key == "Enter") {
            if (UtilService.isEmpty(this.node.blsr_name) || this.node.blsd_list.length <= 0) {
                this.submiting = false;
                this.message.error(this.getTipsMsg('warning.Please_Required'))
                return
            }
            let execute: boolean = true;
            this.node.blsd_list.forEach((nb, i) => {
                if (UtilService.isEmpty(nb.blr_key)) {
                    execute = false;
                    this.message.error(this.getTipsMsg('warning.Please_completedata', this.getTipsMsg('pmOverloadManagement.blr_key')));
                    return
                }
                if (UtilService.isEmpty(nb.value)) {
                    execute = false;
                    this.message.error(this.getTipsMsg('warning.Please_completedata', this.getTipsMsg('pmOverloadManagement.value')));
                    return
                }
            })
            if (execute == true) {
                this.submiting = true;
                super.save({ url: this.otherUrl.ControlScheme, model: this.node }, () => {
                    this.submiting = false;
                    this.editDone.emit(true)
                    this.close();
                });
            }
        }
    }
    close(): void {
        this.node = { permit: true, blsd_list: [] };
        this.visible = false
    }
}