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
using CCPDemo.PhoneTypeEntityDir;
using PayPalCheckoutSdk.Orders;

namespace CCPDemo.PersonService
{
    [AbpAuthorize(AppPermissions.Pages_Tenant_PhoneBook)]
    public class PersonAppService: CCPDemoAppServiceBase, IPersonAppService
    {
        private readonly IRepository<Person> _personRepository;
        private readonly IRepository<PhonePb, long> _phoneRepository;
        private readonly IRepository<PhoneType> _phoneTypeRepository;

        public PersonAppService(IRepository<Person> personRepository, IRepository<PhonePb, long> phoneRepository, IRepository<PhoneType> phoneTypeRepository)
        {
            _personRepository = personRepository;
            _phoneRepository = phoneRepository;
            _phoneTypeRepository = phoneTypeRepository;
        }

        public ListResultDto<PersonListDto> GetPeople(GetPeopleInput input)
        {
            var pp = _personRepository.GetAllIncluding()
                .Include(m => m.Phones)
                .ThenInclude(m => m.PhoneType)
                .WhereIf(!input.Filter.IsNullOrEmpty(),
                            p => p.Name.Contains(input.Filter) ||
                            p.Surname.Contains(input.Filter) ||
                            p.EmailAddress.Contains(input.Filter))
                .ToList();

            //var ptype = _phoneTypeRepository.GetAll().ToList();
            //var phoneTypeTbl = _phoneTypeRepository.GetAll().ToList();
            //var phoneTbl = _phoneRepository.GetAll().ToList();
            //var per = _personRepository.GetAll().ToList();
            //var a = ((from phoneType in phoneTypeTbl
            //        join phone in phoneTbl on phoneType.Id equals phone.Id
            //        join persn in per on phone.Id equals persn.Id

            //        select new
            //        {
            //            Name = persn.Name,
            //            Surname = persn.Surname,
            //            EmailAddress = persn.EmailAddress,

            //        }
            //        )
            //        .WhereIf(
            //                !input.Filter.IsNullOrEmpty(),
            //                p => p.Name.Contains(input.Filter) ||
            //                p.Surname.Contains(input.Filter) ||
            //                p.EmailAddress.Contains(input.Filter)))
            //        .ToList();

            //var persons = _personRepository
            //    .GetAll()
            //    //.Include(p => p.Phones)
            //    //    .ThenInclude(num => num.Number)
            //    //.Include(p => p.Phones)
            //    //    .ThenInclude(pt => pt.PhoneType)
            //    //    .ThenInclude(pn => pn.PhoneTypeName)
            //    .WhereIf(
            //        !input.Filter.IsNullOrEmpty(),
            //        p => p.Name.Contains(input.Filter) ||
            //                p.Surname.Contains(input.Filter) ||
            //                p.EmailAddress.Contains(input.Filter)
            //    )
            //    .OrderBy(p => p.Name)
            //    .ThenBy(p => p.Surname)
            //    .ToList();

         //   var partPType = ObjectMapper.Map<List<PersonListDto>>(ptype);

            var a = ObjectMapper.Map<List<PersonListDto>>(pp);
            return new ListResultDto<PersonListDto>(a);
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
            //var person = _personRepository.GetAllIncluding()
            //    .Include(m => m.Phones)
            //    .ThenInclude(m => m.PhoneType)
            //    .Where(m => m.Id == input.PersonId)
            //    .ToList();


            var person = _personRepository.Get(input.PersonId);
            await _personRepository.EnsureCollectionLoadedAsync(person, p => p.Phones);

            var phone = ObjectMapper.Map<PhonePb>(input);
            person.Phones.Add(phone);

            await CurrentUnitOfWork.SaveChangesAsync();

            //long aq = phone.Id;

            var lastPhoneByAddedId = _phoneRepository.GetAll()
                .Include(p => p.PhoneType)
                .Where(p => p.Id == phone.Id)
                .Single();

            var e = ObjectMapper.Map<PhoneInPersonListDto>(lastPhoneByAddedId);
            return e;

            //PhoneInPersonListDto qq = new PhoneInPersonListDto 
            //{
            //    Number = "6666",
            //    PhoneType = new PhoneTypeListDto
            //    {
            //        PhoneTypeName = "ss",
            //        Id = 6,
            //    }
            //};

            //return qq;

            //var pp = _phoneRepository.GetAll()
            //    .Include(m => m.PhoneType)
            //    .Where(m => m.PersonId == input.PersonId)
            //    .ToList();

            //var a = ObjectMapper.Map<PhoneInPersonListDto>(pp);
            ////return new ListResultDto<PhoneInPersonListDto>(a);

            //return a; //ObjectMapper.Map<PhoneInPersonListDto>(pp);
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
