using System.Collections.Generic;
using Abp;
using Microsoft.AspNetCore.Mvc.Razor;

namespace CCPDemo.Web.Resources
{
    public interface IWebResourceManager
    {
        void AddScript(string url, bool addMinifiedOnProd = true);

        void AddScriptTag(string url, List<NameValue> attributes);

        IReadOnlyList<string> GetScripts();

        HelperResult RenderScripts();
    }
}