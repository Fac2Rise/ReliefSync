@echo off
echo Building Auth Module...
cd Auth-module
call mvn clean package
cd ..

echo Building Volunteer Module...
cd Volunteer_Module
call mvn clean package
cd ..

echo Building Disaster Module...
cd disaster_module
call mvn clean package
cd ..

echo Building Task Module...
cd taskAssign_Module
call mvn clean package
cd ..

echo Building API Gateway...
cd api-gateway
call mvn clean package
cd ..

echo All modules built successfully!
pause