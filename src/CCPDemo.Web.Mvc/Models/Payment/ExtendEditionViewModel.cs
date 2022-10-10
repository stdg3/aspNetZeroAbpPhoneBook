using System.Collections.Generic;
using CCPDemo.Editions.Dto;
using CCPDemo.MultiTenancy.Payments;

namespace CCPDemo.Web.Models.Payment
{
    public class ExtendEditionViewModel
    {
        public EditionSelectDto Edition { get; set; }

        public List<PaymentGatewayModel> PaymentGateways { get; set; }
    }
}