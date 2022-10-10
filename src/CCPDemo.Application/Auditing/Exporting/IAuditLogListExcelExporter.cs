using System.Collections.Generic;
using CCPDemo.Auditing.Dto;
using CCPDemo.Dto;

namespace CCPDemo.Auditing.Exporting
{
    public interface IAuditLogListExcelExporter
    {
        FileDto ExportToFile(List<AuditLogListDto> auditLogListDtos);

        FileDto ExportToFile(List<EntityChangeListDto> entityChangeListDtos);
    }
}
