using Abp;

namespace CCPDemo
{
    /// <summary>
    /// This class can be used as a base class for services in this application.
    /// It has some useful objects property-injected and has some basic methods most of services may need to.
    /// It's suitable for non domain nor application service classes.
    /// For domain services inherit <see cref="CCPDemoDomainServiceBase"/>.
    /// For application services inherit CCPDemoAppServiceBase.
    /// </summary>
    public abstract class CCPDemoServiceBase : AbpServiceBase
    {
        protected CCPDemoServiceBase()
        {
            LocalizationSourceName = CCPDemoConsts.LocalizationSourceName;
        }
    }
}