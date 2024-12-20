import routersData from './routersData'
export const environment = {
    production: true,
    isGangDai: false,
    secretKey: '9df2B49b9a78da9cbffAB52029955Rc4',
    ip: `http://${document.domain}`,
    baseUrl: `http://${document.domain}:5001/api`,
    // baseUrl: `http://${document.domain}:7051/api`,
    rootUrl: `http://${document.domain}:5001/`,
    imgUrl: `http://${document.domain}:5001`,//访问图片所需地址
    logUrl: `http://${document.domain}:5001`,//检索日志所需地址
    version: "4.11.20",
    defaultPageSize: 15,
    tokenKey: 'token',
    interface: {
        comm: '../assets/address/comm.json',
        columns: '../assets/address/columns.json',
        fields: '../assets/address/fields.json',
        modular: '../assets/address/modular.json',
        padMonitor: '../assets/address/padMonitor.json',
        extend: '../assets/address/extend.json',
        select: '../assets/address/select.json'
    },
    loginPath: '/login',
    OperProUrl: "admin/roleinfo/extend/GetOperationProcess/",
    routersData
}
