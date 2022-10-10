using System.Collections.Generic;
using CCPDemo.Authorization.Users.Importing.Dto;
using Abp.Dependency;

namespace CCPDemo.Authorization.Users.Importing
{
    public interface IUserListExcelDataReader: ITransientDependency
    {
        List<ImportUserDto> GetUsersFromExcel(byte[] fileBytes);
    }
}
