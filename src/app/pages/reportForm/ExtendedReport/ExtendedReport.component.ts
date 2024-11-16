import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { RequestService } from "~/shared/services/request.service";
// import { HttpService } from "src/app/shared/http/http.service";

@Component({
    selector: 'app-ExtendedReport',
    templateUrl: './ExtendedReport.component.html',
    styleUrls: ['./ExtendedReport.component.css']
})
export class ExtendedReportComponent {
    url: string = "";
    jsonUrl: any = {};
    constructor(private http: RequestService, public router: Router) {
        this.http.getSync('../../assets/address/web3.json', (data) => {
            this.jsonUrl = data;
        });
    }
    ngOnInit(): void {
        //从本地数据中获取到最后访问页面的标签路径，并将字符串转成数组
        let urlList = this.router.url.split('/');
        //数组最后元素内容为 shiduanchanliang 的
        if (urlList[urlList.length - 1] === 'shiduanchanliang') {
            this.url = this.jsonUrl.ip + this.jsonUrl.shiduanchanliang + "?Language=" + (localStorage.getItem('language') ? localStorage.getItem('language') : "Zh") + "&t=" + new Date().getTime();
        }
        //虚拟线款式报表 数组最后元素内容为 lineStyle 的
        if (urlList[urlList.length - 1] === 'lineStyle') {
            this.url = this.jsonUrl.ip + this.jsonUrl.lineStyle + "?Language=" + (localStorage.getItem('language') ? localStorage.getItem('language') : "Zh") + "&t=" + new Date().getTime();
        }
        //小组任务管理(产线目标产量)
        if (urlList[urlList.length - 1] === 'lineTargetOutput') {
            this.url = this.jsonUrl.ip + this.jsonUrl.lineTargetOutput + "?Language=" + (localStorage.getItem('language') ? localStorage.getItem('language') : "Zh") + "&t=" + new Date().getTime();
        }
        //
        if (urlList[urlList.length - 1] === 'employeeProductivityCross') {
            this.url = this.jsonUrl.ip + this.jsonUrl.employeeProductivityCross + "?Language=" + (localStorage.getItem('language') ? localStorage.getItem('language') : "Zh") + "&t=" + new Date().getTime();
        }
        //瑕疵产量报表
        if (urlList[urlList.length - 1] === 'production') {
            this.url = this.jsonUrl.ip + this.jsonUrl.production + "?Language=" + (localStorage.getItem('language') ? localStorage.getItem('language') : "Zh") + "&t=" + new Date().getTime();
        }


    }
}