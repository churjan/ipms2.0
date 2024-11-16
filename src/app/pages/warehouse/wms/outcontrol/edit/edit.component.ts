import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { CommonService } from '~/shared/services/http/common.service';
import { TransferDirection, TransferItem } from 'ng-zorro-antd/transfer';
import { OutControlService } from '~/pages/warehouse/wms/outcontrol/outControl.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilService } from '~/shared/services/util.service';
import { I18nPipe } from '~/shared/pipes/i18n.pipe';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less'],
    providers: [I18nPipe]
})
export class EditComponent implements OnInit {

    @Output() editDone = new EventEmitter<boolean>()
    title: string
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    submiting: boolean = false
    key: string
    procedures: Array<any>
    transferData: TransferItem[] = []
    opData: TransferItem[] = []
    $asTransferItems = (data: unknown): any[] => data as TransferItem[]
    stations: Array<any> = []
    /**站位选择 */
    stationSelected: Array<any> = []
    /**工序选择 */
    opSelected: Array<any> = []
    /**布局结构参数 */
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', child: 'sonlist', url: 'LayoutStructure/extend' };
    /**树状站位筛选条件 */
    stationRailtree = { maketree: true, moduletype: 101 };

    constructor(
        private fb: FormBuilder,
        private outControlService: OutControlService,
        private commonService: CommonService,
        private breakpointObserver: BreakpointObserver,
        private appService: AppService,
        private Service: UtilService,
        private massage: NzMessageService,
        private i18n: I18nPipe
    ) { }

    async ngOnInit() {
        this.validateForm = this.fb.group({
            name: [null, [Validators.required]],
            state: [1, [Validators.required]],
            poi_key: [null, [Validators.required]],
            createtime: [null]
        })
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '900px'
            } else {
                this.width = '100%'
            }
        })
    }

    async open(record: any) {
        const lines = {}
        // await this.commonService.structures({ blst_group: 'line' }).then((response: any) => {
        //     response.forEach(({ key, name }) => {
        //         lines[key] = name
        //     })
        // })
        let stationType = null
        // await this.commonService.systemParameter("OutControlRoute").then(response =>{
        //     stationType = response
        // })
        //StationType 存储仓位
        // await this.commonService.structures({ maketree: true, moduletype: 101 }).then((response: any) => {
        //     this.stations = response.map(item => {
        //         item.pname = lines[item.pkey]
        //         return item
        //     })
        // })
        await this.commonService.procedures().then((response: any) => {
            this.procedures = response
        })
        this.title = record ? this.appService.translate("btn.update") : this.appService.translate("btn.plus")
        this.stationSelected = [];
        this.opSelected = [];
        this.transferData = [];
        this.opData = [];
        await this.Service.comList('OperationInfo', {}, 'getlist').then((response) => {
            this.opData = this.opData.filter(t => t.direction != 'left')
            const currentKeys = this.opSelected.map(({ poi_key }) => poi_key);
            response.forEach(v => {
                const direction: TransferDirection = currentKeys.includes(v.key) ? 'right' : 'left'
                v.direction = direction;
            })
            this.opData = this.opData.concat(response)
        })
        if (record) {
            this.key = record.key
            await this.outControlService.get(this.key).then((response: any) => {
                //获取当前剩下的所有站位（因为中间可能有被删除了），然后在已选站位中也要删掉已经被删除的站位
                const totalkeys = this.stations.map(({ key }) => key)
                if (response.routes instanceof Array) {
                    this.stationSelected = response.routes.filter(({ bls_key }) => totalkeys.includes(bls_key))
                }
                // if (response.over_poi_keys instanceof Array) {
                //     this.opSelected = response.over_poi_keys.filter(({ poi_key }) => totalkeys.includes(poi_key))
                // }
                this.validateForm.setValue({
                    name: response.name,
                    poi_key: response.poi_key,
                    state: response.state ? response.state : 1,
                    createtime: response.createtime ? response.createtime : null
                })
                if (response.routes) {
                    response.routes.forEach(item => {
                        let i = this.transferData.findIndex(t => t.key == item.bls_key);
                        if (i >= 0) { this.transferData.splice(i, 1) }
                        this.transferData.push({
                            title: item.bls_name,
                            code: item.bls_code,
                            pname: item.bls_pname,
                            direction: 'right',
                            checked: false,
                            key: item.bls_key
                        })
                    });
                    this.stationSelected.push(...response.routes)
                }
                // console.log(response)
                if (response.over_poi_keys) {
                    response.over_poi_keys.forEach(item => {
                        let i = this.opData.findIndex(t => t.key == item.poi_key);
                        if (i >= 0) { this.opData.splice(i, 1) }
                        this.opData.push({
                            title: item.poi_name,
                            code: item.poi_code,
                            name: item.poi_name,
                            direction: 'right',
                            checked: false,
                            key: item.poi_key
                        })
                    });
                    this.opSelected.push(...response.over_poi_keys)
                }
            })
        } else {
            this.key = null
        }
        this.visible = true
    }
    getstation(ev) {
        if (ev) {
            this.transferData = this.transferData.filter(t => t.direction != 'left')
            const currentKeys = this.stationSelected.map(({ bls_key }) => bls_key);
            const direction: TransferDirection = currentKeys.includes(ev.key) ? 'right' : 'left'
            let data = new Array()
            ev.sonlist.forEach(item => {
                const temp = {
                    title: item.name,
                    code: item.code,
                    pname: ev.name,
                    direction: direction,
                    checked: false,
                    key: item.key
                }
                data.push(temp)
            })
            this.transferData = this.transferData.concat(data)
        }
    }
    transferChange(ret: any): void {
        if (ret.from == "left" && ret.to == "right" && ret.list) {
            ret.list.forEach(item => {
                this.stationSelected.push({
                    pname: item.pname,
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
    transferChange2(ret: any): void {
        if (ret.from == "left" && ret.to == "right" && ret.list) {
            ret.list.forEach(item => {
                this.opSelected.push({
                    poi_name: item.title,
                    poi_code: item.code,
                    poi_key: item.key
                })
            })
        } else if (ret.from == "right" && ret.to == "left" && ret.list) {
            ret.list.forEach(({ key }) => {
                const index = this.opSelected.findIndex(({ poi_key }) => poi_key == key)
                if (index >= 0) {
                    this.opSelected.splice(index, 1)
                }
            })
        }
    }
    filterOption(inputValue: string, item: any): boolean {
        if (item.title && item.code && item.pname)
            return item.title.indexOf(inputValue) > -1
                || item.code.indexOf(inputValue) > -1
                || item.pname.indexOf(inputValue) > -1
        else
            return item.code.indexOf(inputValue) > -1
                || item.name.indexOf(inputValue) > -1
    }

    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false

        if (!event || event.key == "Enter") {
            let keys = new Array();
            if (!this.stationSelected || this.stationSelected.length == 0) {
                this.massage.error(this.i18n.transform('warning.checkLineandStation'))
                return;
            }
            this.opSelected.forEach(os => keys.push(os.poi_key))
            const extraData = { routes: this.stationSelected, over_poi_keys: keys }
            this.submiting = true
            this.appService.formSubmit(this.validateForm, this.outControlService, this.key, extraData).then(() => {
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
