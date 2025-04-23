# 使用 Node.js 构建前端
FROM node:18.20

# 设置工作目录
WORKDIR /app

# 配置npm使用淘宝镜像
RUN npm config set registry https://registry.npmmirror.com

# 复制 package.json 和 package-lock.json
COPY package.json package-lock.json ./

RUN npm install

COPY . .
RUN npm run build

EXPOSE 3200
CMD ["npm", "start"]