import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmbedDrawerService {
  drawerClose$ = new Subject<any>();

  constructor() { }
}
