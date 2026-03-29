# Sistema de Gestión de Incidencias - Guía de Despliegue

Este documento contiene las instrucciones necesarias para configurar y ejecutar el entorno de desarrollo del proyecto.

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v24.0.0 o superior)
- **PostgreSQL** (v18 o superior)

---

## 2. Configuración de la Base de Datos (PostgreSQL)

El sistema utiliza PostgreSQL para la persistencia de datos. Sigue estos pasos para recrear el entorno:

1. **Crear la Base de Datos:**
   Crea una base de datos vacía (ej: `ticket_management_db`).

2. **Ejecutar Scripts SQL:**
   Localiza la carpeta `/database` a la altura de la carpeta que contiene este proyecto y ejecuta los archivos en el siguiente orden para garantizar la integridad de las claves foráneas:
   - `Ticket_management_create.sql`: Crea las tablas, relaciones y restricciones.
   - `Ticket_management_triggers.sql`: Crea los triggers encargados de limitar el número de imágenes de clientes y de resolución.
   - `Inserts_categories.sql`: Añade los datos de las categorías y subcategorías en las que se podrán clasificar las incidencias.
   - `Inserts_users.sql`: Añade los datos de varios usuarios.

3. **Usuarios de Prueba:**
   Para facilitar la evaluación, se han preconfigurado los siguientes accesos. Las contraseñas se corresponden con la parte inicial del email:

   | Rol               | Usuario (Email)    | Contraseña |
   | :---------------- | :----------------- | :--------- |
   | **Administrador** | `admin@gmail.com`  | `admin`    |
   | **Administrador** | `eduard@gmail.com` | `eduard`   |
   | **Cliente**       | `test@gmail.com`   | `test`     |
   | **Cliente**       | `marta@gmail.com`  | `marta`    |
   | **Cliente**       | `camilo@gmail.com` | `camilo`   |

---

## 3. Configuración del Backend (Node.js)

El servidor está desarrollado con Express y requiere la configuración de variables de entorno para su correcto funcionamiento. Para realizar su configuración realiza las siguientes acciones:

1. **Instalación de dependencias:**
   Desde la raíz del proyecto, ejecuta:

   ```bash
   npm install
   ```

2. **Configuración de las variables de entorno:**
   A partir del fichero `.env.template` genera el fichero `.env` y configura las variables de entorno conforme se indica en los comentarios de la plantilla.

   > **Importante:** Si tu contraseña de PostgreSQL contiene caracteres especiales (como `@`, `#`, `!`), estos deben estar correctamente codificados en la variable `DATABASE_URL`. Por ejemplo, `@` se sustituye por `%40` y `!` por `%21`.

---

## 4. Puesta en marcha del Backend (Node.js)

Una vez la base de datos y el backend están configurados, solamente resta arrancar la API. Para ello se dispone de dos posibilidades. En el caso de querer lanzar el servidor en modo de desarrollo ejecuta el comando siguiente:

```bash
npm run dev
```

En el caso de querer únicamente lanzar el servidor sin estar este pendiente de cambios simplemente ejecuta el comando:

```bash
npm start
```
