using System;
using System.IO;
using System.Threading.Tasks;
using Abp;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.AspNetZeroCore.Net;
using Abp.Auditing;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Runtime.Session;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Mvc;
using CCPDemo.Authorization.Users;
using CCPDemo.Authorization.Users.Profile;
using CCPDemo.Authorization.Users.Profile.Dto;
using CCPDemo.Friendships;
using CCPDemo.Storage;

namespace CCPDemo.Web.Controllers
{
    [AbpMvcAuthorize]
    [DisableAuditing]
    public class ProfileController : ProfileControllerBase
    {
        private readonly IProfileAppService _profileAppService;

        public ProfileController(
            ITempFileCacheManager tempFileCacheManager,
            IProfileAppService profileAppService) : base(tempFileCacheManager, profileAppService)
        {
            _profileAppService = profileAppService;
        }

        public async Task<FileResult> GetProfilePicture()
        {
            var output = await _profileAppService.GetProfilePicture();

            if (output.ProfilePicture.IsNullOrEmpty())
            {
                return GetDefaultProfilePictureInternal();
            }

            return File(Convert.FromBase64String(output.ProfilePicture), MimeTypeNames.ImageJpeg);
        }
        
        public virtual async Task<FileResult> GetFriendProfilePicture(long userId, int? tenantId)
        {
            var output = await _profileAppService.GetFriendProfilePicture(new GetFriendProfilePictureInput()
            {
                TenantId = tenantId,
                UserId = userId
            });

            if (output.ProfilePicture.IsNullOrEmpty())
            {
                return GetDefaultProfilePictureInternal();
            }

            return File(Convert.FromBase64String(output.ProfilePicture), MimeTypeNames.ImageJpeg);
        }
    }
}
