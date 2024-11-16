import { Component, OnInit, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { MenuService } from '~/pages/system/menu/menu.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppService } from '~/shared/services/app.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';
import { EditComponent } from './edit/edit.component';
import { UtilService } from '~/shared/services/util.service';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';

interface TreeNode {
    name: string,
    key: string,
    pkey: string,
    children?: TreeNode[]
}

interface FlatNode {
    expandable: boolean
    name: string
    key: string
    pkey: string
    level: number
}

class FilteredTreeResult {
    constructor(public treeData: TreeNode[], public needsToExpanded: TreeNode[] = []) { }
}

function filterTreeData(data: TreeNode[], value: string): FilteredTreeResult {
    const needsToExpanded = new Set<TreeNode>()
    const _filter = (node: TreeNode, result: TreeNode[]) => {
        if (node.name.search(value) !== -1) {
            result.push(node)
            return result
        }
        if (Array.isArray(node.children)) {
            const nodes = node.children.reduce((a, b) => _filter(b, a), [] as TreeNode[])
            if (nodes.length) {
                const parentNode = { ...node, children: nodes }
                needsToExpanded.add(parentNode)
                result.push(parentNode)
            }
        }
        return result
    }
    const treeData = data.reduce((a, b) => _filter(b, a), [] as TreeNode[])
    return new FilteredTreeResult(treeData, [...needsToExpanded])
}

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.less']
})
export class MenuComponent extends ListTemplateComponent {

    private transformer = (node: TreeNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node)
        const flatNode =
            existingNode && existingNode.key === node.key
                ? existingNode
                : {
                    expandable: !!node.children && node.children.length > 0,
                    name: node.name,
                    level,
                    key: node.key,
                    pkey: node.pkey
                }
        flatNode.name = node.name
        this.flatNodeMap.set(flatNode, node)
        this.nestedNodeMap.set(node, flatNode)
        return flatNode
    }

    treeData: TreeNode[]
    treeDataToEdit: TreeNode[]
    flatNodeMap = new Map<FlatNode, TreeNode>()
    nestedNodeMap = new Map<TreeNode, FlatNode>()
    expandedNodes: any[] = []

    treeControl = new FlatTreeControl<FlatNode, TreeNode>(
        node => node.level,
        node => node.expandable,
        {
            trackBy: flatNode => this.flatNodeMap.get(flatNode)!
        }
    )
    treeFlattener = new NzTreeFlattener(
        this.transformer,
        node => node.level,
        node => node.expandable,
        node => node.children
    )

    dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener)

    originData$ = new BehaviorSubject<TreeNode[]>(null)
    searchValue$ = new BehaviorSubject<string>(null)
    filteredData$: Observable<any>
    searchValue: string = null

    @ViewChild('menuEdit') editEle: EditComponent
    model: any

    constructor(
        private appService: AppService,
        private menuService: MenuService,
        private modal: NzModalService) {
        super();
        this.modularInit("sysMenu");
    }

    hasChild = (_: number, node: FlatNode) => node.expandable
    trackBy = (_: number, node: FlatNode) => `${node.key}-${node.name}`

    ngOnInit(): void {
        this.menuService.list().then((response: TreeNode[]) => {
            this.treeData = response
            this.dataSource.setData(this.treeData)
            this.treeDataToEdit = JSON.parse(JSON.stringify(this.treeData))

            this.originData$ = new BehaviorSubject<TreeNode[]>(JSON.parse(JSON.stringify(this.treeData)))
            this.filteredData$ = combineLatest([
                this.originData$,
                this.searchValue$.pipe(
                    auditTime(300),
                    map(value => (this.searchValue = value))
                )
            ]).pipe(map(([data, value]) => (value ? filterTreeData(data, value) : new FilteredTreeResult(data))))

            this.filteredData$.subscribe(result => {
                this.flatNodeMap.clear()
                this.nestedNodeMap.clear()
                this.dataSource.setData(result.treeData)
                this.treeData = result.treeData
                const hasSearchValue = !!this.searchValue
                if (hasSearchValue) {
                    if (this.expandedNodes.length === 0) {
                        this.expandedNodes = this.treeControl.expansionModel.selected
                        this.treeControl.expansionModel.clear()
                    }
                    this.treeControl.expansionModel.select(...result.needsToExpanded)
                } else {
                    if (this.expandedNodes.length) {
                        this.treeControl.expansionModel.clear()
                        this.treeControl.expansionModel.select(...this.expandedNodes)
                        this.expandedNodes = []
                    }
                }
            })
        })
    }

    onAction(ev) {
        switch (ev.action) {
            case 'add':
                this.add(ev.node)
                return;
            case 'update':
                this.edit(ev.node)
                return;
        }
    }
    edit(node: FlatNode): void {
        const result = this.flatNodeMap.get(node)
        this._service.comList(this.otherUrl.btnurl, { smi_key: node.key }, 'getlist').then((result) => {
            let _btnlist = new Array();
            // this.modular.btn.forEach(_btn => { _btnlist.push(_btn); });
            result.forEach(d => {
                d.checked = true;
                let a = -1;
                _btnlist.forEach((l, i) => { if (l.action == d.action) { return a = i; } });
                if (a == -1) { _btnlist.push(d) } else { _btnlist.splice(a, 1, d); }
            });
            this.menuService.get(node.key).then((response: any) => {
                response = Object.assign(response, { menubuttondtolist: _btnlist })
                this.model = { ...response, version: Math.random() }//添加version防止修改后再次点击同一个菜单没反应
                const treeData = JSON.parse(JSON.stringify(this.treeData))
                this.treeDataToEdit = UtilService.filterParentsWithoutMySelf(treeData, node.key)
            })
        })
    }

    delete(node: FlatNode): void {
        const originNode = this.flatNodeMap.get(node)
        this.modal.confirm({
            nzTitle: this.appService.translate("confirmToDelete"),
            nzMaskClosable: true,
            nzOnOk: () => {
                this.menuService.del(originNode.key).then(() => {
                    this.delMenu(this.treeData, originNode.key)
                    this.nodeDataUpdate(originNode.pkey)
                    this.editEle.reset()
                })
            }
        })
    }

    add(node: FlatNode): void {
        this.treeDataToEdit = JSON.parse(JSON.stringify(this.treeData))
        const parentNode = this.flatNodeMap.get(node)
        this.model = Object.assign({}, {
            pkey: node ? node.key : null,
            sort: node ? node['sort'] + 1 : null
        })
    }

    menuAdd(data) {
        const flatNodes: FlatNode[] = [...this.flatNodeMap.keys()]
        const flatNode: FlatNode = flatNodes.find(({ key }) => key == data.pkey)
        const parentNode: TreeNode = this.flatNodeMap.get(flatNode)
        const item: TreeNode = {
            name: data.name,
            pkey: data.pKey,
            key: data.key,
            children: []
        }
        if (parentNode) {
            parentNode.children = parentNode.children || []
            parentNode.children.push(item)
        } else {
            if (!this.treeData) this.treeData = []
            this.treeData.push(item)
        }
        this.nodeDataUpdate(data.pkey)
    }

    menuUpdate(data) {
        const nestedNodes: TreeNode[] = [...this.flatNodeMap.values()]
        const nestedNode: TreeNode = nestedNodes.find(({ key }) => key == data.key)
        if (nestedNode) {
            const { pkey, key } = this.model
            const modelKey = key
            let index = -1
            if (pkey && pkey != "0") {
                const parentNodeBefore: TreeNode = nestedNodes.find(({ key }) => key == pkey)
                index = parentNodeBefore.children.findIndex(({ key }) => key == modelKey)
                if (index >= 0) {
                    parentNodeBefore.children.splice(index, 1)
                }
            } else {
                index = this.treeData.findIndex(({ key }) => key == modelKey)
                if (index >= 0) {
                    this.treeData.splice(index, 1)
                }
            }

            nestedNode.name = data.name
            const flatNodes: FlatNode[] = [...this.flatNodeMap.keys()]
            const flatNode: FlatNode = flatNodes.find(({ key }) => key == data.pkey)
            const parentNode: TreeNode = this.flatNodeMap.get(flatNode)
            if (parentNode) {
                nestedNode.pkey = parentNode.key
                parentNode.children = parentNode.children || []
                if (!parentNode.children.find(({ key }) => key == nestedNode.key)) {
                    if (pkey == data.pkey) {
                        if (index >= 0) {
                            parentNode.children.splice(index, 0, nestedNode)
                        } else {
                            parentNode.children.push(nestedNode)
                        }
                    } else {
                        parentNode.children.push(nestedNode)
                    }
                }
            } else {
                nestedNode.pkey = null
                if (pkey == data.pkey) {
                    if (index >= 0) {
                        this.treeData.splice(index, 0, nestedNode)
                    } else {
                        this.treeData.push(nestedNode)
                    }
                } else {
                    this.treeData.push(nestedNode)
                }
            }
            this.nodeDataUpdate(data.pkey)
        }
    }

    nodeDataUpdate(pkey = null) {
        this.flatNodeMap.clear()
        this.nestedNodeMap.clear()
        this.dataSource.setData(this.treeData)
        this.treeControl.collapseAll()
        const flatNodesNew: FlatNode[] = [...this.flatNodeMap.keys()]
        const result = this.findAllParentNodes(flatNodesNew, pkey)
        if (result) {
            result.forEach(item => {
                this.treeControl.expand(item)
            })
        }
    }

    findAllParentNodes(flatNodes: FlatNode[], key, result: FlatNode[] = []) {
        if (key && key != "0") {
            const flatNode: FlatNode = flatNodes.find(item => item.key == key)
            if (flatNode) {
                result.unshift(flatNode)
                if (flatNode.pkey) {
                    this.findAllParentNodes(flatNodes, flatNode.pkey, result)
                }
            }
        }
        return result
    }

    delMenu(data: any[], key) {
        data.forEach((item, index) => {
            if (item.children && item.children.length > 0) {
                this.delMenu(item.children, key)
            }
            if (item.key == key) {
                data.splice(index, 1)
            }
        })
    }
}
