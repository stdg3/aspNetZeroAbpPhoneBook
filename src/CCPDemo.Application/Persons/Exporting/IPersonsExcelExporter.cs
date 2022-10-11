using System.Collections.Generic;
using CCPDemo.Persons.Dtos;
using CCPDemo.Dto;

namespace CCPDemo.Persons.Exporting
{
    public interface IPersonsExcelExporter
    {
        FileDto ExportToFile(List<GetPersonForViewDto> persons);
    }
}