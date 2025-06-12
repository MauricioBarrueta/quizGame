Se usó la función 'isPlatformBrowser' porque la API (OpenTDB) tiene un problema de que detecta muchas solicitudes desde la IP del servidor cada que se recargaba la página del juego (/game), por lo que devolvía el error 429 (Too Many Requests).
De esta forma se evitan las peticiones externas desde el servidor y solo ejecutarlas desde el navegador (cliente)

- PLATFORM_ID es un token de Angular que dice dónde se está ejecutando el código
- isPlatformBrowser() es una función que verifica si ese entorno es el navegador