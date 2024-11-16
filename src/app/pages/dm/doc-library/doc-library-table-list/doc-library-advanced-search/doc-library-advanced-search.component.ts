import { Component, OnInit, Input } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormArray,
    Validators,
} from '@angular/forms';

import { EmbedDrawerService } from '~/shared/components/embed-drawer/embed-drawer.service';


@Component({
  selector: 'app-doc-library-advanced-search',
  templateUrl: './doc-library-advanced-search.component.html',
  styleUrls: ['./doc-library-advanced-search.component.less']
})
export class DocLibraryAdvancedSearchComponent implements OnInit {

  @Input() advanceParams;
    form!: FormGroup;
    constructor(private fb: FormBuilder, private eds: EmbedDrawerService) {
        this.form = this.fb.group({
            originalname: [null],
            extension: [null],
        });
    }

    ngOnInit(): void {
        const { originalname, extension } = this.advanceParams;
        this.form.patchValue({
            originalname,
            extension,
        });
    }

    onQuery() {
        const { originalname, extension } = this.form.value;
        const params = {
            originalname,
            extension,
        };
        this.eds.drawerClose$.next(params);
    }

    onClose() {
        this.eds.drawerClose$.next(false);
    }

    onReset(){
        this.eds.drawerClose$.next({});
    }

}
