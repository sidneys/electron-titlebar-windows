import path from 'path';
import test from 'ava';
import {Application} from 'spectron';

/**
 * Modules: External
 * @global
 */
const electronPath = require('electron-prebuilt');

/**
 * Modules: Internal
 * @global
 */
const moduleRoot = __dirname,
    packageJson = require(path.join(moduleRoot, 'package.json'));

/**
 * Path to Electron application
 * @global
 */
const appMain = path.join(moduleRoot, 'app', 'main.js');

console.log(electronPath)
console.log(appMain)

test.beforeEach(t => {
  t.context.app = new Application({
      path: electronPath,
      args: [ appMain ]
  });

  return t.context.app.start();
});

test.afterEach(t => {
  return t.context.app.stop();
});

test(t => {
  return t.context.app.client.waitUntilWindowLoaded()
    .getWindowCount().then(count => {
      t.is(count, 1);
    }).browserWindow.isMinimized().then(min => {
      t.false(min);
    }).browserWindow.isDevToolsOpened().then(opened => {
      t.false(opened);
    }).browserWindow.isVisible().then(visible => {
      t.true(visible);
    }).browserWindow.isFocused().then(focused => {
      t.true(focused);
    }).browserWindow.getBounds().then(bounds => {
      t.true(bounds.width > 0);
      t.true(bounds.height > 0);
    });
});
