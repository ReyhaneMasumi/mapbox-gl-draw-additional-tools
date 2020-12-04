[![NPM](https://img.shields.io/npm/v/mapbox-gl-draw-additional-tools.svg)](https://www.npmjs.com/package/mapbox-gl-draw-additional-tools)
![Develop](https://github.com/reyhanemasumi/mapbox-gl-draw-additional-tools/workflows/Develop/badge.svg)
![Release](https://github.com/reyhanemasumi/mapbox-gl-draw-additional-tools/workflows/Release/badge.svg)

# mapbox-gl-draw-additional-tools

Some additional tools for [MapboxGL-Draw](https://github.com/mapbox/mapbox-gl-draw) like Union, Copy, Buffer, Length, Area and ...

## [DEMO](https://reyhanemasumi.github.io/mapbox-gl-draw-additional-tools/)

![A Gif showing demo usage](https://github.com/ReyhaneMasumi/mapbox-gl-draw-additional-tools/blob/main/demo/public/demo.gif)

## Install

```bash
npm install mapbox-gl-draw-additional-tools
```

or use CDN:

```html
<script src="https://unpkg.com/mapbox-gl-draw-additional-tools"></script>
```

## Usage

```js
import mapboxGl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import additionalTools, { measurement, addToolStyle } from 'mapbox-gl-draw-additional-tools';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-91.874, 42.76], // starting position
    zoom: 12, // starting zoom
});

const draw = new MapboxDraw({
    modes: {
        ...MapboxDraw.modes,
    },
    styles: addToolStyle, // Style to show length or area on features
    userProperties: true,
    union: true, // Default is true. If set to false, the button does not appear in toolbox
    copy: true, // Default is true. If set to false, the button does not appear in toolbox
    buffer: true, // Default is true. If set to false, the button does not appear in toolbox
    bufferSize: 0.5, // Default is 500
    bufferUnit: 'kilometers', //Default is kilometers. It can be miles, degrees or kilometers
    bufferSteps: 64, // Default is 64
    length: true, // Default is true. If set to false, the button does not appear in toolbox
    lengthUnit: 'kilometers', //Default is kilometers. It can be miles, degrees, radians or kilometers
    showLength: true, // Default is true. If set to false, the value does not appear on feature
    area: true, // Default is true. If set to false, the button does not appear in toolbox
    showArea: true, // Default is true. If set to false, the value does not appear on feature
});
map.addControl(draw);
map.addControl(additionalTools(draw), 'top-right');
// or add a class prefix for styling buttons
// e.g. custom-tools-union, custom-tools-buffer, ...
map.addControl(additionalTools(draw, 'custom-tools'), 'top-right');

// You can get length or area value by measurement. See demo!
document.querySelector('.mapbox-gl-draw_length')?.addEventListener('click', () => {
    console.log(measurement.length);
});
document.querySelector('.mapbox-gl-draw_area')?.addEventListener('click', () => {
    console.log(measurement.area);
});
```

Default style for measurement lable is:

```js
{
    id: 'gl-draw-line-active-length',
    type: 'symbol',
    filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true'], ['==', 'user_has_length', 'true']],
    layout: {
        'symbol-placement': 'line-center',
        'text-rotation-alignment': 'map',
        'text-pitch-alignment': 'viewport',
        'text-max-angle': 30,
        'text-max-width': 300,
        'text-field': '{user_length} {user_length_unit}',
        'text-font': ['IranSans-Noto'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 8, 8, 10, 12, 16, 16],
        'text-allow-overlap': false,
    },
    paint: {
        'text-opacity': ['interpolate', ['linear'], ['zoom'], 8, 1],
        'text-color': '#000',
        'text-halo-color': ['interpolate', ['linear'], ['zoom'], 2, '#ffffff', 3, '#ffffff'],
        'text-halo-width': 0.3,
        'text-halo-blur': 1,
    },
},
{
    id: 'gl-draw-polygon-active-length',
    type: 'symbol',
    filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true'], ['==', 'user_has_length', 'true']],
    layout: {
        'symbol-placement': 'line-center',
        'text-rotation-alignment': 'map',
        'text-pitch-alignment': 'viewport',
        'text-max-angle': 30,
        'text-max-width': 300,
        'text-field': '{user_length} {user_length_unit}',
        'text-font': ['IranSans-Noto'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 8, 8, 10, 12, 16, 16],
        'text-allow-overlap': false,
    },
    paint: {
        'text-opacity': ['interpolate', ['linear'], ['zoom'], 8, 1],
        'text-color': '#000',
        'text-halo-color': ['interpolate', ['linear'], ['zoom'], 2, '#ffffff', 3, '#ffffff'],
        'text-halo-width': 0.3,
        'text-halo-blur': 1,
    },
},
{
    id: 'gl-draw-polygon-active-area',
    type: 'symbol',
    filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true'], ['==', 'user_has_area', 'true']],
    layout: {
        'symbol-placement': 'line',
        'text-rotation-alignment': 'map',
        'text-pitch-alignment': 'viewport',
        'text-max-angle': 30,
        'text-max-width': 300,
        'text-field': '{user_area} meters^2',
        'text-font': ['IranSans-Noto'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 8, 8, 10, 12, 16, 16],
        'text-allow-overlap': false,
    },
    paint: {
        'text-opacity': ['interpolate', ['linear'], ['zoom'], 8, 1],
        'text-color': '#000',
        'text-halo-color': ['interpolate', ['linear'], ['zoom'], 2, '#ffffff', 3, '#ffffff'],
        'text-halo-width': 0.3,
        'text-halo-blur': 1,
    },
}
```

You can rewrite it as you want!

## [Example](https://github.com/ReyhaneMasumi/mapbox-gl-draw-additional-tools/blob/main/demo/src/App.js)

## License

MIT © [ReyhaneMasumi](LICENSE)
