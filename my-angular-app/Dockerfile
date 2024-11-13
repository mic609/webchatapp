# Użyj oficjalnego obrazu Node.js 20.18 jako bazowego
FROM node:20.18 AS build

# Ustaw katalog roboczy
WORKDIR /my-angular-app

# Skopiuj plik package.json oraz package-lock.json (jeśli istnieje)
COPY package*.json ./

# Zainstaluj zależności
RUN npm ci
RUN npm install -g @angular/cli

# Skopiuj resztę plików aplikacji
COPY . .

# Zbuduj aplikację Angular
RUN npm run build --configuration=production

# Użyj oficjalnego obrazu serwera Nginx do serwowania aplikacji
FROM nginx:latest

# Usuń domyślną stronę index
RUN rm -rf /usr/share/nginx/html/*

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Skopiuj zbudowaną aplikację Angular do katalogu Nginx
COPY --from=build /my-angular-app/dist/my-angular-app/browser /usr/share/nginx/html

# Otwórz port, na którym będzie działać Nginx
EXPOSE 80

# Uruchom Nginx w tle
CMD ["nginx", "-g", "daemon off;"]