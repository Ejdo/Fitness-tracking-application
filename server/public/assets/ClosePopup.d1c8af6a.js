import{h as n,i as p}from"./QBtn.d1f140d8.js";import{c,h as i,d}from"./dom.543f5459.js";import{g as l,h as u,N as h}from"./index.10d3f647.js";import{y as m,z as f}from"./QDialog.5f70cc3d.js";var g=c({name:"QCardActions",props:{...n,vertical:Boolean},setup(e,{slots:t}){const o=p(e),r=l(()=>`q-card__actions ${o.value} q-card__actions--${e.vertical===!0?"vert column":"horiz row"}`);return()=>u("div",{class:r.value},i(t.default))}});function a(e){if(e===!1)return 0;if(e===!0||e===void 0)return 1;const t=parseInt(e,10);return isNaN(t)?0:t}var q=d({name:"close-popup",beforeMount(e,{value:t}){const o={depth:a(t),handler(r){o.depth!==0&&setTimeout(()=>{const s=m(e);s!==void 0&&f(s,r,o.depth)})},handlerKey(r){h(r,13)===!0&&o.handler(r)}};e.__qclosepopup=o,e.addEventListener("click",o.handler),e.addEventListener("keyup",o.handlerKey)},updated(e,{value:t,oldValue:o}){t!==o&&(e.__qclosepopup.depth=a(t))},beforeUnmount(e){const t=e.__qclosepopup;e.removeEventListener("click",t.handler),e.removeEventListener("keyup",t.handlerKey),delete e.__qclosepopup}});export{q as C,g as Q};