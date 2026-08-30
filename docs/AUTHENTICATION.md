# Autenticación y autorización

NeuroAula usa Supabase Auth con correo y contraseña. El navegador y TanStack Start comparten la sesión mediante cookies gestionadas por `@supabase/ssr`; ninguna clave administrativa se incluye en la aplicación.

## Flujo

1. `src/lib/supabase.ts` crea el cliente de navegador con la URL y la clave publicable.
2. Supabase Auth verifica el correo y la contraseña y guarda los tokens de sesión en cookies.
3. El loader de `/demo` llama a `getServerDemoSession`. El servidor crea un cliente específico para la petición y usa `auth.getUser()` para validar la sesión con Supabase Auth.
4. Con el usuario validado, el servidor consulta `profiles` y todas sus membresías activas. RLS filtra las filas que la sesión puede leer.
5. El rol de cada centro se traduce a un rol de interfaz. Si hay varios centros, la persona elige explícitamente el centro activo; solo puede elegir entre membresías devueltas por RLS.
6. Las subrutas anónimas se redirigen a `/demo`. La navegación se filtra por rol, pero esta protección visual no sustituye a RLS.

## Credenciales y tokens

- `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` son datos públicos del cliente. Nunca deben contener una clave `service_role` o `sb_secret_*`.
- La contraseña solo permanece temporalmente en el estado del formulario y se envía directamente a Supabase Auth.
- Los tokens de acceso y actualización son administrados por `@supabase/ssr` en cookies compartidas con el servidor.
- El servidor no confía en `getSession()` ni en el contenido de la cookie para identificar al usuario; usa `getUser()`.
- El cierre de sesión elimina la sesión de Supabase y la preferencia local del centro activo.
- Los enlaces de confirmación y recuperación vuelven a `/demo`, donde el cliente completa el flujo PKCE y permite actualizar la contraseña.

## Límite de seguridad

La autoridad final es PostgreSQL. Toda función de servidor que lea o modifique información educativa debe volver a validar la identidad y ejecutar la consulta con el cliente Supabase de esa petición. También debe incluir `organization_id` en la consulta; no debe confiar en un rol, identificador de centro o identificador de estudiante enviado por el navegador.

La migración `supabase/migrations/20260830165213_auth_boundary_hardening.sql`:

- activa RLS en organizaciones, perfiles y membresías;
- impide acceso anónimo a esas tablas;
- permite que cada usuario lea o edite únicamente su perfil;
- permite leer únicamente organizaciones y membresías activas del usuario;
- reserva los cambios de organización y membresías a administradores activos del mismo centro;
- mantiene las funciones `security definer` en el esquema no expuesto `private`, fija un `search_path` vacío y limita su ejecución a `authenticated`.

Las rutas y los datos actuales de `/demo` siguen siendo simulados. Antes de añadir datos reales, cada tabla nueva del esquema expuesto debe tener RLS, políticas por organización y pruebas de acceso cruzado entre centros.

## Operación

En Supabase Auth debe estar habilitado el proveedor Email. La creación de una cuenta no concede acceso: un administrador debe crear o activar una fila de `organization_memberships` desde un entorno administrativo seguro.

Supabase informa actualmente de que la protección contra contraseñas filtradas está desactivada. Debe habilitarse en la configuración de Auth antes de producción.
