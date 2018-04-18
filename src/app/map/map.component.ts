import { Component, OnInit } from '@angular/core';
import * as ol from "openlayers";
import { MultiVectorSnap } from "./multi-vector-snap.interaction";

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    private map: ol.Map;
    private draw: ol.interaction.Draw;
    private snap: ol.interaction.Snap;
    private layers: { name: string, vector: ol.layer.Vector }[] = [];

    constructor() { }

    ngOnInit() {
        let baseLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
        let view = new ol.View({
            center: ol.proj.transform([ -0.182612, 51.5011 ], 'EPSG:4326', 'EPSG:3857'),
            zoom: 18
        });

        this.map = new ol.Map({
            target: 'map',
            layers: [ baseLayer ],
            view: view
        });
    }

    addLayer() {
        let sourceVector = new ol.source.Vector();

        let vector = new ol.layer.Vector({
            source: sourceVector,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#dd5555',
                    width: 5,

                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#5555dd'
                    })
                })
            })
        });

        this.map.addLayer(vector);
        this.layers.push({ name: "Layer" + (this.layers.length + 1), vector: vector });
    }

    newNode() {
        this.newElement('Point');
    }

    newLink() {
        this.newElement('LineString');
    }

    private newElement(elementType) {
        if (this.layers.length === 0) {
            alert("Add a layer first!");
            return;
        }

        this.removeInteractions();
        this.addInteractions(elementType);
    }

    removeInteractions() {
        if (this.draw) {
          this.map.removeInteraction(this.draw);
        }

        if (this.snap) {
            this.map.removeInteraction(this.snap);
        }
    }

    addInteractions(elementType) {
        this.draw = new ol.interaction.Draw({
            source: this.layers[this.layers.length - 1].vector.getSource(),
            type: elementType
        });
        this.map.addInteraction(this.draw);

        this.snap = new MultiVectorSnap({
            source: this.layers.map(l => l.vector.getSource())
        });
        this.map.addInteraction(this.snap);
    }
}
