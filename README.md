# auth-service

build docker
docker build . -t acrwebdev/auth-service

docker push
docker push acrwebdev/auth-service

run docker
docker run -p 3000:3000 --env USER_BASIC_LOCATION=http://10.140.0.2:13000 --env SERVER_IP=34.81.209.11 --env SERVER_PORT=3000 --env SWAGGER_IP=34.81.209.11 --restart=always --name=auth-service -d acrwebdev/auth-service
