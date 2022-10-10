using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Hosting;

namespace CCPDemo.Web.TagHelpers
{
    [HtmlTargetElement("script", Attributes = AbpSrcAttributeName)]
    public class CCPDemoScriptSrcTagHelper : TagHelper
    {
        private const string AbpSrcAttributeName = "abp-src";

        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public override int Order => -1000 - 1;

        public CCPDemoScriptSrcTagHelper(IWebHostEnvironment hostingEnvironment,
            IHttpContextAccessor httpContextAccessor)
        {
            _hostingEnvironment = hostingEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            if (output.Attributes["abp-ignore-src-modification"] != null &&
                output.Attributes["abp-ignore-src-modification"].Value.ToString() == "true")
            {
                base.Process(context, output);
                return;
            }

            if (output.Attributes[AbpSrcAttributeName].Value.ToString().StartsWith("~"))
            {
                base.Process(context, output);
                return;
            }

            if (output.Attributes[AbpSrcAttributeName].Value is HtmlString ||
                output.Attributes[AbpSrcAttributeName].Value is string)
            {
                var href = output.Attributes[AbpSrcAttributeName].Value.ToString();
                if (href.StartsWith("~"))
                {
                    return;
                }

                var basePath = _httpContextAccessor.HttpContext.Request.PathBase.HasValue
                    ? _httpContextAccessor.HttpContext.Request.PathBase.Value
                    : string.Empty;

                if (!(href.IndexOf(".min.js", StringComparison.InvariantCultureIgnoreCase) >= 0) &&
                    href.IndexOf(".js", StringComparison.InvariantCultureIgnoreCase) >= 0)
                {
                    href = href.Insert(href.LastIndexOf(".js", StringComparison.InvariantCultureIgnoreCase),
                        ".min");
                }

                output.Attributes.Add(new TagHelperAttribute("src", basePath + href));

                if (_hostingEnvironment.IsProduction())
                {
                    output.Attributes.Remove(output.Attributes[AbpSrcAttributeName]);
                }
            }

            base.Process(context, output);
        }
    }
}
