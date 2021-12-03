// filter table
$("#search-input").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("table tbody tr").each(function () {
    $(this).toggle(
      $(this).children("#item-name").html().toLowerCase().indexOf(value) > -1
    );
  });
});

$(".close.icon").on("click", function () {
  console.log("close icon was clicked");
  $(this).parent().transition("fade");
});

// get url query
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

// leaflets map
let accessToken =
  "pk.eyJ1IjoiaW5ld3NrIiwiYSI6ImNrd3E2Ynh5cDBqcmMyb255NDQ3YW81NWEifQ.zs60MFn5-hrneP0Bsr7o9Q";
let map = L.map("map").setView([22.3330432, 114.1401441], 12);
let ourData = [];

L.tileLayer(
  `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
  {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: accessToken,
  }
).addTo(map);

var marker = L.marker([getQueryVariable("lat"), getQueryVariable("lng")]).addTo(
  map
);
