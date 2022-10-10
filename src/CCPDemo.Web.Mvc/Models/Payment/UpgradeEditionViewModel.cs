using System.Collections.Generic;
using CCPDemo.Editions.Dto;
using CCPDemo.MultiTenancy.Payments;

namespace CCPDemo.Web.Models.Payment
{
    public class UpgradeEditionViewModel
    {
        public EditionSelectDto Edition { get; set; }

        public PaymentPeriodType PaymentPeriodType { get; set; }

        public SubscriptionPaymentType SubscriptionPaymentType { get; set; }

        public decimal? AdditionalPrice { get; set; }

        public List<PaymentGatewayModel> PaymentGateways { get; set; }
    }
}