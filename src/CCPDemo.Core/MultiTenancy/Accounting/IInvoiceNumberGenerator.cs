using System.Threading.Tasks;
using Abp.Dependency;

namespace CCPDemo.MultiTenancy.Accounting
{
    public interface IInvoiceNumberGenerator : ITransientDependency
    {
        Task<string> GetNewInvoiceNumber();
    }
}