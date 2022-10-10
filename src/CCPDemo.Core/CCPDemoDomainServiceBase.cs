using Abp.Domain.Services;

namespace CCPDemo
{
    public abstract class CCPDemoDomainServiceBase : DomainService
    {
        /* Add your common members for all your domain services. */

        protected CCPDemoDomainServiceBase()
        {
            LocalizationSourceName = CCPDemoConsts.LocalizationSourceName;
        }
    }
}
