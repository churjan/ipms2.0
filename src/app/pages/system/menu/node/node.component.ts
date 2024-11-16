import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '~/shared/services/app.service';

@Component({
    selector: 'node',
    templateUrl: './node.component.html',
    styleUrls: ['./node.component.less']
})
export class NodeComponent implements OnInit {

    @Output() onSave = new EventEmitter()
    public visible: boolean = false
    public validateForm!: FormGroup
    key: any = null
    @Input() modular: any;
    constructor(private fb: FormBuilder,
        private appService: AppService) { }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            action: [null, [Validators.required]],
            name: [null, [Validators.required]],
            isextend: [true],
            icon: [null],
            sort: [null],
            isradio: [false],
            speciallimits: [0]
        })
    }

    open(record?: any): void {
        this.validateForm.reset()
        this.key = null
        if (record) {
            if (!record.speciallimits) record.speciallimits = 0;
            if (record.speciallimits == 0) {
                record.isradio = record.isradio == true ? true : false;
                record.isextend = record.isextend && record.isextend == true ? true : false;
            } else {
                record.isradio = null;
                record.isextend = null;
            }
            if (record.key) {
                this.key = record.key
            }
            this.validateForm.patchValue(record)
        }
        this.visible = true
    }

    close() {
        this.visible = false
    }

    quickSetButton(type) {
        let langKey = type.toLowerCase()
        if (type == 'Del') langKey = 'delete'
        if (type == 'Add') langKey = 'plus'
        if (type == 'Update') langKey = 'edit'
        this.validateForm.patchValue({
            name: this.appService.translate('btn.' + langKey),
            action: type,
            icon: langKey,
            isradio: type == 'Add' ? false : true,
            speciallimits: 0,
            sort: 1
        })
    }

    submitForm(event?: KeyboardEvent) {
        if (!event || event.key == "Enter") {
            const { speciallimits } = this.validateForm.value
            if (!speciallimits) this.validateForm.patchValue({ speciallimits: 0 })
            if (speciallimits != 0) { this.validateForm.patchValue({ isradio: null, isextend: null }) }
            for (let key in this.validateForm.value) {
                if (typeof this.validateForm.value[key] == 'string') {
                    const temp = {}
                    temp[key] = this.validateForm.value[key].trim()
                    this.validateForm.patchValue(temp)
                }
            }

            for (const i in this.validateForm.controls) {
                if (this.validateForm.controls.hasOwnProperty(i)) {
                    this.validateForm.controls[i].markAsDirty()
                    this.validateForm.controls[i].updateValueAndValidity()
                }
            }
            if (!this.validateForm.valid) {
                return false
            }
            this.onSave.emit({ ...this.validateForm.value, key: this.key })
            this.visible = false
        }
    }

}
