using Abp.Modules;
using Abp.Reflection.Extensions;
using Castle.Windsor.MsDependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using CCPDemo.Configure;
using CCPDemo.Startup;
using CCPDemo.Test.Base;

namespace CCPDemo.GraphQL.Tests
{
    [DependsOn(
        typeof(CCPDemoGraphQLModule),
        typeof(CCPDemoTestBaseModule))]
    public class CCPDemoGraphQLTestModule : AbpModule
    {
        public override void PreInitialize()
        {
            IServiceCollection services = new ServiceCollection();
            
            services.AddAndConfigureGraphQL();

            WindsorRegistrationHelper.CreateServiceProvider(IocManager.IocContainer, services);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CCPDemoGraphQLTestModule).GetAssembly());
        }
    }
}