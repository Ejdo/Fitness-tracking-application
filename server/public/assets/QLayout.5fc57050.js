import{c as L,h as I,a as _}from"./dom.543f5459.js";import{e as G,f as R,s as D,g as h,h as g,l as N,p as J,j as $,t as q,u as T,v as E,n as V,x as Q,y as p,z as k,A as W,B as x,C as X}from"./index.10d3f647.js";import{g as Y,a as Z,b as ee,c as P}from"./scroll.fe020b7e.js";var ae=L({name:"QPageContainer",setup(t,{slots:m}){const{proxy:{$q:i}}=$(),e=G(N,R);if(e===R)return console.error("QPageContainer needs to be child of QLayout"),R;D(J,!0);const l=h(()=>{const a={};return e.header.space===!0&&(a.paddingTop=`${e.header.size}px`),e.right.space===!0&&(a[`padding${i.lang.rtl===!0?"Left":"Right"}`]=`${e.right.size}px`),e.footer.space===!0&&(a.paddingBottom=`${e.footer.size}px`),e.left.space===!0&&(a[`padding${i.lang.rtl===!0?"Right":"Left"}`]=`${e.left.size}px`),a});return()=>g("div",{class:"q-page-container",style:l.value},I(m.default))}});const{passive:j}=Q,te=["both","horizontal","vertical"];var ne=L({name:"QScrollObserver",props:{axis:{type:String,validator:t=>te.includes(t),default:"vertical"},debounce:[String,Number],scrollTarget:{default:void 0}},emits:["scroll"],setup(t,{emit:m}){const i={position:{top:0,left:0},direction:"down",directionChanged:!1,delta:{top:0,left:0},inflectionPoint:{top:0,left:0}};let e=null,l,a;q(()=>t.scrollTarget,()=>{r(),f()});function c(){e!==null&&e();const v=Math.max(0,Z(l)),y=ee(l),u={top:v-i.position.top,left:y-i.position.left};if(t.axis==="vertical"&&u.top===0||t.axis==="horizontal"&&u.left===0)return;const w=Math.abs(u.top)>=Math.abs(u.left)?u.top<0?"up":"down":u.left<0?"left":"right";i.position={top:v,left:y},i.directionChanged=i.direction!==w,i.delta=u,i.directionChanged===!0&&(i.direction=w,i.inflectionPoint=i.position),m("scroll",{...i})}function f(){l=Y(a,t.scrollTarget),l.addEventListener("scroll",o,j),o(!0)}function r(){l!==void 0&&(l.removeEventListener("scroll",o,j),l=void 0)}function o(v){if(v===!0||t.debounce===0||t.debounce==="0")c();else if(e===null){const[y,u]=t.debounce?[setTimeout(c,t.debounce),clearTimeout]:[requestAnimationFrame(c),cancelAnimationFrame];e=()=>{u(y),e=null}}}const{proxy:d}=$();return q(()=>d.$q.lang.rtl,c),T(()=>{a=d.$el.parentNode,f()}),E(()=>{e!==null&&e(),r()}),Object.assign(d,{trigger:o,getPosition:()=>i}),V}});function oe(){const t=p(!k.value);return t.value===!1&&T(()=>{t.value=!0}),t}const A=typeof ResizeObserver!="undefined",M=A===!0?{}:{style:"display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;",url:"about:blank"};var B=L({name:"QResizeObserver",props:{debounce:{type:[String,Number],default:100}},emits:["resize"],setup(t,{emit:m}){let i=null,e,l={width:-1,height:-1};function a(r){r===!0||t.debounce===0||t.debounce==="0"?c():i===null&&(i=setTimeout(c,t.debounce))}function c(){if(clearTimeout(i),i=null,e){const{offsetWidth:r,offsetHeight:o}=e;(r!==l.width||o!==l.height)&&(l={width:r,height:o},m("resize",l))}}const{proxy:f}=$();if(A===!0){let r;const o=d=>{e=f.$el.parentNode,e?(r=new ResizeObserver(a),r.observe(e),c()):d!==!0&&W(()=>{o(!0)})};return T(()=>{o()}),E(()=>{clearTimeout(i),r!==void 0&&(r.disconnect!==void 0?r.disconnect():e&&r.unobserve(e))}),V}else{let d=function(){clearTimeout(i),o!==void 0&&(o.removeEventListener!==void 0&&o.removeEventListener("resize",a,Q.passive),o=void 0)},v=function(){d(),e&&e.contentDocument&&(o=e.contentDocument.defaultView,o.addEventListener("resize",a,Q.passive),c())};const r=oe();let o;return T(()=>{W(()=>{e=f.$el,e&&v()})}),E(d),f.trigger=a,()=>{if(r.value===!0)return g("object",{style:M.style,tabindex:-1,type:"text/html",data:M.url,"aria-hidden":"true",onLoad:v})}}}}),se=L({name:"QLayout",props:{container:Boolean,view:{type:String,default:"hhh lpr fff",validator:t=>/^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(t.toLowerCase())},onScroll:Function,onScrollHeight:Function,onResize:Function},setup(t,{slots:m,emit:i}){const{proxy:{$q:e}}=$(),l=p(null),a=p(e.screen.height),c=p(t.container===!0?0:e.screen.width),f=p({position:0,direction:"down",inflectionPoint:0}),r=p(0),o=p(k.value===!0?0:P()),d=h(()=>"q-layout q-layout--"+(t.container===!0?"containerized":"standard")),v=h(()=>t.container===!1?{minHeight:e.screen.height+"px"}:null),y=h(()=>o.value!==0?{[e.lang.rtl===!0?"left":"right"]:`${o.value}px`}:null),u=h(()=>o.value!==0?{[e.lang.rtl===!0?"right":"left"]:0,[e.lang.rtl===!0?"left":"right"]:`-${o.value}px`,width:`calc(100% + ${o.value}px)`}:null);function w(n){if(t.container===!0||document.qScrollPrevented!==!0){const s={position:n.position.top,direction:n.direction,directionChanged:n.directionChanged,inflectionPoint:n.inflectionPoint.top,delta:n.delta.top};f.value=s,t.onScroll!==void 0&&i("scroll",s)}}function K(n){const{height:s,width:b}=n;let z=!1;a.value!==s&&(z=!0,a.value=s,t.onScrollHeight!==void 0&&i("scrollHeight",s),H()),c.value!==b&&(z=!0,c.value=b),z===!0&&t.onResize!==void 0&&i("resize",n)}function U({height:n}){r.value!==n&&(r.value=n,H())}function H(){if(t.container===!0){const n=a.value>r.value?P():0;o.value!==n&&(o.value=n)}}let S;const O={instances:{},view:h(()=>t.view),isContainer:h(()=>t.container),rootRef:l,height:a,containerHeight:r,scrollbarWidth:o,totalWidth:h(()=>c.value+o.value),rows:h(()=>{const n=t.view.toLowerCase().split(" ");return{top:n[0].split(""),middle:n[1].split(""),bottom:n[2].split("")}}),header:x({size:0,offset:0,space:!1}),right:x({size:300,offset:0,space:!1}),footer:x({size:0,offset:0,space:!1}),left:x({size:300,offset:0,space:!1}),scroll:f,animate(){S!==void 0?clearTimeout(S):document.body.classList.add("q-body--layout-animate"),S=setTimeout(()=>{document.body.classList.remove("q-body--layout-animate"),S=void 0},155)},update(n,s,b){O[n][s]=b}};if(D(N,O),P()>0){let b=function(){n=null,s.classList.remove("hide-scrollbar")},z=function(){if(n===null){if(s.scrollHeight>e.screen.height)return;s.classList.add("hide-scrollbar")}else clearTimeout(n);n=setTimeout(b,300)},C=function(F){n!==null&&F==="remove"&&(clearTimeout(n),b()),window[`${F}EventListener`]("resize",z)},n=null;const s=document.body;q(()=>t.container!==!0?"add":"remove",C),t.container!==!0&&C("add"),X(()=>{C("remove")})}return()=>{const n=_(m.default,[g(ne,{onScroll:w}),g(B,{onResize:K})]),s=g("div",{class:d.value,style:v.value,ref:t.container===!0?void 0:l,tabindex:-1},n);return t.container===!0?g("div",{class:"q-layout-container overflow-hidden",ref:l},[g(B,{onResize:U}),g("div",{class:"absolute-full",style:y.value},[g("div",{class:"scroll",style:u.value},[s])])]):s}}});export{se as Q,ae as a,B as b};
