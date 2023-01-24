
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import $ from "jquery";

import { App } from './App'

// NOTE: Хелперы
var _$ = (s, b=document.body) => document.body.querySelector.apply(b, [s])
var _$$ = (s, b=document.body) => document.body.querySelectorAll.apply(b, [s])

$(document).ready(() => {
    App.fnStart()
});



