import { Component, OnInit } from '@angular/core';
import { StructureRuleSchemeService } from '~/pages/layout/structure-rule-scheme/structure-rule-scheme.service';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
@Component({
    selector: 'app-track-tree',
    templateUrl: './track-tree.component.html',
    styleUrls: ['./track-tree.component.less'],
})
export class TrackTreeComponent implements OnInit {
    searchValue = '';
    nodes: any[] = [];

    constructor(private srss: StructureRuleSchemeService) { }

    ngOnInit(): void {
        this.fetchList();
    }

    fetchList() {
        this.srss
            .fetchTrackList({
                // blst_key: 10,
                blst_group: "Line",
                maketree: true,
            })
            .then((data: any) => {
                const nodes = []
                data.forEach(item => {
                    nodes.push({
                        title: item.name,
                        isLeaf: true,
                        ...item
                    })
                });
                this.nodes = nodes
            });
    }

    nzEvent(event: NzFormatEmitEvent): void {
        const key = event.keys[0]
        this.srss.trackTreeChange$.next(key)
    }
}
