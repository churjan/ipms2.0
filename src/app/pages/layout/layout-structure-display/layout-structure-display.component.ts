import { Component, OnInit } from '@angular/core';
import { LayoutStructureDisplayService } from './layout-structure-display.service';
import { AppService } from '~/shared/services/app.service';
@Component({
    selector: 'app-layout-structure-display',
    templateUrl: './layout-structure-display.component.html',
    styleUrls: ['./layout-structure-display.component.less'],
})
export class LayoutStructureDisplayComponent implements OnInit {
    options: any = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
        },
        series: [
            {
                type: 'tree',
                data:[],
                top: '1%',
                left: '7%',
                bottom: '1%',
                right: '20%',
                symbolSize: 7,
                label: {
                    normal: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 9,
                    },
                },
                leaves: {
                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 9,
                    },
                },
                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750,
            },
        ],
    };
    constructor(private lsds: LayoutStructureDisplayService,private appService:AppService) {}

    ngOnInit(): void {
        this.fetchList();
    }

    fetchList() {
        this.lsds.fetchList().then((data: any) => {
            data.forEach(item=>{
                item.value=item.key
                item.collapsed=true
            })
            const treeData = this.recursion(data,null);
            const nodes = {
                name: this.appService.translate('placard.factory'),
                value:'',
                collapsed: false,
                children: treeData,
            }
            this.options.series[0].data.push(nodes);
        });
    }

    recursion(data, pkey) {
        const filterData = data.filter((item) => item.pkey == pkey);
        if (filterData) {
            filterData.forEach((item) => {
                item.children = this.recursion(data, item.key);
            });
        }
        return filterData;
    }

}
