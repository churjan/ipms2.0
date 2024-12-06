import routersData from './routersData'
export const environment = {
    production: false,
    isGangDai: false,
    secretKey: '9df2B49b9a78da9cbffAB52029955Rc4',
    ip: "http://192.168.92.3",
    // 衣拿本地
    // baseUrl: 'http://192.168.89.28:5001/api',
    // baseUrl: 'http://172.16.210.53:5007/api', // 陈莎本地
    // baseUrl: 'http://172.16.210.214:5001/api', // 陈莎本地
    // baseUrl: 'http://192.168.89.146:5001/api', // 乔治白
    baseUrl1: 'http://192.168.92.3:7051/api',//公司服务器（钢带）
    baseUrl5: 'http://192.168.92.3:7071/api',//公司服务器（通用版）
    baseUrl3: 'http://192.168.91.178:7071/api',//开发者（笔记本）
    baseUrl4: 'http://192.168.100.68:7071/api',//开发者（PC机）
    baseUrl6: 'http://192.168.92.3:7061/api',//公司服务器（通用版）
    baseUrl: 'http://192.168.88.55:5001/api',//公司服务器（通用版）
    rootUrl: 'http://192.168.88.55:5001/',
    imgUrl: 'http://192.168.88.55:5001',//访问图片所需地址
    logUrl: 'http://192.168.88.55:5001',//检索日志所需地址

    //安踏测试
    // baseUrl2: 'http://10.205.1.37:5001/api',
    // baseUrl1: 'http://10.205.1.37:7051/api',//公司服务器（钢带）
    // baseUrl5: 'http://10.205.1.37:7071/api',//公司服务器（通用版）
    // baseUrl3: 'http://10.205.1.37:7071/api',//开发者（笔记本）
    // baseUrl4: 'http://10.205.1.37:7071/api',//开发者（PC机）
    // baseUrl6: 'http://10.205.1.37:7061/api',//公司服务器（通用版）
    // baseUrl: 'http://10.205.1.37:5001/api',//公司服务器（通用版）
    // rootUrl: 'http://10.205.1.37:5001/',
    // imgUrl: 'http://10.205.1.37:5001',//访问图片所需地址
    // logUrl: 'http://10.205.1.37:5001',//检索日志所需地址

    //安踏正式
    // baseUrl2: 'http://10.205.1.34:5001/api',
    // baseUrl1: 'http://10.205.1.34:7051/api',//公司服务器（钢带）
    // baseUrl5: 'http://10.205.1.34:7071/api',//公司服务器（通用版）
    // baseUrl3: 'http://10.205.1.34:7071/api',//开发者（笔记本）
    // baseUrl4: 'http://10.205.1.34:7071/api',//开发者（PC机）
    // baseUrl6: 'http://10.205.1.34:7061/api',//公司服务器（通用版）
    // baseUrl: 'http://10.205.1.34:5001/api',//公司服务器（通用版）
    // rootUrl: 'http://10.205.1.34:5001/',
    // imgUrl: 'http://10.205.1.34:5001',//访问图片所需地址
    // logUrl: 'http://10.205.1.34:5001',//检索日志所需地址

    version: "3.2.25",
    defaultPageSize: 15,
    tokenKey: 'token',
    loginPath: '/login',
    interface: {
        comm: '../assets/address/comm.json',
        columns: '../assets/address/columns.json',
        fields:'../assets/address/fields.json',
        modular: '../assets/address/modular.json',
        padMonitor: '../assets/address/padMonitor.json',
        extend: '../assets/address/extend.json',
        select: '../assets/address/select.json'
    },
    OperProUrl: "admin/roleinfo/extend/GetOperationProcess/",
    routersData
}
