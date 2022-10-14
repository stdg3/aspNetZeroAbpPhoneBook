using Abp.Localization;
using CCPDemo.Dto;

namespace CCPDemo.Web.Areas.App.Models.PhoneBook
{
    public class PhoneRowInPersonListViewModel
    {
        public PhoneInPersonListDto Phone { get; set; }

        public PhoneRowInPersonListViewModel(PhoneInPersonListDto phone)
        {
            Phone = phone;
        }

        public string GetPhoneTypeAsString()
        {
            return LocalizationHelper.GetString(CCPDemoConsts.LocalizationSourceName, "PhoneType_" + Phone.Type);

            //C:\Users\avelicoglo\Desktop\internProjects\asp6Denemeler\CCPDemo\src\CCPDemo.Core\Localization\CCPDemo\CCPDemo.xml
        }
    }
}
