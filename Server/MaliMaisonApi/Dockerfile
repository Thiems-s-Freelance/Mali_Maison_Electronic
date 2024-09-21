# Étape de construction
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . ./
RUN dotnet publish -c Release -o out

# Étape finale
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out ./
COPY --from=build /app/appsettings.json ./
RUN mkdir -p /app/wwwroot/pdf

# Définir le point d'entrée de l'application
ENTRYPOINT ["dotnet", "MaliMaisonApi.dll"]