using CCPDemo.Dto;
using CCPDemo.InterfacePerson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Shouldly;

namespace CCPDemo.Tests.PersonService
{
    public class PersonAppService_Tests : AppTestBase
    {
        private readonly IPersonAppService _personAppService;

        public PersonAppService_Tests()
        {
            _personAppService = Resolve<IPersonAppService>();
        }

        [Fact]
        public void Should_Get_All_People_Without_Any_Filter()
        {
            //Act
            //var persons = _personAppService.GetPeople(new GetPeopleInput()); // test case 1
            var persons = _personAppService.GetPeople(
                new GetPeopleInput
                {
                    Filter = "adamsXXXXXXXXXXXXX"
                }); // adams for pas test

            //Assert
            //persons.Items.Count.ShouldBe(2); // test case 1 
            persons.Items.Count.ShouldBe(1);
            persons.Items[0].Name.ShouldBe("Douglas");
            persons.Items[0].Surname.ShouldBe("Adams");
        }
    }
}
