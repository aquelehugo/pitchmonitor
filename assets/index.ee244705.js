const he=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))y(r);new MutationObserver(r=>{for(const g of r)if(g.type==="childList")for(const s of g.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&y(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const g={};return r.integrity&&(g.integrity=r.integrity),r.referrerpolicy&&(g.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?g.credentials="include":r.crossorigin==="anonymous"?g.credentials="omit":g.credentials="same-origin",g}function y(r){if(r.ep)return;r.ep=!0;const g=o(r);fetch(r.href,g)}};he();const C=[["C2",65.41],["C#2/Db2",69.3],["D2",73.42],["D#2/Eb2",77.78],["E2",82.41],["F2",87.31],["F#2/Gb2",92.5],["G2",98],["G#2/Ab2",103.83],["A2",110],["A#2/Bb2",116.54],["B2",123.47],["C3",130.81],["C#3/Db3",138.59],["D3",146.83],["D#3/Eb3",155.56],["E3",164.81],["F3",174.61],["F#3/Gb3",185],["G3",196],["G#3/Ab3",207.65],["A3",220],["A#3/Bb3",233.08],["B3",246.94],["C4",261.63],["C#4/Db4",277.18],["D4",293.66],["D#4/Eb4",311.13],["E4",329.63],["F4",349.23],["F#4/Gb4",369.99],["G4",392],["G#4/Ab4",415.3],["A4",440],["A#4/Bb4",466.16],["B4",493.88],["C5",523.25],["C#5/Db5",554.37],["D5",587.33],["D#5/Eb5",622.25],["E5",659.25],["F5",698.46],["F#5/Gb5",739.99],["G5",783.99],["G#5/Ab5",830.61],["A5",880],["A#5/Bb5",932.33],["B5",987.77]];var D=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},A={},Q={},U=D&&D.__assign||function(){return U=Object.assign||function(n){for(var t,o=1,y=arguments.length;o<y;o++){t=arguments[o];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},U.apply(this,arguments)};Object.defineProperty(Q,"__esModule",{value:!0});var ue={threshold:.1,sampleRate:44100,probabilityThreshold:.1};function ge(n){n===void 0&&(n={});var t=U(U({},ue),n),o=t.threshold,y=t.sampleRate,r=t.probabilityThreshold;return function(s){var e;for(e=1;e<s.length;e*=2);e/=2;for(var u=e/2,l=new Float32Array(u),M=0,c,a=0;a<u;a++)l[a]=0;for(var a=1;a<u;a++)for(var b=0;b<u;b++){var _=s[b]-s[b+a];l[a]+=_*_}l[0]=1,l[1]=1;for(var d=0,a=1;a<u;a++)d+=l[a],l[a]*=a/d;for(c=2;c<u;c++)if(l[c]<o){for(;c+1<u&&l[c+1]<l[c];)c++;M=1-l[c];break}if(c===u||l[c]>=o||M<r)return null;var m,i,h;if(c<1?i=c:i=c-1,c+1<u?h=c+1:h=c,i===c)l[c]<=l[h]?m=c:m=h;else if(h===c)l[c]<=l[i]?m=c:m=i;else{var v=l[i],f=l[c],p=l[h];m=c+(p-v)/(2*(2*f-p-v))}return y/m}}Q.YIN=ge;var K={},I=D&&D.__assign||function(){return I=Object.assign||function(n){for(var t,o=1,y=arguments.length;o<y;o++){t=arguments[o];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},I.apply(this,arguments)};Object.defineProperty(K,"__esModule",{value:!0});var pe={sampleRate:44100,minFrequency:82,maxFrequency:1e3,ratio:5,sensitivity:.1};function ye(n){n===void 0&&(n={});var t=I(I({},pe),n),o=t.sampleRate,y=t.minFrequency,r=t.maxFrequency,g=t.sensitivity,s=t.ratio,e=[],u=Math.ceil(o/y),l=Math.floor(o/r);return function(c){var a=c.length,b=0,_=1/0,d=-1/0,m,i,h,v,f,p,F,L;for(v=0;v<a;v++)if(l<=v&&v<=u){for(F=0,L=v,b=0,m=[],i=[];F<a-v;b++,L++,F++)m[b]=c[F],i[b]=c[L];var E=m.length;for(h=[],p=0;p<E;p++)h[p]=m[p]-i[p];var R=0;for(p=0;p<E;p++)R+=Math.abs(h[p]);e[v]=R}for(f=l;f<u;f++)e[f]<_&&(_=e[f]),e[f]>d&&(d=e[f]);var O=Math.round(g*(d-_)+_);for(f=l;f<=u&&e[f]>O;f++);var x=l/2;_=e[f];var w=f;for(v=f-1;v<f+x&&v<=u;v++)e[v]<_&&(_=e[v],w=v);return Math.round(e[w]*s)<d?o/w:null}}K.AMDF=ye;var V={},G=D&&D.__assign||function(){return G=Object.assign||function(n){for(var t,o=1,y=arguments.length;o<y;o++){t=arguments[o];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},G.apply(this,arguments)};Object.defineProperty(V,"__esModule",{value:!0});var re={sampleRate:44100};function me(n){n===void 0&&(n=re);var t=G(G({},re),n),o=t.sampleRate;return function(r){var g=r.length,s=0,e,u,l,M;for(e=0;e<g;e++)M=r[e],s+=M*M;if(s=Math.sqrt(s/g),s<.01)return-1;var c=0,a=g-1,b=.2;for(e=0;e<g/2;e++)if(Math.abs(r[e])<b){c=e;break}for(e=1;e<g/2;e++)if(Math.abs(r[g-e])<b){a=g-e;break}var _=r.slice(c,a),d=_.length,m=new Array(d).fill(0);for(e=0;e<d;e++)for(u=0;u<d-e;u++)m[e]=m[e]+_[u]*_[u+e];for(l=0;m[l]>m[l+1];)l++;var i=-1,h=-1;for(e=l;e<d;e++)m[e]>i&&(i=m[e],h=e);var v=h,f=m[v-1],p=m[v],F=m[v+1],L=(f+F-2*p)/2,E=(F-f)/2;return L&&(v=v-E/(2*L)),o/v}}V.ACF2PLUS=me;var J={},z=D&&D.__assign||function(){return z=Object.assign||function(n){for(var t,o=1,y=arguments.length;o<y;o++){t=arguments[o];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},z.apply(this,arguments)};Object.defineProperty(J,"__esModule",{value:!0});var be=6,de=3e3,_e=3,Me=.75,Fe={sampleRate:44100};function Le(n){n===void 0&&(n={});var t=z(z({},Fe),n),o=t.sampleRate;return function(r){for(var g=[],s=[],e=r.length,u=null,l=0,M=0,c=0,a=0;a<e;a++){var b=r[a];l=l+b,c=Math.max(c,b),M=Math.min(M,b)}l/=e,M-=l,c-=l;for(var _=c>-1*M?c:-1*M,d=_*Me,m=0,i=-1,h=r.length,v,f,p;v=~~(o/(Math.pow(2,m)*de)),!(h<2);){var F=void 0,L=-1e3,E=-1e6,R=-1e6,O=!1,x=!1;p=0,f=0;for(var a=2;a<h;a++){var w=r[a]-l,k=r[a-1]-l;k<=0&&w>0&&(O=!0),k>=0&&w<0&&(x=!0),F=w-k,L>-1e3&&(x&&L<0&&F>=0&&Math.abs(w)>=d&&a>E+v&&(g[p++]=a,E=a,x=!1),O&&L>0&&F<=0&&Math.abs(w)>=d&&a>R+v&&(s[f++]=a,R=a,O=!1)),L=F}if(p===0&&f===0)break;for(var B=void 0,T=[],a=0;a<h;a++)T[a]=0;for(var a=0;a<p;a++)for(var P=1;P<_e;P++)a+P<p&&(B=Math.abs(g[a]-g[a+P]),T[B]+=1);for(var q=-1,W=-1,a=0;a<h;a++){for(var N=0,P=-1*v;P<=v;P++)a+P>=0&&a+P<h&&(N+=T[a+P]);N===W?a===2*q&&(q=a):N>W&&(W=N,q=a)}for(var j=0,ee=0,P=-v;P<=v;P++)if(q+P>=0&&q+P<e){var X=T[q+P];X>0&&(ee+=X,j+=(q+P)*X)}if(j/=ee,i>-1&&Math.abs(j*2-i)<=2*v){u=o/(Math.pow(2,m-1)*i);break}if(i=j,m++,m>=be||h<2)break;var H=r.subarray(0);h===T.length&&(H=new Float32Array(h/2));for(var a=0;a<h/2;a++)H[a]=(r[2*a]+r[2*a+1])/2;r=H,h/=2}return u}}J.DynamicWavelet=Le;var Z={},Y=D&&D.__assign||function(){return Y=Object.assign||function(n){for(var t,o=1,y=arguments.length;o<y;o++){t=arguments[o];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},Y.apply(this,arguments)};Object.defineProperty(Z,"__esModule",{value:!0});var Pe={bufferSize:1024,cutoff:.97,sampleRate:44100};function Se(n){n===void 0&&(n={});var t=Y(Y({},Pe),n),o=t.bufferSize,y=t.cutoff,r=t.sampleRate,g=.5,s=80,e=new Float32Array(o),u=new Float32Array(o),l,M,c=[],a=[],b=[];function _(i){var h,v;u[0]=i[0]*i[0];for(var f=1;f<i.length;f+=1)u[f]=i[f]*i[f]+u[f-1];for(var p=0;p<i.length;p++){h=0,v=u[i.length-1-p]+u[i.length-1]-u[p];for(var f=0;f<i.length-p;f++)h+=i[f]*i[f+p];e[p]=2*h/v}}function d(i){var h=e[i-1],v=e[i],f=e[i+1],p=i,F=f+h-2*v;if(F===0)l=p,M=v;else{var L=h-f;l=p+L/(2*F),M=v-L*L/(8*F)}}function m(){for(var i=0,h=0;i<(e.length-1)/3&&e[i]>0;)i++;for(;i<e.length-1&&e[i]<=0;)i++;for(i==0&&(i=1);i<e.length-1;)if(e[i]>e[i-1]&&e[i]>=e[i+1]&&(h==0||e[i]>e[h])&&(h=i),i++,i<e.length-1&&e[i]<=0)for(h>0&&(c.push(h),h=0);i<e.length-1&&e[i]<=0;)i++;h>0&&c.push(h)}return function(h){var v;c=[],a=[],b=[],_(h),m();for(var f=-1/0,p=0;p<c.length;p++){var F=c[p];f=Math.max(f,e[F]),e[F]>g&&(d(F),b.push(M),a.push(l),f=Math.max(f,M))}if(a.length){for(var L=y*f,E=0,p=0;p<b.length;p++)if(b[p]>=L){E=p;break}var R=a[E],O=r/R;O>s?v=O:v=-1}else v=-1;return{probability:f,freq:v}}}Z.Macleod=Se;var te={};(function(n){var t=D&&D.__assign||function(){return t=Object.assign||function(r){for(var g,s=1,e=arguments.length;s<e;s++){g=arguments[s];for(var u in g)Object.prototype.hasOwnProperty.call(g,u)&&(r[u]=g[u])}return r},t.apply(this,arguments)};Object.defineProperty(n,"__esModule",{value:!0}),n.DEFAULT_FREQUENCIES_PARAMS={tempo:120,quantization:4,sampleRate:44100};function o(r,g){var s=r.map(function(b){return b(g)}).filter(function(b){return b!==null}).sort(function(b,_){return b-_});if(s.length===1)return s[0];if(s.length===2){var e=s[0],u=s[1];return e*2>u?Math.sqrt(e*u):e}else{var e=s[0],u=s[1],l=s[s.length-2],M=s[s.length-1],c=e*2>u?s:s.slice(1),a=l*2>M?c:c.slice(0,-1);return Math.pow(a.reduce(function(d,m){return d*m},1),1/a.length)}}function y(r,g,s){s===void 0&&(s={});var e=t(t({},n.DEFAULT_FREQUENCIES_PARAMS),s),u=e.tempo,l=e.quantization,M=e.sampleRate,c=g.length,a=Math.round(M*60/(l*u)),b;Array.isArray(r)?b=o.bind(null,r):b=r;for(var _=[],d=0,m=c-a;d<=m;d+=a){var i=g.slice(d,d+a),h=b(i);_.push(h)}return _}n.frequencies=y})(te);Object.defineProperty(A,"__esModule",{value:!0});var ae=Q;A.YIN=ae.YIN;var ne=K,De=A.AMDF=ne.AMDF,ie=V;A.ACF2PLUS=ie.ACF2PLUS;var oe=J;A.DynamicWavelet=oe.DynamicWavelet;var ce=Z;A.Macleod=ce.Macleod;var se=te;A.frequencies=se.frequencies;A.default={YIN:ae.YIN,AMDF:ne.AMDF,ACF2PLUS:ie.ACF2PLUS,DynamicWavelet:oe.DynamicWavelet,Macleod:ce.Macleod,frequencies:se.frequencies};const Ee=async()=>{const n=await navigator.mediaDevices.getUserMedia({audio:!0}),t=new window.AudioContext,o=t.createMediaStreamSource(n),y=t.createScriptProcessor(0,1,1);o.connect(y),y.connect(t.destination);const r=[];return y.onaudioprocess=s=>{const e=s.inputBuffer.getChannelData(0),u=De({minFrequency:C[0][1],sampleRate:t.sampleRate,maxFrequency:C.at(-1)[1]})(e);u&&r.forEach(l=>l(u))},{addPitchListener:s=>{typeof s=="function"&&r.push(s)}}},[we]=C,[Ne,Oe]=we,le=n=>t=>Math.log2(n)*t.pitchLines.baseDistance-Math.log2(Oe)*t.pitchLines.baseDistance+t.pitchLines.offset.y,Ae={pitchSize:{width:5,height:2},lastPitch:{color:"",position:{x:0,y:0}},pitchLines:{offset:{x:70,y:50},baseDistance:300}},ve={value:Ae},Re=n=>{ve.value=n},$=()=>ve.value,qe=n=>C.some(t=>{const[o,y]=t;return Math.abs(y-n)<=.01*y}),xe=(n,t)=>o=>{const{lastPitch:y,pitchSize:r,pitchLines:g}=o,s=y.position.x<g.offset.x?g.offset.x:y.position.x+r.width;return{...o,lastPitch:{position:{x:s>t?g.offset.x:s,y:le(n)(o)-r.height/2},color:qe(n)?"green":"red"}}};document.querySelector("#app").innerHTML=`
  <div>
    <h1>Pitch Monitor</h1>
    <div>last pitch: <span id="pitch">N/A</span></div>
    <canvas width="1000" height="1300" />
  </div>
`;const S=document.querySelector("canvas").getContext("2d"),Te=n=>{S.fillStyle="blue",S.font="10px",C.forEach(t=>{const[o,y]=t,r=le(y)(n);S.fillText(o,8,r),S.fillRect(n.pitchLines.offset.x,r,S.canvas.width,1)})},fe=n=>{S.fillStyle="white",S.fillRect(0,0,S.canvas.width,S.canvas.height),Te(n)},Ce=n=>{const{lastPitch:t,pitchSize:o,pitchLines:y}=n;t.position.x===y.offset.x&&fe(n),S.fillStyle=t.color,S.fillRect(t.position.x,t.position.y,o.width,o.height)};fe($());Ee().then(n=>{n.addPitchListener(t=>{document.getElementById("pitch").innerHTML=t,Re(xe(t,S.canvas.width)($())),Ce($())})});