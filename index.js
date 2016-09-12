'use strict';


/**
 * Modules: Node
 * @global
 */
const EventEmitter = require('events'),
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
 * Title Bar
 * @class TitleBar
 * @extends EventEmitter
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

        let self = this,
            element = domify(titlebarView, document),
            $element = $(element);

        let isFullscreen = element.classList.contains('fullscreen');

        self._options = options || {};
        self.element = element;

        // Option: draggable
        if (this._options.draggable) {
            $element.addClass('draggable');
        }

        let minimizeButton = $('.titlebar-minimize', element)[0],
            resizeButton = $('.titlebar-resize', element)[0],
            closeButton = $('.titlebar-close', element)[0];

        /**
         * @fires TitleBar#EventEmitter:minimize
         */
        let onMinimize = function(ev) {
            self.emit('minimize', ev);
        };

        /**
         * @fires TitleBar#EventEmitter:resize
         * @fires TitleBar#EventEmitter:maximize
         * @fires TitleBar#EventEmitter:fullscreen
         */
        let onResize = function(ev) {
            self.emit('resize', ev);

            if (isFullscreen) {
                self.emit('maximize', ev);
                $element.removeClass('fullscreen');
                isFullscreen = false;
            } else {
                self.emit('fullscreen', ev);
                $element.addClass('fullscreen');
                isFullscreen = true;
            }
        };

        /**
         * @fires TitleBar#EventEmitter:close
         */
        let onClose = function(ev) {
            self.emit('close', ev);
        };

        $element.on('click', function(ev) {
            if (minimizeButton.contains(ev.target)) {
                onMinimize(ev);
            }
            if (resizeButton.contains(ev.target)) {
                onResize(ev);
            }
            if (closeButton.contains(ev.target)) {
                onClose(ev);
            }
        });

        $element.on('dblclick', function(ev) {
            if (!(minimizeButton.contains(ev.target) || resizeButton.contains(ev.target) || closeButton.contains(ev.target))) {
                onResize(ev);
            }
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

        // Option: darkMode
        if (this._options.darkMode !== false) {
            document.getElementsByTagName('body')[0].classList.add('titlebar-light');
        }

        // Option: backgroundColor
        if (this._options.backgroundColor !== false) {
            this.element.style.backgroundColor = this._options.backgroundColor;
        }

        defaultCss('titlebar', titlebarStylesheet);
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

        return this;
    };

}


/*
 * @exports
 */
module.exports = TitleBar;
