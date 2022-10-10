# COMMON PATHS

$buildFolder = (Get-Item -Path "./" -Verbose).FullName
$slnFolder = Join-Path $buildFolder "../"
$outputFolder = Join-Path $buildFolder "outputs"
$webHostFolder = Join-Path $slnFolder "src/CCPDemo.Web.Host"
$webPublicFolder = Join-Path $slnFolder "src/CCPDemo.Web.Public"
$ngFolder = Join-Path $buildFolder "../../angular"

## CLEAR ######################################################################

Remove-Item $outputFolder -Force -Recurse -ErrorAction Ignore
New-Item -Path $outputFolder -ItemType Directory

## RESTORE NUGET PACKAGES #####################################################

Set-Location $slnFolder
dotnet restore

## PUBLISH WEB HOST PROJECT ###################################################

Set-Location $webHostFolder
dotnet publish --output (Join-Path $outputFolder "Host") --configuration Release
Copy-Item ("Dockerfile.original") (Join-Path $outputFolder "Host")

## COPY YML AND PFX FILES HOST ##############################################
Set-Location $outputFolder
Copy-Item ("../host/*.yml") (Join-Path $outputFolder "Host")

## PUBLISH WEB PUBLIC PROJECT ###################################################

Set-Location $webPublicFolder
yarn
yarn run build
dotnet publish --output (Join-Path $outputFolder "Public") --configuration Release
Copy-Item ("Dockerfile.original") (Join-Path $outputFolder "Public")

## COPY YML AND PFX FILES PUBLIC ##############################################
Set-Location $outputFolder
Copy-Item ("../public/*.yml") (Join-Path $outputFolder "Public")

## PUBLISH ANGULAR UI PROJECT #################################################

Set-Location $ngFolder
yarn
ng build --prod
Copy-Item (Join-Path $ngFolder "dist") (Join-Path $outputFolder "ng/") -Recurse
New-Item -ItemType directory -Path (Join-Path $outputFolder "ng" "nginx.conf")
Copy-Item (Join-Path $ngFolder "Dockerfile") (Join-Path $outputFolder "ng")

## COPY YML AND PFX FILES PUBLIC ##############################################
Set-Location $outputFolder
Copy-Item ("../ng/*.*") (Join-Path $outputFolder "ng")

## CREATE DOCKER IMAGES #######################################################

# Mvc
Set-Location (Join-Path $outputFolder "Host")
Remove-Item ("Dockerfile")
Rename-Item -Path "Dockerfile.original" -NewName "Dockerfile"
dotnet dev-certs https -v -ep aspnetzero-devcert-host.pfx -p 2825e4d9-5cef-4373-bed3-d7ebf59de216

docker rmi mycompanynameabpzerotemplatewebhost -f
docker compose -f docker-compose.yml build

# Public
# Public
Set-Location (Join-Path $outputFolder "Public")
Remove-Item ("Dockerfile")
Rename-Item -Path "Dockerfile.original" -NewName "Dockerfile"
dotnet dev-certs https -v -ep aspnetzero-devcert-public.pfx -p b7ca126d-5085-47a0-8ac3-1b5971bd65a1

docker rmi mycompanynameabpzerotemplatewebpublic -f
docker compose -f docker-compose.yml build

# Angular UI
Set-Location (Join-Path $outputFolder "ng")

docker rmi mycompanynameabpzerotemplatewebangular -f
docker compose -f docker-compose.yml build

## FINALIZE ###################################################################

Set-Location $outputFolder