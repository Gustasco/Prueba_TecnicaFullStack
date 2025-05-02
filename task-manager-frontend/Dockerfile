# Etapa de build
FROM node:18-buster AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm cache clean --force && npm install

COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar build de Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
