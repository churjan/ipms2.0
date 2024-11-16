import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

class Body {
    pwb_Key: string;
    number: number;
    packagenumber: number;
    singlepackagenumber: number;
    singletagnumber: number;
    tagnumber: number;
}
@Component({
    selector: 'setTags2',
    templateUrl: './setTags2.component.html',
    styleUrls: [`./setTags2.component.less`]
})

export class SetTags2Content extends FormTemplateComponent {
    constructor(private fb: FormBuilder, private breakpointObserver: BreakpointObserver,) { super(); }

    @Output() editDone = new EventEmitter<boolean>()
    model_work: any = {};
    body: Body = new Body();
    tagmode = 1;
    submiting: boolean = false
    tab = 0;
    istag: boolean = false
    ispackage: boolean = false
    ngOnInit(): void {
        this.otherUrl = this.modular.otherUrl;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '80%'
            } else {
                this.width = '100%'
            }
        })
        this.body = Object.assign(this.body, {
            number: 0,
            packagenumber: 0,
            tagnumber: 1
        })
    }
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title)
        this.istag = false;
        this.ispackage = false;
        this.tagmode = record.tagmode
        if (record.tagmode == 1) { this.body.tagnumber = 1; }
        // console.log(record)
        if (record && record.node) {
            this.key = record.node.key;
            this._service.getModel(this.modular.url, this.key, (result) => {
                if (!result.opp_type) {
                    this.message.error(this.getTipsMsg('warning.noSetFlow'))
                    this.close()
                } else {
                    this.model = result;
                    if (this.model.quantity - this.model.taginfonum < 0 && record.tagmode == 1) this.body.tagnumber = 0;
                    this.body.number = this.model.quantity - this.model.taginfonum;
                    // if (this.istag == true) { this.body.tagnumber = 1; }
                    this.change();
                }
            }, () => { });
        } else {
            this.key = null;
        }
        this.visible = true
    }
    checkbox() {
        if (this.istag == true) {
            if (this.model.quantity - this.model.taginfonum < 0) this.body.tagnumber = 0;
            else this.body.tagnumber = 1;
        }
        this.change();
    }
    change() {
        if (this.istag != true && this.tagmode != 1) {
            this.body.tagnumber = null;
        } else if (this.ispackage != true && this.tagmode == 1) {
            this.body.packagenumber = null;
        }
        if (this.body.packagenumber && this.body.packagenumber > 0) {
            this.body.singlepackagenumber = Math.ceil(this.body.number / this.body.packagenumber)
            if (this.body.tagnumber && this.body.tagnumber > 0) {
                let rem = this.body.number % this.body.packagenumber;
                if (rem > 0) {
                    this.body.singletagnumber = Math.ceil(this.body.packagenumber / this.body.tagnumber) * Math.floor(this.body.number / this.body.packagenumber);
                    this.body.singletagnumber = this.body.singletagnumber + Math.ceil(rem / this.body.tagnumber);
                } else {
                    this.body.singletagnumber = Math.ceil(this.body.packagenumber / this.body.tagnumber) * this.body.singlepackagenumber;
                }
            } else
                this.body.singletagnumber = 0;
        } else {
            this.body.singlepackagenumber = 0;
            this.body.singletagnumber = this.body.tagnumber && this.body.tagnumber > 0 ? Math.ceil(this.body.number / this.body.tagnumber) : 0;
        }
    }
    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false
        this.body.pwb_Key = this.key;
        if (!event || event.key == "Enter") {
            const { pwb_Key, tagnumber, packagenumber, number } = this.body
            let _body = {}
            if (this.tagmode == 0 || this.tagmode == 3) {
                if (this.istag == true) {
                    if (packagenumber == 0 || tagnumber == 0 || number == 0) {
                        this.message.error(this.getTipsMsg('warning.total'));
                        return;
                    }
                    _body = { pwb_Key, tagnumber, packagenumber, number, opp_type: this.model.opp_type }

                } else {
                    if (packagenumber == 0 || number == 0) {
                        this.message.error(this.getTipsMsg('warning.total'));
                        return;
                    }
                    _body = { pwb_Key, packagenumber, number, opp_type: this.model.opp_type }
                }
            } else if (this.tagmode == 1) {
                if (tagnumber == 0 || number == 0) {
                    this.message.error(this.getTipsMsg('warning.total'));
                    return;
                }
                _body = { pwb_Key, tagnumber, number, opp_type: this.model.opp_type }
            } else {
                if (packagenumber == 0 || number == 0) {
                    this.message.error(this.getTipsMsg('warning.total'));
                    return;
                }
                _body = { pwb_Key, packagenumber, number, opp_type: this.model.opp_type }
            }
            // if (this.istag != true) {
            //     if (packagenumber == 0 || number == 0) {
            //         this.message.error(this.getTipsMsg('warning.total'));
            //         return;
            //     }
            //     _body = { pwb_Key, packagenumber, number }
            // } else if (this.ispackage != true) {
            //     if (tagnumber == 0 || number == 0) {
            //         this.message.error(this.getTipsMsg('warning.total'));
            //         return;
            //     }
            //     _body = { pwb_Key, tagnumber, number }
            // } else {
            //     if (packagenumber == 0 || tagnumber == 0 || number == 0) {
            //         this.message.error(this.getTipsMsg('warning.total'));
            //         return;
            //     }
            //     _body = { pwb_Key, tagnumber, packagenumber, number }
            // }
            this.submiting = true;
            super.save({ model: _body, url: this.otherUrl.setTags2 }, (backcall) => {
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
