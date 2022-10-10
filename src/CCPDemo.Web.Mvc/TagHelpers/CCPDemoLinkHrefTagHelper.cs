using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Hosting;

namespace CCPDemo.Web.TagHelpers
{
    [HtmlTargetElement("link", Attributes = AbpHrefAttributeName)]
    public class CCPDemoLinkHrefTagHelper : TagHelper
    {
        private const string AbpHrefAttributeName = "abp-href";

        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public override int Order => -1000 - 1;

        public CCPDemoLinkHrefTagHelper(
            IWebHostEnvironment hostingEnvironment, 
            IHttpContextAccessor httpContextAccessor)
        {
            _hostingEnvironment = hostingEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            if (output.Attributes["abp-ignore-href-modification"] != null && output.Attributes["abp-ignore-href-modification"].Value.ToString() == "true")
            {
                base.Process(context, output);
                return;
            }

            if (output.Attributes[AbpHrefAttributeName].Value is HtmlString ||
                output.Attributes[AbpHrefAttributeName].Value is string)
            {
                var href = output.Attributes[AbpHrefAttributeName].Value.ToString();
                if (href.StartsWith("~"))
                {
                    base.Process(context, output);
                    return;
                }

                var basePath = _httpContextAccessor.HttpContext.Request.PathBase.HasValue
                    ? _httpContextAccessor.HttpContext.Request.PathBase.Value
                    : string.Empty;

                if (!(href.IndexOf(".min.css", StringComparison.InvariantCultureIgnoreCase) >= 0) && href.IndexOf(".css", StringComparison.InvariantCultureIgnoreCase) >= 0)
                {
                    href = href.Insert(href.LastIndexOf(".css", StringComparison.InvariantCultureIgnoreCase),
                        ".min");
                }

                output.Attributes.Add(new TagHelperAttribute("href", basePath + href));

                if (_hostingEnvironment.IsProduction())
                {
                    output.Attributes.Remove(output.Attributes[AbpHrefAttributeName]);
                }
            }

            base.Process(context, output);
        }
    }
}