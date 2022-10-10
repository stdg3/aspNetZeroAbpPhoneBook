#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["src/CCPDemo.Migrator/CCPDemo.Migrator.csproj", "src/CCPDemo.Migrator/"]
COPY ["src/CCPDemo.EntityFrameworkCore/CCPDemo.EntityFrameworkCore.csproj", "src/CCPDemo.EntityFrameworkCore/"]
COPY ["src/CCPDemo.Core/CCPDemo.Core.csproj", "src/CCPDemo.Core/"]
COPY ["src/CCPDemo.Core.Shared/CCPDemo.Core.Shared.csproj", "src/CCPDemo.Core.Shared/"]
RUN dotnet restore "src/CCPDemo.Migrator/CCPDemo.Migrator.csproj"
COPY . .
WORKDIR "/src/src/CCPDemo.Migrator"
RUN dotnet build "CCPDemo.Migrator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CCPDemo.Migrator.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CCPDemo.Migrator.dll", "-s"]
