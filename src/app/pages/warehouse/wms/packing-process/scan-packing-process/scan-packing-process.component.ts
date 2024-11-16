import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  HostListener,
  ElementRef,
  TemplateRef,
  Input,
} from '@angular/core';

import { CommonService } from '~/shared/services/http/common.service';
import { PackingProcessService } from '../packing-process.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppService } from '~/shared/services/app.service';
import { WmsStationService } from '~/shared/services/wms-station.service';

@Component({
  selector: 'app-scan-packing-process',
  templateUrl: './scan-packing-process.component.html',
  styleUrls: ['./scan-packing-process.component.less'],
})
export class ScanPackingProcessComponent implements OnInit, AfterViewInit {
  @Input() curRecord: any;
  @ViewChild('clothNoInput', { read: ElementRef }) clothNoInput;
  @ViewChild('clothTable', { read: ElementRef }) clothTable;
  @ViewChild('tableView') tableView;
  @ViewChild('tplContent') tplContent;
  @ViewChild('customTitle', { read: TemplateRef }) customTitle;
  tableHeight = 0;

  stationNum = null;
  stationStatusName = null;
  clothNo = '';
  isTrigger = false;
  // 当前扫码的衣服
  get currentCloth() {
    return this.clothList.find((item) => item.tiaoma === this.clothNo) ?? {};
  }

  boxInfo: any = {};
  clothList = [];
  totalQuantity = 0; // 合计套数
  completedQuantity = 0; // 完成件数

  constructor(
    private commonService: CommonService,
    public pps: PackingProcessService,
    private message: NzMessageService,
    private modal: NzModalService,
    private appService: AppService,
    public wss: WmsStationService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.autoSize();
  }

  autoSize() {
    setTimeout(() => {
      const headerHeight = 40;
      const footerHeight = 40;
      this.tableHeight =
        this.tableView.nativeElement.clientHeight -
        headerHeight -
        footerHeight -
        30;
    }, 10);
  }

  ngAfterViewInit(): void {
    this.autoSize();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.clothNoInput.nativeElement.focus();
    }, 300);
    this.fetchStationSum();
    this.fetchStationStatus();
  }

  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  fetchStationSum() {
    const params = {
      start_date: this.getCurrentDate(),
      end_date: this.getCurrentDate(),
      hei_key: sessionStorage.getItem('userkey'),
    };
    this.pps.fetchStationSum(params).then((res: any) => {
      this.stationNum = res.data.sumnumber;
    });
  }

  fetchStationStatus() {
    this.pps.fetchStationStatus(this.wss.stationKey).then((res: any) => {
      this.stationStatusName = res.state_name;
    });
  }

  onPrintSuit(item) {
    const params = {
      bls_key: this.wss.stationKey,
      zhuangxinfenzu: this.boxInfo.zhuangxinfenzu,
      tiaoma: item.tiaoma,
    };
    this.pps.printSuit(params).then(() => {
      this.message.success('打印成功！');
    });
  }

  onPrintBox() {
    const params = {
      bls_key: this.wss.stationKey,
      zhuangxinfenzu: this.boxInfo.zhuangxinfenzu,
      // tiaoma: this.clothNo,
      expr1: this.boxInfo.expr1,
    };
    this.pps.printBox(params).then(() => {
      this.message.success('打印成功！');
    });
  }

  onAutoPrint() {
    // 根据接口返回的属性判断
    if (this.boxInfo.isprintsuit && this.currentCloth.taohao) {
      // 重置套号
      this.curRecord.cur_suit = null;
      this.message.warning(
        `当前套号${this.currentCloth.taohao}已集齐，正在自动打印不干胶...`
      );
    }
    if (this.boxInfo.isprintbox) {
      // 重置箱号和套号
      this.curRecord = {
        cur_box: null,
        cur_suit: null,
      };
      setTimeout(() => {
        this.message.warning(`当前箱已扫完，正在自动打印箱贴...`);
      }, 300);
    }

    // 重新限制套号
    const taohao = this.findTaohao(this.clothList);
    this.curRecord.cur_suit = taohao[0];
  }

  onEnterKeyDown() {
    this.isTrigger = true;
    this.judgeIsSame();
  }

  onInput(e) {
    if (e.inputType === 'insertFromPaste') {
      this.clothNo = e.target.value;
    } else {
      if (this.isTrigger) {
        this.clothNo = e.data;
        this.isTrigger = false;
      } else {
        this.clothNo = e.target.value;
      }
    }
  }

  // 判断是否本箱/套
  judgeIsSame() {
    const msgId = this.message.loading(
      this.appService.translate('placard.loading'),
      { nzDuration: 0 }
    ).messageId;
    this.pps
      .judgeIsSame(this.clothNo)
      .then((data: any) => {
        // console.log('当前限制的套号', this.curRecord.cur_suit);
        // 判断是否为本箱产品
        if (!this.curRecord.cur_box) {
          this.curRecord = {
            cur_box: data.expr1,
            cur_suit: data.taohao,
          };
        } else {
          if (data.expr1 !== this.curRecord.cur_box) {
            this.modal.confirm({
              nzClassName: 'packing-modal',
              nzTitle: this.customTitle,
              nzContent: `当前衣服码 ${this.clothNo} 非本箱产品,是否继续操作？`,
              nzOnOk: () => {
                this.fetchPackingProcess();
              },
              nzOnCancel: () => {
                this.clothNoInput.nativeElement.focus();
              },
            });
            return;
          }
        }

        // 有套的情况下，判断是否为本套产品
        if (
          data.taohao &&
          this.curRecord.cur_suit &&
          data.taohao !== this.curRecord.cur_suit
        ) {
          this.modal.confirm({
            nzClassName: 'packing-modal',
            nzTitle: this.customTitle,
            nzContent: `当前衣服码 ${this.clothNo} 非本套产品,是否继续操作？`,
            nzOnOk: () => {
              this.fetchPackingProcess();
            },
            nzOnCancel: () => {
              this.clothNoInput.nativeElement.focus();
            },
          });
          return;
        }

        this.fetchPackingProcess();
      })
      .finally(() => {
        setTimeout(() => {
          this.message.remove(msgId);
        }, 300);
      });
  }

  // 获取箱信息
  fetchPackingProcess() {
    const msgId = this.message.loading(
      this.appService.translate('placard.loading'),
      { nzDuration: 0 }
    ).messageId;

    const params = {
      bls_key: this.wss.stationKey,
      keywords: this.clothNo,
    };
    this.pps
      .fetchPackingProcessInfo(params)
      .then((data: any) => {
        this.boxInfo = data;
        this.fetchPackingProcessTable();
      })
      .finally(() => {
        setTimeout(() => {
          this.message.remove(msgId);
        }, 300);
      });
  }

  fetchPackingProcessTable() {
    // 获取产量
    this.fetchStationSum();

    const params2 = {
      zhuangxinfenzu: this.boxInfo.zhuangxinfenzu, // 包装方案编号
      expr1: this.boxInfo.expr1, // 箱号
      xianghao: this.boxInfo.xianghao, // 箱号
    };
    this.pps.fetchPackingProcessTable(params2).then((data: any) => {
      data.details = this.updateBoxArray(data.details);
      this.clothList = data.details;
      this.totalQuantity = data.box_tao_quantity;
      this.completedQuantity = data.check_quantity;

      this.onAutoPrint();
      setTimeout(() => {
        this.scrollToCurrentRow();
      }, 0);
    });
  }

  // 滚动到当前扫码衣架行位置
  scrollToCurrentRow() {
    const index = this.clothList.findIndex(
      (item) => item.tiaoma === this.clothNo
    );
    if (index !== -1) {
      // 获取表格的滚动容器
      const scrollContainer =
        this.clothTable.nativeElement.querySelector('.ant-table-body');
      if (scrollContainer) {
        // 计算选中行的位置
        const rowElement =
          scrollContainer.querySelectorAll('.ant-table-row')[index];
        const rowTop = rowElement.offsetTop;
        // 滚动到选中行的位置
        scrollContainer.scrollTo({
          top: rowTop,
          behavior: 'smooth',
        });
      }
    }
  }

  // 根据衣服扫码情况，给当前行设置背景色
  updateBoxArray(boxArray) {
    // 创建一个对象来存储按taohao分组的对象
    const groupedBox = {};

    // 遍历原始数组，按taohao分组
    boxArray.forEach((item) => {
      const { taohao, tiaoma } = item;
      if (!taohao) {
        groupedBox[tiaoma] = [
          {
            ...item,
            halfFinish: false,
            finish: false,
          },
        ];
      } else {
        if (!groupedBox[taohao]) {
          groupedBox[taohao] = [];
        }
        groupedBox[taohao].push({
          ...item,
          halfFinish: false,
          finish: false,
        });
      }
    });

    // 遍历分组后的对象，根据iscomplete属性更新finish和halfFinish
    Object.keys(groupedBox).forEach((taohao) => {
      const group = groupedBox[taohao];
      const allComplete = group.every((item) => item.iscomplete);
      const anyComplete = group.some((item) => item.iscomplete);
      if (allComplete) {
        group.forEach((item) => {
          item.isFinish = true;
          item.isHalfFinish = false;
        });
      } else if (anyComplete) {
        group.forEach((item) => {
          item.isHalfFinish = true;
          item.isFinish = false;
        });
      } else {
        group.forEach((item) => {
          item.isHalfFinish = false;
          item.isFinish = false;
        });
      }
    });

    // 将更新后的对象数组扁平化为原始格式
    const updatedBox = Object.values(groupedBox).flat();

    // 返回更新后的数组
    return updatedBox;
  }

  toPercentFormat(percent) {
    return parseInt(percent) + '%';
  }

  onConfirm(record) {
    this.pps.confirmLackPart({ key: record.key }).then(() => {
      this.message.success('操作成功!');
      record.state = 2;
      record.state_name = '缺件';

      // 重新限制套号
      const taohao = this.findTaohao(this.clothList);
      this.curRecord.cur_suit = taohao[0];
    });
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
}
