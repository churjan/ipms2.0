import { Component, Input } from "@angular/core";
import { FormTemplateComponent } from "../../base/form-Template.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UtilService } from "~/shared/services/util.service";
declare var $: any;

@Component({
    selector: 'stationSet',
    templateUrl: './stationSet.component.html',
    styleUrls: ['./stationSet.component.less']
})
export class StationSetComponent extends FormTemplateComponent {
    constructor(
        private breakpointObserver: BreakpointObserver,) { super(); }
    @Input() note: any;
    list = new Array();
    listOfData = new Array();
    /***下拉显示 */
    popoverVisible: boolean = false;
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            this.width = '99%'
        })
    }
    async open(record: any) {
        this.title = this._appService.translate(record.title)
        this.note = record.node;
        this.getlist();
        this.visible = true
    }
    getlist() {
        this._service.comList('StyleOperationProcessRouteMaster/extend', { psopm_key: this.note.psopm_key, psorm_key: this.note.psorm_key }, 'GetStyleRouteProcess').then(v => {
            v.partlist.forEach(p => {
                p.station.forEach(s => {
                    s.tdrowspan = 0;
                    s.infeeds.forEach(i => {
                        i.tdrowspan = i.operations.length;
                        s.tdrowspan = s.tdrowspan + i.operations.length;
                        i.operations.forEach(io => {
                            if (io.pci_names) io.pci_name = io.pci_names.toString();
                            if (io.psz_names) io.psz_name = io.psz_names.toString();
                            if (io.pci_keys == '' || !io.pci_keys) io.pci_keys = [];
                            if (io.psz_keys == '' || !io.psz_keys) io.psz_keys = [];
                        })
                    })
                })
            })
            this.list = v.partlist;
            this.getdata(this.list[0])
        })

    }
    getdata(item) {
        this.listOfData = item.station;
    }
    change(ev, item, name) {
        if (ev) {
            item[name] = ev;
            // let body = new Array()
            if (!item.psz) item.psz = new Array()
            if (!item.pci) item.pci = new Array()
            // body.push(...item.pci, ...item.psz)
            item.scheme_name = '';
            item.pci_names = new Array()
            item.psz_names = new Array()
            item.pci.forEach(pc => { if (pc) { item.pci_names.push(pc.name); } })
            item.psz.forEach(ps => { if (ps) { item.psz_names.push(ps.name); } })
            item.pci_name = item.pci_names.toString();
            item.psz_name = item.psz_names.toString();
            // body.forEach(e => {
            //     if (e) {
            //         // if (UtilService.isEmpty(item.scheme_name)) item.scheme_name = '';
            //         // if (item.scheme_name.search(e.name) < 0)
            //         //     item.scheme_name = item.scheme_name + (item.scheme_name != '' ? '，' : '') + e.name
            //     }
            // })
        }
    }
    changesave() {
        let body = new Array()
        this.list.forEach(l => {
            l.station.forEach(s => {
                s.infeeds.forEach(i => {
                    i.operations.forEach(io => {
                        const { psopm_key } = this.note
                        const { bpi_key } = s
                        const { infeed_key } = i
                        let { poi_key, ppis_key, pci_keys, psz_keys } = io;
                        if (pci_keys == '' || !pci_keys) pci_keys = [];
                        if (psz_keys == '' || !psz_keys) psz_keys = [];
                        body.push({ psopm_key, bpi_key, infeed_key, poi_key, ppis_key: ppis_key ? ppis_key : '', pci_keys, psz_keys })
                    })
                })
            })
        })
        this._service.saveModel('admin/ProcessInfeedScheme/extend/BatchSaveInfeedScheme/', 'post', body, (s) => {
            this.getlist();
            this.message.success(this.getTipsMsg('sucess.s_set'))
        })
    }
    del(last) {
        last.pci_keys = [];
        last.psz_keys = [];
        last.pci = [];
        last.psz = [];
        last.pci_name = '';
        last.psz_name = ''
        // this._service.deleteModel('admin/ProcessInfeedScheme/', [{ key: last.ppis_key }], (s) => { this.getlist(); })
    }
    Color() {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }
    /**关闭 */
    close(): void {
        this.avatar = null
        this.list = [];
        this.visible = false
    }
}