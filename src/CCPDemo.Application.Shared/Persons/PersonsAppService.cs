using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using CCPDemo.Persons.Exporting;
using CCPDemo.Persons.Dtos;
using CCPDemo.Dto;
using Abp.Application.Services.Dto;
using CCPDemo.Authorization;
using Abp.Extensions;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;
using Abp.UI;
using CCPDemo.Storage;

namespace CCPDemo.Persons
{
    [AbpAuthorize(AppPermissions.Pages_Persons)]
    public class PersonsAppService : CCPDemoAppServiceBase, IPersonsAppService
    {
        private readonly IRepository<Person> _personRepository;
        private readonly IPersonsExcelExporter _personsExcelExporter;

        public PersonsAppService(IRepository<Person> personRepository, IPersonsExcelExporter personsExcelExporter)
        {
            _personRepository = personRepository;
            _personsExcelExporter = personsExcelExporter;

        }

        public async Task<PagedResultDto<GetPersonForViewDto>> GetAll(GetAllPersonsInput input)
        {

            var filteredPersons = _personRepository.GetAll()
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.Surname.Contains(input.Filter) || e.EmailAddress.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name == input.NameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SurnameFilter), e => e.Surname == input.SurnameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.EmailAddressFilter), e => e.EmailAddress == input.EmailAddressFilter);

            var pagedAndFilteredPersons = filteredPersons
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var persons = from o in pagedAndFilteredPersons
                          select new
                          {

                              o.Name,
                              o.Surname,
                              o.EmailAddress,
                              Id = o.Id
                          };

            var totalCount = await filteredPersons.CountAsync();

            var dbList = await persons.ToListAsync();
            var results = new List<GetPersonForViewDto>();

            foreach (var o in dbList)
            {
                var res = new GetPersonForViewDto()
                {
                    Person = new PersonDto
                    {

                        Name = o.Name,
                        Surname = o.Surname,
                        EmailAddress = o.EmailAddress,
                        Id = o.Id,
                    }
                };

                results.Add(res);
            }

            return new PagedResultDto<GetPersonForViewDto>(
                totalCount,
                results
            );

        }

        public async Task<GetPersonForViewDto> GetPersonForView(int id)
        {
            var person = await _personRepository.GetAsync(id);

            var output = new GetPersonForViewDto { Person = ObjectMapper.Map<PersonDto>(person) };

            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_Persons_Edit)]
        public async Task<GetPersonForEditOutput> GetPersonForEdit(EntityDto input)
        {
            var person = await _personRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetPersonForEditOutput { Person = ObjectMapper.Map<CreateOrEditPersonDto>(person) };

            return output;
        }

        public async Task CreateOrEdit(CreateOrEditPersonDto input)
        {
            if (input.Id == null)
            {
                await Create(input);
            }
            else
            {
                await Update(input);
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Persons_Create)]
        protected virtual async Task Create(CreateOrEditPersonDto input)
        {
            var person = ObjectMapper.Map<Person>(input);

            await _personRepository.InsertAsync(person);

        }

        [AbpAuthorize(AppPermissions.Pages_Persons_Edit)]
        protected virtual async Task Update(CreateOrEditPersonDto input)
        {
            var person = await _personRepository.FirstOrDefaultAsync((int)input.Id);
            ObjectMapper.Map(input, person);

        }

        [AbpAuthorize(AppPermissions.Pages_Persons_Delete)]
        public async Task Delete(EntityDto input)
        {
            await _personRepository.DeleteAsync(input.Id);
        }

        public async Task<FileDto> GetPersonsToExcel(GetAllPersonsForExcelInput input)
        {

            var filteredPersons = _personRepository.GetAll()
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.Surname.Contains(input.Filter) || e.EmailAddress.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name == input.NameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SurnameFilter), e => e.Surname == input.SurnameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.EmailAddressFilter), e => e.EmailAddress == input.EmailAddressFilter);

            var query = (from o in filteredPersons
                         select new GetPersonForViewDto()
                         {
                             Person = new PersonDto
                             {
                                 Name = o.Name,
                                 Surname = o.Surname,
                                 EmailAddress = o.EmailAddress,
                                 Id = o.Id
                             }
                         });

            var personListDtos = await query.ToListAsync();

            return _personsExcelExporter.ExportToFile(personListDtos);
        }

        public async Task CreatePerson(CreatePersonInput input)
        {
            var person = ObjectMapper.Map<Person>(input);
            await _personRepository.InsertAsync(person);
        }

    }
}