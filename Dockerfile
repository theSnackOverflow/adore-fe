# 1. Node.js 이미지를 사용하여 빌드
FROM node:20.18.0 AS build
WORKDIR /app

# package.json 파일을 복사하여 의존성 설치
COPY package.json . 
RUN npm install

# 나머지 파일을 복사하고 빌드 실행
COPY src/ ./src
RUN npm run build

# 2. Nginx 이미지를 사용하여 정적 파일 제공
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 빌드된 정적 파일을 Nginx 컨테이너로 복사
COPY --from=build /app/dist .  
EXPOSE 5173

# 3. Nginx 설정 수정 (Optional: 기본 설정 유지)
CMD ["nginx", "-g", "daemon off;"]
