using Abp.Zero.Ldap.Authentication;
using Abp.Zero.Ldap.Configuration;
using CCPDemo.Authorization.Users;
using CCPDemo.MultiTenancy;

namespace CCPDemo.Authorization.Ldap
{
    public class AppLdapAuthenticationSource : LdapAuthenticationSource<Tenant, User>
    {
        public AppLdapAuthenticationSource(ILdapSettings settings, IAbpZeroLdapModuleConfig ldapModuleConfig)
            : base(settings, ldapModuleConfig)
        {
        }
    }
}