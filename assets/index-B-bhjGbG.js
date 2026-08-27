(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();const Ql="harborlight-sound",Rc=.68;function ru(){try{return typeof window>"u"||window.localStorage.getItem(Ql)!=="off"}catch{return!0}}function ou(s){try{window.localStorage.setItem(Ql,s?"on":"off")}catch{}}function Fi(s,t,e){return Number.isFinite(s)?Math.min(e,Math.max(t,s)):t}function au(){if(typeof window>"u")return null;const s=window;return window.AudioContext??s.webkitAudioContext??null}function Js(s){try{s.disconnect()}catch{}}function lo(s){try{s.stop()}catch{}}class cu{context=null;master=null;ambience=null;voices=new Set;enabled=ru();disposed=!1;sequence=0;isEnabled(){return this.enabled}setEnabled(t){if(this.disposed||this.enabled===t)return;if(this.enabled=t,ou(t),t){this.unlock();return}this.stopAmbience(),this.stopVoices();const e=this.context,n=this.master;e&&n&&e.state!=="closed"&&(n.gain.cancelScheduledValues(e.currentTime),n.gain.setTargetAtTime(0,e.currentTime,.025))}unlock(){if(!this.enabled||this.disposed)return;const t=this.ensureContext();if(t){if(t.state==="running"){this.restoreMaster(),this.startAmbience();return}t.state==="suspended"&&t.resume().then(()=>{!this.disposed&&this.enabled&&t.state==="running"&&(this.restoreMaster(),this.startAmbience())}).catch(()=>{})}}foundation(t=0){const e=this.runningContext();if(!e)return;const n=e.currentTime,i=this.variation(t+11);this.noiseTap(n,.115,560+i*70,.032,"lowpass"),this.tone(118+i*5,91,n,.16,.038,"sine"),this.tone(236+t*2,218,n+.018,.09,.014,"triangle")}build(t,e){const n=this.runningContext();if(!n)return;const i=Math.round(Fi(t,0,31)),r=Math.round(Fi(e,0,12)),o=[0,2,4,7,9],a=o[i%o.length]??0,l=this.variation(i+r*17),c=184*2**((a+r*1.65)/12)*(1+l*.012),h=n.currentTime;this.tone(c,c*.982,h,.13,.048,"triangle"),this.tone(c*1.498,c*1.47,h+.024,.085,.019,"sine"),this.noiseTap(h,.047,1280+r*55,.026,"bandpass")}bridge(t=1){const e=this.runningContext();if(!e)return;const n=Fi(t,1,8),i=this.variation(Math.round(n*23)),r=286+n*7+i*6,o=e.currentTime;this.tone(r,r*.993,o,.18,.032,"triangle"),this.tone(r*1.682,r*1.64,o+.045,.2,.019,"sine"),this.tone(r*2.01,r*1.96,o+.09,.15,.011,"sine"),this.noiseTap(o,.075,2200,.014,"highpass")}remove(t){const e=this.runningContext();if(!e)return;const n=Fi(t,0,12),i=this.variation(Math.round(n*29)),r=e.currentTime,o=152+n*8+i*4;this.tone(o,74+n*2,r,.21,.04,"triangle"),this.noiseTap(r+.012,.12,390+n*18,.044,"lowpass")}water(t=1){const e=this.runningContext();if(!e)return;const n=Fi(t,.2,1.25),i=e.currentTime,r=this.variation(Math.round(n*37));if(n<=.52){this.noiseTap(i,.105,360+r*28,.018+n*.012,"lowpass"),this.tone(132+r*4,72,i+.008,.145,.013+n*.009,"sine");return}if(n<.75){this.noiseTap(i,.07,980+r*85,.024+n*.011,"bandpass"),this.tone(176+r*5,122,i,.095,.014+n*.008,"triangle");return}this.noiseTap(i,.13,520+r*45,.028+n*.012,"lowpass"),this.noiseTap(i+.045,.105,1320+r*90,.012+n*.006,"bandpass"),this.tone(104+r*3,78,i,.17,.012+n*.007,"sine")}birdTakeoff(){const t=this.runningContext();if(!t)return;const e=t.currentTime;for(let n=0;n<3;n+=1)this.noiseTap(e+n*.052,.042,1450+n*260,.012-n*.002,"bandpass");this.noiseTap(e+.018,.12,2400,.006,"highpass")}ui(t="select"){const e=this.runningContext();if(!e)return;const i=typeof t=="number"?t:{select:520,undo:360,redo:460,open:575,close:430,"grid-on":640,"grid-off":350,save:700}[t],r=Fi(i,110,1800),o=e.currentTime;this.tone(r,r*.992,o,.06,.016,"sine")}dispose(){if(this.disposed)return;this.disposed=!0,this.stopAmbience(),this.stopVoices();const t=this.master,e=this.context;this.master=null,this.context=null,t&&Js(t),e&&e.state!=="closed"&&e.close().catch(()=>{})}ensureContext(){if(this.disposed||!this.enabled)return null;const t=this.context;if(t&&t.state!=="closed")return t;const e=au();if(!e)return null;try{const n=new e,i=n.createGain();return i.gain.value=Rc,i.connect(n.destination),this.context=n,this.master=i,n}catch{return this.context=null,this.master=null,null}}runningContext(){if(!this.enabled||this.disposed)return null;const t=this.ensureContext();return t?t.state!=="running"?(this.unlock(),null):(this.restoreMaster(),this.startAmbience(),t):null}restoreMaster(){const t=this.context,e=this.master;!t||!e||t.state==="closed"||(e.gain.cancelScheduledValues(t.currentTime),e.gain.setTargetAtTime(Rc,t.currentTime,.045))}tone(t,e,n,i,r,o){const a=this.context,l=this.master;if(!a||!l||a.state!=="running")return;const c=a.createOscillator(),h=a.createBiquadFilter(),u=a.createGain();c.type=o,c.frequency.setValueAtTime(Math.max(40,t),n),c.frequency.exponentialRampToValueAtTime(Math.max(40,e),n+i),h.type="lowpass",h.frequency.value=2600,h.Q.value=.35,u.gain.setValueAtTime(1e-4,n),u.gain.exponentialRampToValueAtTime(Math.max(1e-4,r),n+.006),u.gain.exponentialRampToValueAtTime(1e-4,n+i),c.connect(h).connect(u).connect(l),this.trackVoice(c,[c,h,u]),c.start(n),c.stop(n+i+.025)}noiseTap(t,e,n,i,r){const o=this.context,a=this.master;if(!o||!a||o.state!=="running")return;const l=Math.max(1,Math.ceil(o.sampleRate*e)),c=o.createBuffer(1,l,o.sampleRate),h=c.getChannelData(0);let u=(this.sequence+1)*73244475;for(let v=0;v<h.length;v+=1){u=Math.imul(u,1664525)+1013904223>>>0;const m=u/4294967295*2-1,p=1-v/h.length;h[v]=m*p*p}const d=o.createBufferSource(),f=o.createBiquadFilter(),g=o.createGain();d.buffer=c,f.type=r,f.frequency.value=Math.max(80,n),f.Q.value=r==="bandpass"?.8:.35,g.gain.value=Math.max(0,i),d.connect(f).connect(g).connect(a),this.trackVoice(d,[d,f,g]),d.start(t)}trackVoice(t,e){const n={source:t,nodes:e};this.voices.add(n),t.addEventListener("ended",()=>{this.voices.delete(n);for(const i of e)Js(i)},{once:!0})}stopVoices(){for(const t of this.voices){lo(t.source);for(const e of t.nodes)Js(e)}this.voices.clear()}startAmbience(){const t=this.context,e=this.master;if(!this.enabled||this.disposed||!t||!e||t.state!=="running"||this.ambience)return;const i=Math.ceil(t.sampleRate*8),r=t.createBuffer(2,i,t.sampleRate),o=t.createBuffer(2,i,t.sampleRate);for(let m=0;m<2;m+=1){const p=r.getChannelData(m),M=o.getChannelData(m),x=m===0?[.11,.48,.81]:[.16,.54,.86];let _=1831565813^m*2654435769,y=0,E=0;for(let T=0;T<i;T+=1){_=Math.imul(_,1664525)+1013904223>>>0;const A=_/4294967295*2-1;y=(y+A*.016)/1.016,E+=(A-E)*.075;const w=T/i,S=.72+Math.sin(w*Math.PI*2+m*1.7)*.18;p[T]=y*S*.72;let C=0;for(const P of x){const U=w-P;if(U>=0&&U<.105){const z=Math.min(1,U/.012),F=Math.exp(-U*30);C+=z*F}}M[T]=(A*.68+E*.32)*C*.27}}const a=t.createBufferSource(),l=t.createBufferSource(),c=t.createBiquadFilter(),h=t.createBiquadFilter(),u=t.createGain(),d=t.createGain(),f=t.createGain(),g=t.createOscillator(),v=t.createGain();a.buffer=r,l.buffer=o,a.loop=!0,l.loop=!0,c.type="lowpass",c.frequency.value=760,c.Q.value=.32,h.type="bandpass",h.frequency.value=1180,h.Q.value=.48,u.gain.value=.17,d.gain.value=.105,f.gain.value=.82,g.type="sine",g.frequency.value=.065,v.gain.value=.16,a.connect(c).connect(u).connect(f),l.connect(h).connect(d).connect(f),f.connect(e),g.connect(v).connect(f.gain),a.start(),l.start(),g.start(),this.ambience={sources:[a,l],nodes:[a,l,c,h,u,d,f,g,v],lfo:g}}stopAmbience(){const t=this.ambience;if(t){this.ambience=null;for(const e of t.sources)lo(e);lo(t.lfo);for(const e of t.nodes)Js(e)}}variation(t){this.sequence=this.sequence+1>>>0;let e=(this.sequence^Math.imul(t+1,2654435761))>>>0;return e^=e>>>16,e=Math.imul(e,2146121005),e^=e>>>15,(e>>>0)/4294967295*2-1}}const se=2.08,de=1.72,Vn=6,Ge=8,De={foundationHeight:.38,shorelineOverhang:.38,wallInset:.15,roofHeight:.72,roofOverhang:.14,bridgeDeckThickness:.14,bridgeClearance:0,bridgeRailHeight:.38,courtyardInset:.24,footprintJitter:.08},te=-.08,pi={waveSpeed:.72,shorelineCycle:3.8,shorelineTravel:.18,drainCycle:4.6,drainStreamLength:.34,drainRippleGrowth:1.9},ne={ink:3229772,sky:8634048,skyZenith:6860469,skyHorizon:14081994,fog:12112844,water:4097422,foam:14151397,foundation:9017748,foundationShadow:6585208,vegetation:6720616},rn={plasterRoughness:.84,trimRoughness:.62,roofRoughness:.72,stoneRoughness:.9,waterOpacity:.88,inkOpacity:.68},js=[72,76],ho=3,Ae=[{name:"Poppy",wall:15294297,wallShadow:12141383,trim:16767144,roof:13660242},{name:"Tangerine",wall:15895380,wallShadow:12803391,trim:16769460,roof:11685698},{name:"Butter",wall:15980395,wallShadow:13018699,trim:16773569,roof:13725778},{name:"Citron",wall:13162861,wallShadow:10005325,trim:16051395,roof:10187604},{name:"Sage",wall:9292160,wallShadow:6135664,trim:15133629,roof:6520677},{name:"Jade",wall:5422475,wallShadow:3312755,trim:14150588,roof:4684147},{name:"Lagoon",wall:5486509,wallShadow:3311498,trim:14150341,roof:4683398},{name:"Sky",wall:5615057,wallShadow:3702185,trim:14215634,roof:5860756},{name:"Periwinkle",wall:7442130,wallShadow:5795247,trim:14804181,roof:6643601},{name:"Heather",wall:10125251,wallShadow:7429278,trim:15261649,roof:7362419},{name:"Rose",wall:12875678,wallShadow:10047352,trim:15785422,roof:8409442},{name:"Clay",wall:13667189,wallShadow:10640722,trim:15720648,roof:8803405},{name:"Shell",wall:14854816,wallShadow:12155250,trim:16246741,roof:9592152},{name:"Limestone",wall:13616555,wallShadow:10327428,trim:15985366,roof:8023908},{name:"Chalk",wall:15131860,wallShadow:12039591,trim:16775391,roof:8485746}],lu=[{x:-3,z:-1,foundation:!0,level:1,color:4},{x:-2,z:-1,foundation:!0,level:1,color:3},{x:-3,z:0,foundation:!0,level:1,color:2},{x:-2,z:0,foundation:!0,level:2,color:2},{x:-1,z:1,foundation:!0,level:0,color:1},{x:0,z:-1,foundation:!0,level:1,color:8},{x:1,z:-1,foundation:!0,level:0,color:13},{x:2,z:-1,foundation:!0,level:2,color:8},{x:0,z:0,foundation:!0,level:2,color:1},{x:1,z:0,foundation:!0,level:3,color:0},{x:2,z:0,foundation:!0,level:1,color:11},{x:-3,z:1,foundation:!0,level:1,color:3},{x:-2,z:1,foundation:!0,level:0,color:13},{x:0,z:1,foundation:!0,level:0,color:1},{x:1,z:1,foundation:!0,level:2,color:1},{x:2,z:1,foundation:!0,level:1,color:11}];const Ka="180",hu=0,Pc=1,uu=2,th=1,eh=2,Wn=3,Kn=0,on=1,xe=2,tn=0,ns=1,Qo=2,Dc=3,Lc=4,nh=5,Yn=100,du=101,fu=102,pu=103,mu=104,ta=200,gu=201,vu=202,_u=203,ea=204,na=205,ih=206,xu=207,sh=208,Mu=209,yu=210,Su=211,wu=212,Eu=213,bu=214,ia=0,sa=1,ra=2,os=3,oa=4,aa=5,ca=6,la=7,rh=0,Tu=1,Au=2,li=0,oh=1,ah=2,ch=3,lh=4,hh=5,uh=6,Ja=7,dh=300,as=301,cs=302,ha=303,ua=304,to=306,Ri=1e3,Ti=1001,da=1002,nn=1003,Cu=1004,Qs=1005,en=1006,uo=1007,Ai=1008,Nn=1009,fh=1010,ph=1011,Hs=1012,ja=1013,Pi=1014,An=1015,ui=1016,Qa=1017,tc=1018,ls=1020,mh=35902,gh=35899,vh=1021,_h=1022,fn=1023,ks=1026,hs=1027,eo=1028,ec=1029,xh=1030,nc=1031,ic=1033,Ur=33776,Fr=33777,Or=33778,Br=33779,fa=35840,pa=35841,ma=35842,ga=35843,va=36196,_a=37492,xa=37496,Ma=37808,ya=37809,Sa=37810,wa=37811,Ea=37812,ba=37813,Ta=37814,Aa=37815,Ca=37816,Ra=37817,Pa=37818,Da=37819,La=37820,Ia=37821,Na=36492,Ua=36494,Fa=36495,Oa=36283,Ba=36284,za=36285,Ha=36286,Ru=3200,Pu=3201,sc=0,Du=1,oi="",Qe="srgb",us="srgb-linear",Gr="linear",fe="srgb",Oi=7680,Ic=519,Lu=512,Iu=513,Nu=514,Mh=515,Uu=516,Fu=517,Ou=518,Bu=519,Nc=35044,Uc="300 es",Dn=2e3,Vr=2001;class gs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const Ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Fc=1234567;const is=Math.PI/180,Gs=180/Math.PI;function Ii(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ye[s&255]+Ye[s>>8&255]+Ye[s>>16&255]+Ye[s>>24&255]+"-"+Ye[t&255]+Ye[t>>8&255]+"-"+Ye[t>>16&15|64]+Ye[t>>24&255]+"-"+Ye[e&63|128]+Ye[e>>8&255]+"-"+Ye[e>>16&255]+Ye[e>>24&255]+Ye[n&255]+Ye[n>>8&255]+Ye[n>>16&255]+Ye[n>>24&255]).toLowerCase()}function ee(s,t,e){return Math.max(t,Math.min(e,s))}function rc(s,t){return(s%t+t)%t}function zu(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Hu(s,t,e){return s!==t?(e-s)/(t-s):0}function Is(s,t,e){return(1-e)*s+e*t}function ku(s,t,e,n){return Is(s,t,1-Math.exp(-e*n))}function Gu(s,t=1){return t-Math.abs(rc(s,t*2)-t)}function Vu(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Wu(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Xu(s,t){return s+Math.floor(Math.random()*(t-s+1))}function qu(s,t){return s+Math.random()*(t-s)}function Yu(s){return s*(.5-Math.random())}function Zu(s){s!==void 0&&(Fc=s);let t=Fc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function $u(s){return s*is}function Ku(s){return s*Gs}function Ju(s){return(s&s-1)===0&&s!==0}function ju(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Qu(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function td(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),g=o((n-t)/2);switch(i){case"XYX":s.set(a*h,l*u,l*d,a*c);break;case"YZY":s.set(l*d,a*h,l*u,a*c);break;case"ZXZ":s.set(l*u,l*d,a*h,a*c);break;case"XZX":s.set(a*h,l*g,l*f,a*c);break;case"YXY":s.set(l*f,a*h,l*g,a*c);break;case"ZYZ":s.set(l*g,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function ji(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Je(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const me={DEG2RAD:is,RAD2DEG:Gs,generateUUID:Ii,clamp:ee,euclideanModulo:rc,mapLinear:zu,inverseLerp:Hu,lerp:Is,damp:ku,pingpong:Gu,smoothstep:Vu,smootherstep:Wu,randInt:Xu,randFloat:qu,randFloatSpread:Yu,seededRandom:Zu,degToRad:$u,radToDeg:Ku,isPowerOfTwo:Ju,ceilPowerOfTwo:ju,floorPowerOfTwo:Qu,setQuaternionFromProperEuler:td,normalize:Je,denormalize:ji};class mt{constructor(t=0,e=0){mt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ee(this.x,t.x,e.x),this.y=ee(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ee(this.x,t,e),this.y=ee(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ee(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ee(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Zs{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const d=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=v;return}if(u!==v||l!==d||c!==f||h!==g){let m=1-a;const p=l*d+c*f+h*g+u*v,M=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const y=Math.sqrt(x),E=Math.atan2(y,p*M);m=Math.sin(m*E)/y,a=Math.sin(a*E)/y}const _=a*M;if(l=l*m+d*_,c=c*m+f*_,h=h*m+g*_,u=u*m+v*_,m===1-a){const y=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=y,c*=y,h*=y,u*=y}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-a*f,t[e+2]=c*g+h*f+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),d=l(n/2),f=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ee(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(t=0,e=0,n=0){I.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Oc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Oc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ee(this.x,t.x,e.x),this.y=ee(this.y,t.y,e.y),this.z=ee(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ee(this.x,t,e),this.y=ee(this.y,t,e),this.z=ee(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ee(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return fo.copy(this).projectOnVector(t),this.sub(fo)}reflect(t){return this.sub(fo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ee(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fo=new I,Oc=new Zs;class jt{constructor(t,e,n,i,r,o,a,l,c){jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=i[0],m=i[3],p=i[6],M=i[1],x=i[4],_=i[7],y=i[2],E=i[5],T=i[8];return r[0]=o*v+a*M+l*y,r[3]=o*m+a*x+l*E,r[6]=o*p+a*_+l*T,r[1]=c*v+h*M+u*y,r[4]=c*m+h*x+u*E,r[7]=c*p+h*_+u*T,r[2]=d*v+f*M+g*y,r[5]=d*m+f*x+g*E,r[8]=d*p+f*_+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=e*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(i*c-h*n)*v,t[2]=(a*n-i*o)*v,t[3]=d*v,t[4]=(h*e-i*l)*v,t[5]=(i*r-a*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(po.makeScale(t,e)),this}rotate(t){return this.premultiply(po.makeRotation(-t)),this}translate(t,e){return this.premultiply(po.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const po=new jt;function yh(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Wr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function ed(){const s=Wr("canvas");return s.style.display="block",s}const Bc={};function Vs(s){s in Bc||(Bc[s]=!0,console.warn(s))}function nd(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const zc=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Hc=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function id(){const s={enabled:!0,workingColorSpace:us,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===fe&&(i.r=$n(i.r),i.g=$n(i.g),i.b=$n(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===fe&&(i.r=ss(i.r),i.g=ss(i.g),i.b=ss(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===oi?Gr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Vs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Vs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[us]:{primaries:t,whitePoint:n,transfer:Gr,toXYZ:zc,fromXYZ:Hc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Qe},outputColorSpaceConfig:{drawingBufferColorSpace:Qe}},[Qe]:{primaries:t,whitePoint:n,transfer:fe,toXYZ:zc,fromXYZ:Hc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Qe}}}),s}const oe=id();function $n(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ss(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Bi;class sd{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Bi===void 0&&(Bi=Wr("canvas")),Bi.width=t.width,Bi.height=t.height;const i=Bi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=Bi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Wr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=$n(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor($n(e[n]/255)*255):e[n]=$n(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let rd=0;class oc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:rd++}),this.uuid=Ii(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(mo(i[o].image)):r.push(mo(i[o]))}else r=mo(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function mo(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?sd.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let od=0;const go=new I;class $e extends gs{constructor(t=$e.DEFAULT_IMAGE,e=$e.DEFAULT_MAPPING,n=Ti,i=Ti,r=en,o=Ai,a=fn,l=Nn,c=$e.DEFAULT_ANISOTROPY,h=oi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:od++}),this.uuid=Ii(),this.name="",this.source=new oc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new mt(0,0),this.repeat=new mt(1,1),this.center=new mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(go).x}get height(){return this.source.getSize(go).y}get depth(){return this.source.getSize(go).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==dh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ri:t.x=t.x-Math.floor(t.x);break;case Ti:t.x=t.x<0?0:1;break;case da:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ri:t.y=t.y-Math.floor(t.y);break;case Ti:t.y=t.y<0?0:1;break;case da:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}$e.DEFAULT_IMAGE=null;$e.DEFAULT_MAPPING=dh;$e.DEFAULT_ANISOTROPY=1;class Ee{constructor(t=0,e=0,n=0,i=1){Ee.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,_=(f+1)/2,y=(p+1)/2,E=(h+d)/4,T=(u+v)/4,A=(g+m)/4;return x>_&&x>y?x<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(x),i=E/n,r=T/n):_>y?_<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(_),n=E/i,r=A/i):y<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(y),n=T/r,i=A/r),this.set(n,i,r,e),this}let M=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-v)/M,this.z=(d-h)/M,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ee(this.x,t.x,e.x),this.y=ee(this.y,t.y,e.y),this.z=ee(this.z,t.z,e.z),this.w=ee(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ee(this.x,t,e),this.y=ee(this.y,t,e),this.z=ee(this.z,t,e),this.w=ee(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ee(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ad extends gs{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:en,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Ee(0,0,t,e),this.scissorTest=!1,this.viewport=new Ee(0,0,t,e);const i={width:t,height:e,depth:n.depth},r=new $e(i);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:en,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new oc(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class yn extends ad{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Sh extends $e{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=nn,this.minFilter=nn,this.wrapR=Ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class cd extends $e{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=nn,this.minFilter=nn,this.wrapR=Ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Jn{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Sn):Sn.fromBufferAttribute(r,o),Sn.applyMatrix4(t.matrixWorld),this.expandByPoint(Sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),tr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),tr.copy(n.boundingBox)),tr.applyMatrix4(t.matrixWorld),this.union(tr)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Sn),Sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ys),er.subVectors(this.max,ys),zi.subVectors(t.a,ys),Hi.subVectors(t.b,ys),ki.subVectors(t.c,ys),jn.subVectors(Hi,zi),Qn.subVectors(ki,Hi),mi.subVectors(zi,ki);let e=[0,-jn.z,jn.y,0,-Qn.z,Qn.y,0,-mi.z,mi.y,jn.z,0,-jn.x,Qn.z,0,-Qn.x,mi.z,0,-mi.x,-jn.y,jn.x,0,-Qn.y,Qn.x,0,-mi.y,mi.x,0];return!vo(e,zi,Hi,ki,er)||(e=[1,0,0,0,1,0,0,0,1],!vo(e,zi,Hi,ki,er))?!1:(nr.crossVectors(jn,Qn),e=[nr.x,nr.y,nr.z],vo(e,zi,Hi,ki,er))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Bn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Bn=[new I,new I,new I,new I,new I,new I,new I,new I],Sn=new I,tr=new Jn,zi=new I,Hi=new I,ki=new I,jn=new I,Qn=new I,mi=new I,ys=new I,er=new I,nr=new I,gi=new I;function vo(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){gi.fromArray(s,r);const a=i.x*Math.abs(gi.x)+i.y*Math.abs(gi.y)+i.z*Math.abs(gi.z),l=t.dot(gi),c=e.dot(gi),h=n.dot(gi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const ld=new Jn,Ss=new I,_o=new I;class vs{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):ld.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ss.subVectors(t,this.center);const e=Ss.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Ss,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(_o.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ss.copy(t.center).add(_o)),this.expandByPoint(Ss.copy(t.center).sub(_o))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const zn=new I,xo=new I,ir=new I,ti=new I,Mo=new I,sr=new I,yo=new I;class ac{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,zn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=zn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(zn.copy(this.origin).addScaledVector(this.direction,e),zn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){xo.copy(t).add(e).multiplyScalar(.5),ir.copy(e).sub(t).normalize(),ti.copy(this.origin).sub(xo);const r=t.distanceTo(e)*.5,o=-this.direction.dot(ir),a=ti.dot(this.direction),l=-ti.dot(ir),c=ti.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(xo).addScaledVector(ir,d),f}intersectSphere(t,e){zn.subVectors(t.center,this.origin);const n=zn.dot(this.direction),i=zn.dot(zn)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,zn)!==null}intersectTriangle(t,e,n,i,r){Mo.subVectors(e,t),sr.subVectors(n,t),yo.crossVectors(Mo,sr);let o=this.direction.dot(yo),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ti.subVectors(this.origin,t);const l=a*this.direction.dot(sr.crossVectors(ti,sr));if(l<0)return null;const c=a*this.direction.dot(Mo.cross(ti));if(c<0||l+c>o)return null;const h=-a*ti.dot(yo);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class he{constructor(t,e,n,i,r,o,a,l,c,h,u,d,f,g,v,m){he.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,u,d,f,g,v,m)}set(t,e,n,i,r,o,a,l,c,h,u,d,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new he().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/Gi.setFromMatrixColumn(t,0).length(),r=1/Gi.setFromMatrixColumn(t,1).length(),o=1/Gi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,f=o*u,g=a*h,v=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-v*c,e[9]=-a*l,e[2]=v-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,g=c*h,v=c*u;e[0]=d+v*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=v+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,g=c*h,v=c*u;e[0]=d-v*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=v-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=a*h,v=a*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+v,e[1]=l*u,e[5]=v*c+d,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,g=a*l,v=a*c;e[0]=l*h,e[4]=v-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=o*l,f=o*c,g=a*l,v=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+v,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(hd,t,ud)}lookAt(t,e,n){const i=this.elements;return ln.subVectors(t,e),ln.lengthSq()===0&&(ln.z=1),ln.normalize(),ei.crossVectors(n,ln),ei.lengthSq()===0&&(Math.abs(n.z)===1?ln.x+=1e-4:ln.z+=1e-4,ln.normalize(),ei.crossVectors(n,ln)),ei.normalize(),rr.crossVectors(ln,ei),i[0]=ei.x,i[4]=rr.x,i[8]=ln.x,i[1]=ei.y,i[5]=rr.y,i[9]=ln.y,i[2]=ei.z,i[6]=rr.z,i[10]=ln.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],M=n[3],x=n[7],_=n[11],y=n[15],E=i[0],T=i[4],A=i[8],w=i[12],S=i[1],C=i[5],P=i[9],U=i[13],z=i[2],F=i[6],H=i[10],q=i[14],O=i[3],W=i[7],tt=i[11],et=i[15];return r[0]=o*E+a*S+l*z+c*O,r[4]=o*T+a*C+l*F+c*W,r[8]=o*A+a*P+l*H+c*tt,r[12]=o*w+a*U+l*q+c*et,r[1]=h*E+u*S+d*z+f*O,r[5]=h*T+u*C+d*F+f*W,r[9]=h*A+u*P+d*H+f*tt,r[13]=h*w+u*U+d*q+f*et,r[2]=g*E+v*S+m*z+p*O,r[6]=g*T+v*C+m*F+p*W,r[10]=g*A+v*P+m*H+p*tt,r[14]=g*w+v*U+m*q+p*et,r[3]=M*E+x*S+_*z+y*O,r[7]=M*T+x*C+_*F+y*W,r[11]=M*A+x*P+_*H+y*tt,r[15]=M*w+x*U+_*q+y*et,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+r*l*u-i*c*u-r*a*d+n*c*d+i*a*f-n*l*f)+v*(+e*l*f-e*c*d+r*o*d-i*o*f+i*c*h-r*l*h)+m*(+e*c*u-e*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-i*a*h-e*l*u+e*a*d+i*o*u-n*o*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],M=u*m*c-v*d*c+v*l*f-a*m*f-u*l*p+a*d*p,x=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,_=h*v*c-g*u*c+g*a*f-o*v*f-h*a*p+o*u*p,y=g*u*l-h*v*l-g*a*d+o*v*d+h*a*m-o*u*m,E=e*M+n*x+i*_+r*y;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/E;return t[0]=M*T,t[1]=(v*d*r-u*m*r-v*i*f+n*m*f+u*i*p-n*d*p)*T,t[2]=(a*m*r-v*l*r+v*i*c-n*m*c-a*i*p+n*l*p)*T,t[3]=(u*l*r-a*d*r-u*i*c+n*d*c+a*i*f-n*l*f)*T,t[4]=x*T,t[5]=(h*m*r-g*d*r+g*i*f-e*m*f-h*i*p+e*d*p)*T,t[6]=(g*l*r-o*m*r-g*i*c+e*m*c+o*i*p-e*l*p)*T,t[7]=(o*d*r-h*l*r+h*i*c-e*d*c-o*i*f+e*l*f)*T,t[8]=_*T,t[9]=(g*u*r-h*v*r-g*n*f+e*v*f+h*n*p-e*u*p)*T,t[10]=(o*v*r-g*a*r+g*n*c-e*v*c-o*n*p+e*a*p)*T,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*f-e*a*f)*T,t[12]=y*T,t[13]=(h*v*i-g*u*i+g*n*d-e*v*d-h*n*m+e*u*m)*T,t[14]=(g*a*i-o*v*i-g*n*l+e*v*l+o*n*m-e*a*m)*T,t[15]=(o*u*i-h*a*i+h*n*l-e*u*l-o*n*d+e*a*d)*T,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,v=o*h,m=o*u,p=a*u,M=l*c,x=l*h,_=l*u,y=n.x,E=n.y,T=n.z;return i[0]=(1-(v+p))*y,i[1]=(f+_)*y,i[2]=(g-x)*y,i[3]=0,i[4]=(f-_)*E,i[5]=(1-(d+p))*E,i[6]=(m+M)*E,i[7]=0,i[8]=(g+x)*T,i[9]=(m-M)*T,i[10]=(1-(d+v))*T,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=Gi.set(i[0],i[1],i[2]).length();const o=Gi.set(i[4],i[5],i[6]).length(),a=Gi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],wn.copy(this);const c=1/r,h=1/o,u=1/a;return wn.elements[0]*=c,wn.elements[1]*=c,wn.elements[2]*=c,wn.elements[4]*=h,wn.elements[5]*=h,wn.elements[6]*=h,wn.elements[8]*=u,wn.elements[9]*=u,wn.elements[10]*=u,e.setFromRotationMatrix(wn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=Dn,l=!1){const c=this.elements,h=2*r/(e-t),u=2*r/(n-i),d=(e+t)/(e-t),f=(n+i)/(n-i);let g,v;if(l)g=r/(o-r),v=o*r/(o-r);else if(a===Dn)g=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Vr)g=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Dn,l=!1){const c=this.elements,h=2/(e-t),u=2/(n-i),d=-(e+t)/(e-t),f=-(n+i)/(n-i);let g,v;if(l)g=1/(o-r),v=o/(o-r);else if(a===Dn)g=-2/(o-r),v=-(o+r)/(o-r);else if(a===Vr)g=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Gi=new I,wn=new he,hd=new I(0,0,0),ud=new I(1,1,1),ei=new I,rr=new I,ln=new I,kc=new he,Gc=new Zs;class Un{constructor(t=0,e=0,n=0,i=Un.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(ee(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ee(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ee(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ee(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ee(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ee(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return kc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(kc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Gc.setFromEuler(this),this.setFromQuaternion(Gc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Un.DEFAULT_ORDER="XYZ";class cc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let dd=0;const Vc=new I,Vi=new Zs,Hn=new he,or=new I,ws=new I,fd=new I,pd=new Zs,Wc=new I(1,0,0),Xc=new I(0,1,0),qc=new I(0,0,1),Yc={type:"added"},md={type:"removed"},Wi={type:"childadded",child:null},So={type:"childremoved",child:null};class Ue extends gs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:dd++}),this.uuid=Ii(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ue.DEFAULT_UP.clone();const t=new I,e=new Un,n=new Zs,i=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new he},normalMatrix:{value:new jt}}),this.matrix=new he,this.matrixWorld=new he,this.matrixAutoUpdate=Ue.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new cc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Vi.setFromAxisAngle(t,e),this.quaternion.multiply(Vi),this}rotateOnWorldAxis(t,e){return Vi.setFromAxisAngle(t,e),this.quaternion.premultiply(Vi),this}rotateX(t){return this.rotateOnAxis(Wc,t)}rotateY(t){return this.rotateOnAxis(Xc,t)}rotateZ(t){return this.rotateOnAxis(qc,t)}translateOnAxis(t,e){return Vc.copy(t).applyQuaternion(this.quaternion),this.position.add(Vc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wc,t)}translateY(t){return this.translateOnAxis(Xc,t)}translateZ(t){return this.translateOnAxis(qc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Hn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?or.copy(t):or.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),ws.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hn.lookAt(ws,or,this.up):Hn.lookAt(or,ws,this.up),this.quaternion.setFromRotationMatrix(Hn),i&&(Hn.extractRotation(i.matrixWorld),Vi.setFromRotationMatrix(Hn),this.quaternion.premultiply(Vi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Yc),Wi.child=t,this.dispatchEvent(Wi),Wi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(md),So.child=t,this.dispatchEvent(So),So.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Hn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Hn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Hn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Yc),Wi.child=t,this.dispatchEvent(Wi),Wi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ws,t,fd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ws,pd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Ue.DEFAULT_UP=new I(0,1,0);Ue.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const En=new I,kn=new I,wo=new I,Gn=new I,Xi=new I,qi=new I,Zc=new I,Eo=new I,bo=new I,To=new I,Ao=new Ee,Co=new Ee,Ro=new Ee;class _n{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),En.subVectors(t,e),i.cross(En);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){En.subVectors(i,e),kn.subVectors(n,e),wo.subVectors(t,e);const o=En.dot(En),a=En.dot(kn),l=En.dot(wo),c=kn.dot(kn),h=kn.dot(wo),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Gn)===null?!1:Gn.x>=0&&Gn.y>=0&&Gn.x+Gn.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,Gn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Gn.x),l.addScaledVector(o,Gn.y),l.addScaledVector(a,Gn.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return Ao.setScalar(0),Co.setScalar(0),Ro.setScalar(0),Ao.fromBufferAttribute(t,e),Co.fromBufferAttribute(t,n),Ro.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(Ao,r.x),o.addScaledVector(Co,r.y),o.addScaledVector(Ro,r.z),o}static isFrontFacing(t,e,n,i){return En.subVectors(n,e),kn.subVectors(t,e),En.cross(kn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return En.subVectors(this.c,this.b),kn.subVectors(this.a,this.b),En.cross(kn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return _n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return _n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return _n.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return _n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return _n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;Xi.subVectors(i,n),qi.subVectors(r,n),Eo.subVectors(t,n);const l=Xi.dot(Eo),c=qi.dot(Eo);if(l<=0&&c<=0)return e.copy(n);bo.subVectors(t,i);const h=Xi.dot(bo),u=qi.dot(bo);if(h>=0&&u<=h)return e.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Xi,o);To.subVectors(t,r);const f=Xi.dot(To),g=qi.dot(To);if(g>=0&&f<=g)return e.copy(r);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(qi,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Zc.subVectors(r,i),a=(u-h)/(u-h+(f-g)),e.copy(i).addScaledVector(Zc,a);const p=1/(m+v+d);return o=v*p,a=d*p,e.copy(n).addScaledVector(Xi,o).addScaledVector(qi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const wh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ni={h:0,s:0,l:0},ar={h:0,s:0,l:0};function Po(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Xt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,oe.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=oe.workingColorSpace){return this.r=t,this.g=e,this.b=n,oe.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=oe.workingColorSpace){if(t=rc(t,1),e=ee(e,0,1),n=ee(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Po(o,r,t+1/3),this.g=Po(o,r,t),this.b=Po(o,r,t-1/3)}return oe.colorSpaceToWorking(this,i),this}setStyle(t,e=Qe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Qe){const n=wh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=$n(t.r),this.g=$n(t.g),this.b=$n(t.b),this}copyLinearToSRGB(t){return this.r=ss(t.r),this.g=ss(t.g),this.b=ss(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Qe){return oe.workingToColorSpace(Ze.copy(this),t),Math.round(ee(Ze.r*255,0,255))*65536+Math.round(ee(Ze.g*255,0,255))*256+Math.round(ee(Ze.b*255,0,255))}getHexString(t=Qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=oe.workingColorSpace){oe.workingToColorSpace(Ze.copy(this),e);const n=Ze.r,i=Ze.g,r=Ze.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=oe.workingColorSpace){return oe.workingToColorSpace(Ze.copy(this),e),t.r=Ze.r,t.g=Ze.g,t.b=Ze.b,t}getStyle(t=Qe){oe.workingToColorSpace(Ze.copy(this),t);const e=Ze.r,n=Ze.g,i=Ze.b;return t!==Qe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(ni),this.setHSL(ni.h+t,ni.s+e,ni.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ni),t.getHSL(ar);const n=Is(ni.h,ar.h,e),i=Is(ni.s,ar.s,e),r=Is(ni.l,ar.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ze=new Xt;Xt.NAMES=wh;let gd=0;class Ni extends gs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:gd++}),this.uuid=Ii(),this.name="",this.type="Material",this.blending=ns,this.side=Kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ea,this.blendDst=na,this.blendEquation=Yn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xt(0,0,0),this.blendAlpha=0,this.depthFunc=os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ic,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Oi,this.stencilZFail=Oi,this.stencilZPass=Oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ns&&(n.blending=this.blending),this.side!==Kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ea&&(n.blendSrc=this.blendSrc),this.blendDst!==na&&(n.blendDst=this.blendDst),this.blendEquation!==Yn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==os&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ic&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Oi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Oi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Oi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class le extends Ni{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Fe=new I,cr=new mt;let vd=0;class Mn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:vd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Nc,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)cr.fromBufferAttribute(this,e),cr.applyMatrix3(t),this.setXY(e,cr.x,cr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix3(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix4(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyNormalMatrix(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.transformDirection(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ji(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Je(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ji(e,this.array)),e}setX(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ji(e,this.array)),e}setY(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ji(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ji(e,this.array)),e}setW(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array),i=Je(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array),i=Je(i,this.array),r=Je(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Nc&&(t.usage=this.usage),t}}class Eh extends Mn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class bh extends Mn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class zt extends Mn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let _d=0;const gn=new he,Do=new Ue,Yi=new I,hn=new Jn,Es=new Jn,ke=new I;class ae extends gs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_d++}),this.uuid=Ii(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(yh(t)?bh:Eh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return gn.makeRotationFromQuaternion(t),this.applyMatrix4(gn),this}rotateX(t){return gn.makeRotationX(t),this.applyMatrix4(gn),this}rotateY(t){return gn.makeRotationY(t),this.applyMatrix4(gn),this}rotateZ(t){return gn.makeRotationZ(t),this.applyMatrix4(gn),this}translate(t,e,n){return gn.makeTranslation(t,e,n),this.applyMatrix4(gn),this}scale(t,e,n){return gn.makeScale(t,e,n),this.applyMatrix4(gn),this}lookAt(t){return Do.lookAt(t),Do.updateMatrix(),this.applyMatrix4(Do.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Yi).negate(),this.translate(Yi.x,Yi.y,Yi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new zt(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Jn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];hn.setFromBufferAttribute(r),this.morphTargetsRelative?(ke.addVectors(this.boundingBox.min,hn.min),this.boundingBox.expandByPoint(ke),ke.addVectors(this.boundingBox.max,hn.max),this.boundingBox.expandByPoint(ke)):(this.boundingBox.expandByPoint(hn.min),this.boundingBox.expandByPoint(hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){const n=this.boundingSphere.center;if(hn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Es.setFromBufferAttribute(a),this.morphTargetsRelative?(ke.addVectors(hn.min,Es.min),hn.expandByPoint(ke),ke.addVectors(hn.max,Es.max),hn.expandByPoint(ke)):(hn.expandByPoint(Es.min),hn.expandByPoint(Es.max))}hn.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)ke.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(ke));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)ke.fromBufferAttribute(a,c),l&&(Yi.fromBufferAttribute(t,c),ke.add(Yi)),i=Math.max(i,n.distanceToSquared(ke))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Mn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let A=0;A<n.count;A++)a[A]=new I,l[A]=new I;const c=new I,h=new I,u=new I,d=new mt,f=new mt,g=new mt,v=new I,m=new I;function p(A,w,S){c.fromBufferAttribute(n,A),h.fromBufferAttribute(n,w),u.fromBufferAttribute(n,S),d.fromBufferAttribute(r,A),f.fromBufferAttribute(r,w),g.fromBufferAttribute(r,S),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const C=1/(f.x*g.y-g.x*f.y);isFinite(C)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(C),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(C),a[A].add(v),a[w].add(v),a[S].add(v),l[A].add(m),l[w].add(m),l[S].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let A=0,w=M.length;A<w;++A){const S=M[A],C=S.start,P=S.count;for(let U=C,z=C+P;U<z;U+=3)p(t.getX(U+0),t.getX(U+1),t.getX(U+2))}const x=new I,_=new I,y=new I,E=new I;function T(A){y.fromBufferAttribute(i,A),E.copy(y);const w=a[A];x.copy(w),x.sub(y.multiplyScalar(y.dot(w))).normalize(),_.crossVectors(E,w);const C=_.dot(l[A])<0?-1:1;o.setXYZW(A,x.x,x.y,x.z,C)}for(let A=0,w=M.length;A<w;++A){const S=M[A],C=S.start,P=S.count;for(let U=C,z=C+P;U<z;U+=3)T(t.getX(U+0)),T(t.getX(U+1)),T(t.getX(U+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Mn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new I,r=new I,o=new I,a=new I,l=new I,c=new I,h=new I,u=new I;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ke.fromBufferAttribute(t,e),ke.normalize(),t.setXYZ(e,ke.x,ke.y,ke.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new Mn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ae,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const $c=new he,vi=new ac,lr=new vs,Kc=new I,hr=new I,ur=new I,dr=new I,Lo=new I,fr=new I,Jc=new I,pr=new I;class J extends Ue{constructor(t=new ae,e=new le){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){fr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(Lo.fromBufferAttribute(u,t),o?fr.addScaledVector(Lo,h):fr.addScaledVector(Lo.sub(e),h))}e.add(fr)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),lr.copy(n.boundingSphere),lr.applyMatrix4(r),vi.copy(t.ray).recast(t.near),!(lr.containsPoint(vi.origin)===!1&&(vi.intersectSphere(lr,Kc)===null||vi.origin.distanceToSquared(Kc)>(t.far-t.near)**2))&&($c.copy(r).invert(),vi.copy(t.ray).applyMatrix4($c),!(n.boundingBox!==null&&vi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,vi)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let _=M,y=x;_<y;_+=3){const E=a.getX(_),T=a.getX(_+1),A=a.getX(_+2);i=mr(this,p,t,n,c,h,u,E,T,A),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const M=a.getX(m),x=a.getX(m+1),_=a.getX(m+2);i=mr(this,o,t,n,c,h,u,M,x,_),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),x=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let _=M,y=x;_<y;_+=3){const E=_,T=_+1,A=_+2;i=mr(this,p,t,n,c,h,u,E,T,A),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const M=m,x=m+1,_=m+2;i=mr(this,o,t,n,c,h,u,M,x,_),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function xd(s,t,e,n,i,r,o,a){let l;if(t.side===on?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===Kn,a),l===null)return null;pr.copy(a),pr.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(pr);return c<e.near||c>e.far?null:{distance:c,point:pr.clone(),object:s}}function mr(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,hr),s.getVertexPosition(l,ur),s.getVertexPosition(c,dr);const h=xd(s,t,e,n,hr,ur,dr,Jc);if(h){const u=new I;_n.getBarycoord(Jc,hr,ur,dr,u),i&&(h.uv=_n.getInterpolatedAttribute(i,a,l,c,u,new mt)),r&&(h.uv1=_n.getInterpolatedAttribute(r,a,l,c,u,new mt)),o&&(h.normal=_n.getInterpolatedAttribute(o,a,l,c,u,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new I,materialIndex:0};_n.getNormal(hr,ur,dr,d.normal),h.face=d,h.barycoord=u}return h}class Ut extends ae{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new zt(c,3)),this.setAttribute("normal",new zt(h,3)),this.setAttribute("uv",new zt(u,2));function g(v,m,p,M,x,_,y,E,T,A,w){const S=_/T,C=y/A,P=_/2,U=y/2,z=E/2,F=T+1,H=A+1;let q=0,O=0;const W=new I;for(let tt=0;tt<H;tt++){const et=tt*C-U;for(let ct=0;ct<F;ct++){const _t=ct*S-P;W[v]=_t*M,W[m]=et*x,W[p]=z,c.push(W.x,W.y,W.z),W[v]=0,W[m]=0,W[p]=E>0?1:-1,h.push(W.x,W.y,W.z),u.push(ct/T),u.push(1-tt/A),q+=1}}for(let tt=0;tt<A;tt++)for(let et=0;et<T;et++){const ct=d+et+F*tt,_t=d+et+F*(tt+1),bt=d+(et+1)+F*(tt+1),yt=d+(et+1)+F*tt;l.push(ct,_t,yt),l.push(_t,bt,yt),O+=6}a.addGroup(f,O,w),f+=O,d+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ut(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ds(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function je(s){const t={};for(let e=0;e<s.length;e++){const n=ds(s[e]);for(const i in n)t[i]=n[i]}return t}function Md(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Th(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:oe.workingColorSpace}const Zn={clone:ds,merge:je};var yd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Sd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class qe extends Ni{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=yd,this.fragmentShader=Sd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ds(t.uniforms),this.uniformsGroups=Md(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Ah extends Ue{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new he,this.projectionMatrix=new he,this.projectionMatrixInverse=new he,this.coordinateSystem=Dn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ii=new I,jc=new mt,Qc=new mt;class vn extends Ah{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Gs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(is*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Gs*2*Math.atan(Math.tan(is*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ii.x,ii.y).multiplyScalar(-t/ii.z),ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ii.x,ii.y).multiplyScalar(-t/ii.z)}getViewSize(t,e){return this.getViewBounds(t,jc,Qc),e.subVectors(Qc,jc)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(is*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Zi=-90,$i=1;class wd extends Ue{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new vn(Zi,$i,t,e);i.layers=this.layers,this.add(i);const r=new vn(Zi,$i,t,e);r.layers=this.layers,this.add(r);const o=new vn(Zi,$i,t,e);o.layers=this.layers,this.add(o);const a=new vn(Zi,$i,t,e);a.layers=this.layers,this.add(a);const l=new vn(Zi,$i,t,e);l.layers=this.layers,this.add(l);const c=new vn(Zi,$i,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Dn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Vr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Ch extends $e{constructor(t=[],e=as,n,i,r,o,a,l,c,h){super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ed extends yn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Ch(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ut(5,5,5),r=new qe({name:"CubemapFromEquirect",uniforms:ds(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:on,blending:tn});r.uniforms.tEquirect.value=e;const o=new J(i,r),a=e.minFilter;return e.minFilter===Ai&&(e.minFilter=en),new wd(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}class Oe extends Ue{constructor(){super(),this.isGroup=!0,this.type="Group"}}const bd={type:"move"};class Io{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Oe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Oe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Oe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(bd)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Oe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Xr{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Xt(t),this.density=e}clone(){return new Xr(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Td extends Ue{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Un,this.environmentIntensity=1,this.environmentRotation=new Un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class no extends $e{constructor(t=null,e=1,n=1,i,r,o,a,l,c=nn,h=nn,u,d){super(null,o,a,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class tl extends Mn{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ki=new he,el=new he,gr=[],nl=new Jn,Ad=new he,bs=new J,Ts=new vs;class No extends J{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new tl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Ad)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Jn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ki),nl.copy(t.boundingBox).applyMatrix4(Ki),this.boundingBox.union(nl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new vs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ki),Ts.copy(t.boundingSphere).applyMatrix4(Ki),this.boundingSphere.union(Ts)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(bs.geometry=this.geometry,bs.material=this.material,bs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ts.copy(this.boundingSphere),Ts.applyMatrix4(n),t.ray.intersectsSphere(Ts)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ki),el.multiplyMatrices(n,Ki),bs.matrixWorld=el,bs.raycast(t,gr);for(let o=0,a=gr.length;o<a;o++){const l=gr[o];l.instanceId=r,l.object=this,e.push(l)}gr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new tl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new no(new Float32Array(i*this.count),i,this.count,eo,An));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Uo=new I,Cd=new I,Rd=new jt;class ri{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Uo.subVectors(n,e).cross(Cd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Uo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Rd.getNormalMatrix(t),i=this.coplanarPoint(Uo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const _i=new vs,Pd=new mt(.5,.5),vr=new I;class lc{constructor(t=new ri,e=new ri,n=new ri,i=new ri,r=new ri,o=new ri){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Dn,n=!1){const i=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],v=r[9],m=r[10],p=r[11],M=r[12],x=r[13],_=r[14],y=r[15];if(i[0].setComponents(c-o,f-h,p-g,y-M).normalize(),i[1].setComponents(c+o,f+h,p+g,y+M).normalize(),i[2].setComponents(c+a,f+u,p+v,y+x).normalize(),i[3].setComponents(c-a,f-u,p-v,y-x).normalize(),n)i[4].setComponents(l,d,m,_).normalize(),i[5].setComponents(c-l,f-d,p-m,y-_).normalize();else if(i[4].setComponents(c-l,f-d,p-m,y-_).normalize(),e===Dn)i[5].setComponents(c+l,f+d,p+m,y+_).normalize();else if(e===Vr)i[5].setComponents(l,d,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),_i.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),_i.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(_i)}intersectsSprite(t){_i.center.set(0,0,0);const e=Pd.distanceTo(t.center);return _i.radius=.7071067811865476+e,_i.applyMatrix4(t.matrixWorld),this.intersectsSphere(_i)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(vr.x=i.normal.x>0?t.max.x:t.min.x,vr.y=i.normal.y>0?t.max.y:t.min.y,vr.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(vr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Tn extends Ni{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const qr=new I,Yr=new I,il=new he,As=new ac,_r=new vs,Fo=new I,sl=new I;class Rh extends Ue{constructor(t=new ae,e=new Tn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)qr.fromBufferAttribute(e,i-1),Yr.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=qr.distanceTo(Yr);t.setAttribute("lineDistance",new zt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),_r.copy(n.boundingSphere),_r.applyMatrix4(i),_r.radius+=r,t.ray.intersectsSphere(_r)===!1)return;il.copy(i).invert(),As.copy(t.ray).applyMatrix4(il);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=c){const p=h.getX(v),M=h.getX(v+1),x=xr(this,t,As,l,p,M,v);x&&e.push(x)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(f),p=xr(this,t,As,l,v,m,g-1);p&&e.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=c){const p=xr(this,t,As,l,v,v+1,v);p&&e.push(p)}if(this.isLineLoop){const v=xr(this,t,As,l,g-1,f,g-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function xr(s,t,e,n,i,r,o){const a=s.geometry.attributes.position;if(qr.fromBufferAttribute(a,i),Yr.fromBufferAttribute(a,r),e.distanceSqToSegment(qr,Yr,Fo,sl)>n)return;Fo.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Fo);if(!(c<t.near||c>t.far))return{distance:c,point:sl.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}const rl=new I,ol=new I;class si extends Rh{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)rl.fromBufferAttribute(e,i),ol.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+rl.distanceTo(ol);t.setAttribute("lineDistance",new zt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class al extends Rh{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class Ph extends $e{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class hc extends $e{constructor(t,e,n=Pi,i,r,o,a=nn,l=nn,c,h=ks,u=1){if(h!==ks&&h!==hs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new oc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Dh extends $e{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class uc extends ae{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new I,h=new mt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new zt(o,3)),this.setAttribute("normal",new zt(a,3)),this.setAttribute("uv",new zt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new uc(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ie extends ae{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const v=[],m=n/2;let p=0;M(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new zt(u,3)),this.setAttribute("normal",new zt(d,3)),this.setAttribute("uv",new zt(f,2));function M(){const _=new I,y=new I;let E=0;const T=(e-t)/n;for(let A=0;A<=r;A++){const w=[],S=A/r,C=S*(e-t)+t;for(let P=0;P<=i;P++){const U=P/i,z=U*l+a,F=Math.sin(z),H=Math.cos(z);y.x=C*F,y.y=-S*n+m,y.z=C*H,u.push(y.x,y.y,y.z),_.set(F,T,H).normalize(),d.push(_.x,_.y,_.z),f.push(U,1-S),w.push(g++)}v.push(w)}for(let A=0;A<i;A++)for(let w=0;w<r;w++){const S=v[w][A],C=v[w+1][A],P=v[w+1][A+1],U=v[w][A+1];(t>0||w!==0)&&(h.push(S,C,U),E+=3),(e>0||w!==r-1)&&(h.push(C,P,U),E+=3)}c.addGroup(p,E,0),p+=E}function x(_){const y=g,E=new mt,T=new I;let A=0;const w=_===!0?t:e,S=_===!0?1:-1;for(let P=1;P<=i;P++)u.push(0,m*S,0),d.push(0,S,0),f.push(.5,.5),g++;const C=g;for(let P=0;P<=i;P++){const z=P/i*l+a,F=Math.cos(z),H=Math.sin(z);T.x=w*H,T.y=m*S,T.z=w*F,u.push(T.x,T.y,T.z),d.push(0,S,0),E.x=F*.5+.5,E.y=H*.5*S+.5,f.push(E.x,E.y),g++}for(let P=0;P<i;P++){const U=y+P,z=C+P;_===!0?h.push(z,z+1,U):h.push(z+1,z,U),A+=3}c.addGroup(p,A,_===!0?1:2),p+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ie(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ns extends Ie{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Ns(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class io extends ae{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new zt(r,3)),this.setAttribute("normal",new zt(r.slice(),3)),this.setAttribute("uv",new zt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(M){const x=new I,_=new I,y=new I;for(let E=0;E<e.length;E+=3)f(e[E+0],x),f(e[E+1],_),f(e[E+2],y),l(x,_,y,M)}function l(M,x,_,y){const E=y+1,T=[];for(let A=0;A<=E;A++){T[A]=[];const w=M.clone().lerp(_,A/E),S=x.clone().lerp(_,A/E),C=E-A;for(let P=0;P<=C;P++)P===0&&A===E?T[A][P]=w:T[A][P]=w.clone().lerp(S,P/C)}for(let A=0;A<E;A++)for(let w=0;w<2*(E-A)-1;w++){const S=Math.floor(w/2);w%2===0?(d(T[A][S+1]),d(T[A+1][S]),d(T[A][S])):(d(T[A][S+1]),d(T[A+1][S+1]),d(T[A+1][S]))}}function c(M){const x=new I;for(let _=0;_<r.length;_+=3)x.x=r[_+0],x.y=r[_+1],x.z=r[_+2],x.normalize().multiplyScalar(M),r[_+0]=x.x,r[_+1]=x.y,r[_+2]=x.z}function h(){const M=new I;for(let x=0;x<r.length;x+=3){M.x=r[x+0],M.y=r[x+1],M.z=r[x+2];const _=m(M)/2/Math.PI+.5,y=p(M)/Math.PI+.5;o.push(_,1-y)}g(),u()}function u(){for(let M=0;M<o.length;M+=6){const x=o[M+0],_=o[M+2],y=o[M+4],E=Math.max(x,_,y),T=Math.min(x,_,y);E>.9&&T<.1&&(x<.2&&(o[M+0]+=1),_<.2&&(o[M+2]+=1),y<.2&&(o[M+4]+=1))}}function d(M){r.push(M.x,M.y,M.z)}function f(M,x){const _=M*3;x.x=t[_+0],x.y=t[_+1],x.z=t[_+2]}function g(){const M=new I,x=new I,_=new I,y=new I,E=new mt,T=new mt,A=new mt;for(let w=0,S=0;w<r.length;w+=9,S+=6){M.set(r[w+0],r[w+1],r[w+2]),x.set(r[w+3],r[w+4],r[w+5]),_.set(r[w+6],r[w+7],r[w+8]),E.set(o[S+0],o[S+1]),T.set(o[S+2],o[S+3]),A.set(o[S+4],o[S+5]),y.copy(M).add(x).add(_).divideScalar(3);const C=m(y);v(E,S+0,M,C),v(T,S+2,x,C),v(A,S+4,_,C)}}function v(M,x,_,y){y<0&&M.x===1&&(o[x]=M.x-1),_.x===0&&_.z===0&&(o[x]=y/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new io(t.vertices,t.indices,t.radius,t.details)}}class dc extends io{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new dc(t.radius,t.detail)}}const Mr=new I,yr=new I,Oo=new I,Sr=new _n;class wr extends ae{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const i=Math.pow(10,4),r=Math.cos(is*e),o=t.getIndex(),a=t.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:v,b:m,c:p}=Sr;if(v.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),Sr.getNormal(Oo),u[0]=`${Math.round(v.x*i)},${Math.round(v.y*i)},${Math.round(v.z*i)}`,u[1]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,u[2]=`${Math.round(p.x*i)},${Math.round(p.y*i)},${Math.round(p.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let M=0;M<3;M++){const x=(M+1)%3,_=u[M],y=u[x],E=Sr[h[M]],T=Sr[h[x]],A=`${_}_${y}`,w=`${y}_${_}`;w in d&&d[w]?(Oo.dot(d[w].normal)<=r&&(f.push(E.x,E.y,E.z),f.push(T.x,T.y,T.z)),d[w]=null):A in d||(d[A]={index0:c[M],index1:c[x],normal:Oo.clone()})}}for(const g in d)if(d[g]){const{index0:v,index1:m}=d[g];Mr.fromBufferAttribute(a,v),yr.fromBufferAttribute(a,m),f.push(Mr.x,Mr.y,Mr.z),f.push(yr.x,yr.y,yr.z)}this.setAttribute("position",new zt(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Fn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let i=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(o-h)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),l=e||(o.isVector2?new mt:new I);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new I,i=[],r=[],o=[],a=new I,l=new he;for(let f=0;f<=t;f++){const g=f/t;i[f]=this.getTangentAt(g,new I)}r[0]=new I,o[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(ee(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(ee(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),o[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class fc extends Fn{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new mt){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Dd extends fc{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function pc(){let s=0,t=0,e=0,n=0;function i(r,o,a,l){s=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,i(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return s+t*r+e*o+n*a}}}const Er=new I,Bo=new pc,zo=new pc,Ho=new pc;class Lh extends Fn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new I){const n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%r]:(Er.subVectors(i[0],i[1]).add(i[0]),c=Er);const u=i[a%r],d=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(Er.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Er),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Bo.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,v,m),zo.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,v,m),Ho.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Bo.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),zo.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Ho.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Bo.calc(l),zo.calc(l),Ho.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new I().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function cl(s,t,e,n,i){const r=(n-t)*.5,o=(i-e)*.5,a=s*s,l=s*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*s+e}function Ld(s,t){const e=1-s;return e*e*t}function Id(s,t){return 2*(1-s)*s*t}function Nd(s,t){return s*s*t}function Us(s,t,e,n){return Ld(s,t)+Id(s,e)+Nd(s,n)}function Ud(s,t){const e=1-s;return e*e*e*t}function Fd(s,t){const e=1-s;return 3*e*e*s*t}function Od(s,t){return 3*(1-s)*s*s*t}function Bd(s,t){return s*s*s*t}function Fs(s,t,e,n,i){return Ud(s,t)+Fd(s,e)+Od(s,n)+Bd(s,i)}class Ih extends Fn{constructor(t=new mt,e=new mt,n=new mt,i=new mt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new mt){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Fs(t,i.x,r.x,o.x,a.x),Fs(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class zd extends Fn{constructor(t=new I,e=new I,n=new I,i=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new I){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Fs(t,i.x,r.x,o.x,a.x),Fs(t,i.y,r.y,o.y,a.y),Fs(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Nh extends Fn{constructor(t=new mt,e=new mt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new mt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new mt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Hd extends Fn{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Uh extends Fn{constructor(t=new mt,e=new mt,n=new mt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new mt){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(Us(t,i.x,r.x,o.x),Us(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class mc extends Fn{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(Us(t,i.x,r.x,o.x),Us(t,i.y,r.y,o.y),Us(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Fh extends Fn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new mt){const n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(cl(a,l.x,c.x,h.x,u.x),cl(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new mt().fromArray(i))}return this}}var Zr=Object.freeze({__proto__:null,ArcCurve:Dd,CatmullRomCurve3:Lh,CubicBezierCurve:Ih,CubicBezierCurve3:zd,EllipseCurve:fc,LineCurve:Nh,LineCurve3:Hd,QuadraticBezierCurve:Uh,QuadraticBezierCurve3:mc,SplineCurve:Fh});class kd extends Fn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Zr[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const o=i[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const o=r[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new Zr[i.type]().fromJSON(i))}return this}}class ka extends kd{constructor(t){super(),this.type="Path",this.currentPoint=new mt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Nh(this.currentPoint.clone(),new mt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const r=new Uh(this.currentPoint.clone(),new mt(t,e),new mt(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,o){const a=new Ih(this.currentPoint.clone(),new mt(t,e),new mt(n,i),new mt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Fh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,i,r,o),this}absarc(t,e,n,i,r,o){return this.absellipse(t,e,n,n,i,r,o),this}ellipse(t,e,n,i,r,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,r,o,a,l),this}absellipse(t,e,n,i,r,o,a,l){const c=new fc(t,e,n,i,r,o,a,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class fs extends ka{constructor(t){super(t),this.uuid=Ii(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(new ka().fromJSON(i))}return this}}function Gd(s,t,e=2){const n=t&&t.length,i=n?t[0]*e:s.length;let r=Oh(s,0,i,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=Yd(s,t,r,e)),s.length>80*e){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let d=e;d<i;d+=e){const f=s[d],g=s[d+1];f<a&&(a=f),g<l&&(l=g),f>h&&(h=f),g>u&&(u=g)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return Ws(r,o,e,a,l,c,0),o}function Oh(s,t,e,n,i){let r;if(i===rf(s,t,e,n)>0)for(let o=t;o<e;o+=n)r=ll(o/n|0,s[o],s[o+1],r);else for(let o=e-n;o>=t;o-=n)r=ll(o/n|0,s[o],s[o+1],r);return r&&ps(r,r.next)&&(qs(r),r=r.next),r}function Di(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(ps(e,e.next)||Ce(e.prev,e,e.next)===0)){if(qs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ws(s,t,e,n,i,r,o){if(!s)return;!o&&r&&jd(s,n,i,r);let a=s;for(;s.prev!==s.next;){const l=s.prev,c=s.next;if(r?Wd(s,n,i,r):Vd(s)){t.push(l.i,s.i,c.i),qs(s),s=c.next,a=c.next;continue}if(s=c,s===a){o?o===1?(s=Xd(Di(s),t),Ws(s,t,e,n,i,r,2)):o===2&&qd(s,t,e,n,i,r):Ws(Di(s),t,e,n,i,r,1);break}}}function Vd(s){const t=s.prev,e=s,n=s.next;if(Ce(t,e,n)>=0)return!1;const i=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(i,r,o),u=Math.min(a,l,c),d=Math.max(i,r,o),f=Math.max(a,l,c);let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Rs(i,a,r,l,o,c,g.x,g.y)&&Ce(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Wd(s,t,e,n){const i=s.prev,r=s,o=s.next;if(Ce(i,r,o)>=0)return!1;const a=i.x,l=r.x,c=o.x,h=i.y,u=r.y,d=o.y,f=Math.min(a,l,c),g=Math.min(h,u,d),v=Math.max(a,l,c),m=Math.max(h,u,d),p=Ga(f,g,t,e,n),M=Ga(v,m,t,e,n);let x=s.prevZ,_=s.nextZ;for(;x&&x.z>=p&&_&&_.z<=M;){if(x.x>=f&&x.x<=v&&x.y>=g&&x.y<=m&&x!==i&&x!==o&&Rs(a,h,l,u,c,d,x.x,x.y)&&Ce(x.prev,x,x.next)>=0||(x=x.prevZ,_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==i&&_!==o&&Rs(a,h,l,u,c,d,_.x,_.y)&&Ce(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=v&&x.y>=g&&x.y<=m&&x!==i&&x!==o&&Rs(a,h,l,u,c,d,x.x,x.y)&&Ce(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;_&&_.z<=M;){if(_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==i&&_!==o&&Rs(a,h,l,u,c,d,_.x,_.y)&&Ce(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function Xd(s,t){let e=s;do{const n=e.prev,i=e.next.next;!ps(n,i)&&zh(n,e,e.next,i)&&Xs(n,i)&&Xs(i,n)&&(t.push(n.i,e.i,i.i),qs(e),qs(e.next),e=s=i),e=e.next}while(e!==s);return Di(e)}function qd(s,t,e,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&ef(o,a)){let l=Hh(o,a);o=Di(o,o.next),l=Di(l,l.next),Ws(o,t,e,n,i,r,0),Ws(l,t,e,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function Yd(s,t,e,n){const i=[];for(let r=0,o=t.length;r<o;r++){const a=t[r]*n,l=r<o-1?t[r+1]*n:s.length,c=Oh(s,a,l,n,!1);c===c.next&&(c.steiner=!0),i.push(tf(c))}i.sort(Zd);for(let r=0;r<i.length;r++)e=$d(i[r],e);return e}function Zd(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function $d(s,t){const e=Kd(s,t);if(!e)return t;const n=Hh(e,s);return Di(n,n.next),Di(e,e.next)}function Kd(s,t){let e=t;const n=s.x,i=s.y;let r=-1/0,o;if(ps(s,e))return e;do{if(ps(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){const u=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,l=o.x,c=o.y;let h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Bh(i<c?n:r,i,l,c,i<c?r:n,i,e.x,e.y)){const u=Math.abs(i-e.y)/(n-e.x);Xs(e,s)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&Jd(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function Jd(s,t){return Ce(s.prev,s,t.prev)<0&&Ce(t.next,s,s.next)<0}function jd(s,t,e,n){let i=s;do i.z===0&&(i.z=Ga(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,Qd(i)}function Qd(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(i=n,n=n.nextZ,a--):(i=o,o=o.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=o}r.nextZ=null,e*=2}while(t>1);return s}function Ga(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function tf(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function Bh(s,t,e,n,i,r,o,a){return(i-o)*(t-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(i-o)*(n-a)}function Rs(s,t,e,n,i,r,o,a){return!(s===o&&t===a)&&Bh(s,t,e,n,i,r,o,a)}function ef(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!nf(s,t)&&(Xs(s,t)&&Xs(t,s)&&sf(s,t)&&(Ce(s.prev,s,t.prev)||Ce(s,t.prev,t))||ps(s,t)&&Ce(s.prev,s,s.next)>0&&Ce(t.prev,t,t.next)>0)}function Ce(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function ps(s,t){return s.x===t.x&&s.y===t.y}function zh(s,t,e,n){const i=Tr(Ce(s,t,e)),r=Tr(Ce(s,t,n)),o=Tr(Ce(e,n,s)),a=Tr(Ce(e,n,t));return!!(i!==r&&o!==a||i===0&&br(s,e,t)||r===0&&br(s,n,t)||o===0&&br(e,s,n)||a===0&&br(e,t,n))}function br(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Tr(s){return s>0?1:s<0?-1:0}function nf(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&zh(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function Xs(s,t){return Ce(s.prev,s,s.next)<0?Ce(s,t,s.next)>=0&&Ce(s,s.prev,t)>=0:Ce(s,t,s.prev)<0||Ce(s,s.next,t)<0}function sf(s,t){let e=s,n=!1;const i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function Hh(s,t){const e=Va(s.i,s.x,s.y),n=Va(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function ll(s,t,e,n){const i=Va(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function qs(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Va(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function rf(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}class of{static triangulate(t,e,n=2){return Gd(t,e,n)}}class Ln{static area(t){const e=t.length;let n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return Ln.area(t)<0}static triangulateShape(t,e){const n=[],i=[],r=[];hl(t),ul(n,t);let o=t.length;e.forEach(hl);for(let l=0;l<e.length;l++)i.push(o),o+=e[l].length,ul(n,e[l]);const a=of.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function hl(s){const t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function ul(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}class ms extends ae{constructor(t=new fs([new mt(.5,.5),new mt(-.5,.5),new mt(-.5,-.5),new mt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,i=[],r=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new zt(i,3)),this.setAttribute("uv",new zt(r,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:af;let x,_=!1,y,E,T,A;p&&(x=p.getSpacedPoints(h),_=!0,d=!1,y=p.computeFrenetFrames(h,!1),E=new I,T=new I,A=new I),d||(m=0,f=0,g=0,v=0);const w=a.extractPoints(c);let S=w.shape;const C=w.holes;if(!Ln.isClockWise(S)){S=S.reverse();for(let rt=0,st=C.length;rt<st;rt++){const nt=C[rt];Ln.isClockWise(nt)&&(C[rt]=nt.reverse())}}function U(rt){const nt=10000000000000001e-36;let it=rt[0];for(let dt=1;dt<=rt.length;dt++){const lt=dt%rt.length,gt=rt[lt],Ht=gt.x-it.x,Bt=gt.y-it.y,D=Ht*Ht+Bt*Bt,b=Math.max(Math.abs(gt.x),Math.abs(gt.y),Math.abs(it.x),Math.abs(it.y)),G=nt*b*b;if(D<=G){rt.splice(lt,1),dt--;continue}it=gt}}U(S),C.forEach(U);const z=C.length,F=S;for(let rt=0;rt<z;rt++){const st=C[rt];S=S.concat(st)}function H(rt,st,nt){return st||console.error("THREE.ExtrudeGeometry: vec does not exist"),rt.clone().addScaledVector(st,nt)}const q=S.length;function O(rt,st,nt){let it,dt,lt;const gt=rt.x-st.x,Ht=rt.y-st.y,Bt=nt.x-rt.x,D=nt.y-rt.y,b=gt*gt+Ht*Ht,G=gt*D-Ht*Bt;if(Math.abs(G)>Number.EPSILON){const N=Math.sqrt(b),Z=Math.sqrt(Bt*Bt+D*D),k=st.x-Ht/N,vt=st.y+gt/N,ht=nt.x-D/Z,Pt=nt.y+Bt/Z,It=((ht-k)*D-(Pt-vt)*Bt)/(gt*D-Ht*Bt);it=k+gt*It-rt.x,dt=vt+Ht*It-rt.y;const pt=it*it+dt*dt;if(pt<=2)return new mt(it,dt);lt=Math.sqrt(pt/2)}else{let N=!1;gt>Number.EPSILON?Bt>Number.EPSILON&&(N=!0):gt<-Number.EPSILON?Bt<-Number.EPSILON&&(N=!0):Math.sign(Ht)===Math.sign(D)&&(N=!0),N?(it=-Ht,dt=gt,lt=Math.sqrt(b)):(it=gt,dt=Ht,lt=Math.sqrt(b/2))}return new mt(it/lt,dt/lt)}const W=[];for(let rt=0,st=F.length,nt=st-1,it=rt+1;rt<st;rt++,nt++,it++)nt===st&&(nt=0),it===st&&(it=0),W[rt]=O(F[rt],F[nt],F[it]);const tt=[];let et,ct=W.concat();for(let rt=0,st=z;rt<st;rt++){const nt=C[rt];et=[];for(let it=0,dt=nt.length,lt=dt-1,gt=it+1;it<dt;it++,lt++,gt++)lt===dt&&(lt=0),gt===dt&&(gt=0),et[it]=O(nt[it],nt[lt],nt[gt]);tt.push(et),ct=ct.concat(et)}let _t;if(m===0)_t=Ln.triangulateShape(F,C);else{const rt=[],st=[];for(let nt=0;nt<m;nt++){const it=nt/m,dt=f*Math.cos(it*Math.PI/2),lt=g*Math.sin(it*Math.PI/2)+v;for(let gt=0,Ht=F.length;gt<Ht;gt++){const Bt=H(F[gt],W[gt],lt);Q(Bt.x,Bt.y,-dt),it===0&&rt.push(Bt)}for(let gt=0,Ht=z;gt<Ht;gt++){const Bt=C[gt];et=tt[gt];const D=[];for(let b=0,G=Bt.length;b<G;b++){const N=H(Bt[b],et[b],lt);Q(N.x,N.y,-dt),it===0&&D.push(N)}it===0&&st.push(D)}}_t=Ln.triangulateShape(rt,st)}const bt=_t.length,yt=g+v;for(let rt=0;rt<q;rt++){const st=d?H(S[rt],ct[rt],yt):S[rt];_?(T.copy(y.normals[0]).multiplyScalar(st.x),E.copy(y.binormals[0]).multiplyScalar(st.y),A.copy(x[0]).add(T).add(E),Q(A.x,A.y,A.z)):Q(st.x,st.y,0)}for(let rt=1;rt<=h;rt++)for(let st=0;st<q;st++){const nt=d?H(S[st],ct[st],yt):S[st];_?(T.copy(y.normals[rt]).multiplyScalar(nt.x),E.copy(y.binormals[rt]).multiplyScalar(nt.y),A.copy(x[rt]).add(T).add(E),Q(A.x,A.y,A.z)):Q(nt.x,nt.y,u/h*rt)}for(let rt=m-1;rt>=0;rt--){const st=rt/m,nt=f*Math.cos(st*Math.PI/2),it=g*Math.sin(st*Math.PI/2)+v;for(let dt=0,lt=F.length;dt<lt;dt++){const gt=H(F[dt],W[dt],it);Q(gt.x,gt.y,u+nt)}for(let dt=0,lt=C.length;dt<lt;dt++){const gt=C[dt];et=tt[dt];for(let Ht=0,Bt=gt.length;Ht<Bt;Ht++){const D=H(gt[Ht],et[Ht],it);_?Q(D.x,D.y+x[h-1].y,x[h-1].x+nt):Q(D.x,D.y,u+nt)}}}Y(),K();function Y(){const rt=i.length/3;if(d){let st=0,nt=q*st;for(let it=0;it<bt;it++){const dt=_t[it];ot(dt[2]+nt,dt[1]+nt,dt[0]+nt)}st=h+m*2,nt=q*st;for(let it=0;it<bt;it++){const dt=_t[it];ot(dt[0]+nt,dt[1]+nt,dt[2]+nt)}}else{for(let st=0;st<bt;st++){const nt=_t[st];ot(nt[2],nt[1],nt[0])}for(let st=0;st<bt;st++){const nt=_t[st];ot(nt[0]+q*h,nt[1]+q*h,nt[2]+q*h)}}n.addGroup(rt,i.length/3-rt,0)}function K(){const rt=i.length/3;let st=0;ut(F,st),st+=F.length;for(let nt=0,it=C.length;nt<it;nt++){const dt=C[nt];ut(dt,st),st+=dt.length}n.addGroup(rt,i.length/3-rt,1)}function ut(rt,st){let nt=rt.length;for(;--nt>=0;){const it=nt;let dt=nt-1;dt<0&&(dt=rt.length-1);for(let lt=0,gt=h+m*2;lt<gt;lt++){const Ht=q*lt,Bt=q*(lt+1),D=st+it+Ht,b=st+dt+Ht,G=st+dt+Bt,N=st+it+Bt;At(D,b,G,N)}}}function Q(rt,st,nt){l.push(rt),l.push(st),l.push(nt)}function ot(rt,st,nt){qt(rt),qt(st),qt(nt);const it=i.length/3,dt=M.generateTopUV(n,i,it-3,it-2,it-1);L(dt[0]),L(dt[1]),L(dt[2])}function At(rt,st,nt,it){qt(rt),qt(st),qt(it),qt(st),qt(nt),qt(it);const dt=i.length/3,lt=M.generateSideWallUV(n,i,dt-6,dt-3,dt-2,dt-1);L(lt[0]),L(lt[1]),L(lt[3]),L(lt[1]),L(lt[2]),L(lt[3])}function qt(rt){i.push(l[rt*3+0]),i.push(l[rt*3+1]),i.push(l[rt*3+2])}function L(rt){r.push(rt.x),r.push(rt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return cf(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new Zr[i.type]().fromJSON(i)),new ms(n,t.options)}}const af={generateTopUV:function(s,t,e,n,i){const r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[i*3],h=t[i*3+1];return[new mt(r,o),new mt(a,l),new mt(c,h)]},generateSideWallUV:function(s,t,e,n,i,r){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[i*3],f=t[i*3+1],g=t[i*3+2],v=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new mt(o,1-l),new mt(c,1-u),new mt(d,1-g),new mt(v,1-p)]:[new mt(a,1-l),new mt(h,1-u),new mt(f,1-g),new mt(m,1-p)]}};function cf(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Ei extends io{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ei(t.radius,t.detail)}}class Ci extends ae{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=t/a,d=e/l,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const M=p*d-o;for(let x=0;x<c;x++){const _=x*u-r;g.push(_,-M,0),v.push(0,0,1),m.push(x/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<a;M++){const x=M+c*p,_=M+c*(p+1),y=M+1+c*(p+1),E=M+1+c*p;f.push(x,_,E),f.push(_,y,E)}this.setIndex(f),this.setAttribute("position",new zt(g,3)),this.setAttribute("normal",new zt(v,3)),this.setAttribute("uv",new zt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ci(t.width,t.height,t.widthSegments,t.heightSegments)}}class Xn extends ae{constructor(t=.5,e=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);const a=[],l=[],c=[],h=[];let u=t;const d=(e-t)/i,f=new I,g=new mt;for(let v=0;v<=i;v++){for(let m=0;m<=n;m++){const p=r+m/n*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let v=0;v<i;v++){const m=v*(n+1);for(let p=0;p<n;p++){const M=p+m,x=M,_=M+n+1,y=M+n+2,E=M+1;a.push(x,_,E),a.push(_,y,E)}}this.setIndex(a),this.setAttribute("position",new zt(l,3)),this.setAttribute("normal",new zt(c,3)),this.setAttribute("uv",new zt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xn(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class $r extends ae{constructor(t=new fs([new mt(0,.5),new mt(-.5,-.5),new mt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],i=[],r=[],o=[];let a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new zt(i,3)),this.setAttribute("normal",new zt(r,3)),this.setAttribute("uv",new zt(o,2));function c(h){const u=i.length/3,d=h.extractPoints(e);let f=d.shape;const g=d.holes;Ln.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const M=g[m];Ln.isClockWise(M)===!0&&(g[m]=M.reverse())}const v=Ln.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const M=g[m];f=f.concat(M)}for(let m=0,p=f.length;m<p;m++){const M=f[m];i.push(M.x,M.y,0),r.push(0,0,1),o.push(M.x,M.y)}for(let m=0,p=v.length;m<p;m++){const M=v[m],x=M[0]+u,_=M[1]+u,y=M[2]+u;n.push(x,_,y),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return lf(e,t)}static fromJSON(t,e){const n=[];for(let i=0,r=t.shapes.length;i<r;i++){const o=e[t.shapes[i]];n.push(o)}return new $r(n,t.curveSegments)}}function lf(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){const i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}class qn extends ae{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new I,d=new I,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const M=[],x=p/n;let _=0;p===0&&o===0?_=.5/e:p===n&&l===Math.PI&&(_=-.5/e);for(let y=0;y<=e;y++){const E=y/e;u.x=-t*Math.cos(i+E*r)*Math.sin(o+x*a),u.y=t*Math.cos(o+x*a),u.z=t*Math.sin(i+E*r)*Math.sin(o+x*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(E+_,1-x),M.push(c++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<e;M++){const x=h[p][M+1],_=h[p][M],y=h[p+1][M],E=h[p+1][M+1];(p!==0||o>0)&&f.push(x,_,E),(p!==n-1||l<Math.PI)&&f.push(_,y,E)}this.setIndex(f),this.setAttribute("position",new zt(g,3)),this.setAttribute("normal",new zt(v,3)),this.setAttribute("uv",new zt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Kr extends ae{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const o=[],a=[],l=[],c=[],h=new I,u=new I,d=new I;for(let f=0;f<=n;f++)for(let g=0;g<=i;g++){const v=g/i*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/i),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=i;g++){const v=(i+1)*f+g-1,m=(i+1)*(f-1)+g-1,p=(i+1)*(f-1)+g,M=(i+1)*f+g;o.push(v,m,M),o.push(m,p,M)}this.setIndex(o),this.setAttribute("position",new zt(a,3)),this.setAttribute("normal",new zt(l,3)),this.setAttribute("uv",new zt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Kr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Jr extends ae{constructor(t=new mc(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),e=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new I,l=new I,c=new mt;let h=new I;const u=[],d=[],f=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new zt(u,3)),this.setAttribute("normal",new zt(d,3)),this.setAttribute("uv",new zt(f,2));function v(){for(let x=0;x<e;x++)m(x);m(r===!1?e:0),M(),p()}function m(x){h=t.getPointAt(x/e,h);const _=o.normals[x],y=o.binormals[x];for(let E=0;E<=i;E++){const T=E/i*Math.PI*2,A=Math.sin(T),w=-Math.cos(T);l.x=w*_.x+A*y.x,l.y=w*_.y+A*y.y,l.z=w*_.z+A*y.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function p(){for(let x=1;x<=e;x++)for(let _=1;_<=i;_++){const y=(i+1)*(x-1)+(_-1),E=(i+1)*x+(_-1),T=(i+1)*x+_,A=(i+1)*(x-1)+_;g.push(y,E,A),g.push(E,T,A)}}function M(){for(let x=0;x<=e;x++)for(let _=0;_<=i;_++)c.x=x/e,c.y=_/i,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Jr(new Zr[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class hf extends qe{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class wt extends Ni{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=sc,this.normalScale=new mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class uf extends wt{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new mt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ee(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Xt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Xt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Xt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class df extends Ni{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=sc,this.normalScale=new mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class ff extends Ni{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ru,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class pf extends Ni{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class kh extends Ue{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Xt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class mf extends kh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ue.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ko=new he,dl=new I,fl=new I;class gf{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new mt(512,512),this.mapType=Nn,this.map=null,this.mapPass=null,this.matrix=new he,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lc,this._frameExtents=new mt(1,1),this._viewportCount=1,this._viewports=[new Ee(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;dl.setFromMatrixPosition(t.matrixWorld),e.position.copy(dl),fl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(fl),e.updateMatrixWorld(),ko.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ko,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ko)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class so extends Ah{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class vf extends gf{constructor(){super(new so(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class _f extends kh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ue.DEFAULT_UP),this.updateMatrix(),this.target=new Ue,this.shadow=new vf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class xf extends vn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Mf{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const pl=new he;class yf{constructor(t,e,n=0,i=1/0){this.ray=new ac(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new cc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return pl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(pl),this}intersectObject(t,e=!0,n=[]){return Wa(t,this,n,e),n.sort(ml),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)Wa(t[i],this,n,e);return n.sort(ml),n}}function ml(s,t){return s.distance-t.distance}function Wa(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let o=0,a=r.length;o<a;o++)Wa(r[o],t,e,!0)}}function gl(s,t,e,n){const i=Sf(n);switch(e){case vh:return s*t;case eo:return s*t/i.components*i.byteLength;case ec:return s*t/i.components*i.byteLength;case xh:return s*t*2/i.components*i.byteLength;case nc:return s*t*2/i.components*i.byteLength;case _h:return s*t*3/i.components*i.byteLength;case fn:return s*t*4/i.components*i.byteLength;case ic:return s*t*4/i.components*i.byteLength;case Ur:case Fr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Or:case Br:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case pa:case ga:return Math.max(s,16)*Math.max(t,8)/4;case fa:case ma:return Math.max(s,8)*Math.max(t,8)/2;case va:case _a:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case xa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ma:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ya:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Sa:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case wa:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Ea:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case ba:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Ta:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case Aa:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Ca:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Ra:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Pa:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Da:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case La:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Ia:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Na:case Ua:case Fa:return Math.ceil(s/4)*Math.ceil(t/4)*16;case Oa:case Ba:return Math.ceil(s/4)*Math.ceil(t/4)*8;case za:case Ha:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Sf(s){switch(s){case Nn:case fh:return{byteLength:1,components:1};case Hs:case ph:case ui:return{byteLength:2,components:1};case Qa:case tc:return{byteLength:2,components:4};case Pi:case ja:case An:return{byteLength:4,components:1};case mh:case gh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ka}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ka);function Gh(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function wf(s){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,a),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],v=u[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const v=u[f];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var Ef=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,bf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Tf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Af=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Rf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Pf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Df=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Lf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,If=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Nf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Uf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ff=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Of=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Bf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,zf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Hf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,kf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Gf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Vf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Wf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Xf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,qf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Yf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Zf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,$f=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Kf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Jf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,jf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,tp="gl_FragColor = linearToOutputTexel( gl_FragColor );",ep=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,np=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ip=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,sp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,rp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,op=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ap=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,cp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,lp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,hp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,up=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,dp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,fp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,pp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,mp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,gp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,vp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_p=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Mp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,yp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Sp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,wp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ep=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,bp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Tp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ap=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Pp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Dp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Lp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ip=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Np=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Up=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Fp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Op=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Bp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Hp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,kp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Gp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Vp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,qp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Yp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$p=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Kp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Jp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,jp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Qp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,tm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,em=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,nm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,im=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,rm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,om=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,am=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,cm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,lm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,hm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,um=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,dm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,fm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,mm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,vm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,_m=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,xm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ym=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Sm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const wm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Em=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Am=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Pm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Dm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Lm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Im=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Nm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Um=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Fm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Om=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Bm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,km=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Gm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Wm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Xm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ym=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Zm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$m=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Km=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,jm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Qm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,t0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,e0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,n0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Qt={alphahash_fragment:Ef,alphahash_pars_fragment:bf,alphamap_fragment:Tf,alphamap_pars_fragment:Af,alphatest_fragment:Cf,alphatest_pars_fragment:Rf,aomap_fragment:Pf,aomap_pars_fragment:Df,batching_pars_vertex:Lf,batching_vertex:If,begin_vertex:Nf,beginnormal_vertex:Uf,bsdfs:Ff,iridescence_fragment:Of,bumpmap_pars_fragment:Bf,clipping_planes_fragment:zf,clipping_planes_pars_fragment:Hf,clipping_planes_pars_vertex:kf,clipping_planes_vertex:Gf,color_fragment:Vf,color_pars_fragment:Wf,color_pars_vertex:Xf,color_vertex:qf,common:Yf,cube_uv_reflection_fragment:Zf,defaultnormal_vertex:$f,displacementmap_pars_vertex:Kf,displacementmap_vertex:Jf,emissivemap_fragment:jf,emissivemap_pars_fragment:Qf,colorspace_fragment:tp,colorspace_pars_fragment:ep,envmap_fragment:np,envmap_common_pars_fragment:ip,envmap_pars_fragment:sp,envmap_pars_vertex:rp,envmap_physical_pars_fragment:gp,envmap_vertex:op,fog_vertex:ap,fog_pars_vertex:cp,fog_fragment:lp,fog_pars_fragment:hp,gradientmap_pars_fragment:up,lightmap_pars_fragment:dp,lights_lambert_fragment:fp,lights_lambert_pars_fragment:pp,lights_pars_begin:mp,lights_toon_fragment:vp,lights_toon_pars_fragment:_p,lights_phong_fragment:xp,lights_phong_pars_fragment:Mp,lights_physical_fragment:yp,lights_physical_pars_fragment:Sp,lights_fragment_begin:wp,lights_fragment_maps:Ep,lights_fragment_end:bp,logdepthbuf_fragment:Tp,logdepthbuf_pars_fragment:Ap,logdepthbuf_pars_vertex:Cp,logdepthbuf_vertex:Rp,map_fragment:Pp,map_pars_fragment:Dp,map_particle_fragment:Lp,map_particle_pars_fragment:Ip,metalnessmap_fragment:Np,metalnessmap_pars_fragment:Up,morphinstance_vertex:Fp,morphcolor_vertex:Op,morphnormal_vertex:Bp,morphtarget_pars_vertex:zp,morphtarget_vertex:Hp,normal_fragment_begin:kp,normal_fragment_maps:Gp,normal_pars_fragment:Vp,normal_pars_vertex:Wp,normal_vertex:Xp,normalmap_pars_fragment:qp,clearcoat_normal_fragment_begin:Yp,clearcoat_normal_fragment_maps:Zp,clearcoat_pars_fragment:$p,iridescence_pars_fragment:Kp,opaque_fragment:Jp,packing:jp,premultiplied_alpha_fragment:Qp,project_vertex:tm,dithering_fragment:em,dithering_pars_fragment:nm,roughnessmap_fragment:im,roughnessmap_pars_fragment:sm,shadowmap_pars_fragment:rm,shadowmap_pars_vertex:om,shadowmap_vertex:am,shadowmask_pars_fragment:cm,skinbase_vertex:lm,skinning_pars_vertex:hm,skinning_vertex:um,skinnormal_vertex:dm,specularmap_fragment:fm,specularmap_pars_fragment:pm,tonemapping_fragment:mm,tonemapping_pars_fragment:gm,transmission_fragment:vm,transmission_pars_fragment:_m,uv_pars_fragment:xm,uv_pars_vertex:Mm,uv_vertex:ym,worldpos_vertex:Sm,background_vert:wm,background_frag:Em,backgroundCube_vert:bm,backgroundCube_frag:Tm,cube_vert:Am,cube_frag:Cm,depth_vert:Rm,depth_frag:Pm,distanceRGBA_vert:Dm,distanceRGBA_frag:Lm,equirect_vert:Im,equirect_frag:Nm,linedashed_vert:Um,linedashed_frag:Fm,meshbasic_vert:Om,meshbasic_frag:Bm,meshlambert_vert:zm,meshlambert_frag:Hm,meshmatcap_vert:km,meshmatcap_frag:Gm,meshnormal_vert:Vm,meshnormal_frag:Wm,meshphong_vert:Xm,meshphong_frag:qm,meshphysical_vert:Ym,meshphysical_frag:Zm,meshtoon_vert:$m,meshtoon_frag:Km,points_vert:Jm,points_frag:jm,shadow_vert:Qm,shadow_frag:t0,sprite_vert:e0,sprite_frag:n0},Tt={common:{diffuse:{value:new Xt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new Xt(16777215)},opacity:{value:1},center:{value:new mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},Pn={basic:{uniforms:je([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:je([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Xt(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:je([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Xt(0)},specular:{value:new Xt(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:je([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new Xt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:je([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new Xt(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:je([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:je([Tt.points,Tt.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:je([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:je([Tt.common,Tt.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:je([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:je([Tt.sprite,Tt.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:je([Tt.common,Tt.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:je([Tt.lights,Tt.fog,{color:{value:new Xt(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};Pn.physical={uniforms:je([Pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new Xt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new Xt(0)},specularColor:{value:new Xt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const Ar={r:0,b:0,g:0},xi=new Un,i0=new he;function s0(s,t,e,n,i,r,o){const a=new Xt(0);let l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(x){let _=x.isScene===!0?x.background:null;return _&&_.isTexture&&(_=(x.backgroundBlurriness>0?e:t).get(_)),_}function v(x){let _=!1;const y=g(x);y===null?p(a,l):y&&y.isColor&&(p(y,1),_=!0);const E=s.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(x,_){const y=g(_);y&&(y.isCubeTexture||y.mapping===to)?(h===void 0&&(h=new J(new Ut(1,1,1),new qe({name:"BackgroundCubeMaterial",uniforms:ds(Pn.backgroundCube.uniforms),vertexShader:Pn.backgroundCube.vertexShader,fragmentShader:Pn.backgroundCube.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),xi.copy(_.backgroundRotation),xi.x*=-1,xi.y*=-1,xi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(xi.y*=-1,xi.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(i0.makeRotationFromEuler(xi)),h.material.toneMapped=oe.getTransfer(y.colorSpace)!==fe,(u!==y||d!==y.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,f=s.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new J(new Ci(2,2),new qe({name:"BackgroundMaterial",uniforms:ds(Pn.background.uniforms),vertexShader:Pn.background.vertexShader,fragmentShader:Pn.background.fragmentShader,side:Kn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=oe.getTransfer(y.colorSpace)!==fe,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,f=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,_){x.getRGB(Ar,Th(s)),n.buffers.color.setClear(Ar.r,Ar.g,Ar.b,_,o)}function M(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,_=1){a.set(x),l=_,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,p(a,l)},render:v,addToRenderList:m,dispose:M}}function r0(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,o=!1;function a(S,C,P,U,z){let F=!1;const H=u(U,P,C);r!==H&&(r=H,c(r.object)),F=f(S,U,P,z),F&&g(S,U,P,z),z!==null&&t.update(z,s.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,_(S,C,P,U),z!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return s.createVertexArray()}function c(S){return s.bindVertexArray(S)}function h(S){return s.deleteVertexArray(S)}function u(S,C,P){const U=P.wireframe===!0;let z=n[S.id];z===void 0&&(z={},n[S.id]=z);let F=z[C.id];F===void 0&&(F={},z[C.id]=F);let H=F[U];return H===void 0&&(H=d(l()),F[U]=H),H}function d(S){const C=[],P=[],U=[];for(let z=0;z<e;z++)C[z]=0,P[z]=0,U[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:P,attributeDivisors:U,object:S,attributes:{},index:null}}function f(S,C,P,U){const z=r.attributes,F=C.attributes;let H=0;const q=P.getAttributes();for(const O in q)if(q[O].location>=0){const tt=z[O];let et=F[O];if(et===void 0&&(O==="instanceMatrix"&&S.instanceMatrix&&(et=S.instanceMatrix),O==="instanceColor"&&S.instanceColor&&(et=S.instanceColor)),tt===void 0||tt.attribute!==et||et&&tt.data!==et.data)return!0;H++}return r.attributesNum!==H||r.index!==U}function g(S,C,P,U){const z={},F=C.attributes;let H=0;const q=P.getAttributes();for(const O in q)if(q[O].location>=0){let tt=F[O];tt===void 0&&(O==="instanceMatrix"&&S.instanceMatrix&&(tt=S.instanceMatrix),O==="instanceColor"&&S.instanceColor&&(tt=S.instanceColor));const et={};et.attribute=tt,tt&&tt.data&&(et.data=tt.data),z[O]=et,H++}r.attributes=z,r.attributesNum=H,r.index=U}function v(){const S=r.newAttributes;for(let C=0,P=S.length;C<P;C++)S[C]=0}function m(S){p(S,0)}function p(S,C){const P=r.newAttributes,U=r.enabledAttributes,z=r.attributeDivisors;P[S]=1,U[S]===0&&(s.enableVertexAttribArray(S),U[S]=1),z[S]!==C&&(s.vertexAttribDivisor(S,C),z[S]=C)}function M(){const S=r.newAttributes,C=r.enabledAttributes;for(let P=0,U=C.length;P<U;P++)C[P]!==S[P]&&(s.disableVertexAttribArray(P),C[P]=0)}function x(S,C,P,U,z,F,H){H===!0?s.vertexAttribIPointer(S,C,P,z,F):s.vertexAttribPointer(S,C,P,U,z,F)}function _(S,C,P,U){v();const z=U.attributes,F=P.getAttributes(),H=C.defaultAttributeValues;for(const q in F){const O=F[q];if(O.location>=0){let W=z[q];if(W===void 0&&(q==="instanceMatrix"&&S.instanceMatrix&&(W=S.instanceMatrix),q==="instanceColor"&&S.instanceColor&&(W=S.instanceColor)),W!==void 0){const tt=W.normalized,et=W.itemSize,ct=t.get(W);if(ct===void 0)continue;const _t=ct.buffer,bt=ct.type,yt=ct.bytesPerElement,Y=bt===s.INT||bt===s.UNSIGNED_INT||W.gpuType===ja;if(W.isInterleavedBufferAttribute){const K=W.data,ut=K.stride,Q=W.offset;if(K.isInstancedInterleavedBuffer){for(let ot=0;ot<O.locationSize;ot++)p(O.location+ot,K.meshPerAttribute);S.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ot=0;ot<O.locationSize;ot++)m(O.location+ot);s.bindBuffer(s.ARRAY_BUFFER,_t);for(let ot=0;ot<O.locationSize;ot++)x(O.location+ot,et/O.locationSize,bt,tt,ut*yt,(Q+et/O.locationSize*ot)*yt,Y)}else{if(W.isInstancedBufferAttribute){for(let K=0;K<O.locationSize;K++)p(O.location+K,W.meshPerAttribute);S.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let K=0;K<O.locationSize;K++)m(O.location+K);s.bindBuffer(s.ARRAY_BUFFER,_t);for(let K=0;K<O.locationSize;K++)x(O.location+K,et/O.locationSize,bt,tt,et*yt,et/O.locationSize*K*yt,Y)}}else if(H!==void 0){const tt=H[q];if(tt!==void 0)switch(tt.length){case 2:s.vertexAttrib2fv(O.location,tt);break;case 3:s.vertexAttrib3fv(O.location,tt);break;case 4:s.vertexAttrib4fv(O.location,tt);break;default:s.vertexAttrib1fv(O.location,tt)}}}}M()}function y(){A();for(const S in n){const C=n[S];for(const P in C){const U=C[P];for(const z in U)h(U[z].object),delete U[z];delete C[P]}delete n[S]}}function E(S){if(n[S.id]===void 0)return;const C=n[S.id];for(const P in C){const U=C[P];for(const z in U)h(U[z].object),delete U[z];delete C[P]}delete n[S.id]}function T(S){for(const C in n){const P=n[C];if(P[S.id]===void 0)continue;const U=P[S.id];for(const z in U)h(U[z].object),delete U[z];delete P[S.id]}}function A(){w(),o=!0,r!==i&&(r=i,c(r.object))}function w(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:A,resetDefaultState:w,dispose:y,releaseStatesOfGeometry:E,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:m,disableUnusedAttributes:M}}function o0(s,t,e){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function l(c,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*d[v];e.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function a0(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(T){return!(T!==fn&&n.convert(T)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){const A=T===ui&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==Nn&&n.convert(T)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==An&&!A)}function l(T){if(T==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),x=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),y=g>0,E=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:x,maxFragmentUniforms:_,vertexTextures:y,maxSamples:E}}function c0(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new ri,a=new jt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{const M=r?0:n,x=M*4;let _=p.clippingState||null;l.value=_,_=h(g,d,x,f);for(let y=0;y!==x;++y)_[y]=e[y];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=f+v*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,_=f;x!==v;++x,_+=4)o.copy(u[x]).applyMatrix4(M,a),o.normal.toArray(m,_),m[_+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function l0(s){let t=new WeakMap;function e(o,a){return a===ha?o.mapping=as:a===ua&&(o.mapping=cs),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===ha||a===ua)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Ed(l.height);return c.fromEquirectangularTexture(s,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const ts=4,vl=[.125,.215,.35,.446,.526,.582],bi=20,Go=new so,_l=new Xt;let Vo=null,Wo=0,Xo=0,qo=!1;const Si=(1+Math.sqrt(5))/2,Ji=1/Si,xl=[new I(-Si,Ji,0),new I(Si,Ji,0),new I(-Ji,0,Si),new I(Ji,0,Si),new I(0,Si,-Ji),new I(0,Si,Ji),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],h0=new I;class Ml{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100,r={}){const{size:o=256,position:a=h0}=r;Vo=this._renderer.getRenderTarget(),Wo=this._renderer.getActiveCubeFace(),Xo=this._renderer.getActiveMipmapLevel(),qo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Vo,Wo,Xo),this._renderer.xr.enabled=qo,t.scissorTest=!1,Cr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===as||t.mapping===cs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Vo=this._renderer.getRenderTarget(),Wo=this._renderer.getActiveCubeFace(),Xo=this._renderer.getActiveMipmapLevel(),qo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:en,minFilter:en,generateMipmaps:!1,type:ui,format:fn,colorSpace:us,depthBuffer:!1},i=yl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=u0(r)),this._blurMaterial=d0(r,t,e)}return i}_compileMaterial(t){const e=new J(this._lodPlanes[0],t);this._renderer.compile(e,Go)}_sceneToCubeUV(t,e,n,i,r){const l=new vn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(_l),u.toneMapping=li,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null));const v=new le({name:"PMREM.Background",side:on,depthWrite:!1,depthTest:!1}),m=new J(new Ut,v);let p=!1;const M=t.background;M?M.isColor&&(v.color.copy(M),t.background=null,p=!0):(v.color.copy(_l),p=!0);for(let x=0;x<6;x++){const _=x%3;_===0?(l.up.set(0,c[x],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[x],r.y,r.z)):_===1?(l.up.set(0,0,c[x]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[x],r.z)):(l.up.set(0,c[x],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[x]));const y=this._cubeSize;Cr(i,_*y,x>2?y:0,y,y),u.setRenderTarget(i),p&&u.render(m,l),u.render(t,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=M}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===as||t.mapping===cs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=wl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sl());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new J(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Cr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Go)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=xl[(i-r-1)%xl.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new J(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*bi-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):bi;m>bi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${bi}`);const p=[];let M=0;for(let T=0;T<bi;++T){const A=T/v,w=Math.exp(-A*A/2);p.push(w),T===0?M+=w:T<m&&(M+=2*w)}for(let T=0;T<p.length;T++)p[T]=p[T]/M;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;const _=this._sizeLods[i],y=3*_*(i>x-ts?i-x+ts:0),E=4*(this._cubeSize-_);Cr(e,y,E,3*_,2*_),l.setRenderTarget(e),l.render(u,Go)}}function u0(s){const t=[],e=[],n=[];let i=s;const r=s-ts+1+vl.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);e.push(a);let l=1/a;o>s-ts?l=vl[o-s+ts-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,p=1,M=new Float32Array(v*g*f),x=new Float32Array(m*g*f),_=new Float32Array(p*g*f);for(let E=0;E<f;E++){const T=E%3*2/3-1,A=E>2?0:-1,w=[T,A,0,T+2/3,A,0,T+2/3,A+1,0,T,A,0,T+2/3,A+1,0,T,A+1,0];M.set(w,v*g*E),x.set(d,m*g*E);const S=[E,E,E,E,E,E];_.set(S,p*g*E)}const y=new ae;y.setAttribute("position",new Mn(M,v)),y.setAttribute("uv",new Mn(x,m)),y.setAttribute("faceIndex",new Mn(_,p)),t.push(y),i>ts&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function yl(s,t,e){const n=new yn(s,t,e);return n.texture.mapping=to,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Cr(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function d0(s,t,e){const n=new Float32Array(bi),i=new I(0,1,0);return new qe({name:"SphericalGaussianBlur",defines:{n:bi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:gc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:tn,depthTest:!1,depthWrite:!1})}function Sl(){return new qe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:gc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:tn,depthTest:!1,depthWrite:!1})}function wl(){return new qe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:gc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:tn,depthTest:!1,depthWrite:!1})}function gc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function f0(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===ha||l===ua,h=l===as||l===cs;if(c||h){let u=t.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Ml(s)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&i(f)?(e===null&&(e=new Ml(s)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function p0(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Vs("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function m0(s,t,e,n){const i={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete i[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)t.update(d[f],s.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const M=f.array;v=f.version;for(let x=0,_=M.length;x<_;x+=3){const y=M[x+0],E=M[x+1],T=M[x+2];d.push(y,E,E,T,T,y)}}else if(g!==void 0){const M=g.array;v=g.version;for(let x=0,_=M.length/3-1;x<_;x+=3){const y=x+0,E=x+1,T=x+2;d.push(y,E,E,T,T,y)}}else return;const m=new(yh(d)?bh:Eh)(d,1);m.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function g0(s,t,e){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){s.drawElements(n,f,r,d*o),e.update(f,n,1)}function c(d,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,d*o,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,v,0,g);let p=0;for(let M=0;M<g;M++)p+=f[M]*v[M];e.update(p,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function v0(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function _0(s,t,e){const n=new WeakMap,i=new Ee;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let S=function(){A.dispose(),n.delete(a),a.removeEventListener("dispose",S)};var f=S;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],M=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let _=0;g===!0&&(_=1),v===!0&&(_=2),m===!0&&(_=3);let y=a.attributes.position.count*_,E=1;y>t.maxTextureSize&&(E=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const T=new Float32Array(y*E*4*u),A=new Sh(T,y,E,u);A.type=An,A.needsUpdate=!0;const w=_*4;for(let C=0;C<u;C++){const P=p[C],U=M[C],z=x[C],F=y*E*4*C;for(let H=0;H<P.count;H++){const q=H*w;g===!0&&(i.fromBufferAttribute(P,H),T[F+q+0]=i.x,T[F+q+1]=i.y,T[F+q+2]=i.z,T[F+q+3]=0),v===!0&&(i.fromBufferAttribute(U,H),T[F+q+4]=i.x,T[F+q+5]=i.y,T[F+q+6]=i.z,T[F+q+7]=0),m===!0&&(i.fromBufferAttribute(z,H),T[F+q+8]=i.x,T[F+q+9]=i.y,T[F+q+10]=i.z,T[F+q+11]=z.itemSize===4?i.w:1)}}d={count:u,texture:A,size:new mt(y,E)},n.set(a,d),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const v=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",v),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function x0(s,t,e,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(i.get(u)!==c&&(t.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}const Vh=new $e,El=new hc(1,1),Wh=new Sh,Xh=new cd,qh=new Ch,bl=[],Tl=[],Al=new Float32Array(16),Cl=new Float32Array(9),Rl=new Float32Array(4);function _s(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=bl[i];if(r===void 0&&(r=new Float32Array(i),bl[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function ze(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function He(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function ro(s,t){let e=Tl[t];e===void 0&&(e=new Int32Array(t),Tl[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function M0(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function y0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ze(e,t))return;s.uniform2fv(this.addr,t),He(e,t)}}function S0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ze(e,t))return;s.uniform3fv(this.addr,t),He(e,t)}}function w0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ze(e,t))return;s.uniform4fv(this.addr,t),He(e,t)}}function E0(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(ze(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),He(e,t)}else{if(ze(e,n))return;Rl.set(n),s.uniformMatrix2fv(this.addr,!1,Rl),He(e,n)}}function b0(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(ze(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),He(e,t)}else{if(ze(e,n))return;Cl.set(n),s.uniformMatrix3fv(this.addr,!1,Cl),He(e,n)}}function T0(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(ze(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),He(e,t)}else{if(ze(e,n))return;Al.set(n),s.uniformMatrix4fv(this.addr,!1,Al),He(e,n)}}function A0(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function C0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ze(e,t))return;s.uniform2iv(this.addr,t),He(e,t)}}function R0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ze(e,t))return;s.uniform3iv(this.addr,t),He(e,t)}}function P0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ze(e,t))return;s.uniform4iv(this.addr,t),He(e,t)}}function D0(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function L0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ze(e,t))return;s.uniform2uiv(this.addr,t),He(e,t)}}function I0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ze(e,t))return;s.uniform3uiv(this.addr,t),He(e,t)}}function N0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ze(e,t))return;s.uniform4uiv(this.addr,t),He(e,t)}}function U0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(El.compareFunction=Mh,r=El):r=Vh,e.setTexture2D(t||r,i)}function F0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Xh,i)}function O0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||qh,i)}function B0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Wh,i)}function z0(s){switch(s){case 5126:return M0;case 35664:return y0;case 35665:return S0;case 35666:return w0;case 35674:return E0;case 35675:return b0;case 35676:return T0;case 5124:case 35670:return A0;case 35667:case 35671:return C0;case 35668:case 35672:return R0;case 35669:case 35673:return P0;case 5125:return D0;case 36294:return L0;case 36295:return I0;case 36296:return N0;case 35678:case 36198:case 36298:case 36306:case 35682:return U0;case 35679:case 36299:case 36307:return F0;case 35680:case 36300:case 36308:case 36293:return O0;case 36289:case 36303:case 36311:case 36292:return B0}}function H0(s,t){s.uniform1fv(this.addr,t)}function k0(s,t){const e=_s(t,this.size,2);s.uniform2fv(this.addr,e)}function G0(s,t){const e=_s(t,this.size,3);s.uniform3fv(this.addr,e)}function V0(s,t){const e=_s(t,this.size,4);s.uniform4fv(this.addr,e)}function W0(s,t){const e=_s(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function X0(s,t){const e=_s(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function q0(s,t){const e=_s(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Y0(s,t){s.uniform1iv(this.addr,t)}function Z0(s,t){s.uniform2iv(this.addr,t)}function $0(s,t){s.uniform3iv(this.addr,t)}function K0(s,t){s.uniform4iv(this.addr,t)}function J0(s,t){s.uniform1uiv(this.addr,t)}function j0(s,t){s.uniform2uiv(this.addr,t)}function Q0(s,t){s.uniform3uiv(this.addr,t)}function tg(s,t){s.uniform4uiv(this.addr,t)}function eg(s,t,e){const n=this.cache,i=t.length,r=ro(e,i);ze(n,r)||(s.uniform1iv(this.addr,r),He(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||Vh,r[o])}function ng(s,t,e){const n=this.cache,i=t.length,r=ro(e,i);ze(n,r)||(s.uniform1iv(this.addr,r),He(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Xh,r[o])}function ig(s,t,e){const n=this.cache,i=t.length,r=ro(e,i);ze(n,r)||(s.uniform1iv(this.addr,r),He(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||qh,r[o])}function sg(s,t,e){const n=this.cache,i=t.length,r=ro(e,i);ze(n,r)||(s.uniform1iv(this.addr,r),He(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Wh,r[o])}function rg(s){switch(s){case 5126:return H0;case 35664:return k0;case 35665:return G0;case 35666:return V0;case 35674:return W0;case 35675:return X0;case 35676:return q0;case 5124:case 35670:return Y0;case 35667:case 35671:return Z0;case 35668:case 35672:return $0;case 35669:case 35673:return K0;case 5125:return J0;case 36294:return j0;case 36295:return Q0;case 36296:return tg;case 35678:case 36198:case 36298:case 36306:case 35682:return eg;case 35679:case 36299:case 36307:return ng;case 35680:case 36300:case 36308:case 36293:return ig;case 36289:case 36303:case 36311:case 36292:return sg}}class og{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=z0(e.type)}}class ag{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=rg(e.type)}}class cg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const Yo=/(\w+)(\])?(\[|\.)?/g;function Pl(s,t){s.seq.push(t),s.map[t.id]=t}function lg(s,t,e){const n=s.name,i=n.length;for(Yo.lastIndex=0;;){const r=Yo.exec(n),o=Yo.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Pl(e,c===void 0?new og(a,s,t):new ag(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new cg(a),Pl(e,u)),e=u}}}class zr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);lg(r,o,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function Dl(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const hg=37297;let ug=0;function dg(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Ll=new jt;function fg(s){oe._getMatrix(Ll,oe.workingColorSpace,s);const t=`mat3( ${Ll.elements.map(e=>e.toFixed(4))} )`;switch(oe.getTransfer(s)){case Gr:return[t,"LinearTransferOETF"];case fe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Il(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+dg(s.getShaderSource(t),a)}else return r}function pg(s,t){const e=fg(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function mg(s,t){let e;switch(t){case oh:e="Linear";break;case ah:e="Reinhard";break;case ch:e="Cineon";break;case lh:e="ACESFilmic";break;case uh:e="AgX";break;case Ja:e="Neutral";break;case hh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Rr=new I;function gg(){oe.getLuminanceCoefficients(Rr);const s=Rr.x.toFixed(4),t=Rr.y.toFixed(4),e=Rr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function vg(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ps).join(`
`)}function _g(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function xg(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function Ps(s){return s!==""}function Nl(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ul(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Mg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xa(s){return s.replace(Mg,Sg)}const yg=new Map;function Sg(s,t){let e=Qt[t];if(e===void 0){const n=yg.get(t);if(n!==void 0)e=Qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Xa(e)}const wg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fl(s){return s.replace(wg,Eg)}function Eg(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Ol(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function bg(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===th?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===eh?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Wn&&(t="SHADOWMAP_TYPE_VSM"),t}function Tg(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case as:case cs:t="ENVMAP_TYPE_CUBE";break;case to:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Ag(s){let t="ENVMAP_MODE_REFLECTION";return s.envMap&&s.envMapMode===cs&&(t="ENVMAP_MODE_REFRACTION"),t}function Cg(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case rh:t="ENVMAP_BLENDING_MULTIPLY";break;case Tu:t="ENVMAP_BLENDING_MIX";break;case Au:t="ENVMAP_BLENDING_ADD";break}return t}function Rg(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Pg(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=bg(e),c=Tg(e),h=Ag(e),u=Cg(e),d=Rg(e),f=vg(e),g=_g(r),v=i.createProgram();let m,p,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ps).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ps).join(`
`),p.length>0&&(p+=`
`)):(m=[Ol(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ps).join(`
`),p=[Ol(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==li?"#define TONE_MAPPING":"",e.toneMapping!==li?Qt.tonemapping_pars_fragment:"",e.toneMapping!==li?mg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,pg("linearToOutputTexel",e.outputColorSpace),gg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ps).join(`
`)),o=Xa(o),o=Nl(o,e),o=Ul(o,e),a=Xa(a),a=Nl(a,e),a=Ul(a,e),o=Fl(o),a=Fl(a),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Uc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Uc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=M+m+o,_=M+p+a,y=Dl(i,i.VERTEX_SHADER,x),E=Dl(i,i.FRAGMENT_SHADER,_);i.attachShader(v,y),i.attachShader(v,E),e.index0AttributeName!==void 0?i.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function T(C){if(s.debug.checkShaderErrors){const P=i.getProgramInfoLog(v)||"",U=i.getShaderInfoLog(y)||"",z=i.getShaderInfoLog(E)||"",F=P.trim(),H=U.trim(),q=z.trim();let O=!0,W=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(O=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,y,E);else{const tt=Il(i,y,"vertex"),et=Il(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+F+`
`+tt+`
`+et)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(H===""||q==="")&&(W=!1);W&&(C.diagnostics={runnable:O,programLog:F,vertexShader:{log:H,prefix:m},fragmentShader:{log:q,prefix:p}})}i.deleteShader(y),i.deleteShader(E),A=new zr(i,v),w=xg(i,v)}let A;this.getUniforms=function(){return A===void 0&&T(this),A};let w;this.getAttributes=function(){return w===void 0&&T(this),w};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=i.getProgramParameter(v,hg)),S},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ug++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=y,this.fragmentShader=E,this}let Dg=0;class Lg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Ig(t),e.set(t,n)),n}}class Ig{constructor(t){this.id=Dg++,this.code=t,this.usedTimes=0}}function Ng(s,t,e,n,i,r,o){const a=new cc,l=new Lg,c=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(w){return c.add(w),w===0?"uv":`uv${w}`}function m(w,S,C,P,U){const z=P.fog,F=U.geometry,H=w.isMeshStandardMaterial?P.environment:null,q=(w.isMeshStandardMaterial?e:t).get(w.envMap||H),O=q&&q.mapping===to?q.image.height:null,W=g[w.type];w.precision!==null&&(f=i.getMaxPrecision(w.precision),f!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",f,"instead."));const tt=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,et=tt!==void 0?tt.length:0;let ct=0;F.morphAttributes.position!==void 0&&(ct=1),F.morphAttributes.normal!==void 0&&(ct=2),F.morphAttributes.color!==void 0&&(ct=3);let _t,bt,yt,Y;if(W){const ue=Pn[W];_t=ue.vertexShader,bt=ue.fragmentShader}else _t=w.vertexShader,bt=w.fragmentShader,l.update(w),yt=l.getVertexShaderID(w),Y=l.getFragmentShaderID(w);const K=s.getRenderTarget(),ut=s.state.buffers.depth.getReversed(),Q=U.isInstancedMesh===!0,ot=U.isBatchedMesh===!0,At=!!w.map,qt=!!w.matcap,L=!!q,rt=!!w.aoMap,st=!!w.lightMap,nt=!!w.bumpMap,it=!!w.normalMap,dt=!!w.displacementMap,lt=!!w.emissiveMap,gt=!!w.metalnessMap,Ht=!!w.roughnessMap,Bt=w.anisotropy>0,D=w.clearcoat>0,b=w.dispersion>0,G=w.iridescence>0,N=w.sheen>0,Z=w.transmission>0,k=Bt&&!!w.anisotropyMap,vt=D&&!!w.clearcoatMap,ht=D&&!!w.clearcoatNormalMap,Pt=D&&!!w.clearcoatRoughnessMap,It=G&&!!w.iridescenceMap,pt=G&&!!w.iridescenceThicknessMap,Ct=N&&!!w.sheenColorMap,Vt=N&&!!w.sheenRoughnessMap,Ot=!!w.specularMap,Et=!!w.specularColorMap,Yt=!!w.specularIntensityMap,B=Z&&!!w.transmissionMap,ft=Z&&!!w.thicknessMap,St=!!w.gradientMap,Lt=!!w.alphaMap,xt=w.alphaTest>0,at=!!w.alphaHash,Ft=!!w.extensions;let Jt=li;w.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Jt=s.toneMapping);const ye={shaderID:W,shaderType:w.type,shaderName:w.name,vertexShader:_t,fragmentShader:bt,defines:w.defines,customVertexShaderID:yt,customFragmentShaderID:Y,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:f,batching:ot,batchingColor:ot&&U._colorsTexture!==null,instancing:Q,instancingColor:Q&&U.instanceColor!==null,instancingMorph:Q&&U.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:K===null?s.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:us,alphaToCoverage:!!w.alphaToCoverage,map:At,matcap:qt,envMap:L,envMapMode:L&&q.mapping,envMapCubeUVHeight:O,aoMap:rt,lightMap:st,bumpMap:nt,normalMap:it,displacementMap:d&&dt,emissiveMap:lt,normalMapObjectSpace:it&&w.normalMapType===Du,normalMapTangentSpace:it&&w.normalMapType===sc,metalnessMap:gt,roughnessMap:Ht,anisotropy:Bt,anisotropyMap:k,clearcoat:D,clearcoatMap:vt,clearcoatNormalMap:ht,clearcoatRoughnessMap:Pt,dispersion:b,iridescence:G,iridescenceMap:It,iridescenceThicknessMap:pt,sheen:N,sheenColorMap:Ct,sheenRoughnessMap:Vt,specularMap:Ot,specularColorMap:Et,specularIntensityMap:Yt,transmission:Z,transmissionMap:B,thicknessMap:ft,gradientMap:St,opaque:w.transparent===!1&&w.blending===ns&&w.alphaToCoverage===!1,alphaMap:Lt,alphaTest:xt,alphaHash:at,combine:w.combine,mapUv:At&&v(w.map.channel),aoMapUv:rt&&v(w.aoMap.channel),lightMapUv:st&&v(w.lightMap.channel),bumpMapUv:nt&&v(w.bumpMap.channel),normalMapUv:it&&v(w.normalMap.channel),displacementMapUv:dt&&v(w.displacementMap.channel),emissiveMapUv:lt&&v(w.emissiveMap.channel),metalnessMapUv:gt&&v(w.metalnessMap.channel),roughnessMapUv:Ht&&v(w.roughnessMap.channel),anisotropyMapUv:k&&v(w.anisotropyMap.channel),clearcoatMapUv:vt&&v(w.clearcoatMap.channel),clearcoatNormalMapUv:ht&&v(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pt&&v(w.clearcoatRoughnessMap.channel),iridescenceMapUv:It&&v(w.iridescenceMap.channel),iridescenceThicknessMapUv:pt&&v(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ct&&v(w.sheenColorMap.channel),sheenRoughnessMapUv:Vt&&v(w.sheenRoughnessMap.channel),specularMapUv:Ot&&v(w.specularMap.channel),specularColorMapUv:Et&&v(w.specularColorMap.channel),specularIntensityMapUv:Yt&&v(w.specularIntensityMap.channel),transmissionMapUv:B&&v(w.transmissionMap.channel),thicknessMapUv:ft&&v(w.thicknessMap.channel),alphaMapUv:Lt&&v(w.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(it||Bt),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!F.attributes.uv&&(At||Lt),fog:!!z,useFog:w.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ut,skinning:U.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:et,morphTextureStride:ct,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:s.shadowMap.enabled&&C.length>0,shadowMapType:s.shadowMap.type,toneMapping:Jt,decodeVideoTexture:At&&w.map.isVideoTexture===!0&&oe.getTransfer(w.map.colorSpace)===fe,decodeVideoTextureEmissive:lt&&w.emissiveMap.isVideoTexture===!0&&oe.getTransfer(w.emissiveMap.colorSpace)===fe,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===xe,flipSided:w.side===on,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Ft&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ft&&w.extensions.multiDraw===!0||ot)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return ye.vertexUv1s=c.has(1),ye.vertexUv2s=c.has(2),ye.vertexUv3s=c.has(3),c.clear(),ye}function p(w){const S=[];if(w.shaderID?S.push(w.shaderID):(S.push(w.customVertexShaderID),S.push(w.customFragmentShaderID)),w.defines!==void 0)for(const C in w.defines)S.push(C),S.push(w.defines[C]);return w.isRawShaderMaterial===!1&&(M(S,w),x(S,w),S.push(s.outputColorSpace)),S.push(w.customProgramCacheKey),S.join()}function M(w,S){w.push(S.precision),w.push(S.outputColorSpace),w.push(S.envMapMode),w.push(S.envMapCubeUVHeight),w.push(S.mapUv),w.push(S.alphaMapUv),w.push(S.lightMapUv),w.push(S.aoMapUv),w.push(S.bumpMapUv),w.push(S.normalMapUv),w.push(S.displacementMapUv),w.push(S.emissiveMapUv),w.push(S.metalnessMapUv),w.push(S.roughnessMapUv),w.push(S.anisotropyMapUv),w.push(S.clearcoatMapUv),w.push(S.clearcoatNormalMapUv),w.push(S.clearcoatRoughnessMapUv),w.push(S.iridescenceMapUv),w.push(S.iridescenceThicknessMapUv),w.push(S.sheenColorMapUv),w.push(S.sheenRoughnessMapUv),w.push(S.specularMapUv),w.push(S.specularColorMapUv),w.push(S.specularIntensityMapUv),w.push(S.transmissionMapUv),w.push(S.thicknessMapUv),w.push(S.combine),w.push(S.fogExp2),w.push(S.sizeAttenuation),w.push(S.morphTargetsCount),w.push(S.morphAttributeCount),w.push(S.numDirLights),w.push(S.numPointLights),w.push(S.numSpotLights),w.push(S.numSpotLightMaps),w.push(S.numHemiLights),w.push(S.numRectAreaLights),w.push(S.numDirLightShadows),w.push(S.numPointLightShadows),w.push(S.numSpotLightShadows),w.push(S.numSpotLightShadowsWithMaps),w.push(S.numLightProbes),w.push(S.shadowMapType),w.push(S.toneMapping),w.push(S.numClippingPlanes),w.push(S.numClipIntersection),w.push(S.depthPacking)}function x(w,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),w.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),w.push(a.mask)}function _(w){const S=g[w.type];let C;if(S){const P=Pn[S];C=Zn.clone(P.uniforms)}else C=w.uniforms;return C}function y(w,S){let C;for(let P=0,U=h.length;P<U;P++){const z=h[P];if(z.cacheKey===S){C=z,++C.usedTimes;break}}return C===void 0&&(C=new Pg(s,S,w,r),h.push(C)),C}function E(w){if(--w.usedTimes===0){const S=h.indexOf(w);h[S]=h[h.length-1],h.pop(),w.destroy()}}function T(w){l.remove(w)}function A(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:y,releaseProgram:E,releaseShaderCache:T,programs:h,dispose:A}}function Ug(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function Fg(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function Bl(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function zl(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u,d,f,g,v,m){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},s[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function a(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):e.push(p)}function l(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||Fg),n.length>1&&n.sort(d||Bl),i.length>1&&i.sort(d||Bl)}function h(){for(let u=t,d=s.length;u<d;u++){const f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function Og(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new zl,s.set(n,[o])):i>=r.length?(o=new zl,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function Bg(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new Xt};break;case"SpotLight":e={position:new I,direction:new I,color:new Xt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Xt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Xt,groundColor:new Xt};break;case"RectAreaLight":e={color:new Xt,position:new I,halfWidth:new I,halfHeight:new I};break}return s[t.id]=e,e}}}function zg(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Hg=0;function kg(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Gg(s){const t=new Bg,e=zg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const i=new I,r=new he,o=new he;function a(c){let h=0,u=0,d=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,M=0,x=0,_=0,y=0,E=0,T=0;c.sort(kg);for(let w=0,S=c.length;w<S;w++){const C=c[w],P=C.color,U=C.intensity,z=C.distance,F=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=P.r*U,u+=P.g*U,d+=P.b*U;else if(C.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(C.sh.coefficients[H],U);T++}else if(C.isDirectionalLight){const H=t.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const q=C.shadow,O=e.get(C);O.shadowIntensity=q.intensity,O.shadowBias=q.bias,O.shadowNormalBias=q.normalBias,O.shadowRadius=q.radius,O.shadowMapSize=q.mapSize,n.directionalShadow[f]=O,n.directionalShadowMap[f]=F,n.directionalShadowMatrix[f]=C.shadow.matrix,M++}n.directional[f]=H,f++}else if(C.isSpotLight){const H=t.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(P).multiplyScalar(U),H.distance=z,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,n.spot[v]=H;const q=C.shadow;if(C.map&&(n.spotLightMap[y]=C.map,y++,q.updateMatrices(C),C.castShadow&&E++),n.spotLightMatrix[v]=q.matrix,C.castShadow){const O=e.get(C);O.shadowIntensity=q.intensity,O.shadowBias=q.bias,O.shadowNormalBias=q.normalBias,O.shadowRadius=q.radius,O.shadowMapSize=q.mapSize,n.spotShadow[v]=O,n.spotShadowMap[v]=F,_++}v++}else if(C.isRectAreaLight){const H=t.get(C);H.color.copy(P).multiplyScalar(U),H.halfWidth.set(C.width*.5,0,0),H.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=H,m++}else if(C.isPointLight){const H=t.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),H.distance=C.distance,H.decay=C.decay,C.castShadow){const q=C.shadow,O=e.get(C);O.shadowIntensity=q.intensity,O.shadowBias=q.bias,O.shadowNormalBias=q.normalBias,O.shadowRadius=q.radius,O.shadowMapSize=q.mapSize,O.shadowCameraNear=q.camera.near,O.shadowCameraFar=q.camera.far,n.pointShadow[g]=O,n.pointShadowMap[g]=F,n.pointShadowMatrix[g]=C.shadow.matrix,x++}n.point[g]=H,g++}else if(C.isHemisphereLight){const H=t.get(C);H.skyColor.copy(C.color).multiplyScalar(U),H.groundColor.copy(C.groundColor).multiplyScalar(U),n.hemi[p]=H,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Tt.LTC_FLOAT_1,n.rectAreaLTC2=Tt.LTC_FLOAT_2):(n.rectAreaLTC1=Tt.LTC_HALF_1,n.rectAreaLTC2=Tt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const A=n.hash;(A.directionalLength!==f||A.pointLength!==g||A.spotLength!==v||A.rectAreaLength!==m||A.hemiLength!==p||A.numDirectionalShadows!==M||A.numPointShadows!==x||A.numSpotShadows!==_||A.numSpotMaps!==y||A.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=_+y-E,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=T,A.directionalLength=f,A.pointLength=g,A.spotLength=v,A.rectAreaLength=m,A.hemiLength=p,A.numDirectionalShadows=M,A.numPointShadows=x,A.numSpotShadows=_,A.numSpotMaps=y,A.numLightProbes=T,n.version=Hg++)}function l(c,h){let u=0,d=0,f=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){const x=c[p];if(x.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(m),u++}else if(x.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(m),f++}else if(x.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),_.halfWidth.set(x.width*.5,0,0),_.halfHeight.set(0,x.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(x.matrixWorld),_.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:n}}function Hl(s){const t=new Gg(s),e=[],n=[];function i(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Vg(s){let t=new WeakMap;function e(i,r=0){const o=t.get(i);let a;return o===void 0?(a=new Hl(s),t.set(i,[a])):r>=o.length?(a=new Hl(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const Wg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Xg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function qg(s,t,e){let n=new lc;const i=new mt,r=new mt,o=new Ee,a=new ff({depthPacking:Pu}),l=new pf,c={},h=e.maxTextureSize,u={[Kn]:on,[on]:Kn,[xe]:xe},d=new qe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new mt},radius:{value:4}},vertexShader:Wg,fragmentShader:Xg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new ae;g.setAttribute("position",new Mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new J(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=th;let p=this.type;this.render=function(E,T,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const w=s.getRenderTarget(),S=s.getActiveCubeFace(),C=s.getActiveMipmapLevel(),P=s.state;P.setBlending(tn),P.buffers.depth.getReversed()===!0?P.buffers.color.setClear(0,0,0,0):P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const U=p!==Wn&&this.type===Wn,z=p===Wn&&this.type!==Wn;for(let F=0,H=E.length;F<H;F++){const q=E[F],O=q.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;i.copy(O.mapSize);const W=O.getFrameExtents();if(i.multiply(W),r.copy(O.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/W.x),i.x=r.x*W.x,O.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/W.y),i.y=r.y*W.y,O.mapSize.y=r.y)),O.map===null||U===!0||z===!0){const et=this.type!==Wn?{minFilter:nn,magFilter:nn}:{};O.map!==null&&O.map.dispose(),O.map=new yn(i.x,i.y,et),O.map.texture.name=q.name+".shadowMap",O.camera.updateProjectionMatrix()}s.setRenderTarget(O.map),s.clear();const tt=O.getViewportCount();for(let et=0;et<tt;et++){const ct=O.getViewport(et);o.set(r.x*ct.x,r.y*ct.y,r.x*ct.z,r.y*ct.w),P.viewport(o),O.updateMatrices(q,et),n=O.getFrustum(),_(T,A,O.camera,q,this.type)}O.isPointLightShadow!==!0&&this.type===Wn&&M(O,A),O.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(w,S,C)};function M(E,T){const A=t.update(v);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new yn(i.x,i.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(T,null,A,d,v,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(T,null,A,f,v,null)}function x(E,T,A,w){let S=null;const C=A.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(C!==void 0)S=C;else if(S=A.isPointLight===!0?l:a,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const P=S.uuid,U=T.uuid;let z=c[P];z===void 0&&(z={},c[P]=z);let F=z[U];F===void 0&&(F=S.clone(),z[U]=F,T.addEventListener("dispose",y)),S=F}if(S.visible=T.visible,S.wireframe=T.wireframe,w===Wn?S.side=T.shadowSide!==null?T.shadowSide:T.side:S.side=T.shadowSide!==null?T.shadowSide:u[T.side],S.alphaMap=T.alphaMap,S.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,S.map=T.map,S.clipShadows=T.clipShadows,S.clippingPlanes=T.clippingPlanes,S.clipIntersection=T.clipIntersection,S.displacementMap=T.displacementMap,S.displacementScale=T.displacementScale,S.displacementBias=T.displacementBias,S.wireframeLinewidth=T.wireframeLinewidth,S.linewidth=T.linewidth,A.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const P=s.properties.get(S);P.light=A}return S}function _(E,T,A,w,S){if(E.visible===!1)return;if(E.layers.test(T.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&S===Wn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,E.matrixWorld);const U=t.update(E),z=E.material;if(Array.isArray(z)){const F=U.groups;for(let H=0,q=F.length;H<q;H++){const O=F[H],W=z[O.materialIndex];if(W&&W.visible){const tt=x(E,W,w,S);E.onBeforeShadow(s,E,T,A,U,tt,O),s.renderBufferDirect(A,null,U,tt,E,O),E.onAfterShadow(s,E,T,A,U,tt,O)}}}else if(z.visible){const F=x(E,z,w,S);E.onBeforeShadow(s,E,T,A,U,F,null),s.renderBufferDirect(A,null,U,F,E,null),E.onAfterShadow(s,E,T,A,U,F,null)}}const P=E.children;for(let U=0,z=P.length;U<z;U++)_(P[U],T,A,w,S)}function y(E){E.target.removeEventListener("dispose",y);for(const A in c){const w=c[A],S=E.target.uuid;S in w&&(w[S].dispose(),delete w[S])}}}const Yg={[ia]:sa,[ra]:ca,[oa]:la,[os]:aa,[sa]:ia,[ca]:ra,[la]:oa,[aa]:os};function Zg(s,t){function e(){let B=!1;const ft=new Ee;let St=null;const Lt=new Ee(0,0,0,0);return{setMask:function(xt){St!==xt&&!B&&(s.colorMask(xt,xt,xt,xt),St=xt)},setLocked:function(xt){B=xt},setClear:function(xt,at,Ft,Jt,ye){ye===!0&&(xt*=Jt,at*=Jt,Ft*=Jt),ft.set(xt,at,Ft,Jt),Lt.equals(ft)===!1&&(s.clearColor(xt,at,Ft,Jt),Lt.copy(ft))},reset:function(){B=!1,St=null,Lt.set(-1,0,0,0)}}}function n(){let B=!1,ft=!1,St=null,Lt=null,xt=null;return{setReversed:function(at){if(ft!==at){const Ft=t.get("EXT_clip_control");at?Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.ZERO_TO_ONE_EXT):Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.NEGATIVE_ONE_TO_ONE_EXT),ft=at;const Jt=xt;xt=null,this.setClear(Jt)}},getReversed:function(){return ft},setTest:function(at){at?K(s.DEPTH_TEST):ut(s.DEPTH_TEST)},setMask:function(at){St!==at&&!B&&(s.depthMask(at),St=at)},setFunc:function(at){if(ft&&(at=Yg[at]),Lt!==at){switch(at){case ia:s.depthFunc(s.NEVER);break;case sa:s.depthFunc(s.ALWAYS);break;case ra:s.depthFunc(s.LESS);break;case os:s.depthFunc(s.LEQUAL);break;case oa:s.depthFunc(s.EQUAL);break;case aa:s.depthFunc(s.GEQUAL);break;case ca:s.depthFunc(s.GREATER);break;case la:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Lt=at}},setLocked:function(at){B=at},setClear:function(at){xt!==at&&(ft&&(at=1-at),s.clearDepth(at),xt=at)},reset:function(){B=!1,St=null,Lt=null,xt=null,ft=!1}}}function i(){let B=!1,ft=null,St=null,Lt=null,xt=null,at=null,Ft=null,Jt=null,ye=null;return{setTest:function(ue){B||(ue?K(s.STENCIL_TEST):ut(s.STENCIL_TEST))},setMask:function(ue){ft!==ue&&!B&&(s.stencilMask(ue),ft=ue)},setFunc:function(ue,On,Cn){(St!==ue||Lt!==On||xt!==Cn)&&(s.stencilFunc(ue,On,Cn),St=ue,Lt=On,xt=Cn)},setOp:function(ue,On,Cn){(at!==ue||Ft!==On||Jt!==Cn)&&(s.stencilOp(ue,On,Cn),at=ue,Ft=On,Jt=Cn)},setLocked:function(ue){B=ue},setClear:function(ue){ye!==ue&&(s.clearStencil(ue),ye=ue)},reset:function(){B=!1,ft=null,St=null,Lt=null,xt=null,at=null,Ft=null,Jt=null,ye=null}}}const r=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,M=null,x=null,_=null,y=null,E=null,T=new Xt(0,0,0),A=0,w=!1,S=null,C=null,P=null,U=null,z=null;const F=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,q=0;const O=s.getParameter(s.VERSION);O.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(O)[1]),H=q>=1):O.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),H=q>=2);let W=null,tt={};const et=s.getParameter(s.SCISSOR_BOX),ct=s.getParameter(s.VIEWPORT),_t=new Ee().fromArray(et),bt=new Ee().fromArray(ct);function yt(B,ft,St,Lt){const xt=new Uint8Array(4),at=s.createTexture();s.bindTexture(B,at),s.texParameteri(B,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(B,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ft=0;Ft<St;Ft++)B===s.TEXTURE_3D||B===s.TEXTURE_2D_ARRAY?s.texImage3D(ft,0,s.RGBA,1,1,Lt,0,s.RGBA,s.UNSIGNED_BYTE,xt):s.texImage2D(ft+Ft,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,xt);return at}const Y={};Y[s.TEXTURE_2D]=yt(s.TEXTURE_2D,s.TEXTURE_2D,1),Y[s.TEXTURE_CUBE_MAP]=yt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[s.TEXTURE_2D_ARRAY]=yt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Y[s.TEXTURE_3D]=yt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),K(s.DEPTH_TEST),o.setFunc(os),nt(!1),it(Pc),K(s.CULL_FACE),rt(tn);function K(B){h[B]!==!0&&(s.enable(B),h[B]=!0)}function ut(B){h[B]!==!1&&(s.disable(B),h[B]=!1)}function Q(B,ft){return u[B]!==ft?(s.bindFramebuffer(B,ft),u[B]=ft,B===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=ft),B===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=ft),!0):!1}function ot(B,ft){let St=f,Lt=!1;if(B){St=d.get(ft),St===void 0&&(St=[],d.set(ft,St));const xt=B.textures;if(St.length!==xt.length||St[0]!==s.COLOR_ATTACHMENT0){for(let at=0,Ft=xt.length;at<Ft;at++)St[at]=s.COLOR_ATTACHMENT0+at;St.length=xt.length,Lt=!0}}else St[0]!==s.BACK&&(St[0]=s.BACK,Lt=!0);Lt&&s.drawBuffers(St)}function At(B){return g!==B?(s.useProgram(B),g=B,!0):!1}const qt={[Yn]:s.FUNC_ADD,[du]:s.FUNC_SUBTRACT,[fu]:s.FUNC_REVERSE_SUBTRACT};qt[pu]=s.MIN,qt[mu]=s.MAX;const L={[ta]:s.ZERO,[gu]:s.ONE,[vu]:s.SRC_COLOR,[ea]:s.SRC_ALPHA,[yu]:s.SRC_ALPHA_SATURATE,[sh]:s.DST_COLOR,[ih]:s.DST_ALPHA,[_u]:s.ONE_MINUS_SRC_COLOR,[na]:s.ONE_MINUS_SRC_ALPHA,[Mu]:s.ONE_MINUS_DST_COLOR,[xu]:s.ONE_MINUS_DST_ALPHA,[Su]:s.CONSTANT_COLOR,[wu]:s.ONE_MINUS_CONSTANT_COLOR,[Eu]:s.CONSTANT_ALPHA,[bu]:s.ONE_MINUS_CONSTANT_ALPHA};function rt(B,ft,St,Lt,xt,at,Ft,Jt,ye,ue){if(B===tn){v===!0&&(ut(s.BLEND),v=!1);return}if(v===!1&&(K(s.BLEND),v=!0),B!==nh){if(B!==m||ue!==w){if((p!==Yn||_!==Yn)&&(s.blendEquation(s.FUNC_ADD),p=Yn,_=Yn),ue)switch(B){case ns:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Qo:s.blendFunc(s.ONE,s.ONE);break;case Dc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Lc:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case ns:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Qo:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Dc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Lc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}M=null,x=null,y=null,E=null,T.set(0,0,0),A=0,m=B,w=ue}return}xt=xt||ft,at=at||St,Ft=Ft||Lt,(ft!==p||xt!==_)&&(s.blendEquationSeparate(qt[ft],qt[xt]),p=ft,_=xt),(St!==M||Lt!==x||at!==y||Ft!==E)&&(s.blendFuncSeparate(L[St],L[Lt],L[at],L[Ft]),M=St,x=Lt,y=at,E=Ft),(Jt.equals(T)===!1||ye!==A)&&(s.blendColor(Jt.r,Jt.g,Jt.b,ye),T.copy(Jt),A=ye),m=B,w=!1}function st(B,ft){B.side===xe?ut(s.CULL_FACE):K(s.CULL_FACE);let St=B.side===on;ft&&(St=!St),nt(St),B.blending===ns&&B.transparent===!1?rt(tn):rt(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),r.setMask(B.colorWrite);const Lt=B.stencilWrite;a.setTest(Lt),Lt&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),lt(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?K(s.SAMPLE_ALPHA_TO_COVERAGE):ut(s.SAMPLE_ALPHA_TO_COVERAGE)}function nt(B){S!==B&&(B?s.frontFace(s.CW):s.frontFace(s.CCW),S=B)}function it(B){B!==hu?(K(s.CULL_FACE),B!==C&&(B===Pc?s.cullFace(s.BACK):B===uu?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ut(s.CULL_FACE),C=B}function dt(B){B!==P&&(H&&s.lineWidth(B),P=B)}function lt(B,ft,St){B?(K(s.POLYGON_OFFSET_FILL),(U!==ft||z!==St)&&(s.polygonOffset(ft,St),U=ft,z=St)):ut(s.POLYGON_OFFSET_FILL)}function gt(B){B?K(s.SCISSOR_TEST):ut(s.SCISSOR_TEST)}function Ht(B){B===void 0&&(B=s.TEXTURE0+F-1),W!==B&&(s.activeTexture(B),W=B)}function Bt(B,ft,St){St===void 0&&(W===null?St=s.TEXTURE0+F-1:St=W);let Lt=tt[St];Lt===void 0&&(Lt={type:void 0,texture:void 0},tt[St]=Lt),(Lt.type!==B||Lt.texture!==ft)&&(W!==St&&(s.activeTexture(St),W=St),s.bindTexture(B,ft||Y[B]),Lt.type=B,Lt.texture=ft)}function D(){const B=tt[W];B!==void 0&&B.type!==void 0&&(s.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function b(){try{s.compressedTexImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function G(){try{s.compressedTexImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function N(){try{s.texSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Z(){try{s.texSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function k(){try{s.compressedTexSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function vt(){try{s.compressedTexSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ht(){try{s.texStorage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Pt(){try{s.texStorage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function It(){try{s.texImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function pt(){try{s.texImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ct(B){_t.equals(B)===!1&&(s.scissor(B.x,B.y,B.z,B.w),_t.copy(B))}function Vt(B){bt.equals(B)===!1&&(s.viewport(B.x,B.y,B.z,B.w),bt.copy(B))}function Ot(B,ft){let St=c.get(ft);St===void 0&&(St=new WeakMap,c.set(ft,St));let Lt=St.get(B);Lt===void 0&&(Lt=s.getUniformBlockIndex(ft,B.name),St.set(B,Lt))}function Et(B,ft){const Lt=c.get(ft).get(B);l.get(ft)!==Lt&&(s.uniformBlockBinding(ft,Lt,B.__bindingPointIndex),l.set(ft,Lt))}function Yt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},W=null,tt={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,M=null,x=null,_=null,y=null,E=null,T=new Xt(0,0,0),A=0,w=!1,S=null,C=null,P=null,U=null,z=null,_t.set(0,0,s.canvas.width,s.canvas.height),bt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:K,disable:ut,bindFramebuffer:Q,drawBuffers:ot,useProgram:At,setBlending:rt,setMaterial:st,setFlipSided:nt,setCullFace:it,setLineWidth:dt,setPolygonOffset:lt,setScissorTest:gt,activeTexture:Ht,bindTexture:Bt,unbindTexture:D,compressedTexImage2D:b,compressedTexImage3D:G,texImage2D:It,texImage3D:pt,updateUBOMapping:Ot,uniformBlockBinding:Et,texStorage2D:ht,texStorage3D:Pt,texSubImage2D:N,texSubImage3D:Z,compressedTexSubImage2D:k,compressedTexSubImage3D:vt,scissor:Ct,viewport:Vt,reset:Yt}}function $g(s,t,e,n,i,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new mt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,b){return f?new OffscreenCanvas(D,b):Wr("canvas")}function v(D,b,G){let N=1;const Z=Bt(D);if((Z.width>G||Z.height>G)&&(N=G/Math.max(Z.width,Z.height)),N<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const k=Math.floor(N*Z.width),vt=Math.floor(N*Z.height);u===void 0&&(u=g(k,vt));const ht=b?g(k,vt):u;return ht.width=k,ht.height=vt,ht.getContext("2d").drawImage(D,0,0,k,vt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+k+"x"+vt+")."),ht}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),D;return D}function m(D){return D.generateMipmaps}function p(D){s.generateMipmap(D)}function M(D){return D.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?s.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function x(D,b,G,N,Z=!1){if(D!==null){if(s[D]!==void 0)return s[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let k=b;if(b===s.RED&&(G===s.FLOAT&&(k=s.R32F),G===s.HALF_FLOAT&&(k=s.R16F),G===s.UNSIGNED_BYTE&&(k=s.R8)),b===s.RED_INTEGER&&(G===s.UNSIGNED_BYTE&&(k=s.R8UI),G===s.UNSIGNED_SHORT&&(k=s.R16UI),G===s.UNSIGNED_INT&&(k=s.R32UI),G===s.BYTE&&(k=s.R8I),G===s.SHORT&&(k=s.R16I),G===s.INT&&(k=s.R32I)),b===s.RG&&(G===s.FLOAT&&(k=s.RG32F),G===s.HALF_FLOAT&&(k=s.RG16F),G===s.UNSIGNED_BYTE&&(k=s.RG8)),b===s.RG_INTEGER&&(G===s.UNSIGNED_BYTE&&(k=s.RG8UI),G===s.UNSIGNED_SHORT&&(k=s.RG16UI),G===s.UNSIGNED_INT&&(k=s.RG32UI),G===s.BYTE&&(k=s.RG8I),G===s.SHORT&&(k=s.RG16I),G===s.INT&&(k=s.RG32I)),b===s.RGB_INTEGER&&(G===s.UNSIGNED_BYTE&&(k=s.RGB8UI),G===s.UNSIGNED_SHORT&&(k=s.RGB16UI),G===s.UNSIGNED_INT&&(k=s.RGB32UI),G===s.BYTE&&(k=s.RGB8I),G===s.SHORT&&(k=s.RGB16I),G===s.INT&&(k=s.RGB32I)),b===s.RGBA_INTEGER&&(G===s.UNSIGNED_BYTE&&(k=s.RGBA8UI),G===s.UNSIGNED_SHORT&&(k=s.RGBA16UI),G===s.UNSIGNED_INT&&(k=s.RGBA32UI),G===s.BYTE&&(k=s.RGBA8I),G===s.SHORT&&(k=s.RGBA16I),G===s.INT&&(k=s.RGBA32I)),b===s.RGB&&(G===s.UNSIGNED_INT_5_9_9_9_REV&&(k=s.RGB9_E5),G===s.UNSIGNED_INT_10F_11F_11F_REV&&(k=s.R11F_G11F_B10F)),b===s.RGBA){const vt=Z?Gr:oe.getTransfer(N);G===s.FLOAT&&(k=s.RGBA32F),G===s.HALF_FLOAT&&(k=s.RGBA16F),G===s.UNSIGNED_BYTE&&(k=vt===fe?s.SRGB8_ALPHA8:s.RGBA8),G===s.UNSIGNED_SHORT_4_4_4_4&&(k=s.RGBA4),G===s.UNSIGNED_SHORT_5_5_5_1&&(k=s.RGB5_A1)}return(k===s.R16F||k===s.R32F||k===s.RG16F||k===s.RG32F||k===s.RGBA16F||k===s.RGBA32F)&&t.get("EXT_color_buffer_float"),k}function _(D,b){let G;return D?b===null||b===Pi||b===ls?G=s.DEPTH24_STENCIL8:b===An?G=s.DEPTH32F_STENCIL8:b===Hs&&(G=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Pi||b===ls?G=s.DEPTH_COMPONENT24:b===An?G=s.DEPTH_COMPONENT32F:b===Hs&&(G=s.DEPTH_COMPONENT16),G}function y(D,b){return m(D)===!0||D.isFramebufferTexture&&D.minFilter!==nn&&D.minFilter!==en?Math.log2(Math.max(b.width,b.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?b.mipmaps.length:1}function E(D){const b=D.target;b.removeEventListener("dispose",E),A(b),b.isVideoTexture&&h.delete(b)}function T(D){const b=D.target;b.removeEventListener("dispose",T),S(b)}function A(D){const b=n.get(D);if(b.__webglInit===void 0)return;const G=D.source,N=d.get(G);if(N){const Z=N[b.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&w(D),Object.keys(N).length===0&&d.delete(G)}n.remove(D)}function w(D){const b=n.get(D);s.deleteTexture(b.__webglTexture);const G=D.source,N=d.get(G);delete N[b.__cacheKey],o.memory.textures--}function S(D){const b=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let N=0;N<6;N++){if(Array.isArray(b.__webglFramebuffer[N]))for(let Z=0;Z<b.__webglFramebuffer[N].length;Z++)s.deleteFramebuffer(b.__webglFramebuffer[N][Z]);else s.deleteFramebuffer(b.__webglFramebuffer[N]);b.__webglDepthbuffer&&s.deleteRenderbuffer(b.__webglDepthbuffer[N])}else{if(Array.isArray(b.__webglFramebuffer))for(let N=0;N<b.__webglFramebuffer.length;N++)s.deleteFramebuffer(b.__webglFramebuffer[N]);else s.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&s.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&s.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let N=0;N<b.__webglColorRenderbuffer.length;N++)b.__webglColorRenderbuffer[N]&&s.deleteRenderbuffer(b.__webglColorRenderbuffer[N]);b.__webglDepthRenderbuffer&&s.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const G=D.textures;for(let N=0,Z=G.length;N<Z;N++){const k=n.get(G[N]);k.__webglTexture&&(s.deleteTexture(k.__webglTexture),o.memory.textures--),n.remove(G[N])}n.remove(D)}let C=0;function P(){C=0}function U(){const D=C;return D>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+i.maxTextures),C+=1,D}function z(D){const b=[];return b.push(D.wrapS),b.push(D.wrapT),b.push(D.wrapR||0),b.push(D.magFilter),b.push(D.minFilter),b.push(D.anisotropy),b.push(D.internalFormat),b.push(D.format),b.push(D.type),b.push(D.generateMipmaps),b.push(D.premultiplyAlpha),b.push(D.flipY),b.push(D.unpackAlignment),b.push(D.colorSpace),b.join()}function F(D,b){const G=n.get(D);if(D.isVideoTexture&&gt(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&G.__version!==D.version){const N=D.image;if(N===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(N.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(G,D,b);return}}else D.isExternalTexture&&(G.__webglTexture=D.sourceTexture?D.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,G.__webglTexture,s.TEXTURE0+b)}function H(D,b){const G=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&G.__version!==D.version){Y(G,D,b);return}e.bindTexture(s.TEXTURE_2D_ARRAY,G.__webglTexture,s.TEXTURE0+b)}function q(D,b){const G=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&G.__version!==D.version){Y(G,D,b);return}e.bindTexture(s.TEXTURE_3D,G.__webglTexture,s.TEXTURE0+b)}function O(D,b){const G=n.get(D);if(D.version>0&&G.__version!==D.version){K(G,D,b);return}e.bindTexture(s.TEXTURE_CUBE_MAP,G.__webglTexture,s.TEXTURE0+b)}const W={[Ri]:s.REPEAT,[Ti]:s.CLAMP_TO_EDGE,[da]:s.MIRRORED_REPEAT},tt={[nn]:s.NEAREST,[Cu]:s.NEAREST_MIPMAP_NEAREST,[Qs]:s.NEAREST_MIPMAP_LINEAR,[en]:s.LINEAR,[uo]:s.LINEAR_MIPMAP_NEAREST,[Ai]:s.LINEAR_MIPMAP_LINEAR},et={[Lu]:s.NEVER,[Bu]:s.ALWAYS,[Iu]:s.LESS,[Mh]:s.LEQUAL,[Nu]:s.EQUAL,[Ou]:s.GEQUAL,[Uu]:s.GREATER,[Fu]:s.NOTEQUAL};function ct(D,b){if(b.type===An&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===en||b.magFilter===uo||b.magFilter===Qs||b.magFilter===Ai||b.minFilter===en||b.minFilter===uo||b.minFilter===Qs||b.minFilter===Ai)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(D,s.TEXTURE_WRAP_S,W[b.wrapS]),s.texParameteri(D,s.TEXTURE_WRAP_T,W[b.wrapT]),(D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY)&&s.texParameteri(D,s.TEXTURE_WRAP_R,W[b.wrapR]),s.texParameteri(D,s.TEXTURE_MAG_FILTER,tt[b.magFilter]),s.texParameteri(D,s.TEXTURE_MIN_FILTER,tt[b.minFilter]),b.compareFunction&&(s.texParameteri(D,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(D,s.TEXTURE_COMPARE_FUNC,et[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===nn||b.minFilter!==Qs&&b.minFilter!==Ai||b.type===An&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");s.texParameterf(D,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,i.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function _t(D,b){let G=!1;D.__webglInit===void 0&&(D.__webglInit=!0,b.addEventListener("dispose",E));const N=b.source;let Z=d.get(N);Z===void 0&&(Z={},d.set(N,Z));const k=z(b);if(k!==D.__cacheKey){Z[k]===void 0&&(Z[k]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,G=!0),Z[k].usedTimes++;const vt=Z[D.__cacheKey];vt!==void 0&&(Z[D.__cacheKey].usedTimes--,vt.usedTimes===0&&w(b)),D.__cacheKey=k,D.__webglTexture=Z[k].texture}return G}function bt(D,b,G){return Math.floor(Math.floor(D/G)/b)}function yt(D,b,G,N){const k=D.updateRanges;if(k.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,b.width,b.height,G,N,b.data);else{k.sort((pt,Ct)=>pt.start-Ct.start);let vt=0;for(let pt=1;pt<k.length;pt++){const Ct=k[vt],Vt=k[pt],Ot=Ct.start+Ct.count,Et=bt(Vt.start,b.width,4),Yt=bt(Ct.start,b.width,4);Vt.start<=Ot+1&&Et===Yt&&bt(Vt.start+Vt.count-1,b.width,4)===Et?Ct.count=Math.max(Ct.count,Vt.start+Vt.count-Ct.start):(++vt,k[vt]=Vt)}k.length=vt+1;const ht=s.getParameter(s.UNPACK_ROW_LENGTH),Pt=s.getParameter(s.UNPACK_SKIP_PIXELS),It=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,b.width);for(let pt=0,Ct=k.length;pt<Ct;pt++){const Vt=k[pt],Ot=Math.floor(Vt.start/4),Et=Math.ceil(Vt.count/4),Yt=Ot%b.width,B=Math.floor(Ot/b.width),ft=Et,St=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,Yt),s.pixelStorei(s.UNPACK_SKIP_ROWS,B),e.texSubImage2D(s.TEXTURE_2D,0,Yt,B,ft,St,G,N,b.data)}D.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,ht),s.pixelStorei(s.UNPACK_SKIP_PIXELS,Pt),s.pixelStorei(s.UNPACK_SKIP_ROWS,It)}}function Y(D,b,G){let N=s.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(N=s.TEXTURE_2D_ARRAY),b.isData3DTexture&&(N=s.TEXTURE_3D);const Z=_t(D,b),k=b.source;e.bindTexture(N,D.__webglTexture,s.TEXTURE0+G);const vt=n.get(k);if(k.version!==vt.__version||Z===!0){e.activeTexture(s.TEXTURE0+G);const ht=oe.getPrimaries(oe.workingColorSpace),Pt=b.colorSpace===oi?null:oe.getPrimaries(b.colorSpace),It=b.colorSpace===oi||ht===Pt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);let pt=v(b.image,!1,i.maxTextureSize);pt=Ht(b,pt);const Ct=r.convert(b.format,b.colorSpace),Vt=r.convert(b.type);let Ot=x(b.internalFormat,Ct,Vt,b.colorSpace,b.isVideoTexture);ct(N,b);let Et;const Yt=b.mipmaps,B=b.isVideoTexture!==!0,ft=vt.__version===void 0||Z===!0,St=k.dataReady,Lt=y(b,pt);if(b.isDepthTexture)Ot=_(b.format===hs,b.type),ft&&(B?e.texStorage2D(s.TEXTURE_2D,1,Ot,pt.width,pt.height):e.texImage2D(s.TEXTURE_2D,0,Ot,pt.width,pt.height,0,Ct,Vt,null));else if(b.isDataTexture)if(Yt.length>0){B&&ft&&e.texStorage2D(s.TEXTURE_2D,Lt,Ot,Yt[0].width,Yt[0].height);for(let xt=0,at=Yt.length;xt<at;xt++)Et=Yt[xt],B?St&&e.texSubImage2D(s.TEXTURE_2D,xt,0,0,Et.width,Et.height,Ct,Vt,Et.data):e.texImage2D(s.TEXTURE_2D,xt,Ot,Et.width,Et.height,0,Ct,Vt,Et.data);b.generateMipmaps=!1}else B?(ft&&e.texStorage2D(s.TEXTURE_2D,Lt,Ot,pt.width,pt.height),St&&yt(b,pt,Ct,Vt)):e.texImage2D(s.TEXTURE_2D,0,Ot,pt.width,pt.height,0,Ct,Vt,pt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){B&&ft&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Lt,Ot,Yt[0].width,Yt[0].height,pt.depth);for(let xt=0,at=Yt.length;xt<at;xt++)if(Et=Yt[xt],b.format!==fn)if(Ct!==null)if(B){if(St)if(b.layerUpdates.size>0){const Ft=gl(Et.width,Et.height,b.format,b.type);for(const Jt of b.layerUpdates){const ye=Et.data.subarray(Jt*Ft/Et.data.BYTES_PER_ELEMENT,(Jt+1)*Ft/Et.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,xt,0,0,Jt,Et.width,Et.height,1,Ct,ye)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,xt,0,0,0,Et.width,Et.height,pt.depth,Ct,Et.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,xt,Ot,Et.width,Et.height,pt.depth,0,Et.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?St&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,xt,0,0,0,Et.width,Et.height,pt.depth,Ct,Vt,Et.data):e.texImage3D(s.TEXTURE_2D_ARRAY,xt,Ot,Et.width,Et.height,pt.depth,0,Ct,Vt,Et.data)}else{B&&ft&&e.texStorage2D(s.TEXTURE_2D,Lt,Ot,Yt[0].width,Yt[0].height);for(let xt=0,at=Yt.length;xt<at;xt++)Et=Yt[xt],b.format!==fn?Ct!==null?B?St&&e.compressedTexSubImage2D(s.TEXTURE_2D,xt,0,0,Et.width,Et.height,Ct,Et.data):e.compressedTexImage2D(s.TEXTURE_2D,xt,Ot,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?St&&e.texSubImage2D(s.TEXTURE_2D,xt,0,0,Et.width,Et.height,Ct,Vt,Et.data):e.texImage2D(s.TEXTURE_2D,xt,Ot,Et.width,Et.height,0,Ct,Vt,Et.data)}else if(b.isDataArrayTexture)if(B){if(ft&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Lt,Ot,pt.width,pt.height,pt.depth),St)if(b.layerUpdates.size>0){const xt=gl(pt.width,pt.height,b.format,b.type);for(const at of b.layerUpdates){const Ft=pt.data.subarray(at*xt/pt.data.BYTES_PER_ELEMENT,(at+1)*xt/pt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,at,pt.width,pt.height,1,Ct,Vt,Ft)}b.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,pt.width,pt.height,pt.depth,Ct,Vt,pt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Ot,pt.width,pt.height,pt.depth,0,Ct,Vt,pt.data);else if(b.isData3DTexture)B?(ft&&e.texStorage3D(s.TEXTURE_3D,Lt,Ot,pt.width,pt.height,pt.depth),St&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,pt.width,pt.height,pt.depth,Ct,Vt,pt.data)):e.texImage3D(s.TEXTURE_3D,0,Ot,pt.width,pt.height,pt.depth,0,Ct,Vt,pt.data);else if(b.isFramebufferTexture){if(ft)if(B)e.texStorage2D(s.TEXTURE_2D,Lt,Ot,pt.width,pt.height);else{let xt=pt.width,at=pt.height;for(let Ft=0;Ft<Lt;Ft++)e.texImage2D(s.TEXTURE_2D,Ft,Ot,xt,at,0,Ct,Vt,null),xt>>=1,at>>=1}}else if(Yt.length>0){if(B&&ft){const xt=Bt(Yt[0]);e.texStorage2D(s.TEXTURE_2D,Lt,Ot,xt.width,xt.height)}for(let xt=0,at=Yt.length;xt<at;xt++)Et=Yt[xt],B?St&&e.texSubImage2D(s.TEXTURE_2D,xt,0,0,Ct,Vt,Et):e.texImage2D(s.TEXTURE_2D,xt,Ot,Ct,Vt,Et);b.generateMipmaps=!1}else if(B){if(ft){const xt=Bt(pt);e.texStorage2D(s.TEXTURE_2D,Lt,Ot,xt.width,xt.height)}St&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,Ct,Vt,pt)}else e.texImage2D(s.TEXTURE_2D,0,Ot,Ct,Vt,pt);m(b)&&p(N),vt.__version=k.version,b.onUpdate&&b.onUpdate(b)}D.__version=b.version}function K(D,b,G){if(b.image.length!==6)return;const N=_t(D,b),Z=b.source;e.bindTexture(s.TEXTURE_CUBE_MAP,D.__webglTexture,s.TEXTURE0+G);const k=n.get(Z);if(Z.version!==k.__version||N===!0){e.activeTexture(s.TEXTURE0+G);const vt=oe.getPrimaries(oe.workingColorSpace),ht=b.colorSpace===oi?null:oe.getPrimaries(b.colorSpace),Pt=b.colorSpace===oi||vt===ht?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);const It=b.isCompressedTexture||b.image[0].isCompressedTexture,pt=b.image[0]&&b.image[0].isDataTexture,Ct=[];for(let at=0;at<6;at++)!It&&!pt?Ct[at]=v(b.image[at],!0,i.maxCubemapSize):Ct[at]=pt?b.image[at].image:b.image[at],Ct[at]=Ht(b,Ct[at]);const Vt=Ct[0],Ot=r.convert(b.format,b.colorSpace),Et=r.convert(b.type),Yt=x(b.internalFormat,Ot,Et,b.colorSpace),B=b.isVideoTexture!==!0,ft=k.__version===void 0||N===!0,St=Z.dataReady;let Lt=y(b,Vt);ct(s.TEXTURE_CUBE_MAP,b);let xt;if(It){B&&ft&&e.texStorage2D(s.TEXTURE_CUBE_MAP,Lt,Yt,Vt.width,Vt.height);for(let at=0;at<6;at++){xt=Ct[at].mipmaps;for(let Ft=0;Ft<xt.length;Ft++){const Jt=xt[Ft];b.format!==fn?Ot!==null?B?St&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,Ft,0,0,Jt.width,Jt.height,Ot,Jt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,Ft,Yt,Jt.width,Jt.height,0,Jt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?St&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,Ft,0,0,Jt.width,Jt.height,Ot,Et,Jt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,Ft,Yt,Jt.width,Jt.height,0,Ot,Et,Jt.data)}}}else{if(xt=b.mipmaps,B&&ft){xt.length>0&&Lt++;const at=Bt(Ct[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,Lt,Yt,at.width,at.height)}for(let at=0;at<6;at++)if(pt){B?St&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Ct[at].width,Ct[at].height,Ot,Et,Ct[at].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Yt,Ct[at].width,Ct[at].height,0,Ot,Et,Ct[at].data);for(let Ft=0;Ft<xt.length;Ft++){const ye=xt[Ft].image[at].image;B?St&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,Ft+1,0,0,ye.width,ye.height,Ot,Et,ye.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,Ft+1,Yt,ye.width,ye.height,0,Ot,Et,ye.data)}}else{B?St&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Ot,Et,Ct[at]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Yt,Ot,Et,Ct[at]);for(let Ft=0;Ft<xt.length;Ft++){const Jt=xt[Ft];B?St&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,Ft+1,0,0,Ot,Et,Jt.image[at]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+at,Ft+1,Yt,Ot,Et,Jt.image[at])}}}m(b)&&p(s.TEXTURE_CUBE_MAP),k.__version=Z.version,b.onUpdate&&b.onUpdate(b)}D.__version=b.version}function ut(D,b,G,N,Z,k){const vt=r.convert(G.format,G.colorSpace),ht=r.convert(G.type),Pt=x(G.internalFormat,vt,ht,G.colorSpace),It=n.get(b),pt=n.get(G);if(pt.__renderTarget=b,!It.__hasExternalTextures){const Ct=Math.max(1,b.width>>k),Vt=Math.max(1,b.height>>k);Z===s.TEXTURE_3D||Z===s.TEXTURE_2D_ARRAY?e.texImage3D(Z,k,Pt,Ct,Vt,b.depth,0,vt,ht,null):e.texImage2D(Z,k,Pt,Ct,Vt,0,vt,ht,null)}e.bindFramebuffer(s.FRAMEBUFFER,D),lt(b)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,N,Z,pt.__webglTexture,0,dt(b)):(Z===s.TEXTURE_2D||Z>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,N,Z,pt.__webglTexture,k),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Q(D,b,G){if(s.bindRenderbuffer(s.RENDERBUFFER,D),b.depthBuffer){const N=b.depthTexture,Z=N&&N.isDepthTexture?N.type:null,k=_(b.stencilBuffer,Z),vt=b.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ht=dt(b);lt(b)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ht,k,b.width,b.height):G?s.renderbufferStorageMultisample(s.RENDERBUFFER,ht,k,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,k,b.width,b.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,vt,s.RENDERBUFFER,D)}else{const N=b.textures;for(let Z=0;Z<N.length;Z++){const k=N[Z],vt=r.convert(k.format,k.colorSpace),ht=r.convert(k.type),Pt=x(k.internalFormat,vt,ht,k.colorSpace),It=dt(b);G&&lt(b)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,It,Pt,b.width,b.height):lt(b)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,It,Pt,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,Pt,b.width,b.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ot(D,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,D),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const N=n.get(b.depthTexture);N.__renderTarget=b,(!N.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),F(b.depthTexture,0);const Z=N.__webglTexture,k=dt(b);if(b.depthTexture.format===ks)lt(b)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Z,0,k):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Z,0);else if(b.depthTexture.format===hs)lt(b)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Z,0,k):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function At(D){const b=n.get(D),G=D.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==D.depthTexture){const N=D.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),N){const Z=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,N.removeEventListener("dispose",Z)};N.addEventListener("dispose",Z),b.__depthDisposeCallback=Z}b.__boundDepthTexture=N}if(D.depthTexture&&!b.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");const N=D.texture.mipmaps;N&&N.length>0?ot(b.__webglFramebuffer[0],D):ot(b.__webglFramebuffer,D)}else if(G){b.__webglDepthbuffer=[];for(let N=0;N<6;N++)if(e.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer[N]),b.__webglDepthbuffer[N]===void 0)b.__webglDepthbuffer[N]=s.createRenderbuffer(),Q(b.__webglDepthbuffer[N],D,!1);else{const Z=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,k=b.__webglDepthbuffer[N];s.bindRenderbuffer(s.RENDERBUFFER,k),s.framebufferRenderbuffer(s.FRAMEBUFFER,Z,s.RENDERBUFFER,k)}}else{const N=D.texture.mipmaps;if(N&&N.length>0?e.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=s.createRenderbuffer(),Q(b.__webglDepthbuffer,D,!1);else{const Z=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,k=b.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,k),s.framebufferRenderbuffer(s.FRAMEBUFFER,Z,s.RENDERBUFFER,k)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function qt(D,b,G){const N=n.get(D);b!==void 0&&ut(N.__webglFramebuffer,D,D.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),G!==void 0&&At(D)}function L(D){const b=D.texture,G=n.get(D),N=n.get(b);D.addEventListener("dispose",T);const Z=D.textures,k=D.isWebGLCubeRenderTarget===!0,vt=Z.length>1;if(vt||(N.__webglTexture===void 0&&(N.__webglTexture=s.createTexture()),N.__version=b.version,o.memory.textures++),k){G.__webglFramebuffer=[];for(let ht=0;ht<6;ht++)if(b.mipmaps&&b.mipmaps.length>0){G.__webglFramebuffer[ht]=[];for(let Pt=0;Pt<b.mipmaps.length;Pt++)G.__webglFramebuffer[ht][Pt]=s.createFramebuffer()}else G.__webglFramebuffer[ht]=s.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){G.__webglFramebuffer=[];for(let ht=0;ht<b.mipmaps.length;ht++)G.__webglFramebuffer[ht]=s.createFramebuffer()}else G.__webglFramebuffer=s.createFramebuffer();if(vt)for(let ht=0,Pt=Z.length;ht<Pt;ht++){const It=n.get(Z[ht]);It.__webglTexture===void 0&&(It.__webglTexture=s.createTexture(),o.memory.textures++)}if(D.samples>0&&lt(D)===!1){G.__webglMultisampledFramebuffer=s.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ht=0;ht<Z.length;ht++){const Pt=Z[ht];G.__webglColorRenderbuffer[ht]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,G.__webglColorRenderbuffer[ht]);const It=r.convert(Pt.format,Pt.colorSpace),pt=r.convert(Pt.type),Ct=x(Pt.internalFormat,It,pt,Pt.colorSpace,D.isXRRenderTarget===!0),Vt=dt(D);s.renderbufferStorageMultisample(s.RENDERBUFFER,Vt,Ct,D.width,D.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ht,s.RENDERBUFFER,G.__webglColorRenderbuffer[ht])}s.bindRenderbuffer(s.RENDERBUFFER,null),D.depthBuffer&&(G.__webglDepthRenderbuffer=s.createRenderbuffer(),Q(G.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(k){e.bindTexture(s.TEXTURE_CUBE_MAP,N.__webglTexture),ct(s.TEXTURE_CUBE_MAP,b);for(let ht=0;ht<6;ht++)if(b.mipmaps&&b.mipmaps.length>0)for(let Pt=0;Pt<b.mipmaps.length;Pt++)ut(G.__webglFramebuffer[ht][Pt],D,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Pt);else ut(G.__webglFramebuffer[ht],D,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0);m(b)&&p(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(vt){for(let ht=0,Pt=Z.length;ht<Pt;ht++){const It=Z[ht],pt=n.get(It);let Ct=s.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Ct=D.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Ct,pt.__webglTexture),ct(Ct,It),ut(G.__webglFramebuffer,D,It,s.COLOR_ATTACHMENT0+ht,Ct,0),m(It)&&p(Ct)}e.unbindTexture()}else{let ht=s.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(ht=D.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ht,N.__webglTexture),ct(ht,b),b.mipmaps&&b.mipmaps.length>0)for(let Pt=0;Pt<b.mipmaps.length;Pt++)ut(G.__webglFramebuffer[Pt],D,b,s.COLOR_ATTACHMENT0,ht,Pt);else ut(G.__webglFramebuffer,D,b,s.COLOR_ATTACHMENT0,ht,0);m(b)&&p(ht),e.unbindTexture()}D.depthBuffer&&At(D)}function rt(D){const b=D.textures;for(let G=0,N=b.length;G<N;G++){const Z=b[G];if(m(Z)){const k=M(D),vt=n.get(Z).__webglTexture;e.bindTexture(k,vt),p(k),e.unbindTexture()}}}const st=[],nt=[];function it(D){if(D.samples>0){if(lt(D)===!1){const b=D.textures,G=D.width,N=D.height;let Z=s.COLOR_BUFFER_BIT;const k=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,vt=n.get(D),ht=b.length>1;if(ht)for(let It=0;It<b.length;It++)e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+It,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+It,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,vt.__webglMultisampledFramebuffer);const Pt=D.texture.mipmaps;Pt&&Pt.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,vt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,vt.__webglFramebuffer);for(let It=0;It<b.length;It++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(Z|=s.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(Z|=s.STENCIL_BUFFER_BIT)),ht){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,vt.__webglColorRenderbuffer[It]);const pt=n.get(b[It]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,pt,0)}s.blitFramebuffer(0,0,G,N,0,0,G,N,Z,s.NEAREST),l===!0&&(st.length=0,nt.length=0,st.push(s.COLOR_ATTACHMENT0+It),D.depthBuffer&&D.resolveDepthBuffer===!1&&(st.push(k),nt.push(k),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,nt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,st))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ht)for(let It=0;It<b.length;It++){e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+It,s.RENDERBUFFER,vt.__webglColorRenderbuffer[It]);const pt=n.get(b[It]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+It,s.TEXTURE_2D,pt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,vt.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&l){const b=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[b])}}}function dt(D){return Math.min(i.maxSamples,D.samples)}function lt(D){const b=n.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function gt(D){const b=o.render.frame;h.get(D)!==b&&(h.set(D,b),D.update())}function Ht(D,b){const G=D.colorSpace,N=D.format,Z=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||G!==us&&G!==oi&&(oe.getTransfer(G)===fe?(N!==fn||Z!==Nn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),b}function Bt(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=P,this.setTexture2D=F,this.setTexture2DArray=H,this.setTexture3D=q,this.setTextureCube=O,this.rebindTextures=qt,this.setupRenderTarget=L,this.updateRenderTargetMipmap=rt,this.updateMultisampleRenderTarget=it,this.setupDepthRenderbuffer=At,this.setupFrameBufferTexture=ut,this.useMultisampledRTT=lt}function Kg(s,t){function e(n,i=oi){let r;const o=oe.getTransfer(i);if(n===Nn)return s.UNSIGNED_BYTE;if(n===Qa)return s.UNSIGNED_SHORT_4_4_4_4;if(n===tc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===mh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===gh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===fh)return s.BYTE;if(n===ph)return s.SHORT;if(n===Hs)return s.UNSIGNED_SHORT;if(n===ja)return s.INT;if(n===Pi)return s.UNSIGNED_INT;if(n===An)return s.FLOAT;if(n===ui)return s.HALF_FLOAT;if(n===vh)return s.ALPHA;if(n===_h)return s.RGB;if(n===fn)return s.RGBA;if(n===ks)return s.DEPTH_COMPONENT;if(n===hs)return s.DEPTH_STENCIL;if(n===eo)return s.RED;if(n===ec)return s.RED_INTEGER;if(n===xh)return s.RG;if(n===nc)return s.RG_INTEGER;if(n===ic)return s.RGBA_INTEGER;if(n===Ur||n===Fr||n===Or||n===Br)if(o===fe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ur)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ur)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Fr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Or)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Br)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===fa||n===pa||n===ma||n===ga)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===fa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===pa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ma)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ga)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===va||n===_a||n===xa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===va||n===_a)return o===fe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===xa)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ma||n===ya||n===Sa||n===wa||n===Ea||n===ba||n===Ta||n===Aa||n===Ca||n===Ra||n===Pa||n===Da||n===La||n===Ia)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ma)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ya)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Sa)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===wa)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ea)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ba)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ta)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Aa)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ca)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ra)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Pa)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Da)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===La)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ia)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Na||n===Ua||n===Fa)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Na)return o===fe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ua)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Fa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Oa||n===Ba||n===za||n===Ha)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Oa)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ba)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===za)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ha)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ls?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}const Jg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,jg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Qg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Dh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new qe({vertexShader:Jg,fragmentShader:jg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new J(new Ci(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class tv extends gs{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new Qg,p={},M=e.getContextAttributes();let x=null,_=null;const y=[],E=[],T=new mt;let A=null;const w=new vn;w.viewport=new Ee;const S=new vn;S.viewport=new Ee;const C=[w,S],P=new xf;let U=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let K=y[Y];return K===void 0&&(K=new Io,y[Y]=K),K.getTargetRaySpace()},this.getControllerGrip=function(Y){let K=y[Y];return K===void 0&&(K=new Io,y[Y]=K),K.getGripSpace()},this.getHand=function(Y){let K=y[Y];return K===void 0&&(K=new Io,y[Y]=K),K.getHandSpace()};function F(Y){const K=E.indexOf(Y.inputSource);if(K===-1)return;const ut=y[K];ut!==void 0&&(ut.update(Y.inputSource,Y.frame,c||o),ut.dispatchEvent({type:Y.type,data:Y.inputSource}))}function H(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",H),i.removeEventListener("inputsourceschange",q);for(let Y=0;Y<y.length;Y++){const K=E[Y];K!==null&&(E[Y]=null,y[Y].disconnect(K))}U=null,z=null,m.reset();for(const Y in p)delete p[Y];t.setRenderTarget(x),f=null,d=null,u=null,i=null,_=null,yt.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(i,e)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(x=t.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",H),i.addEventListener("inputsourceschange",q),M.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(T),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let ut=null,Q=null,ot=null;M.depth&&(ot=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ut=M.stencil?hs:ks,Q=M.stencil?ls:Pi);const At={colorFormat:e.RGBA8,depthFormat:ot,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(At),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new yn(d.textureWidth,d.textureHeight,{format:fn,type:Nn,depthTexture:new hc(d.textureWidth,d.textureHeight,Q,void 0,void 0,void 0,void 0,void 0,void 0,ut),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ut={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,ut),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new yn(f.framebufferWidth,f.framebufferHeight,{format:fn,type:Nn,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),yt.setContext(i),yt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function q(Y){for(let K=0;K<Y.removed.length;K++){const ut=Y.removed[K],Q=E.indexOf(ut);Q>=0&&(E[Q]=null,y[Q].disconnect(ut))}for(let K=0;K<Y.added.length;K++){const ut=Y.added[K];let Q=E.indexOf(ut);if(Q===-1){for(let At=0;At<y.length;At++)if(At>=E.length){E.push(ut),Q=At;break}else if(E[At]===null){E[At]=ut,Q=At;break}if(Q===-1)break}const ot=y[Q];ot&&ot.connect(ut)}}const O=new I,W=new I;function tt(Y,K,ut){O.setFromMatrixPosition(K.matrixWorld),W.setFromMatrixPosition(ut.matrixWorld);const Q=O.distanceTo(W),ot=K.projectionMatrix.elements,At=ut.projectionMatrix.elements,qt=ot[14]/(ot[10]-1),L=ot[14]/(ot[10]+1),rt=(ot[9]+1)/ot[5],st=(ot[9]-1)/ot[5],nt=(ot[8]-1)/ot[0],it=(At[8]+1)/At[0],dt=qt*nt,lt=qt*it,gt=Q/(-nt+it),Ht=gt*-nt;if(K.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Ht),Y.translateZ(gt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),ot[10]===-1)Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const Bt=qt+gt,D=L+gt,b=dt-Ht,G=lt+(Q-Ht),N=rt*L/D*Bt,Z=st*L/D*Bt;Y.projectionMatrix.makePerspective(b,G,N,Z,Bt,D),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function et(Y,K){K===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(K.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let K=Y.near,ut=Y.far;m.texture!==null&&(m.depthNear>0&&(K=m.depthNear),m.depthFar>0&&(ut=m.depthFar)),P.near=S.near=w.near=K,P.far=S.far=w.far=ut,(U!==P.near||z!==P.far)&&(i.updateRenderState({depthNear:P.near,depthFar:P.far}),U=P.near,z=P.far),P.layers.mask=Y.layers.mask|6,w.layers.mask=P.layers.mask&3,S.layers.mask=P.layers.mask&5;const Q=Y.parent,ot=P.cameras;et(P,Q);for(let At=0;At<ot.length;At++)et(ot[At],Q);ot.length===2?tt(P,w,S):P.projectionMatrix.copy(w.projectionMatrix),ct(Y,P,Q)};function ct(Y,K,ut){ut===null?Y.matrix.copy(K.matrixWorld):(Y.matrix.copy(ut.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(K.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Gs*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(P)},this.getCameraTexture=function(Y){return p[Y]};let _t=null;function bt(Y,K){if(h=K.getViewerPose(c||o),g=K,h!==null){const ut=h.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let Q=!1;ut.length!==P.cameras.length&&(P.cameras.length=0,Q=!0);for(let L=0;L<ut.length;L++){const rt=ut[L];let st=null;if(f!==null)st=f.getViewport(rt);else{const it=u.getViewSubImage(d,rt);st=it.viewport,L===0&&(t.setRenderTargetTextures(_,it.colorTexture,it.depthStencilTexture),t.setRenderTarget(_))}let nt=C[L];nt===void 0&&(nt=new vn,nt.layers.enable(L),nt.viewport=new Ee,C[L]=nt),nt.matrix.fromArray(rt.transform.matrix),nt.matrix.decompose(nt.position,nt.quaternion,nt.scale),nt.projectionMatrix.fromArray(rt.projectionMatrix),nt.projectionMatrixInverse.copy(nt.projectionMatrix).invert(),nt.viewport.set(st.x,st.y,st.width,st.height),L===0&&(P.matrix.copy(nt.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),Q===!0&&P.cameras.push(nt)}const ot=i.enabledFeatures;if(ot&&ot.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const L=u.getDepthInformation(ut[0]);L&&L.isValid&&L.texture&&m.init(L,i.renderState)}if(ot&&ot.includes("camera-access")&&v){t.state.unbindTexture(),u=n.getBinding();for(let L=0;L<ut.length;L++){const rt=ut[L].camera;if(rt){let st=p[rt];st||(st=new Dh,p[rt]=st);const nt=u.getCameraImage(rt);st.sourceTexture=nt}}}}for(let ut=0;ut<y.length;ut++){const Q=E[ut],ot=y[ut];Q!==null&&ot!==void 0&&ot.update(Q,K,c||o)}_t&&_t(Y,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),g=null}const yt=new Gh;yt.setAnimationLoop(bt),this.setAnimationLoop=function(Y){_t=Y},this.dispose=function(){}}}const Mi=new Un,ev=new he;function nv(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Th(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,M,x,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,M,x):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===on&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===on&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const M=t.get(p),x=M.envMap,_=M.envMapRotation;x&&(m.envMap.value=x,Mi.copy(_),Mi.x*=-1,Mi.y*=-1,Mi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Mi.y*=-1,Mi.z*=-1),m.envMapRotation.value.setFromMatrix4(ev.makeRotationFromEuler(Mi)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===on&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const M=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function iv(s,t,e,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,x){const _=x.program;n.uniformBlockBinding(M,_)}function c(M,x){let _=i[M.id];_===void 0&&(g(M),_=h(M),i[M.id]=_,M.addEventListener("dispose",m));const y=x.program;n.updateUBOMapping(M,y);const E=t.render.frame;r[M.id]!==E&&(d(M),r[M.id]=E)}function h(M){const x=u();M.__bindingPointIndex=x;const _=s.createBuffer(),y=M.__size,E=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,_),s.bufferData(s.UNIFORM_BUFFER,y,E),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,x,_),_}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const x=i[M.id],_=M.uniforms,y=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,x);for(let E=0,T=_.length;E<T;E++){const A=Array.isArray(_[E])?_[E]:[_[E]];for(let w=0,S=A.length;w<S;w++){const C=A[w];if(f(C,E,w,y)===!0){const P=C.__offset,U=Array.isArray(C.value)?C.value:[C.value];let z=0;for(let F=0;F<U.length;F++){const H=U[F],q=v(H);typeof H=="number"||typeof H=="boolean"?(C.__data[0]=H,s.bufferSubData(s.UNIFORM_BUFFER,P+z,C.__data)):H.isMatrix3?(C.__data[0]=H.elements[0],C.__data[1]=H.elements[1],C.__data[2]=H.elements[2],C.__data[3]=0,C.__data[4]=H.elements[3],C.__data[5]=H.elements[4],C.__data[6]=H.elements[5],C.__data[7]=0,C.__data[8]=H.elements[6],C.__data[9]=H.elements[7],C.__data[10]=H.elements[8],C.__data[11]=0):(H.toArray(C.__data,z),z+=q.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,P,C.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,x,_,y){const E=M.value,T=x+"_"+_;if(y[T]===void 0)return typeof E=="number"||typeof E=="boolean"?y[T]=E:y[T]=E.clone(),!0;{const A=y[T];if(typeof E=="number"||typeof E=="boolean"){if(A!==E)return y[T]=E,!0}else if(A.equals(E)===!1)return A.copy(E),!0}return!1}function g(M){const x=M.uniforms;let _=0;const y=16;for(let T=0,A=x.length;T<A;T++){const w=Array.isArray(x[T])?x[T]:[x[T]];for(let S=0,C=w.length;S<C;S++){const P=w[S],U=Array.isArray(P.value)?P.value:[P.value];for(let z=0,F=U.length;z<F;z++){const H=U[z],q=v(H),O=_%y,W=O%q.boundary,tt=O+W;_+=W,tt!==0&&y-tt<q.storage&&(_+=y-tt),P.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=_,_+=q.storage}}}const E=_%y;return E>0&&(_+=y-E),M.__size=_,M.__cache={},this}function v(M){const x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function m(M){const x=M.target;x.removeEventListener("dispose",m);const _=o.indexOf(x.__bindingPointIndex);o.splice(_,1),s.deleteBuffer(i[x.id]),delete i[x.id],delete r[x.id]}function p(){for(const M in i)s.deleteBuffer(i[M]);o=[],i={},r={}}return{bind:l,update:c,dispose:p}}class sv{constructor(t={}){const{canvas:e=ed(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const M=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=li,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let y=!1;this._outputColorSpace=Qe;let E=0,T=0,A=null,w=-1,S=null;const C=new Ee,P=new Ee;let U=null;const z=new Xt(0);let F=0,H=e.width,q=e.height,O=1,W=null,tt=null;const et=new Ee(0,0,H,q),ct=new Ee(0,0,H,q);let _t=!1;const bt=new lc;let yt=!1,Y=!1;const K=new he,ut=new I,Q=new Ee,ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let At=!1;function qt(){return A===null?O:1}let L=n;function rt(R,V){return e.getContext(R,V)}try{const R={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ka}`),e.addEventListener("webglcontextlost",St,!1),e.addEventListener("webglcontextrestored",Lt,!1),e.addEventListener("webglcontextcreationerror",xt,!1),L===null){const V="webgl2";if(L=rt(V,R),L===null)throw rt(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let st,nt,it,dt,lt,gt,Ht,Bt,D,b,G,N,Z,k,vt,ht,Pt,It,pt,Ct,Vt,Ot,Et,Yt;function B(){st=new p0(L),st.init(),Ot=new Kg(L,st),nt=new a0(L,st,t,Ot),it=new Zg(L,st),nt.reversedDepthBuffer&&d&&it.buffers.depth.setReversed(!0),dt=new v0(L),lt=new Ug,gt=new $g(L,st,it,lt,nt,Ot,dt),Ht=new l0(_),Bt=new f0(_),D=new wf(L),Et=new r0(L,D),b=new m0(L,D,dt,Et),G=new x0(L,b,D,dt),pt=new _0(L,nt,gt),ht=new c0(lt),N=new Ng(_,Ht,Bt,st,nt,Et,ht),Z=new nv(_,lt),k=new Og,vt=new Vg(st),It=new s0(_,Ht,Bt,it,G,f,l),Pt=new qg(_,G,nt),Yt=new iv(L,dt,nt,it),Ct=new o0(L,st,dt),Vt=new g0(L,st,dt),dt.programs=N.programs,_.capabilities=nt,_.extensions=st,_.properties=lt,_.renderLists=k,_.shadowMap=Pt,_.state=it,_.info=dt}B();const ft=new tv(_,L);this.xr=ft,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const R=st.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=st.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(R){R!==void 0&&(O=R,this.setSize(H,q,!1))},this.getSize=function(R){return R.set(H,q)},this.setSize=function(R,V,$=!0){if(ft.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=R,q=V,e.width=Math.floor(R*O),e.height=Math.floor(V*O),$===!0&&(e.style.width=R+"px",e.style.height=V+"px"),this.setViewport(0,0,R,V)},this.getDrawingBufferSize=function(R){return R.set(H*O,q*O).floor()},this.setDrawingBufferSize=function(R,V,$){H=R,q=V,O=$,e.width=Math.floor(R*$),e.height=Math.floor(V*$),this.setViewport(0,0,R,V)},this.getCurrentViewport=function(R){return R.copy(C)},this.getViewport=function(R){return R.copy(et)},this.setViewport=function(R,V,$,j){R.isVector4?et.set(R.x,R.y,R.z,R.w):et.set(R,V,$,j),it.viewport(C.copy(et).multiplyScalar(O).round())},this.getScissor=function(R){return R.copy(ct)},this.setScissor=function(R,V,$,j){R.isVector4?ct.set(R.x,R.y,R.z,R.w):ct.set(R,V,$,j),it.scissor(P.copy(ct).multiplyScalar(O).round())},this.getScissorTest=function(){return _t},this.setScissorTest=function(R){it.setScissorTest(_t=R)},this.setOpaqueSort=function(R){W=R},this.setTransparentSort=function(R){tt=R},this.getClearColor=function(R){return R.copy(It.getClearColor())},this.setClearColor=function(){It.setClearColor(...arguments)},this.getClearAlpha=function(){return It.getClearAlpha()},this.setClearAlpha=function(){It.setClearAlpha(...arguments)},this.clear=function(R=!0,V=!0,$=!0){let j=0;if(R){let X=!1;if(A!==null){const Mt=A.texture.format;X=Mt===ic||Mt===nc||Mt===ec}if(X){const Mt=A.texture.type,Rt=Mt===Nn||Mt===Pi||Mt===Hs||Mt===ls||Mt===Qa||Mt===tc,Nt=It.getClearColor(),Dt=It.getClearAlpha(),Wt=Nt.r,Zt=Nt.g,kt=Nt.b;Rt?(g[0]=Wt,g[1]=Zt,g[2]=kt,g[3]=Dt,L.clearBufferuiv(L.COLOR,0,g)):(v[0]=Wt,v[1]=Zt,v[2]=kt,v[3]=Dt,L.clearBufferiv(L.COLOR,0,v))}else j|=L.COLOR_BUFFER_BIT}V&&(j|=L.DEPTH_BUFFER_BIT),$&&(j|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",St,!1),e.removeEventListener("webglcontextrestored",Lt,!1),e.removeEventListener("webglcontextcreationerror",xt,!1),It.dispose(),k.dispose(),vt.dispose(),lt.dispose(),Ht.dispose(),Bt.dispose(),G.dispose(),Et.dispose(),Yt.dispose(),N.dispose(),ft.dispose(),ft.removeEventListener("sessionstart",Cn),ft.removeEventListener("sessionend",wc),di.stop()};function St(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function Lt(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const R=dt.autoReset,V=Pt.enabled,$=Pt.autoUpdate,j=Pt.needsUpdate,X=Pt.type;B(),dt.autoReset=R,Pt.enabled=V,Pt.autoUpdate=$,Pt.needsUpdate=j,Pt.type=X}function xt(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function at(R){const V=R.target;V.removeEventListener("dispose",at),Ft(V)}function Ft(R){Jt(R),lt.remove(R)}function Jt(R){const V=lt.get(R).programs;V!==void 0&&(V.forEach(function($){N.releaseProgram($)}),R.isShaderMaterial&&N.releaseShaderCache(R))}this.renderBufferDirect=function(R,V,$,j,X,Mt){V===null&&(V=ot);const Rt=X.isMesh&&X.matrixWorld.determinant()<0,Nt=Qh(R,V,$,j,X);it.setMaterial(j,Rt);let Dt=$.index,Wt=1;if(j.wireframe===!0){if(Dt=b.getWireframeAttribute($),Dt===void 0)return;Wt=2}const Zt=$.drawRange,kt=$.attributes.position;let ie=Zt.start*Wt,pe=(Zt.start+Zt.count)*Wt;Mt!==null&&(ie=Math.max(ie,Mt.start*Wt),pe=Math.min(pe,(Mt.start+Mt.count)*Wt)),Dt!==null?(ie=Math.max(ie,0),pe=Math.min(pe,Dt.count)):kt!=null&&(ie=Math.max(ie,0),pe=Math.min(pe,kt.count));const Re=pe-ie;if(Re<0||Re===1/0)return;Et.setup(X,j,Nt,$,Dt);let Se,ve=Ct;if(Dt!==null&&(Se=D.get(Dt),ve=Vt,ve.setIndex(Se)),X.isMesh)j.wireframe===!0?(it.setLineWidth(j.wireframeLinewidth*qt()),ve.setMode(L.LINES)):ve.setMode(L.TRIANGLES);else if(X.isLine){let Gt=j.linewidth;Gt===void 0&&(Gt=1),it.setLineWidth(Gt*qt()),X.isLineSegments?ve.setMode(L.LINES):X.isLineLoop?ve.setMode(L.LINE_LOOP):ve.setMode(L.LINE_STRIP)}else X.isPoints?ve.setMode(L.POINTS):X.isSprite&&ve.setMode(L.TRIANGLES);if(X.isBatchedMesh)if(X._multiDrawInstances!==null)Vs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ve.renderMultiDrawInstances(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount,X._multiDrawInstances);else if(st.get("WEBGL_multi_draw"))ve.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Gt=X._multiDrawStarts,be=X._multiDrawCounts,ce=X._multiDrawCount,an=Dt?D.get(Dt).bytesPerElement:1,Ui=lt.get(j).currentProgram.getUniforms();for(let cn=0;cn<ce;cn++)Ui.setValue(L,"_gl_DrawID",cn),ve.render(Gt[cn]/an,be[cn])}else if(X.isInstancedMesh)ve.renderInstances(ie,Re,X.count);else if($.isInstancedBufferGeometry){const Gt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,be=Math.min($.instanceCount,Gt);ve.renderInstances(ie,Re,be)}else ve.render(ie,Re)};function ye(R,V,$){R.transparent===!0&&R.side===xe&&R.forceSinglePass===!1?(R.side=on,R.needsUpdate=!0,Ks(R,V,$),R.side=Kn,R.needsUpdate=!0,Ks(R,V,$),R.side=xe):Ks(R,V,$)}this.compile=function(R,V,$=null){$===null&&($=R),p=vt.get($),p.init(V),x.push(p),$.traverseVisible(function(X){X.isLight&&X.layers.test(V.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),R!==$&&R.traverseVisible(function(X){X.isLight&&X.layers.test(V.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),p.setupLights();const j=new Set;return R.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const Mt=X.material;if(Mt)if(Array.isArray(Mt))for(let Rt=0;Rt<Mt.length;Rt++){const Nt=Mt[Rt];ye(Nt,$,X),j.add(Nt)}else ye(Mt,$,X),j.add(Mt)}),p=x.pop(),j},this.compileAsync=function(R,V,$=null){const j=this.compile(R,V,$);return new Promise(X=>{function Mt(){if(j.forEach(function(Rt){lt.get(Rt).currentProgram.isReady()&&j.delete(Rt)}),j.size===0){X(R);return}setTimeout(Mt,10)}st.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let ue=null;function On(R){ue&&ue(R)}function Cn(){di.stop()}function wc(){di.start()}const di=new Gh;di.setAnimationLoop(On),typeof self<"u"&&di.setContext(self),this.setAnimationLoop=function(R){ue=R,ft.setAnimationLoop(R),R===null?di.stop():di.start()},ft.addEventListener("sessionstart",Cn),ft.addEventListener("sessionend",wc),this.render=function(R,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),ft.enabled===!0&&ft.isPresenting===!0&&(ft.cameraAutoUpdate===!0&&ft.updateCamera(V),V=ft.getCamera()),R.isScene===!0&&R.onBeforeRender(_,R,V,A),p=vt.get(R,x.length),p.init(V),x.push(p),K.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),bt.setFromProjectionMatrix(K,Dn,V.reversedDepth),Y=this.localClippingEnabled,yt=ht.init(this.clippingPlanes,Y),m=k.get(R,M.length),m.init(),M.push(m),ft.enabled===!0&&ft.isPresenting===!0){const Mt=_.xr.getDepthSensingMesh();Mt!==null&&ao(Mt,V,-1/0,_.sortObjects)}ao(R,V,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(W,tt),At=ft.enabled===!1||ft.isPresenting===!1||ft.hasDepthSensing()===!1,At&&It.addToRenderList(m,R),this.info.render.frame++,yt===!0&&ht.beginShadows();const $=p.state.shadowsArray;Pt.render($,R,V),yt===!0&&ht.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=m.opaque,X=m.transmissive;if(p.setupLights(),V.isArrayCamera){const Mt=V.cameras;if(X.length>0)for(let Rt=0,Nt=Mt.length;Rt<Nt;Rt++){const Dt=Mt[Rt];bc(j,X,R,Dt)}At&&It.render(R);for(let Rt=0,Nt=Mt.length;Rt<Nt;Rt++){const Dt=Mt[Rt];Ec(m,R,Dt,Dt.viewport)}}else X.length>0&&bc(j,X,R,V),At&&It.render(R),Ec(m,R,V);A!==null&&T===0&&(gt.updateMultisampleRenderTarget(A),gt.updateRenderTargetMipmap(A)),R.isScene===!0&&R.onAfterRender(_,R,V),Et.resetDefaultState(),w=-1,S=null,x.pop(),x.length>0?(p=x[x.length-1],yt===!0&&ht.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function ao(R,V,$,j){if(R.visible===!1)return;if(R.layers.test(V.layers)){if(R.isGroup)$=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(V);else if(R.isLight)p.pushLight(R),R.castShadow&&p.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||bt.intersectsSprite(R)){j&&Q.setFromMatrixPosition(R.matrixWorld).applyMatrix4(K);const Rt=G.update(R),Nt=R.material;Nt.visible&&m.push(R,Rt,Nt,$,Q.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||bt.intersectsObject(R))){const Rt=G.update(R),Nt=R.material;if(j&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Q.copy(R.boundingSphere.center)):(Rt.boundingSphere===null&&Rt.computeBoundingSphere(),Q.copy(Rt.boundingSphere.center)),Q.applyMatrix4(R.matrixWorld).applyMatrix4(K)),Array.isArray(Nt)){const Dt=Rt.groups;for(let Wt=0,Zt=Dt.length;Wt<Zt;Wt++){const kt=Dt[Wt],ie=Nt[kt.materialIndex];ie&&ie.visible&&m.push(R,Rt,ie,$,Q.z,kt)}}else Nt.visible&&m.push(R,Rt,Nt,$,Q.z,null)}}const Mt=R.children;for(let Rt=0,Nt=Mt.length;Rt<Nt;Rt++)ao(Mt[Rt],V,$,j)}function Ec(R,V,$,j){const X=R.opaque,Mt=R.transmissive,Rt=R.transparent;p.setupLightsView($),yt===!0&&ht.setGlobalState(_.clippingPlanes,$),j&&it.viewport(C.copy(j)),X.length>0&&$s(X,V,$),Mt.length>0&&$s(Mt,V,$),Rt.length>0&&$s(Rt,V,$),it.buffers.depth.setTest(!0),it.buffers.depth.setMask(!0),it.buffers.color.setMask(!0),it.setPolygonOffset(!1)}function bc(R,V,$,j){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[j.id]===void 0&&(p.state.transmissionRenderTarget[j.id]=new yn(1,1,{generateMipmaps:!0,type:st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float")?ui:Nn,minFilter:Ai,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:oe.workingColorSpace}));const Mt=p.state.transmissionRenderTarget[j.id],Rt=j.viewport||C;Mt.setSize(Rt.z*_.transmissionResolutionScale,Rt.w*_.transmissionResolutionScale);const Nt=_.getRenderTarget(),Dt=_.getActiveCubeFace(),Wt=_.getActiveMipmapLevel();_.setRenderTarget(Mt),_.getClearColor(z),F=_.getClearAlpha(),F<1&&_.setClearColor(16777215,.5),_.clear(),At&&It.render($);const Zt=_.toneMapping;_.toneMapping=li;const kt=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),p.setupLightsView(j),yt===!0&&ht.setGlobalState(_.clippingPlanes,j),$s(R,$,j),gt.updateMultisampleRenderTarget(Mt),gt.updateRenderTargetMipmap(Mt),st.has("WEBGL_multisampled_render_to_texture")===!1){let ie=!1;for(let pe=0,Re=V.length;pe<Re;pe++){const Se=V[pe],ve=Se.object,Gt=Se.geometry,be=Se.material,ce=Se.group;if(be.side===xe&&ve.layers.test(j.layers)){const an=be.side;be.side=on,be.needsUpdate=!0,Tc(ve,$,j,Gt,be,ce),be.side=an,be.needsUpdate=!0,ie=!0}}ie===!0&&(gt.updateMultisampleRenderTarget(Mt),gt.updateRenderTargetMipmap(Mt))}_.setRenderTarget(Nt,Dt,Wt),_.setClearColor(z,F),kt!==void 0&&(j.viewport=kt),_.toneMapping=Zt}function $s(R,V,$){const j=V.isScene===!0?V.overrideMaterial:null;for(let X=0,Mt=R.length;X<Mt;X++){const Rt=R[X],Nt=Rt.object,Dt=Rt.geometry,Wt=Rt.group;let Zt=Rt.material;Zt.allowOverride===!0&&j!==null&&(Zt=j),Nt.layers.test($.layers)&&Tc(Nt,V,$,Dt,Zt,Wt)}}function Tc(R,V,$,j,X,Mt){R.onBeforeRender(_,V,$,j,X,Mt),R.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),X.onBeforeRender(_,V,$,j,R,Mt),X.transparent===!0&&X.side===xe&&X.forceSinglePass===!1?(X.side=on,X.needsUpdate=!0,_.renderBufferDirect($,V,j,X,R,Mt),X.side=Kn,X.needsUpdate=!0,_.renderBufferDirect($,V,j,X,R,Mt),X.side=xe):_.renderBufferDirect($,V,j,X,R,Mt),R.onAfterRender(_,V,$,j,X,Mt)}function Ks(R,V,$){V.isScene!==!0&&(V=ot);const j=lt.get(R),X=p.state.lights,Mt=p.state.shadowsArray,Rt=X.state.version,Nt=N.getParameters(R,X.state,Mt,V,$),Dt=N.getProgramCacheKey(Nt);let Wt=j.programs;j.environment=R.isMeshStandardMaterial?V.environment:null,j.fog=V.fog,j.envMap=(R.isMeshStandardMaterial?Bt:Ht).get(R.envMap||j.environment),j.envMapRotation=j.environment!==null&&R.envMap===null?V.environmentRotation:R.envMapRotation,Wt===void 0&&(R.addEventListener("dispose",at),Wt=new Map,j.programs=Wt);let Zt=Wt.get(Dt);if(Zt!==void 0){if(j.currentProgram===Zt&&j.lightsStateVersion===Rt)return Cc(R,Nt),Zt}else Nt.uniforms=N.getUniforms(R),R.onBeforeCompile(Nt,_),Zt=N.acquireProgram(Nt,Dt),Wt.set(Dt,Zt),j.uniforms=Nt.uniforms;const kt=j.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(kt.clippingPlanes=ht.uniform),Cc(R,Nt),j.needsLights=eu(R),j.lightsStateVersion=Rt,j.needsLights&&(kt.ambientLightColor.value=X.state.ambient,kt.lightProbe.value=X.state.probe,kt.directionalLights.value=X.state.directional,kt.directionalLightShadows.value=X.state.directionalShadow,kt.spotLights.value=X.state.spot,kt.spotLightShadows.value=X.state.spotShadow,kt.rectAreaLights.value=X.state.rectArea,kt.ltc_1.value=X.state.rectAreaLTC1,kt.ltc_2.value=X.state.rectAreaLTC2,kt.pointLights.value=X.state.point,kt.pointLightShadows.value=X.state.pointShadow,kt.hemisphereLights.value=X.state.hemi,kt.directionalShadowMap.value=X.state.directionalShadowMap,kt.directionalShadowMatrix.value=X.state.directionalShadowMatrix,kt.spotShadowMap.value=X.state.spotShadowMap,kt.spotLightMatrix.value=X.state.spotLightMatrix,kt.spotLightMap.value=X.state.spotLightMap,kt.pointShadowMap.value=X.state.pointShadowMap,kt.pointShadowMatrix.value=X.state.pointShadowMatrix),j.currentProgram=Zt,j.uniformsList=null,Zt}function Ac(R){if(R.uniformsList===null){const V=R.currentProgram.getUniforms();R.uniformsList=zr.seqWithValue(V.seq,R.uniforms)}return R.uniformsList}function Cc(R,V){const $=lt.get(R);$.outputColorSpace=V.outputColorSpace,$.batching=V.batching,$.batchingColor=V.batchingColor,$.instancing=V.instancing,$.instancingColor=V.instancingColor,$.instancingMorph=V.instancingMorph,$.skinning=V.skinning,$.morphTargets=V.morphTargets,$.morphNormals=V.morphNormals,$.morphColors=V.morphColors,$.morphTargetsCount=V.morphTargetsCount,$.numClippingPlanes=V.numClippingPlanes,$.numIntersection=V.numClipIntersection,$.vertexAlphas=V.vertexAlphas,$.vertexTangents=V.vertexTangents,$.toneMapping=V.toneMapping}function Qh(R,V,$,j,X){V.isScene!==!0&&(V=ot),gt.resetTextureUnits();const Mt=V.fog,Rt=j.isMeshStandardMaterial?V.environment:null,Nt=A===null?_.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:us,Dt=(j.isMeshStandardMaterial?Bt:Ht).get(j.envMap||Rt),Wt=j.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Zt=!!$.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),kt=!!$.morphAttributes.position,ie=!!$.morphAttributes.normal,pe=!!$.morphAttributes.color;let Re=li;j.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Re=_.toneMapping);const Se=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,ve=Se!==void 0?Se.length:0,Gt=lt.get(j),be=p.state.lights;if(yt===!0&&(Y===!0||R!==S)){const Ke=R===S&&j.id===w;ht.setState(j,R,Ke)}let ce=!1;j.version===Gt.__version?(Gt.needsLights&&Gt.lightsStateVersion!==be.state.version||Gt.outputColorSpace!==Nt||X.isBatchedMesh&&Gt.batching===!1||!X.isBatchedMesh&&Gt.batching===!0||X.isBatchedMesh&&Gt.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Gt.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Gt.instancing===!1||!X.isInstancedMesh&&Gt.instancing===!0||X.isSkinnedMesh&&Gt.skinning===!1||!X.isSkinnedMesh&&Gt.skinning===!0||X.isInstancedMesh&&Gt.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Gt.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Gt.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Gt.instancingMorph===!1&&X.morphTexture!==null||Gt.envMap!==Dt||j.fog===!0&&Gt.fog!==Mt||Gt.numClippingPlanes!==void 0&&(Gt.numClippingPlanes!==ht.numPlanes||Gt.numIntersection!==ht.numIntersection)||Gt.vertexAlphas!==Wt||Gt.vertexTangents!==Zt||Gt.morphTargets!==kt||Gt.morphNormals!==ie||Gt.morphColors!==pe||Gt.toneMapping!==Re||Gt.morphTargetsCount!==ve)&&(ce=!0):(ce=!0,Gt.__version=j.version);let an=Gt.currentProgram;ce===!0&&(an=Ks(j,V,X));let Ui=!1,cn=!1,Ms=!1;const Te=an.getUniforms(),pn=Gt.uniforms;if(it.useProgram(an.program)&&(Ui=!0,cn=!0,Ms=!0),j.id!==w&&(w=j.id,cn=!0),Ui||S!==R){it.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Te.setValue(L,"projectionMatrix",R.projectionMatrix),Te.setValue(L,"viewMatrix",R.matrixWorldInverse);const sn=Te.map.cameraPosition;sn!==void 0&&sn.setValue(L,ut.setFromMatrixPosition(R.matrixWorld)),nt.logarithmicDepthBuffer&&Te.setValue(L,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&Te.setValue(L,"isOrthographic",R.isOrthographicCamera===!0),S!==R&&(S=R,cn=!0,Ms=!0)}if(X.isSkinnedMesh){Te.setOptional(L,X,"bindMatrix"),Te.setOptional(L,X,"bindMatrixInverse");const Ke=X.skeleton;Ke&&(Ke.boneTexture===null&&Ke.computeBoneTexture(),Te.setValue(L,"boneTexture",Ke.boneTexture,gt))}X.isBatchedMesh&&(Te.setOptional(L,X,"batchingTexture"),Te.setValue(L,"batchingTexture",X._matricesTexture,gt),Te.setOptional(L,X,"batchingIdTexture"),Te.setValue(L,"batchingIdTexture",X._indirectTexture,gt),Te.setOptional(L,X,"batchingColorTexture"),X._colorsTexture!==null&&Te.setValue(L,"batchingColorTexture",X._colorsTexture,gt));const mn=$.morphAttributes;if((mn.position!==void 0||mn.normal!==void 0||mn.color!==void 0)&&pt.update(X,$,an),(cn||Gt.receiveShadow!==X.receiveShadow)&&(Gt.receiveShadow=X.receiveShadow,Te.setValue(L,"receiveShadow",X.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(pn.envMap.value=Dt,pn.flipEnvMap.value=Dt.isCubeTexture&&Dt.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&V.environment!==null&&(pn.envMapIntensity.value=V.environmentIntensity),cn&&(Te.setValue(L,"toneMappingExposure",_.toneMappingExposure),Gt.needsLights&&tu(pn,Ms),Mt&&j.fog===!0&&Z.refreshFogUniforms(pn,Mt),Z.refreshMaterialUniforms(pn,j,O,q,p.state.transmissionRenderTarget[R.id]),zr.upload(L,Ac(Gt),pn,gt)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(zr.upload(L,Ac(Gt),pn,gt),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&Te.setValue(L,"center",X.center),Te.setValue(L,"modelViewMatrix",X.modelViewMatrix),Te.setValue(L,"normalMatrix",X.normalMatrix),Te.setValue(L,"modelMatrix",X.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const Ke=j.uniformsGroups;for(let sn=0,co=Ke.length;sn<co;sn++){const fi=Ke[sn];Yt.update(fi,an),Yt.bind(fi,an)}}return an}function tu(R,V){R.ambientLightColor.needsUpdate=V,R.lightProbe.needsUpdate=V,R.directionalLights.needsUpdate=V,R.directionalLightShadows.needsUpdate=V,R.pointLights.needsUpdate=V,R.pointLightShadows.needsUpdate=V,R.spotLights.needsUpdate=V,R.spotLightShadows.needsUpdate=V,R.rectAreaLights.needsUpdate=V,R.hemisphereLights.needsUpdate=V}function eu(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(R,V,$){const j=lt.get(R);j.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,j.__autoAllocateDepthBuffer===!1&&(j.__useRenderToTexture=!1),lt.get(R.texture).__webglTexture=V,lt.get(R.depthTexture).__webglTexture=j.__autoAllocateDepthBuffer?void 0:$,j.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,V){const $=lt.get(R);$.__webglFramebuffer=V,$.__useDefaultFramebuffer=V===void 0};const nu=L.createFramebuffer();this.setRenderTarget=function(R,V=0,$=0){A=R,E=V,T=$;let j=!0,X=null,Mt=!1,Rt=!1;if(R){const Dt=lt.get(R);if(Dt.__useDefaultFramebuffer!==void 0)it.bindFramebuffer(L.FRAMEBUFFER,null),j=!1;else if(Dt.__webglFramebuffer===void 0)gt.setupRenderTarget(R);else if(Dt.__hasExternalTextures)gt.rebindTextures(R,lt.get(R.texture).__webglTexture,lt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const kt=R.depthTexture;if(Dt.__boundDepthTexture!==kt){if(kt!==null&&lt.has(kt)&&(R.width!==kt.image.width||R.height!==kt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");gt.setupDepthRenderbuffer(R)}}const Wt=R.texture;(Wt.isData3DTexture||Wt.isDataArrayTexture||Wt.isCompressedArrayTexture)&&(Rt=!0);const Zt=lt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Zt[V])?X=Zt[V][$]:X=Zt[V],Mt=!0):R.samples>0&&gt.useMultisampledRTT(R)===!1?X=lt.get(R).__webglMultisampledFramebuffer:Array.isArray(Zt)?X=Zt[$]:X=Zt,C.copy(R.viewport),P.copy(R.scissor),U=R.scissorTest}else C.copy(et).multiplyScalar(O).floor(),P.copy(ct).multiplyScalar(O).floor(),U=_t;if($!==0&&(X=nu),it.bindFramebuffer(L.FRAMEBUFFER,X)&&j&&it.drawBuffers(R,X),it.viewport(C),it.scissor(P),it.setScissorTest(U),Mt){const Dt=lt.get(R.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+V,Dt.__webglTexture,$)}else if(Rt){const Dt=V;for(let Wt=0;Wt<R.textures.length;Wt++){const Zt=lt.get(R.textures[Wt]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Wt,Zt.__webglTexture,$,Dt)}}else if(R!==null&&$!==0){const Dt=lt.get(R.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Dt.__webglTexture,$)}w=-1},this.readRenderTargetPixels=function(R,V,$,j,X,Mt,Rt,Nt=0){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=lt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Rt!==void 0&&(Dt=Dt[Rt]),Dt){it.bindFramebuffer(L.FRAMEBUFFER,Dt);try{const Wt=R.textures[Nt],Zt=Wt.format,kt=Wt.type;if(!nt.textureFormatReadable(Zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!nt.textureTypeReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=R.width-j&&$>=0&&$<=R.height-X&&(R.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Nt),L.readPixels(V,$,j,X,Ot.convert(Zt),Ot.convert(kt),Mt))}finally{const Wt=A!==null?lt.get(A).__webglFramebuffer:null;it.bindFramebuffer(L.FRAMEBUFFER,Wt)}}},this.readRenderTargetPixelsAsync=async function(R,V,$,j,X,Mt,Rt,Nt=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Dt=lt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Rt!==void 0&&(Dt=Dt[Rt]),Dt)if(V>=0&&V<=R.width-j&&$>=0&&$<=R.height-X){it.bindFramebuffer(L.FRAMEBUFFER,Dt);const Wt=R.textures[Nt],Zt=Wt.format,kt=Wt.type;if(!nt.textureFormatReadable(Zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!nt.textureTypeReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ie=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,ie),L.bufferData(L.PIXEL_PACK_BUFFER,Mt.byteLength,L.STREAM_READ),R.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Nt),L.readPixels(V,$,j,X,Ot.convert(Zt),Ot.convert(kt),0);const pe=A!==null?lt.get(A).__webglFramebuffer:null;it.bindFramebuffer(L.FRAMEBUFFER,pe);const Re=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await nd(L,Re,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,ie),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,Mt),L.deleteBuffer(ie),L.deleteSync(Re),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,V=null,$=0){const j=Math.pow(2,-$),X=Math.floor(R.image.width*j),Mt=Math.floor(R.image.height*j),Rt=V!==null?V.x:0,Nt=V!==null?V.y:0;gt.setTexture2D(R,0),L.copyTexSubImage2D(L.TEXTURE_2D,$,0,0,Rt,Nt,X,Mt),it.unbindTexture()};const iu=L.createFramebuffer(),su=L.createFramebuffer();this.copyTextureToTexture=function(R,V,$=null,j=null,X=0,Mt=null){Mt===null&&(X!==0?(Vs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Mt=X,X=0):Mt=0);let Rt,Nt,Dt,Wt,Zt,kt,ie,pe,Re;const Se=R.isCompressedTexture?R.mipmaps[Mt]:R.image;if($!==null)Rt=$.max.x-$.min.x,Nt=$.max.y-$.min.y,Dt=$.isBox3?$.max.z-$.min.z:1,Wt=$.min.x,Zt=$.min.y,kt=$.isBox3?$.min.z:0;else{const mn=Math.pow(2,-X);Rt=Math.floor(Se.width*mn),Nt=Math.floor(Se.height*mn),R.isDataArrayTexture?Dt=Se.depth:R.isData3DTexture?Dt=Math.floor(Se.depth*mn):Dt=1,Wt=0,Zt=0,kt=0}j!==null?(ie=j.x,pe=j.y,Re=j.z):(ie=0,pe=0,Re=0);const ve=Ot.convert(V.format),Gt=Ot.convert(V.type);let be;V.isData3DTexture?(gt.setTexture3D(V,0),be=L.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(gt.setTexture2DArray(V,0),be=L.TEXTURE_2D_ARRAY):(gt.setTexture2D(V,0),be=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,V.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,V.unpackAlignment);const ce=L.getParameter(L.UNPACK_ROW_LENGTH),an=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Ui=L.getParameter(L.UNPACK_SKIP_PIXELS),cn=L.getParameter(L.UNPACK_SKIP_ROWS),Ms=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,Se.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Se.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Wt),L.pixelStorei(L.UNPACK_SKIP_ROWS,Zt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,kt);const Te=R.isDataArrayTexture||R.isData3DTexture,pn=V.isDataArrayTexture||V.isData3DTexture;if(R.isDepthTexture){const mn=lt.get(R),Ke=lt.get(V),sn=lt.get(mn.__renderTarget),co=lt.get(Ke.__renderTarget);it.bindFramebuffer(L.READ_FRAMEBUFFER,sn.__webglFramebuffer),it.bindFramebuffer(L.DRAW_FRAMEBUFFER,co.__webglFramebuffer);for(let fi=0;fi<Dt;fi++)Te&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,lt.get(R).__webglTexture,X,kt+fi),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,lt.get(V).__webglTexture,Mt,Re+fi)),L.blitFramebuffer(Wt,Zt,Rt,Nt,ie,pe,Rt,Nt,L.DEPTH_BUFFER_BIT,L.NEAREST);it.bindFramebuffer(L.READ_FRAMEBUFFER,null),it.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(X!==0||R.isRenderTargetTexture||lt.has(R)){const mn=lt.get(R),Ke=lt.get(V);it.bindFramebuffer(L.READ_FRAMEBUFFER,iu),it.bindFramebuffer(L.DRAW_FRAMEBUFFER,su);for(let sn=0;sn<Dt;sn++)Te?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,mn.__webglTexture,X,kt+sn):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,mn.__webglTexture,X),pn?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ke.__webglTexture,Mt,Re+sn):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ke.__webglTexture,Mt),X!==0?L.blitFramebuffer(Wt,Zt,Rt,Nt,ie,pe,Rt,Nt,L.COLOR_BUFFER_BIT,L.NEAREST):pn?L.copyTexSubImage3D(be,Mt,ie,pe,Re+sn,Wt,Zt,Rt,Nt):L.copyTexSubImage2D(be,Mt,ie,pe,Wt,Zt,Rt,Nt);it.bindFramebuffer(L.READ_FRAMEBUFFER,null),it.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else pn?R.isDataTexture||R.isData3DTexture?L.texSubImage3D(be,Mt,ie,pe,Re,Rt,Nt,Dt,ve,Gt,Se.data):V.isCompressedArrayTexture?L.compressedTexSubImage3D(be,Mt,ie,pe,Re,Rt,Nt,Dt,ve,Se.data):L.texSubImage3D(be,Mt,ie,pe,Re,Rt,Nt,Dt,ve,Gt,Se):R.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,Mt,ie,pe,Rt,Nt,ve,Gt,Se.data):R.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,Mt,ie,pe,Se.width,Se.height,ve,Se.data):L.texSubImage2D(L.TEXTURE_2D,Mt,ie,pe,Rt,Nt,ve,Gt,Se);L.pixelStorei(L.UNPACK_ROW_LENGTH,ce),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,an),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ui),L.pixelStorei(L.UNPACK_SKIP_ROWS,cn),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ms),Mt===0&&V.generateMipmaps&&L.generateMipmap(be),it.unbindTexture()},this.initRenderTarget=function(R){lt.get(R).__webglFramebuffer===void 0&&gt.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?gt.setTextureCube(R,0):R.isData3DTexture?gt.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?gt.setTexture2DArray(R,0):gt.setTexture2D(R,0),it.unbindTexture()},this.resetState=function(){E=0,T=0,A=null,it.reset(),Et.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=oe._getDrawingBufferColorSpace(t),e.unpackColorSpace=oe._getUnpackColorSpace()}}class rv extends J{constructor(t,e={}){super(t),this.isWater=!0;const n=this,i=e.textureWidth!==void 0?e.textureWidth:512,r=e.textureHeight!==void 0?e.textureHeight:512,o=e.clipBias!==void 0?e.clipBias:0,a=e.alpha!==void 0?e.alpha:1,l=e.time!==void 0?e.time:0,c=e.waterNormals!==void 0?e.waterNormals:null,h=e.sunDirection!==void 0?e.sunDirection:new I(.70707,.70707,0),u=new Xt(e.sunColor!==void 0?e.sunColor:16777215),d=new Xt(e.waterColor!==void 0?e.waterColor:8355711),f=e.eye!==void 0?e.eye:new I(0,0,0),g=e.distortionScale!==void 0?e.distortionScale:20,v=e.side!==void 0?e.side:Kn,m=e.fog!==void 0?e.fog:!1,p=new ri,M=new I,x=new I,_=new I,y=new he,E=new I(0,0,-1),T=new Ee,A=new I,w=new I,S=new Ee,C=new he,P=new vn,U=new yn(i,r),z={name:"MirrorShader",uniforms:Zn.merge([Tt.fog,Tt.lights,{normalSampler:{value:null},mirrorSampler:{value:null},alpha:{value:1},time:{value:0},size:{value:1},distortionScale:{value:20},textureMatrix:{value:new he},sunColor:{value:new Xt(8355711)},sunDirection:{value:new I(.70707,.70707,0)},eye:{value:new I},waterColor:{value:new Xt(5592405)}}]),vertexShader:`
				uniform mat4 textureMatrix;
				uniform float time;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				#include <common>
				#include <fog_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>

				void main() {
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
					worldPosition = mirrorCoord.xyzw;
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
					gl_Position = projectionMatrix * mvPosition;

				#include <beginnormal_vertex>
				#include <defaultnormal_vertex>
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
				#include <shadowmap_vertex>
			}`,fragmentShader:`
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				vec4 getNoise( vec2 uv ) {
					vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
					vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
					vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
					vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
					vec4 noise = texture2D( normalSampler, uv0 ) +
						texture2D( normalSampler, uv1 ) +
						texture2D( normalSampler, uv2 ) +
						texture2D( normalSampler, uv3 );
					return noise * 0.5 - 1.0;
				}

				void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
					vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
					float direction = max( 0.0, dot( eyeDirection, reflection ) );
					specularColor += pow( direction, shiny ) * sunColor * spec;
					diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
				}

				#include <common>
				#include <packing>
				#include <bsdfs>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <lights_pars_begin>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>

				void main() {

					#include <logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);

					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

					float distance = length(worldToEye);

					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.3;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );

					#include <tonemapping_fragment>
					#include <colorspace_fragment>
					#include <fog_fragment>	
				}`},F=new qe({name:z.name,uniforms:Zn.clone(z.uniforms),vertexShader:z.vertexShader,fragmentShader:z.fragmentShader,lights:!0,side:v,fog:m});F.uniforms.mirrorSampler.value=U.texture,F.uniforms.textureMatrix.value=C,F.uniforms.alpha.value=a,F.uniforms.time.value=l,F.uniforms.normalSampler.value=c,F.uniforms.sunColor.value=u,F.uniforms.waterColor.value=d,F.uniforms.sunDirection.value=h,F.uniforms.distortionScale.value=g,F.uniforms.eye.value=f,n.material=F,n.onBeforeRender=function(H,q,O){if(x.setFromMatrixPosition(n.matrixWorld),_.setFromMatrixPosition(O.matrixWorld),y.extractRotation(n.matrixWorld),M.set(0,0,1),M.applyMatrix4(y),A.subVectors(x,_),A.dot(M)>0)return;A.reflect(M).negate(),A.add(x),y.extractRotation(O.matrixWorld),E.set(0,0,-1),E.applyMatrix4(y),E.add(_),w.subVectors(x,E),w.reflect(M).negate(),w.add(x),P.position.copy(A),P.up.set(0,1,0),P.up.applyMatrix4(y),P.up.reflect(M),P.lookAt(w),P.far=O.far,P.updateMatrixWorld(),P.projectionMatrix.copy(O.projectionMatrix),C.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),C.multiply(P.projectionMatrix),C.multiply(P.matrixWorldInverse),p.setFromNormalAndCoplanarPoint(M,x),p.applyMatrix4(P.matrixWorldInverse),T.set(p.normal.x,p.normal.y,p.normal.z,p.constant);const W=P.projectionMatrix;S.x=(Math.sign(T.x)+W.elements[8])/W.elements[0],S.y=(Math.sign(T.y)+W.elements[9])/W.elements[5],S.z=-1,S.w=(1+W.elements[10])/W.elements[14],T.multiplyScalar(2/T.dot(S)),W.elements[2]=T.x,W.elements[6]=T.y,W.elements[10]=T.z+1-o,W.elements[14]=T.w,f.setFromMatrixPosition(O.matrixWorld);const tt=H.getRenderTarget(),et=H.xr.enabled,ct=H.shadowMap.autoUpdate;n.visible=!1,H.xr.enabled=!1,H.shadowMap.autoUpdate=!1,H.setRenderTarget(U),H.state.buffers.depth.setMask(!0),H.autoClear===!1&&H.clear(),H.render(q,P),n.visible=!0,H.xr.enabled=et,H.shadowMap.autoUpdate=ct,H.setRenderTarget(tt);const _t=O.viewport;_t!==void 0&&H.state.viewport(_t)}}}const Hr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class xs{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ov=new so(-1,1,1,-1,0,1);class av extends ae{constructor(){super(),this.setAttribute("position",new zt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new zt([0,2,0,0,2,0],2))}}const cv=new av;class vc{constructor(t){this._mesh=new J(cv,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,ov)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class lv extends xs{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof qe?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Zn.clone(t.uniforms),this.material=new qe({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new vc(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class kl extends xs{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class hv extends xs{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class uv{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new mt);this._width=n.width,this._height=n.height,e=new yn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ui}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new lv(Hr),this.copyPass.material.blending=tn,this.clock=new Mf}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}kl!==void 0&&(o instanceof kl?n=!0:o instanceof hv&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new mt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const Pr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class dv extends xs{constructor(){super(),this.uniforms=Zn.clone(Pr.uniforms),this.material=new hf({name:Pr.name,uniforms:this.uniforms,vertexShader:Pr.vertexShader,fragmentShader:Pr.fragmentShader}),this._fsQuad=new vc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},oe.getTransfer(this._outputColorSpace)===fe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===oh?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ah?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ch?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===lh?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===uh?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ja?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===hh&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class fv extends xs{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Xt}render(t,e,n){const i=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=i}}class pv{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let n,i,r;const o=.5*(Math.sqrt(3)-1),a=(t+e)*o,l=Math.floor(t+a),c=Math.floor(e+a),h=(3-Math.sqrt(3))/6,u=(l+c)*h,d=l-u,f=c-u,g=t-d,v=e-f;let m,p;g>v?(m=1,p=0):(m=0,p=1);const M=g-m+h,x=v-p+h,_=g-1+2*h,y=v-1+2*h,E=l&255,T=c&255,A=this.perm[E+this.perm[T]]%12,w=this.perm[E+m+this.perm[T+p]]%12,S=this.perm[E+1+this.perm[T+1]]%12;let C=.5-g*g-v*v;C<0?n=0:(C*=C,n=C*C*this._dot(this.grad3[A],g,v));let P=.5-M*M-x*x;P<0?i=0:(P*=P,i=P*P*this._dot(this.grad3[w],M,x));let U=.5-_*_-y*y;return U<0?r=0:(U*=U,r=U*U*this._dot(this.grad3[S],_,y)),70*(n+i+r)}noise3d(t,e,n){let i,r,o,a;const c=(t+e+n)*.3333333333333333,h=Math.floor(t+c),u=Math.floor(e+c),d=Math.floor(n+c),f=1/6,g=(h+u+d)*f,v=h-g,m=u-g,p=d-g,M=t-v,x=e-m,_=n-p;let y,E,T,A,w,S;M>=x?x>=_?(y=1,E=0,T=0,A=1,w=1,S=0):M>=_?(y=1,E=0,T=0,A=1,w=0,S=1):(y=0,E=0,T=1,A=1,w=0,S=1):x<_?(y=0,E=0,T=1,A=0,w=1,S=1):M<_?(y=0,E=1,T=0,A=0,w=1,S=1):(y=0,E=1,T=0,A=1,w=1,S=0);const C=M-y+f,P=x-E+f,U=_-T+f,z=M-A+2*f,F=x-w+2*f,H=_-S+2*f,q=M-1+3*f,O=x-1+3*f,W=_-1+3*f,tt=h&255,et=u&255,ct=d&255,_t=this.perm[tt+this.perm[et+this.perm[ct]]]%12,bt=this.perm[tt+y+this.perm[et+E+this.perm[ct+T]]]%12,yt=this.perm[tt+A+this.perm[et+w+this.perm[ct+S]]]%12,Y=this.perm[tt+1+this.perm[et+1+this.perm[ct+1]]]%12;let K=.6-M*M-x*x-_*_;K<0?i=0:(K*=K,i=K*K*this._dot3(this.grad3[_t],M,x,_));let ut=.6-C*C-P*P-U*U;ut<0?r=0:(ut*=ut,r=ut*ut*this._dot3(this.grad3[bt],C,P,U));let Q=.6-z*z-F*F-H*H;Q<0?o=0:(Q*=Q,o=Q*Q*this._dot3(this.grad3[yt],z,F,H));let ot=.6-q*q-O*O-W*W;return ot<0?a=0:(ot*=ot,a=ot*ot*this._dot3(this.grad3[Y],q,O,W)),32*(i+r+o+a)}noise4d(t,e,n,i){const r=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,u,d,f,g;const v=(t+e+n+i)*l,m=Math.floor(t+v),p=Math.floor(e+v),M=Math.floor(n+v),x=Math.floor(i+v),_=(m+p+M+x)*c,y=m-_,E=p-_,T=M-_,A=x-_,w=t-y,S=e-E,C=n-T,P=i-A,U=w>S?32:0,z=w>C?16:0,F=S>C?8:0,H=w>P?4:0,q=S>P?2:0,O=C>P?1:0,W=U+z+F+H+q+O,tt=o[W][0]>=3?1:0,et=o[W][1]>=3?1:0,ct=o[W][2]>=3?1:0,_t=o[W][3]>=3?1:0,bt=o[W][0]>=2?1:0,yt=o[W][1]>=2?1:0,Y=o[W][2]>=2?1:0,K=o[W][3]>=2?1:0,ut=o[W][0]>=1?1:0,Q=o[W][1]>=1?1:0,ot=o[W][2]>=1?1:0,At=o[W][3]>=1?1:0,qt=w-tt+c,L=S-et+c,rt=C-ct+c,st=P-_t+c,nt=w-bt+2*c,it=S-yt+2*c,dt=C-Y+2*c,lt=P-K+2*c,gt=w-ut+3*c,Ht=S-Q+3*c,Bt=C-ot+3*c,D=P-At+3*c,b=w-1+4*c,G=S-1+4*c,N=C-1+4*c,Z=P-1+4*c,k=m&255,vt=p&255,ht=M&255,Pt=x&255,It=a[k+a[vt+a[ht+a[Pt]]]]%32,pt=a[k+tt+a[vt+et+a[ht+ct+a[Pt+_t]]]]%32,Ct=a[k+bt+a[vt+yt+a[ht+Y+a[Pt+K]]]]%32,Vt=a[k+ut+a[vt+Q+a[ht+ot+a[Pt+At]]]]%32,Ot=a[k+1+a[vt+1+a[ht+1+a[Pt+1]]]]%32;let Et=.6-w*w-S*S-C*C-P*P;Et<0?h=0:(Et*=Et,h=Et*Et*this._dot4(r[It],w,S,C,P));let Yt=.6-qt*qt-L*L-rt*rt-st*st;Yt<0?u=0:(Yt*=Yt,u=Yt*Yt*this._dot4(r[pt],qt,L,rt,st));let B=.6-nt*nt-it*it-dt*dt-lt*lt;B<0?d=0:(B*=B,d=B*B*this._dot4(r[Ct],nt,it,dt,lt));let ft=.6-gt*gt-Ht*Ht-Bt*Bt-D*D;ft<0?f=0:(ft*=ft,f=ft*ft*this._dot4(r[Vt],gt,Ht,Bt,D));let St=.6-b*b-G*G-N*N-Z*Z;return St<0?g=0:(St*=St,g=St*St*this._dot4(r[Ot],b,G,N,Z)),27*(h+u+d+f+g)}_dot(t,e,n){return t[0]*e+t[1]*n}_dot3(t,e,n,i){return t[0]*e+t[1]*n+t[2]*i}_dot4(t,e,n,i,r){return t[0]*e+t[1]*n+t[2]*i+t[3]*r}}const Dr={defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new mt},cameraProjectionMatrix:{value:new he},cameraInverseProjectionMatrix:{value:new he},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;

		uniform vec3 kernel[ KERNEL_SIZE ];

		uniform vec2 resolution;

		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraInverseProjectionMatrix;

		uniform float kernelRadius;
		uniform float minDistance; // avoid artifacts caused by neighbour fragments with minimal depth difference
		uniform float maxDistance; // avoid the influence of fragments which are too far away

		varying vec2 vUv;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {

			return texture2D( tDepth, screenPosition ).x;

		}

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		float getViewZ( const in float depth ) {

			#if PERSPECTIVE_CAMERA == 1

				return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );

			#else

				return orthographicDepthToViewZ( depth, cameraNear, cameraFar );

			#endif

		}

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {

			float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];

			vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );

			clipPosition *= clipW; // unprojection.

			return ( cameraInverseProjectionMatrix * clipPosition ).xyz;

		}

		vec3 getViewNormal( const in vec2 screenPosition ) {

			return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );

		}

		void main() {

			float depth = getDepth( vUv );

			if ( depth == 1.0 ) {

				gl_FragColor = vec4( 1.0 ); // don't influence background

			} else {

				float viewZ = getViewZ( depth );

				vec3 viewPosition = getViewPosition( vUv, depth, viewZ );
				vec3 viewNormal = getViewNormal( vUv );

				vec2 noiseScale = vec2( resolution.x / 4.0, resolution.y / 4.0 );
				vec3 random = vec3( texture2D( tNoise, vUv * noiseScale ).r );

				// compute matrix used to reorient a kernel vector

				vec3 tangent = normalize( random - viewNormal * dot( random, viewNormal ) );
				vec3 bitangent = cross( viewNormal, tangent );
				mat3 kernelMatrix = mat3( tangent, bitangent, viewNormal );

				float occlusion = 0.0;

				for ( int i = 0; i < KERNEL_SIZE; i ++ ) {

					vec3 sampleVector = kernelMatrix * kernel[ i ]; // reorient sample vector in view space
					vec3 samplePoint = viewPosition + ( sampleVector * kernelRadius ); // calculate sample point

					vec4 samplePointNDC = cameraProjectionMatrix * vec4( samplePoint, 1.0 ); // project point and calculate NDC
					samplePointNDC /= samplePointNDC.w;

					vec2 samplePointUv = samplePointNDC.xy * 0.5 + 0.5; // compute uv coordinates

					float realDepth = getLinearDepth( samplePointUv ); // get linear depth from depth texture
					float sampleDepth = viewZToOrthographicDepth( samplePoint.z, cameraNear, cameraFar ); // compute linear depth of the sample view Z value
					float delta = sampleDepth - realDepth;

					if ( delta > minDistance && delta < maxDistance ) { // if fragment is before sample point, increase occlusion

						occlusion += 1.0;

					}

				}

				occlusion = clamp( occlusion / float( KERNEL_SIZE ), 0.0, 1.0 );

				gl_FragColor = vec4( vec3( 1.0 - occlusion ), 1.0 );

			}

		}`},Lr={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDepth;

		uniform float cameraNear;
		uniform float cameraFar;

		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		void main() {

			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Ir={uniforms:{tDiffuse:{value:null},resolution:{value:new mt}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		void main() {

			vec2 texelSize = ( 1.0 / resolution );
			float result = 0.0;

			for ( int i = - 2; i <= 2; i ++ ) {

				for ( int j = - 2; j <= 2; j ++ ) {

					vec2 offset = ( vec2( float( i ), float( j ) ) ) * texelSize;
					result += texture2D( tDiffuse, vUv + offset ).r;

				}

			}

			gl_FragColor = vec4( vec3( result / ( 5.0 * 5.0 ) ), 1.0 );

		}`};class ai extends xs{constructor(t,e,n=512,i=512,r=32){super(),this.width=n,this.height=i,this.clear=!0,this.needsSwap=!1,this.camera=e,this.scene=t,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(r),this._generateRandomKernelRotations();const o=new hc;o.format=hs,o.type=ls,this.normalRenderTarget=new yn(this.width,this.height,{minFilter:nn,magFilter:nn,type:ui,depthTexture:o}),this.ssaoRenderTarget=new yn(this.width,this.height,{type:ui}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new qe({defines:Object.assign({},Dr.defines),uniforms:Zn.clone(Dr.uniforms),vertexShader:Dr.vertexShader,fragmentShader:Dr.fragmentShader,blending:tn}),this.ssaoMaterial.defines.KERNEL_SIZE=r,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new df,this.normalMaterial.blending=tn,this.blurMaterial=new qe({defines:Object.assign({},Ir.defines),uniforms:Zn.clone(Ir.uniforms),vertexShader:Ir.vertexShader,fragmentShader:Ir.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new qe({defines:Object.assign({},Lr.defines),uniforms:Zn.clone(Lr.uniforms),vertexShader:Lr.vertexShader,fragmentShader:Lr.fragmentShader,blending:tn}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new qe({uniforms:Zn.clone(Hr.uniforms),vertexShader:Hr.vertexShader,fragmentShader:Hr.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:sh,blendDst:ta,blendEquation:Yn,blendSrcAlpha:ih,blendDstAlpha:ta,blendEquationAlpha:Yn}),this._fsQuad=new vc(null),this._originalClearColor=new Xt}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(t,e,n){switch(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(t,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(t,this.blurMaterial,this.blurRenderTarget),this.output){case ai.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=tn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case ai.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=tn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case ai.OUTPUT.Depth:this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case ai.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=tn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case ai.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=nh,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(t,e){this.width=t,this.height=e,this.ssaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.blurRenderTarget.setSize(t,e),this.ssaoMaterial.uniforms.resolution.value.set(t,e),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(t,e)}_renderPass(t,e,n,i,r){t.getClearColor(this._originalClearColor);const o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,i!=null&&(t.setClearColor(i),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_renderOverride(t,e,n,i,r){t.getClearColor(this._originalClearColor);const o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,i=e.clearColor||i,r=e.clearAlpha||r,i!=null&&(t.setClearColor(i),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_generateSampleKernel(t){const e=this.kernel;for(let n=0;n<t;n++){const i=new I;i.x=Math.random()*2-1,i.y=Math.random()*2-1,i.z=Math.random(),i.normalize();let r=n/t;r=me.lerp(.1,1,r*r),i.multiplyScalar(r),e.push(i)}}_generateRandomKernelRotations(){const n=new pv,i=16,r=new Float32Array(i);for(let o=0;o<i;o++){const a=Math.random()*2-1,l=Math.random()*2-1,c=0;r[o]=n.noise3d(a,l,c)}this.noiseTexture=new no(r,4,4,eo,An),this.noiseTexture.wrapS=Ri,this.noiseTexture.wrapT=Ri,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){const t=this.scene,e=this._visibilityCache;t.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,e.push(n))})}_restoreVisibility(){const t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}}ai.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};const re=["north","east","south","west"],jr={north:!0,east:!0,south:!0,west:!0},Cs=ne.ink,Gl=ne.water,Kt=De.foundationHeight,Zo=new I(0,1,0);function $t(s,t,e=0){let n=Math.imul(s|0,374761393)^Math.imul(t|0,668265263)^Math.imul(e|0,1442695041);return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967295}function Pe(s,t){const e=new Xt(s);return e.offsetHSL(0,0,t),e}function we(s,t,e){const n=new Xt(s);return n.offsetHSL(0,t,e),n}function mv(){const e=document.createElement("canvas");e.width=128,e.height=512;const n=e.getContext("2d");if(n){const r=l=>`#${l.toString(16).padStart(6,"0")}`,o=n.createLinearGradient(0,0,0,512);o.addColorStop(0,r(ne.skyZenith)),o.addColorStop(.44,r(ne.sky)),o.addColorStop(.76,r(ne.skyHorizon)),o.addColorStop(1,r(ne.fog)),n.fillStyle=o,n.fillRect(0,0,128,512);const a=n.getImageData(0,0,128,512);for(let l=0;l<128*512;l+=1){const c=l%128,h=Math.floor(l/128),u=(c*17+h*31+(c^h)*7)%3-1,d=l*4;a.data[d]=Math.max(0,Math.min(255,a.data[d]+u)),a.data[d+1]=Math.max(0,Math.min(255,a.data[d+1]+u)),a.data[d+2]=Math.max(0,Math.min(255,a.data[d+2]+u))}n.putImageData(a,0,0)}const i=new Ph(e);return i.colorSpace=Qe,i.minFilter=i.magFilter=en,i.generateMipmaps=!1,i}function gv(){const s=document.createElement("canvas");s.width=s.height=96;const t=s.getContext("2d");if(t){t.fillStyle="#f2f2ed",t.fillRect(0,0,96,96);const n=t.getImageData(0,0,96,96);for(let i=0;i<n.data.length;i+=4){const r=i/4,o=r%96,a=Math.floor(r/96),l=Math.sin(o*.075)*4.5+Math.cos(a*.09)*3.8+Math.sin((o+a)*.045)*2.4,c=Math.sin(o*12.9898+a*78.233)*43758.5453,h=((c-Math.floor(c))*2-1)*1.8,u=Math.max(226,Math.min(255,Math.round(242+l*1.25+h)));n.data[i]=u,n.data[i+1]=u,n.data[i+2]=Math.min(255,u+1),n.data[i+3]=255}t.putImageData(n,0,0)}const e=new Ph(s);return e.wrapS=e.wrapT=Ri,e.repeat.set(1.15,1.15),e.colorSpace=Qe,e}function vv(){const e=new Uint8Array(4096);for(let i=0;i<16;i+=1){const r=Math.sin(i/15*Math.PI)**1.7;for(let o=0;o<64;o+=1){const a=Math.sin(o/63*Math.PI)**.28,l=Math.round(255*r*a),c=(i*64+o)*4;e[c]=l,e[c+1]=l,e[c+2]=l,e[c+3]=255}}const n=new no(e,64,16,fn);return n.minFilter=n.magFilter=en,n.generateMipmaps=!1,n.needsUpdate=!0,n}function _v(s){const t=new Uint8Array(s*s*4);for(let n=0;n<s;n+=1)for(let i=0;i<s;i+=1){const r=i/s*Math.PI*2,o=n/s*Math.PI*2,a=r+o*.28,l=o*.72-r*.18,c=(r+o)*1.55,h=Math.cos(a)*.105-Math.cos(l)*.018+Math.cos(c)*.025,u=Math.cos(a)*.029+Math.cos(l)*.085+Math.cos(c)*.025,d=Math.sqrt(Math.max(0,1-h*h-u*u)),f=(n*s+i)*4;t[f]=Math.round((h*.5+.5)*255),t[f+1]=Math.round((u*.5+.5)*255),t[f+2]=Math.round(d*255),t[f+3]=255}const e=new no(t,s,s,fn);return e.wrapS=e.wrapT=Ri,e.minFilter=e.magFilter=en,e.needsUpdate=!0,e}function es(s,t){const e=se*De.footprintJitter,n=s*.5*se+($t(s,t,301)-.5)*e,i=t*.5*se+($t(s,t,911)-.5)*e;return[n,i]}function un(s,t,e=!0){const n=s*se,i=t*se,r=[es(s*2-1,t*2-1),es(s*2+1,t*2-1),es(s*2+1,t*2+1),es(s*2-1,t*2+1)];return e?r.map(([o,a])=>[o-n,a-i]):r}function xv(s){const t=new Set,e=new Set,n=[[["west","east"],"x"],[["north","south"],"z"]];for(const i of s.values())if(!(i.kind!=="house"||i.level<=1))for(const[[r,o],a]of n){const l=`${a}:${i.id}`;if(e.has(l))continue;let c=i;const h=new Set;for(;!h.has(c.id);){h.add(c.id);const g=c.neighbors[r],v=g?s.get(g):void 0;if(v?.kind!=="house"||v.level!==i.level)break;c=v}const u=[],d=new Set;let f=c;for(;f&&!d.has(f.id);){d.add(f.id),e.add(`${a}:${f.id}`),u.push(f);const g=f.neighbors[o],v=g?s.get(g):void 0;f=v?.kind==="house"&&v.level===i.level?v:void 0}if(!(u.length<4))for(const g of[u[0],u[u.length-1]])re.filter(m=>{const p=g.neighbors[m],M=p?s.get(p):void 0;return M?.kind==="house"&&M.level===g.level}).length===1&&t.add(g.id)}return t}function Mv(s,t,e){const n=e?.storeys.map(i=>`${i.level}:${i.color}`).join(",")??"";return`${s??""}:${t?.kind??"water"}:${t?.level??0}:${Number(e?.foundation??!1)}:${n}`}function yv(s,t){return s?.storeys.some(e=>e.level===t+1)??!1}function _e(s){let t=0,e=0;for(const n of s)t+=n[0],e+=n[1];return[t/s.length,e/s.length]}function We(s,t){const e=_e(s);return s.map(([n,i])=>{const r=e[0]-n,o=e[1]-i,a=Math.hypot(r,o);return[n+r/a*t,i+o/a*t]})}function qa(s,t,e){if(t===0||s.length<3)return s;const n=s.map((r,o)=>{const a=s[(o+1)%s.length],l=a[0]-r[0],c=a[1]-r[1],h=Math.hypot(l,c)||1,u=re[o],d=e[u]?t:0;return{point:[r[0]-c/h*d,r[1]+l/h*d],direction:[l,c]}}),i=(r,o)=>r[0]*o[1]-r[1]*o[0];return s.map((r,o)=>{const a=n[(o+s.length-1)%s.length],l=n[o],c=i(a.direction,l.direction);if(Math.abs(c)<1e-6)return s[o];const h=[l.point[0]-a.point[0],l.point[1]-a.point[1]],u=i(h,l.direction)/c;return[a.point[0]+a.direction[0]*u,a.point[1]+a.direction[1]*u]})}function yi(s,t,e,n=.055,i=0){const r=[],o=i>0?qa(s,-i,e??jr):s,a=[],l=n>0?qa(s,n,e??jr):s,c=Math.max(0,t-n),h=(d,f,g)=>{for(const v of[d,f,g])r.push(...v),a.push((v[0]+v[2])*.28,v[1]*.45+v[2]*.08)};h([l[0][0],t,l[0][1]],[l[2][0],t,l[2][1]],[l[1][0],t,l[1][1]]),h([l[0][0],t,l[0][1]],[l[3][0],t,l[3][1]],[l[2][0],t,l[2][1]]),re.forEach((d,f)=>{const g=(f+1)%4,v=s[f],m=s[g],p=o[f],M=o[g],x=l[f],_=l[g];(!e||e[d])&&(h([p[0],0,p[1]],[m[0],c,m[1]],[M[0],0,M[1]]),h([p[0],0,p[1]],[v[0],c,v[1]],[m[0],c,m[1]])),h([v[0],c,v[1]],[_[0],t,_[1]],[m[0],c,m[1]]),h([v[0],c,v[1]],[x[0],t,x[1]],[_[0],t,_[1]])});const u=new ae;return u.setAttribute("position",new zt(r,3)),u.setAttribute("uv",new zt(a,2)),u.computeVertexNormals(),u}function Sv(s){const t=[];for(let e=0;e<s.length;e+=1){const n=s[e],i=s[(e+1)%s.length];t.push([n[0]*.75+i[0]*.25,n[1]*.75+i[1]*.25]),t.push([n[0]*.25+i[0]*.75,n[1]*.25+i[1]*.75])}return t}function wv(s,t,e=.12,n=.2){const i=[],r=[],o=We(s,-n),a=We(s,e),l=Math.max(0,t-e),c=(d,f,g)=>{for(const v of[d,f,g])i.push(...v),r.push((v[0]+v[2])*.28,v[1]*.45+v[2]*.08)},h=Ln.triangulateShape(a.map(([d,f])=>new mt(d,f)),[]);for(const[d,f,g]of h){const v=a[d??0],m=a[f??0],p=a[g??0];c([v[0],t,v[1]],[p[0],t,p[1]],[m[0],t,m[1]])}for(let d=0;d<s.length;d+=1){const f=(d+1)%s.length,g=s[d],v=s[f],m=o[d],p=o[f],M=a[d],x=a[f];c([m[0],0,m[1]],[p[0],0,p[1]],[v[0],l,v[1]]),c([m[0],0,m[1]],[v[0],l,v[1]],[g[0],l,g[1]]),c([g[0],l,g[1]],[v[0],l,v[1]],[x[0],t,x[1]]),c([g[0],l,g[1]],[x[0],t,x[1]],[M[0],t,M[1]])}const u=new ae;return u.setAttribute("position",new zt(i,3)),u.setAttribute("uv",new zt(r,2)),u.computeVertexNormals(),u}function Ev(s,t){const e=[];for(let i=0;i<s.length;i+=1){const r=s[i],o=s[(i+1)%s.length];e.push(r[0],0,r[1],o[0],0,o[1],o[0],t,o[1],r[0],0,r[1],o[0],t,o[1],r[0],t,r[1])}const n=new ae;return n.setAttribute("position",new zt(e,3)),n.computeVertexNormals(),n}function bv(s,t,e,n){const i=s*.5,r=t*.5,o=Math.min(i,r,.09+n*.035),a=new fs;a.moveTo(-i+o,-r),a.lineTo(i-o,-r),a.quadraticCurveTo(i,-r,i,-r+o),a.lineTo(i,r-o),a.quadraticCurveTo(i,r,i-o,r),a.lineTo(-i+o,r),a.quadraticCurveTo(-i,r,-i,r-o),a.lineTo(-i,-r+o),a.quadraticCurveTo(-i,-r,-i+o,-r),a.closePath();const l=new ms(a,{depth:e,steps:1,bevelEnabled:!0,bevelSegments:2,bevelSize:.035,bevelThickness:.025,curveSegments:3});return l.rotateX(-Math.PI/2),l.computeVertexNormals(),l}function Tv(s,t){const e=new fs,n=s[0];e.moveTo(n[0],-n[1]);for(const[r,o]of s.slice(1))e.lineTo(r,-o);e.closePath();const i=new ms(e,{depth:t,steps:1,bevelEnabled:!0,bevelSegments:3,bevelSize:.16,bevelThickness:.16,curveSegments:3});return i.rotateX(-Math.PI/2),i}function Nr(s,t,e){const n=[];for(let i=0;i<s.length;i+=1){const r=(i+1)%s.length,o=s[i],a=s[r],l=t[i],c=t[r];n.push(o[0],e,o[1],a[0],e,a[1],c[0],e,c[1],o[0],e,o[1],c[0],e,c[1],l[0],e,l[1])}return new ae().setAttribute("position",new zt(n,3))}function Vl(s,t,e){const n=[],i=[],r=(...a)=>{for(const l of a)n.push(...l),i.push((l[0]+l[2])*.3,l[1]*.5+l[2]*.1)};if(e){const a=_e(e==="x"?[s[0],s[3]]:[s[0],s[1]]),l=_e(e==="x"?[s[1],s[2]]:[s[3],s[2]]),c=[a[0],t,a[1]],h=[l[0],t,l[1]];e==="x"?(r([s[0][0],0,s[0][1]],c,h,[s[0][0],0,s[0][1]],h,[s[1][0],0,s[1][1]]),r([s[3][0],0,s[3][1]],[s[2][0],0,s[2][1]],h,[s[3][0],0,s[3][1]],h,c),r([s[0][0],0,s[0][1]],[s[3][0],0,s[3][1]],c),r([s[1][0],0,s[1][1]],h,[s[2][0],0,s[2][1]])):(r([s[0][0],0,s[0][1]],[s[3][0],0,s[3][1]],h,[s[0][0],0,s[0][1]],h,c),r([s[1][0],0,s[1][1]],c,h,[s[1][0],0,s[1][1]],h,[s[2][0],0,s[2][1]]),r([s[0][0],0,s[0][1]],c,[s[1][0],0,s[1][1]]),r([s[3][0],0,s[3][1]],[s[2][0],0,s[2][1]],h))}else{const a=_e(s);for(let l=0;l<4;l+=1){const c=s[l],h=s[(l+1)%4];r([c[0],0,c[1]],[a[0],t,a[1]],[h[0],0,h[1]])}}const o=new ae;return o.setAttribute("position",new zt(n,3)),o.setAttribute("uv",new zt(i,2)),o.computeVertexNormals(),o}function Av(s,t,e){const i=[["west","north"],["north","east"],["east","south"],["south","west"]].map(([d,f])=>e[d]||e[f]?t:.045),r=_e(s),o=i.reduce((d,f)=>d+f,0)/i.length,a=[],l=[],c=(...d)=>{for(const f of d)a.push(...f),l.push((f[0]+f[2])*.3,f[1]*.55+f[2]*.1)};for(let d=0;d<s.length;d+=1){const f=(d+1)%s.length,g=s[d],v=s[f],m=i[d],p=i[f];c([g[0],m,g[1]],[r[0],o,r[1]],[v[0],p,v[1]]),c([g[0],-.08,g[1]],[v[0],-.08,v[1]],[v[0],p,v[1]],[g[0],-.08,g[1]],[v[0],p,v[1]],[g[0],m,g[1]])}const h=Math.min(...i)-.08;for(let d=1;d<s.length-1;d+=1){const f=s[0],g=s[d],v=s[d+1];c([f[0],h,f[1]],[v[0],h,v[1]],[g[0],h,g[1]])}const u=new ae;return u.setAttribute("position",new zt(a,3)),u.setAttribute("uv",new zt(l,2)),u.computeVertexNormals(),u}function Cv(s,t,e){let n=!1;for(let i=0,r=e.length-1;i<e.length;r=i,i+=1){const o=e[i],a=e[r];o[1]>t!=a[1]>t&&s<(a[0]-o[0])*(t-o[1])/(a[1]-o[1])+o[0]&&(n=!n)}return n}function Rn(s){s.traverse(t=>{const e=t;e.geometry&&e.geometry.dispose();const n=Array.isArray(e.material)?e.material:e.material?[e.material]:[];for(const i of n)i.dispose()})}function Rv(s,t){const e=new qe({uniforms:{reflectionMap:{value:s},viewportWidth:{value:1},texelSize:{value:new mt(1/t,1/t)},time:{value:0},viewportHeight:{value:1},fadeNear:{value:.44},fadeFar:{value:.35}},vertexShader:`
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D reflectionMap;
      uniform vec2 texelSize;
      uniform float time;
      uniform float viewportHeight;
      uniform float viewportWidth;
      uniform float fadeNear;
      uniform float fadeFar;

      void main() {
        vec2 screenUv = gl_FragCoord.xy / vec2(
          max(viewportWidth, 1.0),
          max(viewportHeight, 1.0)
        );
        vec2 projectedUv = vec2(screenUv.x, fadeNear * 2.0 - screenUv.y);
        if (
          projectedUv.x <= 0.0 || projectedUv.x >= 1.0
          || projectedUv.y <= 0.0 || projectedUv.y >= 1.0
        ) discard;

        float lateralRipple =
          sin(gl_FragCoord.y * 0.095 + time * 1.0) * 0.28
          + sin(gl_FragCoord.y * 0.041 - gl_FragCoord.x * 0.014 - time * 0.72) * 0.12;
        float verticalRipple =
          sin(gl_FragCoord.x * 0.068 + time * 0.64) * 0.22
          + sin((gl_FragCoord.x + gl_FragCoord.y) * 0.023 - time * 0.48) * 0.1;
        vec2 uv = projectedUv + texelSize * vec2(
          lateralRipple * 4.2 + sin(gl_FragCoord.y * 0.034 - time * 0.7) * 1.1,
          verticalRipple * 0.65
        );
        vec2 blurX = vec2(texelSize.x * 2.8, 0.0);
        vec2 blurFarX = vec2(texelSize.x * 6.0, 0.0);
        vec2 blurY = vec2(0.0, texelSize.y * 1.2);
        vec2 blurDiagonal = vec2(texelSize.x * 3.6, texelSize.y * 0.8);
        vec4 reflected =
          texture2D(reflectionMap, uv) * 0.38
          + texture2D(reflectionMap, uv + blurX) * 0.13
          + texture2D(reflectionMap, uv - blurX) * 0.13
          + texture2D(reflectionMap, uv + blurFarX) * 0.07
          + texture2D(reflectionMap, uv - blurFarX) * 0.07
          + texture2D(reflectionMap, uv + blurY) * 0.08
          + texture2D(reflectionMap, uv - blurY) * 0.08
          + texture2D(reflectionMap, uv + blurDiagonal) * 0.03
          + texture2D(reflectionMap, uv - blurDiagonal) * 0.03;
        float rippleBand = 0.92 + 0.08 * smoothstep(
          -0.38,
          0.48,
          sin(gl_FragCoord.y * 0.21 + gl_FragCoord.x * 0.018 - time * 1.8)
        );
        float fineBand = 0.96 + 0.04 * smoothstep(
          -0.42,
          0.48,
          sin(gl_FragCoord.y * 0.37 - gl_FragCoord.x * 0.025 + time * 2.3)
        );
        float screenY = gl_FragCoord.y / max(viewportHeight, 1.0);
        float screenFade = pow(smoothstep(fadeFar, fadeNear, screenY), 0.68)
          * (1.0 - smoothstep(fadeNear - 0.004, fadeNear + 0.008, screenY));
        float contact = smoothstep(fadeNear - 0.025, fadeNear + 0.015, screenY);
        float alpha = reflected.a * 0.54 * (0.82 + contact * 0.18) * rippleBand * fineBand * screenFade;
        if (alpha < 0.012) discard;
        vec3 sourceColor = reflected.rgb / max(reflected.a, 0.001);
        vec3 reflectedColor = mix(sourceColor, vec3(0.34, 0.64, 0.66), 0.1);
        reflectedColor *= mix(1.08, 1.14, contact);
        gl_FragColor = vec4(reflectedColor, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,transparent:!0,depthWrite:!1,depthTest:!0,side:xe});return e.toneMapped=!0,e}function Pv(){const s=[],t=new Set,e=(r,o)=>{s.push(r[0],0,r[1],o[0],0,o[1])},n=(r,o,a,l)=>{const c=`${r},${o}`,h=`${a},${l}`,u=c<h?`${c}:${h}`:`${h}:${c}`;t.has(u)||(t.add(u),e(es(r,o),es(a,l)))};for(let r=-Ge;r<=Ge;r+=1)for(let o=-Ge;o<=Ge;o+=1){if(o*o+r*r>Ge*Ge)continue;const a=o*2-1,l=o*2+1,c=r*2-1,h=r*2+1;n(a,c,l,c),n(l,c,l,h),n(l,h,a,h),n(a,h,a,c);const u=_e(un(o,r,!1)),d=se*.07,f=($t(o,r,1709)-.5)*.32,g=Math.cos(f)*d,v=Math.sin(f)*d,m=-v,p=g;e([u[0]-g,u[1]-v],[u[0]+g,u[1]+v]),e([u[0]-m,u[1]-p],[u[0]+m,u[1]+p])}const i=new ae;return i.setAttribute("position",new zt(s,3)),i.computeBoundingSphere(),i}class Dv{scene=new Td;renderer;camera=new so(-10,10,10,-10,.1,600);composer;ssaoPass;outputPass;canvas;raycaster=new yf;pointer=new mt;skyGradientTexture=mv();noiseTexture=gv();foamTexture=vv();townRoot=new Oe;islandFoundationRoot=new Oe;hoverRoot=new Oe;ambientWaterRoot=new Oe;constructionEffectsRoot=new Oe;hoverSignature=null;pickTargets=[];cellGroups=new Map;cellLevels=new Map;cellKinds=new Map;cellSignatures=new Map;activeRevealGroups=new Set;activeRipples=new Set;activeSplashDrops=new Set;activeWaterEffects=new Set;swayingTrees=new Set;waterMaterial;waterGeometry=new Ci(1e3,1e3,96,96);waterNormals=_v(256);water;reflectionRenderTarget;reflectionFadePoint=new I;reflectionClearColor=new Xt;reflectionOverlayMaterial;reflectionOverlay;birds=new Oe;perchAnchors=[];gridGeometry=Pv();gridMaterial=new Tn({color:Pe(Gl,-.24),transparent:!0,opacity:.26,depthTest:!0,depthWrite:!1,toneMapped:!1});grid=new si(this.gridGeometry,this.gridMaterial);azimuth=.1;elevation=.64;viewZoom=1;fittedBounds=null;fittedZoom=1;fittingTown=!1;viewportWidth=0;viewportHeight=0;target=new I(0,1.5,0);pointerStart=new mt;pointerLast=new mt;pointerMoved=!1;pointerActive=!1;panGesture=!1;pointerButton=0;shiftPressed=!1;activePointers=0;reducedMotion=!1;postProcessingEnabled=!0;reflectionDirty=!0;constructor(t){this.canvas=t,this.reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches,this.renderer=new sv({canvas:t,antialias:!0,alpha:!1,preserveDrawingBuffer:!0}),this.renderer.localClippingEnabled=!0,this.renderer.setClearColor(ne.skyHorizon,1),this.renderer.outputColorSpace=Qe,this.renderer.toneMapping=Ja,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=eh,this.scene.background=this.skyGradientTexture,this.scene.fog=new Xr(ne.fog,.0032);const e=new mf(16774365,5930880,.31);this.scene.add(e);const n=new _f(16771272,4.7);n.position.set(-11,18,9),n.castShadow=!0,n.shadow.mapSize.set(1536,1536),n.shadow.camera.left=n.shadow.camera.bottom=-22,n.shadow.camera.right=n.shadow.camera.top=22,n.shadow.bias=-7e-4,n.shadow.intensity=.92,n.shadow.radius=2,this.scene.add(n);const i=Math.min(window.innerWidth,window.innerHeight)<700?256:512,r=Math.min(window.innerWidth,window.innerHeight)<700?256:1024;this.reflectionRenderTarget=new yn(r,r,{depthBuffer:!0}),this.reflectionRenderTarget.texture.minFilter=en,this.reflectionRenderTarget.texture.magFilter=en,this.reflectionRenderTarget.texture.generateMipmaps=!1,this.reflectionOverlayMaterial=Rv(this.reflectionRenderTarget.texture,r),this.reflectionOverlay=new J(this.waterGeometry,this.reflectionOverlayMaterial),this.reflectionOverlay.rotation.x=-Math.PI/2,this.reflectionOverlay.position.y=te+.004,this.reflectionOverlay.renderOrder=3,this.reflectionOverlay.frustumCulled=!1,this.water=new rv(this.waterGeometry,{textureWidth:i,textureHeight:i,clipBias:.001,waterNormals:this.waterNormals,sunDirection:n.position.clone().normalize(),sunColor:16770244,waterColor:Gl,distortionScale:1.28,alpha:rn.waterOpacity,fog:!!this.scene.fog});const o=this.water;this.waterMaterial=o.material,this.waterMaterial.toneMapped=!0,this.waterMaterial.uniforms.size.value=18,this.waterMaterial.uniforms.harborViewportHeight={value:Math.max(1,this.canvas.height)},this.waterMaterial.fragmentShader=`uniform float harborViewportHeight;
${this.waterMaterial.fragmentShader}`.replace("float rf0 = 0.3;","float rf0 = 0.07;").replace("reflectionSample * 0.9","reflectionSample * 0.0").replace("vec3 outgoingLight = albedo;",`vec2 harborPoint = worldPosition.xz;
        float harborBandA = sin(dot(harborPoint, vec2(0.34, 0.12)) - time * 0.31);
        float harborBandB = sin(dot(harborPoint, vec2(-0.13, 0.29)) + time * 0.23 + 1.4);
        float harborBandC = sin(dot(harborPoint, vec2(0.17, 0.23)) - time * 0.18 + 3.1);
        float harborLongWave = harborBandA * 0.19 + harborBandB * 0.12 + harborBandC * 0.075;
        float harborFineA = sin(dot(harborPoint, vec2(1.7, -0.82)) - time * 0.58);
        float harborFineB = sin(dot(harborPoint, vec2(-1.15, 1.48)) + time * 0.46 + 2.2);
        float harborFine = (harborFineA + harborFineB) * 0.024;
        float harborCrest = smoothstep(0.205, 0.33, harborLongWave) * 0.72;
        float harborScreenDepth = 1.0 - clamp(gl_FragCoord.y / harborViewportHeight, 0.0, 1.0);
        float harborUpper = smoothstep(0.08, 0.32, harborScreenDepth);
        float harborLower = smoothstep(0.64, 0.98, harborScreenDepth);
        vec3 harborTint = mix(vec3(1.18, 1.25, 1.3), vec3(0.84, 1.06, 1.12), harborUpper);
        harborTint = mix(harborTint, vec3(0.69, 1.0, 1.05), harborLower);
        vec3 outgoingLight = (
          albedo
          + vec3(0.2, 0.4, 0.45) * (harborLongWave + harborFine) * 0.16
          + vec3(0.31, 0.43, 0.45) * harborCrest * 0.085
        ) * harborTint;`),o.onBeforeRender=(a,l,c)=>{this.waterMaterial.uniforms.eye.value.setFromMatrixPosition(c.matrixWorld)},o.renderOrder=2,this.waterMaterial.transparent=!0,this.waterMaterial.depthWrite=!1,o.rotation.x=-Math.PI/2,o.position.y=te,o.receiveShadow=!1,o.userData.cellPick={id:"water",x:0,z:0,level:0,kind:"water"},this.scene.add(o,this.reflectionOverlay),this.reflectionOverlay.visible=!0,this.pickTargets.push(o),this.grid.position.y=te+.012,this.grid.renderOrder=4,this.grid.visible=!1,this.scene.add(this.grid),this.scene.add(this.islandFoundationRoot,this.townRoot,this.hoverRoot,this.ambientWaterRoot,this.constructionEffectsRoot,this.birds),this.createBirds(),this.composer=new uv(this.renderer),this.composer.addPass(new fv(this.scene,this.camera)),this.ssaoPass=new ai(this.scene,this.camera,512,512,16),this.ssaoPass.ssaoMaterial.defines.PERSPECTIVE_CAMERA=0,this.ssaoPass.ssaoMaterial.needsUpdate=!0,this.ssaoPass.depthRenderMaterial.defines.PERSPECTIVE_CAMERA=0,this.ssaoPass.depthRenderMaterial.needsUpdate=!0,this.ssaoPass.kernelRadius=.52,this.ssaoPass.minDistance=.001,this.ssaoPass.maxDistance=.042,this.composer.addPass(this.ssaoPass),this.outputPass=new dv,this.composer.addPass(this.outputPass),this.canvas.addEventListener("pointerdown",this.notePointerDown,!0),this.canvas.addEventListener("pointerup",this.notePointerUp,!0),this.canvas.addEventListener("pointercancel",this.notePointerUp,!0),this.canvas.addEventListener("contextmenu",this.preventContextMenu),this.resize(),this.updateCamera()}notePointerDown=t=>{this.pointerButton=t.button,this.shiftPressed=t.shiftKey,this.activePointers+=1};notePointerUp=()=>{this.activePointers=Math.max(0,this.activePointers-1)};preventContextMenu=t=>t.preventDefault();sync(t,e=!0){this.reflectionDirty=!0;const n=new Map(t.cells.map(c=>[c.id,c])),i=new Map(t.features.map(c=>[c.id,c])),r=new Map;for(const c of t.cells)c.foundation&&r.set(c.id,i.get(c.id)??{id:c.id,kind:"foundation",level:0,color:c.color,storeys:c.storeys,neighbors:{},exposed:{north:!0,east:!0,south:!0,west:!0}});for(const c of t.features)r.set(c.id,c);const o=xv(r);this.cellLevels.clear(),this.cellKinds.clear();const a=new Map;for(const[c,h]of r){const u=n.get(c),d=re.map(f=>{const g=h.neighbors[f];return Mv(g,g?r.get(g):void 0,g?n.get(g):void 0)}).join("|");a.set(c,[h.kind,h.level,h.color,Number(u?.foundation??!0),u?.storeys.map(f=>`${f.level}:${f.color}`).join(",")??"",re.map(f=>Number(h.exposed[f])).join(""),h.bridgeSpan?.join("-")??"",d,Number(o.has(c))].join(";")),this.cellLevels.set(c,h.level),this.cellKinds.set(c,h.kind)}this.hoverSignature=null;const l=new Set(this.cellSignatures.keys());for(const[c,h]of this.cellGroups)(!r.has(c)||this.cellSignatures.get(c)!==a.get(c))&&(this.disposeCellGroup(h),this.cellGroups.delete(c),this.cellSignatures.delete(c));for(const[c,h]of r){if(this.cellGroups.has(c))continue;const u=n.get(c);if(!u)continue;const d=!l.has(c),f=new Oe;f.position.set(u.x*se,0,u.z*se);const g=$t(u.x,u.z)*.18;f.userData.reveal=e&&d&&!this.reducedMotion?performance.now()/1e3+g:0,f.scale.y=f.userData.reveal?.001:1,this.townRoot.add(f),f.userData.reveal&&this.activeRevealGroups.add(f);const v=Object.fromEntries(re.map(M=>{const x=h.neighbors[M],_=x?n.get(x):void 0;return[M,_?.foundation!==!0]})),m=u.storeys[0]?.level,p=m!==void 0&&(!u.foundation||m>1);if((u.foundation||p)&&this.addWaterContact(f,u.x,u.z,v,e&&d&&!this.reducedMotion),h.kind==="bridge"&&u.foundation&&u.storeys.length===0)this.addBridge(f,u,h);else{const M=Object.values(h.neighbors).some(_=>r.get(_)?.kind==="bridge"),x=h.kind==="house"&&o.has(c);if(u.foundation&&this.addFoundation(f,u,h,M,!x),p?this.addTimberSupport(f,u.x,u.z,u.storeys[0].color,v,Kt+(u.storeys[0].level-1)*de):x&&this.addTimberSupport(f,u.x,u.z,h.color,v,Kt),h.kind==="house")for(const _ of u.storeys){const y=_.level-1,E=Object.fromEntries(re.map(C=>{const P=h.neighbors[C],U=P?n.get(P):void 0;return[C,U?.storeys.some(z=>z.level===_.level)??!1]})),T=Object.fromEntries(re.map(C=>{const P=h.neighbors[C],U=P?n.get(P):void 0;return[C,yv(U,_.level)]})),A=Object.fromEntries(re.map(C=>{const P=h.neighbors[C],U=P?n.get(P):void 0;return[C,!U?.storeys.some(z=>z.level===_.level)]})),w=h.level*53+y*43,S=re.map((C,P)=>$t(u.x*37+P*11,u.z*41-P*13,w+P*17));this.addLevel(f,c,u.x,u.z,y,_.color,A,!u.storeys.some(C=>C.level===_.level+1),E,T,S)}else h.kind==="courtyard"&&this.addCourtyard(f,u,h,M)}this.cellGroups.set(c,f),this.cellSignatures.set(c,a.get(c))}this.updateIslandFoundation(t,o),this.updateAmbientWater(t),this.updateBirdPerches(r,n),this.pickTargets.splice(1);for(const c of this.cellGroups.values())c.traverse(h=>{h.userData.cellPick&&this.pickTargets.push(h)});!e&&r.size>0&&this.fitTownToView(t)}disposeCellGroup(t){this.activeRevealGroups.delete(t);for(const e of this.activeRipples)e.parent===t&&this.activeRipples.delete(e);t.traverse(e=>{this.activeWaterEffects.delete(e),e.userData.windPhase!==void 0&&this.swayingTrees.delete(e)}),Rn(t),t.removeFromParent()}addFoundation(t,e,n,i,r){const{id:o,x:a,z:l}=e,c=n.exposed,h=$t(a,l,91),u=We(un(a,l),-.38),d=new J(yi(un(a,l),.18,void 0,.08),new le({transparent:!0,opacity:0,depthWrite:!1}));d.position.y=Kt-.16,d.userData.cellPick={id:o,x:a,z:l,level:0,kind:n.kind},t.add(d);const f=re.filter(g=>c[g]).length;if(r&&!i&&f>=2&&h>.42){const g=u.find((v,m)=>c[re[m]]||c[re[(m+3)%re.length]]);g&&this.addTree(t,g[0]*1.05,g[1]*1.05,h)}}addBridge(t,e,n){const{id:i,x:r,z:o}=e,a=n.bridgeSpan??["north","south"],l=a.includes("east")||a.includes("west"),c=se*1.12,h=se*.56,u=new wt({color:Pe(ne.foundationShadow,.08),roughness:rn.stoneRoughness,map:this.noiseTexture,bumpMap:this.noiseTexture,bumpScale:.02}),d=new J(bv(l?c:h,l?h:c,De.bridgeDeckThickness,$t(r,o,401)),u);d.position.y=Kt+De.bridgeClearance,d.castShadow=d.receiveShadow=!0,d.userData.cellPick={id:i,x:r,z:o,level:n.level,kind:"bridge"},t.add(d);const f=d.position.y+De.bridgeDeckThickness,g=new J(new Ut(l?c*.96:h*.84,.035,l?h*.84:c*.96),new wt({color:12685155,roughness:.88,map:this.noiseTexture}));g.position.y=f+.018,g.receiveShadow=!0,t.add(g);const v=new le({color:6638909,transparent:!0,opacity:.58});for(const y of[-.4,-.3,-.2,-.1,0,.1,.2,.3,.4]){const E=new J(new Ut(l?.018:h*.72,.008,l?h*.72:.018),v);E.position.set(l?y*c:0,f+.039,l?0:y*c),t.add(E)}const m=Math.max(.28,d.position.y-te+.015),p=new wt({color:Pe(ne.foundationShadow,.12),roughness:rn.stoneRoughness,map:this.noiseTexture});for(const y of[-.44,.44]){const E=new J(new Ut(l?.18:h*.72,m,l?h*.72:.18),p);E.position.set(l?y*c:0,te+m*.5,l?0:y*c),E.castShadow=E.receiveShadow=!0,t.add(E)}const M=new wt({color:ne.ink,roughness:.82}),x=h*.46,_=De.bridgeRailHeight;for(const y of[-1,1]){const E=l?new I(-c*.46,f+_*.75,y*x):new I(y*x,f+_*.75,-c*.46),T=l?new I(0,f+_*1.65,y*x):new I(y*x,f+_*1.65,0),A=l?new I(c*.46,f+_*.75,y*x):new I(y*x,f+_*.75,c*.46),w=new J(new Jr(new mc(E,T,A),16,.034,6,!1),M);w.castShadow=!0,t.add(w);for(const S of[-.44,-.22,0,.22,.44]){const C=S/.44,P=_*(1.2-C*C*.45),U=new J(new Ut(.048,P,.048),M);U.position.set(l?S*c:y*x,f+P*.5,l?y*x:S*c),U.castShadow=!0,t.add(U)}}}addCourtyard(t,e,n,i){const r=We(un(e.x,e.z),De.courtyardInset),o=new J(yi(r,.08,void 0,.025),new wt({color:ne.vegetation,roughness:1,map:this.noiseTexture}));o.position.y=Kt+.015,o.receiveShadow=!0,o.userData.cellPick={id:e.id,x:e.x,z:e.z,level:n.level,kind:"courtyard"},t.add(o);const a=$t(e.x,e.z,719),l=new J(new Ut(se*.75,.035,.2),new wt({color:12037522,roughness:rn.stoneRoughness}));if(l.position.y=Kt+.11,l.rotation.y=a>.5?0:Math.PI/2,l.receiveShadow=!0,t.add(l),i)return;if(a<=.65){this.addTree(t,(a-.5)*.65,($t(e.z,e.x,727)-.5)*.65,a),this.addGreenery(t,Kt+.18,$t(e.x,e.z,733));return}const c=Ae[n.color%Ae.length]??Ae[0],h=a>.5,u=new wt({color:c.trim,roughness:rn.trimRoughness}),d=new J(new Ut(h?se*.72:se*.62,.09,h?se*.62:se*.72),new wt({color:c.roof,roughness:rn.roofRoughness,map:this.noiseTexture}));d.position.y=Kt+.68,d.castShadow=!0,t.add(d);for(const g of[-1,1])for(const v of[-1,1]){const m=new J(new Ut(.085,.55,.085),u);m.position.set(h?g*se*.27:v*se*.27,Kt+.36,h?v*se*.27:g*se*.27),m.castShadow=!0,t.add(m)}const f=new wt({color:4936009,roughness:.86});re.forEach((g,v)=>{if(!n.exposed[g])return;const m=r[v],p=r[(v+1)%4],M=p[0]-m[0],x=p[1]-m[1],_=Math.hypot(M,x),y=x/_,E=-M/_,T=new J(new Ut(_*.84,.045,.045),f);T.position.set((m[0]+p[0])*.5+y*.08,Kt+.58,(m[1]+p[1])*.5+E*.08),T.rotation.y=-Math.atan2(x,M),T.castShadow=!0,t.add(T);for(const A of[-.31,0,.31]){const w=new J(new Ut(.045,.42,.045),f);w.position.set((m[0]+p[0])*.5+M/_*A+y*.08,Kt+.38,(m[1]+p[1])*.5+x/_*A+E*.08),w.castShadow=!0,t.add(w)}}),this.addTree(t,(a-.5)*.65,($t(e.z,e.x,727)-.5)*.65,a),this.addGreenery(t,Kt+.18,$t(e.x,e.z,733))}addTree(t,e,n,i){const r=Math.round(i*1e5),o=$t(r,683,0),a=i>.78&&o<.25?3:Math.floor(o*4),l=new Oe;l.position.set(e,Kt+.04,n),l.rotation.y=(i-.5)*.18,l.userData.windPhase=i*Math.PI*2,l.userData.windStrength=(a===1?.014:a===2?.03:.023)+$t(r,701,0)*.012;const c=a===1?1+$t(r,709,0)*.12:a===2?1.05+$t(r,709,0)*.13:a===3?.56+$t(r,709,0)*.09:.6+$t(r,709,0)*.14,h=a===2?.042:a===1?.055:.05+i*.009,u=a===2?.065:a===1?.085:.075+i*.012,d=new wt({color:Pe(6837061,(i-.5)*.08),roughness:.97}),f=a===2?new wt({color:we(Ae[14].wall,-.08,-.08),roughness:.96}):d,g=new J(new Ie(h,u,c,6),f);if(g.position.y=c*.5,g.castShadow=!0,l.add(g),a===2){const v=new Ie(h*1.08,h*1.12,.035,6);for(const m of[.34,.58,.78]){const p=new J(v,d);p.position.y=c*m,p.rotation.z=(m-.5)*.08,l.add(p)}}if(a!==1){const v=new Ie(.018,.035,1,5),m=a===3?3:2+Math.floor($t(r,719,0)*2);for(let p=0;p<m;p+=1){const M=$t(r,p*37,727),x=i*Math.PI*2+p*2.4+M*.5,_=a===3?.25+M*.1:a===2?.11+M*.055:.18+M*.09,y=new I(Math.cos(x)*_,(a===2?.13:.1)+M*.07,Math.sin(x)*_),E=new J(v,d),T=a===3?.47:a===2?.58:.55,A=a===3?.07:.09;E.position.set(0,c*(T+p*A),0),E.position.addScaledVector(y,.5),E.scale.y=y.length(),E.quaternion.setFromUnitVectors(Zo,y.normalize()),E.castShadow=!0,l.add(E)}}if(a===1){const v=new Ns(.36,.52,7),m=[new wt({color:we(ne.vegetation,.055,-.12),roughness:.99}),new wt({color:we(ne.vegetation,.075,-.055),roughness:.99})];for(const[p,M]of[1,.78,.56].entries()){const x=new J(v,m[(p+(i>.5?1:0))%m.length]);x.position.y=c*(.4+p*.24),x.scale.set(M,1-p*.055,M*.92),x.rotation.y=i*Math.PI+p*.47,x.castShadow=!0,l.add(x)}}else{const v=new Ei(a===2?.2:a===3?.24:.29,0),m=a===2?[new wt({color:we(ne.vegetation,-.01,.075),roughness:.98}),new wt({color:we(ne.vegetation,.035,.025),roughness:.98})]:a===3?[new wt({color:we(Ae[10].wall,.03,.12),roughness:.96}),new wt({color:we(Ae[12].trim,-.055,-.025),roughness:.96}),new wt({color:we(ne.vegetation,.025,.025),roughness:.98})]:[new wt({color:we(ne.vegetation,.035,i*.055-.025),roughness:.98}),new wt({color:we(ne.vegetation,.065,i*.035+.025),roughness:.98})],p=a===2?3:a===3?5:2+Math.floor($t(r,739,0)*3);for(let M=0;M<p;M+=1){const x=$t(r,M*43,743),_=M===0,y=i*Math.PI*2+M*2.32+x*.42,E=new J(v,m[(M+(i>.5?1:0))%m.length]);if(a===2){const T=M===1?-1:M===2?1:0;E.position.set(T*(.065+x*.025),c*.58+M*.2,Math.sin(y)*.055),E.scale.set(.72+x*.12,1.28+x*.18,.62+x*.12)}else if(a===3){const T=_?.035:.2+x*.095;E.position.set(Math.cos(y)*T,c*.78+.22+x*.09,Math.sin(y)*T),E.scale.set(1.08+x*.2,.84+x*.15,.96+x*.18)}else{const T=_?.018:.1+x*.09;E.position.set(Math.cos(y)*T,c*.72+(_?.25:.08+x*.18),Math.sin(y)*T);const A=_?1.02+x*.18:.68+x*.2;E.scale.set(A,(_?1.18:.78)+x*.22,A*(.82+$t(r,M*47,751)*.18))}E.rotation.set(x*.18,y*.17,x*.12),E.castShadow=!0,l.add(E)}}this.swayingTrees.add(l),t.add(l)}updateIslandFoundation(t,e){for(const d of[...this.islandFoundationRoot.children])d.traverse(f=>this.activeWaterEffects.delete(f)),this.islandFoundationRoot.remove(d),Rn(d);const n=new Set(t.features.filter(d=>d.kind==="bridge").map(d=>d.id)),i=t.cells.filter(d=>n.has(d.id)),r=t.cells.filter(d=>d.foundation&&!n.has(d.id)&&!e.has(d.id));if(r.length===0)return;const o=new Map(r.map(d=>[`${d.x},${d.z}`,d])),a=new Set(o.keys()),l=[[0,-1],[1,0],[0,1],[-1,0]],c=([d,f])=>`${d.toFixed(5)},${f.toFixed(5)}`,h=te-.14;let u=!1;for(;a.size>0;){const d=a.values().next().value,f=o.get(d);if(!f){a.delete(d);continue}const g=[],v=[f];for(a.delete(d);v.length>0;){const M=v.shift();g.push(M);for(const[x,_]of l){const y=`${M.x+x},${M.z+_}`,E=o.get(y);E&&a.delete(y)&&v.push(E)}}const m=[];for(const M of g){const x=un(M.x,M.z,!1);l.forEach(([_,y],E)=>{o.has(`${M.x+_},${M.z+y}`)||m.push({a:x[E],b:x[(E+1)%x.length]})})}const p=[...m];for(;p.length>=3;){const M=p.pop(),x=[M.a,M.b];let _=M.b,y=!1;for(let Q=0;Q<m.length+2;Q+=1){const ot=c(_),At=c(x[0]);if(ot===At){y=!0;break}const qt=p.findIndex(rt=>c(rt.a)===ot);if(qt<0)break;_=p.splice(qt,1)[0].b,x.push(_)}if(!y||x.length<4)continue;x.pop();const T=g.some(Q=>l.some(([ot,At])=>e.has(`${Q.x+ot},${Q.z+At}`)))?.04:De.shorelineOverhang+.18,A=We(Sv(x),-T),w=Kt-h,S=Tv(A,w),C=S.getAttribute("position"),P=new Float32Array(C.count*3),U=new Xt(ne.foundationShadow).lerp(new Xt(ne.foundation),.42),z=Pe(ne.foundation,.1),F=new Xt;for(let Q=0;Q<C.count;Q+=1){const ot=me.clamp(C.getY(Q)/w,0,1),At=ot*ot*(3-2*ot);F.copy(U).lerp(z,At),F.toArray(P,Q*3)}S.setAttribute("color",new Mn(P,3));const H=new wt({color:16777215,vertexColors:!0,roughness:rn.stoneRoughness,map:this.noiseTexture,bumpMap:this.noiseTexture,bumpScale:.022}),q=new J(S,H);q.position.y=h,q.castShadow=!0,q.receiveShadow=!0,q.renderOrder=1,this.islandFoundationRoot.add(q),this.addFoundationMasonry(A,h,w);const O=new J(Nr(We(A,-.05),A,te+.042),new le({color:1525835,transparent:!0,opacity:.38,depthWrite:!1}));O.renderOrder=6,this.islandFoundationRoot.add(O);const W=new J(Nr(We(A,-.12),We(A,-.07),te+.047),new le({color:ne.foam,transparent:!0,opacity:.28,depthWrite:!1}));W.renderOrder=7,W.userData.waterEffect="outlineCrest",W.userData.waterPhase=$t(Math.round(A[0][0]*10),Math.round(A[0][1]*10),17),W.userData.waterOpacity=.28,this.activeWaterEffects.add(W),this.islandFoundationRoot.add(W);const tt=_e(A),et=new wt({color:14209205,roughness:.88}),ct=new wt({color:Pe(ne.foundationShadow,-.05),roughness:.96,map:this.noiseTexture});A.forEach((Q,ot)=>{const At=A[(ot+1)%A.length],qt=At[0]-Q[0],L=At[1]-Q[1],rt=Math.hypot(qt,L);if(rt<.12)return;const st=(Q[0]+At[0])*.5,nt=(Q[1]+At[1])*.5,it=st-tt[0],dt=nt-tt[1],lt=Math.max(.001,Math.hypot(it,dt)),gt=it/lt,Ht=dt/lt,Bt=-Math.atan2(L,qt),D=new J(new Ut(rt+.08,.085,.18),et);if(D.position.set(st+gt*.025,Kt-.018,nt+Ht*.025),D.rotation.y=Bt,D.castShadow=D.receiveShadow=!0,this.islandFoundationRoot.add(D),ot%4!==0)return;const b=w*.68,G=new J(new Ut(Math.min(.26,rt*.74),b,.2),ct);G.position.set(st+gt*.055,h+b*.48,nt+Ht*.055),G.rotation.y=Bt,G.castShadow=G.receiveShadow=!0,this.islandFoundationRoot.add(G)});const _t=new wt({color:ne.foundationShadow,roughness:.96}),bt=new J(wv(We(A,-.12),.16,.08,.12),_t);bt.position.y=te-.18,bt.receiveShadow=!0,this.islandFoundationRoot.add(bt);const yt=new J(Ev(We(A,-.018),.13),new wt({color:5206125,roughness:.98,transparent:!0,opacity:.62,depthWrite:!1,side:xe}));yt.position.y=te-.06,yt.renderOrder=3,this.islandFoundationRoot.add(yt);for(const Q of[.28,.55,.78]){const ot=h+(Kt-h)*Q,At=new ae().setFromPoints(A.map(([L,rt])=>new I(L,ot,rt))),qt=new al(At,new Tn({color:5401969,transparent:!0,opacity:.26}));qt.renderOrder=3,this.islandFoundationRoot.add(qt)}const Y=new J(Nr(A,We(A,.075),te+.028),new le({color:3234656,transparent:!0,opacity:.38,depthWrite:!1,side:xe}));Y.renderOrder=4,this.islandFoundationRoot.add(Y);const K=new ae().setFromPoints(A.map(([Q,ot])=>new I(Q,Kt+.018,ot))),ut=new al(K,new Tn({color:15002331,transparent:!0,opacity:.72}));ut.renderOrder=5,this.islandFoundationRoot.add(ut),this.addPromenade(A,i,n.size===0&&!u),this.addFoundationOpenings(A),!u&&n.size===0&&(this.addIslandDock(A),u=!0)}}}addFoundationMasonry(t,e,n){const i=_e(t),r=[],o=3;if(t.forEach((c,h)=>{const u=t[(h+1)%t.length],d=u[0]-c[0],f=u[1]-c[1],g=Math.hypot(d,f);if(g<.12)return;const v=d/g,m=f/g,p=(c[0]+u[0])*.5,M=(c[1]+u[1])*.5,x=p-i[0],_=M-i[1],y=Math.max(.001,Math.hypot(x,_)),E=x/y,T=_/y,A=Math.max(1,Math.ceil(g/.42)),w=g/A,S=n/o;for(let C=0;C<o;C+=1)for(let P=0;P<A;P+=1){const U=-g*.5+(P+.5)*w,z=$t(h*37+P,C*53,A);r.push({x:p+v*U+E*.035,y:e+(C+.5)*S,z:M+m*U+T*.035,rotation:-Math.atan2(f,d),width:Math.max(.08,w-.045),height:Math.max(.08,S-.04),color:Pe(ne.foundation,(z-.5)*.18-C*.014)})}}),r.length===0)return;const a=new No(new Ut(1,1,1),new wt({color:16777215,roughness:.96,map:this.noiseTexture}),r.length),l=new Ue;r.forEach((c,h)=>{l.position.set(c.x,c.y,c.z),l.rotation.set(0,c.rotation,0),l.scale.set(c.width,c.height,.06),l.updateMatrix(),a.setMatrixAt(h,l.matrix),a.setColorAt(h,c.color)}),a.instanceMatrix.needsUpdate=!0,a.instanceColor&&(a.instanceColor.needsUpdate=!0),a.castShadow=a.receiveShadow=!0,this.islandFoundationRoot.add(a)}addPromenade(t,e,n){if(t.length<3)return;const i=_e(t),r=new J(Nr(t,We(t,.16),Kt+.024),new wt({color:8416088,roughness:.9,map:this.noiseTexture,side:xe}));r.receiveShadow=!0,this.islandFoundationRoot.add(r);let o=-1;if(n){let u=-1/0;t.forEach((d,f)=>{const g=t[(f+1)%t.length],v=(d[0]+g[0])*.5,m=(d[1]+g[1])*.5,p=v-i[0],M=m-i[1],x=(p+M)/Math.max(.001,Math.hypot(p,M));x>u&&(u=x,o=f)})}const a=e.map(u=>_e(un(u.x,u.z,!1))),l=[new wt({color:5401701,roughness:.84}),new wt({color:7373175,roughness:.86})],c=Math.floor($t(Math.round(i[0]*10),Math.round(i[1]*10),t.length+811)*t.length);let h=-1;for(let u=0;u<t.length;u+=1){const d=(c+u)%t.length,f=t[d],g=t[(d+1)%t.length],v=(f[0]+g[0])*.5,m=(f[1]+g[1])*.5,p=a.some(([x,_])=>Math.hypot(v-x,m-_)<se*.95),M=o<0?1/0:Math.min(Math.abs(d-o),t.length-Math.abs(d-o));if(!p&&M>1&&Math.hypot(g[0]-f[0],g[1]-f[1])>=.44){h=d;break}}t.forEach((u,d)=>{const f=t[(d+1)%t.length],g=(u[0]+f[0])*.5,v=(u[1]+f[1])*.5,m=a.some(([S,C])=>Math.hypot(g-S,v-C)<se*.95),p=o<0?1/0:Math.min(Math.abs(d-o),t.length-Math.abs(d-o));if(m||p<=1)return;const M=f[0]-u[0],x=f[1]-u[1],_=Math.hypot(M,x);if(_<.24)return;const y=(i[0]-g)*.035,E=(i[1]-v)*.035,T=-Math.atan2(x,M),A=Math.max(1,Math.ceil(_/.38)),w=_/A;for(let S=0;S<A;S+=1){const C=-_*.5+(S+.5)*w,P=new J(new Ut(w*.78,.055,.055),l[(d+S)%l.length]);P.position.set(g+y+M/_*C,Kt+.36,v+E+x/_*C),P.rotation.y=T,P.castShadow=!0,this.islandFoundationRoot.add(P);const U=P.clone();U.position.y=Kt+.22,U.scale.y=.8,this.islandFoundationRoot.add(U)}for(const S of[-.42,.42]){const C=new J(new Ut(.055,.34,.055),l[d%l.length]);C.position.set(g+y+M/_*_*S,Kt+.18,v+E+x/_*_*S),C.castShadow=!0,this.islandFoundationRoot.add(C);const P=new J(new Ut(.09,.065,.09),l[(d+1)%l.length]);P.position.set(C.position.x,Kt+.365,C.position.z),P.castShadow=!0,this.islandFoundationRoot.add(P)}if(d===h){const S=i[0]-g,C=i[1]-v,P=Math.max(.001,Math.hypot(S,C));this.addPromenadeAccent(g+S/P*.19,v+C/P*.19,T,$t(Math.round(g*10),Math.round(v*10),t.length*13+d))}})}addPromenadeAccent(t,e,n,i){const r=new Oe;r.position.set(t,Kt+.055,e),r.rotation.y=n;const o=Math.min(2,Math.floor(i*3));if(o===0){const a=new wt({color:Pe(9991507,i*.08-.04),roughness:.94}),l=new wt({color:4545624,roughness:.86}),c=new J(new Ut(.54,.065,.18),a);c.position.y=.18,c.castShadow=!0,r.add(c);const h=new J(new Ut(.54,.2,.05),a);h.position.set(0,.29,.075),h.rotation.x=-.08,h.castShadow=!0,r.add(h);for(const u of[-.2,.2]){const d=new J(new Ut(.045,.18,.06),l);d.position.set(u,.09,0),d.castShadow=!0,r.add(d)}}else if(o===1){const a=new dc(.12,0),l=[new wt({color:Pe(ne.foundation,-.04),roughness:1}),new wt({color:Pe(ne.foundation,.07),roughness:1})];for(let c=0;c<3;c+=1){const h=$t(Math.round(i*1e5),c*31,853),u=new J(a,l[c%l.length]);u.position.set((c-1)*.14,.065+h*.035,(h-.5)*.12),u.scale.set(.72+h*.4,.62+h*.5,.74+(1-h)*.3),u.rotation.set(h*.35,h*1.8,h*.22),u.castShadow=!0,r.add(u)}}else{const a=new J(new Ut(.46,.14,.2),new wt({color:Pe(10118473,i*.06-.03),roughness:.95}));a.castShadow=!0,r.add(a);const l=new J(new Ut(.4,.025,.16),new wt({color:5785916,roughness:1}));l.position.y=.08,r.add(l);const c=new Ie(.007,.01,.2,5),h=new wt({color:5601114,roughness:1}),u=new Ei(.045,0),d=[new wt({color:14252135,roughness:.92}),new wt({color:14859629,roughness:.92})];for(let f=0;f<5;f+=1){const g=$t(Math.round(i*1e5),f*29,859),v=new J(c,h);v.position.set((f-2)*.075,.17+g*.035,(g-.5)*.1),v.rotation.z=(f-2)*.035,r.add(v);const m=new J(u,d[f%d.length]);m.position.set(v.position.x,v.position.y+.11,v.position.z),m.scale.y=.72,m.castShadow=!0,r.add(m)}}this.islandFoundationRoot.add(r)}addFoundationOpenings(t){if(t.length<4)return;const e=_e(t),n=t.map((_,y)=>{const E=t[(y+1)%t.length],T=(_[0]+E[0])*.5,A=(_[1]+E[1])*.5,w=T-e[0],S=A-e[1],C=Math.max(.001,Math.hypot(w,S)),P=Math.hypot(E[0]-_[0],E[1]-_[1]);return{a:_,b:E,index:y,length:P,middleX:T,middleZ:A,outwardX:w/C,outwardZ:S/C,score:P+(-w+S)/C*.24}}).sort((_,y)=>y.score-_.score),i=[];for(const _ of n)if(!i.some(E=>{const T=Math.abs(E.index-_.index);return Math.min(T,t.length-T)<2})&&_.length>=.42&&i.push(_),i.length>=4)break;const r=Math.min(.5,Kt-te-.1),o=.13,a=new le({color:Pe(ne.ink,-.16),side:xe}),l=new wt({color:Pe(ne.foundationShadow,-.08),roughness:1,flatShading:!0,side:xe}),c=new wt({color:Pe(ne.foundation,.09),roughness:.9}),h=new Ie(.06,.088,1,10),u=new le({color:3990991,transparent:!0,opacity:1,depthWrite:!1}),d=new Ut(.19,1,.018),f=new le({color:741211,transparent:!0,opacity:.8,depthWrite:!1}),g=new Xn(.09,.21,32),v=new le({color:7667681,transparent:!0,opacity:.88,depthWrite:!1,side:xe}),m=new uc(.12,24),p=new le({color:10223593,transparent:!0,opacity:.5,depthWrite:!1,side:xe}),M=new qn(.025,7,5),x=new le({color:Pe(ne.foam,.03),transparent:!0,opacity:.72,depthWrite:!1});for(const _ of i){const y=Math.min(.58,_.length*.62),E=r*.54,T=new fs;T.moveTo(-y*.5,0),T.lineTo(y*.5,0),T.lineTo(y*.5,E),T.quadraticCurveTo(y*.5,r,0,r),T.quadraticCurveTo(-y*.5,r,-y*.5,E),T.closePath();const A=Math.min(.045,y*.1),w=y-A*2,S=E-A*.5,C=r-A,P=T.clone(),U=new ka;U.moveTo(-w*.5,A*.4),U.lineTo(-w*.5,S),U.quadraticCurveTo(-w*.5,C,0,C),U.quadraticCurveTo(w*.5,C,w*.5,S),U.lineTo(w*.5,A*.4),U.closePath(),P.holes.push(U);const z=new Oe;z.position.set(_.middleX+_.outwardX*.2,te-.018,_.middleZ+_.outwardZ*.2),z.rotation.y=-Math.atan2(_.b[1]-_.a[1],_.b[0]-_.a[0]);const F=new J(new $r(T,8),a);F.position.z=-o-.004,F.renderOrder=3,z.add(F);const H=new J(new ms(P,{depth:o,steps:1,bevelEnabled:!1,curveSegments:5}),l);H.position.z=-o,H.renderOrder=4,z.add(H);const q=new J(new Kr(y*.38,.035,6,18,Math.PI),c);q.position.y=E,q.renderOrder=5,z.add(q);for(const bt of[-y*.5,y*.5]){const yt=new J(new Ut(.055,E,.045),c);yt.position.set(bt,E*.5,.008),yt.renderOrder=5,z.add(yt)}const O=$t(Math.round(_.middleX*10),Math.round(_.middleZ*10),_.index+73),W=Math.max(.48,E*1.08),tt=Math.max(.46,W-.015),et=new J(d,f.clone());et.position.set(0,W-tt*.5,-o-.046),et.renderOrder=6,et.userData.waterEffect="drainStream",et.userData.waterPhase=O,et.userData.waterTop=W,et.userData.waterLength=tt,et.userData.waterOpacity=.8,this.activeWaterEffects.add(et),z.add(et);const ct=new J(h,u.clone());ct.position.set(0,W-tt*.5,-o-.055),ct.renderOrder=7,ct.userData.waterEffect="drainStream",ct.userData.waterPhase=O,ct.userData.waterTop=W,ct.userData.waterLength=tt,ct.userData.waterOpacity=1,this.activeWaterEffects.add(ct),z.add(ct);const _t=new J(m,p.clone());_t.rotation.x=-Math.PI/2,_t.position.set(0,.052,-o-.085),_t.renderOrder=8,z.add(_t);for(let bt=0;bt<2;bt+=1){const yt=new J(g,v.clone());yt.rotation.x=-Math.PI/2,yt.position.set(0,.055+bt*.003,-o-.085),yt.renderOrder=9,yt.userData.waterEffect="drainRipple",yt.userData.waterPhase=(O+bt*.5)%1,yt.userData.waterOpacity=.88-bt*.12,this.activeWaterEffects.add(yt),z.add(yt)}for(let bt=0;bt<2;bt+=1){const yt=new J(M,x.clone());yt.position.set(0,.06,-o-.085),yt.renderOrder=10,yt.userData.waterEffect="drainSplash",yt.userData.waterPhase=(O+bt*.17)%1,yt.userData.waterBaseX=0,yt.userData.waterBaseZ=-o-.085,yt.userData.waterOpacity=.72,this.activeWaterEffects.add(yt),z.add(yt)}this.islandFoundationRoot.add(z)}p.dispose(),f.dispose(),u.dispose(),v.dispose(),x.dispose()}addIslandDock(t){if(t.length<3)return;const e=_e(t);let n=0,i=-1/0;for(let et=0;et<t.length;et+=1){const ct=t[et],_t=t[(et+1)%t.length],bt=(ct[0]+_t[0])*.5,yt=(ct[1]+_t[1])*.5,Y=bt-e[0],K=yt-e[1],ut=Math.max(.001,Math.hypot(Y,K)),Q=(Y+K)/ut;Q<=i||(i=Q,n=et)}const r=t[n],o=t[(n+1)%t.length],a=(r[0]+o[0])*.5,l=(r[1]+o[1])*.5,c=a-e[0],h=l-e[1],u=Math.max(.001,Math.hypot(c,h)),d=c/u,f=h/u,g=1.02,v=new Oe;v.position.set(a+d*.04,0,l+f*.04),v.rotation.y=Math.atan2(d,f);const m=new wt({color:11834472,roughness:.78,map:this.noiseTexture,bumpMap:this.noiseTexture,bumpScale:.012}),p=new wt({color:4150096,roughness:.86}),M=new J(new Ut(g,.1,1.58),m);M.position.set(0,te+.14,.82),M.castShadow=M.receiveShadow=!0,v.add(M);const x=new J(new Ci(g*1.12,1.7),new le({color:1525835,transparent:!0,opacity:.16,depthWrite:!1,side:xe}));x.rotation.x=-Math.PI/2,x.position.set(0,te+.021,.82),x.renderOrder=4,v.add(x);for(const et of[-g*.38,g*.38])for(const ct of[.42,1.25]){const _t=new J(new Ie(.055,.075,.44,7),p);_t.position.set(et,te-.13,ct),_t.castShadow=!0,v.add(_t)}const _=.86,y=Kt+.015,E=te+.2,T=y-E,A=new J(new Ut(g*.86,.1,Math.hypot(_,T)),m);A.position.set(0,(y+E)*.5,_*.46),A.rotation.x=Math.atan2(T,_),A.castShadow=A.receiveShadow=!0,v.add(A);for(const et of[-g*.4,g*.4]){const ct=new J(new Ie(.055,.07,.38,7),p);ct.position.set(et,te+.21,1.42),ct.castShadow=!0,v.add(ct);const _t=new J(new qn(.07,8,5),p);_t.position.set(et,te+.405,1.42),_t.castShadow=!0,v.add(_t)}const w=new wt({color:8807746,roughness:.96}),S=new J(new Ut(.24,.2,.24),w);S.position.set(.2,te+.29,1.08),S.rotation.y=.18,S.castShadow=!0,v.add(S);const C=new J(new Ut(.18,.14,.2),w);C.position.set(-.08,te+.26,1.18),C.rotation.y=-.12,C.castShadow=!0,v.add(C);const P=new fs;P.moveTo(0,-.78),P.quadraticCurveTo(-.31,-.5,-.26,.5),P.quadraticCurveTo(-.2,.7,0,.82),P.quadraticCurveTo(.2,.7,.26,.5),P.quadraticCurveTo(.31,-.5,0,-.78),P.closePath();const U=new Oe;U.position.set(-1.34,te+.145,1.08),U.rotation.y=-.08;const z=new ms(P,{depth:.12,bevelEnabled:!0,bevelSegments:2,bevelSize:.035,bevelThickness:.035,curveSegments:18});z.rotateX(Math.PI/2);const F=new J(z,new wt({color:12934994,roughness:.72,side:xe}));F.castShadow=F.receiveShadow=!0,U.add(F),U.add(new si(new wr(z,26),new Tn({color:15782559,transparent:!0,opacity:.86})));const H=new J(new $r(P,18),new wt({color:3561306,roughness:.91,side:xe}));H.rotation.x=Math.PI/2,H.position.y=.012,H.scale.set(.7,.74,.7),U.add(H);for(const et of[-.2,.2]){const ct=new J(new Ut(.35,.045,.09),m);ct.position.set(0,.045,et),ct.castShadow=!0,U.add(ct)}const q=new J(new Ie(.018,.022,.82,6),new wt({color:9136197,roughness:.96}));q.position.set(0,.1,.04),q.rotation.set(0,0,Math.PI/2),q.rotateY(.32),q.castShadow=!0,U.add(q);const O=new J(new Xn(.8,1,48),new le({color:1525835,transparent:!0,opacity:.18,depthWrite:!1,side:xe}));O.rotation.x=-Math.PI/2,O.position.y=-.12,O.scale.set(.38,.88,1),O.renderOrder=4,U.add(O);const W=new J(new Xn(.94,1,64),new le({color:ne.foam,transparent:!0,opacity:.16,depthWrite:!1,side:xe}));W.rotation.x=-Math.PI/2,W.position.y=-.112,W.scale.set(.54,1.12,1),W.renderOrder=5,U.add(W),v.add(U);const tt=new J(new Jr(new Lh([new I(-g*.4,te+.4,1.4),new I(-.86,te+.25,1.58),new I(-1.34,te+.18,1.82)]),12,.012,5,!1),new wt({color:12034941,roughness:1}));tt.castShadow=!0,v.add(tt),this.islandFoundationRoot.add(v)}updateAmbientWater(t){for(const l of[...this.ambientWaterRoot.children])l.traverse(c=>this.activeWaterEffects.delete(c)),this.ambientWaterRoot.remove(l),Rn(l);const e=t.cells.filter(l=>l.foundation);if(e.length===0)return;const n=(Math.min(...e.map(l=>l.x))+Math.max(...e.map(l=>l.x)))*se*.5,i=(Math.min(...e.map(l=>l.z))+Math.max(...e.map(l=>l.z)))*se*.5,r=(Math.max(...e.map(l=>l.x))-Math.min(...e.map(l=>l.x))+1)*se*.5+De.shorelineOverhang,o=(Math.max(...e.map(l=>l.z))-Math.min(...e.map(l=>l.z))+1)*se*.5+De.shorelineOverhang,a=[{offset:.24,opacity:.085,start:.08,length:Math.PI*1.72},{offset:.78,opacity:.045,start:.72,length:Math.PI*1.22},{offset:1.35,opacity:.025,start:3.34,length:Math.PI*.96}];a.forEach((l,c)=>{const h=new J(new Xn(1,1.018,128,1,l.start,l.length),new le({color:15725277,transparent:!0,opacity:l.opacity,depthWrite:!1}));h.rotation.x=-Math.PI/2,h.scale.set(r+l.offset,o+l.offset,1),h.userData.waveBaseX=r+l.offset,h.userData.waveBaseZ=o+l.offset,h.userData.waveOpacity=l.opacity,h.userData.wavePhase=c/a.length,h.position.set(n,te+.026,i),h.renderOrder=3,this.ambientWaterRoot.add(h)})}addWaterContact(t,e,n,i,r){const o=We(un(e,n),-.38);if(re.forEach((l,c)=>{if(!i[l])return;const h=o[c],u=o[(c+1)%4],d=u[0]-h[0],f=u[1]-h[1],g=Math.hypot(d,f),v=f/g,m=-d/g,p=(h[0]+u[0])*.5,M=(h[1]+u[1])*.5,x=-Math.atan2(f,d),_=new J(new Ut(g*1.08,.006,.22),new le({color:ne.foam,alphaMap:this.foamTexture,transparent:!0,opacity:.18,depthWrite:!1}));_.position.set(p+v*.16,te+.029,M+m*.16),_.rotation.y=x,_.renderOrder=3,_.userData.waterEffect="shoreCrest",_.userData.waterPhase=$t(e,n,c+101),_.userData.waterBaseX=_.position.x,_.userData.waterBaseZ=_.position.z,_.userData.waterOutwardX=v,_.userData.waterOutwardZ=m,_.userData.waterOpacity=.3,this.activeWaterEffects.add(_),t.add(_);const y=new J(new Ut(g*1.05,.018,.065),new le({color:3234656,transparent:!0,opacity:.48,depthWrite:!1}));y.position.set(p+v*.035,te+.027,M+m*.035),y.rotation.y=x,y.renderOrder=3,t.add(y);const E=new J(new Ut(g*1.08,.016,.08),new le({color:15068897,transparent:!0,opacity:.42,depthWrite:!1}));E.position.set(p+v*.095,te+.041,M+m*.095),E.rotation.y=x,E.renderOrder=3,E.userData.waterEffect="shoreCrest",E.userData.waterPhase=($t(e,n,c+101)+.42)%1,E.userData.waterBaseX=E.position.x,E.userData.waterBaseZ=E.position.z,E.userData.waterOutwardX=v,E.userData.waterOutwardZ=m,E.userData.waterOpacity=.48,this.activeWaterEffects.add(E),t.add(E)}),!r)return;const a=_e(o);for(let l=0;l<2;l+=1){const c=new J(new Xn(se*(.62+l*.16),se*(.65+l*.16),64),new le({color:16052434,transparent:!0,opacity:.46-l*.16,depthWrite:!1}));c.rotation.x=-Math.PI/2,c.position.set(a[0],te+.035,a[1]),c.userData.ripplePhase=l*.24,c.userData.rippleStart=performance.now()/1e3,c.userData.rippleOpacity=.46-l*.16,this.activeRipples.add(c),t.add(c)}}addTimberSupport(t,e,n,i,r,o=Kt){const a=Ae[i%Ae.length]??Ae[0],l=We(un(e,n),.09),c=_e(l),h=te+.035,u=o-.02,d=Math.max(.24,u-h),f=new wt({color:we(a.trim,-.08,-.12),roughness:.88,map:this.noiseTexture,bumpMap:this.noiseTexture,bumpScale:.014}),g=new wt({color:we(ne.ink,-.08,-.02),roughness:.82}),v=new J(yi(l,.08,jr,.02),f);v.position.y=u-.08,v.castShadow=v.receiveShadow=!0,t.add(v);for(const[m,p]of l){const M=new J(new Ut(.12,d,.12),f);M.position.set(me.lerp(m,c[0],.1),h+d*.5,me.lerp(p,c[1],.1)),M.castShadow=M.receiveShadow=!0,t.add(M)}re.forEach((m,p)=>{const M=l[p],x=l[(p+1)%l.length],_=x[0]-M[0],y=x[1]-M[1],E=Math.hypot(_,y),T=new J(new Ut(E,.1,.1),f);if(T.position.set((M[0]+x[0])*.5,u-.065,(M[1]+x[1])*.5),T.rotation.y=-Math.atan2(y,_),T.castShadow=!0,t.add(T),!r[m])return;const A=new I(M[0],h+.045,M[1]),w=new I(x[0],u-.11,x[1]),S=w.clone().sub(A),C=new J(new Ie(.04,.04,S.length(),6),g);C.position.copy(A).add(w).multiplyScalar(.5),C.quaternion.setFromUnitVectors(Zo,S.normalize()),C.castShadow=!0,t.add(C)})}addLevel(t,e,n,i,r,o,a,l,c,h,u){const d=Ae[o%Ae.length]??Ae[0],f=$t(n,i,r),g=r>0&&$t(n,i,r+1703)>.82,v=qa(un(n,i),De.wallInset*(.72+f*.22),a),m=de*.98,p=new wt({color:we(d.wall,.035,f*.035+.04),roughness:rn.plasterRoughness,map:this.noiseTexture,bumpMap:this.noiseTexture,bumpScale:.022}),M=new J(yi(v,m,a,.085),p);M.position.y=Kt+r*de;const x=new J(yi(v,.14,a,.025),new le({color:Pe(d.wallShadow,-.08),transparent:!0,opacity:.52,depthWrite:!1}));x.position.y=M.position.y-.025,t.add(x);const _=_e(v);v.forEach(([T,A],w)=>{const S=re[(w+3)%4],C=re[w];if(!a[S]||!a[C])return;const P=new J(new Ie(.075,.075,m-.07,5),p);P.position.set(T+(_[0]-T)*.025,M.position.y+m*.5-.035,A+(_[1]-A)*.025),P.rotation.y=$t(n+w,i,r)*.35,P.castShadow=!0,t.add(P)}),M.castShadow=M.receiveShadow=!0,M.userData.cellPick={id:e,x:n,z:i,level:r+1,kind:"house"},t.add(M),this.pickTargets.push(M);const y=new si(new wr(M.geometry,34),new Tn({color:Cs,transparent:!0,opacity:rn.inkOpacity*.74}));y.position.copy(M.position),t.add(y);const E=re.some(T=>c[T]);re.forEach((T,A)=>{a[T]&&this.addFacade(t,v[A],v[(A+1)%4],r,d,u[A]??.5,E,a,g)}),l&&this.addRoof(t,r+1,d,f,v,a,c,h)}addFacadeMasonry(t,e,n,i,r,o){const a=n[0]-e[0],l=n[1]-e[1],c=Math.hypot(a,l),h=a/c,u=l/c,d=l/c,f=-a/c,g=(e[0]+n[0])*.5,v=(e[1]+n[1])*.5,m=-Math.atan2(l,a),p=new J(new Ut(c*.985,de-.3,.03),new wt({color:we(r.wall,-.03,-.1),roughness:.96}));p.position.set(g+d*.024,Kt+i*de+de*.5+.01,v+f*.024),p.rotation.y=m,p.receiveShadow=!0,t.add(p);const M=Math.max(3,Math.ceil(c/.42)),x=4,_=c/M,y=(de-.32)/x,E=new No(new Ut(1,1,1),new wt({color:16777215,roughness:.93,map:this.noiseTexture}),M*x),T=new Ue;let A=0;for(let w=0;w<x;w+=1)for(let S=0;S<M;S+=1){const C=-c*.5+(S+.5)*_,P=$t(Math.round(o*1e3)+S*31,i*47+w*19,M);T.position.set(g+h*C+d*.03,Kt+i*de+.18+(w+.5)*y,v+u*C+f*.03),T.rotation.set(0,m,0),T.scale.set(Math.max(.08,_-.055),Math.max(.08,y-.05),.02),T.updateMatrix(),E.setMatrixAt(A,T.matrix),E.setColorAt(A,we(r.wall,(P-.5)*.07,(P-.5)*.15+(w/(x-1)-.5)*.09)),A+=1}E.instanceMatrix.needsUpdate=!0,E.instanceColor&&(E.instanceColor.needsUpdate=!0),E.castShadow=E.receiveShadow=!0,t.add(E)}addHalfTimberFacade(t,e,n,i,r){if(i===0)return;const o=n[0]-e[0],a=n[1]-e[1],l=Math.hypot(o,a),c=a/l,h=-o/l,u=de*.68,d=l*.91,f=Math.min(.36,d*.18),g=[{x:-d*.5,y:0,width:.065,height:u,angle:0},{x:d*.5,y:0,width:.065,height:u,angle:0},{x:0,y:-u*.5,width:d,height:.055,angle:0},{x:0,y:u*.5,width:d,height:.055,angle:0},{x:-d*.5+f*.42,y:u*.37,width:f,height:.05,angle:.58},{x:d*.5-f*.42,y:u*.37,width:f,height:.05,angle:-.58}],v=new No(new Ut(1,1,1),new wt({color:we(r.roof,-.02,-.18),roughness:.92,map:this.noiseTexture}),g.length);v.position.set((e[0]+n[0])*.5+c*.052,Kt+i*de+de*.54,(e[1]+n[1])*.5+h*.052),v.rotation.y=-Math.atan2(a,o);const m=new Ue;g.forEach((p,M)=>{m.position.set(p.x,p.y,0),m.rotation.set(0,0,p.angle),m.scale.set(p.width,p.height,.055),m.updateMatrix(),v.setMatrixAt(M,m.matrix)}),v.instanceMatrix.needsUpdate=!0,v.castShadow=v.receiveShadow=!0,t.add(v)}addFacade(t,e,n,i,r,o,a,l,c){const h=n[0]-e[0],u=n[1]-e[1],d=Math.hypot(h,u),f=h/d,g=u/d,v=u/d,m=-h/d,p=(e[0]+n[0])*.5,M=(e[1]+n[1])*.5,x=-Math.atan2(u,h),_=re.filter(F=>l[F]).length,y=i===0&&_<=2&&o>.92,E=i===0&&!y&&o>.78,T=y||E||o>.72?1:o<.22?3:2,A=new wt({color:we(r.trim,.03,.055),roughness:rn.trimRoughness}),w=new wt({color:2707292,emissive:1059636,emissiveIntensity:.18,roughness:.24,metalness:.08}),S=new wt({color:we(r.roof,.02,-.035),roughness:.86}),C=new wt({color:we(r.wall,.025,-.055),roughness:.9,map:this.noiseTexture});this.addFacadeMasonry(t,e,n,i,r,o),c&&this.addHalfTimberFacade(t,e,n,i,r);const P=new J(new Ut(d*.98,.045,.085),A);P.position.set(p+v*.075,Kt+(i+1)*de-.13,M+m*.075),P.rotation.y=x,P.castShadow=!0,t.add(P);const U=new J(new Ut(d*1.01,.038,.075),A);U.position.set(p+v*.065,Kt+i*de+.16,M+m*.065),U.rotation.y=x,U.castShadow=!0,t.add(U);const z=[];for(let F=0;F<T;F+=1){const H=Math.min(.76,d*.34),q=T===1?(o-.5)*.16:(F-(T-1)*.5)*H,O=y?.58:E?.46:T===3?.34:.44+o%.1,W=y?.98:E?1.08:.68+o%.14,tt=i>0&&!y&&!E&&T===1,et=p+f*q+v*.06,ct=M+g*q+m*.06,_t=new Oe;if(_t.position.set(et+v*(tt?.2:0),Kt+(E||y?i*de+W*.5:i*de+.88),ct+m*(tt?.2:0)),_t.rotation.y=x,tt){const Q=new J(new Ut(O*1.38,W*1.12,.24),C);Q.position.copy(_t.position).add(new I(-v*.1,0,-m*.1)),Q.rotation.y=x,Q.castShadow=!0,t.add(Q);const ot=new J(new Ut(O*1.5,.08,.36),S);ot.position.copy(_t.position).add(new I(v*.025,W*.6,m*.025)),ot.rotation.y=x,ot.castShadow=!0,t.add(ot)}const bt=new Ut(O,.048,.1),yt=new Ut(.048,W,.1);for(const Q of[-W*.5+.03,W*.5-.03]){const ot=new J(bt,A);ot.position.y=Q,ot.castShadow=!0,_t.add(ot)}for(const Q of[-O*.5+.03,O*.5-.03]){const ot=new J(yt,A);ot.position.x=Q,ot.castShadow=!0,_t.add(ot)}if(!y&&!E&&o>.42&&o<.7){const Q=new Ut(O*.16,W*.72,.075);for(const ot of[-O*.56,O*.56]){const At=new J(Q,S);At.position.set(ot,0,.025),At.castShadow=!0,_t.add(At)}}t.add(_t);const Y=!y&&!E&&$t(Math.round(o*1e3),i*17,F+641)>.68,K=y?new wt({color:4809319,roughness:.88}):Y?new wt({color:15116382,emissive:16755023,emissiveIntensity:1.25,roughness:.38}):w,ut=new J(new Ut(O*.8,W*(y?.76:.82),.08),K);if(ut.position.copy(_t.position).add(new I(-v*.055,y?-.1:0,-m*.055)),ut.rotation.y=x,t.add(ut),!y){const Q=new J(new Ut(O*1.18,.055,.16),A);Q.position.copy(_t.position).add(new I(v*.105,-W*.5-.025,m*.105)),Q.rotation.y=x,Q.castShadow=!0,t.add(Q)}if(!y&&!E&&(Y||$t(Math.round(o*1e3),i*23,F+719)>.78)){const Q=new J(new Ut(O*.7,.09,.12),new wt({color:8083776,roughness:.92}));Q.position.copy(_t.position).add(new I(v*.16,-W*.5+.055,m*.16)),Q.rotation.y=x,Q.castShadow=!0,t.add(Q);const ot=new wt({color:7311203,roughness:.9});for(const At of[-.22,0,.22]){const qt=new J(new qn(.045,7,5),ot);qt.position.set(Q.position.x+f*O*At,Q.position.y+.09+Math.abs(At)*.025,Q.position.z+g*O*At),qt.castShadow=!0,t.add(qt);const L=new J(new qn(.022,7,5),new wt({color:At===0?15911015:15170422,roughness:.74,emissive:At===0?4861960:4133392,emissiveIntensity:.18}));L.position.copy(qt.position),L.position.y+=.04,L.position.x+=v*.012,L.position.z+=m*.012,L.castShadow=!0,t.add(L)}}if(!y&&!E){const Q=et+v*.022,ot=ct+m*.022,At=_t.position.y;z.push(Q,At-W*.3,ot,Q,At+W*.3,ot,Q-f*O*.3,At,ot-g*O*.3,Q+f*O*.3,At,ot+g*O*.3)}if(y){const Q=new J(new Kr(O*.37,.055,6,18,Math.PI),A);Q.position.set(et+v*.04,Kt+i*de+W*.76,ct+m*.04),Q.rotation.set(0,x,0),t.add(Q)}else if(!E&&!tt&&o>.68){const Q=new J(new Ut(O*1.16,.07,.32),new wt({color:r.roof,roughness:.8}));Q.position.copy(_t.position).add(new I(v*.15,W*.6,m*.15)),Q.rotation.y=x,t.add(Q)}}if(z.length>0){const F=new ae;F.setAttribute("position",new zt(z,3)),t.add(new si(F,new Tn({color:Pe(r.trim,.12),transparent:!0,opacity:.88})))}if(i>0&&o>.62&&(a||i>=2&&o>.84)){const F=Math.min(1.15,d*.58),H=new J(new Ut(F,.1,.42),new wt({color:r.trim,roughness:.82}));H.position.set(p+v*.22,Kt+i*de+.5,M+m*.22),H.rotation.y=x,t.add(H);const q=Kt+i*de+.76,O=p+v*.43,W=M+m*.43,tt=F*.46,et=new wt({color:Cs,roughness:.78}),ct=new J(new Ut(F*.94,.045,.045),et);ct.position.set(O,q,W),ct.rotation.y=x,ct.castShadow=!0,t.add(ct);for(const Y of[-tt,0,tt]){const K=new J(new Ut(.04,.28,.04),et);K.position.set(O+f*Y,q-.14,W+g*Y),K.castShadow=!0,t.add(K)}const _t=[O-f*tt,q,W-g*tt,O+f*tt,q,W+g*tt];for(const Y of[-tt,0,tt])_t.push(O+f*Y,q-.24,W+g*Y,O+f*Y,q,W+g*Y);const bt=new ae;bt.setAttribute("position",new zt(_t,3)),t.add(new si(bt,new Tn({color:Cs,transparent:!0,opacity:.72})));const yt=[we(r.roof,.08,.02),15190398];for(const[Y,K]of[-tt*.44,tt*.28].entries()){const ut=new J(new Ut(Y===0?.19:.16,Y===0?.23:.18,.018),new wt({color:yt[Y],roughness:.94,side:xe}));ut.position.set(O+f*K,q-(Y===0?.13:.1),W+g*K),ut.rotation.y=x,ut.castShadow=!0,t.add(ut)}}if(o>.34&&o<.43){const F=new J(new Ie(.028,.035,de*.86,7),A);if(F.position.set(p+f*d*.42+v*.075,Kt+i*de+de*.47,M+g*d*.42+m*.075),F.castShadow=!0,t.add(F),i===0){const H=F.position.x+v*.035,q=F.position.z+m*.035,O=F.position.y-de*.43,W=Math.max(.2,O-te-.055),tt=$t(Math.round(H*10),Math.round(q*10),149),et=new J(new Ie(.012,.022,1,7),new le({color:12576993,transparent:!0,opacity:.62,depthWrite:!1}));et.position.set(H,O-W*.5,q),et.renderOrder=6,et.userData.waterEffect="drainStream",et.userData.waterPhase=tt,et.userData.waterTop=O,et.userData.waterLength=W,this.activeWaterEffects.add(et),t.add(et);const ct=new J(new Xn(.11,.138,28),new le({color:ne.foam,transparent:!0,opacity:.38,depthWrite:!1,side:xe}));ct.rotation.x=-Math.PI/2,ct.position.set(H,te+.052,q+m*.055),ct.renderOrder=6,ct.userData.waterEffect="drainRipple",ct.userData.waterPhase=tt,ct.userData.waterOpacity=.38,this.activeWaterEffects.add(ct),t.add(ct)}}}addDormer(t,e,n,i,r,o,a,l){const c=n[0]-e[0],h=n[1]-e[1],u=Math.hypot(c,h),d=c/u,f=h/u,g=(e[0]+n[0])*.5,v=(e[1]+n[1])*.5,m=.38,p=(l-.5)*Math.min(.28,u*.12),M=new Oe;M.position.set(me.lerp(g,i[0],m)+d*p,r+o*m+.04,me.lerp(v,i[1],m)+f*p),M.rotation.y=-Math.atan2(h,c);const x=new wt({color:we(a.trim,-.025,-.035),roughness:rn.plasterRoughness,map:this.noiseTexture}),_=new J(new Ut(.46,.28,.27),x);_.position.y=.14,_.castShadow=!0,M.add(_);const y=new J(Vl([[-.3,-.19],[.3,-.19],[.3,.19],[-.3,.19]],.22,"z"),new wt({color:we(a.roof,.045,-.035),roughness:rn.roofRoughness,map:this.noiseTexture}));y.position.y=.28,y.castShadow=!0,M.add(y);const E=new J(new Ut(.23,.16,.035),new wt({color:Pe(Cs,.035),emissive:Cs,emissiveIntensity:.12,roughness:.3}));E.position.set(0,.15,-.153),M.add(E),t.add(M)}addRoof(t,e,n,i,r,o,a,l){const c=Kt+e*de+.03,h=new uf({color:we(n.roof,.08,i*.02-.035),roughness:rn.roofRoughness,clearcoat:.09,clearcoatRoughness:.76,map:this.noiseTexture,bumpMap:this.noiseTexture,bumpScale:.028,side:xe}),u=re.filter(P=>o[P]).length,d=re.filter(P=>a[P]).length;if(re.filter(P=>l[P]).length>0){const P=_e(r),U=r.map(([H,q],O)=>{const W=re[(O+3)%re.length],tt=re[O],et=l[W]||l[tt]?1:1.025;return[P[0]+(H-P[0])*et,P[1]+(q-P[1])*et]}),z=new J(Av(U,De.roofHeight*.78,l),h);z.position.y=c,z.castShadow=!0,t.add(z);const F=new si(new wr(z.geometry,14),new Tn({color:Pe(n.wallShadow,-.08),transparent:!0,opacity:.9}));F.position.copy(z.position),t.add(F),i>.62&&this.addChimney(t,c,i);return}if(d>=3||d>=2&&i>.9){const P=new J(yi(r,.12,o),h);P.position.y=c,P.castShadow=!0,t.add(P);const U=new wt({color:n.trim,roughness:rn.trimRoughness});re.forEach((z,F)=>{if(!o[z])return;const H=r[F],q=r[(F+1)%4],O=q[0]-H[0],W=q[1]-H[1],tt=new J(new Ut(Math.hypot(O,W)*.9,De.bridgeRailHeight,.045),U);tt.position.set((H[0]+q[0])*.5,c+De.bridgeRailHeight*.72,(H[1]+q[1])*.5),tt.rotation.y=-Math.atan2(W,O),t.add(tt)}),i>.78&&this.addGreenery(t,c+.18,i);return}const v=a.north||a.south,m=a.north&&a.south||a.east&&a.west,p=d===0&&i>.3&&i<.72,M=d===1||m||p?v||d===0&&i>.5?"z":"x":null,x=_e(r),_=d===0?1+De.roofOverhang/se:1.008,y=r.map(([P,U])=>[x[0]+(P-x[0])*_,x[1]+(U-x[1])*_]),E=new le({color:2635834,transparent:!0,opacity:.44,depthWrite:!1});re.forEach((P,U)=>{if(!o[P])return;const z=y[U],F=y[(U+1)%4],H=F[0]-z[0],q=F[1]-z[1],O=Math.hypot(H,q),W=new J(new Ut(O*1.015,.055,.065),E);W.position.set((z[0]+F[0])*.5+q/O*.025,c-.035,(z[1]+F[1])*.5-H/O*.025),W.rotation.y=-Math.atan2(q,H),t.add(W)});const T=M?De.roofHeight:De.roofHeight*1.18,A=new J(Vl(y,T,M),h);if(A.position.y=c,A.castShadow=!0,t.add(A),d===0){const P=new si(new wr(A.geometry,18),new Tn({color:Pe(n.wallShadow,-.04),transparent:!0,opacity:.52}));P.position.copy(A.position),t.add(P)}if(M&&e<4&&(d>0||i<=.7)){const P=Math.round(i*1e5),U=$t(P,e,1901),F=(M==="x"?["south","north"]:["west","east"]).filter(H=>o[H]);if(U>.64&&F.length>0){const H=Math.floor($t(P,e,1907)*F.length),q=re.indexOf(F[H]);this.addDormer(t,y[q],y[(q+1)%y.length],x,c,T,n,i)}}const w=[];if(M){const P=_e(M==="x"?[y[0],y[3]]:[y[0],y[1]]),U=_e(M==="x"?[y[1],y[2]]:[y[3],y[2]]);w.push(P[0],c+T+.021,P[1],U[0],c+T+.021,U[1])}if(re.forEach((P,U)=>{if(!o[P]||M==="x"&&(P==="east"||P==="west")||M==="z"&&(P==="north"||P==="south"))return;const z=y[U],F=y[(U+1)%4],H=(z[0]+F[0])*.5,q=(z[1]+F[1])*.5;for(const bt of[.08,.25,.42,.59]){const yt=(x[0]-H)*bt,Y=(x[1]-q)*bt,K=M?z[0]+yt:me.lerp(z[0],x[0],bt),ut=M?z[1]+Y:me.lerp(z[1],x[1],bt),Q=M?F[0]+yt:me.lerp(F[0],x[0],bt),ot=M?F[1]+Y:me.lerp(F[1],x[1],bt),At=c+T*bt+.018;w.push(K,At,ut,Q,At,ot)}const O=M==="x"?_e([y[0],y[3]]):M==="z"?_e([y[0],y[1]]):x,W=M==="x"?_e([y[1],y[2]]):M==="z"?_e([y[3],y[2]]):x,tt=Math.hypot(z[0]-O[0],z[1]-O[1]),et=Math.hypot(z[0]-W[0],z[1]-W[1]),ct=tt<=et?O:W,_t=tt<=et?W:O;for(const bt of[.18,.38,.58,.78]){const yt=me.lerp(z[0],F[0],bt),Y=me.lerp(z[1],F[1],bt),K=me.lerp(ct[0],_t[0],bt),ut=me.lerp(ct[1],_t[1],bt);w.push(yt,c+.018,Y,K,c+T+.018,ut)}}),w.length>0){const P=new ae;P.setAttribute("position",new zt(w,3));const U=new si(P,new Tn({color:Pe(n.wallShadow,-.08),transparent:!0,opacity:.64}));t.add(U)}const S=u===2&&(o.north&&o.east||o.east&&o.south||o.south&&o.west||o.west&&o.north),C=e>=4||e>=2&&d===0&&i>.7;C&&this.addCupola(t,x,c+.8,n),!C&&(S||d<=1&&(i>.78||i>.28&&i<.4))&&this.addChimney(t,c,i)}addCupola(t,e,n,i){const r=new J(new Ie(.32,.37,.44,8),new wt({color:i.trim,roughness:.82,map:this.noiseTexture}));r.position.set(e[0],n+.2,e[1]),r.castShadow=!0,t.add(r);const o=new J(new Ns(.48,.52,8),new wt({color:i.roof,roughness:.9,map:this.noiseTexture}));o.position.set(e[0],n+.67,e[1]),o.castShadow=!0,t.add(o)}addChimney(t,e,n){const i=new J(new Ut(.24,.68,.24),new wt({color:8084560,roughness:.95}));i.position.set((n-.5)*.95,e+.48,.18),i.rotation.y=n*.15,i.castShadow=!0,t.add(i)}addGreenery(t,e,n){const i=new Oe;i.position.set((n-.5)*.8,e,.2),i.rotation.y=(n-.5)*.42;const r=Math.floor(n*3),o=new wt({color:we(ne.vegetation,.055,n*.06-.01),roughness:.98}),a=new wt({color:Pe(10772040,n*.06-.03),roughness:.92});if(r===0){const l=new J(new Ie(.18,.14,.2,7),a);l.castShadow=!0,i.add(l);const c=new J(new Ie(.022,.032,.34,5),new wt({color:6444097,roughness:.98}));c.position.y=.24,c.castShadow=!0,i.add(c);const h=new Ei(.18,0);for(const[u,d]of[.92,.68].entries()){const f=new J(h,o);f.position.set(u===0?-.025:.045,.34+u*.2,0),f.scale.set(d,d*1.08,d*.88),f.rotation.y=n*Math.PI+u*.7,f.castShadow=!0,i.add(f)}}else if(r===1){const l=new J(new Ut(.42,.14,.26),a);l.castShadow=!0,i.add(l);const c=new Ei(.16,0);for(let h=0;h<3;h+=1){const u=new J(c,o);u.position.set((h-1)*.13,.16+h%2*.055,(h%2-.5)*.055),u.scale.set(1,.72+h*.08,.84),u.rotation.y=n*Math.PI*2+h,u.castShadow=!0,i.add(u)}}else{const l=new J(new Ie(.2,.16,.16,8),a);l.castShadow=!0,i.add(l);const c=new Ie(.009,.012,.28,5),h=new wt({color:5274200,roughness:1}),u=new Ei(.055,0),d=[new wt({color:14185827,roughness:.9}),new wt({color:14728037,roughness:.9})];for(let f=0;f<4;f+=1){const g=n*Math.PI*2+f*1.7,v=f===0?.035:.09,m=new J(c,h);m.position.set(Math.cos(g)*v,.2+f%2*.025,Math.sin(g)*v),m.rotation.z=(f-1.5)*.04,i.add(m);const p=new J(u,d[f%d.length]);p.position.set(m.position.x,m.position.y+.155,m.position.z),p.scale.y=.72,p.castShadow=!0,i.add(p)}}t.add(i)}createBirds(){const t=new le({color:16775135,side:xe,transparent:!0,opacity:.94,toneMapped:!1}),e=new le({color:15260610,toneMapped:!1}),n=new le({color:14062139,toneMapped:!1}),i=new le({color:9265472,toneMapped:!1}),r=new ae;r.setAttribute("position",new zt([0,0,.16,-.62,0,-.1,-.14,0,.28],3)),r.setIndex([0,1,2]),r.computeVertexNormals();const o=new ae;o.setAttribute("position",new zt([0,0,.16,.62,0,-.1,.14,0,.28],3)),o.setIndex([0,1,2]),o.computeVertexNormals();for(let a=0;a<6;a+=1){const l=new Oe,c=new J(new qn(.12,8,5),e);c.scale.set(.72,.58,2.1),l.add(c);const h=new J(new qn(.085,7,5),t);h.position.set(0,.02,.25);const u=new J(new Ns(.033,.12,5),n);u.rotation.x=Math.PI/2,u.position.set(0,.012,.35);const d=new J(new Ie(.011,.011,.13,5),i);d.position.set(-.034,-.1,.025);const f=d.clone();f.position.x=.034,l.add(h,u,d,f);const g=new J(r,t),v=new J(o,t);g.position.y=v.position.y=.015,l.add(g,v);const m=a*(Math.PI*2/6)+.38,p=10+a*1.35,M=7.5+a%3*.6,x=.16+a*.012,_=Math.cos(m)*p,y=Math.sin(m)*p*.42;l.position.set(_,M,y),l.rotation.y=Math.atan2(-Math.sin(m)*p,Math.cos(m)*p*.42);const E=.88+a%2*.12;l.scale.setScalar(E),l.userData.phase=m,l.userData.radius=p,l.userData.altitude=M,l.userData.speed=x,l.userData.leftWing=g,l.userData.rightWing=v,l.userData.baseScale=E,this.birds.add(l)}}updateBirdPerches(t,e){const n=[];for(const r of t.values()){if(r.kind!=="house"||r.level<1)continue;const o=e.get(r.id);o&&n.push({id:r.id,anchor:new I(o.x*se+($t(o.x,o.z,811)-.5)*.36,Kt+r.level*de+De.roofHeight+.1,o.z*se+($t(o.z,o.x,823)-.5)*.36),score:r.level*10+$t(o.x,o.z,839)})}n.sort((r,o)=>o.score-r.score),this.perchAnchors=n.map(({anchor:r})=>r);const i=performance.now()/1e3;if(this.perchAnchors.length===0){this.birds.children.forEach((r,o)=>{if(delete r.userData.perchId,delete r.userData.perchIndex,this.reducedMotion){r.userData.mode="flight",r.visible=!1;return}if(r.userData.mode==="flight")return;const a=r.position.z/.58,l=Math.max(.8,Math.hypot(r.position.x,a));r.userData.mode="flight",r.userData.flightStart=i,r.userData.flightUntil=i+3.5+o*.4,r.userData.flightCenterX=0,r.userData.flightCenterZ=0,r.userData.flightStartRadius=l,r.userData.flightTargetRadius=Math.max(l,Number(r.userData.radius)*.55),r.userData.flightStartAngle=Math.atan2(a,r.position.x),r.userData.flightStartY=r.position.y,r.visible=!0});return}if(this.reducedMotion){const r=Math.min(4,this.perchAnchors.length);this.birds.children.forEach((o,a)=>{if(a>=r){delete o.userData.perchId,delete o.userData.perchIndex,o.userData.mode="flight",o.visible=!1;return}const l=a%this.perchAnchors.length;o.userData.perchId=n[l].id,o.userData.perchIndex=l,o.userData.mode="perched",o.position.copy(this.perchAnchors[l]),o.visible=!0});return}this.birds.children.forEach((r,o)=>{const a=r.userData.perchId,l=a===void 0?-1:n.findIndex(u=>u.id===a),c=l>=0?l:o%this.perchAnchors.length;r.userData.perchId=n[c].id,r.userData.perchIndex=c;const h=this.perchAnchors[c];r.userData.mode===void 0?o<Math.min(4,this.perchAnchors.length)?(r.userData.mode="perched",r.position.copy(h),r.visible=!0):(r.userData.mode="flight",r.userData.flightStart=i-1,r.userData.flightUntil=i+3.5+o*.4,r.userData.flightCenterX=0,r.userData.flightCenterZ=0,r.userData.flightStartRadius=Number(r.userData.radius)*.55,r.userData.flightTargetRadius=Number(r.userData.radius)*.55,r.userData.flightStartAngle=Number(r.userData.phase),r.userData.flightStartY=r.position.y):r.userData.mode==="perched"&&r.position.copy(h)})}notifyConstruction(t,e){const n=performance.now()/1e3,i=t*se,r=e*se;for(let c=0;c<3;c+=1){const h=.1+c*.11,u=new J(new Xn(h,h+.045,48),new le({color:c===0?16777215:ne.foam,transparent:!0,opacity:.68-c*.13,depthWrite:!1,toneMapped:!1}));u.rotation.x=-Math.PI/2,u.position.set(i,te+.045+c*.002,r),u.renderOrder=5,u.userData.ripplePhase=c*.08,u.userData.rippleStart=n,u.userData.rippleOpacity=.68-c*.13,u.userData.rippleDuration=1.05+c*.18,u.userData.rippleGrowth=3.8+c*.9,this.activeRipples.add(u),this.constructionEffectsRoot.add(u)}for(let c=0;c<7;c+=1){const h=$t(t*31+c,e*37,857)*Math.PI*2,u=.3+$t(e*41,t*43+c,863)*.5,d=new J(new qn(.035+c%3*.012,6,4),new le({color:15332328,transparent:!0,opacity:.82,toneMapped:!1}));d.scale.y=1.7,d.position.set(i,te+.05,r),d.userData.splashOriginX=i,d.userData.splashOriginZ=r,d.userData.splashStart=n+c*.025,d.userData.splashVelocity=new I(Math.cos(h)*u,1.15+c%3*.16,Math.sin(h)*u),this.activeSplashDrops.add(d),this.constructionEffectsRoot.add(d)}if(this.reducedMotion)return!1;const o=se*1.25,a=o*o;let l=!1;return this.birds.children.forEach((c,h)=>{if(c.userData.mode!=="perched")return;const u=c.position.x-i,d=c.position.z-r,f=u*u+d*d;f>=a||(c.userData.mode="flight",c.userData.flightStart=n,c.userData.flightUntil=n+4.8+h*.24,c.userData.flightCenterX=i,c.userData.flightCenterZ=r,c.userData.flightStartRadius=Math.max(.8,Math.sqrt(f)),c.userData.flightTargetRadius=4.2+h*.54,c.userData.flightStartAngle=Math.atan2(d,u),c.userData.flightStartY=c.position.y,c.visible=!0,l=!0)}),l}pick(t,e,n=!1){const i=this.canvas.getBoundingClientRect();if(i.width<=0||i.height<=0)return null;this.pointer.set((t-i.left)/i.width*2-1,-((e-i.top)/i.height)*2+1),this.raycaster.setFromCamera(this.pointer,this.camera);const r=this.raycaster.intersectObjects(this.pickTargets,!1)[0];if(!r)return null;const o=r.object.userData.cellPick;if(!o)return null;if(o.kind==="water"){const g=Math.round(r.point.x/se),v=Math.round(r.point.z/se);for(let m=-1;m<=1;m+=1)for(let p=-1;p<=1;p+=1){const M=g+p,x=v+m;if(M*M+x*x<=Ge*Ge&&Cv(r.point.x,r.point.z,un(M,x,!1)))return{id:`${M},${x}`,x:M,z:x,level:0,kind:"water",face:"water"}}return null}if(!r.face)return{...o,face:"top"};const a=r.face.normal.clone().applyNormalMatrix(new jt().getNormalMatrix(r.object.matrixWorld));if(Math.abs(a.y)>=.55||o.kind==="bridge")return{...o,face:"top"};const l=Math.abs(a.x)>Math.abs(a.z)?Math.sign(a.x):0,c=l===0?Math.sign(a.z):0,h=l>0?"east":l<0?"west":c>0?"south":"north";if(!n)return{...o,face:"side",direction:h};const u=o.x+l,d=o.z+c;if(u*u+d*d>Ge*Ge)return null;const f=`${u},${d}`;return{id:f,x:u,z:d,level:this.cellLevels.get(f)??0,placementLevel:o.level>0?o.level:void 0,kind:this.cellKinds.get(f)??"water",face:"side",direction:h,surfaceX:o.x,surfaceZ:o.z}}setGrid(t){this.grid.visible=t}setHover(t,e,n){const i=t?`${t.id},${t.level},${t.placementLevel??""},${t.face??""},${t.direction??""},${t.surfaceX??""},${t.surfaceZ??""},${e},${n}`:"none";if(i===this.hoverSignature||(this.hoverSignature=i,Rn(this.hoverRoot),this.hoverRoot.clear(),!t))return;const r=Ae[e%Ae.length]??Ae[0],o=new le({color:n?16736863:r.trim,transparent:!0,opacity:.76,depthWrite:!1,blending:Qo,side:xe,toneMapped:!1});if(t.face==="side"&&t.direction){const c=t.surfaceX??t.x,h=t.surfaceZ??t.z,u=We(un(c,h,!1),De.wallInset*.7),d=re.indexOf(t.direction),f=u[d],g=u[(d+1)%u.length],v=g[0]-f[0],m=g[1]-f[1],p=Math.hypot(v,m),M=m/p,x=-v/p,_=new J(new Ci(p*.86,de*.76),o);_.position.set((f[0]+g[0])*.5+M*.045,Kt+Math.max(0,(t.placementLevel??t.level)-1)*de+de*.5,(f[1]+g[1])*.5+x*.045),_.rotation.y=-Math.atan2(m,v),this.hoverRoot.add(_);return}const a=We(un(t.x,t.z,!1),.055),l=new J(yi(a,.018,jr,.04),o);l.position.y=t.face==="water"?te+.055:Kt+t.level*de+.06,this.hoverRoot.add(l)}beginPointer(t,e){this.pointerActive=!0,this.pointerMoved=!1,this.pointerStart.set(t,e),this.pointerLast.copy(this.pointerStart),this.panGesture=this.pointerButton!==0||this.shiftPressed||this.activePointers>1}movePointer(t,e){if(!this.pointerActive)return{dragged:!1};const n=t-this.pointerLast.x,i=e-this.pointerLast.y;if(this.pointerLast.set(t,e),!this.pointerMoved&&this.pointerLast.distanceToSquared(this.pointerStart)>64&&(this.pointerMoved=!0),this.pointerMoved){if(this.panGesture){const r=.014/this.viewZoom,o=new I(-Math.sin(this.azimuth),0,-Math.cos(this.azimuth)),a=new I().crossVectors(o,Zo).normalize();this.target.addScaledVector(a,-n*r).addScaledVector(o,i*r)}else this.azimuth-=n*.007,this.elevation=me.clamp(this.elevation+i*.005,.28,1.25);this.updateCamera()}return{dragged:this.pointerMoved}}endPointer(){this.pointerActive=!1,this.panGesture=!1}zoom(t){this.viewZoom=me.clamp(this.viewZoom*Math.exp(-t*.0012),.25,2.8),this.resize()}renderReflectionTarget(){const t=this.renderer.getRenderTarget(),e=this.scene.background,n=this.renderer.clippingPlanes,i=this.renderer.getClearColor(this.reflectionClearColor),r=this.renderer.getClearAlpha(),o=this.renderer.shadowMap.autoUpdate,a=this.water.visible,l=this.reflectionOverlay.visible,c=this.hoverRoot.visible,h=this.ambientWaterRoot.visible,u=this.constructionEffectsRoot.visible,d=this.islandFoundationRoot.visible,f=this.birds.visible,g=this.grid.visible;this.scene.background=null,this.water.visible=!1,this.reflectionOverlay.visible=!1,this.hoverRoot.visible=!1,this.ambientWaterRoot.visible=!1,this.islandFoundationRoot.visible=!1,this.constructionEffectsRoot.visible=!1,this.birds.visible=!1,this.grid.visible=!1,this.renderer.shadowMap.autoUpdate=!1;try{this.renderer.setRenderTarget(this.reflectionRenderTarget),this.renderer.setClearColor(0,0),this.renderer.clear(!0,!0,!0),this.renderer.render(this.scene,this.camera)}finally{this.renderer.setRenderTarget(t),this.renderer.setClearColor(i,r),this.renderer.clippingPlanes=n,this.renderer.shadowMap.autoUpdate=o,this.scene.background=e,this.water.visible=a,this.reflectionOverlay.visible=l,this.hoverRoot.visible=c,this.ambientWaterRoot.visible=h,this.islandFoundationRoot.visible=d,this.constructionEffectsRoot.visible=u,this.birds.visible=f,this.grid.visible=g}}update(t){const e=t*.001;this.waterMaterial.uniforms.time.value=this.reducedMotion?0:e*pi.waveSpeed,this.reflectionOverlayMaterial.uniforms.time.value=this.reducedMotion?0:e;const n=performance.now()/1e3;this.activeRevealGroups.size>0&&(this.reflectionDirty=!0);for(const i of this.activeRevealGroups){const r=Number(i.userData.reveal??0),o=me.clamp((n-r)*3.8,0,1),a=1-Math.pow(1-o,3);i.scale.y=Math.max(.001,a),o>=1&&(i.userData.reveal=0,this.activeRevealGroups.delete(i))}for(const i of this.swayingTrees){if(this.reducedMotion){i.rotation.x=0,i.rotation.z=0;continue}const r=Number(i.userData.windPhase),o=Number(i.userData.windStrength),a=Math.sin(e*.72+r),l=Math.sin(e*1.31+r*.73)*.28;i.rotation.z=(a+l)*o,i.rotation.x=Math.sin(e*.61+r*1.17)*o*.55}for(const i of this.activeWaterEffects){const o=i.material,a=Number(i.userData.waterPhase??0),l=String(i.userData.waterEffect??"");if(l==="shoreCrest"){const h=this.reducedMotion?.55:(e/pi.shorelineCycle+a)%1,u=Math.sin(h*Math.PI)**1.5,d=h*pi.shorelineTravel;i.position.x=Number(i.userData.waterBaseX)-Number(i.userData.waterOutwardX)*d,i.position.z=Number(i.userData.waterBaseZ)-Number(i.userData.waterOutwardZ)*d,o.opacity=Number(i.userData.waterOpacity)*(.12+u*.88),i.scale.y=.72+u*.42;continue}if(l==="outlineCrest"){const h=this.reducedMotion?.48:(e/pi.shorelineCycle+a)%1,u=Math.sin(h*Math.PI)**1.35;o.opacity=Number(i.userData.waterOpacity)*(.34+u*.66);continue}const c=this.reducedMotion?.36:(e/pi.drainCycle+a)%1;if(l==="drainStream"){const h=.5+Math.sin(c*Math.PI*2)*.5,u=Number(i.userData.waterLength??pi.drainStreamLength)*(.82+h*.18);i.visible=!0,i.scale.y=u,i.position.y=Number(i.userData.waterTop)-u*.5,o.opacity=Number(i.userData.waterOpacity??.62)*(.74+h*.26);continue}if(l==="drainRipple"){const h=c;i.visible=!0;const u=.72+h*pi.drainRippleGrowth;o.opacity=(1-h)*Number(i.userData.waterOpacity??.52),i.scale.set(u,u,1);continue}if(l==="drainSplash"){const h=(c-.46)/.22;i.visible=h>=0&&h<1;const u=me.clamp(h,0,1),d=Math.sin(u*Math.PI);i.position.x=Number(i.userData.waterBaseX)+(a>.5?1:-1)*u*.06,i.position.y=.06+d*.13,i.position.z=Number(i.userData.waterBaseZ)-u*.09,i.scale.setScalar(1-u*.55),o.opacity=d*Number(i.userData.waterOpacity??.72);continue}}for(const i of this.activeRipples){const r=Number(i.userData.rippleStart),o=Math.max(0,e-r-Number(i.userData.ripplePhase)),a=Number(i.userData.rippleDuration??1.45),l=me.clamp(o/a,0,1),c=Number(i.userData.rippleGrowth??.25);i.scale.setScalar(1+l*c);const h=i.material;h.opacity=(1-l)*Number(i.userData.rippleOpacity??.3),i.visible=l<1,l>=1&&(this.activeRipples.delete(i),i.removeFromParent(),i.geometry.dispose(),h.dispose())}for(const i of this.activeSplashDrops){const r=Number(i.userData.splashStart),o=e-r;if(i.visible=o>=0,o>=0){const a=i.userData.splashVelocity;i.position.set(Number(i.userData.splashOriginX)+a.x*o,te+.05+a.y*o-2.8*o*o,Number(i.userData.splashOriginZ)+a.z*o);const l=i.material;l.opacity=me.clamp((.72-o)*1.35,0,.82)}o>.72&&(this.activeSplashDrops.delete(i),i.removeFromParent(),i.geometry.dispose(),i.material.dispose())}this.ambientWaterRoot.children.forEach(i=>{const r=Number(i.userData.wavePhase??0),o=this.reducedMotion?0:(e*.18+r)%1,a=1+o*.075;i.scale.set(Number(i.userData.waveBaseX??1)*a,Number(i.userData.waveBaseZ??1)*a,1);const l=i.material;l.opacity=Number(i.userData.waveOpacity??.1)*(.18+(1-o)*.82)}),this.reducedMotion||(this.hoverRoot.position.y=Math.sin(e*3.2)*.035,this.birds.children.forEach((i,r)=>{const o=i.userData.leftWing,a=i.userData.rightWing,l=Number(i.userData.baseScale),c=Number(i.userData.phase),h=String(i.userData.mode??"flight"),u=Number(i.userData.perchIndex??0),d=this.perchAnchors.length>0?this.perchAnchors[u%this.perchAnchors.length]:void 0;if(h==="perched"&&d){i.visible=!0,i.position.set(d.x,d.y+Math.sin(e*1.3+c)*.012,d.z),i.rotation.y=c+Math.PI*.5,i.rotation.z=0,i.scale.setScalar(l*.58),o.scale.set(.38,1,.65),a.scale.set(.38,1,.65),o.rotation.z=.24,i.scale.setScalar(l*.82);return}if(h==="landing"&&d){i.visible=!0,i.position.lerp(d,.055);const C=i.position.distanceTo(d);i.scale.setScalar(l*.68),i.rotation.y=Math.atan2(d.x-i.position.x,d.z-i.position.z);const P=Math.sin(e*9+c)*.34;o.scale.set(.8,1,.86),a.scale.set(.8,1,.86),o.rotation.z=.08+P,a.rotation.z=-.08-P,C<.09&&(i.userData.mode="perched");return}const f=Number(i.userData.flightStart??0),g=Math.max(0,e-f);d&&e>=Number(i.userData.flightUntil??1/0)&&(i.userData.mode="landing");const v=Number(i.userData.flightCenterX??0),m=Number(i.userData.flightCenterZ??0),p=Number(i.userData.flightStartRadius??i.userData.radius),M=Number(i.userData.flightTargetRadius??i.userData.radius),x=me.smoothstep(g,0,1.35),_=me.lerp(p,M,x),y=Number(i.userData.flightStartAngle??c)+g*(.88+r*.035),E=v+Math.cos(y)*_,T=m+Math.sin(y)*_*.58,A=Kt+5.2+r%3*.42,w=me.lerp(Number(i.userData.flightStartY??A),A,x)+Math.sin(e*.72+c*1.7)*.16;i.position.set(E,w,T),i.visible=!0,i.scale.setScalar(l*.84),i.rotation.y=Math.atan2(-Math.sin(y)*_,Math.cos(y)*_*.58),i.rotation.z=Math.sin(e*.48+c)*.08,o.scale.set(1,1,1),a.scale.set(1,1,1);const S=Math.sin(e*7.2+c*2.3)*.5;o.rotation.z=.08+S,a.rotation.z=-.08-S})),this.reflectionDirty&&(this.renderReflectionTarget(),this.reflectionDirty=!1),this.postProcessingEnabled?this.composer.render():this.renderer.render(this.scene,this.camera)}resize(){const t=this.canvas.getBoundingClientRect(),e=Math.max(1,Math.round(t.width)),n=Math.max(1,Math.round(t.height)),i=e!==this.viewportWidth||n!==this.viewportHeight;this.viewportWidth=e,this.viewportHeight=n;const r=Math.min(e,n)<600?1.5:2,o=Math.min(window.devicePixelRatio||1,r);this.postProcessingEnabled=Math.min(e,n)>=600,this.ssaoPass.enabled=this.postProcessingEnabled,this.renderer.setPixelRatio(o),this.renderer.setSize(e,n,!1),this.waterMaterial.uniforms.harborViewportHeight.value=Math.max(1,this.canvas.height),this.reflectionOverlayMaterial.uniforms.viewportHeight.value=Math.max(1,this.canvas.height),this.reflectionOverlayMaterial.uniforms.viewportWidth.value=Math.max(1,this.canvas.width);const a=Math.min(1,1024/Math.max(1,this.canvas.width),1024/Math.max(1,this.canvas.height)),l=Math.max(1,Math.round(this.canvas.width*a)),c=Math.max(1,Math.round(this.canvas.height*a));this.reflectionRenderTarget.setSize(l,c),this.reflectionOverlayMaterial.uniforms.texelSize.value.set(1/l,1/c);const h=e/n,u=h<.68?.68/h:1,d=h<.68?1.5:1,f=12*u/this.viewZoom;if(this.camera.left=-f*h*d,this.camera.right=f*h*d,this.camera.top=f,this.camera.bottom=-f,this.camera.updateProjectionMatrix(),this.updateCamera(),this.postProcessingEnabled&&(this.composer.setPixelRatio(o),this.composer.setSize(e,n)),!this.fittingTown&&i&&this.fittedBounds){const g=this.viewZoom/Math.max(.001,this.fittedZoom);this.refitTown(this.fittedBounds,g)}}capture(){this.renderReflectionTarget(),this.reflectionDirty=!1,this.postProcessingEnabled?this.composer.render():this.renderer.render(this.scene,this.camera);const t=document.createElement("a");t.download=`harborlight-${new Date().toISOString().slice(0,10)}.png`,t.href=this.canvas.toDataURL("image/png"),t.click()}dispose(){this.canvas.removeEventListener("pointerdown",this.notePointerDown,!0),this.canvas.removeEventListener("pointerup",this.notePointerUp,!0),this.canvas.removeEventListener("pointercancel",this.notePointerUp,!0),this.canvas.removeEventListener("contextmenu",this.preventContextMenu),Rn(this.townRoot),Rn(this.islandFoundationRoot),Rn(this.hoverRoot),Rn(this.birds),Rn(this.ambientWaterRoot),Rn(this.constructionEffectsRoot),this.activeSplashDrops.clear(),this.perchAnchors=[],this.cellGroups.clear(),this.cellLevels.clear(),this.cellKinds.clear(),this.cellSignatures.clear(),this.activeRevealGroups.clear(),this.activeRipples.clear(),this.activeWaterEffects.clear(),this.swayingTrees.clear(),this.reflectionOverlayMaterial.dispose(),this.ssaoPass.dispose(),this.outputPass.dispose(),this.composer.dispose(),this.reflectionRenderTarget.dispose(),this.skyGradientTexture.dispose(),this.noiseTexture.dispose(),this.foamTexture.dispose(),this.waterMaterial.dispose(),this.waterNormals.dispose(),this.waterGeometry.dispose(),this.gridGeometry.dispose(),this.gridMaterial.dispose(),this.renderer.dispose()}fitTownToView(t){const e=new Jn;for(const r of t.cells){if(!r.foundation)continue;const o=t.features.find(l=>l.id===r.id),a=o?.kind==="bridge"?Kt+De.bridgeClearance+De.bridgeDeckThickness+De.bridgeRailHeight:Kt+Math.max(0,o?.level??r.level)*de+.9;for(const[l,c]of We(un(r.x,r.z,!1),-.38))e.expandByPoint(new I(l,-1.15,c)),e.expandByPoint(new I(l,a,c))}const n=new Jn().setFromObject(this.islandFoundationRoot,!0);if(n.isEmpty()||e.union(n),e.expandByScalar(.3),e.isEmpty())return;const i=e.getCenter(new I);this.target.set(i.x,i.y-.4,i.z),this.fittedBounds=e.clone(),this.fittedZoom=1,this.viewZoom=1,this.refitTown(this.fittedBounds,1)}refitTown(t,e){this.fittingTown=!0;try{this.viewZoom=1,this.resize();let n=1/0,i=-1/0,r=1/0,o=-1/0;for(const m of[t.min.x,t.max.x])for(const p of[t.min.y,t.max.y])for(const M of[t.min.z,t.max.z]){const x=new I(m,p,M).project(this.camera);n=Math.min(n,x.x),i=Math.max(i,x.x),r=Math.min(r,x.y),o=Math.max(o,x.y)}const a=Math.max(.001,Math.abs(n),Math.abs(i)),l=Math.max(.001,Math.abs(r),Math.abs(o)),c=this.canvas.getBoundingClientRect(),h=c.width/Math.max(1,c.height)<.8,u=!h&&c.width<1e3&&c.height<500,d=Math.max((h?.3:u?.24:.2)/a,.35/l),f=Math.min((h?.9:u?.92:.98)/a,(h?.9:u?.94:.98)/l),g=Math.min((h?.84:u?.86:.94)/a,(h?.86:u?.9:.94)/l),v=d<=f?me.clamp(g,d,f):f;this.fittedZoom=me.clamp(Math.min(v,f),.25,2.8),this.viewZoom=me.clamp(this.fittedZoom*e,.25,2.8),this.resize()}finally{this.fittingTown=!1}}updateCamera(){const t=Math.max(Math.abs(this.camera.top),Math.abs(this.camera.bottom)),e=Math.max(.1,Math.sin(this.elevation)),n=(t*Math.cos(this.elevation)+te-this.target.y+.75)/e,i=Math.max(30,n);this.scene.fog instanceof Xr&&(this.scene.fog.density=.0062*Math.min(1,30/i));const r=Math.cos(this.elevation)*i;this.camera.position.set(this.target.x+Math.sin(this.azimuth)*r,this.target.y+Math.sin(this.elevation)*i,this.target.z+Math.cos(this.azimuth)*r),this.camera.lookAt(this.target),this.camera.updateMatrixWorld();const o=this.reflectionFadePoint.set(this.target.x,te,this.target.z).project(this.camera),a=me.clamp((o.y+1)*.5-.075,.12,.9),l=me.clamp((this.viewportWidth<600?210:285)/Math.max(1,this.viewportHeight),.2,this.viewportWidth<600?.26:.34);this.reflectionOverlayMaterial.uniforms.fadeNear.value=a,this.reflectionOverlayMaterial.uniforms.fadeFar.value=Math.max(.02,a-l),this.reflectionDirty=!0}}const Yh="harborlight-language",Lv={languageCode:"ENG",languageName:"English",switchLanguage:"Switch to Vietnamese",metaDescription:"Harborlight — a tiny town-building toy.",canvasLabel:"Build and explore an interactive miniature harbor",canvasFallback:"Harborlight requires a browser with canvas support.",hudLabel:"Harborlight controls",loading:"Shaping the shoreline…",fatalTitle:"The harbor could not open.",webglError:"WebGL could not start.",brandTagline:"Shape the shoreline",paletteLabel:"Paint colors",paintLabel:"Paint",paintWith:s=>`Paint with ${s}`,defaultHint:{touch:"Tap to build · Hold to remove · Drag to orbit · Pinch to zoom",desktop:"Click to build · Right-click to remove · Drag to orbit · Scroll to zoom"},menu:{open:"Open settings",close:"Close settings",region:"Town settings",title:"Harbor tools",actionGroup:"History and town actions",undo:"Undo",redo:"Redo",random:"Random",save:"Save",grid:"Building grid",gridShow:"Show building grid",gridHide:"Hide building grid",sound:"Sound",soundOn:"Turn sound on",soundOff:"Turn sound off",help:"How to play",helpShow:"Show help",helpHide:"Hide help",language:"Language",clear:"Clear town",clearValue:"Reset",on:"On",off:"Off",guideValue:"Guide"},help:{close:"Dismiss help",kicker:"Harborlight",title:"Shape the shoreline",touchItems:[["Build","Tap water, foundations, rooftops, or building sides."],["Remove","Press and hold an occupied cell."],["Look around","Drag with one finger."],["Move closer","Pinch with two fingers."]],desktopItems:[["Build","Click water, foundations, rooftops, or building sides."],["Remove","Right-click an occupied cell."],["Look around","Drag the town."],["Move closer","Scroll to zoom."]],shortcutsTouch:"Choose paint at the shore; use the settings dial for history, grid, and sound.",shortcutsDesktop:"Shortcuts: 1–9 choose color · Ctrl/⌘ Z undo · Shift Ctrl/⌘ Z redo",saveNote:"Your town saves automatically on this device.",dismiss:"Start building"},status:{paintSelected:s=>`${s} paint selected`,nothingToRemove:"Nothing here to remove",towerLimit:"That tower has reached its limit",buildingRemoved:"Building removed",foundationPlaced:"New foundation placed",storeyAdded:"Storey added",undone:"Last change undone",restored:"Change restored",townCleared:"The town is clear",randomTown:"A new harbor appeared",postcardReady:"Postcard prepared",soundOn:"Sound on",soundOff:"Sound off",gridOn:"Building grid on",gridOff:"Building grid off",sharedHarborLoaded:"Shared harbor loaded",savedHarborRestored:"Saved harbor restored on this device",languageChanged:"Language: English"},colors:["Poppy","Tangerine","Butter","Citron","Sage","Jade","Lagoon","Sky","Periwinkle","Heather","Rose","Clay","Shell","Limestone","Chalk","Harbor Blue"]},Iv={languageCode:"VIE",languageName:"Tiếng Việt",switchLanguage:"Chuyển sang tiếng Anh",metaDescription:"Harborlight — trò chơi xây thị trấn ven biển thu nhỏ.",canvasLabel:"Xây dựng và khám phá một bến cảng thu nhỏ tương tác",canvasFallback:"Harborlight cần trình duyệt hỗ trợ canvas.",hudLabel:"Bảng điều khiển Harborlight",loading:"Đang tạo dựng bờ biển…",fatalTitle:"Không thể mở bến cảng.",webglError:"Không thể khởi động WebGL.",brandTagline:"Kiến tạo đường bờ biển",paletteLabel:"Màu sơn",paintLabel:"Sơn",paintWith:s=>`Sơn bằng màu ${s}`,defaultHint:{touch:"Chạm để xây · Giữ để xóa · Kéo để xoay · Chụm để thu phóng",desktop:"Nhấp để xây · Chuột phải để xóa · Kéo để xoay · Cuộn để thu phóng"},menu:{open:"Mở cài đặt",close:"Đóng cài đặt",region:"Cài đặt thị trấn",title:"Công cụ bến cảng",actionGroup:"Lịch sử và thao tác thị trấn",undo:"Hoàn tác",redo:"Làm lại",random:"Ngẫu nhiên",save:"Lưu",grid:"Lưới xây dựng",gridShow:"Hiện lưới xây dựng",gridHide:"Ẩn lưới xây dựng",sound:"Âm thanh",soundOn:"Bật âm thanh",soundOff:"Tắt âm thanh",help:"Cách chơi",helpShow:"Hiện hướng dẫn",helpHide:"Ẩn hướng dẫn",language:"Ngôn ngữ",clear:"Xóa thị trấn",clearValue:"Đặt lại",on:"Bật",off:"Tắt",guideValue:"Hướng dẫn"},help:{close:"Đóng hướng dẫn",kicker:"Harborlight",title:"Kiến tạo đường bờ biển",touchItems:[["Xây","Chạm vào mặt nước, móng nhà, mái nhà hoặc mặt bên tòa nhà."],["Xóa","Nhấn giữ một ô đã xây."],["Quan sát","Kéo bằng một ngón tay."],["Thu phóng","Chụm hoặc mở hai ngón tay."]],desktopItems:[["Xây","Nhấp vào mặt nước, móng nhà, mái nhà hoặc mặt bên tòa nhà."],["Xóa","Nhấp chuột phải vào một ô đã xây."],["Quan sát","Kéo để xoay thị trấn."],["Thu phóng","Cuộn để thu phóng."]],shortcutsTouch:"Chọn màu sơn bên trái; dùng nút cài đặt để xem lịch sử, lưới và âm thanh.",shortcutsDesktop:"Phím tắt: 1–9 chọn màu · Ctrl/⌘ Z hoàn tác · Shift Ctrl/⌘ Z làm lại",saveNote:"Thị trấn được tự động lưu trên thiết bị này.",dismiss:"Bắt đầu xây dựng"},status:{paintSelected:s=>`Đã chọn màu ${s}`,nothingToRemove:"Không có gì ở đây để xóa",towerLimit:"Tháp này đã đạt chiều cao tối đa",buildingRemoved:"Đã xóa công trình",foundationPlaced:"Đã đặt móng mới",storeyAdded:"Đã thêm một tầng",undone:"Đã hoàn tác thay đổi gần nhất",restored:"Đã khôi phục thay đổi",townCleared:"Đã xóa thị trấn",randomTown:"Một bến cảng mới đã xuất hiện",postcardReady:"Ảnh bưu thiếp đã sẵn sàng",soundOn:"Đã bật âm thanh",soundOff:"Đã tắt âm thanh",gridOn:"Đã bật lưới xây dựng",gridOff:"Đã tắt lưới xây dựng",sharedHarborLoaded:"Đã tải bến cảng được chia sẻ",savedHarborRestored:"Đã khôi phục thị trấn đã lưu trên thiết bị này",languageChanged:"Ngôn ngữ: Tiếng Việt"},colors:["Đỏ anh túc","Cam quýt","Vàng bơ","Vàng chanh","Xanh xô thơm","Xanh ngọc","Xanh đầm phá","Xanh da trời","Xanh dừa cạn","Tím thạch nam","Hồng hoa","Đỏ đất","Hồng vỏ sò","Đá vôi","Trắng phấn","Xanh hải cảng"]},Nv={languageCode:"KOR",languageName:"한국어",switchLanguage:"한국어로 전환",metaDescription:"Harborlight — 미니어처 항구 마을을 짓는 작은 토이 게임입니다.",canvasLabel:"상호작용하는 미니어처 항구를 짓고 둘러보기",canvasFallback:"Harborlight는 캔버스를 지원하는 브라우저가 필요합니다.",hudLabel:"Harborlight 조작 패널",loading:"해안선을 만드는 중…",fatalTitle:"항구를 열 수 없습니다.",webglError:"WebGL을 시작할 수 없습니다.",brandTagline:"해안선을 빚어보세요",paletteLabel:"페인트 색상",paintLabel:"페인트",paintWith:s=>`${s}로 칠하기`,defaultHint:{touch:"탭하여 짓기 · 길게 눌러 지우기 · 드래그하여 회전 · 핀치하여 줌인",desktop:"클릭하여 짓기 · 우클릭하여 지우기 · 드래그하여 회전 · 스크롤하여 줌인"},menu:{open:"설정 열기",close:"설정 닫기",region:"마을 설정",title:"항구 도구",actionGroup:"기록 및 마을 동작",undo:"실행 취소",redo:"다시 실행",random:"무작위",save:"저장",grid:"건물 격자",gridShow:"건물 격자 표시",gridHide:"건물 격자 숨기기",sound:"소리",soundOn:"소리 켜기",soundOff:"소리 끄기",help:"플레이 방법",helpShow:"도움말 열기",helpHide:"도움말 닫기",language:"언어",clear:"마을 비우기",clearValue:"초기화",on:"켜짐",off:"꺼짐",guideValue:"안내"},help:{close:"도움말 닫기",kicker:"Harborlight",title:"해안선을 빚어보세요",touchItems:[["짓기","물 위, 기초, 옥상, 건물의 옆면을 탭하세요."],["지우기","이미 지어진 칸을 길게 누르세요."],["둘러보기","한 손가락으로 드래그하세요."],["가까이","두 손가락으로 핀치하세요."]],desktopItems:[["짓기","물 위, 기초, 옥상, 건물의 옆면을 클릭하세요."],["지우기","지어진 칸을 우클릭하세요."],["둘러보기","마을을 드래그해 회전하세요."],["가까이","스크롤하여 줌인·줌아웃하세요."]],shortcutsTouch:"왼쪽에서 색을 고르고, 설정 다이얼에서 기록·격자·소리를 조절하세요.",shortcutsDesktop:"단축키: 1–9 색 선택 · Ctrl/⌘ Z 실행 취소 · Shift Ctrl/⌘ Z 다시 실행",saveNote:"마을은 이 기기에 자동으로 저장됩니다.",dismiss:"건설 시작"},status:{paintSelected:s=>`${s} 색 선택됨`,nothingToRemove:"여기엔 지울 것이 없습니다",towerLimit:"이 탑은 최대 높이에 도달했습니다",buildingRemoved:"건물을 지웠습니다",foundationPlaced:"새 기초를 놓았습니다",storeyAdded:"층을 추가했습니다",undone:"마지막 변경을 되돌렸습니다",restored:"변경을 복원했습니다",townCleared:"마을이 비어 있습니다",randomTown:"새 항구가 등장했습니다",postcardReady:"엽서 준비 완료",soundOn:"소리 켜짐",soundOff:"소리 꺼짐",gridOn:"건물 격자 켜짐",gridOff:"건물 격자 꺼짐",sharedHarborLoaded:"공유된 항구를 불러왔습니다",savedHarborRestored:"이 기기에 저장된 항구를 복원했습니다",languageChanged:"언어: 한국어"},colors:["양귀비","귤","버터","레몬그라스","세이지","비취","라군","하늘","페리윙클","히스","로즈","테라코타","셸","라임스톤","초크","항구 블루"]},Uv={en:Lv,vi:Iv,ko:Nv};function Fv(s){return s==="en"||s==="vi"||s==="ko"}function Ys(s){return Uv[s]}function Zh(){try{const t=window.localStorage.getItem(Yh);if(Fv(t))return t}catch{}const s=typeof navigator<"u"?navigator.language.toLowerCase():"";return s.startsWith("ko")?"ko":s.startsWith("vi")?"vi":"en"}function Ov(s){try{window.localStorage.setItem(Yh,s)}catch{}}function Qr(s){const t=Ys(s);document.documentElement.lang=s,document.querySelector('meta[name="description"]')?.setAttribute("content",t.metaDescription),document.querySelector("#world")?.setAttribute("aria-label",t.canvasLabel),document.querySelector("#hud")?.setAttribute("aria-label",t.hudLabel);const e=document.querySelector("#world");e&&(e.textContent=t.canvasFallback);const i=document.querySelector("#loading")?.querySelector("[data-loading-copy]");i&&(i.textContent=t.loading)}const $h="harborlight.help.dismissed.v1",$o="harborlight-grid",Bv="harborlight-sound",zv={name:"Harbor Blue",wall:3571608,wallShadow:2645881,trim:14281179,roof:4743030},Wl=Ae.length>=15?Ae.slice(0,15):[...Ae,zv];let Hv=0;const kv={add:'<path d="M12 5v14M5 12h14"/>',clear:'<path d="M5 7h14M9 7V4.5h6V7m2 0-.7 12H7.7L7 7m3 3v6m4-6v6"/>',close:'<path d="m7 7 10 10M17 7 7 17"/>',grid:'<path d="M5 5h14v14H5zM9.7 5v14M14.3 5v14M5 9.7h14M5 14.3h14"/>',language:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.1 2.3 3.2 5.1 3.2 8.5s-1.1 6.2-3.2 8.5c-2.1-2.3-3.2-5.1-3.2-8.5S9.9 5.8 12 3.5z"/>',help:'<path d="M9.4 9a2.7 2.7 0 1 1 4.1 2.3c-1 .6-1.5 1.2-1.5 2.2"/><path d="M12 17.5h.01"/>',orbit:'<path d="M5.5 9A7 7 0 0 1 18 7.5M18.5 15A7 7 0 0 1 6 16.5"/><path d="m17 4.5 1 3.2-3.2.8M7 19.5l-1-3.2 3.2-.8"/>',random:'<rect x="4.5" y="4.5" width="15" height="15" rx="3"/><circle cx="9" cy="9" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r=".8" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r=".8" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r=".8" fill="currentColor" stroke="none"/>',redo:'<path d="M18 8H9.5a5.5 5.5 0 0 0-5.2 7.3"/><path d="m15 5 3 3-3 3"/>',remove:'<path d="M5 12h14"/>',save:'<path d="M5 4.5h12.2L19.5 7v12.5h-15z"/><path d="M8 4.5v5h8v-5M8 19.5v-6h8v6"/>',settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',sound:'<path d="M5 10v4h3l4 3V7l-4 3zM15 9.2a4 4 0 0 1 0 5.6M17.5 6.8a7.5 7.5 0 0 1 0 10.4"/>',undo:'<path d="M6 8h8.5a5.5 5.5 0 0 1 5.2 7.3"/><path d="m9 5-3 3 3 3"/>',zoom:'<circle cx="10.5" cy="10.5" r="5.5"/><path d="m14.5 14.5 5 5M10.5 7.8v5.4M7.8 10.5h5.4"/>'};function kr(s){return`<svg class="hud-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${kv[s]}</svg>`}function Gv(s){return`#${s.toString(16).padStart(6,"0")}`}function Xl(s,t){try{const e=window.localStorage.getItem(s);return e===null?t:e!=="off"&&e!=="false"}catch{return t}}function ql(s,t){try{window.localStorage.setItem(s,t?"on":"off")}catch{}}function bn(s,t,e,n){const i=document.createElement("button");return i.type="button",i.className=s,i.setAttribute("aria-label",t),i.innerHTML=`${kr(e)}${n?`<span class="action-label" aria-hidden="true">${n}</span>`:""}`,i}function Vv(){try{return window.localStorage.getItem($h)==="true"}catch{return!1}}function Yl(){try{window.localStorage.setItem($h,"true")}catch{}}function Wv(s,t){const e=new AbortController,{signal:n}=e,i=++Hv,r=`harbor-help-title-${i}`,o=`harbor-help-${i}`,a=`harbor-menu-${i}`,l=window.matchMedia("(hover: none), (pointer: coarse)").matches;let c=Zh(),h=Ys(c);Qr(c);const u=()=>l?h.defaultHint.touch:h.defaultHint.desktop;let d=0,f=Xl(Bv,!0),g=Xl($o,!1),v=!1,m=0,p=0,M=0,x=0;s.replaceChildren(),s.classList.add("hud-root");const _=document.createElement("div");_.className="palette-wrap";const y=document.createElement("div");y.className="palette-rail",y.setAttribute("role","toolbar"),y.setAttribute("aria-label",h.paletteLabel),y.setAttribute("aria-orientation","vertical");const E=document.createElement("div");E.className="palette-name",E.setAttribute("aria-hidden","true");const T=Wl.map((N,Z)=>{const k=document.createElement("button"),vt=document.createElement("span");return k.type="button",k.className="color-button",k.dataset.colorIndex=String(Z),k.title=h.colors[Z]??N.name,k.tabIndex=Z===d?0:-1,k.setAttribute("aria-label",h.paintWith(h.colors[Z]??N.name)),k.setAttribute("aria-pressed",String(Z===d)),k.style.setProperty("--paint",Gv(N.wall)),vt.className="color-chip",vt.setAttribute("aria-hidden","true"),k.append(vt),y.append(k),k});E.textContent=h.colors[d]??h.paintLabel,_.append(y,E);const A=()=>{const N=y.scrollWidth>y.clientWidth+1,Z=N?y.scrollWidth-y.clientWidth:y.scrollHeight-y.clientHeight,k=N?y.scrollLeft:y.scrollTop;_.classList.toggle("has-more-above",k>1),_.classList.toggle("has-more-below",Z>1&&k<Z-1)};y.addEventListener("scroll",A,{passive:!0,signal:n}),window.addEventListener("resize",A,{signal:n}),requestAnimationFrame(()=>requestAnimationFrame(A));const w=new ResizeObserver(A);w.observe(y);const S=document.createElement("div");S.className="hud-menu";const C=bn("menu-toggle",h.menu.open,"settings");C.setAttribute("aria-expanded","false"),C.setAttribute("aria-controls",a);const P=document.createElement("div");P.id=a,P.className="menu-panel",P.setAttribute("role","region"),P.setAttribute("aria-label",h.menu.region),P.hidden=!0;const U=document.createElement("p"),z=document.createElement("div");z.className="menu-brand",z.innerHTML=`<span class="menu-brand-mark" aria-hidden="true">H</span><span class="menu-brand-copy"><strong>Harborlight</strong><small>${h.brandTagline}</small></span>`,U.className="menu-title",U.textContent=h.menu.title;const F=document.createElement("div");F.className="menu-actions",F.setAttribute("role","group"),F.setAttribute("aria-label",h.menu.actionGroup);const H=bn("tool-button",h.menu.undo,"undo",h.menu.undo),q=bn("tool-button",h.menu.redo,"redo",h.menu.redo),O=bn("tool-button",h.menu.random,"random",h.menu.random),W=bn("tool-button",h.menu.save,"save",h.menu.save);H.disabled=!0,q.disabled=!0,F.append(H,q,O,W);const tt=bn("menu-item",h.menu.gridShow,"grid");tt.setAttribute("aria-pressed",String(g)),tt.innerHTML+=`<span class="menu-label">${h.menu.grid}</span><span class="menu-value">${g?h.menu.on:h.menu.off}</span>`;const et=bn("menu-item",f?h.menu.soundOff:h.menu.soundOn,"sound");et.setAttribute("aria-pressed",String(f)),et.innerHTML+=`<span class="menu-label">${h.menu.sound}</span><span class="menu-value">${f?h.menu.on:h.menu.off}</span>`;const ct=bn("menu-item",h.switchLanguage,"language");ct.innerHTML+=`<span class="menu-label">${h.menu.language}</span><span class="menu-value">${h.languageCode}</span>`;const _t=bn("menu-item",h.menu.helpShow,"help");_t.setAttribute("aria-controls",o),_t.setAttribute("aria-expanded","false"),_t.innerHTML+=`<span class="menu-label">${h.menu.help}</span><span class="menu-value">${h.menu.guideValue}</span>`;const bt=bn("menu-item menu-item-danger",h.menu.clear,"clear");bt.innerHTML+=`<span class="menu-label">${h.menu.clear}</span><span class="menu-value">${h.menu.clearValue}</span>`,P.append(z,U,F,tt,et,ct,_t,bt),S.append(C,P);const yt=document.createElement("div");yt.className="hud-status",yt.setAttribute("role","status"),yt.setAttribute("aria-live","polite"),yt.setAttribute("aria-atomic","true"),yt.hidden=!0;const Y=document.createElement("div");Y.className="hud-hint",Y.setAttribute("aria-live","polite"),Y.setAttribute("aria-atomic","true"),Y.textContent=u();const K=document.createElement("section");K.id=o,K.className="help-card",K.setAttribute("role","dialog"),K.setAttribute("aria-modal","false"),K.setAttribute("aria-labelledby",r),K.hidden=!0;const ut=bn("help-close",h.help.close,"close"),Q=document.createElement("div");Q.className="help-heading",Q.innerHTML=`<p class="help-kicker">${h.help.kicker}</p><h1 id="${r}">${h.help.title}</h1>`;const ot=document.createElement("ul");ot.className="help-list";const At=[];for(const N of["add","remove","orbit","zoom"]){const Z=document.createElement("li"),k=document.createElement("span"),vt=document.createElement("strong"),ht=document.createElement("span");k.append(vt,ht),Z.innerHTML=`<span class="help-gesture">${kr(N)}</span>`,Z.append(k),At.push({title:vt,description:ht}),ot.append(Z)}const qt=document.createElement("p");qt.className="help-shortcuts";const L=document.createElement("p");L.className="help-save-note",L.innerHTML=`${kr("save")}<span>${h.help.saveNote}</span>`;const rt=document.createElement("button");rt.type="button",rt.className="help-dismiss",rt.textContent=h.help.dismiss,K.append(ut,Q,ot,qt,L,rt),s.append(_,S,yt,Y,K);const st=N=>{window.cancelAnimationFrame(p),p=window.requestAnimationFrame(()=>N.focus({preventScroll:!0}))},nt=N=>{window.clearTimeout(M),yt.textContent=N,yt.hidden=N.length===0,N.length>0&&(M=window.setTimeout(()=>{yt.hidden=!0},2200))},it=N=>{window.clearTimeout(x),x=window.setTimeout(()=>{Y.hidden=!0,x=0},N)},dt=(N,Z=!1)=>{if(S.classList.toggle("is-open",N),P.hidden=!N,C.setAttribute("aria-expanded",String(N)),C.setAttribute("aria-label",N?h.menu.close:h.menu.open),N&&Z){const k=P.querySelector("button:not(:disabled)");k&&st(k)}},lt=(N,Z,k=!1)=>{K.hidden=!N,_t.setAttribute("aria-expanded",String(N)),_t.setAttribute("aria-label",N?h.menu.helpHide:h.menu.helpShow),Z&&t.onToggleHelp(),N&&k&&st(ut)},gt=(N,Z,k=Z)=>{N.setAttribute("aria-label",Z);const vt=N.querySelector(".action-label");vt&&(vt.textContent=k)},Ht=N=>{c=N,h=Ys(c),Qr(c),y.setAttribute("aria-label",h.paletteLabel),T.forEach((k,vt)=>{const ht=h.colors[vt]??Wl[vt]?.name??h.paintLabel;k.title=ht,k.setAttribute("aria-label",h.paintWith(ht))}),E.textContent=h.colors[d]??h.paintLabel,C.setAttribute("aria-label",P.hidden?h.menu.open:h.menu.close),P.setAttribute("aria-label",h.menu.region),U.textContent=h.menu.title,F.setAttribute("aria-label",h.menu.actionGroup),gt(H,h.menu.undo),gt(q,h.menu.redo),gt(O,h.menu.random),gt(W,h.menu.save),tt.setAttribute("aria-label",g?h.menu.gridHide:h.menu.gridShow),tt.querySelector(".menu-label").textContent=h.menu.grid,tt.querySelector(".menu-value").textContent=g?h.menu.on:h.menu.off,et.setAttribute("aria-label",f?h.menu.soundOff:h.menu.soundOn),et.querySelector(".menu-label").textContent=h.menu.sound,et.querySelector(".menu-value").textContent=f?h.menu.on:h.menu.off,ct.setAttribute("aria-label",h.switchLanguage),ct.querySelector(".menu-label").textContent=h.menu.language,ct.querySelector(".menu-value").textContent=h.languageCode,_t.setAttribute("aria-label",K.hidden?h.menu.helpShow:h.menu.helpHide),_t.querySelector(".menu-label").textContent=h.menu.help,_t.querySelector(".menu-value").textContent=h.menu.guideValue,bt.setAttribute("aria-label",h.menu.clear),bt.querySelector(".menu-label").textContent=h.menu.clear,bt.querySelector(".menu-value").textContent=h.menu.clearValue,z.querySelector(".menu-brand-copy small").textContent=h.brandTagline,ut.setAttribute("aria-label",h.help.close),Q.innerHTML=`<p class="help-kicker">${h.help.kicker}</p><h1 id="${r}">${h.help.title}</h1>`,(l?h.help.touchItems:h.help.desktopItems).forEach(([k,vt],ht)=>{const Pt=At[ht];Pt&&(Pt.title.textContent=k,Pt.description.textContent=vt)}),qt.textContent=l?h.help.shortcutsTouch:h.help.shortcutsDesktop,L.innerHTML=`${kr("save")}<span>${h.help.saveNote}</span>`,rt.textContent=h.help.dismiss,Y.textContent=u()};Ht(c);const Bt=(N,Z)=>{!Number.isInteger(N)||N<0||N>=T.length||(d=N,T.forEach((k,vt)=>{const ht=vt===d;k.tabIndex=ht?0:-1,k.setAttribute("aria-pressed",String(ht))}),E.textContent=h.colors[d]??h.paintLabel,T[d]?.scrollIntoView({block:"nearest",inline:"nearest"}),Z&&t.onColor(d))},D=N=>{if(!(N.target instanceof Element))return null;const Z=N.target.closest(".color-button");return Z&&y.contains(Z)?Z:null},b=(N,Z,k,vt)=>{N.setAttribute("aria-pressed",String(Z)),N.setAttribute("aria-label",Z?k:vt);const ht=N.querySelector(".menu-value");ht&&(ht.textContent=Z?h.menu.on:h.menu.off)};y.addEventListener("click",N=>{const Z=D(N);Z&&Bt(Number(Z.dataset.colorIndex),!0)},{signal:n}),y.addEventListener("focusin",N=>{const Z=D(N),k=Z?Number(Z.dataset.colorIndex):d;E.textContent=h.colors[k]??h.paintLabel},{signal:n}),y.addEventListener("pointerover",N=>{const Z=D(N),k=Z?Number(Z.dataset.colorIndex):d;E.textContent=h.colors[k]??h.paintLabel},{signal:n}),y.addEventListener("pointerleave",()=>{E.textContent=h.colors[d]??h.paintLabel},{signal:n}),y.addEventListener("focusout",N=>{(!(N.relatedTarget instanceof Node)||!y.contains(N.relatedTarget))&&(E.textContent=h.colors[d]??h.paintLabel)},{signal:n}),y.addEventListener("keydown",N=>{const Z=D(N);if(!Z)return;const k=Number(Z.dataset.colorIndex);let vt=null;N.key==="ArrowDown"||N.key==="ArrowRight"?vt=(k+1)%T.length:N.key==="ArrowUp"||N.key==="ArrowLeft"?vt=(k-1+T.length)%T.length:N.key==="Home"?vt=0:N.key==="End"&&(vt=T.length-1),vt!==null&&(N.preventDefault(),Bt(vt,!0),T[vt]?.focus({preventScroll:!0}))},{signal:n}),H.addEventListener("click",()=>t.onUndo(),{signal:n}),q.addEventListener("click",()=>t.onRedo(),{signal:n}),O.addEventListener("click",()=>{dt(!1),t.onRandomTown()},{signal:n}),W.addEventListener("click",()=>{dt(!1),t.onSaveImage()},{signal:n}),C.addEventListener("click",()=>dt(P.hidden,!0),{signal:n}),ct.addEventListener("click",()=>{const N=["en","vi","ko"],Z=N.indexOf(c),k=N[(Z+1)%N.length]??"en";Ov(k),dt(!1),Ht(k),t.onLanguageChange?.(k),nt(h.status.languageChanged)},{signal:n}),tt.addEventListener("click",()=>{g=!g,ql($o,g),b(tt,g,h.menu.gridHide,h.menu.gridShow),t.onToggleGrid?.(g),nt(g?h.status.gridOn:h.status.gridOff)},{signal:n}),et.addEventListener("click",()=>{f=!f,b(et,f,h.menu.soundOff,h.menu.soundOn),t.onToggleSound(f),nt(f?h.status.soundOn:h.status.soundOff)},{signal:n}),bt.addEventListener("click",()=>{dt(!1),t.onClear()},{signal:n}),_t.addEventListener("click",()=>{const N=K.hidden;dt(!1),lt(N,!0,N)},{signal:n});const G=()=>{Yl(),lt(!1,!0),st(C)};return ut.addEventListener("click",G,{signal:n}),rt.addEventListener("click",G,{signal:n}),document.addEventListener("pointerdown",N=>{!P.hidden&&N.target instanceof Node&&!S.contains(N.target)&&dt(!1)},{signal:n}),document.addEventListener("keydown",N=>{N.key==="Escape"&&(K.hidden?P.hidden||(dt(!1),st(C),N.preventDefault()):(Yl(),lt(!1,!0),st(C),N.preventDefault()))},{signal:n}),lt(!Vv(),!1),it(4400),{setColor(N){v||Bt(N,!1)},setGrid(N){v||(g=N,ql($o,N),b(tt,N,h.menu.gridHide,h.menu.gridShow))},setHistory(N,Z){v||(H.disabled=!N,q.disabled=!Z)},setStatus(N){v||nt(N)},showHint(N){v||(Y.textContent=N||u(),Y.hidden=!1,it(N?3200:4400))},hideLoading(){if(v)return;const N=document.getElementById("loading");if(!N||N.hidden||N.classList.contains("is-leaving"))return;if(N.setAttribute("aria-hidden","true"),window.matchMedia("(prefers-reduced-motion: reduce)").matches){N.hidden=!0;return}const Z=()=>{N.hidden=!0,window.clearTimeout(m),m=0};N.classList.add("is-leaving"),N.addEventListener("transitionend",Z,{once:!0,signal:n}),m=window.setTimeout(Z,700)},dispose(){v||(v=!0,w.disconnect(),e.abort(),window.clearTimeout(m),window.clearTimeout(M),window.clearTimeout(x),window.cancelAnimationFrame(p),s.classList.remove("hud-root"),s.replaceChildren())}}}const Ds="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",Zl=[["north",0,-1],["east",1,0],["south",0,1],["west",-1,0]];function dn(s,t){return`${s},${t}`}function Ya(s){const t=/^(-?\d+),(-?\d+)$/.exec(s);if(t===null)return null;const e=Number(t[1]),n=Number(t[2]);return Number.isSafeInteger(e)&&Number.isSafeInteger(n)?[e,n]:null}function $l(s,t){return s.x-t.x||s.z-t.z}function Za(s,t){const e=Ya(s),n=Ya(t);return e===null||n===null?s.localeCompare(t):e[0]-n[0]||e[1]-n[1]}function wi(s,t){return Number.isInteger(s)&&Number.isInteger(t)&&s*s+t*t<=Ge*Ge}function Ls(s){return Number.isInteger(s)&&s>=0&&s<Ae.length}function Qi(s){let t=0;for(const e of s.storeys.keys())t=Math.max(t,e);return t}function Ko(s){return s.storeys.get(Qi(s))??s.foundationColor}function Xv(s){return new Map([...s].map(([t,e])=>[t,{...e,storeys:new Map(e.storeys)}]))}function qv(s,t){if(s.size!==t.size)return!1;for(const[e,n]of s){const i=t.get(e);if(i===void 0||i.foundation!==n.foundation||i.foundationColor!==n.foundationColor||i.storeys.size!==n.storeys.size||[...n.storeys].some(([r,o])=>i.storeys.get(r)!==o))return!1}return!0}function Jo(s,t){const e=new Set;for(const[n,i]of s){const r=t.get(n);(r===void 0||r.foundation!==i.foundation||r.foundationColor!==i.foundationColor||r.storeys.size!==i.storeys.size||[...i.storeys].some(([o,a])=>r.storeys.get(o)!==a))&&e.add(n)}for(const n of t.keys())s.has(n)||e.add(n);return[...e].sort(Za)}function Kl(){const s=new Map;for(const t of lu){if(!t.foundation||!wi(t.x,t.z)||t.level<0||t.level>Vn||!Ls(t.color))continue;const e=new Map;for(let n=1;n<=t.level;n+=1)e.set(n,t.color);s.set(dn(t.x,t.z),{x:t.x,z:t.z,foundation:!0,foundationColor:t.color,storeys:e})}return s}function Yv(s){let t="";for(let e=0;e<s.length;e+=3){const n=s[e]??0,i=s[e+1],r=s[e+2];t+=Ds.charAt(n>>>2&63),t+=Ds.charAt((n&3)<<4|(i??0)>>>4),i!==void 0&&(t+=Ds.charAt((i&15)<<2|(r??0)>>>6)),r!==void 0&&(t+=Ds.charAt(r&63))}return t}function Zv(s){if(!/^[A-Za-z0-9_-]*$/.test(s)||s.length%4===1)return null;const t=[];let e=0,n=0;for(const i of s){const r=Ds.indexOf(i);if(r<0)return null;e=e<<6|r,n+=6,n>=8&&(n-=8,t.push(e>>>n&255),e&=(1<<n)-1)}return e!==0?null:Uint8Array.from(t)}function $v(s){let t=s>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}class Kv{world;revision=0;undoHistory=[];redoHistory=[];features=new Map;dirtyCellIds=[];constructor(){this.world=Kl(),this.refreshAllFeatures()}seedDefault(){this.replaceWorld(Kl())}add(t,e,n,i){if(!wi(t,e)||!Ls(n)||i!==void 0&&(!Number.isInteger(i)||i<1||i>Vn))return!1;const r=dn(t,e),o=this.world.get(r);if(i===void 0&&o===void 0)this.recordCurrentForUndo(),this.world.set(r,{x:t,z:e,foundation:!0,foundationColor:n,storeys:new Map});else{const a=i??Qi(o)+1;if(a>Vn||o?.storeys.has(a))return!1;this.recordCurrentForUndo();const l=new Map(o?.storeys);l.set(a,n),this.world.set(r,{x:t,z:e,foundation:o?.foundation??!1,foundationColor:o?.foundationColor??n,storeys:l})}return this.revision+=1,this.recomputeDirtyNeighborhood([r]),!0}paint(t,e,n){return this.add(t,e,n)}remove(t,e,n){if(!wi(t,e)||n!==void 0&&(!Number.isInteger(n)||n<1||n>Vn))return!1;const i=dn(t,e),r=this.world.get(i);if(r===void 0)return!1;const o=n??Qi(r);if(o>0&&!r.storeys.has(o)||o===0&&!r.foundation)return!1;this.recordCurrentForUndo();const a=new Map(r.storeys);o>0&&a.delete(o);const l=o===0?!1:r.foundation;return!l&&a.size===0?this.world.delete(i):this.world.set(i,{...r,foundation:l,storeys:a}),this.revision+=1,this.recomputeDirtyNeighborhood([i]),!0}clear(){this.world.size>0&&this.replaceWorld(new Map)}randomTown(t){const e=t===void 0?Date.now()>>>0:Number.isFinite(t)?Math.trunc(t)>>>0:0,n=$v(e),i=new Map,r=Math.floor(n()*4),o=n()<.5,a=(l,c)=>{let h=o?-l:l,u=c;for(let d=0;d<r;d+=1)[h,u]=[-u,h];return[h,u]};for(let l=-3;l<=3;l+=1)for(let c=-3;c<=3;c+=1){if(Math.abs(l)+Math.abs(c)>5||l===0&&c<=1||l===1&&c===1)continue;const[h,u]=a(l,c);if(!wi(h,u))continue;const d=Math.min(Vn,1+Math.floor(n()*3)),f=Math.floor(n()*Ae.length),g=new Map;for(let v=1;v<=d;v+=1)g.set(v,f);i.set(dn(h,u),{x:h,z:u,foundation:!0,foundationColor:f,storeys:g})}this.replaceWorld(i)}snapshot(){const t=[...this.world.values()].sort($l).map(n=>({id:dn(n.x,n.z),x:n.x,z:n.z,foundation:n.foundation,level:Qi(n),color:Ko(n),storeys:[...n.storeys].sort(([i],[r])=>i-r).map(([i,r])=>({level:i,color:r}))})),e=t.map(n=>this.features.get(n.id)).filter(n=>n!==void 0);return{cells:t,features:e,revision:this.revision}}getCell(t,e){if(!wi(t,e))return;const n=this.world.get(dn(t,e));if(n!==void 0)return{id:dn(t,e),x:t,z:e,foundation:n.foundation,level:Qi(n),color:Ko(n),storeys:[...n.storeys].sort(([i],[r])=>i-r).map(([i,r])=>({level:i,color:r}))}}getHeight(t,e){return this.getCell(t,e)?.level??0}getDirtyCellIds(){return this.dirtyCellIds}recomputeDirtyNeighborhood(t){const e=new Set;for(const i of t){const r=Ya(i);if(r!==null){e.add(i);for(const[,o,a]of Zl)e.add(dn(r[0]+o,r[1]+a))}}const n=[...e].sort(Za);for(const i of n){const r=this.world.get(i);r===void 0?this.features.delete(i):this.features.set(i,this.deriveFeature(r))}return this.dirtyCellIds=n,n}canUndo(){return this.undoHistory.length>0}canRedo(){return this.redoHistory.length>0}undo(){const t=this.undoHistory.pop();if(t===void 0)return!1;const e=Jo(this.world,t);return this.redoHistory.push(this.world),this.world=t,this.revision+=1,this.recomputeDirtyNeighborhood(e),!0}redo(){const t=this.redoHistory.pop();if(t===void 0)return!1;const e=Jo(this.world,t);return this.undoHistory.push(this.world),this.world=t,this.revision+=1,this.recomputeDirtyNeighborhood(e),!0}serialize(){const t=[...this.world.values()].sort($l),e=5+t.reduce((r,o)=>r+5+o.storeys.size,0),n=new Uint8Array(e);n[0]=js[0],n[1]=js[1],n[2]=ho,n[3]=255,n[4]=t.length;let i=5;for(const r of t){let o=0;for(const a of r.storeys.keys())o|=1<<a-1;n[i++]=r.x+Ge,n[i++]=r.z+Ge,n[i++]=r.foundation?1:0,n[i++]=r.foundationColor,n[i++]=o;for(let a=1;a<=Vn;a+=1){const l=r.storeys.get(a);l!==void 0&&(n[i++]=l)}}return Yv(n)}deserialize(t,e=!0){if(typeof t!="string")return!1;const n=Zv(t);if(n===null||n.length<5||n[0]!==js[0]||n[1]!==js[1]||n[2]!==2&&n[2]!==ho)return!1;const i=n[2],r=new Map;if(i===ho&&n[3]===255){const o=n[4]??0;let a=5;for(let l=0;l<o;l+=1){if(a+5>n.length)return!1;const c=(n[a++]??0)-Ge,h=(n[a++]??0)-Ge,u=n[a++],d=n[a++],f=n[a++];if(!wi(c,h)||u!==0&&u!==1||d===void 0||!Ls(d)||f===void 0||f>>>Vn)return!1;const g=new Map;for(let m=1;m<=Vn;m+=1){if((f&1<<m-1)===0)continue;const p=n[a++];if(p===void 0||!Ls(p))return!1;g.set(m,p)}if(u===0&&g.size===0)return!1;const v=dn(c,h);if(r.has(v))return!1;r.set(v,{x:c,z:h,foundation:u===1,foundationColor:d,storeys:g})}if(a!==n.length)return!1}else if(i===2){const o=(n[3]??0)<<8|(n[4]??0);if(n.length!==5+o*5)return!1;let a=5;for(let l=0;l<o;l+=1){const c=(n[a++]??0)-Ge,h=(n[a++]??0)-Ge,u=n[a++],d=n[a++],f=n[a++];if(u!==1||!wi(c,h)||d===void 0||d>Vn||f===void 0||!Ls(f))return!1;const g=dn(c,h);if(r.has(g))return!1;const v=new Map;for(let m=1;m<=d;m+=1)v.set(m,f);r.set(g,{x:c,z:h,foundation:!0,foundationColor:f,storeys:v})}}else return!1;return this.replaceWorld(r,e),!0}deriveFeature(t){const e=Qi(t),n={},i=new Set,r={};for(const[u,d,f]of Zl){const g=this.world.get(dn(t.x+d,t.z+f));g!==void 0&&(n[u]=dn(g.x,g.z),g.foundation&&i.add(u)),r[u]=e===0?g?.foundation!==!0:g?.storeys.has(e)!==!0}const o=i.size,a=i.has("north")&&i.has("south"),l=i.has("east")&&i.has("west");let c=e===0?"foundation":"house",h;return e===0&&o>=3?c="courtyard":e===0&&a&&!i.has("east")&&!i.has("west")?(c="bridge",h=["north","south"]):e===0&&l&&!i.has("north")&&!i.has("south")&&(c="bridge",h=["east","west"]),{id:dn(t.x,t.z),kind:c,level:e,color:Ko(t),storeys:[...t.storeys].sort(([u],[d])=>u-d).map(([u,d])=>({level:u,color:d})),neighbors:n,exposed:r,bridgeSpan:h}}recordCurrentForUndo(){this.undoHistory.push(Xv(this.world)),this.redoHistory.length=0}replaceWorld(t,e=!0){if(qv(this.world,t))return!1;const n=Jo(this.world,t);return e?this.undoHistory.push(this.world):(this.undoHistory.length=0,this.redoHistory.length=0),this.redoHistory.length=0,this.world=t,this.revision+=1,this.recomputeDirtyNeighborhood(n),!0}refreshAllFeatures(){this.features.clear();const t=[...this.world.keys()].sort(Za);for(const e of t){const n=this.world.get(e);n!==void 0&&this.features.set(e,this.deriveFeature(n))}this.dirtyCellIds=t}}const Xe=document.querySelector("#world"),_c=document.querySelector("#hud");if(!Xe||!_c)throw new Error("Harborlight could not find its canvas or interface root.");let Os=Zh(),Be=Ys(Os);Qr(Os);Xe.tabIndex=0;const xc=s=>{try{return window.localStorage.getItem(s)}catch{return null}},oo=(s,t)=>{try{window.localStorage.setItem(s,t)}catch{}},Mc="harborlight-world.v1",ge=new Kv,Ne=new cu;let Me,Le,Ve=Number.parseInt(xc("harborlight-color")??"0",10);(!Number.isInteger(Ve)||Ve<0||Ve>=Ae.length)&&(Ve=0);const Jl=location.hash.length>1?location.hash.slice(1):"",jl=xc(Mc);let $a="default";Jl&&ge.deserialize(Jl,!1)?$a="hash":jl&&ge.deserialize(jl,!1)?$a="local":ge.seedDefault();let Li=null,In=!1,hi=null,Bs=0;const xn=new Map;let zs=0,rs=!1,jo=0;const Jv=()=>{const s=ge.serialize();oo(Mc,s),location.hash.slice(1)!==s&&history.replaceState(null,"",`#${s}`)},ci=(s=!0)=>{Me.sync(ge.snapshot(),s),Le.setHistory(ge.canUndo(),ge.canRedo()),Jv()},Kh=()=>{const s=Ae[Ve];s&&(Le.setColor(Ve),Le.setStatus(Be.status.paintSelected(Be.colors[Ve]??s.name)),Me.setHover(Li,Ve,!1))},jv=(s,t)=>{const e=ge.getCell(s.x,s.z),n=e?.level??0,i=ge.snapshot().features.find(c=>c.id===s.id);if(!(t?ge.remove(s.x,s.z,s.face==="side"&&s.level>0?s.level:void 0):ge.add(s.x,s.z,Ve,s.placementLevel))){Ne.ui(190),Le.showHint(t?Be.status.nothingToRemove:Be.status.towerLimit);return}const o=ge.getCell(s.x,s.z),a=ge.snapshot().features.find(c=>c.id===s.id);if(t)Ne.remove(n),Le.setStatus(Be.status.buildingRemoved);else{const c=e===void 0&&s.placementLevel===void 0;c?Ne.foundation(Ve):Ne.build(Ve,o?.level??n+1),a?.kind==="bridge"&&i?.kind!=="bridge"&&Ne.bridge(a.bridgeSpan?.length??1),Le.setStatus(c?Be.status.foundationPlaced:Be.status.storeyAdded)}const l=Me.notifyConstruction(s.x,s.z);ci(),Ne.water(t?.48:s.kind==="water"?.92:.58),l&&Ne.birdTakeoff(),Li=Me.pick(yc,Sc,!t),Me.setHover(Li,Ve,t)};Le=Wv(_c,{onColor(s){Ve=s,oo("harborlight-color",String(s)),Ne.ui(440+s*18),Kh()},onUndo(){ge.undo()&&(Ne.ui("undo"),ci(),Le.setStatus(Be.status.undone))},onRedo(){ge.redo()&&(Ne.ui("redo"),ci(),Le.setStatus(Be.status.restored))},onClear(){ge.snapshot().cells.length!==0&&(ge.clear(),Ne.remove(1),ci(!1),Le.setStatus(Be.status.townCleared))},onRandomTown(){ge.randomTown(Date.now()&2147483647),Ne.ui(620),ci(!1),Le.setStatus(Be.status.randomTown)},onSaveImage(){Ne.ui("save"),Me.capture(),Le.setStatus(Be.status.postcardReady)},onToggleSound(s){Ne.setEnabled(s),s&&Ne.ui("open")},onToggleHelp(){Ne.ui("open")},onToggleGrid(s){Me&&Me.setGrid(s),Ne.ui(s?"grid-on":"grid-off")},onLanguageChange(s){Os=s,Be=Ys(Os),Qr(Os),Ne.ui("open")}});try{Me=new Dv(Xe)}catch(s){const t=s instanceof Error?s.message:Be.webglError,e=document.getElementById("loading");throw e&&(e.hidden=!0,e.setAttribute("aria-hidden","true")),_c.innerHTML=`<section class="fatal" role="alert"><strong>${Be.fatalTitle}</strong><span>${t}</span></section>`,s}const Qv=xc("harborlight-grid")==="on";Me.setGrid(Qv);ci(!1);Le.setColor(Ve);Le.setHistory(ge.canUndo(),ge.canRedo());$a==="local"&&Le.setStatus(Be.status.savedHarborRestored);let yc=innerWidth/2,Sc=innerHeight/2;Xe.addEventListener("pointerdown",s=>{if(Ne.unlock(),yc=s.clientX,Sc=s.clientY,xn.set(s.pointerId,{x:s.clientX,y:s.clientY,downAt:performance.now()}),Xe.setPointerCapture(s.pointerId),Xe.classList.add("is-orbiting"),xn.size===1){if(hi=s.pointerId,In=!1,Me.beginPointer(s.clientX,s.clientY),rs=!1,window.clearTimeout(zs),s.pointerType==="touch"){const t=s.pointerId;zs=window.setTimeout(()=>{if(hi!==t||In||xn.size!==1)return;const e=xn.get(t);if(!e)return;const n=Me.pick(e.x,e.y);!n||ge.getCell(n.x,n.z)===void 0||(rs=!0,Li=n,Me.setHover(n,Ve,!0),Xe.classList.add("is-removing"))},380)}}else{Me.endPointer(),hi=null,In=!0,window.clearTimeout(zs),rs=!1,Xe.classList.remove("is-removing");const[t,e]=[...xn.values()];Bs=t&&e?Math.hypot(t.x-e.x,t.y-e.y):0}});Xe.addEventListener("pointermove",s=>{yc=s.clientX,Sc=s.clientY;const t=xn.get(s.pointerId);if(t&&(t.x=s.clientX,t.y=s.clientY),xn.size>=2){const[e,n]=[...xn.values()];if(e&&n){const i=Math.hypot(e.x-n.x,e.y-n.y);Bs>0&&Me.zoom((Bs-i)*1.7),Bs=i,In=!0}}else if(hi===s.pointerId){const e=Me.movePointer(s.clientX,s.clientY);In||=e.dragged,In&&(window.clearTimeout(zs),rs=!1,Xe.classList.remove("is-removing"))}Li=Me.pick(s.clientX,s.clientY,!s.shiftKey),Me.setHover(In?null:Li,Ve,s.shiftKey)});const Jh=(s,t=!1)=>{if(!xn.get(s.pointerId))return;const n=xn.size===1,i=hi===s.pointerId,r=rs;if(window.clearTimeout(zs),rs=!1,Xe.classList.remove("is-removing"),xn.delete(s.pointerId),n&&i){Me.endPointer();const a=s.button===2||s.shiftKey||r;if(!t&&!In){const l=Me.pick(s.clientX,s.clientY,!a);l&&jv(l,a)}}const o=xn.entries().next().value;o?(hi=o[0],In=!0,Me.beginPointer(o[1].x,o[1].y)):(hi=null,Bs=0,In=!1,Xe.classList.remove("is-orbiting"))};Xe.addEventListener("pointerup",s=>Jh(s));Xe.addEventListener("pointercancel",s=>Jh(s,!0));Xe.addEventListener("pointerleave",()=>{hi===null&&(Li=null,Me.setHover(null,Ve,!1))});Xe.addEventListener("contextmenu",s=>s.preventDefault());Xe.addEventListener("wheel",s=>{s.preventDefault();const t=s.deltaMode===1?16:s.deltaMode===2?innerHeight:1;Me.zoom(s.deltaY*t)},{passive:!1});document.addEventListener("keydown",s=>{if(!s.target?.matches("input, textarea, select")){if((s.metaKey||s.ctrlKey)&&s.key.toLowerCase()==="z"){s.preventDefault(),(s.shiftKey?ge.redo():ge.undo())&&(ci(),Le.setStatus(s.shiftKey?Be.status.restored:Be.status.undone));return}if((s.metaKey||s.ctrlKey)&&s.key.toLowerCase()==="y"){s.preventDefault(),ge.redo()&&(ci(),Le.setStatus(Be.status.restored));return}if(s.key>="1"&&s.key<="9"){const e=Number(s.key)-1;e<Ae.length&&(Ve=e,oo("harborlight-color",String(e)),Ne.ui(440+e*18),Kh())}}});window.addEventListener("hashchange",()=>{const s=location.hash.slice(1);s&&ge.deserialize(s)&&(Me.sync(ge.snapshot(),!1),Le.setHistory(ge.canUndo(),ge.canRedo()),oo(Mc,s),Le.setStatus(Be.status.sharedHarborLoaded))});window.addEventListener("resize",()=>Me.resize(),{passive:!0});const t_=window.setTimeout(()=>Le.hideLoading(),2800),jh=s=>{Me.update(s),jo<2&&(jo+=1,jo===2&&(window.clearTimeout(t_),Le.hideLoading())),requestAnimationFrame(jh)};requestAnimationFrame(jh);window.addEventListener("beforeunload",()=>{Me.dispose(),Ne.dispose(),Le.dispose()},{once:!0});
