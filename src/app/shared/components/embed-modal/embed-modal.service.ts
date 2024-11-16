import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmbedModalService {
  modalClose$ = new Subject<any>();

  constructor() { }
}
