using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using CCPDemo.EntityFrameworkCore;

namespace CCPDemo.HealthChecks
{
    public class CCPDemoDbContextHealthCheck : IHealthCheck
    {
        private readonly DatabaseCheckHelper _checkHelper;

        public CCPDemoDbContextHealthCheck(DatabaseCheckHelper checkHelper)
        {
            _checkHelper = checkHelper;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            if (_checkHelper.Exist("db"))
            {
                return Task.FromResult(HealthCheckResult.Healthy("CCPDemoDbContext connected to database."));
            }

            return Task.FromResult(HealthCheckResult.Unhealthy("CCPDemoDbContext could not connect to database"));
        }
    }
}
