import Promise from 'es6-promise';
Promise.polyfill();

import './initializers/parse';
import './initializers/filepicker';
import './initializers/session';

import './router';
