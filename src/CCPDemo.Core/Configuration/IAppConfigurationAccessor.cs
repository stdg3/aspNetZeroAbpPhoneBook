using Microsoft.Extensions.Configuration;

namespace CCPDemo.Configuration
{
    public interface IAppConfigurationAccessor
    {
        IConfigurationRoot Configuration { get; }
    }
}
