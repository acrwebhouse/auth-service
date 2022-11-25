# auth-service

build docker
docker build . -t acrwebdev/auth-service:0.0.4

docker push
docker push acrwebdev/auth-service:0.0.4

docker pull
docker pull acrwebdev/auth-service:0.0.4

docker pull
docker pull acrwebdev/auth-service:latest

run docker
docker run -p 3000:3000 --env USER_BASIC_LOCATION=http://10.140.0.2:13000 --env SMTP_BASIC_LOCATION=http://10.140.0.2:16000 --env EMPLOYEES_BASIC_LOCATION=http://10.140.0.2:21000 --env SERVER_IP=34.80.78.75 --env WEB_LOCATION=https://matchrenthouse.com --env SERVER_PORT=3000 --env SWAGGER_IP=34.80.78.75 --restart=always --name=auth-service -d acrwebdev/auth-service:0.0.4
