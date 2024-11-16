import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LanguageVersionService } from '~/pages/system/language/version/languageVersion.service';
import { AppService } from '~/shared/services/app.service';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

    @Output() editDone = new EventEmitter<boolean>()

    title: string
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    submiting: boolean = false
    key: string

    constructor(
        private fb: FormBuilder,
        private languageVersionService: LanguageVersionService,
        private breakpointObserver: BreakpointObserver,
        private appService: AppService
    ) { }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '400px'
            } else {
                this.width = '94%'
            }
        })
        this.validateForm = this.fb.group({
            key: [null],
            languagename: [null, [Validators.required]],
            language: [null, [Validators.required]]
        })
    }

    open(record: any): void {
        this.title = record.node ? this.appService.translate("btn.update") : this.appService.translate("btn.add")
        if (record.node) {
            this.key = record.key
            this.validateForm.patchValue(record.node)
        } else {
            this.key = null
        }
        this.visible = true
    }

    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false

        if (!event || event.key == "Enter") {
            this.submiting = true
            this.appService.formSubmit(this.validateForm, this.languageVersionService, this.key).then(() => {
                this.editDone.emit(this.key ? false : true)
                this.close()
            }).finally(() => {
                this.submiting = false
            })
        }
    }

    close(): void {
        this.validateForm.reset()
        this.visible = false
    }

}
