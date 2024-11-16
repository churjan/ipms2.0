import { Component } from "@angular/core";
import { FormTemplateComponent } from "~/shared/common/base/form-Template.component";

@Component({
    selector: 'collocation',
    templateUrl: './collocation.component.html',
    styleUrls: [`./collocation.component.less`]
})
export class CollocationComponent extends FormTemplateComponent {
    async open(record: any) {
        this.visible = true
    }
}