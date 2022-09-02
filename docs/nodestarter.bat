@echo off


start net start mongodb
c:
cd "C:\nginx-1.18.0"
start nginx
set url=http://carepactretailapplication.com:8081/
start chrome %url%
D:
cd "D:\distributor_app-Thomson_pharma\backend"
npm start 

