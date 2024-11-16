import { EventEmitter, ViewChild } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { AutoOutSchemeService } from '~/pages/warehouse/wms/autooutscheme/autoOutScheme.service';
import { CommonService } from '~/shared/services/http/common.service';
import { TransferDirection, TransferItem } from 'ng-zorro-antd/transfer';
import { ConditionsComponent } from '~/pages/layout/programme/edit/conditions/conditions.component';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

    @ViewChild('conditions') conditionsEle: ConditionsComponent
    @Output() editDone = new EventEmitter<boolean>()
    title: string
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    submiting: boolean = false
    key: string
    fieldOptions: Array<any>
    valueOptions: any
    conditionsData: Array<any> = []
    isOutTimerOrderlyForScheme: boolean = false
    transferData: TransferItem[] = []
    $asTransferItems = (data: unknown) => data as TransferItem[]
    stations: Array<any> = []
    stationSelected: Array<any> = []

    constructor(
        private fb: FormBuilder,
        private autoOutSchemeService: AutoOutSchemeService,
        private commonService: CommonService,
        private breakpointObserver: BreakpointObserver,
        private appService: AppService
    ) { }

    async ngOnInit() {
        this.validateForm = this.fb.group({
            name: [null, [Validators.required]],
            isbox: [false],
            box_number: [null, Validators.compose([Validators.min(0), Validators.pattern('^(0|[1-9][0-9]*)$')])],
            description: [null, [Validators.maxLength(100)]]
        })
        // await this.commonService.systemParameter("IsOutTimerOrderlyForScheme").then(response =>{
        //     if(response == "true") this.isOutTimerOrderlyForScheme = true
        // })
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
    }

    async open(record: any) {
        // await this.commonService.attributes({showtype:'AutoOutScheme'},'attribute_rule').then(({fieldOptions,valueOptions}) =>{
        //     this.fieldOptions = fieldOptions
        //     this.valueOptions = valueOptions
        // })
        // await this.commonService.packStations().then((response: any) =>{
        //     this.stations = response
        // })
        this.title = record ? this.appService.translate("btn.update") : this.appService.translate("btn.add")
        this.stationSelected = []
        this.transferData = []
        if (record) {
            this.key = record.key
            await this.autoOutSchemeService.get(this.key).then((response: any) => {
                this.conditionsData = response.conditions;
                // this.conditionsData.forEach(item => {
                // var fieldOption = this.fieldOptions.find(x => x.key == item.field)
                // if (fieldOption)
                //     item.optionmode = fieldOption.optionmode
                // })
                //获取当前剩下的所有站位（因为中间可能有被删除了），然后在已选站位中也要删掉已经被删除的站位
                const totalkeys = this.stations.map(({ key }) => key)
                if (response.stations instanceof Array) {
                    this.stationSelected = response.stations.filter(({ bls_key }) => totalkeys.includes(bls_key))
                }
                // console.log(response, this.validateForm)
                this.validateForm.setValue({
                    description: response.description,
                    isbox: response.isbox || null,
                    box_number: response.box_number || 0,
                    name: response.name

                })
            })
        } else {
            this.key = null
        }
        const currentKeys = this.stationSelected.map(({ bls_key }) => bls_key)
        this.stations.forEach(item => {
            const direction: TransferDirection = currentKeys.includes(item.key) ? 'right' : 'left'
            const temp = {
                title: item.name,
                code: item.code,
                direction: direction,
                checked: false,
                key: item.key
            }
            this.transferData.push(temp)
        })
        this.visible = true
    }
    ModelChange(ev) {
        // console.log(ev)
        // this.validateForm.clearAsyncValidators
        if (ev == true)
            // this.validateForm.get('box_number').setValidators([Validators.required]);
            this.validateForm.addControl('box_number', new FormControl(0, Validators.compose([Validators.required, Validators.min(0), Validators.pattern('^(?!0$).*')])))
        else
            this.validateForm.get('box_number').clearValidators();
    }
    transferChange(ret: any): void {
        if (ret.from == "left" && ret.to == "right" && ret.list) {
            ret.list.forEach(item => {
                this.stationSelected.push({
                    bls_name: item.title,
                    bls_code: item.code,
                    bls_key: item.key
                })
            })
        } else if (ret.from == "right" && ret.to == "left" && ret.list) {
            ret.list.forEach(({ key }) => {
                const index = this.stationSelected.findIndex(({ bls_key }) => bls_key == key)
                if (index >= 0) {
                    this.stationSelected.splice(index, 1)
                }
            })
        }
    }

    filterOption(inputValue: string, item: any): boolean {
        return item.title.indexOf(inputValue) > -1
            || item.code.indexOf(inputValue) > -1
    }

    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false

        if (!event || event.key == "Enter") {
            Object.values(this.validateForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            if (this.validateForm.status == 'VALID') {
                if (!this.conditionsEle.verify()) return false

                const extraData = {
                    conditions: this.conditionsData,
                    routes: this.stationSelected
                }

                this.submiting = true
                this.appService.formSubmit(this.validateForm, this.autoOutSchemeService, this.key, extraData).then(() => {
                    this.editDone.emit(this.key ? false : true)
                    this.close()
                }).finally(() => {
                    this.submiting = false
                })
            } else { this.submiting = false; return }
        }
    }

    close(): void {
        this.validateForm.reset()
        this.conditionsData = []
        this.visible = false
    }

}
