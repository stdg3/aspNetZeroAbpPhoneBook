using System.Collections.Generic;
using CCPDemo.Authorization.Users.Dto;
using CCPDemo.Dto;

namespace CCPDemo.Authorization.Users.Exporting
{
    public interface IUserListExcelExporter
    {
        FileDto ExportToFile(List<UserListDto> userListDtos);
    }
}