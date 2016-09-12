'use strict';

let log = function(name) {
    return function(e) {
        console.log(name, e);
    };
};

const TitlebarWindows = require('..');

/** Options */
let titlebar = new TitlebarWindows({
    darkMode: true,
    backgroundColor: '#0061D1',
    draggable: true
});

/** DOM */
titlebar.appendTo(document.body);

/** Events */
titlebar.on('close', log('close'));
titlebar.on('minimize', log('minimize'));
titlebar.on('maximize', log('maximize'));
titlebar.on('fullscreen', log('fullscreen'));
