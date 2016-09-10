# electron-titlebar-windows [![Build Status](https://travis-ci.org/sidneys/electron-titlebar-windows.svg?branch=master)](https://travis-ci.org/sidneys/electron-titlebar-windows)

**Adds the Windows 10 ModernUI (Metro)-style titlebars to any Electron-based desktop app.**



![screen](screen.png)



# Installation

```
$ npm install --save electron-titlebar-windows
```



# API

### Requiring the module

The module exports itself as a named function.

```js
const createTitlebarWindows = require('electron-titlebar-windows');
```



### Configuration

The module takes a single optional `options` argument and returns a `TitleBar`:

```js
const titlebarWindows = createTitlebarWindows(opts);
```

- options `object`
  - **invert** - `string` (optional) - **Dark or light titlebar buttons**
  - **color** - `string` (optional) - **Titlebar  color, in CSS format (e.g. "#00FFAA")**
  - **draggable** - `boolean` (optional) - **Title bar dragging on / off**
  - **style** - `string` (optional) - **Titlebar CSS overrides** Adding the titlebar to the document



### Integration

```js
titlebarWindows.appendTo(document);
```



### Events

The instance emits events which can be handled - `close`, `minimize`, `fullscreen`, `maximize`

Register handlers like so:

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
