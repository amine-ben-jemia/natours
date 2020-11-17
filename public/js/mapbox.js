export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW1pbmVyb25pIiwiYSI6ImNraGIyY3RteTAwZ3Uyd3F0Zmkwb2hpNGMifQ.5gLWqGZwR-XGNXaffWyOAA'
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/amineroni/ckhb2p53j041c19kb5azt5fn2',
    scrollZoom:false,
    // center:[10.316870,36.832520],
    // zoom:10
    });
    
    const bounds = new mapboxgl.LngLatBounds()
    
    locations.forEach(loc =>{
        const el = document.createElement('div')
        el.className = 'marker'
    
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map)
    
        // Add popup
        new mapboxgl.Popup({
            offset: 30
        })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day} : ${loc.description}<p/>`)
        .addTo(map)
    
    
        // Extend map bounds to include current location
         bounds.extend(loc.coordinates) 
    
    map.fitBounds(bounds,{
            top:200,
            bottom: 150,
            left: 100,
            right: 100
        })
    })
    
}


