'use strict';


/**
 * Modules
 * Node
 * @constant
 */
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');


/**
 * Modules
 * External
 * @constant
 */
const defaultCss = require('defaultcss');
const domify = require('domify');


/**
 * Filesystem
 * @constant
 * @default
 */
const titlebarStylesheet = fs.readFileSync(path.join(__dirname, '..', 'css', 'titlebar.css'), 'utf-8');
const titlebarView = fs.readFileSync(path.join(__dirname, '..', 'html', 'titlebar.html'), 'utf-8');


/**
 * Title Bar
 * @class TitleBar
 * @extends EventEmitter
 */
class TitleBar extends EventEmitter {

    /**
     * Create the Title bar
     * @param {Object=} options - Titlebar Configuration
     * @param {Boolean=} options.darkMode - Light titlebar buttons (for dark backgrounds)
     * @param {String=} options.color - Icon color (Hex)
     * @param {String=} options.backgroundColor - Bar color (Hex)
     * @param {Boolean=} options.draggable - Titlebar enables dragging of contained window
     * @param {Boolean=} options.fullscreen - Resize button initializes in fullscreen mode
     */
    constructor(options = {}) {
        super();

        // Get Options
        this.options = {};
        this.options.color = options.color;
        this.options.backgroundColor = options.backgroundColor;
        this.options.darkMode = options.darkMode;
        this.options.draggable = options.draggable;
        this.options.fullscreen = options.fullscreen;

        // Create DOM Titlebar Element
        this.titlebarElement = domify(titlebarView, document);

        // Register buttons
        this.minimizeButton = this.titlebarElement.querySelector('.titlebar-minimize');
        this.resizeButton = this.titlebarElement.querySelector('.titlebar-resize');
        this.closeButton = this.titlebarElement.querySelector('.titlebar-close');

        this.init();
    };

    /**
     * Init
     * @private
     */
    init() {
        // Draggable
        if (this.options.draggable) {
            this.titlebarElement.classList.add('draggable');
        }

        // Add click events
        this.titlebarElement.addEventListener('dblclick', event => this.onDoubleclick(event));
        this.minimizeButton.addEventListener('click', event => this.clickMinimize(event));
        this.resizeButton.addEventListener('click', event => this.clickResize(event));
        this.closeButton.addEventListener('click', event => this.clickClose(event));
    }

    /** @fires TitleBar#EventEmitter:close */
    clickClose() { this.emit('close'); };

    /** @fires TitleBar#EventEmitter:minimize */
    clickMinimize() { this.emit('minimize'); };

    /**
     * @fires TitleBar#EventEmitter:maximize
     * @fires TitleBar#EventEmitter:fullscreen
     */
    clickResize() {
        // Resize to Maximize
        if (this.options.fullscreen) {
            this.titlebarElement.classList.remove('fullscreen');
            this.emit('maximize');
        }

        // Resize to Fullscreen
        if (!this.options.fullscreen) {
            this.titlebarElement.classList.add('fullscreen');
            this.emit('fullscreen');
        }

        // Store
        this.options.fullscreen = !this.options.fullscreen;
    };

    /**
     * @param {Event} event - Event
     * @fires TitleBar#EventEmitter:close
     */
    onDoubleclick(event) {
        if (!(this.minimizeButton.contains(event.target) || this.resizeButton.contains(event.target) || this.closeButton.contains(event.target))) {
            this.clickResize(event);
        }
    };

    /**
     * Add to DOM
     * @param {Element=} context - DOM node
     * @returns {TitleBar}
     */
    appendTo(context = document.body) {
        // Option: darkMode
        if (this.options.darkMode !== false) {
            document.querySelector('body').classList.add('titlebar-light');
        }

        // Option: color
        if (this.options.color) {
            this.titlebarElement.querySelector('rect').style.fill = this.options.color;
            this.titlebarElement.querySelector('path').style.fill = this.options.color;
            this.titlebarElement.querySelector('polygon').style.fill = this.options.color;
        }

        // Option: backgroundColor
        if (this.options.backgroundColor) {
            this.titlebarElement.style.backgroundColor = this.options.backgroundColor;
        }

        defaultCss('titlebar', titlebarStylesheet);

        context.appendChild(this.titlebarElement);

        return this;
    };

    /**
     * Remove from DOM
     * @returns {TitleBar}
     */
    destroy() {
        parent.removeChild(this.titlebarElement);

        return this;
    };

}


/*
 * @exports
 */
module.exports = TitleBar;
