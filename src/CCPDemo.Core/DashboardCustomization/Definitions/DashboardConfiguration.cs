using System.Collections.Generic;
using System.Linq;
using Abp.Authorization;
using Abp.MultiTenancy;
using CCPDemo.Authorization;

namespace CCPDemo.DashboardCustomization.Definitions
{
    public class DashboardConfiguration
    {
        public List<DashboardDefinition> DashboardDefinitions { get; } = new List<DashboardDefinition>();

        public List<WidgetDefinition> WidgetDefinitions { get; } = new List<WidgetDefinition>();

        public List<WidgetFilterDefinition> WidgetFilterDefinitions { get; } = new List<WidgetFilterDefinition>();

        public DashboardConfiguration()
        {
            #region FilterDefinitions

            // These are global filter which all widgets can use
            var dateRangeFilter = new WidgetFilterDefinition(
                CCPDemoDashboardCustomizationConsts.Filters.FilterDateRangePicker,
                "FilterDateRangePicker"
            );

            WidgetFilterDefinitions.Add(dateRangeFilter);

            // Add your filters here

            #endregion

            #region WidgetDefinitions

            // Define Widgets

            #region TenantWidgets

            var simplePermissionDependencyForTenantDashboard = new SimplePermissionDependency(AppPermissions.Pages_Tenant_Dashboard);

            var dailySales = new WidgetDefinition(
                CCPDemoDashboardCustomizationConsts.Widgets.Tenant.DailySales,
                "WidgetDailySales",
                side: MultiTenancySides.Tenant,
                usedWidgetFilters: new List<string> { dateRangeFilter.Id },
                permissionDependency: simplePermissionDependencyForTenantDashboard
            );

            var generalStats = new WidgetDefinition(
                CCPDemoDashboardCustomizationConsts.Widgets.Tenant.GeneralStats,
                "WidgetGeneralStats",
                side: MultiTenancySides.Tenant,
                permissionDependency: new SimplePermissionDependency(
                    requiresAll: true,
                    AppPermissions.Pages_Tenant_Dashboard,
                    AppPermissions.Pages_Administration_AuditLogs
                )
            );

            var profitShare = new WidgetDefinition(
                CCPDemoDashboardCustomizationConsts.Widgets.Tenant.ProfitShare,
                "WidgetProfitShare",
                side: MultiTenancySides.Tenant,
                permissionDependency: simplePermissionDependencyForTenantDashboard
            );

            var memberActivity = new WidgetDefinition(
                CCPDemoDashboardCustomizationConsts.Widgets.Tenant.MemberActivity,
                "WidgetMemberActivity",
                side: MultiTenancySides.Tenant,
                permissionDependency: simplePermissionDependencyForTenantDashboard
            );
            
            var regionalStats = new WidgetDefinition(
                CCPDemoDashboardCustomizationConsts.Widgets.Tenant.RegionalStats,
                "WidgetRegionalStats",
                side: MultiTenancySides.Tenant,
                permissionDependency: simplePermissionDependencyForTenantDashboard
            );

            var salesSummary = new WidgetDefinition(
                CCPDemoDashboardCustomizationConsts.Widgets.Tenant.SalesSummary,
                "WidgetSalesSummary",
                usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
                side: MultiTenancySides.Tenant,
                permissionDependency: simplePermissionDependencyForTenantDashboard
            );
            
            var topStats = new WidgetDefinition(
                CCPDemoDashboardCustomizationConsts.Widgets.Tenant.TopStats,
                "WidgetTopStats",
                side: MultiTenancySides.Tenant,
                permissionDependency: simplePermissionDependencyForTenantDashboard
            );

            WidgetDefinitions.Add(generalStats);
            WidgetDefinitions.Add(dailySales);
            WidgetDefinitions.Add(profitShare);
            WidgetDefinitions.Add(memberActivity);
            WidgetDefinitions.Add(regionalStats);
            WidgetDefinitions.Add(topStats);
            WidgetDefinitions.Add(salesSummary);
            // Add your tenant side widgets here

            #endregion

            #region HostWidgets

            var simplePermissionDependencyForHostDashboard = new SimplePermissionDependency(AppPermissions.Pages_Administration_Host_Dashboard);

            var incomeStatistics = new WidgetDefinition(
                CCPDemoDashboardCustomizationConsts.Widgets.Host.IncomeStatistics,
                "WidgetIncomeStatistics",
                side: MultiTenancySides.Host,
                permissionDependency: simplePermissionDependencyForHostDashboard
            );

            var hostTopStats = new WidgetDefinition(
                CCPDemoDashboardCustomizationConsts.Widgets.Host.TopStats,
                "WidgetTopStats",
                side: MultiTenancySides.Host,
                permissionDependency: simplePermissionDependencyForHostDashboard
            );

            var editionStatistics = new WidgetDefinition(
                CCPDemoDashboardCustomizationConsts.Widgets.Host.EditionStatistics,
                "WidgetEditionStatistics",
                side: MultiTenancySides.Host,
                permissionDependency: simplePermissionDependencyForHostDashboard
            );

            var subscriptionExpiringTenants = new WidgetDefinition(
                CCPDemoDashboardCustomizationConsts.Widgets.Host.SubscriptionExpiringTenants,
                "WidgetSubscriptionExpiringTenants",
                side: MultiTenancySides.Host,
                permissionDependency: simplePermissionDependencyForHostDashboard
            );

            var recentTenants = new WidgetDefinition(
                CCPDemoDashboardCustomizationConsts.Widgets.Host.RecentTenants,
                "WidgetRecentTenants",
                side: MultiTenancySides.Host,
                usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
                permissionDependency: simplePermissionDependencyForHostDashboard
            );

            WidgetDefinitions.Add(incomeStatistics);
            WidgetDefinitions.Add(hostTopStats);
            WidgetDefinitions.Add(editionStatistics);
            WidgetDefinitions.Add(subscriptionExpiringTenants);
            WidgetDefinitions.Add(recentTenants);

            // Add your host side widgets here

            #endregion

            #endregion

            #region DashboardDefinitions

            // Create dashboard
            var defaultTenantDashboard = new DashboardDefinition(
                CCPDemoDashboardCustomizationConsts.DashboardNames.DefaultTenantDashboard,
                new List<string>
                {
                    generalStats.Id, dailySales.Id, profitShare.Id, memberActivity.Id, regionalStats.Id, topStats.Id, salesSummary.Id
                });

            DashboardDefinitions.Add(defaultTenantDashboard);

            var defaultHostDashboard = new DashboardDefinition(
                CCPDemoDashboardCustomizationConsts.DashboardNames.DefaultHostDashboard,
                new List<string>
                {
                    incomeStatistics.Id,
                    hostTopStats.Id,
                    editionStatistics.Id,
                    subscriptionExpiringTenants.Id,
                    recentTenants.Id
                });

            DashboardDefinitions.Add(defaultHostDashboard);

            // Add your dashboard definition here

            #endregion

        }

    }
}
