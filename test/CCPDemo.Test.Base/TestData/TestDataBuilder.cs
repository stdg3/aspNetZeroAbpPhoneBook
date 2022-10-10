using CCPDemo.EntityFrameworkCore;

namespace CCPDemo.Test.Base.TestData
{
    public class TestDataBuilder
    {
        private readonly CCPDemoDbContext _context;
        private readonly int _tenantId;

        public TestDataBuilder(CCPDemoDbContext context, int tenantId)
        {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create()
        {
            new TestOrganizationUnitsBuilder(_context, _tenantId).Create();
            new TestSubscriptionPaymentBuilder(_context, _tenantId).Create();
            new TestEditionsBuilder(_context).Create();

            _context.SaveChanges();
        }
    }
}
