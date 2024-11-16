import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { NzFormatEmitEvent } from "ng-zorro-antd/tree";
import { AppConfig } from "~/shared/services/AppConfig.service";
import { UtilService } from "~/shared/services/util.service";
import { ListTemplateComponent } from "../base/list-template.component";
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

declare var $: any;
interface FlatNode {
  expandable: boolean;
  name: string;
  disabled?: boolean;
  level: number;
  node: any;
}
/**
 * 分类树/父级树
 */
@Component({
  selector: 'class-ztree',
  templateUrl: './class-ztree.component.html',
  styleUrls: ['./class-ztree.component.less']
})
export class ClassZtreeComponent extends ListTemplateComponent implements OnChanges {
  constructor() { super(); }
  @ViewChild('tree') tree;
  /***标题 */
  @Input() title;
  /**数据源 */
  @Input() list: any;
  /**地址 */
  @Input() commUrl: string;
  /**地址 */
  @Input() ComponentParam: any;
  /**默认 */
  @Input() default: any;
  /**是否全部展开 */
  @Input() allAxpand: boolean = true;
  /**分类-父级字段*/
  @Input() pKey: string = 'pkey';
  /**子级字段 */
  @Input() children = 'children';
  /**绑定字段*/
  @Input() DataFiled = 'key';
  /**绑定显示内容字段*/
  @Input() DataTxt = 'name';
  /**二显 */
  @Input() secondary: string = '';
  /**禁用条件 */
  @Input() disabled: any = {};
  @Input() Datadaty = 'getlist/';
  /**右键动作配置 */
  @Input() action: any[] = [];
  /**查询 */
  searchValue = '';
  @Input() modular: any;
  /**获取参数 */
  @Input() params: any;
  /**是否需要登录 */
  @Input() islogin: boolean = true;
  /**	显示隐藏气泡框 */
  @Input() TooltipVisible: boolean = false;
  // 点击返回事件
  @Output() onclick = new EventEmitter();
  // 按钮返回事件
  @Output() onAction = new EventEmitter();
  /**鼠标按下选中值 */
  selectNode: any;
  /**组装数据 */
  private transformer = (node: any, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.title,
    level,
    node: node,
    disabled: !!node.disabled || node[this.disabled.field] != this.disabled.value
  });
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );
  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );
  node = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);;
  surplus = new Array();
  hasChild = (_: number, node: FlatNode): boolean => node.expandable;
  ngOnInit() {
    if (this.DataTxt == 'code' || this.DataTxt == 'name') {
      this.secondary = this.DataTxt == 'name' ? 'code' : 'name';
    } else { this.secondary = this.secondary; }
    this.GetList();
  }
  /**改变*/
  ngOnChanges(changes: SimpleChanges) { this.initialize(this.list); }
  GetList() {
    if (!this.list || this.commUrl) {
      let _body: Object = Object.assign({}, { keywords: this.searchValue }, this.params);
      this._service.comList(this.commUrl, _body, this.Datadaty, this.islogin).then((result) => {
        this.initialize(UtilService.uniq(this.initMenus(result)));
      });
    } else { this.initialize(this.list); }
  }
  initialize(data) {
    // console.log(data)getExpandedNodeList
    this.node.setData(data);
    if (this.default || this.default == 0 && this.node.getData().length > 0) {
      let select = this.getNode(data[this.default].name + '[' + data[this.default].code + ']');
      this.selectNode = select.node;
      if (this.onclick) { this.onclick.emit(select.node) }
    }
    if (this.allAxpand == true)
      this.treeControl.expandAll();
    else if (this.selectNode && this.selectNode.key) {
      let select = this.getNode(this.selectNode.title)
      if (select.expandable == false && this.selectNode.children) return;
      this.treeControl.expandDescendants(select)
    }
  }
  getNode(name: string): FlatNode | null {
    return this.treeControl.dataNodes.find(n => n.name === name) || null;
  }
  /**
   * 构建文件结构树。
   */
  initMenus(data, pkey?) {
    if (!data || data.length <= 0) return [];
    data = data.sort((a, c) => a.sort - c.sort);
    return data.map(item => {
      let extra = false;
      if (item[this.pKey] == item[this.DataFiled]) item[this.pKey] = null;
      if (!pkey || pkey == '' || pkey == '0') {
        extra = data.find(d => d[this.DataFiled] == item[this.pKey]) ? false : true;
      }
      if ((!pkey && (!item[this.pKey] || item[this.pKey] == '' || item[this.pKey] == '0')) || (pkey && item[this.pKey] && item[this.pKey] == pkey) || extra == true) {
        const temp = Object.assign(item, {
          title: item[this.DataTxt] + (item[this.secondary] ? '[' + item[this.secondary] + ']' : ''),
          children: item[this.children] ? item[this.children] : []
        })
        if (item.sonlist && item.sonlist.length > 0) {
          temp.children = this.initMenus(item.sonlist, item[this.DataFiled])
        }
        if (!item[this.children] || item[this.children].length == 0) {
          let s = data.filter(f => f[this.pKey] && f[this.pKey] != '' && f[this.pKey] != '0' && item[this.DataFiled] !== f[this.DataFiled]);
          temp.children = UtilService.uniq(this.initMenus(s, item[this.DataFiled]))
        }
        return temp
      }
    })
  }
  nzEvent(event: NzFormatEmitEvent): void {
    if (event.node && event['disabled'] == false) {
      this.selectNode = event.node;
      if (this.onclick) { this.onclick.emit(event.node) }
    }
  }
  Action(action?, model?) {
    if (action) {
      if (action == 'del') {
        this._service.deleteModel('admin/' + this.commUrl + '/', [model.node], (s) => { this.ResetTree(); })
        return
      }
      if (this.onAction) {
        this.selectNode = model.node;
        this.onAction.emit({ action: action, node: model.node })
      }
    }
  }
  search(event?) {
    if (!(event && event.keyCode !== 13)) {
      this.GetList();
    }
  }
  refreshTree(ev?) {
    this.GetList();
    if (this.onclick) {
      this.onclick.emit(null)
    }
  }
  ResetTree() {
    this.selectNode = {};
    this.searchValue = '';
    this.GetList();
    if (this.onclick) {
      this.onclick.emit(null)
    }
  }
}