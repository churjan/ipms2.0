import { NgModule } from '@angular/core';

import { ExceptionModule } from './pages/exception/exception.module';
import { RedirectModule } from './pages/redirect/redirect.module';
import { IndexModule } from './pages/index/index.module';
import { InfoModule } from './pages/account/info/info.module';
import { PasswordModule } from './pages/account/password/password.module';
import { NotificationModule } from './pages/account/notification/notification.module';
import { RoleModule } from './pages/system/role/role.module';
import { MenuModule } from './pages/system/menu/menu.module';
import { TranslateModule as LanguageTranslateModule } from './pages/system/language/translate/translate.module';
import { ParameterModule } from './pages/system/parameter/parameter.module';
import { OperationModule as OperationLogModule } from './pages/system/log/operation/operation.module';
import { DictionaryModule } from './pages/system/dictionary/dictionary.module';
import { SoftwareModule } from './pages/system/software/software.module';
import { OrganizationModule } from './pages/hr/organization/organization.module';
import { EmployeeModule } from './pages/hr/employee/employee.module';
import { TagsModule } from './pages/pm/tags/tags.module';
import { StockinModule } from './pages/warehouse/wms/stockin/stockin.module';
import { StockoutModule } from './pages/warehouse/wms/stockout/stockout.module';
import { StatisticsinModule } from './pages/warehouse/wms/statisticsin/statisticsin.module';
import { StatisticsoutModule } from './pages/warehouse/wms/statisticsout/statisticsout.module';
import { CapacityModule } from './pages/warehouse/wms/capacity/capacity.module';
import { AutooutschemeModule } from './pages/warehouse/wms/autooutscheme/autooutscheme.module';
import { StockModule } from './pages/warehouse/wms/stock/stock.module';
import { OutControlModule } from './pages/warehouse/wms/outcontrol/outcontrol.module';
import { RunModule } from './pages/system/log/run/run.module';
import { FileModule } from './pages/system/file/file.module';
import { OuttaskModule } from './pages/warehouse/wms/outtask/outtask.module';
import { InoutsummaryreportModule } from './pages/warehouse/wms/inoutsummaryreport/inoutsummaryreport.module';
import { WeightmanagementModule } from './pages/system/weightmanagement/weightmanagement.module';
import { CustomerModule } from './pages/sale/customer/customer.module';
import { WorkModule } from './pages/pm/Work/work.module';
import { StyleModule } from './pages/pdm/style/style.module';
import { RetrievalModule } from './pages/system/log/retrieval/retrieval.module';
import { OperationModule } from './pages/pdm/operation/operation.module';
import { PadErrModule } from './pages/system/log/padErr/padErr.module';
import { ColorModule } from './pages/pdm/color/color.module';
import { SizeModule } from './pages/pdm/size/size.module';
import { DocLibraryModule } from './pages/dm/doc-library/doc-library.module';
import { QualityItemManagementModule } from './pages/dm/quality-item-management/quality-item-management.module';
import { ProcessDifficultyModule } from './pages/dm/process-difficulty/process-difficulty.module';
import { FabricDifficultyModule } from './pages/dm/fabric-difficulty/fabric-difficulty.module';
import { ProductionPartsModule } from './pages/dm/production-parts/production-parts.module';
import { SectionManagementModule } from './pages/dm/section-management/section-management.module';
import { ProductionEquipmentModule } from './pages/dm/production-equipment/production-equipment.module';
import { OrderSaleModule } from './pages/sale/order/order.module';
import { ReportFormModule } from './pages/reportForm/reportForm.module';
import { HangerSearchModule } from './pages/hangerSearch/hanger.module';
import { LanguageModule } from './pages/system/language/language.module';
import { PartOperationModule } from './pages/pdm/partoperation/partoperation.module';
import { SpecialCoatHangerMarkModule } from './pages/pm/specialCoatHangerMark/specialCoatHangerMark.module';
import { HangerFlowModule } from './pages/pm/hangerFlow/hangerFlow.module';
import { SkillModule } from './pages/hr/skill/skill.module';
import { CuttingModule } from './pages/pm/Cutting/Cutting.module';
import { LayoutFormModule } from './pages/layout/layout.module';
import { LayingClothModule } from './pages/pm/layingcloth/layingcloth.module';
import { WHModule } from './pages/warehouse/wh/wh.module';
import { PartSingletonPOModule } from './pages/dm/PartSingletonPO/PartSingletonPO.module';
import { OutboundPlanModule } from './pages/warehouse/wms/outboundplan/outboundplan.module';
import { OverloadRulesModule } from './pages/dm/OverloadRules/OverloadRules.module';
import { AttributeModule } from './pages/dm/attribute/attribute.module';
import { InventorySummaryModule } from './pages/warehouse/wms/InventorySummary/InventorySummary.module';
import { packingProcessModule } from './pages/warehouse/wms/packing-process/packing-process.module';
import { PackingSolutionModule } from './pages/warehouse/wms/packing-solution/packing-solution.module';
import { InventoryClearanceManagementModule } from './pages/warehouse/wms/inventory-clearance-management/inventory-clearance-management.module';
import { PriceInfoModule } from './pages/warehouse/wms/price-info/price-info.module';
import { OutboundHangerMonitoringModule } from './pages/warehouse/wms/outbound-hanger-monitoring/outbound-hanger-monitoring.module';
import { FlowModule } from './pages/pdm/flow/flow.module';
import { OverloadManagementModule } from './pages/pm/OverloadManagement/OverloadManagement.module';
import { SkuProcessModule } from './pages/warehouse/wms/sku-process/sku-process.module';
import { AbnormalEventReportModule } from './pages/warehouse/wms/abnormal-event-report/abnormal-event-report.module';
import { CountingDemandModule } from './pages/warehouse/wms/counting-demand/counting-demand.module';
import { InventoryOutboundModule } from './pages/warehouse/wms/inventory-outbound/inventory-outbound.module';
@NgModule({
  imports: [
    WorkModule,
    StyleModule,
    ExceptionModule,
    RedirectModule,
    IndexModule,
    InfoModule,
    PasswordModule,
    NotificationModule,
    RoleModule,
    MenuModule,
    LanguageTranslateModule,
    ParameterModule,
    OperationLogModule,
    DictionaryModule,
    SoftwareModule,
    OrganizationModule,
    EmployeeModule,
    SpecialCoatHangerMarkModule,
    HangerFlowModule,
    SkillModule,
    TagsModule,
    CustomerModule,
    StockinModule,
    StockoutModule,
    StatisticsinModule,
    StatisticsoutModule,
    CapacityModule,
    AutooutschemeModule,
    StockModule,
    OutControlModule,
    RunModule,
    RetrievalModule,
    FileModule,
    OuttaskModule,
    InoutsummaryreportModule,
    WeightmanagementModule,
    OperationModule,
    PadErrModule,
    OperationModule,
    ColorModule,
    SizeModule,
    DocLibraryModule,
    QualityItemManagementModule,
    ProcessDifficultyModule,
    FabricDifficultyModule,
    ProductionPartsModule,
    SectionManagementModule,
    ProductionEquipmentModule,
    OrderSaleModule,
    ReportFormModule,
    HangerSearchModule,
    LanguageModule,
    PartOperationModule,
    CuttingModule,
    LayoutFormModule,
    LayingClothModule,
    WHModule,
    PartSingletonPOModule,
    OutboundPlanModule,
    OverloadRulesModule,
    AttributeModule,
    InventorySummaryModule,
    packingProcessModule,
    PackingSolutionModule,
    InventoryClearanceManagementModule,
    PriceInfoModule,
    OutboundHangerMonitoringModule,
    SkuProcessModule,
    OverloadManagementModule,
    FlowModule,
    AbnormalEventReportModule,
    CountingDemandModule,
    InventoryOutboundModule
  ]
})
export class AppChildrenModule { }
