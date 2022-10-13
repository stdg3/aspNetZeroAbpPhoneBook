using Abp.Application.Services.Dto;
using System;

namespace CCPDemo.Persons.Dtos
{
    public class GetAllPersonsForExcelInput
    {
        public string Filter { get; set; }

        public string NameFilter { get; set; }

        public string SurnameFilter { get; set; }

        public string EmailAddressFilter { get; set; }

    }
}