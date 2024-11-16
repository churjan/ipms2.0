import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RunLogService } from '~/pages/system/log/run/runLog.service';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.less']
})
export class FilterComponent extends FormTemplateComponent {
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private runLogService: RunLogService
    ) { super(); }

    @Output() editDone = new EventEmitter()
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    nodes: any[] = []
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', child: 'sonlist', url: 'LayoutStructure/extend' }
    layout = { maketree: true, moduletype: 102 }
    LogType = true;
    ngOnInit() {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '340px'
            } else {
                this.width = '100%'
            }
        })
        // this.runLogService.tree().then((response: any) =>{
        //     this.nodes = response
        // })
        this.validateForm = this.fb.group({
            bls_key: [null],
            pagesize: [null],
            page: [null]
        })
        this.otherUrl = this.modular.otherUrl;
    }

    open(node) {
        this.title = this._appService.translate("btn." + node.title);
        this.LogType = node.LogType;
        if (this.LogType != true) {
            this.validateForm = this.fb.group({
                bls_key: [null],
                pagesize: [null],
                page: [null],
                date: [null],
                start: [null],
                end: [null]
            })
        }
        this.visible = true
    }

    submitForm(event?: KeyboardEvent) {
        if (!event || event.key == "Enter") {
            for (let key in this.validateForm.value) {
                if (typeof this.validateForm.value[key] == 'string') {
                    const temp = {}
                    temp[key] = this.validateForm.value[key].trim()
                    this.validateForm.patchValue(temp)
                }
            }
            let model = Object.assign({}, this.validateForm.value);
            const { date } = model;
            model.date = this.dateFormat(date, 'yyyy-MM-dd')
            let url = this.LogType == true ? this.otherUrl.fatlogurl : this.otherUrl.Executiveurl
            this._service.saveModel(url, 'post', model, (result) => {
                this.message.success(this.getTipsMsg('sucess.s_get'))
                this.editDone.emit()
                this.close()
            }, function (msg) { });
        }
    }

    reset(): void {
        this.validateForm.reset()
    }

    close() {
        this.visible = false
        this.reset()
    }
}
