# Flujo de la aplicación - Sistema de Gestión de Servicios de Transporte

## Objetivo

Desarrollar una aplicación web que permita a la empresa publicar servicios de transporte de vehículos y a los conductores reservarlos, gestionarlos y documentar todo el proceso de recogida y entrega.

---

# ROLES

## Administrador

* Inicia sesión.
* Publica nuevos servicios de transporte.
* Puede editar o cancelar un servicio antes de que sea reservado.
* Consulta el estado de todos los servicios.
* Consulta el historial de servicios realizados.

## Conductor

* Inicia sesión.
* Visualiza los servicios disponibles.
* Reserva un servicio.
* Cancela una reserva (indicando un motivo).
* Gestiona la recogida y entrega del vehículo.
* Sube fotografías y documentación.
* Consulta sus servicios activos e historial.

---

# FLUJO DEL SERVICIO

## 1. Publicación

El administrador publica un nuevo servicio indicando:

* Vehículo
* Matrícula
* Marca
* Modelo
* Color (opcional)
* Punto de recogida (concesionario)
* Punto de entrega (concesionario)

El servicio queda con estado:

DISPONIBLE

---

## 2. Reserva

El conductor visualiza todos los servicios disponibles.

Cada tarjeta muestra:

* Marca
* Modelo
* Matrícula
* Ciudad de recogida
* Ciudad de entrega

Botón:

RESERVAR

Al reservar:

* El servicio pasa a estado RESERVADO.
* Se asocia al conductor.
* Desaparece de la lista de servicios disponibles para el resto de conductores.
* Aparece dentro de "Mis servicios".

El conductor podrá cancelar la reserva indicando un motivo.

---

## 3. Recogida

Cuando el conductor llega al concesionario de recogida pulsa:

RECOGER VEHÍCULO

Se registra:

* Fecha
* Hora
* Kilometraje
* Nivel de combustible

Además podrá subir fotografías del vehículo como evidencia.

Ejemplos:

* Frontal
* Trasera
* Lateral izquierdo
* Lateral derecho
* Interior (opcional)

El estado pasa a:

EN TRÁNSITO

---

## 4. Entrega

Al llegar al concesionario de destino:

ENTREGAR VEHÍCULO

Se registra:

* Fecha
* Hora
* Kilometraje
* Nivel de combustible

Se vuelven a subir fotografías.

Al finalizar:

Estado:

FINALIZADO

---

## 5. Después de finalizar

El servicio queda almacenado en el historial.

El vehículo podrá volver a aparecer en un nuevo servicio en caso de ser necesario.

La aplicación podrá sugerir automáticamente nuevos servicios cercanos al punto de entrega.

---

# DASHBOARD DEL CONDUCTOR

La pantalla principal mostrará:

## Servicios disponibles

Lista de servicios pendientes de reservar.

## Mis servicios

Separados por:

* Reservados
* En tránsito
* Finalizados

---

# HISTORIAL

Cada conductor podrá consultar todos los servicios realizados.

Cada servicio almacenará:

* Vehículo
* Matrícula
* Recogida
* Entrega
* Fechas
* Fotografías
* Datos registrados

---

# BASE DE DATOS

## Usuarios

* id
* nombre
* teléfono
* email
* contraseña
* rol

Roles:

* ADMIN
* CONDUCTOR

---

## Concesionarios

* id
* nombre
* dirección
* ciudad
* teléfono
* persona_contacto

---

## Vehículos

* id
* matrícula
* marca
* modelo
* color
* combustible (tipo)
* observaciones

---

## Servicios

* id
* vehiculo_id
* conductor_id
* concesionario_origen_id
* concesionario_destino_id
* fecha_publicación
* fecha_reserva
* fecha_recogida
* fecha_entrega
* kilometraje_recogida
* kilometraje_entrega
* combustible_recogida
* combustible_entrega
* estado

Estados posibles:

* DISPONIBLE
* RESERVADO
* EN_TRÁNSITO
* FINALIZADO
* CANCELADO

---

## Fotografías

* id
* servicio_id
* tipo
* url

Tipos:

* RECOGIDA
* ENTREGA

---

## Gastos

* id
* servicio_id
* tipo
* importe
* imagen_ticket
* observaciones

Tipos:

* Combustible
* Peajes
* Tren
* Autobús
* Taxi
* Hotel
* Otros

---

# VERSIONES

## MVP (Versión 1)

** Login (login.html)
** Dashboard (dashboard.html)
** Publicación de servicios (mis_transp.html)
* Reserva (detalles.html)
* Recogida (detalles.html)
* Entrega (detalles.html)
* Fotografías (detalles.html)
* Historial (detalles.html)

---

## Versión 2

* Notificaciones en tiempo real
* Búsqueda automática de servicios cercanos
* Geolocalización
* Firma digital
* Generación automática de PDF
* Estadísticas
* Informes para administradores

---

# Regla principal del proyecto

La aplicación debe estar pensada para un conductor que lleva muchas horas trabajando.

Cada acción importante debe poder realizarse con el menor número posible de pulsaciones y sin obligar al usuario a buscar opciones escondidas.