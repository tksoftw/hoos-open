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

const urls = {
    'clem': "https://maps.app.goo.gl/cX5yiY2pQCR2hfGY6",
    'shannon': "https://maps.app.goo.gl/Ndq5MhRuRW1QUC5k6",
    'brown': "https://maps.app.goo.gl/mUqfL1SQTRZc7kr28",
    'music': "https://maps.app.goo.gl/48cEfwoz8r3G9NkX7",
    'finearts': "https://maps.app.goo.gl/FqiXN1jjoaeUGSCh9"
};

function loadLibraryTimes() {
  try {
    const data = loadJSONSync('database/libraries_formatted.json'); // Fetch the JSON data
    
    const today = new Date();
    const formattedToday = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;

    console.log("Today's date:", formattedToday);

    const libraryTimes = data[formattedToday]; // Get the open/close times for today's date

    if (libraryTimes) {
      Object.keys(urls).forEach(library => {
        const times = libraryTimes[library];
        const elementId = `${library}-times`;
        if (times) {
          document.getElementById(elementId).innerHTML =
            times[0] === "Closed" || times[0] === "24 Hours" 
              ? times[0] 
              : `${times[0]}-<br>${times[1]}`;
        }
      });
    } else {
      console.error('No data available for today');
    }
  } catch (error) {
    console.error('Error loading library times:', error);
  }
}

function openWindow(building_identifier) {
    const url = urls[building_identifier];
    if (url) {
        window.open(url, '_blank');
        window.focus();
    } else {
        console.error("No URL found for building identifier:", building_identifier);
    }
}

// Call the function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadLibraryTimes();

    // Dynamically attach event listeners based on the keys of the `urls` object
    Object.keys(urls).forEach(key => {
        const button = document.querySelector(`button#${key}-times`);
        if (button) {
            button.addEventListener('click', () => openWindow(key));
        } else {
            console.error(`Button for ${key} not found`);
        }
    });
});
