'use strict';

const ip_search_input = document.querySelector('.ip_search_box');
const search_btn = document.querySelector('.icon_box');
const loadSpinner = document.querySelector('.loading-spinner');

const showLoadSpinner = function () {
  loadSpinner.style.display = 'block';
};

const hideLoadSpinner = function () {
  loadSpinner.style.display = 'none';
};

let marker;
let map;
const addressTracker = async function (ip = '') {
  try {
    showLoadSpinner();
    const data = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_sjoQQDxpQbxy4hC4BzroHP4bqCmMT&ipAddress=${ip}`
    );

    const res = await data.json();
    const { lat, lng } = res.location;
    // console.log(res);

    const ip_address = document.querySelector('.ip');
    const country = document.querySelector('.country');
    const region = document.querySelector('.region');
    const timezone = document.querySelector('.timezone');
    const isp = document.querySelector('.isp');
    // const map = document.querySelector("#map");

    ip_address.textContent = res.ip;
    country.textContent = res.location.country;
    region.textContent = res.location.region;
    timezone.textContent = res.location.timezone;
    isp.textContent = res.isp;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude } = position.coords;
          const { longitude } = position.coords;
          // console.log(`https://www.google.com/maps/@${lat},${lng}`);

          const coords = [latitude, longitude];

          if (!map) {
            map = L.map('map').setView(coords, 13);
            // map = L.map("map").setView(coords, 13);

            L.tileLayer('https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);
          }

          if (coords[0] && coords[1]) {
            map.panTo(coords);
            L.marker(coords)
              .addTo(map)
              .bindPopup(
                L.popup({
                  maxWidth: 250,
                  minWidth: 100,
                  autoClose: false,
                  closeOnClick: false,
                })
              )
              .setPopupContent(`This is your IP Address: ${res.ip}`)
              .openPopup();
          }
        },
        () => {
          alert('Could not get your location');
        }
      );
    }
    hideLoadSpinner();
  } catch (error) {
    alert(`Error : IP Address is invalid`);
  }
};

addressTracker();

search_btn.addEventListener('click', function () {
  addressTracker(ip_search_input.value);
  ip_search_input.value = '';
});

document.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addressTracker(ip_search_input.value);
    ip_search_input.value = '';
  }
});

// // Default to IP location
// const coords = [lat, lng];
// map = L.map("map").setView(coords, 13);
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution:
//     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// }).addTo(map);

// marker = L.marker(coords)
//   .addTo(map)
//   .bindPopup(`This is your IP Address: ${res.ip}`)
//   .openPopup();

// // Try getting actual location
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const userCoords = [
//         position.coords.latitude,
//         position.coords.longitude,
//       ];
//       map.setView(userCoords, 13);
//       marker.setLatLng(userCoords).setPopupContent(`Your current location`);
//     },
//     () => {
//       console.warn(
//         "Could not get your location, using IP-based location instead."
//       );
//     }
//   );
// }
