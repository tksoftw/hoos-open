function loadJSONSync(filePath) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", filePath, false); // 'false' makes the request synchronous
  xhr.send(null);

  if (xhr.status === 200) {
      return JSON.parse(xhr.responseText);
  } else {
      console.error("Failed to load file:", xhr.status);
      return null;
  }
}

function loadFacilitiesTimes() {
    try {
      const data = loadJSONSync('database/other.json'); // Fetch the JSON data
      
      const today = new Date();
      const formattedToday = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;
  
      console.log("Today's date:", formattedToday);
  
      const facilitiesTimes = data[formattedToday]; // Get the open/close times for today's date
  
      if (facilitiesTimes) {
        // Update the HTML elements with the times
        document.getElementById('admission-times').innerHTML = facilitiesTimes.admission[0] == "Closed" || facilitiesTimes.admission[0] == "24 Hours" ? facilitiesTimes.admission[0] : (facilitiesTimes.admission[0] + "-<br>" + facilitiesTimes.admission[1]);
        document.getElementById('health-times').innerHTML = facilitiesTimes.health[0] == "Closed" || facilitiesTimes.health[0] == "24 Hours" ? facilitiesTimes.health[0] : (facilitiesTimes.health[0] +  "-<br>" + facilitiesTimes.health[1]);
        document.getElementById('monroe-times').innerHTML = facilitiesTimes.monroe[0] == "Closed" || facilitiesTimes.monroe[0] == "24 Hours" ? facilitiesTimes.monroe[0] : (facilitiesTimes.monroe[0] + "-<br>" + facilitiesTimes.monroe[1]);
        document.getElementById('afc-times').innerHTML = facilitiesTimes.afc[0] == "Closed" || facilitiesTimes.afc[0] == "24 Hours" ? facilitiesTimes.afc[0] : (facilitiesTimes.afc[0] + "-<br>" + facilitiesTimes.afc[1]);
      } else {
        console.error('No data available for today');
      }
    } catch (error) {
      console.error('Error loading facilities times:', error);
    }
  }

loadFacilitiesTimes()
  