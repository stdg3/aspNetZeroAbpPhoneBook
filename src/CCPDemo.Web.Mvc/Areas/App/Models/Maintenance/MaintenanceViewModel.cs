using System.Collections.Generic;
using CCPDemo.Caching.Dto;

namespace CCPDemo.Web.Areas.App.Models.Maintenance
{
    public class MaintenanceViewModel
    {
        public IReadOnlyList<CacheDto> Caches { get; set; }
    }
}