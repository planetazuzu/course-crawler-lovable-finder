# Usar una imagen base de Node.js
FROM node:18-alpine

# Crear un directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto al contenedor
COPY . .

# Instalar las dependencias
RUN npm install

# Exponer el puerto que utiliza Vite (por defecto 5173)
EXPOSE 5173

# Comando para iniciar el servidor de desarrollo
CMD ["npm", "run", "dev"]