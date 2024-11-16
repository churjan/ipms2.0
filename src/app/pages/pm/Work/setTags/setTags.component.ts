import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

class Body {
    pwb_Key: string;
    number: number;
    packagenumber: number;
}
@Component({
    selector: 'setTags',
    templateUrl: './setTags.component.html',
    styleUrls: [`./setTags.component.less`]
})

export class SetTagsContent extends FormTemplateComponent {
    constructor(private fb: FormBuilder, private breakpointObserver: BreakpointObserver,) { super(); }

    @Output() editDone = new EventEmitter<boolean>()
    model_work: any = {};
    body: Body = new Body();
    submiting: boolean = false
    tab = 0;
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
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title)
        if (record && record.node) {
            this.key = record.node.key;
            this._service.getModel(this.modular.url, this.key, (result) => {
                this.model = result;
            }, () => { });
        } else {
            this.key = null
        }
        this.visible = true
    }

    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false
        this.body.pwb_Key = this.key;
        if (!event || event.key == "Enter") {
            this.submiting = true;
            super.save({ model: this.body, url: this.otherUrl.tagurl }, (backcall) => {
                this.submiting = false;
                this.editDone.emit(this.key ? false : true);
                this.close()
            })
        }
    }
    close(): void {
        this.body = new Body();
        this.avatar = null
        this.visible = false
    }
}
