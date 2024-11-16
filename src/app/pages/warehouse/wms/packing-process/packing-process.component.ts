import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  HostListener,
  ElementRef,
} from '@angular/core';

import { CommonService } from '~/shared/services/http/common.service';
import { PackingProcessService } from './packing-process.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '~/shared/services/app.service';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ScanPackingProcessComponent } from './scan-packing-process/scan-packing-process.component';
import { WmsStationService } from '~/shared/services/wms-station.service';

@Component({
  selector: 'app-packing-process',
  templateUrl: './packing-process.component.html',
  styleUrls: ['./packing-process.component.less'],
})
export class PackingProcessComponent implements OnInit, OnDestroy {
  stationList = [];
  searchValue = '';
  nzSelectedKeys = [];
  nzExpandedKeys = [];
  scheduleListOfData = [];
  listOfData = [];
  selectedOrigin: Record<string, any> = {};
  curRecord: Record<string, any> = {};

  @ViewChild('treeRef') treeRef;

  constructor(
    private commonService: CommonService,
    public pps: PackingProcessService,
    private message: NzMessageService,
    private appService: AppService,
    private ems: EmbedModalService,
    private modal: NzModalService,
    public wss: WmsStationService
  ) {}

  ngOnInit(): void {
    if (!this.wss.stationList.length) {
      this.wss.fetchStation().then(() => {
        if (this.wss.curStation) {
          this.onStationChange();
        }
      });
    }
  }

  ngOnDestroy(): void {}

  compareFn = (o1: any, o2: any): boolean =>
    o1 && o2 ? o1.key === o2.key : o1 === o2;

  onStationChange() {
    sessionStorage.setItem(
      'wms_curStation',
      JSON.stringify(this.wss.curStation)
    );
    this.fetchPackingschedule();
  }

  fetchPackingschedule() {
    const params = {
      bls_key: this.wss.stationKey,
    };
    this.pps.fetchPackingschedule(params).then((res: any) => {
      res.data.forEach((item) => {
        item.title = item.key;
        item.key = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        item.disabled = true;
        item.boxs.forEach((item2) => {
          item2.title = item2.expr1;
          item2.key = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
          item2.isLeaf = true;
        });
        item.children = item.boxs;
      });

      this.scheduleListOfData = res.data;
      this.onSelectedFirstNode();
    });
  }

  // 默认选中第一个节点
  onSelectedFirstNode() {
    const childOrigin = this.scheduleListOfData[0]?.children[0];
    if (childOrigin) {
      this.nzExpandedKeys = [this.scheduleListOfData[0].key];
      this.nzSelectedKeys = [childOrigin.key];
      this.selectedOrigin = childOrigin;
      this.fetchPackingBoxDetail();
    }
  }

  nzItemClick(event) {
    const node = event.node;
    if (node.level === 0) {
      node.isExpanded = !node.isExpanded;
    } else {
      if (node.isSelected) {
        this.selectedOrigin = node.origin;
        this.fetchPackingBoxDetail();
      } else {
        this.selectedOrigin = {};
        this.listOfData = [];
      }
    }
  }

  fetchPackingBoxDetail() {
    const params = {
      bls_key: this.wss.stationKey,
      zhuangxinfenzu: this.selectedOrigin.zhuangxinfenzu,
      expr1: this.selectedOrigin.expr1,
    };
    this.pps.fetchPackingBoxDetail(params).then((res: any) => {
      // 升序
      res.sort((a, b) => a.taohao - b.taohao);
      this.listOfData = res;
    });
  }

  onJump() {
    this.curRecord = {
      cur_box: null,
      cur_suit: null,
    };
    this.openScanModal();
  }

  onShowScanModal(e, origin) {
    e.stopPropagation();
    const { zhuangxinfenzu, expr1 } = origin;
    this.curRecord = {};
    this.curRecord.cur_box = expr1;
    if (!this.listOfData.length) {
      const params = {
        bls_key: this.wss.stationKey,
        zhuangxinfenzu: zhuangxinfenzu,
        expr1: expr1,
      };
      this.pps.fetchPackingBoxDetail(params).then((res: any) => {
        this.listOfData = res;
        this.getTaohao();
      });
    } else {
      this.getTaohao();
    }
  }

  // 查找里面没有扫完的套号
  findTaohao(arr) {
    let tempArr = JSON.parse(JSON.stringify(arr));
    const result = [];
    const map = new Map();

    // 过滤掉缺件
    tempArr = tempArr.filter((item) => item.state !== 2);

    tempArr.forEach((item) => {
      if (!map.has(item.taohao)) {
        map.set(item.taohao, { state: item.state, count: 1 });
      } else {
        const current = map.get(item.taohao);
        if (current.state === item.state) {
          current.count++;
        } else {
          current.state = -1;
        }
      }
    });

    map.forEach((value, key) => {
      if (value.state === -1) {
        result.push(key);
      }
    });

    return result;
  }

  getTaohao() {
    const taohao = this.findTaohao(this.listOfData);
    this.curRecord.cur_suit = taohao[0];
    // console.log(this.curRecord);
    this.openScanModal();
  }

  openScanModal() {
    const modal = this.modal.create({
      nzTitle: '包装进度',
      nzWidth: '100vw',
      nzContent: ScanPackingProcessComponent,
      nzComponentParams: {
        curRecord: this.curRecord,
      },
      nzFooter: null,
      nzClassName: 'fullscreen-modal',
    });

    modal.afterClose.subscribe(() => {
      this.fetchPackingBoxDetail();
    });
  }

  onReset() {
    this.searchValue = '';
    this.fetchPackingschedule();
  }
}
