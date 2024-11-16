import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { cloneDeep as _cloneDeep } from 'lodash';
import { PackingSolutionService } from '../packing-solution.service';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { AppService } from '~/shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-packing-solution-sort',
  templateUrl: './packing-solution-sort.component.html',
  styleUrls: ['./packing-solution-sort.component.less'],
})
export class PackingSolutionSortComponent implements OnInit {
  packingList = [];

  // 未排序
  searchText = '';
  unsortedList = [];
  checked = false;
  indeterminate = false;
  setOfCheckedKey = new Set<string>();

  // 已排序
  searchText2 = '';
  sortedList = [];
  checked2 = false;
  indeterminate2 = false;
  setOfCheckedKey2 = new Set<string>();

  constructor(
    private pss: PackingSolutionService,
    private ems: EmbedModalService,
    private appService: AppService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.fetchList();
  }

  fetchList() {
    this.pss.fetchPackingList().then((data: any) => {
      this.unsortedList = data.filter((item) => item.sort === 0);
      this.sortedList = data.filter((item) => item.sort !== 0);
    });
  }

  onAllChecked(checked: boolean): void {
    this.unsortedList.forEach(({ key }) => this.updateCheckedSet(key, checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(key: string, checked: boolean): void {
    this.updateCheckedSet(key, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(key: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedKey.add(key);
    } else {
      this.setOfCheckedKey.delete(key);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.unsortedList.every(({ key }) =>
      this.setOfCheckedKey.has(key)
    );
    this.indeterminate =
      this.unsortedList.some(({ key }) => this.setOfCheckedKey.has(key)) &&
      !this.checked;
  }

  onAllChecked2(checked: boolean): void {
    this.sortedList.forEach(({ key }) => this.updateCheckedSet2(key, checked));
    this.refreshCheckedStatus2();
  }

  onItemChecked2(key: string, checked: boolean): void {
    this.updateCheckedSet2(key, checked);
    this.refreshCheckedStatus2();
  }

  updateCheckedSet2(key: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedKey2.add(key);
    } else {
      this.setOfCheckedKey2.delete(key);
    }
  }

  refreshCheckedStatus2(): void {
    this.checked2 = this.sortedList.every(({ key }) =>
      this.setOfCheckedKey2.has(key)
    );
    this.indeterminate2 =
      this.sortedList.some(({ key }) => this.setOfCheckedKey2.has(key)) &&
      !this.checked2;
  }

  onTransferToLeft() {
    const sortedList = _cloneDeep(this.sortedList);
    const unsortedList = _cloneDeep(this.unsortedList);
    this.setOfCheckedKey2.forEach((key) => {
      const i = sortedList.findIndex((item) => item.key === key);
      // unsortedList.unshift(sortedList.splice(i, 1)[0]);
      unsortedList.push(sortedList.splice(i, 1)[0]);
    });
    this.sortedList = sortedList;
    this.unsortedList = unsortedList;
    this.setOfCheckedKey2.clear();
    this.indeterminate2 = false;
    this.checked2 = false;
  }

  onTransferToRight() {
    const sortedList = _cloneDeep(this.sortedList);
    const unsortedList = _cloneDeep(this.unsortedList);
    this.setOfCheckedKey.forEach((key) => {
      const i = unsortedList.findIndex((item) => item.key === key);
      // sortedList.unshift(unsortedList.splice(i, 1)[0]);
      sortedList.push(unsortedList.splice(i, 1)[0]);
    });
    this.sortedList = sortedList;
    this.unsortedList = unsortedList;
    this.setOfCheckedKey.clear();
    this.indeterminate = false;
    this.checked = false;
  }

  onMoveUp(origin) {
    const sortedList = _cloneDeep(this.sortedList);
    const index = sortedList.findIndex((item) => item.key === origin.key);
    if (index > 0) {
      const temp = sortedList[index - 1];
      sortedList[index - 1] = sortedList[index];
      sortedList[index] = temp;
    }
    this.sortedList = sortedList;
  }

  onMoveDown(origin) {
    const sortedList = _cloneDeep(this.sortedList);
    const index = sortedList.findIndex((item) => item.key === origin.key);
    if (index < sortedList.length - 1) {
      const temp = sortedList[index + 1];
      sortedList[index + 1] = sortedList[index];
      sortedList[index] = temp;
    }
    this.sortedList = sortedList;
  }

  onTopUp(origin) {
    const sortedList = _cloneDeep(this.sortedList);
    const index = sortedList.findIndex((item) => item.key === origin.key);
    if (index !== 0) {
      const temp = sortedList[0];
      sortedList[0] = sortedList[index];
      sortedList[index] = temp;
    }
    this.sortedList = sortedList;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sortedList, event.previousIndex, event.currentIndex);
  }

  onSure() {
    const keyArray = [];
    this.sortedList.forEach((item) => {
      keyArray.push(item.key);
    });
    const params = {
      keys: keyArray,
    };
    this.pss.sortPackingList(params).then(() => {
      this.message.success(this.appService.translate('sucess.s_sort'));
      this.ems.modalClose$.next({
        type: 'app-packing-solution-sort',
        bool: true,
      });
    });
  }

  onClose() {
    this.ems.modalClose$.next({
      type: 'app-packing-solution-sort',
      bool: false,
    });
  }
}
