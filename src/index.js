
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import $ from "jquery";

import { App } from './App'

// NOTE: Хелперы
var _$ = (s, b=document.body) => document.body.querySelector.apply(b, [s])
var _$$ = (s, b=document.body) => document.body.querySelectorAll.apply(b, [s])
global._l = (...a) => { console.log.apply(console, a); return a[0]; }
global._s = () => { var o = new Error(); console.trace(o.stack.match(/at ([^\n]*)/g)[1]); }

global.jQuery = $

$(document).ready(() => {
    App.fnStart()
});



