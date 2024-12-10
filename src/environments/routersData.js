export default {
    home: { animation: "Home", keepAlive: true },
    exception: { animation: "Exception", keepAlive: false },
    redirect: { animation: "Redirect", keepAlive: false },
    login: { animation: "Login", keepAlive: false },
    hanger: { animation: "Hanger", keepAlive: false },
    account: {
        info: { animation: "Accountinfo", keepAlive: true },
        notification: { animation: "AccountNotification", keepAlive: true },
        password: { animation: "AccountPassword", keepAlive: true },
    },
    sys: {
        menu: { animation: "SystemMenu", keepAlive: true },
        padmenu: { animation: "SystemPadMenu", keepAlive: true },
        role: { animation: "SystemRole", keepAlive: true },
        user: { animation: "SystemUser", keepAlive: true },
        lang: {
            version: { animation: "SystemLangVersion", keepAlive: true },
            translate: { animation: "SystemLangTranslate", keepAlive: true },
        },
        language: { animation: "SystemLanguage", keepAlive: true },
        parameters: { animation: "SysParameters", keepAlive: true },
        log: {
            operation: { animation: "SystemOperationLog", keepAlive: true },
            run: { animation: "SystemRunLog", keepAlive: true },
            paderr: { animation: "SystemPadErr", keepAlive: true },
            retrieval: { animation: "Retrieval", keepAlive: true },
        },
        classify: { animation: "SystemClassify", keepAlive: true },
        software: { animation: "SystemSoftware", keepAlive: true },
        file: { animation: "SystemFile", keepAlive: true },
        weighingmanagement: {
            animation: "SystemWeighingManagement",
            keepAlive: true,
        },
    },
    hr: {
        org: { animation: "HrOrganization", keepAlive: true },
        employee: { animation: "HrEmployee", keepAlive: true },
        skill: { animation: "HrSkill", keepAlive: true },
    },
    pm: {
        hangerFlow: { animation: "PmHangerFlow", keepAlive: true },
        specialCoatHangerMark: { animation: "PmSpecialCoatHangerMark", keepAlive: true },
        tagsPrint: { animation: "PmTagsPrint", keepAlive: true },
        tags: { animation: "PmTags", keepAlive: true },
        work: { animation: "PmWork", keepAlive: true },
        productionorder: { animation: "PmProductionOrder", keepAlive: true },
        layingcloth: { animation: "PmLayingcloth", keepAlive: true },
        quarterlyplan: { animation: "PmQuarterlyPlan", keepAlive: true },
        plan: { animation: "PmPlan", keepAlive: true },
        cropinstruction: { animation: "PmCropInstruction", keepAlive: true },
        'cutting-plan': { animation: "cuttingPlan", keepAlive: true },
        sewingplan: { animation: "PmSewingPlan", keepAlive: true },
        Cutting: { animation: "Cutting", keepAlive: true },
        OverloadManagement: { animation: "OverloadManagement", keepAlive: true },
    },
    hangerquery: { animation: "HangerQuery", keepAlive: true },
    bas: {
        programme: { animation: "DmProgramme", keepAlive: true },
        group: { animation: "BasGroup", keepAlive: true },
        shuntschemerules: { animation: "DmShuntSchemeRules", keepAlive: true },
        FilesInfo: { animation: "BasFilesInfo", keepAlive: true },
        quality: {
            animation: "BasQuality",
            keepAlive: true,
        },
        "process-difficulty": {
            animation: "DmProcessDifficulty",
            keepAlive: true,
        },
        "fabric-difficulty": {
            animation: "DmFabricDifficulty",
            keepAlive: true,
        },
        "part": { animation: "BasParts", keepAlive: true },
        "worksection": {
            animation: "BasWorksection",
            keepAlive: true,
        },
        "machinedevice": {
            animation: "BasMachinedevice",
            keepAlive: true,
        },
        "partsingleton": {
            animation: "BasPartSingleton",
            keepAlive: true,
        },
        OverloadRules: {
            animation: "BasOverloadRules",
            keepAlive: true,
        },
        attribute: {
            animation: "BasAttribute",
            keepAlive: true,
        }
    },
    comm: {
        flow: { animation: "CommFlow", keepAlive: true }
    },
    pdm: {
        style: { animation: "PdmStyle", keepAlive: true },
        operation: { animation: "PdmOperation", keepAlive: true },
        ProcessStage: { animation: "PdmProcessStage", keepAlive: true },
        partoperation: { animation: "PdmPartOperation", keepAlive: true },
        color: { animation: "PdmColor", keepAlive: true },
        size: { animation: "PdmSize", keepAlive: true },
        styleclass: { animation: "StyleClass", keepAlive: true }
    },
    layout: {
        stationSupervisoryControl: { animation: "LayoutStationSupervisoryControl", keepAlive: true },
        Factory: { animation: "Factory", keepAlive: true },
        exhibition: { animation: "Exhibition", keepAlive: true },
        padrelation: { animation: "PadRelation", keepAlive: true },
        Virtual: { animation: "Virtual", keepAlive: true },
        "Programme": {
            animation: "Programme",
            keepAlive: true,
        },
        "TacticalRules": {
            animation: "TacticalRules",
            keepAlive: true,
        },
        "layout-structure-display": {
            animation: "LayoutStructureDisplay",
            keepAlive: true,
        },
        HandStation: {
            animation: "HandStation",
            keepAlive: true,
        },
    },
    sale: {
        customer: { animation: "SaleCustomer", keepAlive: true },
        order: { animation: "SaleOrder", keepAlive: true },
    },
    report: {
        hangersrecord: { animation: "HangerSrecord", keepAlive: true },
        operationdetails: { animation: "OperationDetails", keepAlive: true },
        qualitytracking: { animation: "QualityTracking", keepAlive: true },
        qualitytrackingCustom: { animation: "QualityTrackingCustom", keepAlive: true },
        salaryschedule: { animation: "SalarySchedule", keepAlive: true },
        styledata: { animation: "StyleData", keepAlive: true },
        yield: { animation: "Yield", keepAlive: true },
        yieldCustom: { animation: "YieldCustom", keepAlive: true },
        InventoryStatistics: { animation: "InventoryStatistics", keepAlive: true },
        ReworkStatistics: { animation: "ReworkStatistics", keepAlive: true },
        ReworkStatisticsCustom: { animation: "ReworkStatisticsCustom", keepAlive: true },
        shiduanchanliang: { animation: "ShiDuanChanLiang", keepAlive: true },
        employeeProductivityCross: { animation: "EmployeeProductivityCross", keepAlive: true },
        production: { animation: "Production", keepAlive: true },
    },
    hangersearch: {
        hanger: { animation: "Hanger", keepAlive: true }
    },
    yieldsearch: {
        yield: { animation: "Yield", keepAlive: true }
    },
    wh: {
        warehousing: { animation: "WarehouseWarehousingWh", keepAlive: true },
        inventory: { animation: "WarehouseInventoryWh", keepAlive: true },
        outofstock: { animation: "WarehouseOutofstockWh", keepAlive: true },
        OutboundMonitoring: { animation: "WarehouseOutboundMonitoringWh", keepAlive: true },
        TaskOut: { animation: "WarehouseTaskOutWh", keepAlive: true }
    },
    wms: {
        stockin: { animation: "WarehouseStockin", keepAlive: true },
        stockout: { animation: "WarehouseStockout", keepAlive: true },
        statisticsin: { animation: "WarehouseStatisticsIn", keepAlive: true },
        statisticsout: { animation: "WarehouseStatisticsOut", keepAlive: true },
        capacity: { animation: "WarehouseCapacity", keepAlive: true },
        autooutcontrol: {
            animation: "WarehouseAutoOutControl",
            keepAlive: true,
        },
        autooutscheme: { animation: "WarehouseAutoOutScheme", keepAlive: true },
        stock: { animation: "WarehouseStock", keepAlive: true },
        outcontrol: { animation: "WarehouseOutControl", keepAlive: true },
        outtask: { animation: "WarehouseOutTask", keepAlive: true },
        inoutsummaryreport: {
            animation: "WarehouseInoutsummaryreport",
            keepAlive: true,
        },
        outboundplan: { animation: "WarehouseOutboundPlan", keepAlive: true },
        InventorySummary: { animation: "WarehouseInventorySummary", keepAlive: true },
        packingprocess: { animation: "WarehousePackingProcess", keepAlive: true },
        packingsolution: { animation: "WarehousePackingSolution", keepAlive: true },
        inventoryclearancemanagement: { animation: "WarehouseInventoryClearanceManagementComponent", keepAlive: true },
        priceinfo: { animation: "WarehousePriceInfoComponent", keepAlive: true },
        outboundhangermonitoring: { animation: "WarehouseOutboundhangermonitoring", keepAlive: true },
        skuprocess: { animation: "WarehouseSkuprocess", keepAlive: true },
        abnormaleventreport: { animation: "WarehouseAbnormaleventreport", keepAlive: true },
        countingdemand: { animation: "WarehouseCountingdemand", keepAlive: true },
        inventoryoutbound: { animation: "WarehouseInventoryoutbound", keepAlive: true },


    }
};
