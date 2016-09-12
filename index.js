'use strict';


/**
 * Modules: Node
 * @global
 */
const EventEmitter = require('events').EventEmitter,
    path = require('path'),
    fs = require('fs'),
    util = require('util');


/**
 * Modules: Third Party
 * @global
 */
const events = require('events'),
    defaultCss = require('defaultcss'),
    domify = require('domify'),
    $ = require('dombo');


/**
 * Window
 */
const $window = $(window);


/**
 * CSS
 */
const titlebarStylesheet = fs.readFileSync(__dirname + '/titlebar.css', 'utf-8');


/**
 * HTML / SVG
 */
const titlebarView = fs.readFileSync(__dirname + '/titlebar.html', 'utf-8');


/**
 * TitleBar
 * @class
 */
class TitleBar extends EventEmitter {


    /**
     * Create the Title bar
     * @param {Object} options - Titlebar Configuration
     * @param {Boolean=} options.darkMode - Light titlebar buttons (for dark backgrounds)
     * @param {String=} options.backgroundColor - Titlebar color in CSS color syntax
     * @param {Boolean=} options.draggable - Titlebar enables dragging of contained window
     */
    constructor(options) {

        super();

        this._options = options || {};

        let element = domify(titlebarView, document),
            $element = $(element);

        this.element = element;

        // Option: draggable
        if (this._options.draggable !== false) {
            $element.addClass('webkit-draggable');
        }

        let self = this;

        let closeButton = $('.titlebar-close', element)[0],
            maximizeButton = $('.titlebar-maximize', element)[0],
            minimizeButton = $('.titlebar-minimize', element)[0],
            fullscreenButton = $('.titlebar-fullscreen', element)[0];

        $element.on('click', function(ev) {

            let target = ev.target;

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
            let target = ev.target;

            if (closeButton && closeButton.contains(target) ||
                minimizeButton && minimizeButton.contains(target) ||
                maximizeButton && maximizeButton.contains(target) ||
                fullscreenButton && fullscreenButton.contains(target)) {
                return;
            }

            self.emit('maximize', ev);
        });
    }


    /**
     * Add to DOM
     * @param {Element} element - DOM node
     * @returns {TitleBar}
     */
    appendTo(element) {
        if (typeof element === 'string') {
            element = $(element)[0];
        }

        let $element = $(this.element);

        // Option: darkMode
        if (this._options.darkMode !== false) {
            document.getElementsByTagName('body')[0].classList.add('titlebar-light');
        }

        // Option: backgroundColor
        if (this._options.backgroundColor !== false) {
            this.element.style.backgroundColor = this._options.backgroundColor;
        }

        defaultCss('titlebar', titlebarStylesheet);

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

        element.appendChild(this.element);

        return this;
    };


    /**
     * Remove from DOM
     * @returns {TitleBar}
     */
    destroy() {
        let parent = this.element.parentNode;

        if (parent) {
            parent.removeChild(this.element);
        }

        $window.off('keydown', this._onkeydown);
        $window.off('keyup', this._onkeyup);

        return this;
    };

}


/*
 * @exports
 */
module.exports = TitleBar;
