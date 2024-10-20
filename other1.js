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

// Example URLs for the facilities (add real URLs if needed)
const urls = {
    'admission': "https://maps.app.goo.gl/CWuhYenpFw7bMa3y6",
    'health': "https://maps.app.goo.gl/uPUX86tqY7KEY3Wh7",
    'monroe': "https://maps.app.goo.gl/TKT8nWpeegk8MidAA",
    'afc': "https://maps.app.goo.gl/jZzfYJZ3zM7EyHfL7"
};

function loadFacilitiesTimes() {
    try {
        const data = loadJSONSync('database/other.json'); // Fetch the JSON data
        
        const today = new Date();
        const formattedToday = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;

        console.log("Today's date:", formattedToday);

        const facilitiesTimes = data[formattedToday]; // Get the open/close times for today's date

        if (facilitiesTimes) {
            // Iterate over each facility in the URLs object to dynamically set times
            Object.keys(urls).forEach(facility => {
                const times = facilitiesTimes[facility];
                const elementId = `${facility}-times`;
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
        console.error('Error loading facilities times:', error);
    }
}

function openFacilityWindow(facility_identifier) {
    const url = urls[facility_identifier];
    if (url) {
        window.open(url, '_blank');
        window.focus();
    } else {
        console.error("No URL found for facility identifier:", facility_identifier);
    }
}

function addFacilityIdsToButtons() {
    // Find all <p> elements whose id ends with '-times'
    const timeElements = document.querySelectorAll('p[id$="-times"]');
    
    timeElements.forEach((timeElement) => {
        // Extract the base id (e.g., 'admission' from 'admission-times')
        const baseId = timeElement.id.replace('-times', '');
        
        // Find the closest button to this <p> element
        const parentButton = timeElement.closest('button');
        
        if (parentButton) {
            // Assign the base id to the button
            parentButton.id = baseId;
            console.log(`Assigned ID "${baseId}" to parent button.`);
        } else {
            console.error(`No parent button found for ${timeElement.id}`);
        }
    });
}

// Call the function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadFacilitiesTimes();
    addFacilityIdsToButtons();

    // Dynamically attach event listeners based on the keys of the `urls` object
    Object.keys(urls).forEach(key => {
        const button = document.querySelector(`button#${key}`);
        if (button) {
            button.addEventListener('click', () => openFacilityWindow(key));
        } else {
            console.error(`Button for ${key} not found`);
        }
    });
});
