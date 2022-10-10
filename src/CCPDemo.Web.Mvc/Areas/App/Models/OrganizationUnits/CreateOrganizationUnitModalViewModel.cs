namespace CCPDemo.Web.Areas.App.Models.OrganizationUnits
{
    public class CreateOrganizationUnitModalViewModel
    {
        public long? ParentId { get; set; }
        
        public CreateOrganizationUnitModalViewModel(long? parentId)
        {
            ParentId = parentId;
        }
    }
}