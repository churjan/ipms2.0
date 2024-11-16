import { Component, OnInit, Input, Inject } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-record',
  templateUrl: './record.compontent.html'
})
export class RecordComponent implements OnInit {
  // constructor(private service: AppService,
  //   public dialogRef: MatDialogRef<RecordComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: any[] = []) {
  //   this.quality.forEach(q => {
  //     let _f = this.hangermodular.fields.find(element => element.code == q);
  //     if (_f) { this.fields[q] = _f.name; }
  //   });
  // }
  // fields: any = {};
  // @Input() tag: any;
  // model: any;
  // quality: string[] = ['No',
  //   'poi_name_receive', 'bsm_code_receive', 'hei_name_receive',
  //   'poi_name_repair', 'bsm_code_repair', 'hei_name_repair', 'poi_key_repair_time',
  //   'poi_name_recheck', 'bsm_code_recheck', 'hei_name_recheck', 'poi_key_recheck_time',
  //   'bqci_name', 'handlemethod_name']
  // tipList = AppConfig.tipsMsg;
  //按钮注解
  // buttonList = AppConfig.buttonList;
  // hangermodular = AppConfig.hanger;
  // list: any;
  // winHeight: number = window.innerHeight;
  // winResize() {
  //   this.winHeight = window.innerHeight - 150;
  // }
  ngOnInit() {
    // const that = this;
    // this.winResize();
    // $(window).resize(function () {
    //   that.winResize();
    // });
    // // this.key = this.data.key;
    // // this.service.getPage(this.hangermodular.otherUrl.qcdetail, { key: this.key }, function (v) {
    // if (this.data && this.data.length >= 0) {
    //   that.model = this.data;
    //   that.model.forEach(x => x.isleaf = false);
    // }
    // });
  }
  // open(row) {
  //   this.model.forEach(x => {
  //     if (x != row)
  //       x.isleaf = false
  //   });
  //   row.isleaf = !row.isleaf;
  // }
}
