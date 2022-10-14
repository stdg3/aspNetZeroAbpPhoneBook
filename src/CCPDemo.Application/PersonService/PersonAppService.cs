using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using CCPDemo.Dto;
using CCPDemo.InterfacePerson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CCPDemo.Persons;
using Abp.Collections.Extensions;
using Abp.Extensions;
using Abp.Authorization;
using CCPDemo.Authorization;
using Abp.AutoMapper;
using Microsoft.EntityFrameworkCore;
using CCPDemo.Phones;

namespace CCPDemo.PersonService
{
    [AbpAuthorize(AppPermissions.Pages_Tenant_PhoneBook)]
    public class PersonAppService: CCPDemoAppServiceBase, IPersonAppService
    {
        private readonly IRepository<Person> _personRepository;
        private readonly IRepository<Phone, long> _phoneRepository;

        public PersonAppService(IRepository<Person> personRepository, IRepository<Phone, long> phoneRepository)
        {
            _personRepository = personRepository;
            _phoneRepository = phoneRepository;
        }

        public ListResultDto<PersonListDto> GetPeople(GetPeopleInput input)
        {
            var persons = _personRepository
                .GetAll()
                .Include(p => p.Phones)
                .WhereIf(
                    !input.Filter.IsNullOrEmpty(),
                    p => p.Name.Contains(input.Filter) ||
                            p.Surname.Contains(input.Filter) ||
                            p.EmailAddress.Contains(input.Filter)
                )
                .OrderBy(p => p.Name)
                .ThenBy(p => p.Surname)
                .ToList();

            return new ListResultDto<PersonListDto>(ObjectMapper.Map<List<PersonListDto>>(persons));
        }

        [AbpAuthorize(AppPermissions.Pages_Tenant_PhoneBook_CreatePerson)]
        public async Task CreatePerson(CreatePersonInput input)
        {
            var person = ObjectMapper.Map<Person>(input);
            await _personRepository.InsertAsync(person);
        }

        [AbpAuthorize(AppPermissions.Pages_Tenant_PhoneBook_DeletePerson)]
        public async Task DeletePerson(EntityDto input)
        {
            await _personRepository.DeleteAsync(input.Id);
        }

        public async Task DeletePhone(EntityDto<long> input)
        {
            await _phoneRepository.DeleteAsync(input.Id);
        }

        public async Task<PhoneInPersonListDto> AddPhone(AddPhoneInput input)
        {
            var person = _personRepository.Get(input.PersonId);
            await _personRepository.EnsureCollectionLoadedAsync(person, p => p.Phones);

            var phone = ObjectMapper.Map<Phone>(input);
            person.Phones.Add(phone);

            await CurrentUnitOfWork.SaveChangesAsync();

            return ObjectMapper.Map<PhoneInPersonListDto>(phone);
        }

        public async Task<GetPersonForEditOutput> GetPersonForEdit(IEntityDto input)
        {
            var person = await _personRepository.GetAsync(input.Id);
            return ObjectMapper.Map<GetPersonForEditOutput>(person);
        }

        public async Task EditPerson(EditPersonInput input)
        {
            var person = await _personRepository.GetAsync(input.Id);
            person.Name = input.Name;
            person.Surname = input.Surname;
            person.EmailAddress = input.EmailAddress;
            await _personRepository.UpdateAsync(person);
        }


        //public Task GetPersonForEdit(EntityDto input)
        //{
        //    var person = await _personRepository.GetAsync(input.Id);
        //    return ObjectMapper.Map<GetPersonForEditOutput>(person);
        //}
    }
}
