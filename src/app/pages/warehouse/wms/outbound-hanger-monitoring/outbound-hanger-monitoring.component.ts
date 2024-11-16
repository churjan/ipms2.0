import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '~/shared/services/http/common.service';
import { OutboundHangerMonitoringService } from './outbound-hanger-monitoring.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { I18nPipe } from '~/shared/pipes/i18n.pipe';
@Component({
  selector: 'app-outbound-hanger-monitoring',
  templateUrl: './outbound-hanger-monitoring.component.html',
  styleUrls: ['./outbound-hanger-monitoring.component.less'],
  providers: [I18nPipe],
})
export class OutboundHangerMonitoringComponent implements OnInit {
  private _bls_key = ''; // 选择的站点 key
  set bls_key(val) {
    this._bls_key = val;
    this.fetchList();
    this.detailListOfData = [];
  }
  get bls_key() {
    return this._bls_key;
  }

  stationType = ''; // 站点类型
  stationList = []; // 站点列表
  searchValue = ''; // 搜索值

  states = []; // 已选状态
  stateList = []; // 状态列表

  keywords = '';
  tableLoading = false;
  listOfData = [];
  currentRecord = null;
  tableDetailLoading = false;
  detailListOfData = [];
  constructor(
    private commonService: CommonService,
    private ohms: OutboundHangerMonitoringService,
    private message: NzMessageService,
    private i18n: I18nPipe
  ) {}

  async ngOnInit() {
    this.fetchList();

    await this.commonService.dictionary('warehouseoutstationtype').then((data: any[]) => {
      this.stationType = data[0].code;
      this.fetchStationList();
    });

    await this.commonService.dictionary('warehouseoutstate').then((data: any[]) => {
      this.stateList = data;
    });
  }

  onSelectStateChange() {
    this.fetchList()
  }

  fetchStationList() {
    const params = {
      blst_group: 'Station',
      stationtype: this.stationType,
    };
    this.ohms.fetchStationList(params).then((data: any[]) => {
      let stationList = [];
      data.forEach((item) => {
        stationList.push({
          title: item.name && `${item.name}(${item.code})`,
          key: item.key,
          isLeaf: true,
        });
      });
      this.stationList = stationList;
    });
  }

  onTreeReset() {
    this.searchValue = '';
    this.bls_key = '';
    this.fetchStationList();
    this.detailListOfData = [];
  }

  nzItemClick(event) {
    this.bls_key = event.keys[0];
  }

  onRemove(node) {
    // console.log(node);
  }

  onKeyUp() {
    this.fetchList();
  }

  onReset() {
    this.keywords = '';
    this.fetchList();
  }

  fetchList() {
    this.tableLoading = true;
    this.ohms
      .fetchList({
        bls_key: this.bls_key,
        keywords: this.keywords,
        states: this.states.join(','),
      })
      .then((res: any) => {
        res.forEach((item, index) => {
          // item.uuid=self.crypto.randomUUID()
          item.uuid = index;
        });
        this.listOfData = res;
        this.currentRecord = null;
        this.detailListOfData = [];
      })
      .finally(() => {
        this.tableLoading = false;
      });
  }

  onTableItemClick(record) {
    this.currentRecord = record;
    this.fetchDetailList();
  }

  onTableItemClose(record) {
    this.ohms.outboundClose({ key: record.key }).then(() => {
      this.message.success(this.i18n.transform('sucess.s_close'));
      this.fetchList();
      this.detailListOfData = [];
    });
  }
  onDetailTableItemClose(record) {
    this.ohms.outboundDetailClose({ key: record.key }).then(() => {
      this.message.success(this.i18n.transform('sucess.s_close'));
      this.fetchDetailList();
    });
  }

  fetchDetailList() {
    this.tableDetailLoading = true;
    this.ohms
      .fetchDetailList({
        wwom_key: this.currentRecord.key,
      })
      .then((res: any) => {
        this.detailListOfData = res;
      })
      .finally(() => {
        this.tableDetailLoading = false;
      });
  }
}
