# Plantilla FE ( gulp )

Setup b�sico para prototipar un proyecto est�tico de FE.

Incluye:

- [Gulp](https://github.com/gulpjs/gulp) 
- [Babel (ES6)](https://babeljs.io/)
- [Browserify](http://browserify.org/)
- [BrowserSync](https://www.browsersync.io/)
- [Sass](http://sass-lang.com/)

---
**PRE-REQUISITOS** 

Hay que tener instalado [Node.js](https://nodejs.org/)

Se recomienda usar **[nvm](https://github.com/creationix/nvm)** de ser posible.

---

## Usar
```
$ npm install
...
...
$ npm start
```

## Notas
- Se puede configurar las rutas de la aplicacion mediante el config.json
- Por defecto se utiliza la siguiente estructura:
```
root/
 |__ .tmp/
 |__ dist/
 |  |__  css/
 |  |__  js/
 |  |__  fonts/
 |
 |__ app/
 |  |__  css/
 |  |__  js/
 |  |    |__ vendor/
 |  |    |__ modules/
 |  |    |__ index.js
 |  |__
 |  |__  sass/
 |       |__ mixins/
 |       |__ partials/
 |       |__ main.scss
 |
 |__ index.html

```
(Obviamente esta puede ser modificada si tambi�n se edita el gulpfile.js.)
