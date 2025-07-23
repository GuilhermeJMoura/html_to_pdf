# Imagem base com Node
FROM node:20-slim

# Instala dependências para o Chrome headless
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libgbm-dev \
    libnss3 \
    libxss1 \
    libappindicator3-1 \
    libu2f-udev \
    libvulkan1 \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Cria diretório da aplicação
WORKDIR /app

# Copia arquivos
COPY package.json .
COPY server.js .

# Instala dependências
RUN npm install

# Exposição da porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
