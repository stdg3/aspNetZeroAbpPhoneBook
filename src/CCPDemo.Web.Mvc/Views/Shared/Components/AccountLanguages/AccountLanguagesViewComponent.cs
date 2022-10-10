using System.Linq;
using System.Threading.Tasks;
using Abp.Localization;
using Microsoft.AspNetCore.Mvc;

namespace CCPDemo.Web.Views.Shared.Components.AccountLanguages
{
    public class AccountLanguagesViewComponent : CCPDemoViewComponent
    {
        private readonly ILanguageManager _languageManager;

        public AccountLanguagesViewComponent(ILanguageManager languageManager)
        {
            _languageManager = languageManager;
        }

        public Task<IViewComponentResult> InvokeAsync()
        {
            var model = new LanguageSelectionViewModel
            {
                CurrentLanguage = _languageManager.CurrentLanguage,
                Languages = _languageManager.GetActiveLanguages().ToList(),
                CurrentUrl = Request.Path
            };

            return Task.FromResult(View(model) as IViewComponentResult);
        }
    }
}
