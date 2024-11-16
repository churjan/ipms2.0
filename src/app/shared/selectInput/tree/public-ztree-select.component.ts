import { Component, Output, OnInit, forwardRef, EventEmitter, Input, ViewChild, AfterViewInit, Injectable } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { NestedTreeControl } from '@angular/cdk/tree';
import { UtilService } from '~/shared/services/util.service';
import { number } from 'echarts';
declare var $: any;
const C_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PublicZtreeSelectContent),
  multi: true
};
@Component({
  selector: 'ina-ztree-select',
  templateUrl: './public-ztree-select.component.html',
  styleUrls: [`./tree.less`],
  providers: [C_SWITCH_CONTROL_VALUE_ACCESSOR]
})
/**公共树组件 */
export class PublicZtreeSelectContent implements ControlValueAccessor, OnInit {
  @ViewChild('tree') tree;
  // 初始值
  @Input() value: string;
  // 数据源类型
  @Input() datatype = 'opation';
  /**是否必选项 */
  @Input() required = false;
  // 数据源参数
  @Input() params: any = {};
  // 查询参数
  @Input() searchparams: any = {};
  // 数据源
  @Input() nodes: any[] = [];
  @Input() rawdata: any[];
  surplus = new Array();
  // 标题
  @Input() title: string = '';
  /**配置 */
  @Input() setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', url: '', child: 'children' }
  @Input() maxheight: number = 200;
  secondary = 'code';
  /**鼠标按下选中值 */
  selectNode: any;
  /**是否底层选择 */
  @Input() isBottom = false;
  isopen = false;
  name = '';
  // 查询值
  searchvalue: any;
  selectModel: any;
  // 选择后返回事件
  @Output() onSelect = new EventEmitter();
  constructor(private service: UtilService) { }
  writeValue(obj: any): void {
    if (obj !== undefined && obj != null) {
      this.value = obj;
    } else { this.value = ''; }
  }
  private onTouchedCallback = (v: any) => { }

  private onChangeCallback = (v: any) => { }
  registerOnChange(fn: any) { this.onChangeCallback = fn; }

  registerOnTouched(fn: any) { this.onTouchedCallback = fn; }
  ngOnInit() {
    if (this.setting.DataTxt == 'code' || this.setting.DataTxt == 'name') {
      this.secondary = this.setting.DataTxt == 'name' ? 'code' : 'name';
    } else { this.secondary = ''; }
    if (this.rawdata) { this.initialize(this.rawdata); } else { this.InitSelect(); }
  }
  /**获取数据 */
  InitSelect() {
    const that = this;
    if (that.setting.url && that.setting.url !== '') {
      let _body: Object = Object.assign({}, this.params, this.selectModel);
      this.service.comList(that.setting.url, _body, this.datatype).then((result) => {
        if (result) { this.initialize(result); }
      });
    }
  }
  /**组合树结构 */
  initialize(data) {
    this.nodes = UtilService.uniq(this.buildFileTree(data));
  }
  /**
   * 构建文件结构树。
   */
  buildFileTree(data: any[], pkey?, leve = 0): any[] {
    if (!data || data.length <= 0) return [];
    data = data.sort((a, c) => a.sort - c.sort);
    return data.map(item => {
      let extra = false;
      if (!pkey || pkey == '' || pkey == '0') {
        extra = data.find(d => d.key == item.pkey) ? false : true;
      }
      if ((!pkey && (!item.pkey || item.pkey == '' || item.pkey == '0')) || (pkey && item.pkey && item.pkey == pkey) || extra == true) {
        const temp = Object.assign(item, {
          title: item[this.setting.DataTxt] + (item[this.secondary] ? '[' + item[this.secondary] + ']' : ''),
          children: item[this.setting.child] ? item[this.setting.child] : []
        })
        if (item.sonlist && item.sonlist.length > 0) {
          temp.children = this.buildFileTree(item.sonlist, item.key)
          if (this.isBottom == true && temp.children && temp.children.length > 0) temp.selectable = false;
        }
        if (!item[this.setting.child] || item[this.setting.child].length == 0) {
          let s = data.filter(f => f.pkey && f.pkey != '' && f.pkey != '0' && item.key !== f.key);
          temp.children = UtilService.uniq(this.buildFileTree(s, item.key));
          if (this.isBottom == true && temp.children && temp.children.length > 0) temp.selectable = false;
        }
        if (temp.children.length == 0) { temp.isLeaf = true }
        return temp
      }
    })
  }
  search($event) { }
  /**点击展开树节点图标调用 */
  onExpandChange($event) { }
  /**
   * 输出选中值
   */
  clickItem(v) {
    // let _val = this.nodes.find(x => x[this.setting.DataFiled] == v);
    let _val = this.tree.getTreeNodeByKey(v)
    if (_val) {
      this.tree.nzOpen = false;
      if (this.onSelect) { this.onSelect.emit(_val.origin); }
    } else { this.value = null; }
    this.onChangeCallback(v);
    this.onTouchedCallback(v);
  }
  Click(event) { }
}