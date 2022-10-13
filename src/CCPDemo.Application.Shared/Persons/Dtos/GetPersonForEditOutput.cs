using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace CCPDemo.Persons.Dtos
{
    public class GetPersonForEditOutput
    {
        public CreateOrEditPersonDto Person { get; set; }

    }
}