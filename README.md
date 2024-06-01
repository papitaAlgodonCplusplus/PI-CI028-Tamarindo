# Codigo Fuente para el sitio web de Tamarindo

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Como Ejecutar (Local)](#como-ejecutar-local)
- [Contacto](#contacto)
- [Referencias](#referencias)

## Descripción General

El sistema por desarrollar será un sitio web para un hotel que permitirá a los usuarios realizar
reservaciones, consultar disponibilidad de habitaciones, gestionar pagos, y acceder a información
sobre servicios y comodidades ofrecidas por el hotel

## Como Ejecutar (Local)

* Clonar: https://github.com/papitaAlgodonCplusplus/PI-CI028-Tamarindo

* Instalar la aplicación:
- Microsoft Visual C++ redistributable (Si no lo tiene)
- MySQL Installer (Puede instalar MySQL Workbench en conjunto) (https://www.youtube.com/watch?v=u96rVINbAUI&ab_channel=WebDevSimplified)
- NodeJS

* Ejecutar como administrador el documento setup.bat (Importante: Antes editar el archivo y poner la dirección actual donde está localizado la carpeta, ej:
"C:\Users\Usuario\Documents\Github\PI-CI028-Tamarindo")

* Abrir mysql workbench

* Crear una nueva conexión, ponerle cualquier connection name y dejar todo por defecto (debería de decir 127.0.0.1, port 3306)

* Abrir esa conexión usando la contraseña creada en la instalación

* Ir a la carpeta del proyecto clonado, abrir el archivo “query hotel creation” y copiar todo el contenido.

* Pegar el contenido en un nuevo query y ejecutar todo (CTRL + Shift + Enter)

* Crear un nuevo query y ejecutar:
- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ’contraseña’;

* Abrir una terminal, luego ir a la ubicación de la carpeta del proyecto y poner:
- cd api
- yarn start

* En otra terminal ir de nuevo hasta la ubicación de la carpeta del proyecto y poner:
- cd client
- yarn start

* Se debería abrir automáticamente la página en el navegador, sino, ir al link:
- localhost:3000/

## Contacto
- Alexander Quesada Quesada: alexander.quesadaquesada@ucr.ac.cr
- Sebastian Venegas: sebastian.venegas@ucr.ac.cr
- Allison Foster Mc Leod: allison.foster@ucr.ac.cr
- Juan Carlos Sequeira Jimenez: juan.sequeirajimenez@ucr.ac.cr

## Referencias
- axios handling errors: https://stackoverflow.com/questions/50950011/axios-post-request-fails-with-error-status-code-500-internal-server-error
- html & css tutorials: https://www.geeksforgeeks.org/
- react tutorials: https://www.w3schools.com/REACT/DEFAULT.ASP
- React Node.js MySQL Full Stack Blog App Tutorial: https://www.youtube.com/watch?v=0aPLk2e2Z3g&t=3426s
- react jsx: https://www.w3schools.com/react/react_jsx.asp

## License

See the LICENSE file for license rights and limitations (MIT).

