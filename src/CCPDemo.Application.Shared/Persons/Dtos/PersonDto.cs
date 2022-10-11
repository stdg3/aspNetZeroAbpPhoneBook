using System;
using Abp.Application.Services.Dto;

namespace CCPDemo.Persons.Dtos
{
    public class PersonDto : EntityDto
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string EmailAddress { get; set; }

    }
}