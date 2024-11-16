import { Component, OnInit, Output, EventEmitter, forwardRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { AppService } from '~/shared/services/app.service';
import { ParameterService } from '~/pages/system/parameter/parameter.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonService } from '~/shared/services/http/common.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';

import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { UtilService } from '~/shared/services/util.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { I18nPipe } from '~/shared/pipes/i18n.pipe';
const C_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => JsonTreeComponent),
    multi: true
};
interface TreeNode {
    name: string;
    key: string;
    type: string;
    value?: any;
    children?: TreeNode[];
    edit?: boolean;
}
interface FlatNode {
    expandable: boolean;
    type: string;
    name: string;
    key: string;
    level: number;
    edit?: boolean;
}

@Component({
    selector: 'JsonTree',
    templateUrl: './JsonTree.component.html',
    styleUrls: ['./JsonTree.component.less'],
    providers: [C_SWITCH_CONTROL_VALUE_ACCESSOR,I18nPipe]
})
export class JsonTreeComponent implements OnInit {
    constructor(private message: NzMessageService, private i18n: I18nPipe) {
        let node: any = {
            name: i18n.transform('placard.dataSet'),
            type: "object",
            key: '1',
            edit: false,
            children: []
        };
        // node.children = this.restructure(setting.data, node.key)
        this.treeData = [node];
        this.dataSource.setData(this.treeData);
        this.treeControl.expandAll();
    }

    private transformer = (node: TreeNode, level: number): FlatNode => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode =
            existingNode && existingNode.key === node.key ? Object.assign(existingNode, node)
                : {
                    expandable: !!node.children && node.children.length > 0,
                    name: node.name,
                    level: level,
                    key: node.key,
                    type: node.type,
                    edit: node.edit,
                    value: node.value
                };
        flatNode.name = node.name;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    };
    @Output() editDone = new EventEmitter<boolean>()
    alternative: any = {};
    treeData: TreeNode[] = [];
    flatNodeMap = new Map<FlatNode, TreeNode>();
    nestedNodeMap = new Map<TreeNode, FlatNode>();
    selectListSelection = new SelectionModel<FlatNode>(true);
    editNode: any;
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

    dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

    writeValue(obj: any): void {
        if (obj !== undefined && obj != null) {
            // if (this.treeData.length == 0) {
            let _v = JSON.parse(obj)
            let _children = this.restructure(_v, this.treeData[0].key)
            let node: any = {
                name: this.i18n.transform('placard.dataSet'),
                type: "object",
                key: '1',
                edit: false,
                children: _children
            };
            this.treeData = [node];
            this.dataSource.setData(this.treeData);
            this.treeControl.expandAll();
            // }
        }
    }
    registerOnChange(fn: any) { this.onChangeCallback = fn; }
    registerOnTouched(fn: any) { this.onTouchedCallback = fn; }
    private onTouchedCallback = (v: any) => { }
    private onChangeCallback = (v: any) => { }
    ngOnInit(): void { }
    restructure = (node: any, key: string): any[] => {
        let i = 0;
        let chil = new Array();
        for (let cum in node) {
            const attribute = node[cum];
            switch (typeof attribute) {
                case 'object':
                    let cc = this.restructure(attribute, key + '-' + i);
                    chil.push(
                        {
                            name: cum,
                            type: attribute instanceof Array == true ? 'Array' : 'object',
                            key: key + '-' + i,
                            children: cc,
                            edit: false,
                        }
                    )
                    break;
                case 'boolean':
                    chil.push(
                        {
                            name: cum + ':' + attribute,
                            type: typeof attribute,
                            key: key + '-' + i,
                            edit: false,
                            value: attribute
                        }
                    )
                    break;
                case 'number':
                    chil.push(
                        {
                            name: cum + ':' + attribute,
                            type: typeof attribute,
                            key: key + '-' + i,
                            edit: false,
                            value: attribute
                        }
                    )
                    break;
                case 'string':
                    chil.push(
                        {
                            name: node instanceof Array == true ? attribute : cum + ':' + attribute,
                            type: typeof attribute,
                            key: key + '-' + i,
                            edit: false,
                            value: attribute
                        }
                    )
                    break;
                case 'undefined':
                    chil.push(
                        { name: cum, type: typeof cum, key: key + '-' + i, edit: false }
                    )
                    break
                default:
                    break;
            }
            i++;
        }
        return chil;
    };
    hasChild = (_: number, node: FlatNode): boolean => node.expandable;
    hasNoContent = (_: number, node: FlatNode): boolean => node.name === '' || node.edit === true;
    trackBy = (_: number, node: FlatNode): string => `${node.key}-${node.name}`;
    updata(node) {
        if (node.key != '1') {
            let _Node = this.treeControl.dataNodes.find(n => node.name === '' || n.edit === true);
            if (_Node) { this.message.error(this.i18n.transform('warning.PleaseSavecomplete')); return }
            const nestedNode = this.flatNodeMap.get(node);
            if (nestedNode) {
                nestedNode.edit = true;
                this.alternative = Object.assign({}, nestedNode, { code: nestedNode.name.split(':')[0] })
                this.dataSource.setData(this.treeData);
                this.editDone.emit()
                this.editNode = node;
            }
        }
    }
    delete(node: FlatNode): void {
        const originNode = this.flatNodeMap.get(node);

        const dfsParentNode = (): TreeNode | null => {
            const stack = [...this.treeData];
            while (stack.length > 0) {
                const n = stack.pop()!;
                if (n.children) {
                    if (n.children.find(e => e === originNode)) {
                        return n;
                    }

                    for (let i = n.children.length - 1; i >= 0; i--) {
                        stack.push(n.children[i]);
                    }
                }
            }
            return null;
        };

        const parentNode = dfsParentNode();
        if (parentNode && parentNode.children) {
            parentNode.children = parentNode.children.filter(e => e !== originNode);
        }

        this.dataSource.setData(this.treeData);
        this.editNode = this.treeControl.dataNodes.find(n => n.key === parentNode.children[0].key);
        let _val = JSON.stringify(this.jsonReverse(this.treeData[0]['children']))
        this.onChangeCallback(_val);
        this.onTouchedCallback(_val);
        this.editDone.emit()
    }
    addNewNode(node: FlatNode): void {
        let _Node = this.treeControl.dataNodes.find(n => node.name === '' || n.edit === true);
        if (_Node) { this.message.error(this.i18n.transform('warning.PleaseSavecomplete')); return }
        const parentNode = this.flatNodeMap.get(node);
        if (parentNode) {
            parentNode.children = parentNode.children || [];
            parentNode.children.unshift({
                name: '',
                key: `${parentNode.key}-${parentNode.children.length}`,
                type: 'string',
                edit: true
            });
            node.expandable = true;
            this.dataSource.setData(this.treeData);
            this.treeControl.expand(node);
            this.alternative = Object.assign({}, {
                code: parentNode.type == "Array" ? parentNode.children.length - 1 : '',
                value: '',
                key: `${parentNode.key}-${parentNode.children.length}`,
                type: 'string',
                ptype: parentNode.type,
                edit: true
            })
            this.editNode = this.treeControl.dataNodes.find(n => n.key === parentNode.children[0].key);
        }
    }

    saveNode(node: FlatNode, value): void {
        const nestedNode = this.flatNodeMap.get(node);
        if (nestedNode) {
            nestedNode.type = value.type;
            nestedNode.value = value.type != 'object' && value.type != 'Array' ? value.value : (value.type == 'object' ? {} : []);
            if (value.type == "boolean" && !value.value) nestedNode.value = false;
            if (UtilService.isNotEmpty(value.code) && UtilService.isNotEmpty(nestedNode.value)) {
                nestedNode.name = value.type != 'object' && value.type != 'Array' ? value.code + ':' + value.value : value.code;
                if (value.ptype == 'Array') { nestedNode.name = value.value }
                nestedNode.edit = false;
                this.dataSource.setData(this.treeData);
                this.alternative = {};
                let _val = JSON.stringify(this.jsonReverse(this.treeData[0]['children']))
                this.onChangeCallback(_val);
                this.onTouchedCallback(_val);
                this.editDone.emit()
            } else {
                this.message.error(this.i18n.transform('warning.Please_Required'))
            }
        }
    }
    jsonReverse(zNodes: any, parentType?) {
        let JsonNode: any = parentType == 'Array' ? [] : {};
        if (typeof zNodes == 'object') {
            if (zNodes instanceof Array == true) {
                zNodes.forEach(z => {
                    let code = z.name.split(':')[0]
                    if (z.type == "object") {
                        let _chiled = this.jsonReverse(z.children, "object")
                        if (!JsonNode) { JsonNode = {}; }
                        JsonNode[code] = _chiled;
                    } else if (z.type == 'Array') {
                        if (!JsonNode) { JsonNode = new Array(); }
                        let _chiled = !z.children ? [] : this.jsonReverse(z.children, 'Array')
                        // JsonNode.push(..._chiled);
                        if (parentType == 'Array') JsonNode.push(z.value)
                        else JsonNode[code] = _chiled
                    } else {
                        if (parentType == 'Array') JsonNode.push(z.value)
                        else JsonNode[code] = z.value;
                    }
                });
            } else {
                if (zNodes.type == 'Obj') {
                    let _chiled = this.jsonReverse(zNodes.children, 'Obj')
                    JsonNode = Object.assign({}, _chiled)
                }
            }
        }
        return JsonNode;
    }
    cancle(editNode) {
        const nestedNode = this.flatNodeMap.get(editNode);
        if (nestedNode) {
            if (nestedNode.name === '') {
                this.delete(editNode)
            } else {
                nestedNode.edit = false;
                this.dataSource.setData(this.treeData);
                this.editDone.emit()
            }
        }
    }
}
