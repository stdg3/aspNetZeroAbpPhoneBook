using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using CCPDemo.Dto;

namespace CCPDemo.Gdpr
{
    public interface IUserCollectedDataProvider
    {
        Task<List<FileDto>> GetFiles(UserIdentifier user);
    }
}
