'use strict';

/**
 * Modules: Node
 * @global
 */
var path = require('path'),
    fs = require('fs'),
    util = require('util');


/**
 * Modules: Third Party
 * @global
 */
var events = require('events'),
    defaultCss = require('defaultcss'),
    domify = require('domify'),
    $ = require('dombo');


/**
 * Init
 * @global
 */

var $window = $(window);


/**
 * HTML/CSS Payloads
 * @global
 */
var style = fs.readFileSync(__dirname + '/index.css', 'utf-8'),
    html = fs.readFileSync(__dirname + '/index.html', 'utf-8');


/**
 * TitleBar
 */
var TitleBar = function(options) {
    if (!(this instanceof TitleBar)) {
        return new TitleBar(options);
    }

    events.EventEmitter.call(this);

    this._options = options || {};

    var element = domify(html, document),
        $element = $(element);
                                                                          0
    this.element = element;

    // Option: draggable
    if (this._options.draggable !== false) {
        $element.addClass('webkit-draggable');
    }

    var self = this;

    var closeButton = $('.titlebar-close', element)[0],
        maximizeButton = $('.titlebar-maximize', element)[0],
        minimizeButton = $('.titlebar-minimize', element)[0],
        fullscreenButton = $('.titlebar-fullscreen', element)[0];

    $element.on('click', function(ev) {

        var target = ev.target;

        if (closeButton && closeButton.contains(target)) {
            return self.emit('close', ev);
        }

        if (minimizeButton && minimizeButton.contains(target)) {
            return self.emit('minimize', ev);
        }

        if (maximizeButton && maximizeButton.contains(target)) {
            return self.emit('maximize', ev);
        }

        if (fullscreenButton && fullscreenButton.contains(target)) {
            if (ev.altKey) {
                self.emit('maximize', ev);
            } else {
                self.emit('fullscreen', ev);
            }
        }
    });

    $element.on('dblclick', function(ev) {
        var target = ev.target;

        if (closeButton.contains(target) ||
            maximizeButton.contains(target) ||
            minimizeButton.contains(target) ||
            fullscreenButton.contains(target)) {
            return;
        }

        self.emit('maximize', ev);
    });
};


util.inherits(TitleBar, events.EventEmitter);


/**
 * TitleBar#appendTo
 */
TitleBar.prototype.appendTo = function(target) {
    if (typeof target === 'string') {
        target = $(target)[0];
    }

    var $element = $(this.element);

    // Option: invert
    if (this._options.inverted !== false) {
        document.getElementsByTagName('body')[0].classList.add('titlebar-invert');
    }

    // Option: color
    if (this._options.color !== false) {
        this.element.style.backgroundColor = this._options.color;
    }

    // Option: style
    if (this._options.style !== false) {
        defaultCss('titlebar', style);
    }

    $window.on('keydown', this._onkeydown = function(ev) {
        if (ev.keyCode === 18) {
            $element.addClass('alt')
        }
    });

    $window.on('keyup', this._onkeyup = function(ev) {
        if (ev.keyCode === 18) {
            $element.removeClass('alt');
        }
    });

    target.appendChild(this.element);

    return this;
};


/**
 * TitleBar#destroy
 */
TitleBar.prototype.destroy = function() {
    var parent = this.element.parentNode;

    if (parent) {
        parent.removeChild(this.element);
    }

    $window.off('keydown', this._onkeydown);
    $window.off('keyup', this._onkeyup);

    return this;
};


/*
 * @exports
 */
module.exports = TitleBar;
