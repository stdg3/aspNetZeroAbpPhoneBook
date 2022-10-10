using System.Threading.Tasks;
using Abp;
using Abp.Configuration;
using CCPDemo.Configuration;
using CCPDemo.Configuration.Dto;
using CCPDemo.UiCustomization;
using CCPDemo.UiCustomization.Dto;

namespace CCPDemo.Web.UiCustomization.Metronic
{
    public class Theme10UiCustomizer : UiThemeCustomizerBase, IUiCustomizer
    {
        public Theme10UiCustomizer(ISettingManager settingManager)
            : base(settingManager, AppConsts.Theme10)
        {
        }

        public async Task<UiCustomizationSettingsDto> GetUiSettings()
        {
            var settings = new UiCustomizationSettingsDto
            {
                BaseSettings = new ThemeSettingsDto
                {
                    Layout = new ThemeLayoutSettingsDto()
                    {
                        DarkMode = await GetSettingValueAsync<bool>(AppSettings.UiManagement.DarkMode)
                    },
                    Menu = new ThemeMenuSettingsDto()
                    {
                        SearchActive = await GetSettingValueAsync<bool>(AppSettings.UiManagement.SearchActive)
                    }
                }
            };

            settings.BaseSettings.Theme = ThemeName;
            settings.BaseSettings.Layout.LayoutType = "fluid";
            settings.BaseSettings.Menu.Position = "tab";
            settings.BaseSettings.Menu.AsideSkin = "dark";

            settings.BaseSettings.SubHeader.SubheaderSize = 1;
            settings.BaseSettings.SubHeader.TitleStyle = "text-dark font-weight-bold my-2 me-5";
            settings.BaseSettings.SubHeader.ContainerStyle = "subheader py-2 py-lg-4  subheader-transparent";

            settings.IsLeftMenuUsed = false;
            settings.IsTopMenuUsed = false;
            settings.IsTabMenuUsed = true;

            return settings;
        }

        public async Task UpdateUserUiManagementSettingsAsync(UserIdentifier user, ThemeSettingsDto settings)
        {
            await SettingManager.ChangeSettingForUserAsync(user, AppSettings.UiManagement.Theme, ThemeName);
            
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.DarkMode, settings.Layout.DarkMode.ToString());
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.Header.DesktopFixedHeader, settings.Header.DesktopFixedHeader.ToString());
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.Header.MobileFixedHeader, settings.Header.MobileFixedHeader.ToString());
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.SearchActive, settings.Menu.SearchActive.ToString());
        }

        public async Task UpdateTenantUiManagementSettingsAsync(int tenantId, ThemeSettingsDto settings, UserIdentifier changerUser)
        {
            await SettingManager.ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.Theme, ThemeName);

            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.DarkMode, settings.Layout.DarkMode.ToString());
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.Header.DesktopFixedHeader, settings.Header.DesktopFixedHeader.ToString());
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.Header.MobileFixedHeader, settings.Header.MobileFixedHeader.ToString());
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.SearchActive, settings.Menu.SearchActive.ToString());
            
            await ResetDarkModeSettingsAsync(changerUser);
        }

        public async Task UpdateApplicationUiManagementSettingsAsync(ThemeSettingsDto settings, UserIdentifier changerUser)
        {
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.UiManagement.Theme, ThemeName);
            
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.DarkMode, settings.Layout.DarkMode.ToString());
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.Header.DesktopFixedHeader, settings.Header.DesktopFixedHeader.ToString());
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.Header.MobileFixedHeader, settings.Header.MobileFixedHeader.ToString());
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.SearchActive, settings.Menu.SearchActive.ToString());
            
            await ResetDarkModeSettingsAsync(changerUser);
        }

        public async Task<ThemeSettingsDto> GetHostUiManagementSettings()
        {
            var theme = await SettingManager.GetSettingValueForApplicationAsync(AppSettings.UiManagement.Theme);

            return new ThemeSettingsDto
            {
                Theme = theme,
                Layout = new ThemeLayoutSettingsDto
                {
                    LayoutType = await GetSettingValueForApplicationAsync(AppSettings.UiManagement.LayoutType),
                    DarkMode = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.DarkMode)
                },
                Menu = new ThemeMenuSettingsDto()
                {
                    SearchActive = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.SearchActive)
                }
            };
        }

        public async Task<ThemeSettingsDto> GetTenantUiCustomizationSettings(int tenantId)
        {
            var theme = await SettingManager.GetSettingValueForTenantAsync(AppSettings.UiManagement.Theme, tenantId);

            return new ThemeSettingsDto
            {
                Theme = theme,
                Layout = new ThemeLayoutSettingsDto
                {
                    LayoutType = await GetSettingValueForTenantAsync(AppSettings.UiManagement.LayoutType, tenantId),
                    DarkMode = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.DarkMode, tenantId)
                },
                Menu = new ThemeMenuSettingsDto
                {
                    SearchActive = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.SearchActive, tenantId)
                }
            };
        }
    }
}
