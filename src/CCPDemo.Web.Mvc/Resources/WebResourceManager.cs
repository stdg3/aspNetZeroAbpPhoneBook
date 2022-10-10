using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Abp;
using Abp.Collections.Extensions;
using Abp.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.Hosting;

namespace CCPDemo.Web.Resources
{
    public class WebResourceManager : IWebResourceManager
    {
        private readonly IWebHostEnvironment _environment;
        private readonly List<string> _scriptUrls;
        private readonly List<string> _scriptTags;

        public WebResourceManager(IWebHostEnvironment environment)
        {
            _environment = environment;
            _scriptUrls = new List<string>();
            _scriptTags = new List<string>();
        }

        public void AddScript(string url, bool addMinifiedOnProd = true)
        {
            _scriptUrls.AddIfNotContains(NormalizeUrl(url, "js"));
        }

        public void AddScriptTag(string url, List<NameValue> attributes)
        {
            var scriptUrl = NormalizeUrl(url, "js");
            var script = $"<script src=\"{scriptUrl}\" asp-append-version=\"true\" " + attributes.Select(attr => attr.Name + "=\"" + attr.Value + "\"") + "></script>";
            _scriptTags.AddIfNotContains(script);
        }

        public IReadOnlyList<string> GetScripts()
        {
            return _scriptUrls.ToImmutableList();
        }

        public HelperResult RenderScripts()
        {
            return new HelperResult(async writer =>
            {
                foreach (var scriptUrl in _scriptUrls)
                {
                    await writer.WriteAsync($"<script src=\"{scriptUrl}\" asp-append-version=\"true\"></script>");
                }

                foreach (var scriptTag in _scriptTags)
                {
                    await writer.WriteAsync(scriptTag);
                }
            });
        }

        private string NormalizeUrl(string url, string ext)
        {
            if (_environment.IsDevelopment())
            {
                return url;
            }

            if (url.EndsWith(".min." + ext))
            {
                return url;
            }

            return url.Left(url.Length - ext.Length) + "min." + ext;
        }
    }
}
