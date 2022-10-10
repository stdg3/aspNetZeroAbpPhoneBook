using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Abp.Extensions;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Razor.TagHelpers;
using CCPDemo.UiCustomization;
using CCPDemo.UiCustomization.Dto;

namespace CCPDemo.Web.TagHelpers
{
    public class BreadcrumbItem
    {
        public string Url { get; set; }
        public string Text { get; set; }

        public BreadcrumbItem(string url, string text)
        {
            Url = url;
            Text = text;
        }

        public BreadcrumbItem(string text)
        {
            Text = text;
        }
    }

    [HtmlTargetElement("abp-page-subheader")]
    public class CCPDemoPageSubheaderTagHelper : TagHelper
    {
        private readonly IUiThemeCustomizerFactory _uiThemeCustomizerFactory;

        public string Description { get; set; }

        public string Title { get; set; }

        public List<BreadcrumbItem> Breadcrumbs { get; set; }

        public CCPDemoPageSubheaderTagHelper(IUiThemeCustomizerFactory uiThemeCustomizerFactory)
        {
            _uiThemeCustomizerFactory = uiThemeCustomizerFactory;
        }

        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            var currentTheme = await _uiThemeCustomizerFactory.GetCurrentUiCustomizer();
            var settings = await currentTheme.GetUiSettings();

            var tagContent = await output.GetChildContentAsync();

            var template = GetTemplate(settings, tagContent.GetContent());
            output.Content.AppendHtml(template);
        }

        private string GetTemplate(UiCustomizationSettingsDto settings, string content)
        {
            var subContainerStyle = GetContainerStyle(settings);

            return $@"<div class='{settings.BaseSettings.SubHeader.ContainerStyle} toolbar' id='kt_toolbar'>
                        <div id='kt_toolbar_container' class='{subContainerStyle} container-fluid d-flex flex-stack {settings.BaseSettings.SubHeader.SubContainerStyle}'>
                            <!--begin::Info-->
                            {GetInfoArea(settings)}
                            <!--end::Info-->

                            <!--begin::Toolbar-->
                            <div class='d-flex align-items-center'>
                               {content}
                            </div>
                            <!--end::Toolbar-->
                        </div>
                    </div>
                    ";
        }

        private string GetContainerStyle(UiCustomizationSettingsDto settings)
        {
            if (settings.BaseSettings.Layout.LayoutType == "fluid")
            {
                return "container-fluid";
            }

            return settings.BaseSettings.Layout.LayoutType == "fluid-xxl" ? "container-xxl" : "container";
        }

        private string GetInfoArea(UiCustomizationSettingsDto settings)
        {
            return $@"<div class='d-flex align-items-center flex-wrap me-1'>
                        <!--begin::Page Title-->
                        <h{settings.BaseSettings.SubHeader.SubheaderSize} class='{settings.BaseSettings.SubHeader.TitleStyle}'>
                            {Title}
                        </h{settings.BaseSettings.SubHeader.SubheaderSize}>
                        <!--end::Page Title-->
                        {GetDescription()}
                        {GetBreadcrumbs()}
                    </div>";
        }

        private string GetDescription()
        {
            if (Description.IsNullOrWhiteSpace())
            {
                return "";
            }

            return $@"<div class='subheader-separator subheader-separator-ver mt-2 mb-2 me-4 bg-gray-200'></div>
                       <span class='text-muted font-weight-bold me-4'>{Description}</span>";
        }

        private string GetBreadcrumbs()
        {
            if (Breadcrumbs == null || Breadcrumbs.Count == 0)
            {
                return "";
            }

            StringBuilder sb = new StringBuilder();
            sb.Append($@"<!--begin::Breadcrumb-->
		                <ul class='breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm'>");
            foreach (var breadcrumbItem in Breadcrumbs)
            {
                sb.Append("<li class='breadcrumb-item'>");
                if (breadcrumbItem.Url.IsNullOrWhiteSpace())
                {
                    sb.Append($@"<span class='text-muted'>
					                {breadcrumbItem.Text}	                        	
				                </span>");
                }
                else
                {
                    sb.Append($@"<a href='{breadcrumbItem.Url}' class='text-muted'>
					                {breadcrumbItem.Text}	                        	
				                </a>");
                }

                sb.Append("</li>");
            }

            sb.Append("</ul>" +
                      "<!--end::Breadcrumb-->");

            return sb.ToString();
        }
    }
}
