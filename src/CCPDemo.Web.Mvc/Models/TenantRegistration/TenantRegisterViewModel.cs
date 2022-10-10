using CCPDemo.Editions;
using CCPDemo.Editions.Dto;
using CCPDemo.MultiTenancy.Payments;
using CCPDemo.Security;
using CCPDemo.MultiTenancy.Payments.Dto;

namespace CCPDemo.Web.Models.TenantRegistration
{
    public class TenantRegisterViewModel
    {
        public PasswordComplexitySetting PasswordComplexitySetting { get; set; }

        public int? EditionId { get; set; }

        public SubscriptionStartType? SubscriptionStartType { get; set; }

        public EditionSelectDto Edition { get; set; }

        public EditionPaymentType EditionPaymentType { get; set; }
    }
}
