import { Component, OnInit } from '@angular/core';
import { TagsService } from '~/pages/pm/tags/tags.service';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {

    width: string
    visible: boolean = false
    data:any = {}

    constructor(
        private tagsService: TagsService
    ) { }

    ngOnInit(): void {
    }

    open(record: any): void {
        if(record){
            this.tagsService.get(record.key).then(response =>{
                this.data = response
            })
        }
        this.visible = true
    }

    close(){
        this.visible = false
    }

}
