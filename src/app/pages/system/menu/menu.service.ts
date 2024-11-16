import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject } from 'rxjs';
import { AppService } from '../../../shared/services/app.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RequestService } from '../../../shared/services/request.service';

const api = {
  list: '/admin/system/extend/menu',
  url: '/admin/menuinfo'
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  type: string
  menu_change$ = new BehaviorSubject<object>(null)

  constructor(private request: RequestService,
    private message: NzMessageService,
    private appService: AppService,
    private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      const temp = this.router.url.split("/")
      const name = temp[temp.length - 1]
      switch (name) {
        case "padmenu":
          api.list = "/admin/system/extend/padmenu"
          break
        case "menu":
          api.list = "/admin/system/extend/menu/"
          break
      }
      this.type = name
    })
  }

  get(id) {
    const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
    return new Promise((resolve, reject) => {
      this.request.get(api.url + '/' + id).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      }).finally(() => {
        this.message.remove(msgId)
      })
    })
  }

  list(params = {}) {
    const msgId = this.message.loading(this.appService.translate("placard.dataLoading"), { nzDuration: 0 }).messageId
    return new Promise((resolve, reject) => {
      this.request.get(api.list, params).then(response => {
        resolve(this.initMenus(response))
      }).catch(error => {
        reject(error)
      }).finally(() => {
        this.message.remove(msgId)
      })
    })
  }

  initMenus(data) {
    if (!data || data.length <= 0) return []
    return data.map(item => {
      const temp = {
        key: item.key,
        pkey: item.pkey,
        name: item.name,
        children: []
      }
      if (item.sonList && item.sonList.length > 0) {
        temp.children = this.initMenus(item.sonList)
      }
      return temp
    })
  }

  add(data) {
    const msgId = this.message.loading(this.appService.translate("placard.dataSaving"), { nzDuration: 0 }).messageId
    return new Promise((resolve, reject) => {
      this.request.post(api.url, data).then(response => {
        this.message.success(response?.message || this.appService.translate("sucess.s_save"))
        this.menu_change$.next(data)
        resolve(response)
      }).catch(error => {
        reject(error)
      }).finally(() => {
        this.message.remove(msgId)
      })
    })
  }

  update(data, id) {
    data.key = id
    const msgId = this.message.loading(this.appService.translate("placard.dataSaving"), { nzDuration: 0 }).messageId
    return new Promise((resolve, reject) => {
      this.request.put(api.url, data).then(response => {
        this.message.success(response?.message || this.appService.translate("sucess.s_save"))
        this.menu_change$.next(data)
        resolve(response)
      }).catch(error => {
        reject(error)
      }).finally(() => {
        this.message.remove(msgId)
      })
    })
  }

  del(id) {
    const msgId = this.message.loading(this.appService.translate("dataDeleting"), { nzDuration: 0 }).messageId
    return new Promise((resolve, reject) => {
      this.request.post(api.url + '/delete', [{ key: id }]).then(response => {
        this.message.success(response?.message || this.appService.translate("sucess.s_delete"))
        resolve(response)
      }).catch(error => {
        reject(error)
      }).finally(() => {
        this.message.remove(msgId)
      })
    })
  }
}
