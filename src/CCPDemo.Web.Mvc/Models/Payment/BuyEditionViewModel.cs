using System.Collections.Generic;
using CCPDemo.Editions;
using CCPDemo.Editions.Dto;
using CCPDemo.MultiTenancy.Payments;
using CCPDemo.MultiTenancy.Payments.Dto;

namespace CCPDemo.Web.Models.Payment
{
    public class BuyEditionViewModel
    {
        public SubscriptionStartType? SubscriptionStartType { get; set; }

        public EditionSelectDto Edition { get; set; }

        public decimal? AdditionalPrice { get; set; }

        public EditionPaymentType EditionPaymentType { get; set; }

        public List<PaymentGatewayModel> PaymentGateways { get; set; }
    }
}
