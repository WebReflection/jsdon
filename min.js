self.jsdon=function(e){"use strict";var t=-1,r=JSON.parse,a=function(e,r){for(var a=0;r--&&e[r]===t;)a+=t;a!==t&&(e[++r]=a,e.splice(++r))},n=function(e,t){var r=e.name,a=e.value,n=e.nodeType;t.push(n,r),a&&t.push(a)},s=function(e,r,a){var s=e.attributes,o=e.childNodes,i=e.localName,l=e.nodeType;r.push(l,i);for(var u=0,h=s.length;u<h;u++)n(s[u],r);for(var p=0,d=o.length;p<d;p++)c(o[p],r,a);return r.push(t)},o=function(e,r,a){var n=e.childNodes,s=e.nodeType;r.push(s);for(var o=0,i=n.length;o<i;o++)c(n[o],r,a);return r.push(t)},c=function(e,t,r){var c=e.nodeType;switch(c){case 1:r(e)&&a(t,s(e,t,r));break;case 2:r(e)&&n(e,t);break;case 3:case 8:r(e)&&t.push(c,e.textContent);break;case 11:case 9:r(e)&&a(t,o(e,t,r));break;case 10:r(e)&&t.push(c,e.name||"")}},i=function(){return!0};return e.fromJSON=function(e){for(var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:document,n="string"==typeof e?r(e):e,s=n.length,o=a.createDocumentFragment(),c=o,i=!1,l=a,u=!0,h=0;h<s;){var p=n[h++];switch(p){case 1:var d=n[h++];(u||d.toLowerCase()!==c.localName)&&(c=c.appendChild(l.createElement(d))),u=!0;break;case 2:var m=n[h++],f=h<s&&"string"==typeof n[h]?n[h++]:"";if("is"===m){for(var v=l.createElement(c.localName,{is:f}),g=c,b=g.attributes,k=b.length,N=0;N<k;N++)v.setAttributeNode(b[N]);c.parentNode.replaceChild(v,c),c=v}else c.setAttribute(m,f);break;case 3:c.appendChild(l.createTextNode(n[h++]));break;case 8:c.appendChild(l.createComment(n[h++]));break;case 9:if(10===n[h]){h++;var C=new a.defaultView.DOMParser;switch(n[h++]){case"html":case"HTML":l=C.parseFromString("<!DOCTYPE html><html></html>","text/html");break;case"svg":case"SVG":l=C.parseFromString("<!DOCTYPE svg><svg />","image/svg+xml");break;default:l=C.parseFromString("<root />","text/xml")}}else l=parser.parseFromString("","text/html");c=l.documentElement,u=!1;break;case 11:i=!0;break;default:do{p-=t,c=c.parentNode||o}while(p<0)}}return i?o:l!==a?l:o.firstChild},e.toJSON=function(e,t){var r=[];return c(e,r,t||i),r},e}({});