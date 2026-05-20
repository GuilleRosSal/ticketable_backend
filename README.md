# Sistema de Gestión de Incidencias (v2.0.0) - Guía de Configuración

Este proyecto es una API REST para la gestión de tickets, migrada en su versión 2.0.0 a una arquitectura Cloud con persistencia gestionada y almacenamiento de imágenes en la nube.

## 1. Requisitos Previos

- **[Node.js](https://nodejs.org)** (v24.0.0 o superior)
- **Cuenta de [Neon](https://neon.com)** (PostgreSQL Serverless)
- **Cuenta de [Cloudinary](https://cloudinary.com)** (Gestión de imágenes)

---

## 2. Configuración de Servicios Cloud

### A. Base de Datos (Neon)

1. Crea un proyecto en [Neon](https://neon.com).
2. Selecciona la región que más te convenga según tu residencia.
3. En el panel de **SQL Editor**, ejecuta tus scripts de la carpeta [Base de datos](https://drive.google.com/drive/folders/12b9lPw7HQzC_D7REeF_b9OkfvpfWoa3B?usp=sharing) en este orden:
   - `Ticket_management_create.sql`
   - `Ticket_management_triggers.sql`
   - `Inserts_categories.sql` e `Inserts_users.sql`.

> [!NOTE]
> Para optimizar la latencia desde España, se recomienda utilizar la región **AWS Europe Central 1 (Frankfurt)** en la configuración de Neon.

### B. Almacenamiento de Imágenes (Cloudinary)

1. Regístrate en [Cloudinary](https://cloudinary.com).
2. Obtén tu **Cloud Name**, **API Key** y **API Secret** desde el Dashboard principal.

---

## 3. Configuración del Entorno (Backend)

1. **Instalación de dependencias:**

```bash
   npm install
```

2. **Variables de Entorno:** Copia el archivo `.env.template` como `.env` y rellena las variables.

> [!IMPORTANT]
>
> - **DATABASE_URL:** Usa la URL con el sufijo `-pooler` proporcionada por Neon para la ejecución de la app.
> - **DIRECT_URL:** Usa la URL directa (sin pooler) para tareas de mantenimiento si usas comandos de CLI de Prisma.

3. **Generación del Cliente de Prisma:** Este paso vincula tu código con el motor de base de datos de Neon y el adaptador específico:

```bash
   npx prisma generate
```

---

## 4. Ejecución y Pruebas

### Modo Desarrollo

```bash
npm run dev
```

### Documentación Interactiva (Swagger)

Puedes explorar y probar los endpoints de la API de dos formas:

- **Entorno Local:** `http://localhost:3000/api-docs`
- **Entorno de Producción (Cloud):** https://ticketable-backend.onrender.com/api-docs

> [!TIP]
> **Usuarios de Prueba:** Para facilitar las pruebas, las contraseñas de los usuarios del script `Inserts_users.sql` coinciden con el nombre del email (ej: `admin@gmail.com` → `admin`).

---

## 5. Notas de Versión (v2.0.0)

- **Versión Online:** La API se encuentra desplegada y operativa en Render: https://ticketable-backend.onrender.com/
- **Cambio de infraestructura:** Se ha sustituido la base de datos local y el sistema de almacenamiento multimedia por servicios gestionados en **Neon** (PostgreSQL) y **Cloudinary**.
- **Depreciación de endpoints:** Los endpoints previamente utilizados para servir imágenes locales han sido eliminados, ya que la gestión y entrega de archivos multimedia se realiza ahora directamente a través de Cloudinary.
- **Persistencia:** La URL de las imágenes almacenadas en la base de datos ahora apunta directamente a los recursos en la nube.
