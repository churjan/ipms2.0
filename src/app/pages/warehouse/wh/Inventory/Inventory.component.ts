import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { InventoryEditComponent } from './InventoryEdit/InventoryEdit.component';
declare var $: any;
@Component({
  selector: 'app-Inventory',
  templateUrl: './Inventory.component.html',
  styleUrls: ['./Inventory.component.css']
})
export class InventoryComponent extends ListTemplateComponent {
  constructor(public router: Router, private fb: FormBuilder,) {
    super();
    this.modularInit("whInventory");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('edit', { static: false }) _edit: InventoryEditComponent;

  url: string = '';
  queryParams: any = {}
  ngOnInit(): void { }
  onclick(ev) {
    if (!ev) { this._crud.SearchModel = {}; } else {
      if (ev.blst_key == '10'||ev.group=='Line') {
        this._crud.SearchModel.bls_pkey = ev.key; this._crud.SearchModel.bls_key = '';
      } else if (ev.blst_key == '1010'||ev.group=='Station') {
        this._crud.SearchModel.bls_key = ev.key; this._crud.SearchModel.bls_pkey = '';
      }
    }
    this._crud.Search()
  }
  btnEvent(event) {
    switch (event.action) {
      case 'Outofstock':
        if (!event.node || event.node.length <= 0) {
          this.message.error(this._appService.translate('checkdata.check_leastoneledata'))
          return;
        }
        let _frozen = event.node.filter(f => f.isfrozen == true);
        if (_frozen && _frozen.length > 0) {
          this.Confirm('confirm.confirm_Manual', '', (confirmType) => {
            if (confirmType == 'pass') {
              this.ManualDelivery(event.node);
            }
          })
        } else { this.ManualDelivery(event.node); }
        break;
      default:
        break;
    }
    super.btnEvent(event);
  }
  openModal(model: any) {
    this._edit.open(model)
  }
  ManualDelivery(m) {
    let slist: any[] = [];
    m.forEach(sm => {
      if (!sm.isfrozen || sm.isfrozen == false) {
        slist.push({
          wwi_key: sm.key,
          bls_code: sm.bls_code,
          bls_key: sm.bls_key,
          som_code: sm.som_code,
          pwb_code: sm.pwb_code,
          psi_name: sm.psi_name,
          pci_name: sm.pci_name,
          psz_name: sm.psz_name,
          bpi_name: sm.bpi_name,
          pti_tagcode: sm.pti_tagcode,
          rfid: sm.rfid,
        });
      }
    });
    this._service.comList('LayoutStructure/extend', { maketree: true, moduletype: 103 }, 'NewGetList').then((result) => {
      this._edit.open({ title: 'outo_in', node: { wwod_list: slist }, rawdata: !result ? [] : result })
    });

  }
}
