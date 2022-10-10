using System.Collections.Generic;
using CCPDemo.Authorization.Users.Importing.Dto;
using CCPDemo.Dto;

namespace CCPDemo.Authorization.Users.Importing
{
    public interface IInvalidUserExporter
    {
        FileDto ExportToFile(List<ImportUserDto> userListDtos);
    }
}
