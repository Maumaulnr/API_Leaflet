// Déclaration d'un tableau pour stocker les données des villes
let villes = [];

// initialiser la carte Leaflet
var map = L.map('map').setView([44.89, -0.2798], 10);
// Création d'un groupe de marqueurs pour les villes
var groupMarkers = new L.FeatureGroup();
// Sélection de l'élément input avec la classe "codePostal"
let inputCodePostal = document.querySelector(".codePostal");
// Sélection de l'élément du formulaire
var form = document.querySelector("form");

// Ajout d'un gestionnaire d'événements pour le soumission du formulaire
form.addEventListener("submit", (event) => {
    // Empêche la soumission du formulaire par défaut
    event.preventDefault();
    // Récupération de la valeur du champ code postal
    let codePostal = inputCodePostal.value;
    // Appel de la fonction pour mettre à jour la carte
    updateMapWithVilles(codePostal);
});

// ajout des calques OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

// Définir l'icône personnalisée de la voiture
var carIcon = L.icon({
iconUrl: 'img/car.png',
iconSize: [31, 35],  // Taille de l'icône en pixels
iconAnchor: [16, 16],  // Point d'ancrage de l'icône
popupAnchor: [0, -16]  // Position de la popup par rapport à l'icône
});

// Fonction pour mettre à jour la carte avec les données des villes correspondant au code postal
function updateMapWithVilles(codePostal) {
    // Réinitialiser les marqueurs
    groupMarkers.clearLayers();

    // Effectuer une nouvelle requête pour les villes correspondant au code postal
    fetch("https://geo.api.gouv.fr/communes?codePostal=" + inputCodePostal.value + "&fields=centre,population,code,codesPostaux,")
    // Analyse de la réponse JSON
    .then((response) => response.json())
    .then((data) => {
        // Affichage des données dans la console
        console.log(data);
        // Ajout des données des villes au tableau "villes"
        data.forEach((ville) => {
            villes.push(ville)
        })

        // génération des marqueurs pour les villes
        villes.forEach((point) => {
            let coords = point.centre.coordinates
            // console.log(coords)
            let lat = coords[0];
            let lng = coords[1];
            // Création d'un marqueur
            var marker = L.marker([lng, lat], {icon: carIcon}).addTo(map);
            // Ajout d'une popup au marqueur
            marker.bindPopup("<strong>" + point.nom + "</strong><br>Population : " + point.population + " habitants")

            // marker = L.marker(lat_lng);
            groupMarkers.addLayer(marker); // Ajout du marqueur au groupe de marqueurs
            groupMarkers.addTo(map); // Ajout du groupe de marqueurs à la carte
            // Ajustement de la vue pour afficher tous les marqueurs
            map.fitBounds(groupMarkers.getBounds()); 
        })
    })
    // Gestion des erreurs en affichant un message dans la console
    .catch((error) => console.error(error));
}