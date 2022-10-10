using System.Collections.Concurrent;
using System.Globalization;
using System.IO;
using Abp.Dependency;
using Abp.Extensions;
using Microsoft.AspNetCore.Hosting;

namespace CCPDemo.Web.Resources
{
    public class ScriptPaths : ISingletonDependency
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

        private readonly ConcurrentDictionary<string, string> _scriptPaths;

        public ScriptPaths(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
            _scriptPaths = new ConcurrentDictionary<string, string>();
        }

        #region jQuery Validation

        public string JQuery_Validation_Localization
        {
            get
            {
                return _scriptPaths.GetOrAdd("jquery-validation#" + CultureInfo.CurrentUICulture.Name, k =>
                {
                    var path = GetLocalizationFileForjQueryValidationOrNull(CultureInfo.CurrentUICulture.Name.ToLower().Replace("-", "_"))
                           ?? GetLocalizationFileForjQueryValidationOrNull(CultureInfo.CurrentUICulture.Name.Left(2).ToLower())
                           ?? @"Common/Scripts/_empty.js";

                    return "/" + path;
                });
            }
        }

        private string GetLocalizationFileForjQueryValidationOrNull(string cultureCode)
        {
            try
            {
                var relativeFilePath = @"lib/jquery-validation/dist/localization/messages_" + cultureCode + ".js";
                var physicalFilePath = GetPhysicalPath(relativeFilePath);
                if (File.Exists(physicalFilePath))
                {
                    return relativeFilePath;
                }
            }
            catch { }

            return null;
        }

        #endregion

        #region jQuery Timeago

        public string JQuery_Timeago_Localization
        {
            get
            {
                return _scriptPaths.GetOrAdd("jquery-timeago#" + CultureInfo.CurrentUICulture.Name, k =>
                {
                    var path = GetLocalizationFileForjQueryTimeagoOrNull(CultureInfo.CurrentUICulture.Name.ToLower().Replace("-", "_"))
                       ?? GetLocalizationFileForjQueryTimeagoOrNull(CultureInfo.CurrentUICulture.Name.Left(2).ToLower())
                       ?? "lib/timeago/locales/jquery.timeago.en.js";
                    return "/" + path;
                });
            }
        }

        private string GetLocalizationFileForjQueryTimeagoOrNull(string cultureCode)
        {
            try
            {
                var relativeFilePath = "lib/timeago/locales/jquery.timeago." + cultureCode + ".js";
                var physicalFilePath = GetPhysicalPath(relativeFilePath);
                if (File.Exists(physicalFilePath))
                {
                    return relativeFilePath;
                }
            }
            catch { }

            return null;
        }

        #endregion

        #region Select2

        public string Select2_Localization
        {
            get
            {
                return _scriptPaths.GetOrAdd("select2#" + CultureInfo.CurrentUICulture.Name, k =>
                {
                    var path = GetLocalizationFileForSelect2(CultureInfo.CurrentUICulture.Name.ToLower())
                               ?? GetLocalizationFileForSelect2(CultureInfo.CurrentUICulture.Name.Left(2).ToLower())
                               ?? "lib/select2/dist/js/i18n/en.js";
                    return "/" + path;
                });
            }
        }

        private static string GetLocalizationFileForSelect2(string cultureCode)
        {
            try
            {
                foreach (var localizationFile in Select2LocalizationFileCultureCodeList)
                {
                    if (localizationFile.StartsWith(cultureCode))
                    {
                        return "lib/select2/dist/js/i18n/" + localizationFile + ".js";
                    }
                }
            }
            catch { }

            return null;
        }

        private static readonly string[] Select2LocalizationFileCultureCodeList =
        {
            "ar",
            "az",
            "bg",
            "ca",
            "cs",
            "da",
            "de",
            "el",
            "en",
            "es",
            "et",
            "eu",
            "fa",
            "fi",
            "fr",
            "gl",
            "he",
            "hi",
            "hr",
            "hu",
            "id",
            "is",
            "it",
            "ja",
            "km",
            "ko",
            "lt",
            "lv",
            "mk",
            "ms",
            "nb",
            "nl",
            "pl",
            "pt",
            "pt-BR",
            "ro",
            "ru",
            "sk",
            "sr",
            "sr-Cyrl",
            "sv",
            "th",
            "tr",
            "uk",
            "vi",
            "zh-CN",
            "zh-TW"
        };

        #endregion

        #region Helper methods

        private string GetPhysicalPath(string relativePath)
        {
            return Path.Combine(_hostingEnvironment.WebRootPath, relativePath);
        }

        #endregion
    }
}