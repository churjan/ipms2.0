import { Component, OnInit } from '@angular/core';
import { AuthService } from '~/shared/services/http/auth.service';
import { CommonService } from '~/shared/services/http/common.service';
import { UtilService } from '~/shared/services/util.service';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {

    current: any

    constructor(
        private authService: AuthService,
        private commonService: CommonService,
        private utilService: UtilService
    ) { }

    ngOnInit(): void {
        this.current = JSON.parse(this.utilService.aesDecrypt(localStorage.getItem("userInfo")))
        this.authService.userInfo$.subscribe((response: any) =>{
            if(response){
                this.current.address = response.address || null
                this.current.attendanceid = response.attendanceid || null
                this.current.birthday = response.birthday || null
                this.current.hoi_name = response.hoi_name || null
                this.current.idnumber = response.idnumber || null
                this.current.phone = response.phone || null
                this.current.picture = response.picture ? this.commonService.baseUrl+response.picture : null
                this.current.sex = response.sex || null
                this.current.height = response.height ? response.height+"cm" : null
                this.current.weight = response.weight ? response.weight+"kg" : null
            }
        })
    }

}
