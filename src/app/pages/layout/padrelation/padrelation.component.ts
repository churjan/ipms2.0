import { Component, OnInit,ViewChild } from '@angular/core';
import { CrudComponent } from '~/shared/components/crud/crud.component';
import { PadRelationService } from '~/shared/services/http/padrelation.service';

@Component({
  selector: 'padrelation',
  templateUrl: './padrelation.component.html',
  styleUrls: ['./padrelation.component.less']
})
export class PadRelationComponent implements OnInit {

  @ViewChild('crud') crud: CrudComponent

  tableColumns: any[] = []
  activeRow: string | null = null;
  oldsourcestationid:string
  constructor(
    public padrelationService: PadRelationService
  ) { }

  ngOnInit(): void {
    this.tableColumns = this.padrelationService.tableColumns()
  }
  startEdit(item: any): void {
    this.activeRow = item.key
    this.oldsourcestationid=item.oldsourcestationid
  }

  Editoldsourcestationid(key:string): void {
    this.padrelationService.update({oldsourcestationid:this.oldsourcestationid},key).then(() =>{
      this.crud.loadDataFromServer()
      this.activeRow = null
    })
  }
}
