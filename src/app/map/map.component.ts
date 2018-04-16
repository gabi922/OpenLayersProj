import { Component, OnInit } from '@angular/core';
import * as ol from "openlayers";

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let baseLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });

    var feature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform([-95, 45], 'EPSG:4326', 'EPSG:3857'))
    });
    feature.setId("My Feature");

    var sourceVector = new ol.source.Vector({
      features: [ feature ]
    });

    var layerVector = new ol.layer.Vector({
      source: sourceVector
    });

    let view = new ol.View({
      center: ol.proj.transform([ -95, 45 ], 'EPSG:4326', 'EPSG:3857'),
      zoom: 3
    });

    let map = new ol.Map({
      target: 'map',
      layers: [ baseLayer, layerVector ],
      view: view
    });
  }
}
