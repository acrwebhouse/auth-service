# auth-service
build docker
docker build . -t acrwebdev/auth-service

docker push
docker push acrwebdev/auth-service

run docker
docker run -p 3000:3000 --env USER_BASIC_LOCATION=http://10.140.0.2:13000 --env SERVER_IP=35.201.152.0 --env SERVER_PORT=3000  --env SWAGGER_IP=35.201.152.0 --restart=always -d acrwebdev/auth-service