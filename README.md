# TFG
> *Author: Diego Maroto*  
> *Tutor: John Alejandro Casto Vargas*  
> *Tutor: Jose García*  

## Resumen

La pobreza en España es un problema social que ha afectado a miles de familias a lo largo de los años, especialmente en la crisis de 2008 y actualmente con el coronavirus. En esta situación y a pesar de las ayudas económicas del gobierno, muchas personas se verán dramáticamente perjudicadas, afectando incluso a la adquisición de alimentos básicos.
Los economatos sociales son proyectos que suelen ser llevados en comunidad y permiten el acceso a recursos básicos por un precio inferior al de mercado. Sin embargo, estos proyectos tienen un volumen considerable de usuarios que se magnifica en épocas de crisis como la que ha ocasionado la pandemia.
En este proyecto se desea desarrollar un software de gestión y control de usuarios que permita trabajar de manera más eficiente a los voluntarios que dedican su tiempo en estos proyectos.  

**Objetivos concretos:**  
- Control logístico de productos donados y comprados.
- Control de usuarios, que permita gestionar su alta y baja en el sistema.
- Sistema distribuido con una base de datos central e interfaz web.
- Generación de gráficas con las ayudas prestadas por zonas y/o familias.

### Metodología a emplear

La metodología a seguir consistirá en una primera fase para analizar las necesidades en este tipo de proyectos y diseñar una base de datos a medida que permita el control usuarios y productos. A continuación, nos enfocaremos en la interfaz de usuario utilizando tecnologías web, dando especial importancia a una interfaz limpia y sencilla lo más familiar posible a lo que usan los voluntarios hasta ahora (Normalmente hojas en Excel.). Debido a la baja cantidad de recursos que suelen tener este tipo de proyectos, se plantea la configuración y despliegue de la base de datos en un servidor de bajo coste, al cual se tendrá acceso desde diferentes zonas para registrar a los usuarios. Finalmente, se permitirá la generación de gráficas a partir de los datos almacenados, para que los encargados del proyecto puedan analizar las necesidades globales de una zona o las de una familia, quienes a veces por vergüenza no cuentan pero se manifiesta en sus compras.

**Relación con asignaturas cursadas y/o itinerario relacionado:**

*Este Trabajo de Fin de Grado se encuentra altamente relacionado con las siguientes asignaturas del Grado en Ingeniería Informática con especial énfasis en el itinerario de Software:*
 
- Diseño de base de datos
- Herramientas avanzadas para el desarrollo de aplicaciones
- Diseño de sistemas software
- Ingeniería web
- Programación

### Detalles

**Requerimientos del sistema a nivel logística:**

Al almacén llegan pedidos que pueden ser donados o comprados. En el caso de ser productos donados se deberá tener un registro para evitar su venta al público. Los productos donados no pueden ser vendidos. También tener un registro de donaciones económicas recibidas.

De los productos se necesita registrar la fecha en la que se realizó el pedido y el sitio en el que fueron adquiridos. A priori, la información a registrar será genérica. Almacenar la información utilizando por ejemplo el ISBN puede no ser viable, debido al limitado personal que se dispone como para hacer el registro de los productos al detalle (Aunque se puede valor automatizar este apartado mediante una lectura de QR o código de barras)

Normalmente la información a almacenar se reduce al nombre del producto. Sin embargo, puede haber varios con el mismos y diferentes precios de adquisición, aunque es más importante la cantidad del producto que viene.
Las fechas de caducidad es un dato que también vendría bien tener registrado y hacer posible avisara con alertas a los administradores.

Se desea almacenar información sobre los usuarios. Los detalles a almacenar habrá que discutirse con los representantes del proyecto debido a la ley de protección de datos. En función de las capacidades que tengamos para gestionar esta información se baraja almacenar información completa que sería lo ideal para controlar mejor el registro de los usuarios y comprobar quienes son, o mantener el sistema antiguo y solo tener referencia a los identificadores de estos usuarios.

En cuanto al hardware a utilizar se valorará opciones de bajo de coste. Con la finalidad de darle un empaque ‘low cost’ y enmarcarlo dentro de las capacidades del proyecto. Se valorará en especial dispositivos propios como raspberry pi y será desplegada en una de las parroquias o en el propio local. El dispositivo habrá que configurarse con un mínimo de tolerancia a fallos. En el caso de la raspberry pi esto puede significar establecer el acceso a la micro sd en modo solo lectura y las consultas a base de datos en un raid externo conectado por usb al dispositivo con acceso de lectura y escritura (Esto puede ser una batería de memorias usbs de diferentes marcas conectadas). Con la finalidad de tolerar cortes de corriente se puede alimentar mediante una powerbank conectada a red.

En la medida de lo posible se intentará el primer caso, ya que las familias que solicitan ayudas pasan por un registro que se gestiona desde las parroquias de sus respectivos barrios. De este modo estos registros se harían de manera digital y se almacenaría en un servidor que podrá ser consultado cuando realizan las compras. (Los detalles a almacenar se barajarán en un futuro, pero probablemente mínimo información de identificación y el número de miembros que constituyen la familia)

La compra que realicen también deberá ser almacenada y vinculada al usuario, de manera que pueda ser consultado en un futuro para realizar análisis estadísticos.
Inicialmente la interfaz se plantea web, para facilitar la accesibilidad desde diferentes sistemas. Aunque actualmente trabajan en máquinas con Windows no se descarta cambiar a Linux debido a la vejez de los ordenadores.


### Funcionalidades

- Registro de productos mediante Qr o código de barras (Mediante un móvil por ejemplo) además de a mano.
    - Permitir leer en bloque desde la aplicación móvil con un adaptador usb.
- PWA para poder usar lector con la cámara del móvil.
- Cachear en local web en caso de pérdida de conectividad y disponibilidad.
    - Información visual en la página web sobre si hay conexión o no.
- Desarrollar las dos líneas de hardware, raspberry y cloud.
    - Migración automática entre diferentes bases de datos por la posibilidad de migración entre una solución de hardware y otra.
    - Mirar free tier mongodb y su capacidad. Solución agnóstica al motor de base de datos.
- Registro de usuarios.
- Generación de paneles/gráficos.
    - Valorar predicciones y toma de decisiones.
- Generación de informes.
    - Resúmenes de datos en la aplicación.
    - Permitir imprimir.
- Sección de almacén para visualizar los pedidos.
    - Usuario pide X productos y al almacén le llega la notificación de qué quiere recoger, se da de alta en una recepción.
    - Salida de productos flexibles, lectura en la entrada y no en la salida.
    - Productos donados no se venden, salen a discreción de la recepción, sin petición del usuario.
- Gestionar diferentes perfiles con acceso al sistema.
    - Administrador completo (Acceso a los datos completos de todos los usuarios).
    - Administrador por barrio (Acceso restringido a uno barrios correspondientes pero accesible a toda la información).
    - Administrador (Sin acceso a los datos de ningún usuario pero con capacidad de modificar los elementos).
- "Caja" (Acceso restringido para procesar las solicitudes de venta de los productos a los usuarios).
    - Dejar un listado de pedidos pendientes de cobrar al de la caja.
    - Apertura y cierre de cajas diarias.
        - Cuánto producto ha salido
        - Cuánto se ha vendido.
        - Cuánto donado ha salido.
    - Informes de caja.
    - Familias especiales que no pagan.
- Panel de administración.
    - Gestionar permisos y usuarios.
        - Permisos permanentes y temporales.
    - Altas y edición de productos.
    - Registrar usuarios.
        - Se estudia y se decide unos límites.
    - Histórico de cambios y responsables de éstos.
