import { BaseTemplateComponent } from './base-template.component';
import { Directive, Input } from '@angular/core';
// import { ToastConfig, ToastType } from 'src/app/shared/util/toast/toast-model';
import { FormGroup } from '@angular/forms';
import { UtilService } from '~/shared/services/util.service';
@Directive()
export class FormTemplateComponent extends BaseTemplateComponent {
  constructor() { super(); }
  validateForm: FormGroup;
  /**模块对象 */
  @Input() modular: any;
  /**数据对象 */
  @Input() model: any = {};
  /**修改key */
  @Input() key: string;
  /**参数字段 */
  @Input() primaryKey: string = "key";
  @Input() ComponentParam: any;
  /**url字段 */
  @Input() Nickname: any;
  title: string
  width: string
  visible: boolean = false
  avatar: string
  submiting: boolean = false
  /**间隔时间戳 */
  timestamp: any = 0;
  winResize() { this.winHeight = window.innerHeight - 365; }

  GetModel(success?, url = this.modular.url) {
    const that = this;
    this.key = this.model[this.primaryKey];
    return new Promise((resolve, reject) => {
      const msgId = this.message.loading('Loading', { nzDuration: 0 }).messageId
      this._httpservice.get(url, this.key).then(response => {
        resolve(response)
      }).catch(error => {
        this.message.remove(msgId)
        reject(error)
      }).finally(() => {
        this.message.remove(msgId)
      })
    })
    // this._service.getModel(url, this.key, (result) => {
    //   if (this.validateForm) { this.validateForm.patchValue(result.data); } else { this.model = result.data; }
    //   if (success) success(result.data);
    // }, () => {
    //   // that._toastService.toast(new ToastConfig(ToastType.ERROR, that.getTipsMsg('warning.nodata'), '', 3000));
    // });
  }
  submit(event?: any, value?: any,validateForm=this.validateForm): void {
    for (const i in validateForm.controls) {
      validateForm.controls[i].markAsDirty();
      validateForm.controls[i].updateValueAndValidity();
    }
  }
  Format(fixe) {
    return UtilService.dateFormat(new Date(this.validateForm.get(fixe).value), 'yyyy-MM-dd');
  }
  save(term?: any, backCall?: any, is = true) {
    if (is == true) {
      if (this.timestamp > 0) {
        let newtime = new Date().getTime();
        if (newtime - this.timestamp <= 2000) {
          this.timestamp = new Date().getTime();
          this.submiting = false;
          return
        }
      }
      this.timestamp = new Date().getTime();
    }
    let condition = Object.assign({ isClose: true, model: null, url: null }, term)
    if (!condition.url) { condition.url = this.Nickname ? this.modular.otherUrl[this.Nickname] : this.modular.url; }
    if (this.validateForm) {
      //   this.submitForm();
      //   console.log(this.validateForm)
      //   if (this.validateForm.status == 'VALID') {
      if (condition.model) {
        condition.model = Object.assign({}, this.validateForm.value, condition.model);
      } else {
        condition.model = Object.assign({}, this.model, this.validateForm.value);
      }
      // if (condition.model.expirationtime) { condition.model.expirationtime = this.Format('expirationtime'); }
      //   } else { return }
    }
    this._service.saveModel(condition.url, condition.doAction ? condition.doAction : this.doAction(condition.model.key), condition.model, (result) => {
      this.message.success(this.getTipsMsg('sucess.s_save'));
      if (backCall) backCall(result, condition.model);
      this.submiting = false;
    }, (msg) => { this.submiting = false });
  }
  negative(num) {
    const that = this;
    let reg = /^\d+\.\d+$/;
    if (reg.test(num) == true || num < 0) {
      // that._toastService.toast(new ToastConfig(ToastType.ERROR, that.getTipsMsg('warning.total'), '', 3000));
      return false;
    }
    return true;
  }
  Close(ev, result: number = 0) {
    // if (this._pop) { this._pop.Close(result, ev); }
  }
}