import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '~/shared/services/app.service';
import { StockService } from '~/pages/warehouse/wms/stock/stock.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';
import { CommonService } from '~/shared/services/http/common.service';
import { NumComponent } from './num/num.component';
import { CaltimeComponent } from './caltime/caltime.component';
import { OutComponent } from './out/out.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { Router } from '@angular/router';
import { CrudComponent } from '~/shared/common/crud/crud.component';

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
    pkey: string,
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
    selector: 'app-stock',
    templateUrl: './stock.component.html',
    styleUrls: ['./stock.component.less']
})
export class StockComponent extends ListTemplateComponent {

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

    @ViewChild('numStock') numStockEle: NumComponent
    @ViewChild('outStock') outStockEle: OutComponent
    @ViewChild('caltime') caltimeEle: CaltimeComponent
    @ViewChild('crud') crud: CrudComponent

    tableColumns: any[] = []
    queryParams: any = {}
    ready: boolean = false

    constructor(public router: Router,
        public stockService: StockService,
        private commonService: CommonService,
        private appService: AppService
    ) {
        super()
        this.modularInit("wmsStock");
        this.url = router.url.replace(/\//g, "_")
        if (this.url.indexOf("_") == 0) {
            this.url = this.url.substring(1, this.url.length)
        }
    }
    Locationtype = [{ label: 'placard.Within', value: 0, completed: false, disabled: true, checked: true },
    { label: 'placard.Onmain', value: 1, completed: false, disabled: true }]

    hasChild = (_: number, node: FlatNode) => node.expandable

    async ngOnInit() {
        // await this.commonService.getTableHeader().then((response: any) => {
        // this.tableColumns = await this.stockService.tableColumns()
        // })
        // await this.stockService.stations().then((response: TreeNode[]) => {
        //     this.dataSource.setData(response)
        //     this.treeData = response
        // })
        // if (this.treeData?.length > 0) {
        //     this.queryParams = { bls_key: this.treeData[0].key }
        // }
        // this.stationKeywordSearch()
        // this.crud.queryByParams(this.queryParams)
        this.ready = true
    }
    btnEvent(event) {
        switch (event.action) {
            case 'out':
                // console.log(event.node)
                // this.outStockEle.open(event.node, { path:1256 })
                // this.doOutStock(event.node);
                return;
        }
        super.btnEvent(event);
    }

    stationKeywordSearch() {
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
    }

    //分类搜索
    selectCategory(ev) {
        if (ev) { this.crud.SearchModel.bls_key = ev.key; } else {
            this.crud.SearchModel.bls_key = '';
        }
        this.crud.Search()
        // $event.stopPropagation()
        // this.queryParams = { bls_key: $event ? $event.key : '' }
        // this.crud.Search(null,this.queryParams)
    }

    doOutStock(setOfCheckedId) {
        const data = [...setOfCheckedId]
        if (data.length <= 0) {
            const { bls_key } = this.queryParams
            const queryByParams = this.crud.queryParams
            const selectedNode = this.findSelectedNode(this.treeData, bls_key)
            if (selectedNode && selectedNode.path) {
                this.numStockEle.open(selectedNode.path.split(',')[0], queryByParams)
            }
            return false
        } else {
            for (let i = 0; i < data.length; i++) {
                const result = this.crud.list.find(({ key }) => key == data[i])
                if (result
                    && result.isfrozen) {
                    this.message.warning(this.appService.translate("stock.frozenWarn"))
                    return false
                }
            }
            const records = this.crud.list.filter(({ key }) => {
                return data.includes(key)
            })
            this.openOutStock(records)
        }
    }

    openOutStock(data: any[]) {
        const { bls_key } = this.queryParams
        const selectedNode = this.findSelectedNode(this.treeData, bls_key)
        if (selectedNode && selectedNode.path) {
            this.outStockEle.open(data, { path: selectedNode.path.split(',')[0] })
        }
    }

    openCaltime() {
        const queryByParams = this.crud.queryParams
        this.caltimeEle.open(queryByParams)
    }

    findSelectedNode(data: any[], key: string) {
        let result = null
        for (let i = 0, len = data.length; i < len; i++) {
            if (key == data[i].key) {
                result = data[i]
                break
            } else {
                if (data[i].children?.length > 0) {
                    const res = this.findSelectedNode(data[i].children, key)
                    if (res) {
                        result = res
                    }
                }
            }
        }
        return result
    }
    onclick(ev) {
        //   if (!ev) { this.SearchModel = {}; } else { this.SearchModel.psc_key = ev.key; }
        //   this._crud.GetList(this.SearchModel)
    }
}
