using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using CCPDemo.DataExporting.Excel.NPOI;
using CCPDemo.Persons.Dtos;
using CCPDemo.Dto;
using CCPDemo.Storage;

namespace CCPDemo.Persons.Exporting
{
    public class PersonsExcelExporter : NpoiExcelExporterBase, IPersonsExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public PersonsExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetPersonForViewDto> persons)
        {
            return CreateExcelPackage(
                "Persons.xlsx",
                excelPackage =>
                {

                    var sheet = excelPackage.CreateSheet(L("Persons"));

                    AddHeader(
                        sheet,
                        L("Name"),
                        L("Surname"),
                        L("EmailAddress")
                        );

                    AddObjects(
                        sheet, persons,
                        _ => _.Person.Name,
                        _ => _.Person.Surname,
                        _ => _.Person.EmailAddress
                        );

                });
        }
    }
}