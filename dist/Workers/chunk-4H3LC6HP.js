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
import{a as $}from"./chunk-4XIXQUKW.js";import{a as b}from"./chunk-3ZQZIWLR.js";import{a as U}from"./chunk-JZL634RF.js";import{a as E}from"./chunk-3UAKIC5Y.js";import{c as z,d as L}from"./chunk-QEWKHB6D.js";import{a as D,d as y}from"./chunk-DV7DPSRL.js";import{b as G}from"./chunk-KCIWEUSR.js";import{a as k}from"./chunk-7XDW3BZW.js";import{c as B}from"./chunk-F33YCXD2.js";import{a as v}from"./chunk-K36PKEJW.js";import{a as F,b as I}from"./chunk-KD2PMTHD.js";import{e as a}from"./chunk-ZUCO5WNM.js";function w(e,t,r){e=v(e,0),t=v(t,0),r=v(r,0),this.value=new Float32Array([e,t,r])}Object.defineProperties(w.prototype,{componentDatatype:{get:function(){return k.FLOAT}},componentsPerAttribute:{get:function(){return 3}},normalize:{get:function(){return!1}}}),w.fromCartesian3=function(e){return I.defined("offset",e),new w(e.x,e.y,e.z)},w.toValue=function(e,t){return I.defined("offset",e),a(t)||(t=new Float32Array([e.x,e.y,e.z])),t[0]=e.x,t[1]=e.y,t[2]=e.z,t};var j=w;function K(e,t,r){let n,o=!r,i=e.length;if(!o&&i>1){let t=e[0].modelMatrix;for(n=1;n<i;++n)if(!G.equals(t,e[n].modelMatrix)){o=!0;break}}if(o)for(n=0;n<i;++n)a(e[n].geometry)&&b.transformToWorldCoordinates(e[n]);else G.multiplyTransformation(t,e[0].modelMatrix,t)}function P(e,t){let r=e.attributes,n=r.position,o=n.values.length/n.componentsPerAttribute;r.batchId=new L({componentDatatype:k.FLOAT,componentsPerAttribute:1,values:new Float32Array(o)});let i=r.batchId.values;for(let a=0;a<o;++a)i[a]=t}function N(e){let t=e.length;for(let r=0;r<t;++r){let t=e[r];a(t.geometry)?P(t.geometry,r):a(t.westHemisphereGeometry)&&a(t.eastHemisphereGeometry)&&(P(t.westHemisphereGeometry,r),P(t.eastHemisphereGeometry,r))}}function Q(e){let t,r,n,o=e.instances,i=e.projection,s=e.elementIndexUintSupported,c=e.scene3DOnly,l=e.vertexCacheOptimize,u=e.compressVertices,p=e.modelMatrix,f=o.length;for(t=0;t<f;++t)if(a(o[t].geometry)){n=o[t].geometry.primitiveType;break}for(t=1;t<f;++t)if(a(o[t].geometry)&&o[t].geometry.primitiveType!==n)throw new F("All instance geometries must have the same primitiveType.");if(K(o,p,c),!c)for(t=0;t<f;++t)a(o[t].geometry)&&b.splitLongitude(o[t]);if(N(o),l)for(t=0;t<f;++t){let e=o[t];a(e.geometry)?(b.reorderForPostVertexCache(e.geometry),b.reorderForPreVertexCache(e.geometry)):a(e.westHemisphereGeometry)&&a(e.eastHemisphereGeometry)&&(b.reorderForPostVertexCache(e.westHemisphereGeometry),b.reorderForPreVertexCache(e.westHemisphereGeometry),b.reorderForPostVertexCache(e.eastHemisphereGeometry),b.reorderForPreVertexCache(e.eastHemisphereGeometry))}let m=b.combineInstances(o);for(f=m.length,t=0;t<f;++t){r=m[t];let e=r.attributes;if(c)for(let t in e)e.hasOwnProperty(t)&&e[t].componentDatatype===k.DOUBLE&&b.encodeAttribute(r,t,`${t}3DHigh`,`${t}3DLow`);else for(let t in e)if(e.hasOwnProperty(t)&&e[t].componentDatatype===k.DOUBLE){let e=`${t}3D`,n=`${t}2D`;b.projectTo2D(r,t,e,n,i),a(r.boundingSphere)&&"position"===t&&(r.boundingSphereCV=y.fromVertices(r.attributes.position2D.values)),b.encodeAttribute(r,e,`${e}High`,`${e}Low`),b.encodeAttribute(r,n,`${n}High`,`${n}Low`)}u&&b.compressVertices(r)}if(!s){let e=[];for(f=m.length,t=0;t<f;++t)r=m[t],e=e.concat(b.fitToUnsignedShortIndices(r));m=e}return m}function T(e,t,r,n){let o,i,s,c=n.length-1;if(c>=0){let e=n[c];o=e.offset+e.count,s=e.index,i=r[s].indices.length}else o=0,s=0,i=r[s].indices.length;let l=e.length;for(let u=0;u<l;++u){let c=e[u][t];if(!a(c))continue;let l=c.indices.length;o+l>i&&(o=0,i=r[++s].indices.length),n.push({index:s,offset:o,count:l}),o+=l}}function X(e,t){let r=[];return T(e,"geometry",t,r),T(e,"westHemisphereGeometry",t,r),T(e,"eastHemisphereGeometry",t,r),r}var S={};function Y(e,t){let r=e.attributes;for(let n in r)if(r.hasOwnProperty(n)){let e=r[n];a(e)&&a(e.values)&&t.push(e.values.buffer)}a(e.indices)&&t.push(e.indices.buffer)}function Z(e,t){let r=e.length;for(let n=0;n<r;++n)Y(e[n],t)}function _(e){let t=1,r=e.length;for(let n=0;n<r;n++){let r=e[n];if(++t,!a(r))continue;let o=r.attributes;t+=7+2*y.packedLength+(a(r.indices)?r.indices.length:0);for(let e in o)if(o.hasOwnProperty(e)&&a(o[e])){let r=o[e];t+=5+r.values.length}}return t}function ee(e,t){let r=e.length,n=new Float64Array(1+19*r),o=0;n[o++]=r;for(let i=0;i<r;i++){let t=e[i];if(G.pack(t.modelMatrix,n,o),o+=G.packedLength,a(t.attributes)&&a(t.attributes.offset)){let e=t.attributes.offset.value;n[o]=e[0],n[o+1]=e[1],n[o+2]=e[2]}o+=3}return t.push(n.buffer),n}function te(e){let t=e,r=new Array(t[0]),n=0,o=1;for(;o<t.length;){let e,i=G.unpack(t,o);o+=G.packedLength,a(t[o])&&(e={offset:new j(t[o],t[o+1],t[o+2])}),o+=3,r[n++]={modelMatrix:i,attributes:e}}return r}function R(e){let t=e.length,r=1+(y.packedLength+1)*t,n=new Float32Array(r),o=0;n[o++]=t;for(let i=0;i<t;++i){let t=e[i];a(t)?(n[o++]=1,y.pack(e[i],n,o)):n[o++]=0,o+=y.packedLength}return n}function W(e){let t=new Array(e[0]),r=0,n=1;for(;n<e.length;)1===e[n++]&&(t[r]=y.unpack(e,n)),++r,n+=y.packedLength;return t}S.combineGeometry=function(e){let t,r,n,o,i=e.instances,s=i.length,c=!1;s>0&&(t=Q(e),t.length>0&&(r=b.createAttributeLocations(t[0]),e.createPickOffsets&&(n=X(i,t))),a(i[0].attributes)&&a(i[0].attributes.offset)&&(o=new Array(s),c=!0));let l=new Array(s),u=new Array(s);for(let p=0;p<s;++p){let e=i[p],t=e.geometry;a(t)&&(l[p]=t.boundingSphere,u[p]=t.boundingSphereCV,c&&(o[p]=e.geometry.offsetAttribute));let r=e.eastHemisphereGeometry,n=e.westHemisphereGeometry;a(r)&&a(n)&&(a(r.boundingSphere)&&a(n.boundingSphere)&&(l[p]=y.union(r.boundingSphere,n.boundingSphere)),a(r.boundingSphereCV)&&a(n.boundingSphereCV)&&(u[p]=y.union(r.boundingSphereCV,n.boundingSphereCV)))}return{geometries:t,modelMatrix:e.modelMatrix,attributeLocations:r,pickOffsets:n,offsetInstanceExtend:o,boundingSpheres:l,boundingSpheresCV:u}},S.packCreateGeometryResults=function(e,t){let r=new Float64Array(_(e)),n=[],o={},i=e.length,s=0;r[s++]=i;for(let c=0;c<i;c++){let t=e[c],i=a(t);if(r[s++]=i?1:0,!i)continue;r[s++]=t.primitiveType,r[s++]=t.geometryType,r[s++]=v(t.offsetAttribute,-1);let l=a(t.boundingSphere)?1:0;r[s++]=l,l&&y.pack(t.boundingSphere,r,s),s+=y.packedLength;let u=a(t.boundingSphereCV)?1:0;r[s++]=u,u&&y.pack(t.boundingSphereCV,r,s),s+=y.packedLength;let p=t.attributes,f=[];for(let e in p)p.hasOwnProperty(e)&&a(p[e])&&(f.push(e),a(o[e])||(o[e]=n.length,n.push(e)));r[s++]=f.length;for(let e=0;e<f.length;e++){let t=f[e],n=p[t];r[s++]=o[t],r[s++]=n.componentDatatype,r[s++]=n.componentsPerAttribute,r[s++]=n.normalize?1:0,r[s++]=n.values.length,r.set(n.values,s),s+=n.values.length}let m=a(t.indices)?t.indices.length:0;r[s++]=m,m>0&&(r.set(t.indices,s),s+=m)}return t.push(r.buffer),{stringTable:n,packedData:r}},S.unpackCreateGeometryResults=function(e){let t,r=e.stringTable,n=e.packedData,o=new Array(n[0]),i=0,a=1;for(;a<n.length;){if(1!==n[a++]){o[i++]=void 0;continue}let e,s,c=n[a++],l=n[a++],u=n[a++];-1===u&&(u=void 0),1===n[a++]&&(e=y.unpack(n,a)),a+=y.packedLength,1===n[a++]&&(s=y.unpack(n,a)),a+=y.packedLength;let p,f,m,h,d=new E,g=n[a++];for(t=0;t<g;t++){let e=r[n[a++]],t=n[a++];m=n[a++];let o=0!==n[a++];p=n[a++],f=k.createTypedArray(t,p);for(let r=0;r<p;r++)f[r]=n[a++];d[e]=new L({componentDatatype:t,componentsPerAttribute:m,normalize:o,values:f})}if(p=n[a++],p>0){let e=f.length/m;for(h=U.createTypedArray(e,p),t=0;t<p;t++)h[t]=n[a++]}o[i++]=new z({primitiveType:c,geometryType:l,boundingSphere:e,boundingSphereCV:s,indices:h,attributes:d,offsetAttribute:u})}return o},S.packCombineGeometryParameters=function(e,t){let r=e.createGeometryResults,n=r.length;for(let o=0;o<n;o++)t.push(r[o].packedData.buffer);return{createGeometryResults:e.createGeometryResults,packedInstances:ee(e.instances,t),ellipsoid:e.ellipsoid,isGeographic:e.projection instanceof D,elementIndexUintSupported:e.elementIndexUintSupported,scene3DOnly:e.scene3DOnly,vertexCacheOptimize:e.vertexCacheOptimize,compressVertices:e.compressVertices,modelMatrix:e.modelMatrix,createPickOffsets:e.createPickOffsets}},S.unpackCombineGeometryParameters=function(e){let t=te(e.packedInstances),r=e.createGeometryResults,n=r.length,o=0;for(let s=0;s<n;s++){let e=S.unpackCreateGeometryResults(r[s]),n=e.length;for(let r=0;r<n;r++){let n=e[r],i=t[o];i.geometry=n,++o}}let i=B.clone(e.ellipsoid),a=e.isGeographic?new D(i):new $(i);return{instances:t,ellipsoid:i,projection:a,elementIndexUintSupported:e.elementIndexUintSupported,scene3DOnly:e.scene3DOnly,vertexCacheOptimize:e.vertexCacheOptimize,compressVertices:e.compressVertices,modelMatrix:G.clone(e.modelMatrix),createPickOffsets:e.createPickOffsets}},S.packCombineGeometryResults=function(e,t){a(e.geometries)&&Z(e.geometries,t);let r=R(e.boundingSpheres),n=R(e.boundingSpheresCV);return t.push(r.buffer,n.buffer),{geometries:e.geometries,attributeLocations:e.attributeLocations,modelMatrix:e.modelMatrix,pickOffsets:e.pickOffsets,offsetInstanceExtend:e.offsetInstanceExtend,boundingSpheres:r,boundingSpheresCV:n}},S.unpackCombineGeometryResults=function(e){return{geometries:e.geometries,attributeLocations:e.attributeLocations,modelMatrix:e.modelMatrix,pickOffsets:e.pickOffsets,offsetInstanceExtend:e.offsetInstanceExtend,boundingSpheres:W(e.boundingSpheres),boundingSpheresCV:W(e.boundingSpheresCV)}};var Ge=S;export{Ge as a};