// import { select, json, geoPath, geoMercator } from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { 
    select, 
    json, 
    geoPath, 
    geoMercator, 
    zoom, 
    zoomIdentity } 
    from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';


const svg = select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');



const projection = geoMercator().scale(2370).translate([width / 1.7, height / 0.28]);
const pathGenerator = geoPath().projection(projection);


let currentTowns = 50;


const zoomBehavior = zoom()
.scaleExtent([1, 8])
.on('zoom', zoomed);

svg.call(zoomBehavior);

function zoomed(event) {
    const {transform } = event;
    svg.selectAll('.country, .town-circle')
    .attr('transform', event.transform);
    svg.selectAll('.circle')
    .attr('transform', event.transform);
  }




function plotMap() {
    json('https://raw.githubusercontent.com/ONSvisual/topojson_boundaries/master/geogNUTS2018UK.json')
    .then(data => {
        const cities = topojson.feature(data, data.objects.nuts3);
        
        const paths = svg.selectAll('.country')
            .data(cities.features);
        paths.enter().append('path')
            .attr('class', 'country')
            .attr('d', d => pathGenerator(d));
    });
}

function plotTowns() {
    const townsURL = `http://34.38.72.236/Circles/Towns/${currentTowns}`;
    json(townsURL)
        .then(function(townData) {
            svg.selectAll('.town-circle').remove();
            
            svg.selectAll('.town-circle').data(townData)
                .enter().append('circle')
                .attr('class', 'town-circle')
                .attr('cx', function(d) {
                    return projection([d.lng, d.lat])[0];
                    
                })
                .attr('cy', function(d) {
                    return projection([d.lng, d.lat])[1];
            
                })
                .attr('r', 5)
                .append('title')
                .text(function(d) {
                    return "County: " + d.County + "\nPopulation: " + d.Population + "\nTown: " + d.Town + "\nLat: " + d.lat + "\nLng: " + d.lng;
                });
        });
}


plotMap();
plotTowns();

function refreshTowns() {
    plotTowns();
}

const townsRange = document.getElementById('townsRange');
const townsValue = document.getElementById('townsValue');
townsRange.addEventListener('input', function() {
    currentTowns = townsRange.value;
    townsValue.innerText = currentTowns;
});

const reloadButton = document.getElementById('reloadButton');
reloadButton.addEventListener('click', function() {
    plotTowns();   


const zoomInButton = document
.getElementById('zoomInButton');
const zoomOutButton = document
.getElementById('zoomOutButton');

    zoomInButton.addEventListener('click', function () {
        svg.transition()
        .call(zoomBehavior.scaleBy, 1.5);
    });
    zoomOutButton.addEventListener('click', function () {
        svg.transition()
        .call(zoomBehavior.scaleBy, 0.5);
    });


});
