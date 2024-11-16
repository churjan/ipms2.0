import { Component, OnInit, Input, Inject } from '@angular/core';
export interface DialogData { key: any; }
@Component({
    selector: 'app-technology',
    templateUrl: 'technology.compontent.html'
})
export class TechnologyComponent implements OnInit {
    // constructor(private service: AppService,
    //     public dialogRef: MatDialogRef<TechnologyComponent>,
    //     @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    //     this.hangermodular.fields.forEach(f => { this.fields[f.code] = f.name; });
    // }
    // fields: any = {};
    // key = this.data.key;
    // models: any;
    // tipList = AppConfig.tipsMsg;
    // 按钮注解
    // buttonList = AppConfig.buttonList;
    // hangermodular = AppConfig.hanger;
    // accessories: string[] = ['No', 'acce_name', 'hinban', 'color', 'size', 'quantity', 'yarn'];
    // inch: string[] = ['No', 'inchname', 'basic_value', 'adjusted_value', 'actual_value'];
    // line: string[] = ['No', 'linename', 'color', 'linehinban'];
    // opts: string[] = ['No', 'subcatename', 'optcode', 'optname'];
    // antiskidstrip: string[] = ['No', 'stripname', 'anthinban', 'stripcolor'];
    // other: string[] = ['No', 'stripname', 'color', 'actual_value'];
    ngOnInit() {
        const that = this;
        // this.service.getPage(this.hangermodular.otherUrl.WorkBillOpurl, { key: this.key }, (v: any) => {
        //     if (v.code === 0) { that.models = v.data; }
        // }, (err) => { });
    }
}
