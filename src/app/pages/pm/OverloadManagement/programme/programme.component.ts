import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { ProgrammeEditComponent } from "./edit/programme-edit.component";
import { TrackConfigComponent } from "./track-config/track-config.component";

@Component({
    selector: 'programme',
    templateUrl: './programme.component.html',
    styleUrls: ['./programme.component.less']
})
export class ProgrammeComponent extends ListTemplateComponent {
    constructor() {
        super();
        this.modularInit("structureRuleScheme");
        this.url = 'layout_Programme'
    }
    @ViewChild('edit', { static: false }) _edit: ProgrammeEditComponent;
    @ViewChild('config', { static: false }) _config: TrackConfigComponent;
    btnEvent(event) {
        switch (event.action) {
            case 'station':
                this._config.open({ title: 'placard.config', node: event.node })
                return;
        }
        super.btnEvent(event);
    }
    openModal(model: any) {
        this._edit.open(model)
    }
}