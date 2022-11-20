import defaultStyle from '@mapbox/mapbox-gl-draw/src/lib/theme';
import { events } from '@mapbox/mapbox-gl-draw/src/constants';
import Union from '@turf/union';
import Buffer from '@turf/buffer';
import Length from '@turf/length';
import Area from '@turf/area';
import Centroid from '@turf/centroid';
import * as meta from '@turf/meta';
import * as helpers from '@turf/helpers';
import transformTranslate from '@turf/transform-translate';

require('./index.css');

let measurement = {
  length: [],
  area: [],
};

const addToolStyle = [
  ...defaultStyle,
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
  },
];
class extendDrawBar {
  constructor(opt) {
    this.draw = opt.draw;
    this.onRemoveOrig = opt.draw.onRemove;
    const { union, copy, cut, buffer, length, area, centroid } = this.draw.options;
    this.initialOptions = { union, copy, cut, buffer, length, area, centroid };

    this.buttons = [
      {
        name: 'Centroid',
        callback: this.centroidPolygons,
        title: `Centroid tool`,
        classes: ['mapbox-gl-draw_centroid', opt.classPrefix ? `${opt.classPrefix}-centroid` : null],
      },
      {
        name: 'PolygonToPoints',
        callback: this.toPoints,
        title: `PolygonToPoints tool`,
        classes: ['mapbox-gl-draw_poly_to_points', opt.classPrefix ? `${opt.classPrefix}-poly_to_points` : null],
      },
      {
        name: 'LineToPoints',
        callback: this.toPoints,
        title: `LineToPoints tool`,
        classes: ['mapbox-gl-draw_line_to_points', opt.classPrefix ? `${opt.classPrefix}-line_to_points` : null],
      },
      {
        name: 'Union',
        callback: this.unionPolygons,
        title: `Union tool`,
        classes: ['mapbox-gl-draw_union', opt.classPrefix ? `${opt.classPrefix}-union` : null],
      },
      {
        name: 'Buffer',
        callback: this.bufferFeature,
        title: `Buffer tool`,
        classes: ['mapbox-gl-draw_buffer', opt.classPrefix ? `${opt.classPrefix}-buffer` : null],
      },
      {
        name: 'Copy',
        callback: this.copyFeature,
        title: `Copy tool`,
        classes: ['mapbox-gl-draw_copy', opt.classPrefix ? `${opt.classPrefix}-copy` : null],
      },
      {
        name: 'Cut',
        callback: this.cutFeature,
        title: `Cut tool`,
        classes: ['mapbox-gl-draw_cut', opt.classPrefix ? `${opt.classPrefix}-cut` : null],
      },
      {
        name: 'Length',
        callback: this.lengthOfFeature,
        title: `Length tool`,
        classes: ['mapbox-gl-draw_length', opt.classPrefix ? `${opt.classPrefix}-length` : null],
      },
      {
        name: 'Area',
        callback: this.areaOfPolygon,
        title: `Area tool`,
        classes: ['mapbox-gl-draw_area', opt.classPrefix ? `${opt.classPrefix}-area` : null],
      },
    ];
  }

  onAdd(map) {
    this.map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl';
    this.elContainer = this._container;
    this.buttons
      .filter((button) => this.initialOptions[button.name.toLowerCase()] !== false)
      .forEach((b) => {
        this.addButton(b);
      });
    return this._container;
  }
  onRemove(map) {
    this.buttons
      .filter((button) => this.initialOptions[button.name.toLowerCase()] !== false)
      .forEach((b) => {
        this.removeButton(b);
      });
    this.onRemoveOrig(map);
  }

  addButton(opt) {
    var elButton = document.createElement('button');
    elButton.className = 'mapbox-gl-draw_ctrl-draw-btn';
    elButton.setAttribute('title', opt.title);
    if (opt.classes instanceof Array) {
      opt.classes.forEach((c) => {
        elButton.classList.add(c);
      });
    }
    elButton.addEventListener('click', opt.callback.bind(this));
    this.elContainer.appendChild(elButton);
    opt.elButton = elButton;
  }

  removeButton(opt) {
    opt.elButton.removeEventListener('click', opt.action);
    opt.elButton.remove();
  }

  centroidPolygons() {
    const selectedFeatures = this.draw.getSelected().features;
    if (!selectedFeatures.length) return;

    const ids = [];
    const centroids = [];
    selectedFeatures.forEach((main) => {
      if (main.geometry.type !== 'Polygon') return;
      const centroid = Centroid(main.geometry);
      centroid.id = `${main.id}_centroid_${Math.floor(Math.random() * Math.floor(1000))}`;
      ids.push(centroid.id);
      centroids.push(centroid);
      this.draw.add(centroid);
    });
    this.fireCreateCentroid(centroids);
    this.draw.changeMode('simple_select', { featureIds: ids });
  }

  toPoints() {
    const selectedFeatures = this.draw.getSelected().features;
    if (!selectedFeatures.length) return;
    let ids = [];
    let vertcies = [];
    selectedFeatures.forEach((main) => {
      if (['Point', 'MultiPoint'].includes(main.geometry.type)) return;
      let vertex = helpers.multiPoint(meta.coordAll(main.geometry));
      vertex.id = `${main.id}_vertex_${Math.floor(Math.random() * Math.floor(1000))}`;
      ids.push(vertex.id);
      vertcies.push(vertex);
    });
    this.fireCreateVertcies(vertcies);
    this.draw.changeMode('simple_select', { featureIds: ids });
  }

  unionPolygons() {
    const selectedFeatures = this.draw.getSelected().features;
    if (!selectedFeatures.length) return;
    let unionPoly;
    try {
      unionPoly = Union(...this.draw.getSelected().features);
    } catch (err) {
      throw new Error(err);
    }
    if (unionPoly.geometry.type === 'GeometryCollection')
      throw new Error('Selected Features must have the same types!');
    let ids = selectedFeatures.map((i) => i.id);
    this.draw.delete(ids);
    unionPoly.id = ids.join('-');
    this.draw.add(unionPoly);
    this.fireCreateUnion(unionPoly);
    this.draw.changeMode('simple_select', { featureIds: [unionPoly.id] });
  }

  bufferFeature() {
    const selectedFeatures = this.draw.getSelected().features;
    if (!selectedFeatures.length) return;
    const bufferOptions = {};
    bufferOptions.units = this.draw.options.bufferUnits || 'kilometers';
    bufferOptions.steps = this.draw.options.bufferSteps || '64';
    let ids = [];
    let buffers = [];
    selectedFeatures.forEach((main) => {
      let buffered = Buffer(main, this.draw.options.bufferSize || 0.5, bufferOptions);
      buffered.id = `${main.id}_buffer_${Math.floor(Math.random() * Math.floor(1000))}`;
      ids.push(buffered.id);
      buffers.push(buffered);
      // this.draw.add(buffered);
    });
    this.fireCreateBuffer(buffers);
    this.draw.changeMode('simple_select', { featureIds: ids });
  }

  copyFeature() {
    const selectedFeatures = this.draw.getSelected().features;
    if (!selectedFeatures.length) return;
    let ids = [];
    let translated = [];
    selectedFeatures.forEach((main) => {
      var translatedPoly = transformTranslate(main, 2, 35);
      translatedPoly.id = `${main.id}_copy_${Math.floor(Math.random() * Math.floor(1000))}`;
      ids.push(translatedPoly.id);
      translated.push(translatedPoly);
      // this.draw.add(translatedPoly);
    });
    this.fireUpdateCopy(translated);
    this.draw.changeMode('simple_select', { featureIds: ids });
  }

  cutFeature() {
    const selectedFeatures = this.draw.getSelected().features;
    if (!selectedFeatures.length) return;
    let ids = [];
    let cuts = [];
    selectedFeatures.forEach((main) => {
      var cutPoly = transformTranslate(main, 2, 35);
      cutPoly.id = `${main.id}_cut_${Math.floor(Math.random() * Math.floor(1000))}`;
      ids.push(cutPoly.id);
      cuts.push(cutPoly);
      // this.draw.add(translatedPoly);
    });
    this.fireUpdateCut(cuts);
    this.draw.changeMode('simple_select', { featureIds: ids });
  }

  lengthOfFeature() {
    measurement.length = [];
    const selectedFeatures = this.draw.getSelected().features;
    if (!selectedFeatures.length) return;
    selectedFeatures.forEach((main, idx) => {
      let length = Length(main, { units: this.draw.options.lengthUnits || 'kilometers' });
      measurement.length.push({ id: main.id, value: length });
      (this.draw.options.showLength || true) &&
        this.draw.setFeatureProperty(main.id, 'has_length', 'true') &&
        this.draw.setFeatureProperty(main.id, 'length', parseFloat(length).toFixed(4)) &&
        this.draw.setFeatureProperty(main.id, 'length_unit', this.draw.options.lengthUnits || 'kilometers');
    });
    this.fireUpdateMeasurement(measurement.length, 'length');
  }

  areaOfPolygon() {
    measurement.area = [];
    const selectedFeatures = this.draw.getSelected().features;
    if (!selectedFeatures.length) return;
    selectedFeatures.forEach((main, idx) => {
      let area = Area(main);
      measurement.area.push({ id: main.id, value: area });
      (this.draw.options.showArea || true) &&
        this.draw.setFeatureProperty(main.id, 'has_area', 'true') &&
        this.draw.setFeatureProperty(main.id, 'area', parseFloat(area).toFixed(4));
    });
    this.fireUpdateMeasurement(measurement.area, 'area');
  }

  fireCreateCentroid(newF) {
    this.map.fire(events.CREATE, {
      action: 'CentroidPolygon',
      features: newF,
    });
  }
  fireCreateVertcies(newF) {
    this.map.fire(events.CREATE, {
      action: 'toPoints',
      features: newF,
    });
  }
  fireCreateUnion(newF) {
    this.map.fire(events.CREATE, {
      action: 'UnionPolygon',
      features: newF,
    });
  }
  fireCreateBuffer(newF) {
    this.map.fire(events.CREATE, {
      action: 'Buffer',
      features: newF,
    });
  }
  fireUpdateCopy(newF) {
    this.map.fire(events.UPDATE, {
      action: 'Copy',
      features: newF,
    });
  }
  fireUpdateCut(newF) {
    this.map.fire(events.UPDATE, {
      action: 'Cut',
      features: newF,
    });
  }
  fireUpdateMeasurement(newF, type) {
    this.map.fire(events.UPDATE, {
      action: 'Measurement-' + type,
      features: newF,
    });
  }
}

/*
options
------
{
    union: true,
    copy: true,
    buffer: true,
    length: true,
    area: true,
    bufferSize: 500,
    bufferUnit: 'kilometers',
    bufferSteps: 64,
    lengthUnit: 'kilometers',
    showLength: true,
    showArea: true
}
*/

const additionalTools = (draw, classPrefix) =>
  new extendDrawBar({
    draw,
    classPrefix,
  });

export { additionalTools, measurement, addToolStyle };
