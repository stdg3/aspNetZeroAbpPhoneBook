using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CCPDemo.MultiTenancy.HostDashboard.Dto;

namespace CCPDemo.MultiTenancy.HostDashboard
{
    public interface IIncomeStatisticsService
    {
        Task<List<IncomeStastistic>> GetIncomeStatisticsData(DateTime startDate, DateTime endDate,
            ChartDateInterval dateInterval);
    }
}