using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.AspNetZeroCore.Net;
using Abp.Authorization;
using Abp.Extensions;
using Abp.IO.Extensions;
using Abp.MimeTypes;
using Abp.Runtime.Session;
using Abp.UI;
using Abp.Web.Models;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CCPDemo.Authorization;
using CCPDemo.Authorization.Users.Profile.Dto;
using CCPDemo.MultiTenancy;
using CCPDemo.Storage;
using CCPDemo.Web.Helpers;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Gif;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;

namespace CCPDemo.Web.Controllers
{
    [AbpMvcAuthorize]
    public class TenantCustomizationController : CCPDemoControllerBase
    {
        private readonly TenantManager _tenantManager;
        private readonly IBinaryObjectManager _binaryObjectManager;
        private readonly IMimeTypeMap _mimeTypeMap;

        public TenantCustomizationController(
            TenantManager tenantManager,
            IBinaryObjectManager binaryObjectManager,
            IMimeTypeMap mimeTypeMap)
        {
            _tenantManager = tenantManager;
            _binaryObjectManager = binaryObjectManager;
            _mimeTypeMap = mimeTypeMap;
        }

        [HttpPost]
        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Tenant_Settings)]
        public async Task<JsonResult> UploadLogo()
        {
            try
            {
                var logoFile = Request.Form.Files.First();

                //Check input
                if (logoFile == null)
                {
                    throw new UserFriendlyException(L("File_Empty_Error"));
                }

                if (logoFile.Length > 30720) //30KB
                {
                    throw new UserFriendlyException(L("File_SizeLimit_Error"));
                }

                byte[] fileBytes;
                using (var stream = logoFile.OpenReadStream())
                {
                    fileBytes = stream.GetAllBytes();
                }
                
                using (Image.Load(fileBytes, out IImageFormat format))
                {
                    if (!format.IsIn(JpegFormat.Instance, PngFormat.Instance, GifFormat.Instance))
                    {
                        throw new UserFriendlyException(L("File_Invalid_Type_Error"));
                    }
                }

                var logoObject = new BinaryObject(AbpSession.GetTenantId(), fileBytes, $"Logo {DateTime.UtcNow}");
                await _binaryObjectManager.SaveAsync(logoObject);

                var tenant = await _tenantManager.GetByIdAsync(AbpSession.GetTenantId());
                tenant.LogoId = logoObject.Id;
                tenant.LogoFileType = logoFile.ContentType;

                return Json(new AjaxResponse(new
                    { id = logoObject.Id, TenantId = tenant.Id, fileType = tenant.LogoFileType }));
            }
            catch (UserFriendlyException ex)
            {
                return Json(new AjaxResponse(new ErrorInfo(ex.Message)));
            }
        }

        [HttpPost]
        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Tenant_Settings)]
        public async Task<JsonResult> UploadCustomCss()
        {
            try
            {
                var cssFile = Request.Form.Files.First();

                //Check input
                if (cssFile == null)
                {
                    throw new UserFriendlyException(L("File_Empty_Error"));
                }

                if (cssFile.Length > 1048576) //1MB
                {
                    throw new UserFriendlyException(L("File_SizeLimit_Error"));
                }

                byte[] fileBytes;
                using (var stream = cssFile.OpenReadStream())
                {
                    fileBytes = stream.GetAllBytes();
                }

                var cssFileObject = new BinaryObject(AbpSession.GetTenantId(), fileBytes,
                    $"Custom Css {cssFile.FileName} {DateTime.UtcNow}");
                await _binaryObjectManager.SaveAsync(cssFileObject);

                var tenant = await _tenantManager.GetByIdAsync(AbpSession.GetTenantId());
                tenant.CustomCssId = cssFileObject.Id;

                return Json(new AjaxResponse(new { id = cssFileObject.Id, TenantId = tenant.Id }));
            }
            catch (UserFriendlyException ex)
            {
                return Json(new AjaxResponse(new ErrorInfo(ex.Message)));
            }
        }

        [AllowAnonymous]
        public async Task<ActionResult> GetLogo(int? tenantId)
        {
            if (tenantId == null)
            {
                tenantId = AbpSession.TenantId;
            }

            if (!tenantId.HasValue)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }

            var tenant = await _tenantManager.FindByIdAsync(tenantId.Value);
            if (tenant == null || !tenant.HasLogo())
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }

            using (CurrentUnitOfWork.SetTenantId(tenantId.Value))
            {
                var logoObject = await _binaryObjectManager.GetOrNullAsync(tenant.LogoId.Value);
                if (logoObject == null)
                {
                    return StatusCode((int)HttpStatusCode.NotFound);
                }

                return File(logoObject.Bytes, tenant.LogoFileType);
            }
        }

        [AllowAnonymous]
        [Route("/TenantCustomization/GetTenantLogo/{skin}/{tenantId?}/{extension?}")]
        [HttpGet]
        public Task<ActionResult> GetTenantLogoWithCustomRoute(string skin, int? tenantId = null,
            string extension = "svg")
        {
            return GetTenantLogo(skin, tenantId, extension);
        }

        [AllowAnonymous]
        public async Task<ActionResult> GetTenantLogo(string skin, int? tenantId, string extension = "svg")
        {
            var mimeType = _mimeTypeMap.GetMimeType("." + extension);
            var defaultLogo = "/Common/Images/app-logo-on-" + skin + "." + extension;

            if (tenantId == null)
            {
                return File(defaultLogo, mimeType);
            }

            var tenant = await _tenantManager.FindByIdAsync(tenantId.Value);
            if (tenant == null || !tenant.HasLogo())
            {
                return File(defaultLogo, mimeType);
            }

            using (CurrentUnitOfWork.SetTenantId(tenantId.Value))
            {
                var logoObject = await _binaryObjectManager.GetOrNullAsync(tenant.LogoId.Value);
                if (logoObject == null)
                {
                    return File(defaultLogo, mimeType);
                }

                return File(logoObject.Bytes, tenant.LogoFileType);
            }
        }

        [AllowAnonymous]
        public async Task<ActionResult> GetCustomCss(int? tenantId)
        {
            if (tenantId == null)
            {
                tenantId = AbpSession.TenantId;
            }

            if (!tenantId.HasValue)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }

            var tenant = await _tenantManager.FindByIdAsync(tenantId.Value);
            if (tenant == null || !tenant.CustomCssId.HasValue)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }

            using (CurrentUnitOfWork.SetTenantId(tenantId.Value))
            {
                var cssFileObject = await _binaryObjectManager.GetOrNullAsync(tenant.CustomCssId.Value);
                if (cssFileObject == null)
                {
                    return StatusCode((int)HttpStatusCode.NotFound);
                }

                return File(cssFileObject.Bytes, MimeTypeNames.TextCss);
            }
        }
    }
}
