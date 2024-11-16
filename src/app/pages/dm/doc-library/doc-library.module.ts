import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DocLibraryRoutingModule } from './doc-library-routing.module';
import { DocLibraryComponent } from './doc-library.component';
import { DocLibraryTableListComponent } from './doc-library-table-list/doc-library-table-list.component';
import { DocLibraryAdvancedSearchComponent } from './doc-library-table-list/doc-library-advanced-search/doc-library-advanced-search.component';


@NgModule({
  declarations: [
    DocLibraryComponent,
    DocLibraryTableListComponent,
    DocLibraryAdvancedSearchComponent
  ],
  imports: [
    CommonModule,
    DocLibraryRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DocLibraryModule { }
