using System.Threading.Tasks;
using Abp.Application.Services;
using CCPDemo.Install.Dto;

namespace CCPDemo.Install
{
    public interface IInstallAppService : IApplicationService
    {
        Task Setup(InstallDto input);

        AppSettingsJsonDto GetAppSettingsJson();

        CheckDatabaseOutput CheckDatabase();
    }
}