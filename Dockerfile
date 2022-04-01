FROM nginx:latest
WORKDIR /dist
# copy 编译好的ngrok 程序 
COPY ./chengjian /dist
# copy nginx 配置
COPY ./default.conf /etc/nginx/conf.d/default.conf
# http
EXPOSE 80
# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
#ENTRYPOINT nginx