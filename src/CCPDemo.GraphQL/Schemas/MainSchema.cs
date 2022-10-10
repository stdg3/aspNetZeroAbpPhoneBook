using Abp.Dependency;
using GraphQL.Types;
using GraphQL.Utilities;
using CCPDemo.Queries.Container;
using System;

namespace CCPDemo.Schemas
{
    public class MainSchema : Schema, ITransientDependency
    {
        public MainSchema(IServiceProvider provider) :
            base(provider)
        {
            Query = provider.GetRequiredService<QueryContainer>();
        }
    }
}