import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from "~/shared/common/base/form-Template.component";

@Component({
    selector: 'Cut-Client',
    templateUrl: './CutClient.component.html',
    styleUrls: ['./CutClient.component.less']
})
export class CutClientComponent extends FormTemplateComponent {
    constructor(private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,) { super(); this.modularInit("pmCutting"); }

    @Output() editDone = new EventEmitter<boolean>()
    validateForm!: FormGroup

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '30%'
            } else {
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            station_code: [{ value: null, disabled: true }, [Validators.required]],
            client: [null, [Validators.required]]
        })
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title);
        if (record.node) {
            this.key = record.node.station_code
            this._service.getModel(this.otherUrl.getclient, this.key, (response: any) => {
                this.validateForm.patchValue(response)
                this.model = { station_code: response.station_code }
            }, (err) => {
                this.model = { station_code: record.node.station_code }
                this.validateForm.patchValue({ station_code: this.key })
            })
        } else {
            this.key = null
        }
        this.visible = true
    }
    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false

        if (!event || event.key == "Enter") {
            let model: any = {}
            this.submit();
            if (this.validateForm.status == 'VALID') {
                model = Object.assign({}, this.validateForm.value, this.model);
            } else { this.submiting = false; return }
            this.submiting = true;
            super.save({ url: this.otherUrl.getclient, model: model, doAction: 'post' }, () => {
                this.submiting = false;
                this.editDone.emit(true)
                this.close();
            });
        }
    }
    close(): void {
        this.validateForm.reset()
        this.avatar = null
        this.visible = false;
        this.editDone.emit(false);
    }
}