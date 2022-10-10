#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["src/CCPDemo.Web.Mvc/CCPDemo.Web.Mvc.csproj", "src/CCPDemo.Web.Mvc/"]
COPY ["src/CCPDemo.Web.Core/CCPDemo.Web.Core.csproj", "src/CCPDemo.Web.Core/"]
COPY ["src/CCPDemo.Application/CCPDemo.Application.csproj", "src/CCPDemo.Application/"]
COPY ["src/CCPDemo.Application.Shared/CCPDemo.Application.Shared.csproj", "src/CCPDemo.Application.Shared/"]
COPY ["src/CCPDemo.Core.Shared/CCPDemo.Core.Shared.csproj", "src/CCPDemo.Core.Shared/"]
COPY ["src/CCPDemo.Core/CCPDemo.Core.csproj", "src/CCPDemo.Core/"]
COPY ["src/CCPDemo.EntityFrameworkCore/CCPDemo.EntityFrameworkCore.csproj", "src/CCPDemo.EntityFrameworkCore/"]
COPY ["src/CCPDemo.GraphQL/CCPDemo.GraphQL.csproj", "src/CCPDemo.GraphQL/"]
RUN dotnet restore "src/CCPDemo.Web.Mvc/CCPDemo.Web.Mvc.csproj"
COPY . .
WORKDIR "/src/src/CCPDemo.Web.Mvc"
RUN dotnet build "CCPDemo.Web.Mvc.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CCPDemo.Web.Mvc.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CCPDemo.Web.Mvc.dll"]
