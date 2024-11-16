import { Injectable, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { BehaviorSubject } from "rxjs";
import { AppService } from "./shared/services/app.service";
import { RequestService } from "./shared/services/request.service";

@Injectable()
export class GlobalService implements OnInit{
    constructor(
        private request: RequestService,
        private message: NzMessageService,
        private appService: AppService
    ) { 
        //获取表头json文件
        this.request.getSync('../assets/address/zcolumns.json', (data) => {
            this.allColumns = data;
        });
    }
    
    public munuList:any[] = [];
    public allColumns = {};

    ngOnInit(): void {
        
    }

}