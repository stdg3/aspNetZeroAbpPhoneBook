using System.Collections.Generic;
using Abp;
using CCPDemo.Chat.Dto;
using CCPDemo.Dto;

namespace CCPDemo.Chat.Exporting
{
    public interface IChatMessageListExcelExporter
    {
        FileDto ExportToFile(UserIdentifier user, List<ChatMessageExportDto> messages);
    }
}
