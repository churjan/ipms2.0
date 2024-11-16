import { Injector } from "@angular/core";

export const AppConfig: any = {
    domain: '',
    language: '',
    version: '',
    Config: { lacon: '' },
    tipsMsg: {},
    hanger: {},
    fields: [],
    columns: [],
    buttonList: {},
    translate: {},
    select: {},
    btnGroup: {},
    slow: [],
    extend: {}
}
export const compon: any[] = [];

export const modularList: any = [];
export class ServiceLocator {
    static injector: Injector;
}