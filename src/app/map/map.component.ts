import { Component, OnInit } from '@angular/core';
import * as ol from "openlayers";

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map: ol.Map;
  private draw: ol.interaction.Draw;
  private snap: ol.interaction.Snap;
  private modify: ol.interaction.Modify;
  private translate: ol.interaction.Translate;
  private vectorSource: ol.source.Vector;

  private inputGeoJSON = {  
    "type":"FeatureCollection",
    "features":[  
       {  
          "type":"Feature",
          "geometry":{  
             "type":"LineString",
             "coordinates":[  
                [  
                   413371.4489662333,
                   7213209.485215513
                ],
                [  
                   217692.65655618208,
                   7210763.500310387
                ],
                [  
                   227476.5961766846,
                   7029760.61733109
                ],
                [  
                   414594.4414187961,
                   7032206.602236216
                ],
                [  
                   409702.4716085447,
                   7121485.051273301
                ],
                [  
                   305748.11314070504,
                   7119039.066368176
                ]
             ]
          },
          "properties":null
       }
    ]
 };

  constructor() { }

  ngOnInit() {
    let baseLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });

    let view = new ol.View({
      center: ol.proj.transform([ -2.244644, 	53.483959 ], 'EPSG:4326', 'EPSG:3857'),
      zoom: 7
    });

    this.vectorSource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(this.inputGeoJSON)
    });
    var vector = new ol.layer.Vector({
      source: this.vectorSource
    });
    
    this.map = new ol.Map({
      target: 'map',
      layers: [ baseLayer, vector ],
      view: view
    });

    this.modify = new ol.interaction.Modify({ source: this.vectorSource });

    this.draw = new ol.interaction.Draw({
      source: this.vectorSource,
      type: 'LineString'
    });

    this.snap = new ol.interaction.Snap({
      source: this.vectorSource
    });

    this.translate = new ol.interaction.Translate({
      layers: [ vector ]
    });
    
    this.map.on("click", (e: any) => {
      this.map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
        if (feature) {
          
        }
      });
    });

    var selectAltClick = new ol.interaction.Select({
      condition: function(mapBrowserEvent) {
        return ol.events.condition.click(mapBrowserEvent) &&
            ol.events.condition.altKeyOnly(mapBrowserEvent);
      }
    });

    this.map.addInteraction(selectAltClick);
    selectAltClick.on('select', function(e) {
          console.log(e);
    });


  }

  // TODO: Draw an initial line starting from GeoJSON
  // Create, Update, Delete road links
  

  edit() {
    this.map.addInteraction(this.draw);
    this.map.addInteraction(this.snap);
    this.map.addInteraction(this.modify);
    //this.map.addInteraction(this.translate);
  }

  save() {
    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(this.snap);
    this.map.removeInteraction(this.modify);
    //this.map.removeInteraction(this.translate);

    var writer = new ol.format.GeoJSON();
    var geoJson = writer.writeFeatures(this.vectorSource.getFeatures());

    console.log(geoJson);


    //

    // TODO: Save changes to GeoJSON format

  }
}
