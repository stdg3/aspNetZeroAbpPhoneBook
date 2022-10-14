using CCPDemo.EntityFrameworkCore;

namespace CCPDemo.Migrations.Seed.Host
{
    public class InitialHostDbBuilder
    {
        private readonly CCPDemoDbContext _context;

        public InitialHostDbBuilder(CCPDemoDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            new DefaultEditionCreator(_context).Create();
            new DefaultLanguagesCreator(_context).Create();
            new HostRoleAndUserCreator(_context).Create();
            new DefaultSettingsCreator(_context).Create();
            new InitialPeopleCreator(_context).Create();
            new InitialPeopleAndPhoneCreator(_context).Create();

            _context.SaveChanges();
        }
    }
}
