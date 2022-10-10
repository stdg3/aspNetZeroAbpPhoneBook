using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using CCPDemo.MultiTenancy.Accounting.Dto;

namespace CCPDemo.MultiTenancy.Accounting
{
    public interface IInvoiceAppService
    {
        Task<InvoiceDto> GetInvoiceInfo(EntityDto<long> input);

        Task CreateInvoice(CreateInvoiceDto input);
    }
}
