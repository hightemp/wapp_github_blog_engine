
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import $ from "jquery";
import { encode, decode } from 'js-base64';

import Quill from 'quill'
import 'quill/dist/quill.snow.css'

import { App } from 'App'

// NOTE: Хелперы

var fnGetUpdateMessage = (() => "update: "+(new Date()))
var _$ = (s, b=document.body) => document.body.querySelector.apply(b, [s])
var _$$ = (s, b=document.body) => document.body.querySelectorAll.apply(b, [s])

$(document).ready(() => {
    App.fnStart()
});



