import { Component } from '@angular/core';
import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import View from 'ol/View.js';
import {toStringHDMS} from 'ol/coordinate.js';
import {toLonLat} from 'ol/proj.js';
import Point from 'ol/geom/Point.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import TileLayer from 'ol/layer/Tile';
import TileJSON from 'ol/source/TileJSON.js';
import VectorSource from 'ol/source/Vector.js';
import {Icon, Style} from 'ol/style.js';
import OSM from 'ol/source/OSM';
import PluggableMap from 'ol/PluggableMap';

declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'mdb-angular-free';
  ol: any;
  map: any;
  argentina = ol.proj.fromLonLat([-58.520309, -34.552549]);
  chile = ol.proj.fromLonLat([-70.667061, -33.445992]);
  colombia = ol.proj.fromLonLat([-74.072090, 4.710989]);
  mexico = ol.proj.fromLonLat([-99.133209, 19.432608]);
  paraguay = ol.proj.fromLonLat([-57.575928, -25.263741]);
  uruguay = ol.proj.fromLonLat([-56.164532, -34.901112]);

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap(){
    //----------------------POPUPS----------------------------------
    // var container = document.getElementById('popup');
    // var content = document.getElementById('popup-content');
    // var closer = document.getElementById('popup-closer');
    //
    // var overlay = new ol.Overlay({
    //   element: container,
    //   autoPan: true,
    //   autoPanAnimation: {
    //       duration: 250
    //   }
    // });

    // closer.onclick = function() {
    //   overlay.setPosition(undefined);
    //   closer.blur();
    //   return false;
    // };
    // //------------- FIN POPUPS--------------------------------

    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-58.575298, -34.474284]),
        zoom: 12
      })
    });

    // this.map.on('singleclick', function (event) {
    //     var coordinate = event.coordinate;
    //
    //     content.innerHTML = '<b>Hello world!</b><br />I am a popup.';
    //     overlay.setPosition(coordinate);
    // });

    var element = document.getElementById('popup');

    var overlay = new ol.Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -50]
    });

    this.map.addOverlay(overlay);

    this.map.on('click', (evt) => {
      var feature = this.map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
          return feature;
        });
      if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        overlay.setPosition(coordinates);
        $(element).popover({
          placement: 'top',
          html: true,
          content: feature.get('name')
        });
        $(element).popover('show');
      } else {
        $(element).popover('destroy');
      }
    });

    this.map.on('pointermove', (e) => {
      if (e.dragging) {
        $(element).popover('destroy');
        return;
      }
      var pixel = this.map.getEventPixel(e.originalEvent);
      var hit = this.map.hasFeatureAtPixel(pixel);
      this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    var unicenter = this.crearMarcador('Unicenter',-34.508442, -58.526818)
    var carman = this.crearMarcador('Carman',-34.494614, -58.545781)
    var dot = this.crearMarcador('Dot', -34.545827, -58.488302)

    var vMarcadores = new ol.source.Vector({
      features: [unicenter, carman, dot]
    });

    var vMarcadoresLayer = new ol.layer.Vector({
      source: vMarcadores,
    });

    vMarcadoresLayer.setStyle(new ol.style.Style({
            image: new ol.style.Icon(({
                crossOrigin: 'anonymous',
                src: 'assets/markerIco.png'
            }))
        }));

    this.map.addLayer(vMarcadoresLayer);
  }

  goTo(pais){
    var view = this.map.getView();
    var location;

    switch(pais){
      case 'Argentina':
        location = this.argentina;
        break;
      case 'Chile':
        location = this.chile;
        break;
      case 'Colombia':
        location = this.colombia;
        break;
      case 'Mexico':
        location = this.mexico;
        break;
      case 'Paraguay':
        location = this.paraguay;
        break;
      case 'Uruguay':
        location = this.uruguay;
        break;
    };

    view.animate({
      center: location,
      duration: 1000,
      zoom: 11
    });
  }

  crearMarcador(nombre, lat, long){
    return new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([long, lat])
      ),
      name: nombre,
    });
  }

  onResize(event){
    event.target.innerHeight;
  }

};
