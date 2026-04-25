Creacion de proyecto Bares Darsena , next.js + supabase + prisma + tailwind + vercel.
creamos proyecto ,con supabase auth ya configurado de modo basico.

Intento de conexion supabase con next.js, conexion con exito.

Instalacion de Prisma y prisma client.js
Configuracion de schema.prisma y prisma.config.ts
Conexion prisma con supabase, conexion exitosa.
Primera migracion con prisma.
Agregue la tabla alergenos en el schema public de supabase
Creacion del cliente prisma , creacion exitosa.
Creacion del seed de prisma para los allergens , problemas de conexion de seed , cambio el modo en que el seed llama el client.prisma , creacion de seed y problemas resueltos .
Eliminacion de lo inutilizable de la plantilla de next.js con supabase.
creacion de la estructura de la pagina.
selector de homepage provisional.
Homepage del primer bar,"Però".
Agregado el tipaje de las variabiles de datos del database.
agregado css global.
agregado css homepage theme "Però"bar.
agregado pero icon. fallido.
agregado pero icon con exito.
Configuracion inicial de homepage "pero".
Error de la llamada de la fecha en footer solucionado.
Navbar Separada en components , ultimas modificas navbar logo , navbar configuracion terminada.
Seccion Hero SEparado en components.   
Basura en homepage eliminada.
Seccion storia separada en components. 
seccion Menu_preview de homepage separado en componentes.
seccion Event separado en componenets.
seccion footer separado en componentes , meti use cache para la gestion del ano del copiright.
Agregado el mapa con la direccion real de PeroBar.
configuracion del proxy , todas las paginas accesibles menos /admin
Inicio de la dashboard admin.
Database Trigger para conectar los usuarios de schema.user con schema.public.AdminBarAcces 
Actualizacion de Seeders De Prisma para inicializar el primer bar.
Cambio manual de los usuarios de supabase , usuario super admin creado y conectado correctamente
Cambie el color del :hover de la seccion menu-preview
cambie el generator prisma en schema.prisma porque prisma-client-js esta obsoleto 
agregue connection de next js para pagina dinamica
Agregue adminAuth para gestionar el acceso al informacion de usuarios ADmin del database desde la dashboard.
agregue route en lib/route.ts para gestionar las rutas web.
agregue /theme/admin para poner la configuracion frontend inicial de la aplicacion.
Corregi la llamada de el cliente prisma en lib/prisma/prisma.ts  de "../generated/prisma/client" a "../generated/prisma" punta a la carpeta entera lo que hace que obtenga las funciones del cliente correctamente.
Prueba y simulacion de pagina dashboard.
Error en el llamado de las sesiones de supabase puede ralentar la pagina SOLUCIONAR !!!!!!!!!!!!!!!!!!!! 
Solucionado el error  creando un AdminShell che crea las llamadas async haciendo que el layout sea una pagina estatica.
creacion de gestion de MENU en la dashboard , Partes con async call separadas en _components (carpeta ignorada por admin next.js en la carga) agregado un _types.ts para meter los valores que se comparten entre los componentes , agregar eliminar y desactivar menus creado correctamente  , creado tambien la creacion de items por menu eliminacion y desactivacion , precios edicion .
creacion de gestion de Usuarios en la dashboard , Partes con async call separadas en _components (carpeta ignorada por admin next.js en la carga) agregado un _types.ts para meter los valores que se comparten entre los componentes , agregar eliminar y desactivar Users creado correctamente.
termine de arreglar los <links> con routes erroneas 
cambio de css 
.env cambiato per errore con la conexion a supabase 
seed , prisma e schema prisma cambiado la llamada del clietn de prisma
implemento de tailwind css + css modules en todos los componenetes de la dashboard.
cambio en la pagina de login y register , implementado el tailwind + css modules , eliminando la plantilla de supabase
creacion de la seccion para aplicar a un bar o restaurante
Cambio en el nombre del modelo del schema.prisma bar -> Bussines , para mayor globalizacion , cambiado todo los sitios en el cual estaba bar como referimento.
Agregue connection en homeShell para hacerlo un componente dinamico.