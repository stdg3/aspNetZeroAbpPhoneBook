using CCPDemo.Dto;
using CCPDemo.InterfacePerson;
using CCPDemo.InterfacePhoneType;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CCPDemo.Tests.PhoneTypeService
{
    public class PhoneTypeService_Test : AppTestBase
    {
        private readonly IPhoneTypeService _phoneTypeAppService;

        public PhoneTypeService_Test()
        {
            _phoneTypeAppService = Resolve<IPhoneTypeService>();
        }

        [Fact]
        public void Should_Get_All_People_Without_Any_Filter()
        {
            //Act
            var persons = _phoneTypeAppService.GetPhoneType(new GetPhoneTypeInput());

            //Assert
            persons.Items.Count.ShouldBe(3);
        }
    }
}
