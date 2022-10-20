using CCPDemo.EntityFrameworkCore;
using CCPDemo.Persons;
using CCPDemo.Phones;
using CCPDemo.PhoneTypes;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CCPDemo.Migrations.Seed.Host
{
    public class InitialPeopleAndPhoneCreator
    {
        private readonly CCPDemoDbContext _context;

        public InitialPeopleAndPhoneCreator(CCPDemoDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            var douglas = _context.Persons.FirstOrDefault(p => p.EmailAddress == "douglas.adams@fortytwo.com");
            if (douglas == null)
            {
                _context.Persons.Add(
                    new Person
                    {
                        Name = "Douglas",
                        Surname = "Adams",
                        EmailAddress = "douglas.adams@fortytwo.com",
                        Phones = new List<PhonePb>
                                    {
                                    //new Phone {Type = PhoneType.Home, Number = "1112242"},
                                    //new Phone {Type = PhoneType.Mobile, Number = "2223342"}
                                    new PhonePb{ Number = "234234", PhoneTypeId = 2 },
                                    new PhonePb{ Number = "345345", PhoneTypeId = 3 }

                        }
                    });
            }

            var asimov = _context.Persons.FirstOrDefault(p => p.EmailAddress == "isaac.asimov@foundation.org");
            if (asimov == null)
            {
                _context.Persons.Add(
                    new Person
                    {
                        Name = "Isaac",
                        Surname = "Asimov",
                        EmailAddress = "isaac.asimov@foundation.org",
                        Phones = new List<PhonePb>
                                    {
                                    //new Phone {Type = PhoneType.Home, Number = "8889977"}
                                    new PhonePb{ Number = "123123", PhoneTypeId = 1 }
                                    }
                    });
            }
        }
    }
}
