using Abp.Application.Services;
using CCPDemo.Dto;
using CCPDemo.Logging.Dto;

namespace CCPDemo.Logging
{
    public interface IWebLogAppService : IApplicationService
    {
        GetLatestWebLogsOutput GetLatestWebLogs();

        FileDto DownloadWebLogs();
    }
}
