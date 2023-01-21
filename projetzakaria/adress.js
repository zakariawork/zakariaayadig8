//This div will display Google map
const mapArea = document.getElementById('map');

//This button will set everything into motion when clicked
const actionBtn = document.getElementById('showMe');

//This will display all the available addresses returned by Google's Geocode Api
const locationsAvailable = document.getElementById('locationList');

//Let's bring in our API_KEY
const __KEY = 'YOUR_API_KEY';

//Let's declare our Gmap and Gmarker variables that will hold the Map and Marker Objects later on
let Gmap;
let Gmarker;

//Now we listen for a click event on our button
actionBtn.addEventListener('click', e => {
  // hide the button 
  actionBtn.style.display = "none";
  // call Materialize toast to update user 
  M.toast({ html: 'fetching your current location', classes: 'rounded' });
  // get the user's position
  getLocation();
});
getLocation = () => {
    // check if user's browser supports Navigator.geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocation, showError, options);
    } else {
      M.toast({ html: "Sorry, your browser does not support this feature... Please Update your Browser to enjoy it", classes: "rounded" });
    }
  }

// Displays the different error messages
showError = (error) => {
    mapArea.style.display = "block"
    switch (error.code) {
      case error.PERMISSION_DENIED:
        mapArea.innerHTML = "You denied the request for your location."
        break;
      case error.POSITION_UNAVAILABLE:
        mapArea.innerHTML = "Your Location information is unavailable."
        break;
      case error.TIMEOUT:
        mapArea.innerHTML = "Your request timed out. Please try again"
        break;
      case error.UNKNOWN_ERROR:
        mapArea.innerHTML = "An unknown error occurred please try again after some time."
        break;
    }
  }
  //Makes sure location accuracy is high
const options = {
   enableHighAccuracy: true
}

displayLocation = (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const latlng = { lat, lng }
    showMap(latlng, lat, lng); //passed lat and lng as the new arguments to the function
    createMarker(latlng);
    mapArea.style.display = "block";
    getGeolocation(lat, lng);
  }

const latlng = {lat, lng}
showMap(latlng);
createMarker(latlng);
mapArea.style.display = "block";

showMap = (latlng, lat, lng) => {
    let mapOptions = {
      center: latlng,
      zoom: 17
    };
    Gmap = new google.maps.Map(mapArea, mapOptions);
    Gmap.addListener('drag', function () {
      Gmarker.setPosition(this.getCenter()); // set marker position to map center
    });
    Gmap.addListener('dragend', function () {
      Gmarker.setPosition(this.getCenter()); // set marker position to map center
    });
    Gmap.addListener('idle', function () {
      Gmarker.setPosition(this.getCenter()); // set marker position to map center
      if (Gmarker.getPosition().lat() !== lat || Gmarker.getPosition().lng() !== lng) {
        setTimeout(() => {
          updatePosition(this.getCenter().lat(), this.getCenter().lng()); // update position display
        }, 2000);
      }
    });
  }
createMarker = (latlng) => {
    let markerOptions = {
      position: latlng,
      map: Gmap,
      animation: google.maps.Animation.BOUNCE,
      clickable: true
    };
    Gmarker = new google.maps.Marker(markerOptions);
  }

getGeolocation = (lat, lng) => {
    const latlng = lat + "," + lng;
    fetch( `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${__KEY}` )
      .then(res => res.json())
      .then(data => populateCard(data.results));
  }

populateCard = (geoResults) => {
    // check if a the container has a child node to force re-render of dom
    removeAddressCards();
    
    geoResults.map(geoResult => {
      // first create the input div container
      const addressCard = document.createElement('div');
      // then create the input and label elements
      const input = document.createElement('input');
      const label = document.createElement('label');
      // then add materialize classes to the div and input
      addressCard.classList.add("card");
      input.classList.add("with-gap");
      // add attributes to them
      label.setAttribute("for", geoResult.place_id);
      label.innerHTML = geoResult.formatted_address;
      input.setAttribute("name", "address");
      input.setAttribute("type", "radio");
      input.setAttribute("value", geoResult.formatted_address);
      input.setAttribute("id", geoResult.place_id);
      addressCard.appendChild(input);
      addressCard.appendChild(label);
      return ( locationsAvailable.appendChild(addressCard) ) ;
    })
}

updatePosition = (lat, lng) => {
    getGeolocation(lat, lng);
  }

function removeAddressCards(){
    if (locationsAvailable.hasChildNodes()) {
      while (locationsAvailable.firstChild) {
        locationsAvailable.removeChild(locationsAvailable.firstChild);
      }
    }
  }

  const inputAddress = document.getElementById('address'),
  inputLocality = document.getElementById('locality'),
  inputPostalCode = document.getElementById('postal_code'),
  inputLandmark = document.getElementById('landmark'),
  inputCity = document.getElementById('city'),
  inputState = document.getElementById('state');

inputClicked = result => {
    result.address_components.map(component => {
      const types = component.types
      if (types.includes('postal_code')) {
        inputPostalCode.value = component.long_name
      }
      if (types.includes('locality')) {
        inputLocality.value = component.long_name
      }
      if (types.includes('administrative_area_level_2')) {
        inputCity.value = component.long_name
      }
      if (types.includes('administrative_area_level_1')) {
        inputState.value = component.long_name
      }
      if (types.includes('point_of_interest')) {
        inputLandmark.value = component.long_name
      }
    });
    inputAddress.value = result.formatted_address;
    // to avoid labels overlapping pre-filled input contents
    M.updateTextFields();
    // removes the address cards from the UI
    removeAddressCards();
  }