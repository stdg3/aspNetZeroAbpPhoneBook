using CCPDemo.EntityFrameworkCore;
using CCPDemo.PhoneTypeEntityDir;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CCPDemo.Migrations.Seed.Host
{
    public class InitialPhoneTypeCreator
    {
        private readonly CCPDemoDbContext _context;

        public InitialPhoneTypeCreator(CCPDemoDbContext context)
        {
            _context = context; 
        }

        public void Create()
        {
            var home = _context.PhoneTypes.FirstOrDefault(p => p.PhoneTypeName == "Home");
            if (home == null)
            {
                _context.PhoneTypes.Add(
                    new PhoneType
                    {
                        PhoneTypeName = "Home",
                    });
            }
            var mobile = _context.PhoneTypes.FirstOrDefault(p => p.PhoneTypeName == "Mobile");
            if (mobile == null)
            {
                _context.PhoneTypes.Add(
                    new PhoneType
                    {
                        PhoneTypeName = "Mobile",
                    });
            }
            var Business = _context.PhoneTypes.FirstOrDefault(p => p.PhoneTypeName == "Business");
            if (Business == null)
            {
                _context.PhoneTypes.Add(
                    new PhoneType
                    {
                        PhoneTypeName = "Business",
                    });
            }
        }
    }
}
