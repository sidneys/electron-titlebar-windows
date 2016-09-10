# electron-titlebar-windows [![Build Status](https://travis-ci.org/sidneys/electron-titlebar-windows.svg?branch=master)](https://travis-ci.org/sidneys/electron-titlebar-windows)

**Creates a purely HTML5/JS-based, Windows 10-style ('Metro') titlebar for usage in Electron desktop apps.**



# Installation

```
$ npm install --save electron-titlebar-windows
```



# API

### Require

The module exports a function:

```js
const createTitlebarWindows = require('electron-titlebar-windows');
const titlebarWindows = createTitlebarWindows(opts);
```

The function takes one `options` argument and returns a `TitleBar`:


-    **options** *Object* (optional)
     - *draggable* *String* (optional) - Dragging the title bar drags the window
     - *inverted* *String* (optional) - Switch from dark on white to white on dark
     - *style* *String* (optional) - CSS overrides for titlebar 




### Adding the titlebar to the document

```js
titlebarWindows.appendTo(document);
```



### Events

The instance emits four events which can be handled: `close`, `minimize`, `fullscreen`, `maximize`

Register handlers for these events like so:

```js
titlebarWindows.on('close', function(e) {
    console.log('close');
});
```



### Convenience

Use the ```element``` property for reference:
```js
titlebarWindows.element.appendChild(document.createElement('div'));
```

Clean up after usage:
```js
titlebarWindows.destroy();
```



## License

MIT © [sidneys](http://sidneys.github.io)



## Related

Based on [titlebar](https://github.com/kapetan/titlebar)
