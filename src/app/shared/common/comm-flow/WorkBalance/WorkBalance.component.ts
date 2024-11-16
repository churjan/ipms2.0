import { Component, Input } from "@angular/core";
import { FormTemplateComponent } from "../../base/form-Template.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as echarts from 'echarts';
declare var $: any;

@Component({
    selector: 'WorkBalance',
    templateUrl: './WorkBalance.component.html',
    styleUrls: ['./WorkBalance.component.less']
})
export class WorkBalanceComponent extends FormTemplateComponent {
    constructor(
        private breakpointObserver: BreakpointObserver,) { super(); }
    @Input() note: any;
    /**站位 */
    station: any[] = [];
    /**工序 */
    oplist: any[] = [];
    /**部件 */
    partlist: any[] = [];
    series: any;
    /**选中部件 */
    selectpart = '';
    /**平衡上浮值 */
    FloatUp = +10;
    /**平衡下浮值 */
    FloatDownward = -10;
    /**宽 */
    _width = 0;
    pwidth = 0;
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            this.width = '99%'
        })
    }
    async open(record: any) {
        const that = this;
        this.note = record.node;
        $(function () {
            that.pwidth = $('#myChart').width();
            that.change(record.node[0]);
        });
        this.visible = true
    }
    change(item) {
        this._width = item.station.length * 30 > this.pwidth ? item.station.length * 30 : (this.pwidth - 150);
        $('#myChart').width(this._width + 150);
        const that = this;
        this.series = item;
        this.oplist = new Array();
        this.station = new Array();
        let data = new Array();
        let info = new Array();
        let average = 0;
        item.station.forEach((w, i) => {
            this.station.push(w.code);
            let sum_time = 0;
            let s = new Array();
            if (w.oplist) {
                w.sum_percentage = w.oplist.reduce((res, cur) => { return res += cur.percentage }, 0);
                w.sum_time = w.oplist.reduce((res, cur) => { return res += cur.percentage }, 0);
                if (w.sum_percentage > 0) {
                    sum_time = w.oplist.reduce((res, cur) => {
                        let _t = Math.round((cur.time * 100) / 100);
                        s.push({ title: cur.poi_name + '[' + cur.poi_code + ']', time: _t })
                        return res += _t;
                    }, 0);
                }
            }
            info.push(s);
            data.push(sum_time);
        });
        var sum = eval(data.join("+"));
        average = ~~(sum / data.length * 100) / 100;
        let myChart = echarts.init($('#myChart')[0]);
        myChart.resize();
        let chartOption: any = {// 图片配置项
            tooltip: {},
            grid: {
                left: '3%',
                bottom: '8%',
                right: '4%',
                width: this._width
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.station,
                    axisLabel: { interval: 0, rotate: 45 }
                }
            ],
            yAxis: {},
            series: {
                name: that.getTipsMsg("placard.stationhours"),
                type: 'bar',
                barWidth: 20,
                clip: false,
                label: { normal: { show: true, position: 'top', } },
                itemStyle: {
                    color: function (v) {
                        if (v.value >= average + (item.FloatDownward ? item.FloatDownward : that.FloatDownward) && v.value <= average + (item.FloatUp ? item.FloatUp : that.FloatUp)) {
                            return 'Green';
                        }
                        return '#c23531';
                    }
                },
                data: data,
                markLine: {
                    lineStyle: { color: 'Green', width: 2 },
                    data: [
                        { type: 'average', name: that.getTipsMsg("placard.average_value") },
                    ]
                },
                tooltip: {
                    formatter: function (v) {
                        let tip = v.seriesName + '-' +that.getTipsMsg("placard.total") + ':' + v.value;
                        tip = tip + info[v.dataIndex].reduce((res, cur) => {
                            return res += '<br />' + v.marker + cur.title + '：' + cur.time
                        }, '');
                        return tip;
                    }
                }
            }
        };
        myChart.setOption(chartOption)
    }
    update() {
        this.series.FloatUp = this.FloatUp;
        this.series.FloatDownward = this.FloatDownward;
        this.change(this.series);
    }
    Color() {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }
    /**关闭 */
    close(): void {
        this.avatar = null
        this.visible = false
    }
}