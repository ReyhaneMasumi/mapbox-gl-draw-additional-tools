import Union from '@turf/union';
import Buffer from '@turf/buffer';
import Length from '@turf/length';
import Area from '@turf/area';
import transformTranslate from '@turf/transform-translate';
import defaultStyle from '@mapbox/mapbox-gl-draw/src/lib/theme';

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
        const { union, copy, buffer, length, area } = this.draw.options;
        this.initialOptions = { union, copy, buffer, length, area };

        this.buttons = [
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
        this.draw.changeMode('simple_select', { featureIds: [unionPoly.id] });
    }

    bufferFeature() {
        const selectedFeatures = this.draw.getSelected().features;
        if (!selectedFeatures.length) return;
        const bufferOptions = {};
        bufferOptions.units = this.draw.options.bufferUnits || 'kilometers';
        bufferOptions.steps = this.draw.options.bufferSteps || '64';
        let ids = [];
        selectedFeatures.forEach((main) => {
            let buffered = Buffer(main, this.draw.options.bufferSize || 0.5, bufferOptions);
            buffered.id = `${main.id}_buffer_${Math.floor(Math.random() * Math.floor(1000))}`;
            ids.push(buffered.id);
            this.draw.add(buffered);
        });
        this.draw.changeMode('simple_select', { featureIds: ids });
    }

    copyFeature() {
        const selectedFeatures = this.draw.getSelected().features;
        if (!selectedFeatures.length) return;
        let ids = [];
        selectedFeatures.forEach((main) => {
            var translatedPoly = transformTranslate(main, 2, 35);
            translatedPoly.id = `${main.id}_copy_${Math.floor(Math.random() * Math.floor(1000))}`;
            ids.push(translatedPoly.id);
            this.draw.add(translatedPoly);
        });
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
