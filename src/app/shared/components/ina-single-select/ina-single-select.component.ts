import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { merge as _merge, cloneDeep as _cloneDeep } from 'lodash';
import { RequestService } from '~/shared/services/request.service';

interface ngZorroProps {
  placeholder?: string; // 关键词
  isAllowClear?: boolean; // 是否允许清除
  label?: string; // 标签
  value?: string; // 值
  customOptionList?: string; // 选项列表
}

interface ApiProps {
  url?: string; // 接口地址
  method?: string; // 请求方法
  page?: number; // 当前页
  pageSize?: number; // 每页条数
  total?: number; // 总条数
  extraParams?: any; // 额外参数
  isPaging?: boolean; // 是否分页
}

@Component({
  selector: 'app-ina-single-select',
  templateUrl: './ina-single-select.component.html',
  styleUrls: ['./ina-single-select.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InaSingleSelectComponent),
      multi: true,
    },
  ],
})
export class InaSingleSelectComponent implements ControlValueAccessor, OnInit {
  // ngzorro 相关属性
  @Input() ngZorroProps: ngZorroProps;
  processedNgZorroProps: ngZorroProps;
  defaultNgZorroProps: ngZorroProps = {
    placeholder: '请选择',
    isAllowClear: true,
    label: 'name',
    value: 'key',
    customOptionList: '',
  };

  // 接口相关属性
  @Input() apiProps: ApiProps;
  processedApiProps: ApiProps;
  defaultApiProps: ApiProps = {
    url: 'admin/classdata/option',
    method: 'get',
    page: 1,
    pageSize: 20,
    total: 0,
    extraParams: {},
    isPaging: true,
  };

  selectedValue = null;
  keywords = '';
  optionList = [];
  isLoading = false;
  searchWords = ''; // 前端对数据进行关键词搜索

  get selectedValueObj() {
    return this.optionList.find((item) => item[this.processedNgZorroProps.value] === this.selectedValue);
  }

  constructor(private request: RequestService) {}

  ngOnInit() {
    this.processedNgZorroProps = _merge(_cloneDeep(this.defaultNgZorroProps), this.ngZorroProps);
    this.processedApiProps = _merge(_cloneDeep(this.defaultApiProps), this.apiProps);
    const customOptionList = JSON.parse(this.processedNgZorroProps.customOptionList || null);
    if (!customOptionList) {
      this.fetchList();
    } else {
      // 如果有自定义选项列表，则使用自定义列表
      this.optionList = customOptionList;
    }
  }

  fetchList() {
    const { url, method, page, pageSize, extraParams, isPaging } = this.processedApiProps;
    this.isLoading = true;
    const params = {
      keywords: this.keywords,
      ...(isPaging && { page }),
      ...(isPaging && { pageSize }),
      ...extraParams,
    };
    this.request[method](url, params)
      .then((res) => {
        if (isPaging) {
          this.optionList.push(...res.data);
          this.processedApiProps.total = res.total;
        } else {
          this.optionList = res;
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onSearch(value) {
    if (this.isHasCustomOptionList()) {
      this.searchWords = value;
      return;
    }
    this.keywords = value;
    if (this.processedApiProps.isPaging) {
      this.processedApiProps.page = 1;
      this.processedApiProps.total = 0;
    }
    this.optionList = [];
    this.fetchList();
  }

  onLoadMore() {
    if (this.isHasCustomOptionList()) return;
    if (!this.processedApiProps.isPaging) return;

    const { page, pageSize, total } = this.processedApiProps;
    if (page * pageSize < total) {
      this.processedApiProps.page += 1;
      this.fetchList();
    }
  }

  isHasCustomOptionList(): boolean {
    // 如果有自定义选项列表，则不再触发接口请求
    if (this.processedNgZorroProps.customOptionList) return true;
  }

  onChange: any = () => {};
  onTouched: any = () => {};
  disabled: boolean;
  writeValue(value) {
    this.selectedValue = value;
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
