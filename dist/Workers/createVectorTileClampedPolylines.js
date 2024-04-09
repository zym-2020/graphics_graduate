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
import{a as J}from"./chunk-4M7FKQYC.js";import{a as Y}from"./chunk-PNRMC4IG.js";import{a as B}from"./chunk-JZL634RF.js";import{a as X}from"./chunk-4FFHQQYZ.js";import{c as W}from"./chunk-KCIWEUSR.js";import"./chunk-7XDW3BZW.js";import{a as t,b as k,c as _}from"./chunk-F33YCXD2.js";import{a as v}from"./chunk-DUBQPPQZ.js";import"./chunk-CG3JQAX7.js";import"./chunk-P3JQY4NV.js";import"./chunk-K36PKEJW.js";import"./chunk-KD2PMTHD.js";import"./chunk-ZUCO5WNM.js";var V=32767,it=Math.cos(v.toRadians(150)),ct=new k,rt=new t;function at(e,r,s,a,n,i,o){let l=e.length,d=new Float64Array(3*l);for(let f=0;f<l;++f){let l=e[f],c=r[f],h=s[f],u=v.lerp(a.west,a.east,l/V),p=v.lerp(a.south,a.north,c/V),m=v.lerp(n,i,h/V),A=k.fromRadians(u,p,m,ct),w=o.cartographicToCartesian(A,rt);t.pack(w,d,3*f)}return d}function dt(t){let e=t.length,r=new Uint32Array(e+1),s=0;for(let a=0;a<e;++a)r[a]=s,s+=t[a];return r[e]=s,r}var lt=new k,ht=new k;function ft(t,e,r,s){let a=s.length,n=t.length,i=new Uint8Array(n),o=lt,l=ht,d=0;for(let c=0;c<a;c++){let r=s[c],a=r;for(let s=1;s<r;s++){let r=d+s,n=r-1;l.longitude=t[r],l.latitude=e[r],o.longitude=t[n],o.latitude=e[n],k.equals(l,o)&&(a--,i[n]=1)}s[c]=a,d+=r}let f=0;for(let c=0;c<n;c++)1!==i[c]&&(t[f]=t[c],e[f]=e[c],r[f]=r[c],f++)}function ot(t){let e=8*t,r=3*e,s=4*e;this.startEllipsoidNormals=new Float32Array(r),this.endEllipsoidNormals=new Float32Array(r),this.startPositionAndHeights=new Float32Array(s),this.startFaceNormalAndVertexCornerIds=new Float32Array(s),this.endPositionAndHeights=new Float32Array(s),this.endFaceNormalAndHalfWidths=new Float32Array(s),this.vertexBatchIds=new Uint16Array(e),this.indices=B.createTypedArray(e,36*t),this.vec3Offset=0,this.vec4Offset=0,this.batchIdOffset=0,this.indexOffset=0,this.volumeStartIndex=0}var Q=new t,pt=new t;function $(e,r,s,a,n){let i=t.subtract(s,r,pt),o=t.subtract(r,e,Q);return t.normalize(i,i),t.normalize(o,o),t.dot(i,o)<it&&(o=t.multiplyByScalar(o,-1,Q)),t.add(i,o,n),t.equals(n,t.ZERO)&&(n=t.subtract(e,r)),t.cross(n,a,n),t.cross(a,n,n),t.normalize(n,n),n}var st=[0,2,6,0,6,4,0,1,3,0,3,2,0,4,5,0,5,1,5,3,1,5,7,3,7,5,4,7,4,6,7,6,2,7,2,3],j=st.length,tt=new t,ut=new t,mt=new t,At=new t,Nt=new t;ot.prototype.addVolume=function(e,r,s,a,n,i,o,l,d,f){let c=t.add(r,d,tt),h=f.geodeticSurfaceNormal(c,ut);c=t.add(s,d,tt);let u,p=f.geodeticSurfaceNormal(c,At),m=$(e,r,s,h,mt),k=$(a,s,r,p,Nt),A=this.startEllipsoidNormals,w=this.endEllipsoidNormals,b=this.startPositionAndHeights,N=this.startFaceNormalAndVertexCornerIds,g=this.endPositionAndHeights,v=this.endFaceNormalAndHalfWidths,y=this.vertexBatchIds,F=this.batchIdOffset,I=this.vec3Offset,E=this.vec4Offset;for(u=0;u<8;u++)t.pack(h,A,I),t.pack(p,w,I),t.pack(r,b,E),b[E+3]=n,t.pack(s,g,E),g[E+3]=i,t.pack(m,N,E),N[E+3]=u,t.pack(k,v,E),v[E+3]=o,y[F++]=l,I+=3,E+=4;this.batchIdOffset=F,this.vec3Offset=I,this.vec4Offset=E;let P=this.indices,x=this.volumeStartIndex,H=this.indexOffset;for(u=0;u<j;u++)P[H+u]=st[u]+x;this.volumeStartIndex+=8,this.indexOffset+=j};var gt=new W,Et=new _,wt=new t,M=new t,It=new t,xt=new t,T=new t;function Pt(e,r){let s=new Uint16Array(e.positions),a=new Uint16Array(e.widths),n=new Uint32Array(e.counts),i=new Uint16Array(e.batchIds),o=gt,l=Et,d=wt,f=new Float64Array(e.packedBuffer),c=0,h=f[c++],u=f[c++];W.unpack(f,c,o),c+=W.packedLength,_.unpack(f,c,l),c+=_.packedLength,t.unpack(f,c,d);let p,m=s.length/3,k=s.subarray(0,m),A=s.subarray(m,2*m),w=s.subarray(2*m,3*m);Y.zigZagDeltaDecode(k,A,w),ft(k,A,w,n);let b=n.length,N=0;for(p=0;p<b;p++){let t=n[p];N+=t-1}let g=new ot(N),y=at(k,A,w,o,h,u,l,d);m=k.length;let F=new Float32Array(3*m);for(p=0;p<m;++p)F[3*p]=y[3*p]-d.x,F[3*p+1]=y[3*p+1]-d.y,F[3*p+2]=y[3*p+2]-d.z;let I=0,E=0;for(p=0;p<b;p++){let e=n[p]-1,r=.5*a[p],s=i[p],o=I;for(let a=0;a<e;a++){let n=t.unpack(F,I,It),i=t.unpack(F,I+3,xt),f=w[E],c=w[E+1];f=v.lerp(h,u,f/V),c=v.lerp(h,u,c/V),E++;let p=M,m=T;if(0===a){let r=o+3*e,s=t.unpack(F,r,M);if(t.equals(s,n))t.unpack(F,r-3,p);else{let e=t.subtract(n,i,M);p=t.add(e,n,M)}}else t.unpack(F,I-3,p);if(a===e-1){let e=t.unpack(F,o,T);if(t.equals(e,i))t.unpack(F,o+3,m);else{let e=t.subtract(i,n,T);m=t.add(e,i,T)}}else t.unpack(F,I+6,m);g.addVolume(p,n,i,m,f,c,r,s,d,l),I+=3}I+=3,E++}let P=g.indices;r.push(g.startEllipsoidNormals.buffer),r.push(g.endEllipsoidNormals.buffer),r.push(g.startPositionAndHeights.buffer),r.push(g.startFaceNormalAndVertexCornerIds.buffer),r.push(g.endPositionAndHeights.buffer),r.push(g.endFaceNormalAndHalfWidths.buffer),r.push(g.vertexBatchIds.buffer),r.push(P.buffer);let x={indexDatatype:2===P.BYTES_PER_ELEMENT?B.UNSIGNED_SHORT:B.UNSIGNED_INT,startEllipsoidNormals:g.startEllipsoidNormals.buffer,endEllipsoidNormals:g.endEllipsoidNormals.buffer,startPositionAndHeights:g.startPositionAndHeights.buffer,startFaceNormalAndVertexCornerIds:g.startFaceNormalAndVertexCornerIds.buffer,endPositionAndHeights:g.endPositionAndHeights.buffer,endFaceNormalAndHalfWidths:g.endFaceNormalAndHalfWidths.buffer,vertexBatchIds:g.vertexBatchIds.buffer,indices:P.buffer};if(e.keepDecodedPositions){let t=dt(n);r.push(y.buffer,t.buffer),x=X(x,{decodedPositions:y.buffer,decodedPositionOffsets:t.buffer})}return x}var Vt=J(Pt);export{Vt as default};