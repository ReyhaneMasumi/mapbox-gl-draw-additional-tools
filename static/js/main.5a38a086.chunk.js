(this.webpackJsonpdemo=this.webpackJsonpdemo||[]).push([[0],{42:function(e,t,a){},56:function(e,t,a){},57:function(e,t,a){},58:function(e,t,a){"use strict";a.r(t);var o=a(8),i=a(4),n=a.n(i),r=a(21),l=a.n(r),s=(a(42),a(35)),c=a(34),u=a(14),f=a.n(u),h=a(17),d=(a(55),a(27)),p=a(28),m=a(9),g=a(29),y=a(33),x=a(36),v=a(30),b=a(31),w=a(32),P=a(18),_=a(12),M=a(0);a(56);var j,k,O={length:[],area:[]},C=[].concat(Object(m.a)(_.a),[{id:"gl-draw-line-active-length",type:"symbol",filter:["all",["==","$type","LineString"],["==","active","true"],["==","user_has_length","true"]],layout:{"symbol-placement":"line-center","text-rotation-alignment":"map","text-pitch-alignment":"viewport","text-max-angle":30,"text-max-width":300,"text-field":"{user_length} {user_length_unit}","text-font":["IranSans-Noto"],"text-size":["interpolate",["linear"],["zoom"],8,8,10,12,16,16],"text-allow-overlap":!1},paint:{"text-opacity":["interpolate",["linear"],["zoom"],8,1],"text-color":"#000","text-halo-color":["interpolate",["linear"],["zoom"],2,"#ffffff",3,"#ffffff"],"text-halo-width":.3,"text-halo-blur":1}},{id:"gl-draw-polygon-active-length",type:"symbol",filter:["all",["==","$type","Polygon"],["==","active","true"],["==","user_has_length","true"]],layout:{"symbol-placement":"line-center","text-rotation-alignment":"map","text-pitch-alignment":"viewport","text-max-angle":30,"text-max-width":300,"text-field":"{user_length} {user_length_unit}","text-font":["IranSans-Noto"],"text-size":["interpolate",["linear"],["zoom"],8,8,10,12,16,16],"text-allow-overlap":!1},paint:{"text-opacity":["interpolate",["linear"],["zoom"],8,1],"text-color":"#000","text-halo-color":["interpolate",["linear"],["zoom"],2,"#ffffff",3,"#ffffff"],"text-halo-width":.3,"text-halo-blur":1}},{id:"gl-draw-polygon-active-area",type:"symbol",filter:["all",["==","$type","Polygon"],["==","active","true"],["==","user_has_area","true"]],layout:{"symbol-placement":"line","text-rotation-alignment":"map","text-pitch-alignment":"viewport","text-max-angle":30,"text-max-width":300,"text-field":"{user_area} meters^2","text-font":["IranSans-Noto"],"text-size":["interpolate",["linear"],["zoom"],8,8,10,12,16,16],"text-allow-overlap":!1},paint:{"text-opacity":["interpolate",["linear"],["zoom"],8,1],"text-color":"#000","text-halo-color":["interpolate",["linear"],["zoom"],2,"#ffffff",3,"#ffffff"],"text-halo-width":.3,"text-halo-blur":1}}]),z=function(){function e(t){Object(d.a)(this,e),this.draw=t.draw,this.onRemoveOrig=t.draw.onRemove;var a=this.draw.options,o=a.union,i=a.copy,n=a.cut,r=a.buffer,l=a.length,s=a.area,c=a.centroid;this.initialOptions={union:o,copy:i,cut:n,buffer:r,length:l,area:s,centroid:c},this.buttons=[{name:"Centroid",callback:this.centroidPolygons,title:"Centroid tool",classes:["mapbox-gl-draw_centroid",t.classPrefix?"".concat(t.classPrefix,"-centroid"):null]},{name:"PolygonToPoints",callback:this.toPoints,title:"PolygonToPoints tool",classes:["mapbox-gl-draw_poly_to_points",t.classPrefix?"".concat(t.classPrefix,"-poly_to_points"):null]},{name:"LineToPoints",callback:this.toPoints,title:"LineToPoints tool",classes:["mapbox-gl-draw_line_to_points",t.classPrefix?"".concat(t.classPrefix,"-line_to_points"):null]},{name:"Union",callback:this.unionPolygons,title:"Union tool",classes:["mapbox-gl-draw_union",t.classPrefix?"".concat(t.classPrefix,"-union"):null]},{name:"Buffer",callback:this.bufferFeature,title:"Buffer tool",classes:["mapbox-gl-draw_buffer",t.classPrefix?"".concat(t.classPrefix,"-buffer"):null]},{name:"Copy",callback:this.copyFeature,title:"Copy tool",classes:["mapbox-gl-draw_copy",t.classPrefix?"".concat(t.classPrefix,"-copy"):null]},{name:"Cut",callback:this.cutFeature,title:"Cut tool",classes:["mapbox-gl-draw_cut",t.classPrefix?"".concat(t.classPrefix,"-cut"):null]},{name:"Length",callback:this.lengthOfFeature,title:"Length tool",classes:["mapbox-gl-draw_length",t.classPrefix?"".concat(t.classPrefix,"-length"):null]},{name:"Area",callback:this.areaOfPolygon,title:"Area tool",classes:["mapbox-gl-draw_area",t.classPrefix?"".concat(t.classPrefix,"-area"):null]}]}return Object(p.a)(e,[{key:"onAdd",value:function(e){var t=this;return this.map=e,this._container=document.createElement("div"),this._container.className="mapboxgl-ctrl-group mapboxgl-ctrl",this.elContainer=this._container,this.buttons.filter((function(e){return!1!==t.initialOptions[e.name.toLowerCase()]})).forEach((function(e){t.addButton(e)})),this._container}},{key:"onRemove",value:function(e){var t=this;this.buttons.filter((function(e){return!1!==t.initialOptions[e.name.toLowerCase()]})).forEach((function(e){t.removeButton(e)})),this.onRemoveOrig(e)}},{key:"addButton",value:function(e){var t=document.createElement("button");t.className="mapbox-gl-draw_ctrl-draw-btn",t.setAttribute("title",e.title),e.classes instanceof Array&&e.classes.forEach((function(e){t.classList.add(e)})),t.addEventListener("click",e.callback.bind(this)),this.elContainer.appendChild(t),e.elButton=t}},{key:"removeButton",value:function(e){e.elButton.removeEventListener("click",e.action),e.elButton.remove()}},{key:"centroidPolygons",value:function(){var e=this.draw.getSelected().features;if(e.length){var t=[],a=[];e.forEach((function(e){if("Polygon"===e.geometry.type){var o=Object(b.a)(e.geometry);o.id="".concat(e.id,"_centroid_").concat(Math.floor(Math.random()*Math.floor(1e3))),t.push(o.id),a.push(o)}})),this.fireCreateCentroid(a),this.draw.changeMode("simple_select",{featureIds:t})}}},{key:"toPoints",value:function(){var e=this.draw.getSelected().features;if(e.length){var t=[],a=[];e.forEach((function(e){if(!["Point","MultiPoint"].includes(e.geometry.type)){var o=Object(w.a)(e.geometry);o.id="".concat(e.id,"_vertex_").concat(Math.floor(Math.random()*Math.floor(1e3))),t.push(o.id),a.push(o)}})),this.fireCreateVertcies(a),this.draw.changeMode("simple_select",{featureIds:t})}}},{key:"unionPolygons",value:function(){var e=this.draw.getSelected().features;if(e.length){var t;try{t=g.a.apply(void 0,Object(m.a)(this.draw.getSelected().features))}catch(o){throw new Error(o)}if("GeometryCollection"===t.geometry.type)throw new Error("Selected Features must have the same types!");var a=e.map((function(e){return e.id}));this.draw.delete(a),t.id=a.join("-"),this.draw.add(t),this.fireCreateUnion(t),this.draw.changeMode("simple_select",{featureIds:[t.id]})}}},{key:"bufferFeature",value:function(){var e=this,t=this.draw.getSelected().features;if(t.length){var a={};a.units=this.draw.options.bufferUnits||"kilometers",a.steps=this.draw.options.bufferSteps||"64";var o=[],i=[];t.forEach((function(t){var n=Object(y.a)(t,e.draw.options.bufferSize||.5,a);n.id="".concat(t.id,"_buffer_").concat(Math.floor(Math.random()*Math.floor(1e3))),o.push(n.id),i.push(n)})),this.fireCreateBuffer(i),this.draw.changeMode("simple_select",{featureIds:o})}}},{key:"copyFeature",value:function(){var e=this.draw.getSelected().features;if(e.length){var t=[],a=[];e.forEach((function(e){var o=Object(P.a)(e,2,35);o.id="".concat(e.id,"_copy_").concat(Math.floor(Math.random()*Math.floor(1e3))),t.push(o.id),a.push(o)})),this.fireUpdateCopy(a),this.draw.changeMode("simple_select",{featureIds:t})}}},{key:"cutFeature",value:function(){var e=this.draw.getSelected().features;if(e.length){var t=[],a=[];e.forEach((function(e){var o=Object(P.a)(e,2,35);o.id="".concat(e.id,"_cut_").concat(Math.floor(Math.random()*Math.floor(1e3))),t.push(o.id),a.push(o)})),this.fireUpdateCut(a),this.draw.changeMode("simple_select",{featureIds:t})}}},{key:"lengthOfFeature",value:function(){var e=this;O.length=[];var t=this.draw.getSelected().features;t.length&&(t.forEach((function(t,a){var o=Object(x.a)(t,{units:e.draw.options.lengthUnits||"kilometers"});O.length.push({id:t.id,value:o}),e.draw.options.showLength,e.draw.setFeatureProperty(t.id,"has_length","true")&&e.draw.setFeatureProperty(t.id,"length",parseFloat(o).toFixed(4))&&e.draw.setFeatureProperty(t.id,"length_unit",e.draw.options.lengthUnits||"kilometers")})),this.fireUpdateMeasurement(O.length,"length"))}},{key:"areaOfPolygon",value:function(){var e=this;O.area=[];var t=this.draw.getSelected().features;t.length&&(t.forEach((function(t,a){var o=Object(v.a)(t);O.area.push({id:t.id,value:o}),e.draw.options.showArea,e.draw.setFeatureProperty(t.id,"has_area","true")&&e.draw.setFeatureProperty(t.id,"area",parseFloat(o).toFixed(4))})),this.fireUpdateMeasurement(O.area,"area"))}},{key:"fireCreateCentroid",value:function(e){this.map.fire(M.j.CREATE,{action:"CentroidPolygon",features:e})}},{key:"fireCreateVertcies",value:function(e){this.map.fire(M.j.CREATE,{action:"toPoints",features:e})}},{key:"fireCreateUnion",value:function(e){this.map.fire(M.j.CREATE,{action:"UnionPolygon",features:e})}},{key:"fireCreateBuffer",value:function(e){this.map.fire(M.j.CREATE,{action:"Buffer",features:e})}},{key:"fireUpdateCopy",value:function(e){this.map.fire(M.j.UPDATE,{action:"Copy",features:e})}},{key:"fireUpdateCut",value:function(e){this.map.fire(M.j.UPDATE,{action:"Cut",features:e})}},{key:"fireUpdateMeasurement",value:function(e,t){this.map.fire(M.j.UPDATE,{action:"Measurement-"+t,features:e})}}]),e}();a(57);var T=function(){"unavailable"===f.a.getRTLTextPluginStatus()&&f.a.setRTLTextPlugin("https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",(function(e){e&&console.error(e)}),!0);var e=Object(i.useRef)(null),t=Object(i.useState)(),a=Object(c.a)(t,2),n=a[0],r=a[1];return Object(i.useEffect)((function(){j=new f.a.Map({container:e.current||"",style:"https://map.ir/vector/styles/main/mapir-xyz-light-style.json",center:[51.3857,35.6102],zoom:10,pitch:0,interactive:!0,hash:!0,attributionControl:!0,customAttribution:"\xa9 Map \xa9 Openstreetmap",transformRequest:function(e){return{url:e,headers:{"x-api-key":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImRiZWU0YWU4OTk4OTA3MmQ3OTFmMjQ4ZDE5N2VhZTgwZWU2NTUyYjhlYjczOWI2NDdlY2YyYzIzNWRiYThiMzIzOTM5MDkzZDM0NTY2MmU3In0.eyJhdWQiOiI5NDMyIiwianRpIjoiZGJlZTRhZTg5OTg5MDcyZDc5MWYyNDhkMTk3ZWFlODBlZTY1NTJiOGViNzM5YjY0N2VjZjJjMjM1ZGJhOGIzMjM5MzkwOTNkMzQ1NjYyZTciLCJpYXQiOjE1OTA4MjU0NzIsIm5iZiI6MTU5MDgyNTQ3MiwiZXhwIjoxNTkzNDE3NDcyLCJzdWIiOiIiLCJzY29wZXMiOlsiYmFzaWMiXX0.M_z4xJlJRuYrh8RFe9UrW89Y_XBzpPth4yk3hlT-goBm8o3x8DGCrSqgskFfmJTUD2wC2qSoVZzQKB67sm-swtD5fkxZO7C0lBCMAU92IYZwCdYehIOtZbP5L1Lfg3C6pxd0r7gQOdzcAZj9TStnKBQPK3jSvzkiHIQhb6I0sViOS_8JceSNs9ZlVelQ3gs77xM2ksWDM6vmqIndzsS-5hUd-9qdRDTLHnhdbS4_UBwNDza47Iqd5vZkBgmQ_oDZ7dVyBuMHiQFg28V6zhtsf3fijP0UhePCj4GM89g3tzYBOmuapVBobbX395FWpnNC3bYg7zDaVHcllSUYDjGc1A","Mapir-SDK":"reactjs"}}}}),k=new h.a({modes:Object(s.a)({},h.a.modes),styles:C,bufferSize:.5,bufferUnit:"kilometers",bufferSteps:64,userProperties:!0}),j.once("load",(function(){j.resize(),j.addControl(k,"top-right"),r(j.addControl(function(e,t){return new z({draw:e,classPrefix:t})}(k,"custom-prefix"),"top-right")),k.set({type:"FeatureCollection",features:[{type:"Feature",properties:{},id:"example-id",geometry:{type:"Polygon",coordinates:[[[51.41742415918904,35.73019558439101],[51.31319413385742,35.702773908694724],[51.378997493472525,35.665562843119986],[51.45008537540798,35.67776544979942],[51.46619566741822,35.70822028156377],[51.41742415918904,35.73019558439101]]]}}]}),j.on("draw.create",(function(e){console.log(e)})),j.on("draw.update",(function(e){console.log(e)}))}))}),[]),Object(i.useEffect)((function(){var e,t;n&&(null===(e=document.querySelector(".mapbox-gl-draw_length"))||void 0===e||e.addEventListener("click",(function(){console.log(O.length)}))),n&&(null===(t=document.querySelector(".mapbox-gl-draw_area"))||void 0===t||t.addEventListener("click",(function(){console.log(O.area)})))}),[n]),Object(o.jsx)("div",{className:"map-wrapper",children:Object(o.jsx)("div",{id:"map",ref:e})})},I=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,59)).then((function(t){var a=t.getCLS,o=t.getFID,i=t.getFCP,n=t.getLCP,r=t.getTTFB;a(e),o(e),i(e),n(e),r(e)}))};l.a.render(Object(o.jsx)(n.a.StrictMode,{children:Object(o.jsx)(T,{})}),document.getElementById("root")),I()}},[[58,1,2]]]);
//# sourceMappingURL=main.5a38a086.chunk.js.map