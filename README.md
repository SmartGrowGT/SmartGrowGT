# SmartGrowGT

API REST para monitoreo agrícola (IoT + sensores + alertas) desarrollado con **Node.js**, **Express** y **MongoDB**.

## 🧱 Estructura del proyecto

- `index.js` - Entrada principal que inicializa el servidor.
- `configs/` - Configuración de Express, CORS, MongoDB y middlewares.
- `middlewares/` - Validaciones, subida de imágenes (Cloudinary), control de errores.
- `src/` - Lógica por entidad (modelos, controladores, rutas):
  - `Users` → gestión de usuarios.
  - `Devices` → registro y estado de dispositivos físicos.
  - `Fields` → parcelas (parcelas/campos agrícolas).
  - `Crops` → datos de cultivos.
  - `SensorData` → ingestión y procesamiento de datos de sensores.
  - `AlertLogs` → registros de alertas generadas.
  - `Reports` → historial de reportes de salud.

## 🚀 Requisitos

- Node.js 18+ (o versión compatible con ESM)
- MongoDB (local o en la nube)
- (Opcional) Cuenta de Cloudinary para subir imágenes (se usa en crop uploads)

## ⚙️ Configuración (archivo `.env`)

Crea un archivo `.env` en la raíz del proyecto con al menos estas variables:

```env
PORT=3001
URI_MONGODB=mongodb://localhost:27017/smartgrowgt

# Cloudinary (para subida de imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_FOLDER=SmartGrowGT/crops
```

> Si no usas Cloudinary, puedes dejar vacías las variables, pero algunas rutas que usan subida de imagen podrían fallar.

## 📦 Instalación

```bash
# Con pnpm (recomendado según package.json)
pnpm install

# O con npm
npm install
```

## ▶️ Ejecutar el servidor

```bash
node index.js
```

Luego abre: `http://localhost:3001/smartgrowgt/v1/health`

## 🌐 URLs base

- **Base URL**: `http://localhost:<PORT>/smartgrowgt/v1`
- **Health check**: `GET /smartgrowgt/v1/health`

## 🧩 Endpoints disponibles

> Nota: la ruta base siempre es `/smartgrowgt/v1`

---

## 🧑‍🌾 Usuarios

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/usuarios/create` | Crear un usuario nuevo |
| PUT | `/usuarios/update/:id` | Actualizar usuario (no permite cambiar `isActive` ni `_id`) |
| PATCH | `/usuarios/deactivate/:id` | Desactivar usuario |

> El backend tiene funciones adicionales (`getUsers`, `getUserById`) que están implementadas en el controlador pero **no están montadas en rutas**.

### Payload recomendado (crear usuario)

```json
{
  "name": "Juan",
  "surname": "Pérez",
  "email": "juan@example.com",
  "password": "secret123",
  "phone": "12345678",
  "address": "Calle Falsa 123",
  "department": "Guatemala",
  "municipality": "Mixco",
  "farmerType": "Pequeño productor",
  "mainCrop": "Maíz"
}
```

---

## 📟 Dispositivos

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/devices/:deviceId` | Obtener datos de un dispositivo por su `deviceId` (ej. `SG-1234`) |
| GET | `/devices/user/:userId` | Obtener dispositivos registrados por usuario (Mongo ObjectId) |
| POST | `/devices/register` | Registrar un nuevo dispositivo |
| PUT | `/devices/update/:deviceId` | Actualizar un dispositivo (name/description, etc.) |
| PUT | `/devices/activate/:deviceId` | Activar un dispositivo (cambia estado) |
| PUT | `/devices/deactivate/:deviceId` | Desactivar un dispositivo (cambia estado) |

### Payload recomendado (registrar dispositivo)

```json
{
  "userId": "<ObjectId del usuario>",
  "deviceId": "SG-XXXX",
  "name": "Raspberry Sensor 1",
  "description": "Dispositivo en parcela principal"
}
```

---

## 🌾 Parcelas / Campos

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/fields/` | Listar todas las parcelas |
| GET | `/fields/:id` | Obtener parcela por ID |
| GET | `/fields/user/:userId` | Listar parcelas de un usuario |
| POST | `/fields/` | Crear parcela |
| PUT | `/fields/:id` | Actualizar parcela |
| PUT | `/fields/deactivate/:id` | Desactivar parcela |
| PUT | `/fields/activate/:id` | Activar parcela |

### Payload recomendado (crear parcela)

```json
{
  "name": "Parcela 1",
  "location": "15.7835,-90.2308",
  "area": 1200,
  "user": "<ObjectId del usuario>",
  "crop": "<ObjectId del cultivo>",
  "soilData": {
    "cc": 30,
    "pmp": 12,
    "zr": 40,
    "ur": 35,
    "dap": 1.3,
    "ib": 5,
    "qest": 0.4
  }
}
```

---

## 🌱 Cultivos

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/cultivos/` | Listar todos los cultivos disponibles |
| GET | `/cultivos/:nombreCultivo` | Buscar cultivos por nombre relacionado |

> Nota: Actualmente solo hay endpoints de lectura. Para agregar cultivos debes insertar los documentos directamente en MongoDB o extender la API.

---

## ⚙️ Datos de sensores (ingestión)

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/sensordata/` | Registrar datos de temperatura/humedad desde un dispositivo |

### Payload recomendado (datos de sensor)

```json
{
  "deviceId": "SG-XXXX",
  "temperature": 25.3,
  "humidity": 68.2,
  "unitTemp": "C",
  "unitHum": "%"
}
```

> El servidor busca el dispositivo por su `deviceId` (cadena), valida que esté `online` y guarda el registro. También genera un `Report` y, si las lecturas están fuera de rango para el cultivo asociado, crea una `AlertLog`.

---

## 🚨 Alertas

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/alerts/` | Listar todas las alertas |
| GET | `/alerts/malas` | Listar solo alertas clasificadas como malas |
| GET | `/alerts/:id` | Obtener alerta por ID |
| GET | `/alerts/device/:deviceId` | Alertas por dispositivo (ObjectId) |
| GET | `/alerts/field/:fieldId` | Alertas por parcela (ObjectId) |

---

## 📊 Reportes

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/reports/` | Listar todos los reportes |
| GET | `/reports/malas` | Listar reportes con `alertType: mal` |
| GET | `/reports/:id` | Obtener reporte por ID |
| GET | `/reports/field/:fieldId` | Reportes por parcela (ObjectId) |
| GET | `/reports/device/:deviceId` | Reportes por dispositivo (ObjectId) |

---

## 🧪 Probar con cURL (ejemplos)

```bash
# Health check
curl http://localhost:3001/smartgrowgt/v1/health

# Crear usuario
curl -X POST http://localhost:3001/smartgrowgt/v1/usuarios/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","surname":"Lopez","email":"ana@test.com","password":"123456","phone":"12345678","address":"Calle 1","department":"Guatemala","municipality":"Mixco","farmerType":"Pequeño productor","mainCrop":"Maíz"}'
```

---

## 🛠️ Notas / Recomendaciones

- Asegúrate de tener MongoDB corriendo y que `URI_MONGODB` apunte correctamente.
- Si necesitas cargar datos base (cultivos) puedes usar herramientas como MongoDB Compass o un script de seed.
- El campo `deviceId` usado en la ruta `/sensordata/` **no** es el ObjectId de MongoDB, es el `deviceId` string registrado en `/devices/register`.

---

Si necesitas ayuda con un endpoint o quisieras extender la API (por ejemplo, crear cultivos desde la API), dime y te ayudo a implementarlo.