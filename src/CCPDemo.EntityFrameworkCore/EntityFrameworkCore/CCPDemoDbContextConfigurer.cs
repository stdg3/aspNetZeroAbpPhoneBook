using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace CCPDemo.EntityFrameworkCore
{
    public static class CCPDemoDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<CCPDemoDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<CCPDemoDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}