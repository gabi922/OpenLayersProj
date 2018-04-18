import * as ol from "openlayers";

class MultiVectorSnapOptions {
    features?: ol.Collection<ol.Feature>;
    edge?: boolean;
    vertex?: boolean;
    pixelTolerance?: number;
    source?: ol.source.Vector[];
}

export class MultiVectorSnap extends ol.interaction.Snap {
    constructor(options?: MultiVectorSnapOptions) {
        let snapOptions: ol.olx.interaction.SnapOptions = {};

        if (options) {
            let allFeatures = [].concat.apply([], options.source.map(v => v.getFeatures()));
            snapOptions = Object.assign(options, { source: new ol.source.Vector({ features: allFeatures }) });
        } 

        super(snapOptions);
    }
}
