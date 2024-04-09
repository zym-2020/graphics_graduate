/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.111
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */
import{a as Se}from"./chunk-4M7FKQYC.js";import{a as D}from"./chunk-P3JQY4NV.js";import{b as ae}from"./chunk-KD2PMTHD.js";import{c as R,d as Ot,e as me}from"./chunk-ZUCO5WNM.js";var Ie=R(((e,t)=>{"use strict";var i=(e,t,i,r)=>{let n=65535&e|0,a=e>>>16&65535|0,s=0;for(;0!==i;){s=i>2e3?2e3:i,i-=s;do{n=n+t[r++]|0,a=a+n|0}while(--s);n%=65521,a%=65521}return n|a<<16|0};t.exports=i})),De=R(((e,t)=>{"use strict";var i=()=>{let e,t=[];for(var i=0;i<256;i++){e=i;for(var r=0;r<8;r++)e=1&e?3988292384^e>>>1:e>>>1;t[i]=e}return t},r=new Uint32Array(i()),n=(e,t,i,n)=>{let a=r,s=n+i;e^=-1;for(let r=n;r<s;r++)e=e>>>8^a[255&(e^t[r])];return-1^e};t.exports=n})),Oe=R(((e,t)=>{"use strict";t.exports=function(e,t){let i,r,n,a,s,o,l,f,d,h,c,u,w,b,m,g,k,_,p,v,y,x,E,R,A=e.state;i=e.next_in,E=e.input,r=i+(e.avail_in-5),n=e.next_out,R=e.output,a=n-(t-e.avail_out),s=n+(e.avail_out-257),o=A.dmax,l=A.wsize,f=A.whave,d=A.wnext,h=A.window,c=A.hold,u=A.bits,w=A.lencode,b=A.distcode,m=(1<<A.lenbits)-1,g=(1<<A.distbits)-1;e:do{u<15&&(c+=E[i++]<<u,u+=8,c+=E[i++]<<u,u+=8),k=w[c&m];t:for(;;){if(_=k>>>24,c>>>=_,u-=_,_=k>>>16&255,0===_)R[n++]=65535&k;else{if(!(16&_)){if(64&_){if(32&_){A.mode=16191;break e}e.msg="invalid literal/length code",A.mode=16209;break e}k=w[(65535&k)+(c&(1<<_)-1)];continue t}for(p=65535&k,_&=15,_&&(u<_&&(c+=E[i++]<<u,u+=8),p+=c&(1<<_)-1,c>>>=_,u-=_),u<15&&(c+=E[i++]<<u,u+=8,c+=E[i++]<<u,u+=8),k=b[c&g];;){if(_=k>>>24,c>>>=_,u-=_,_=k>>>16&255,16&_){if(v=65535&k,_&=15,u<_&&(c+=E[i++]<<u,u+=8,u<_&&(c+=E[i++]<<u,u+=8)),v+=c&(1<<_)-1,v>o){e.msg="invalid distance too far back",A.mode=16209;break e}if(c>>>=_,u-=_,_=n-a,v>_){if(_=v-_,_>f&&A.sane){e.msg="invalid distance too far back",A.mode=16209;break e}if(y=0,x=h,0===d){if(y+=l-_,_<p){p-=_;do{R[n++]=h[y++]}while(--_);y=n-v,x=R}}else if(d<_){if(y+=l+d-_,_-=d,_<p){p-=_;do{R[n++]=h[y++]}while(--_);if(y=0,d<p){_=d,p-=_;do{R[n++]=h[y++]}while(--_);y=n-v,x=R}}}else if(y+=d-_,_<p){p-=_;do{R[n++]=h[y++]}while(--_);y=n-v,x=R}for(;p>2;)R[n++]=x[y++],R[n++]=x[y++],R[n++]=x[y++],p-=3;p&&(R[n++]=x[y++],p>1&&(R[n++]=x[y++]))}else{y=n-v;do{R[n++]=R[y++],R[n++]=R[y++],R[n++]=R[y++],p-=3}while(p>2);p&&(R[n++]=R[y++],p>1&&(R[n++]=R[y++]))}break}if(64&_){e.msg="invalid distance code",A.mode=16209;break e}k=b[(65535&k)+(c&(1<<_)-1)]}}break}}while(i<r&&n<s);p=u>>3,i-=p,u-=p<<3,c&=(1<<u)-1,e.next_in=i,e.next_out=n,e.avail_in=i<r?r-i+5:5-(i-r),e.avail_out=n<s?s-n+257:257-(n-s),A.hold=c,A.bits=u}})),Me=R(((e,t)=>{"use strict";var i=new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),r=new Uint8Array([16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78]),n=new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),a=new Uint8Array([16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]),s=(e,t,s,o,l,f,d,h)=>{let c,u,w,b,m,g,k,_,p,v=h.bits,y=0,x=0,E=0,R=0,A=0,T=0,D=0,U=0,S=0,Z=0,I=null,O=new Uint16Array(16),N=new Uint16Array(16),C=null;for(y=0;y<=15;y++)O[y]=0;for(x=0;x<o;x++)O[t[s+x]]++;for(A=v,R=15;R>=1&&0===O[R];R--);if(A>R&&(A=R),0===R)return l[f++]=20971520,l[f++]=20971520,h.bits=1,0;for(E=1;E<R&&0===O[E];E++);for(A<E&&(A=E),U=1,y=1;y<=15;y++)if(U<<=1,U-=O[y],U<0)return-1;if(U>0&&(0===e||1!==R))return-1;for(N[1]=0,y=1;y<15;y++)N[y+1]=N[y]+O[y];for(x=0;x<o;x++)0!==t[s+x]&&(d[N[t[s+x]]++]=x);if(0===e?(I=C=d,g=20):1===e?(I=i,C=r,g=257):(I=n,C=a,g=0),Z=0,x=0,y=E,m=f,T=A,D=0,w=-1,S=1<<A,b=S-1,1===e&&S>852||2===e&&S>592)return 1;for(;;){k=y-D,d[x]+1<g?(_=0,p=d[x]):d[x]>=g?(_=C[d[x]-g],p=I[d[x]-g]):(_=96,p=0),c=1<<y-D,u=1<<T,E=u;do{u-=c,l[m+(Z>>D)+u]=k<<24|_<<16|p|0}while(0!==u);for(c=1<<y-1;Z&c;)c>>=1;if(0!==c?(Z&=c-1,Z+=c):Z=0,x++,0===--O[y]){if(y===R)break;y=t[s+d[x]]}if(y>A&&(Z&b)!==w){for(0===D&&(D=A),m+=E,T=y-D,U=1<<T;T+D<R&&(U-=O[T+D],!(U<=0));)T++,U<<=1;if(S+=1<<T,1===e&&S>852||2===e&&S>592)return 1;w=Z&b,l[w]=A<<24|T<<16|m-f|0}}return 0!==Z&&(l[m+Z]=y-D<<24|64<<16|0),h.bits=A,0};t.exports=s})),J=R(((e,t)=>{"use strict";t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}})),bt=R(((e,t)=>{"use strict";var i=Ie(),r=De(),n=Oe(),a=Me(),s=0,o=1,l=2,{Z_FINISH:f,Z_BLOCK:d,Z_TREES:h,Z_OK:c,Z_STREAM_END:u,Z_NEED_DICT:w,Z_STREAM_ERROR:b,Z_DATA_ERROR:m,Z_MEM_ERROR:g,Z_BUF_ERROR:k,Z_DEFLATED:_}=J(),p=16180,v=16181,y=16182,x=16183,E=16184,R=16185,A=16186,T=16187,D=16188,U=16189,S=16190,Z=16191,I=16192,O=16193,N=16194,C=16195,B=16196,M=16197,F=16198,H=16199,L=16200,P=16201,z=16202,V=16203,Y=16204,j=16205,G=16206,K=16207,Q=16208,W=16209,X=16210,q=16211,$=852,ee=592,te=15,ie=te,re=e=>(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24);function ne(){this.strm=null,this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}var ae,se,oe=e=>{if(!e)return 1;let t=e.state;return!t||t.strm!==e||t.mode<p||t.mode>q?1:0},le=e=>{if(oe(e))return b;let t=e.state;return e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=p,t.last=0,t.havedict=0,t.flags=-1,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new Int32Array($),t.distcode=t.distdyn=new Int32Array(ee),t.sane=1,t.back=-1,c},fe=e=>{if(oe(e))return b;let t=e.state;return t.wsize=0,t.whave=0,t.wnext=0,le(e)},de=(e,t)=>{let i;if(oe(e))return b;let r=e.state;return t<0?(i=0,t=-t):(i=5+(t>>4),t<48&&(t&=15)),t&&(t<8||t>15)?b:(null!==r.window&&r.wbits!==t&&(r.window=null),r.wrap=i,r.wbits=t,fe(e))},he=(e,t)=>{if(!e)return b;let i=new ne;e.state=i,i.strm=e,i.window=null,i.mode=p;let r=de(e,t);return r!==c&&(e.state=null),r},ce=e=>he(e,ie),ue=!0,we=e=>{if(ue){ae=new Int32Array(512),se=new Int32Array(32);let t=0;for(;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(a(o,e.lens,0,288,ae,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;a(l,e.lens,0,32,se,0,e.work,{bits:5}),ue=!1}e.lencode=ae,e.lenbits=9,e.distcode=se,e.distbits=5},be=(e,t,i,r)=>{let n,a=e.state;return null===a.window&&(a.wsize=1<<a.wbits,a.wnext=0,a.whave=0,a.window=new Uint8Array(a.wsize)),r>=a.wsize?(a.window.set(t.subarray(i-a.wsize,i),0),a.wnext=0,a.whave=a.wsize):(n=a.wsize-a.wnext,n>r&&(n=r),a.window.set(t.subarray(i-r,i-r+n),a.wnext),r-=n,r?(a.window.set(t.subarray(i-r,i),0),a.wnext=r,a.whave=a.wsize):(a.wnext+=n,a.wnext===a.wsize&&(a.wnext=0),a.whave<a.wsize&&(a.whave+=n))),0},me=(e,t)=>{let J,$,ee,te,ie,ne,ae,se,le,fe,de,he,ce,ue,me,ge,ke,_e,pe,ve,ye,xe,Ee,Re,Ae=0,Te=new Uint8Array(4),De=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);if(oe(e)||!e.output||!e.input&&0!==e.avail_in)return b;J=e.state,J.mode===Z&&(J.mode=I),ie=e.next_out,ee=e.output,ae=e.avail_out,te=e.next_in,$=e.input,ne=e.avail_in,se=J.hold,le=J.bits,fe=ne,de=ae,xe=c;e:for(;;)switch(J.mode){case p:if(0===J.wrap){J.mode=I;break}for(;le<16;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}if(2&J.wrap&&35615===se){0===J.wbits&&(J.wbits=15),J.check=0,Te[0]=255&se,Te[1]=se>>>8&255,J.check=r(J.check,Te,2,0),se=0,le=0,J.mode=v;break}if(J.head&&(J.head.done=!1),!(1&J.wrap)||(((255&se)<<8)+(se>>8))%31){e.msg="incorrect header check",J.mode=W;break}if((15&se)!==_){e.msg="unknown compression method",J.mode=W;break}if(se>>>=4,le-=4,ye=8+(15&se),0===J.wbits&&(J.wbits=ye),ye>15||ye>J.wbits){e.msg="invalid window size",J.mode=W;break}J.dmax=1<<J.wbits,J.flags=0,e.adler=J.check=1,J.mode=512&se?U:Z,se=0,le=0;break;case v:for(;le<16;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}if(J.flags=se,(255&J.flags)!==_){e.msg="unknown compression method",J.mode=W;break}if(57344&J.flags){e.msg="unknown header flags set",J.mode=W;break}J.head&&(J.head.text=se>>8&1),512&J.flags&&4&J.wrap&&(Te[0]=255&se,Te[1]=se>>>8&255,J.check=r(J.check,Te,2,0)),se=0,le=0,J.mode=y;case y:for(;le<32;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}J.head&&(J.head.time=se),512&J.flags&&4&J.wrap&&(Te[0]=255&se,Te[1]=se>>>8&255,Te[2]=se>>>16&255,Te[3]=se>>>24&255,J.check=r(J.check,Te,4,0)),se=0,le=0,J.mode=x;case x:for(;le<16;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}J.head&&(J.head.xflags=255&se,J.head.os=se>>8),512&J.flags&&4&J.wrap&&(Te[0]=255&se,Te[1]=se>>>8&255,J.check=r(J.check,Te,2,0)),se=0,le=0,J.mode=E;case E:if(1024&J.flags){for(;le<16;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}J.length=se,J.head&&(J.head.extra_len=se),512&J.flags&&4&J.wrap&&(Te[0]=255&se,Te[1]=se>>>8&255,J.check=r(J.check,Te,2,0)),se=0,le=0}else J.head&&(J.head.extra=null);J.mode=R;case R:if(1024&J.flags&&(he=J.length,he>ne&&(he=ne),he&&(J.head&&(ye=J.head.extra_len-J.length,J.head.extra||(J.head.extra=new Uint8Array(J.head.extra_len)),J.head.extra.set($.subarray(te,te+he),ye)),512&J.flags&&4&J.wrap&&(J.check=r(J.check,$,he,te)),ne-=he,te+=he,J.length-=he),J.length))break e;J.length=0,J.mode=A;case A:if(2048&J.flags){if(0===ne)break e;he=0;do{ye=$[te+he++],J.head&&ye&&J.length<65536&&(J.head.name+=String.fromCharCode(ye))}while(ye&&he<ne);if(512&J.flags&&4&J.wrap&&(J.check=r(J.check,$,he,te)),ne-=he,te+=he,ye)break e}else J.head&&(J.head.name=null);J.length=0,J.mode=T;case T:if(4096&J.flags){if(0===ne)break e;he=0;do{ye=$[te+he++],J.head&&ye&&J.length<65536&&(J.head.comment+=String.fromCharCode(ye))}while(ye&&he<ne);if(512&J.flags&&4&J.wrap&&(J.check=r(J.check,$,he,te)),ne-=he,te+=he,ye)break e}else J.head&&(J.head.comment=null);J.mode=D;case D:if(512&J.flags){for(;le<16;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}if(4&J.wrap&&se!==(65535&J.check)){e.msg="header crc mismatch",J.mode=W;break}se=0,le=0}J.head&&(J.head.hcrc=J.flags>>9&1,J.head.done=!0),e.adler=J.check=0,J.mode=Z;break;case U:for(;le<32;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}e.adler=J.check=re(se),se=0,le=0,J.mode=S;case S:if(0===J.havedict)return e.next_out=ie,e.avail_out=ae,e.next_in=te,e.avail_in=ne,J.hold=se,J.bits=le,w;e.adler=J.check=1,J.mode=Z;case Z:if(t===d||t===h)break e;case I:if(J.last){se>>>=7&le,le-=7&le,J.mode=G;break}for(;le<3;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}switch(J.last=1&se,se>>>=1,le-=1,3&se){case 0:J.mode=O;break;case 1:if(we(J),J.mode=H,t===h){se>>>=2,le-=2;break e}break;case 2:J.mode=B;break;case 3:e.msg="invalid block type",J.mode=W}se>>>=2,le-=2;break;case O:for(se>>>=7&le,le-=7&le;le<32;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}if((65535&se)!==(se>>>16^65535)){e.msg="invalid stored block lengths",J.mode=W;break}if(J.length=65535&se,se=0,le=0,J.mode=N,t===h)break e;case N:J.mode=C;case C:if(he=J.length,he){if(he>ne&&(he=ne),he>ae&&(he=ae),0===he)break e;ee.set($.subarray(te,te+he),ie),ne-=he,te+=he,ae-=he,ie+=he,J.length-=he;break}J.mode=Z;break;case B:for(;le<14;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}if(J.nlen=257+(31&se),se>>>=5,le-=5,J.ndist=1+(31&se),se>>>=5,le-=5,J.ncode=4+(15&se),se>>>=4,le-=4,J.nlen>286||J.ndist>30){e.msg="too many length or distance symbols",J.mode=W;break}J.have=0,J.mode=M;case M:for(;J.have<J.ncode;){for(;le<3;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}J.lens[De[J.have++]]=7&se,se>>>=3,le-=3}for(;J.have<19;)J.lens[De[J.have++]]=0;if(J.lencode=J.lendyn,J.lenbits=7,Ee={bits:J.lenbits},xe=a(s,J.lens,0,19,J.lencode,0,J.work,Ee),J.lenbits=Ee.bits,xe){e.msg="invalid code lengths set",J.mode=W;break}J.have=0,J.mode=F;case F:for(;J.have<J.nlen+J.ndist;){for(;Ae=J.lencode[se&(1<<J.lenbits)-1],me=Ae>>>24,ge=Ae>>>16&255,ke=65535&Ae,!(me<=le);){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}if(ke<16)se>>>=me,le-=me,J.lens[J.have++]=ke;else{if(16===ke){for(Re=me+2;le<Re;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}if(se>>>=me,le-=me,0===J.have){e.msg="invalid bit length repeat",J.mode=W;break}ye=J.lens[J.have-1],he=3+(3&se),se>>>=2,le-=2}else if(17===ke){for(Re=me+3;le<Re;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}se>>>=me,le-=me,ye=0,he=3+(7&se),se>>>=3,le-=3}else{for(Re=me+7;le<Re;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}se>>>=me,le-=me,ye=0,he=11+(127&se),se>>>=7,le-=7}if(J.have+he>J.nlen+J.ndist){e.msg="invalid bit length repeat",J.mode=W;break}for(;he--;)J.lens[J.have++]=ye}}if(J.mode===W)break;if(0===J.lens[256]){e.msg="invalid code -- missing end-of-block",J.mode=W;break}if(J.lenbits=9,Ee={bits:J.lenbits},xe=a(o,J.lens,0,J.nlen,J.lencode,0,J.work,Ee),J.lenbits=Ee.bits,xe){e.msg="invalid literal/lengths set",J.mode=W;break}if(J.distbits=6,J.distcode=J.distdyn,Ee={bits:J.distbits},xe=a(l,J.lens,J.nlen,J.ndist,J.distcode,0,J.work,Ee),J.distbits=Ee.bits,xe){e.msg="invalid distances set",J.mode=W;break}if(J.mode=H,t===h)break e;case H:J.mode=L;case L:if(ne>=6&&ae>=258){e.next_out=ie,e.avail_out=ae,e.next_in=te,e.avail_in=ne,J.hold=se,J.bits=le,n(e,de),ie=e.next_out,ee=e.output,ae=e.avail_out,te=e.next_in,$=e.input,ne=e.avail_in,se=J.hold,le=J.bits,J.mode===Z&&(J.back=-1);break}for(J.back=0;Ae=J.lencode[se&(1<<J.lenbits)-1],me=Ae>>>24,ge=Ae>>>16&255,ke=65535&Ae,!(me<=le);){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}if(ge&&!(240&ge)){for(_e=me,pe=ge,ve=ke;Ae=J.lencode[ve+((se&(1<<_e+pe)-1)>>_e)],me=Ae>>>24,ge=Ae>>>16&255,ke=65535&Ae,!(_e+me<=le);){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}se>>>=_e,le-=_e,J.back+=_e}if(se>>>=me,le-=me,J.back+=me,J.length=ke,0===ge){J.mode=j;break}if(32&ge){J.back=-1,J.mode=Z;break}if(64&ge){e.msg="invalid literal/length code",J.mode=W;break}J.extra=15&ge,J.mode=P;case P:if(J.extra){for(Re=J.extra;le<Re;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}J.length+=se&(1<<J.extra)-1,se>>>=J.extra,le-=J.extra,J.back+=J.extra}J.was=J.length,J.mode=z;case z:for(;Ae=J.distcode[se&(1<<J.distbits)-1],me=Ae>>>24,ge=Ae>>>16&255,ke=65535&Ae,!(me<=le);){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}if(!(240&ge)){for(_e=me,pe=ge,ve=ke;Ae=J.distcode[ve+((se&(1<<_e+pe)-1)>>_e)],me=Ae>>>24,ge=Ae>>>16&255,ke=65535&Ae,!(_e+me<=le);){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}se>>>=_e,le-=_e,J.back+=_e}if(se>>>=me,le-=me,J.back+=me,64&ge){e.msg="invalid distance code",J.mode=W;break}J.offset=ke,J.extra=15&ge,J.mode=V;case V:if(J.extra){for(Re=J.extra;le<Re;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}J.offset+=se&(1<<J.extra)-1,se>>>=J.extra,le-=J.extra,J.back+=J.extra}if(J.offset>J.dmax){e.msg="invalid distance too far back",J.mode=W;break}J.mode=Y;case Y:if(0===ae)break e;if(he=de-ae,J.offset>he){if(he=J.offset-he,he>J.whave&&J.sane){e.msg="invalid distance too far back",J.mode=W;break}he>J.wnext?(he-=J.wnext,ce=J.wsize-he):ce=J.wnext-he,he>J.length&&(he=J.length),ue=J.window}else ue=ee,ce=ie-J.offset,he=J.length;he>ae&&(he=ae),ae-=he,J.length-=he;do{ee[ie++]=ue[ce++]}while(--he);0===J.length&&(J.mode=L);break;case j:if(0===ae)break e;ee[ie++]=J.length,ae--,J.mode=L;break;case G:if(J.wrap){for(;le<32;){if(0===ne)break e;ne--,se|=$[te++]<<le,le+=8}if(de-=ae,e.total_out+=de,J.total+=de,4&J.wrap&&de&&(e.adler=J.check=J.flags?r(J.check,ee,de,ie-de):i(J.check,ee,de,ie-de)),de=ae,4&J.wrap&&(J.flags?se:re(se))!==J.check){e.msg="incorrect data check",J.mode=W;break}se=0,le=0}J.mode=K;case K:if(J.wrap&&J.flags){for(;le<32;){if(0===ne)break e;ne--,se+=$[te++]<<le,le+=8}if(4&J.wrap&&se!==(4294967295&J.total)){e.msg="incorrect length check",J.mode=W;break}se=0,le=0}J.mode=Q;case Q:xe=u;break e;case W:xe=m;break e;case X:return g;case q:default:return b}return e.next_out=ie,e.avail_out=ae,e.next_in=te,e.avail_in=ne,J.hold=se,J.bits=le,(J.wsize||de!==e.avail_out&&J.mode<W&&(J.mode<G||t!==f))&&be(e,e.output,e.next_out,de-e.avail_out)?(J.mode=X,g):(fe-=e.avail_in,de-=e.avail_out,e.total_in+=fe,e.total_out+=de,J.total+=de,4&J.wrap&&de&&(e.adler=J.check=J.flags?r(J.check,ee,de,e.next_out-de):i(J.check,ee,de,e.next_out-de)),e.data_type=J.bits+(J.last?64:0)+(J.mode===Z?128:0)+(J.mode===H||J.mode===N?256:0),(0===fe&&0===de||t===f)&&xe===c&&(xe=k),xe)},ge=e=>{if(oe(e))return b;let t=e.state;return t.window&&(t.window=null),e.state=null,c},ke=(e,t)=>{if(oe(e))return b;let i=e.state;return 2&i.wrap?(i.head=t,t.done=!1,c):b},_e=(e,t)=>{let r,n,a,s=t.length;return oe(e)||(r=e.state,0!==r.wrap&&r.mode!==S)?b:r.mode===S&&(n=1,n=i(n,t,s,0),n!==r.check)?m:(a=be(e,t,s,s),a?(r.mode=X,g):(r.havedict=1,c))};t.exports.inflateReset=fe,t.exports.inflateReset2=de,t.exports.inflateResetKeep=le,t.exports.inflateInit=ce,t.exports.inflateInit2=he,t.exports.inflate=me,t.exports.inflateEnd=ge,t.exports.inflateGetHeader=ke,t.exports.inflateSetDictionary=_e,t.exports.inflateInfo="pako inflate (from Nodeca project)"})),_t=R(((e,t)=>{"use strict";var i=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);t.exports.assign=function(e){let t=Array.prototype.slice.call(arguments,1);for(;t.length;){let r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(let t in r)i(r,t)&&(e[t]=r[t])}}return e},t.exports.flattenChunks=e=>{let t=0;for(let r=0,n=e.length;r<n;r++)t+=e[r].length;let i=new Uint8Array(t);for(let r=0,n=0,a=e.length;r<a;r++){let t=e[r];i.set(t,n),n+=t.length}return i}})),kt=R(((e,t)=>{"use strict";var i=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{i=!1}var r=new Uint8Array(256);for(let a=0;a<256;a++)r[a]=a>=252?6:a>=248?5:a>=240?4:a>=224?3:a>=192?2:1;r[254]=r[254]=1,t.exports.string2buf=e=>{if("function"==typeof TextEncoder&&TextEncoder.prototype.encode)return(new TextEncoder).encode(e);let t,i,r,n,a,s=e.length,o=0;for(n=0;n<s;n++)i=e.charCodeAt(n),55296===(64512&i)&&n+1<s&&(r=e.charCodeAt(n+1),56320===(64512&r)&&(i=65536+(i-55296<<10)+(r-56320),n++)),o+=i<128?1:i<2048?2:i<65536?3:4;for(t=new Uint8Array(o),a=0,n=0;a<o;n++)i=e.charCodeAt(n),55296===(64512&i)&&n+1<s&&(r=e.charCodeAt(n+1),56320===(64512&r)&&(i=65536+(i-55296<<10)+(r-56320),n++)),i<128?t[a++]=i:i<2048?(t[a++]=192|i>>>6,t[a++]=128|63&i):i<65536?(t[a++]=224|i>>>12,t[a++]=128|i>>>6&63,t[a++]=128|63&i):(t[a++]=240|i>>>18,t[a++]=128|i>>>12&63,t[a++]=128|i>>>6&63,t[a++]=128|63&i);return t};var n=(e,t)=>{if(t<65534&&e.subarray&&i)return String.fromCharCode.apply(null,e.length===t?e:e.subarray(0,t));let r="";for(let i=0;i<t;i++)r+=String.fromCharCode(e[i]);return r};t.exports.buf2string=(e,t)=>{let i=t||e.length;if("function"==typeof TextDecoder&&TextDecoder.prototype.decode)return(new TextDecoder).decode(e.subarray(0,t));let a,s,o=new Array(2*i);for(s=0,a=0;a<i;){let t=e[a++];if(t<128){o[s++]=t;continue}let n=r[t];if(n>4)o[s++]=65533,a+=n-1;else{for(t&=2===n?31:3===n?15:7;n>1&&a<i;)t=t<<6|63&e[a++],n--;n>1?o[s++]=65533:t<65536?o[s++]=t:(t-=65536,o[s++]=55296|t>>10&1023,o[s++]=56320|1023&t)}}return n(o,s)},t.exports.utf8border=(e,t)=>{t=t||e.length,t>e.length&&(t=e.length);let i=t-1;for(;i>=0&&128===(192&e[i]);)i--;return i<0||0===i?t:i+r[e[i]]>t?i:t}})),Et=R(((e,t)=>{"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}})),St=R(((e,t)=>{"use strict";function i(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}t.exports=i})),vt=R(((e,t)=>{"use strict";function i(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}t.exports=i})),Rt=R(((e,t)=>{"use strict";var i=bt(),r=_t(),n=kt(),a=Et(),s=St(),o=vt(),l=Object.prototype.toString,{Z_NO_FLUSH:f,Z_FINISH:d,Z_OK:h,Z_STREAM_END:c,Z_NEED_DICT:u,Z_STREAM_ERROR:w,Z_DATA_ERROR:b,Z_MEM_ERROR:m}=J();function g(e){this.options=r.assign({chunkSize:65536,windowBits:15,to:""},e||{});let t=this.options;t.raw&&t.windowBits>=0&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),t.windowBits>=0&&t.windowBits<16&&!(e&&e.windowBits)&&(t.windowBits+=32),t.windowBits>15&&t.windowBits<48&&(15&t.windowBits||(t.windowBits|=15)),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;let f=i.inflateInit2(this.strm,t.windowBits);if(f!==h)throw new Error(a[f]);if(this.header=new o,i.inflateGetHeader(this.strm,this.header),t.dictionary&&("string"==typeof t.dictionary?t.dictionary=n.string2buf(t.dictionary):"[object ArrayBuffer]"===l.call(t.dictionary)&&(t.dictionary=new Uint8Array(t.dictionary)),t.raw&&(f=i.inflateSetDictionary(this.strm,t.dictionary),f!==h)))throw new Error(a[f])}function k(e,t){let i=new g(t);if(i.push(e),i.err)throw i.msg||a[i.err];return i.result}function _(e,t){return t=t||{},t.raw=!0,k(e,t)}g.prototype.push=function(e,t){let r,a,s,o=this.strm,g=this.options.chunkSize,k=this.options.dictionary;if(this.ended)return!1;for(a=t===~~t?t:!0===t?d:f,"[object ArrayBuffer]"===l.call(e)?o.input=new Uint8Array(e):o.input=e,o.next_in=0,o.avail_in=o.input.length;;){for(0===o.avail_out&&(o.output=new Uint8Array(g),o.next_out=0,o.avail_out=g),r=i.inflate(o,a),r===u&&k&&(r=i.inflateSetDictionary(o,k),r===h?r=i.inflate(o,a):r===b&&(r=u));o.avail_in>0&&r===c&&o.state.wrap>0&&0!==e[o.next_in];)i.inflateReset(o),r=i.inflate(o,a);switch(r){case w:case b:case u:case m:return this.onEnd(r),this.ended=!0,!1}if(s=o.avail_out,o.next_out&&(0===o.avail_out||r===c))if("string"===this.options.to){let e=n.utf8border(o.output,o.next_out),t=o.next_out-e,i=n.buf2string(o.output,e);o.next_out=t,o.avail_out=g-t,t&&o.output.set(o.output.subarray(e,e+t),0),this.onData(i)}else this.onData(o.output.length===o.next_out?o.output:o.output.subarray(0,o.next_out));if(r!==h||0!==s){if(r===c)return r=i.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,!0;if(0===o.avail_in)break}}return!0},g.prototype.onData=function(e){this.chunks.push(e)},g.prototype.onEnd=function(e){e===h&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=r.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},t.exports.Inflate=g,t.exports.inflate=k,t.exports.inflateRaw=_,t.exports.ungzip=k,t.exports.constants=J()})),Nt=1953029805,Mt=2917034100;function oe(e,t){if(oe.passThroughDataForTesting)return t;ae.typeOf.object("key",e),ae.typeOf.object("data",t);let i=e.byteLength;if(0===i||i%4!==0)throw new D("The length of key must be greater than 0 and a multiple of 4.");let r=new DataView(t),n=r.getUint32(0,!0);if(n===Nt||n===Mt)return t;let a,s=new DataView(e),o=0,l=t.byteLength,f=l-l%8,d=i,h=8;for(;o<f;)for(h=(h+8)%24,a=h;o<f&&a<d;)r.setUint32(o,r.getUint32(o,!0)^s.getUint32(a,!0),!0),r.setUint32(o+4,r.getUint32(o+4,!0)^s.getUint32(a+4,!0),!0),o+=8,a+=24;if(o<l)for(a>=d&&(h=(h+8)%24,a=h);o<l;)r.setUint8(o,r.getUint8(o)^s.getUint8(a)),o++,a++}oe.passThroughDataForTesting=!1;var Te=oe;function Zt(e,t){return 0!==(e&t)}var F=Zt,Bt=[1,2,4,8],ve=15,Ct=16,Lt=64,Pt=128;function N(e,t,i,r,n,a){this._bits=e,this.cnodeVersion=t,this.imageryVersion=i,this.terrainVersion=r,this.imageryProvider=n,this.terrainProvider=a,this.ancestorHasTerrain=!1,this.terrainState=void 0}N.clone=function(e,t){return me(t)?(t._bits=e._bits,t.cnodeVersion=e.cnodeVersion,t.imageryVersion=e.imageryVersion,t.terrainVersion=e.terrainVersion,t.imageryProvider=e.imageryProvider,t.terrainProvider=e.terrainProvider):t=new N(e._bits,e.cnodeVersion,e.imageryVersion,e.terrainVersion,e.imageryProvider,e.terrainProvider),t.ancestorHasTerrain=e.ancestorHasTerrain,t.terrainState=e.terrainState,t},N.prototype.setParent=function(e){this.ancestorHasTerrain=e.ancestorHasTerrain||this.hasTerrain()},N.prototype.hasSubtree=function(){return F(this._bits,Ct)},N.prototype.hasImagery=function(){return F(this._bits,Lt)},N.prototype.hasTerrain=function(){return F(this._bits,Pt)},N.prototype.hasChildren=function(){return F(this._bits,ve)},N.prototype.hasChild=function(e){return F(this._bits,Bt[e])},N.prototype.getChildBitmask=function(){return this._bits&ve};var ye=N,Ut=Ot(Rt(),1),G=Uint16Array.BYTES_PER_ELEMENT,H=Int32Array.BYTES_PER_ELEMENT,Y=Uint32Array.BYTES_PER_ELEMENT,C={METADATA:0,TERRAIN:1,DBROOT:2};function Si(e,t){let i=C.fromString(e.type),r=e.buffer;Te(e.key,r);let n=Di(r);r=n.buffer;let a=n.length;switch(i){case C.METADATA:return vi(r,a,e.quadKey);case C.TERRAIN:return Ii(r,a,t);case C.DBROOT:return t.push(r),{buffer:r}}}C.fromString=function(e){return"Metadata"===e?C.METADATA:"Terrain"===e?C.TERRAIN:"DbRoot"===e?C.DBROOT:void 0};var Ti=32301;function vi(e,t,i){let r=new DataView(e),n=0,a=r.getUint32(n,!0);if(n+=Y,a!==Ti)throw new D("Invalid magic");let s=r.getUint32(n,!0);if(n+=Y,1!==s)throw new D("Invalid data type. Must be 1 for QuadTreePacket");let o=r.getUint32(n,!0);if(n+=Y,2!==o)throw new D("Invalid QuadTreePacket version. Only version 2 is supported.");let l=r.getInt32(n,!0);n+=H;let f=r.getInt32(n,!0);if(n+=H,32!==f)throw new D("Invalid instance size.");let d=r.getInt32(n,!0);n+=H;let h=r.getInt32(n,!0);n+=H;let c=r.getInt32(n,!0);if(n+=H,d!==l*f+n)throw new D("Invalid dataBufferOffset");if(d+h+c!==t)throw new D("Invalid packet offsets");let u=[];for(let _=0;_<l;++_){let e=r.getUint8(n);++n,++n;let t=r.getUint16(n,!0);n+=G;let i=r.getUint16(n,!0);n+=G;let a=r.getUint16(n,!0);n+=G,n+=G,n+=G,n+=H,n+=H,n+=8;let s=r.getUint8(n++),o=r.getUint8(n++);n+=G,u.push(new ye(e,t,i,a,s,o))}let w=[],b=0;function m(e,t,i){let r=!1;if(4===i){if(t.hasSubtree())return;r=!0}for(let n=0;n<4;++n){let a=e+n.toString();if(r)w[a]=null;else if(i<4)if(t.hasChild(n)){if(b===l)return void console.log("Incorrect number of instances");let e=u[b++];w[a]=e,m(a,e,i+1)}else w[a]=null}}let g=0,k=u[b++];return""===i?++g:w[i]=k,m(i,k,g),w}var yi=5,Ai=4;function Ii(e,t,i){let r=new DataView(e),n=function(e){for(let i=0;i<Ai;++i){let i=r.getUint32(e,!0);if(e+=Y,e+=i,e>t)throw new D("Malformed terrain packet found.")}return e},a=0,s=[];for(;s.length<yi;){let t=a;a=n(a);let r=e.slice(t,a);i.push(r),s.push(r)}return s}var Dt=1953029805,Ri=2917034100;function Di(e){let t=new DataView(e),i=0,r=t.getUint32(i,!0);if(i+=Y,r!==Dt&&r!==Ri)throw new D("Invalid magic");let n=t.getUint32(i,r===Dt);i+=Y;let a=new Uint8Array(e,i),s=Ut.default.inflate(a);if(s.length!==n)throw new D("Size of packet doesn't match header");return s}var en=Se(Si);export{en as default};