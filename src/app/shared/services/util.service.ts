import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import AES from 'crypto-js/aes';
import EncUtf8 from 'crypto-js/enc-utf8';
import { RequestService } from './request.service';
import { timeout } from 'rxjs/operators';
import { AppConfig } from './AppConfig.service';

const api = {
    enumUrl: "admin/Enum/",
}
@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor(private request: RequestService) { }
    /**
         * 是否为空
         * @param value 值
         */
    static isEmpty(value: any): boolean {
        return value == null || value == undefined || typeof value === 'string' && value.length === 0;
    }

    /**
     * 是否不为空
     * @param value 值
     */
    static isNotEmpty(value: any): boolean {
        return !UtilService.isEmpty(value);
    }
    /**
     * 去空格
     * @param value 值
     */
    static delSpace(value: any) {
        return typeof value == 'string' ? value.replace(/\s*/g, '') : value;
    }

    /**
     * 是否为正常值 非空 非NAN 非undefined 非null
     */
    isAbnormalValue(val) {
        if (val != null && val != "" && typeof (val) != "undefined" && !Object.is(val, NaN)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 是否数组
     * @param vaue 值
     */
    static isArray(value: any): boolean {
        return Array.isArray(value);
    }

    /**
     * 是否对象
     * @param vaue 值
     */
    static isObject(value: any): boolean {
        return typeof value === 'object' && !UtilService.isArray(value);
    }
    /**数组去重 */
    static uniq(array) {
        const temp = []; // 一个新的临时数组
        for (let i = 0; i < array.length; i++) {
            if (temp.indexOf(array[i]) === -1) {
                if (array[i] && array[i] !== 'undefined') {
                    temp.push(array[i]);
                }
            }
        }
        return temp;
    }
    parseUrlParams(url: String) {
        const params = {}
        if (!url || url === '' || typeof url !== 'string') {
            return params
        }
        const paramsStr = url.split('?')[1]
        if (!paramsStr) {
            return params
        }
        const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ')
        for (let i = 0; i < paramsArr.length / 2; i++) {
            const value = paramsArr[i * 2 + 1]
            params[paramsArr[i * 2]] = value === 'true' ? true : (value === 'false' ? false : value)
        }
        return params
    }


    getQueryVariable(variable: any) {
        return this.parseUrlParams(window.location.href)[variable]
    }

    getRoutersData(): Array<any> {
        if (!sessionStorage.getItem('routersData')) {
            const result = this.dealRoutersData(environment.routersData)
            sessionStorage.setItem('routersData', this.aesEncrypt(JSON.stringify(result)))
            return result
        } else {
            return JSON.parse(this.aesDecrypt(sessionStorage.getItem('routersData')))
        }
    }

    dealRoutersData(json, box = []) {
        for (let key in json) {
            const temp = json[key]
            if (typeof temp.keepAlive == "boolean") {
                const parentPath = temp.parentPath ? temp.parentPath + "/" : ""
                if (temp.parentPath) delete temp.parentPath
                const parentArr = parentPath.split("/").filter(item => item)
                box.push({
                    keepAlive: temp.keepAlive,
                    animation: temp.animation,
                    path: "/" + parentPath + key,
                    tree: [...parentArr, key]
                })
                if (Object.keys(temp).length > 2) {
                    const children = JSON.parse(JSON.stringify(temp))
                    delete children.keepAlive
                    delete children.animation
                    const keys = Object.keys(children)
                    if (keys.length > 0) {
                        keys.forEach(item => {
                            children[item].parentPath = parentPath + key
                        })
                    }
                    this.dealRoutersData(children, box)
                }
            } else {
                const parentPath = temp.parentPath ? temp.parentPath + "/" : ""
                if (temp.parentPath) delete temp.parentPath
                const children = JSON.parse(JSON.stringify(temp))
                const keys = Object.keys(children)
                if (keys.length > 0) {
                    keys.forEach(item => {
                        children[item].parentPath = parentPath + key
                    })
                }
                this.dealRoutersData(children, box)
            }
        }
        return box
    }

    guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    downloadBlob(blob, fileName) {
        const link = document.createElement('a')//创建a标签
        link.download = fileName//a标签添加属性
        link.style.display = 'none'//隐藏a标签
        link.href = URL.createObjectURL(blob)//设置a链接
        document.body.appendChild(link)//创建dom元素
        link.click()//执行下载
        URL.revokeObjectURL(link.href) //释放url
        document.body.removeChild(link)//释放标签
    }

    buildSelectTree(data) {
        const result = []
        data.forEach(item => {
            const temp = {
                title: item.name,
                value: item.key,
                key: item.key,
                children: [],
                ismenu: (data.ismenu == 0 ? false : true) || false,
                isLeaf: false
            }
            if (item.children?.length > 0) {
                temp.children = this.buildSelectTree(item.children)
            }
            else {
                temp.isLeaf = true
            }
            result.push(temp)
        })
        return result
    }

    listToTreeByPid(data, pid = null, keyName = 'key', pKeyName = 'pkey', childrenKey = 'children') {
        const list = []
        data.forEach(item => {
            if (!item[pKeyName]) item[pKeyName] = null
            if (item[pKeyName] == pid) {
                item[childrenKey] = this.listToTreeByPid(data, item[keyName])
                list.push(item)
            }
        })
        return list
    }

    treeToListLevel(data, box = [], level = 0, childrenKeyName = 'children') {
        data.forEach(item => {
            const temp = JSON.parse(JSON.stringify(item))
            temp.level = level
            const children = temp[childrenKeyName]
            delete temp[childrenKeyName]
            temp.hasChildren = children.length > 0 ? true : false
            box.push(temp)
            if (children.length > 0) {
                this.treeToListLevel(children, box, level + 1)
            }
        })
        return box
    }

    static filterParentsWithoutMySelf(data: any[], key: string, keyName: string = 'key') {
        const result = []
        data.forEach(item => {
            if (item[keyName] != key) {
                if (item.children?.length > 0) {
                    item.children = UtilService.filterParentsWithoutMySelf(item.children, key, 'pkey')
                }
                result.push(item)
            }
        })
        return result
    }

    aesEncrypt(data: string) {
        return AES.encrypt(data, environment.secretKey).toString()
    }

    aesDecrypt(data: string) {
        return AES.decrypt(data, environment.secretKey).toString(EncUtf8)
    }

    /**枚举数据获 */
    enumList(params): any {
        return new Promise((resolve, reject) => {
            this.request.get(api.enumUrl, { method: params }).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        });
    }
    /**适用于全部列表数据/具体条件下的数据/树数据等不同后缀接口数据获取（可配合'数据获取公共接口配置'使用）'admin/' + action + '/' + that, body*/
    comList(action, body, that = '', islogin = true): any {
        return new Promise((resolve, reject) => {
            this.request.get((islogin == true ? 'admin/' : '') + action + '/' + that, body).then(response => {
                resolve(response)
            }).catch(error => { })
        });
    }
    /**适用于全部列表数据/具体条件下的数据/树数据等不同后缀接口数据获取（可配合'数据获取公共接口配置'使用）*/
    comPost(action, body, that = ''): any {
        return new Promise((resolve, reject) => {
            this.request.post(action, body).then(response => {
                resolve(response)
            }).catch(error => {
                // if (error) reject(error)
            })
        });
    }
    //http请求
    /**http请求
     * getPage分页请求
     * getModel单条请求
     * getList全部数据获取
     * saveModel保存
     * 
     */
    getPage(url, body, sucess?, err?, that = '') {
        return new Promise((resolve, reject) => {
            this.request.get(url + that, body).then(response => {
                sucess(response)
            }).catch(error => {
                if (err) err(error)
            })
        });
        // return this.httpService.get(this.domain + url, body, sucess, err);
    }
    getList(url, body, sucess?, err?) {
        return new Promise((resolve, reject) => {
            this.request.get(url + 'getlist', body).then(response => {
                sucess(response)
            }).catch(error => {
                if (err) err(error)
            })
        });
    }
    getModel(url, key, sucess?, err?) {
        return new Promise((resolve, reject) => {
            this.request.get(url + key, {}).then(response => {
                sucess(response)
            }).catch(error => {
                if (err) err(error)
            })
        });
    }

    saveModel(url, action, model, sucess?, err?): Promise<any> {
        if (action === 'put') {
            return new Promise((resolve, reject) => {
                this.request.put(url, model).then(response => { sucess(response) }).catch(error => { if (err) err(error) })
            });
        } else {
            return new Promise((resolve, reject) => {
                this.request.post(url, model).then(response => { sucess(response) }).catch(error => { if (err) err(error) })
            });
        }
    }
    deleteModel(url, body, sucess?, err?): Promise<any> {
        return new Promise((resolve, reject) => {
            this.request.post(url + 'delete/', body).then(response => { sucess(response) }).catch(error => { if (err) err(error) })
        });
    }

    //模版下载地址
    downloadModel(download) {
        window.open(environment.rootUrl + download);
    }

    //上传地址
    upExcel(up, key = '') {
        return environment.rootUrl + up + 'imp/' + key;
    }

    //导出地址
    export(name, exp, params = {}) {
        this.request.download_file((environment.rootUrl + exp), params, name);
    }

    /************************************************************************************* */

    /**
     * 日期对象转为日期字符串
     * @param date 需要格式化的日期对象
     * @param sFormat 输出格式,默认为yyyy-MM-dd                         年：y，月：M，日：d，时：h，分：m，秒：s
     * @example  dateFormat(new Date())                                '2017-02-28'
     * @example  dateFormat(new Date(),'yyyy-MM-dd')                   '2017-02-28'
     * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         '2017-02-28 09:24:00'
     * @example  dateFormat(new Date(),'hh:mm')                       '09:24'
     * @example  dateFormat(new Date(),'yyyy-MM-ddThh:mm:ss+08:00')   '2017-02-28T09:24:00+08:00'
     */
    static dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
        const time = {
            Year: 0,
            TYear: '0',
            Month: 0,
            TMonth: '0',
            Day: 0,
            TDay: '0',
            Hour: 0,
            THour: '0',
            hour: 0,
            Thour: '0',
            Minute: 0,
            TMinute: '0',
            Second: 0,
            TSecond: '0',
            Millisecond: 0
        };
        time.Year = date.getFullYear();
        time.TYear = String(time.Year).substr(2);
        time.Month = date.getMonth() + 1;
        time.TMonth = time.Month < 10 ? '0' + time.Month : String(time.Month);
        time.Day = date.getDate();
        time.TDay = time.Day < 10 ? '0' + time.Day : String(time.Day);
        time.Hour = date.getHours();
        time.THour = time.Hour < 10 ? '0' + time.Hour : String(time.Hour);
        time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
        time.Thour = time.hour < 10 ? '0' + time.hour : String(time.hour);
        time.Minute = date.getMinutes();
        time.TMinute = time.Minute < 10 ? '0' + time.Minute : String(time.Minute);
        time.Second = date.getSeconds();
        time.TSecond = time.Second < 10 ? '0' + time.Second : String(time.Second);
        time.Millisecond = date.getMilliseconds();

        return sFormat.replace(/yyyy/ig, String(time.Year))
            .replace(/yyy/ig, String(time.Year))
            .replace(/yy/ig, time.TYear)
            .replace(/y/ig, time.TYear)
            .replace(/MM/g, time.TMonth)
            .replace(/M/g, String(time.Month))
            .replace(/dd/ig, time.TDay)
            .replace(/d/ig, String(time.Day))
            .replace(/HH/g, time.THour)
            .replace(/H/g, String(time.Hour))
            .replace(/hh/g, time.Thour)
            .replace(/h/g, String(time.hour))
            .replace(/mm/g, time.TMinute)
            .replace(/m/g, String(time.Minute))
            .replace(/ss/ig, time.TSecond)
            .replace(/s/ig, String(time.Second))
            .replace(/fff/ig, String(time.Millisecond));
    }
    /**
     * 日期字符串转为日期对象
     */
    static DateReverse(date: string): any {
        date = date.replace(/-/g, '/');
        var newdate = new Date(date);
        newdate.setDate(newdate.getDate());
        const time = {
            year: 0,
            TYear: '0',
            month: 0,
            TMonth: '0',
            day: 0,
            TDay: '0',
            Hour: 0,
            THour: '0',
            hour: 0,
            Thour: '0',
            Minute: 0,
            TMinute: '0',
            Second: 0,
            TSecond: '0',
            Millisecond: 0
        };
        time.year = newdate.getFullYear();
        time.TYear = String(time.year).substr(2);
        time.month = newdate.getMonth() + 1;
        time.TMonth = time.month < 10 ? '0' + time.month : String(time.month);
        time.day = newdate.getDate();
        time.TDay = time.day < 10 ? '0' + time.day : String(time.day);
        time.Hour = newdate.getHours();
        time.THour = time.Hour < 10 ? '0' + time.Hour : String(time.Hour);
        time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
        time.Thour = time.hour < 10 ? '0' + time.hour : String(time.hour);
        time.Minute = newdate.getMinutes();
        time.TMinute = time.Minute < 10 ? '0' + time.Minute : String(time.Minute);
        time.Second = newdate.getSeconds();
        time.TSecond = time.Second < 10 ? '0' + time.Second : String(time.Second);
        time.Millisecond = newdate.getMilliseconds();
        return time;
    }
    /*** 时间比对*/
    static TimeComparison(start, end, is = false): boolean {
        const sdate = new Date(start);
        const now = new Date(end);
        const days = now.getTime() - sdate.getTime();
        if (is == true) return days > 0 ? true : false
        return days >= 0 ? true : false;
    }
    /**月份判断 */
    static getMonths(start: Date, end: Date) {
        const start_year = start.getFullYear();
        const start_month = start.getMonth();
        const end_year = end.getFullYear();
        const end_month = end.getMonth();
        return (end_year - start_year) * 12 + (end_month - start_month) + 1;
    }
    /**
     * 日期间隔天数计算 start end 格式为{year:xxxx,month:xx,day:xx}
     */
    static DateMinus(start, end): number {
        const sdate = new Date(start);
        const now = new Date(end);
        const days = now.getTime() - sdate.getTime();
        const day = days / (1000 * 60 * 60 * 24);
        return day;
    }
    /**
     * 根据天数计算时间
     * @param daynum 天数
     * @param isweekend 天数是否去除周末
     * @param weekenddaynum 单周去除天数
     * @param date 开始日期
     */
    static DateCalculation(daynum, isweekend: boolean = false, weekenddaynum: number = 1, date?: Date): string {
        let toDate = date ? new Date(date) : new Date();
        let Day = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() + Math.ceil(daynum));
        if (isweekend == true) {
            let _dn = Math.ceil(daynum)
            for (let i = 0; i < Math.ceil(daynum); i++) {
                let ds = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() + i);
                if ((new Date(ds)).getDay() == 0) { _dn = _dn + weekenddaynum; }
            }
            Day = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() + _dn);
            return UtilService.dateFormat(Day, 'yyyy-MM-dd');
        }
        Day = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() + Math.ceil(daynum));
        return UtilService.dateFormat(Day, 'yyyy-MM-dd');
    }
    /**
     *  短UUID生成
     */
    static shortUUID(): string {
        return 'xx-6xy'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(6);
        });
    }
    /**地址参数获取 */
    static getQueryString(name) {
        // var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        // var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
        var params = {};
        var match;
        var reg = /[?&]+([^=&]+)=([^&]*)/g;// 匹配目标参数
        while (match = reg.exec(window.location.hash)) {
            var key = decodeURIComponent(match[1]);
            var value = decodeURIComponent(match[2]);
            params[key] = value
        }
        if (params != {}) {
            return params[name];
        } else {
            return null;
        }
    }

    //组织结构 数据格式化
    toTree(arr, key = 'id', pkey = 'pid', children = 'children') {
        let dataArray = [];
        arr.forEach((data) => {
            let sortParent = data[pkey];//判断是否为父级元素
            if (sortParent === "0" || sortParent === null || sortParent === "") {
                //当前为父级
                let code = data.code;
                let dataKey = data[key];
                let name = data.name;
                let description = data.description;
                let dataPkey = data[pkey];
                let state = data.state;
                let lock = data.lock;
                let type = data.type;
                let type_name = data.type_name;
                let createTime = data.create_time;
                let objTemp = {
                    code: code,
                    key: dataKey,
                    name: name,
                    description: description,
                    pkey: dataPkey,
                    state: state,
                    lock: lock,
                    createTime: createTime,
                    type: type,
                    type_name: type_name
                }
                dataArray.push(objTemp);
            }
        })
        return data2treeDG(arr, dataArray);

        function data2treeDG(datas, dataArray) {
            for (let j = 0; j < dataArray.length; j++) {
                let dataArrayIndex = dataArray[j];
                let childrenArray = [];
                let id = dataArrayIndex[key];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    let pid = data[pkey];
                    if (pid === id) {
                        let code = data.code;
                        let dataKey = data[key];
                        let name = data.name;
                        let description = data.description;
                        let dataPkey = data[pkey];
                        let state = data.state;
                        let lock = data.lock;
                        let createTime = data.create_time;
                        let type = data.type;
                        let type_name = data.type_name;
                        let objTemp = {
                            code: code,
                            key: dataKey,
                            name: name,
                            description: description,
                            pkey: dataPkey,
                            state: state,
                            lock: lock,
                            createTime: createTime,
                            type: type,
                            type_name: type_name
                        }
                        childrenArray.push(objTemp);
                    }
                }
                dataArrayIndex.children = childrenArray;
                if (childrenArray.length > 0) {//有子节点 进行递归
                    data2treeDG(datas, childrenArray);
                } else {
                    //删除空的children
                    delete dataArrayIndex.children;
                }
            }
            return dataArray;
        }
    }

    //下拉框内的树 数据格式化
    toSelectTree(arr, key = 'key', pkey = 'pkey', children = 'children') {
        let dataArray = [];
        arr.forEach((data) => {
            let sortParent = data[pkey];//判断是否为父级元素
            if (sortParent === "0" || sortParent === null || sortParent === "") {
                //当前为父级
                let title = data.name;
                let dataKey = data[key];
                let objTemp = {
                    title: title,
                    key: dataKey
                }
                dataArray.push(objTemp);
            }
        })
        return data2treeDG(arr, dataArray);

        function data2treeDG(datas, dataArray) {
            for (let j = 0; j < dataArray.length; j++) {
                let dataArrayIndex = dataArray[j];
                let childrenArray = [];
                let id = dataArrayIndex[key];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    let pid = data[pkey];
                    if (pid === id) {
                        let title = data.name;
                        let dataKey = data[key];
                        let objTemp = {
                            title: title,
                            key: dataKey
                        }
                        childrenArray.push(objTemp);
                    }
                }
                dataArrayIndex.children = childrenArray;
                if (childrenArray.length > 0) {//有子节点 进行递归
                    data2treeDG(datas, childrenArray);
                } else {
                    dataArrayIndex.isLeaf = true;
                    //删除空的children
                    delete dataArrayIndex.children;
                }
            }
            return dataArray;
        }
    }

    //左边框内的树 z表示的pkey 为“0” 表示最外面一层
    toStyleTree(arr, key = 'key', pkey = 'pkey', children = 'children', z = null) {
        let dataArray = [];
        arr.forEach((data) => {
            let sortParent = data[pkey];//判断是否为父级元素
            if (sortParent == z || sortParent == "0" || sortParent == null || sortParent === "") {
                //当前为父级
                let title = data.name;
                let dataKey = data[key];
                let objTemp = {
                    title: title,
                    key: dataKey,
                    expanded: true
                }
                dataArray.push(objTemp);
            }
        })
        return data2treeDG(arr, dataArray);

        function data2treeDG(datas, dataArray) {
            for (let j = 0; j < dataArray.length; j++) {
                let dataArrayIndex = dataArray[j];
                let childrenArray = [];
                let id = dataArrayIndex[key];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    let pid = data[pkey];
                    if (pid === id) {
                        let title = data.name;
                        let dataKey = data[key];
                        let objTemp = {
                            title: title,
                            key: dataKey,
                            expanded: true
                        }
                        childrenArray.push(objTemp);
                    }
                }
                dataArrayIndex.children = childrenArray;
                if (childrenArray.length > 0) {//有子节点 进行递归
                    data2treeDG(datas, childrenArray);
                } else {
                    dataArrayIndex.isLeaf = true;
                    //删除空的children
                    delete dataArrayIndex.children;
                    delete dataArrayIndex.expanded;
                }
            }
            return dataArray;
        }
    }

    /**文字提取 */
    getComm(condition, Dynamic?): string {
        const translate = AppConfig.translate.common;
        if (!translate) return null;
        let value: string = null;
        if (condition.indexOf('.') > 0) {
            const keyPath = condition.split('.').map(item => {
                return "['" + item + "']"
            }).join('');
            value = Dynamic ? eval(`translate${keyPath}`).replace('_', Dynamic) : eval(`translate${keyPath}`);
        }
        return value
    }

    /* 输入按钮名称 获取 图标 */
    getICON(list = [], name) {
        for (let item of list) {
            if (item.name === name) {
                return item.icon;
            }
        }
    }

    //获取文件后缀名
    getFileLast(name) {
        let flieArr = name.split('.');
        let last = flieArr[flieArr.length - 1];
        return last;
    }
}
