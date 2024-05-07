@echo off
cd /d "C:\Users\Alex\Desktop\PI-CI028-Tamarindo\" || exit
echo Directorio actual: %cd%

echo *************************************************************************************************
echo Instalando Global Yarn [npm install --global yarn]
call npm install --global yarn || pause

echo *************************************************************************************************
echo Instalando CookieParser [npm install cookieparser]
call npm install cookieparser || pause

echo *************************************************************************************************
echo Instalando React Scripts [npm install react-scripts]
call npm install react-scripts || pause

echo *************************************************************************************************
echo Cambiando al directorio de client [cd client]
cd client || exit

echo *************************************************************************************************
echo Instalando React, Axios, React-Router-DOM y SCSS [npm install react axios react-router-dom scss]
call npm install react axios react-router-dom scss || pause

echo *************************************************************************************************
echo Instalando react-multi-date-picker [yarn add react-multi-date-picker]
call yarn add react-multi-date-picker || pause

echo *************************************************************************************************
echo Instalando Nodemon [npm install nodemon --save-dev]
call npm install nodemon --save-dev || pause

echo *************************************************************************************************
echo Regresando al directorio raiz [cd ..]
cd ..

echo *************************************************************************************************
echo Cambiando al directorio API [cd api]
cd api || exit

echo *************************************************************************************************
echo Instalando Express y MySQL [npm install express mysql]
call npm install express mysql || pause

echo *************************************************************************************************
echo Instalando Nodemon [npm install nodemon --save-dev]
call npm install nodemon --save-dev || pause

echo *************************************************************************************************
echo Regresando al directorio raiz [cd ..]
cd ..

echo *************************************************************************************************
echo Instalacion completada.
pause


