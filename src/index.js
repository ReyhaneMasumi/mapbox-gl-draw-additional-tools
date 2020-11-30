import union from '@turf/union';
import buffer from '@turf/buffer';
import transformTranslate from '@turf/transform-translate';

require('./index.css');

class extendDrawBar {
    constructor(opt) {
        this.draw = opt.draw;
        this.options = opt.options;
        this.buttons = opt.buttons || [];
        this.onRemoveOrig = opt.draw.onRemove;

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
        ];
    }

    onAdd(map) {
        this.map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl';
        this.elContainer = this._container;
        this.buttons.forEach((b) => {
            this.addButton(b);
        });
        return this._container;
    }
    onRemove(map) {
        this.buttons.forEach((b) => {
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

        let unionPoly = union(...selectedFeatures);
        // let unionPoly = union(features);
        let ids = selectedFeatures.map((i) => i.id);
        this.draw.delete(ids);
        this.draw.add(unionPoly);
        this.draw.changeMode('simple_select', { featureIDs: [unionPoly.id] });
    }

    bufferFeature() {
        const selectedFeatures = this.draw.getSelected().features;
        if (!selectedFeatures.length) return;

        let main = selectedFeatures[0];
        let buffered = buffer(main, this.draw.options.bufferSize || 500, { units: 'meters' });
        buffered.id = main.id + '-buffer';
        this.draw.add(buffered);
        this.draw.changeMode('simple_select', { featureIDs: [buffered.id] });
    }

    copyFeature() {
        const selectedFeatures = this.draw.getSelected().features;
        if (!selectedFeatures.length) return;

        let main = selectedFeatures[0];
        var translatedPoly = transformTranslate(main, 2, 35);
        // this.draw.add(translatedPoly);
        // If id had not changed, the main feature will transformTranslate!
        this.draw.add({
            id: `copy_of_${translatedPoly.id}`,
            type: translatedPoly.type,
            geometry: translatedPoly.geometry,
            properties: translatedPoly.properties,
        });

        this.draw.changeMode('simple_select', { featureIDs: [`copy_of_${translatedPoly.id}`] });
    }
}

export default (draw, options) =>
    new extendDrawBar({
        draw,
        options,
    });
