using System.Collections.Generic;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace CCPDemo.Web.Authentication.JwtBearer
{
    public class AsyncJwtBearerOptions : JwtBearerOptions
    {
        public readonly List<IAsyncSecurityTokenValidator> AsyncSecurityTokenValidators;
        
        private readonly CCPDemoAsyncJwtSecurityTokenHandler _defaultAsyncHandler = new CCPDemoAsyncJwtSecurityTokenHandler();

        public AsyncJwtBearerOptions()
        {
            AsyncSecurityTokenValidators = new List<IAsyncSecurityTokenValidator>() {_defaultAsyncHandler};
        }
    }

}
