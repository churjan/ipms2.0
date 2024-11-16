import { Injectable } from '@angular/core';
import axios from 'axios'
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment'
import { AppService } from './app.service';
import { AppConfig } from './AppConfig.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private axios: any

  constructor(
    private nzNotificationService: NzNotificationService,
    private message: NzMessageService,
    private appService: AppService) {
    let language = localStorage.getItem('language')
    if (!language) {
      // language = navigator.language
      if (!language) {
        language = 'Zh'
      }
      localStorage.setItem('language', language)
    }
    this.axios = axios.create({
      //baseURL: environment.baseUrl,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        language: language
      },
      timeout: 600000 //10分钟
    })
    this.request()
  }

  public request() {
    let tilte = this.appService.translate('error') || 'Error'
    const successHandler = response => {
      const result = response.data
      if (response.config.responseType == "arraybuffer") {//文件流等
        try {
          let enc = new TextDecoder('utf-8')
          let res = JSON.parse(enc.decode(new Uint8Array(result)))
          this.message.error(res.message)
          return Promise.reject({
            status_code: res.code,
            message: res.message
          })
        } catch (error) {
          return Promise.resolve(result)
        }
      }
      if (result.code != 0) {
        //this.nzNotificationService.error(null,result.message)
        // result.message.replace('\n', '<br>')
        // let rm = result.message.split('\\n');
        // let text = '';
        // rm.forEach(rmf => {
        //   text=text+'<br>'+rmf
        // })
        this.message.error(result.message)
        switch (result.code) {
          case -99:
            this.appService.clearAndLogout()
            break
        }
        return Promise.reject({
          status_code: result.code,
          message: result.message
        })
      } else {
        if (typeof result.total == "number") {
          return Promise.resolve({
            total: result.total,
            data: result.data
          })
        }
        return Promise.resolve(result.data)
      }
    }
    const errorHandler = error => {
      const response = { status_code: 422, message: 'System error' }
      if (error.message == 'Network Error') {
        response.message = this.appService.translate("networkError")
      }
      if (error.message.indexOf('timeout') == 0) {
        response.message = this.appService.translate("timeout")
      }
      if (error.response) {
        const errorResponse = error.response
        response.status_code = errorResponse.status
        const errorData = errorResponse.data
        if (errorData?.message) {
          response.message = errorData.message
        } else if (errorResponse.statusText) {
          response.message = errorResponse.statusText
        }
        switch (errorResponse.status) {
          case 401:
            tilte = 'Unauthorized'
            this.appService.clearAndLogout()
            break
          case 403:
            tilte = 'Forbidden'
            break
        }
      }
      //this.nzNotificationService.error(tilte,response.message)
      this.message.error(response.message)
      return Promise.reject(response)
    }

    this.axios.interceptors.request.use(config => {
      // const accessToken = localStorage.getItem(environment.tokenKey)
      const accessToken = sessionStorage.ticket;
      if (accessToken) {
        config.headers[environment.tokenKey] = accessToken
      }
      if (config.url?.indexOf('http://') == 0
        || config.url?.indexOf('https://') == 0) {
        config.baseURL = ""
      } else {
        config.baseURL = environment.baseUrl
        // config.baseURL ='http://192.168.92.3:6001/api'
      }
      return config
    }, errorHandler)
    this.axios.interceptors.response.use(
      successHandler,
      errorHandler
    )
  }

  /*****************************************************************************************/

  /**下载文件
  * @param downloadUrl 下载地址
  * @param excelname 文件名
  * @param params 参数
  * @param isblob 是否为流文件
  */
  download(downloadUrl, excelname, params, isblob = true) {
    if (!sessionStorage.ticket) {
      sessionStorage.ticket = '';
    }
    this.axios({
      url: downloadUrl,
      responseType: 'arraybuffer',
      method: 'post',
      data: params,
      // params: params
    }).then((res) => {
      let ress = res;
      if (isblob == true)
        ress = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const objectUrl = URL.createObjectURL(ress);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none');
      a.setAttribute('href', objectUrl);
      a.setAttribute('download', excelname);
      a.click();
      document.body.removeChild(a);
      // 释放 URL 地址
      URL.revokeObjectURL(objectUrl);
    }).catch((error) => {
      // if (err) err(error)
    })
  }
  //文件下载
  download_file(url, params, file_name) {
    axios.get(url, { params: params, responseType: 'blob' },).then((res) => {
      let blob = new Blob([res.data], { type: `text/plain;charset=utf-8` });
      // 获取heads中的filename文件名
      let downloadElement = document.createElement("a");
      // 创建下载的链接
      let href = window.URL.createObjectURL(blob);
      downloadElement.href = href;
      // 下载后文件名
      downloadElement.download = file_name;
      document.body.appendChild(downloadElement);
      // 点击下载
      downloadElement.click();         // 下载完成移除元素
      document.body.removeChild(downloadElement);
      // 释放掉blob对象
    })
  }
  //responseType = arraybuffer //下载文件
  public get(url: string, params = {}, responseType = "json") {
    return this.axios({
      url: url,
      responseType: responseType,
      method: 'get',
      params: params
    })
  }

  public post(url: string, data = {}, responseType = "json") {
    return this.axios({
      url: url,
      responseType: responseType,
      method: 'post',
      data: data
    })
  }

  public put(url: string, data = {}) {
    return this.axios({
      url: url,
      method: 'put',
      data: data
    })
  }

  public delete(url: string, params = {}) {
    return this.axios({
      url: url,
      method: 'delete',
      params: params
    })
  }

  public upload(url: string, data = {}) {
    return this.axios({
      url: url,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'post',
      data: data
    })
  }

  /*****************************************************************************************/
  /**同步获取 */
  public getSync(MEMBERS_URL, sucss, method = 'GET', body?) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, MEMBERS_URL, false);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (xhr.responseText) {
          try {
            if (sucss) { sucss(JSON.parse(xhr.responseText)); }
          } catch (error) {
            throw error;
          }
        }
      }
    };
    if (!sessionStorage.ticket) { sessionStorage.ticket = ''; }
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Token", sessionStorage.ticket);
    xhr.setRequestHeader("language", localStorage.language ? localStorage.language : 'zh');
    if (method == 'GET') {
      xhr.send(null);
    }
    if (method == 'Post') {
      var fd = JSON.stringify(body);
      xhr.send(fd);
    }
  }
  public GetUITranslate(data: any) {
    return new Promise((resolve, reject) => {
      if (sessionStorage.project) {
        let ext = AppConfig.extend[sessionStorage.project];
        if (ext)
          data.forEach(dc => {
            let _f = ext[dc.modular];
            if (_f) dc.fields.push(..._f.fields)
          })
      }
      // const msgId = this.message.loading('Loading', { nzDuration: 0 }).messageId
      this.post('/Language/UITranslate', data).then(response => {
        if (!response) { response = []; }
        const translatelist = {}
        response.forEach(item => {
          let model: any = {};
          translatelist[item.modular] = {}
          item.fields.forEach(ite => {
            if (ite.code) {
              translatelist[item.modular][ite.code] = ite.name;
              model[ite.code] = ite.name;
            } else {
              translatelist[item.modular][ite.modular] = {}
              ite.fields.forEach(ites => {
                if (ites.code) {
                  translatelist[item.modular][ite.modular][ites.code] = ites.name;
                  model[ite.modular] = translatelist[item.modular][ite.modular];
                }
              })
            }
          })
        })
        resolve(translatelist)
      }).catch(error => {
        // this.message.remove(msgId)
        reject(error)
      }).finally(() => {
        // this.message.remove(msgId)
      })
    })
  }

}
