@echo off
echo Building API Gateway...
cd api-gateway
docker build -t reliefsync/api-gateway:latest .
cd ..

echo Building Auth Service...
cd Auth-module
docker build -t reliefsync/auth-service:latest .
cd ..

echo Building Disaster Service...
cd disaster_module
docker build -t reliefsync/disaster-service:latest .
cd ..

echo Building Task Service...
cd taskAssign_Module
docker build -t reliefsync/task-service:latest .
cd ..

echo Building Volunteer Service...
cd Volunteer_Module
docker build -t reliefsync/volunteer-service:latest .
cd ..

echo All images built successfully!
pause