self.JSDON=function(e){"use strict";var t="http://www.w3.org/2000/svg",r=JSON.parse,a=function(e){var t=e.length-1,r=e[t];"number"==typeof r&&r<0?e[t]+=-1:e.push(-1)},n=function(e,t){var r=e.name,a=e.value;t.push(2,r),a&&t.push(a)},s=function(e,t,r){var s=e.attributes,o=e.childNodes,l=e.localName;t.push(1,l);for(var i=0,h=s.length;i<h;i++)n(s[i],t);for(var m=0,u=o.length;m<u;m++)c(o[m],t,r);a(t)},o=function(e,t,r){for(var n=e.childNodes,s=0,o=n.length;s<o;s++)c(n[s],t,r);a(t)},c=function(e,t,r){var a=e.nodeType;switch(a){case 1:r(e)&&s(e,t,r);break;case 3:case 8:r(e)&&t.push(a,e.textContent);break;case 11:case 9:r(e)&&(t.push(a),o(e,t,r));break;case 10:r(e)&&t.push(a,e.name)}},l=function(){return!0};return e.fromJSON=function(e){for(var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:document,n="string"==typeof e?r(e):e,s=n.length,o=a.createDocumentFragment(),c=o,l=!1,i=a,h=!0,m=0;m<s;){var u=n[m++];switch(u){case 1:var p=n[m++],f=p.toLowerCase();(h||f!==c.localName.toLowerCase())&&(c=c.appendChild("svg"===f||"ownerSVGElement"in c?i.createElementNS(t,p):i.createElement(p))),h=!0;break;case 2:var d=n[m++],v=m<s&&"string"==typeof n[m]?n[m++]:"";if("is"===d){for(var g=i.createElement(c.localName,{is:v}),b=c,N=b.attributes,w=N.length,k=0;k<w;k++)g.setAttributeNode(N[k]);c.parentNode.replaceChild(g,c),c=g}else c.setAttribute(d,v);break;case 3:c.appendChild(i.createTextNode(n[m++]));break;case 8:c.appendChild(i.createComment(n[m++]));break;case 9:var C=new a.defaultView.DOMParser;if(10===n[m])switch(m++,n[m++]){case"html":case"HTML":i=C.parseFromString("<!DOCTYPE html><html></html>","text/html");break;case"svg":case"SVG":i=C.parseFromString("<!DOCTYPE svg><svg />","image/svg+xml");break;default:i=C.parseFromString("<root />","text/xml")}else i=C.parseFromString("<html></html>","text/html");c=i.documentElement,h=!1;break;case 11:l=!0;break;default:do{u-=-1,c=c.parentNode||o}while(u<0)}}return l?o:i!==a?i:o.firstChild},e.toJSON=function(e,t){var r=[];return c(e,r,t||l),r},e}({});