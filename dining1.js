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

// Function to update the URL
function updateImageUrl(url) {
    let strippedUrl = url.split('?')[0];
    const baseUrl = "https://virginia.campusdish.com";
    let newUrl = baseUrl + strippedUrl;
    newUrl = newUrl.replace('.ashx', '.jpg');
    return newUrl;
}

// URLs for each location ID
const urls = {
    '695': "https://maps.app.goo.gl/cX5yiY2pQCR2hfGY6",
    '704': "https://maps.app.goo.gl/Ndq5MhRuRW1QUC5k6",
    '701': "https://maps.app.goo.gl/mUqfL1SQTRZc7kr28",
    '1643': "https://maps.app.goo.gl/48cEfwoz8r3G9NkX7",
    '16752': "https://maps.app.goo.gl/FqiXN1jjoaeUGSCh9",
    '3638': '',
    '713': '',
    '714': '',
    '709': '',
    '716': '',
    '5485': '',
    '13903': '',
    '15120': '',
    '712': '',
    '1392': '',
    '7647': '',
    '1938': '',
    '4353': '',
    '6044': '',
    '5433': '',
    '708': '',
    '6011': '',
    '84476': '',
    '84472': '',
    '84473': '',
    '84474': '',
    '84475': '',
    '10760': '',
    '18240': '',
    '2692': '',
    '18070': '',
    '4041': '',
    '13148': '',
    '8750': '',
    '15334': '',
    '8751': ''
};

// Function to dynamically add IDs to buttons based on the child p elements
function addIdsToButtons() {
    const timeElements = document.querySelectorAll('p[id$="-times"]');
    timeElements.forEach(timeElement => {
        const baseId = timeElement.id.replace('-times', ''); // Extract base ID (e.g., '6011')
        const parentButton = timeElement.closest('button'); // Find the closest button parent
        if (parentButton) {
            parentButton.id = `id-${baseId}`; // Assign the prefixed ID to the button
            console.log(`Assigned ID "id-${baseId}" to parent button.`);
        } else {
            console.error(`No parent button found for ${timeElement.id}`);
        }
    });
}

// Function to open a location's URL in a new tab
function openLocationWindow(locationId) {
    const url = urls[locationId];
    if (url) {
        window.open(url, '_blank');
    } else {
        console.error(`No URL found for location ID: ${locationId}`);
    }
}

// Function to update the page with the data
function updateLocations() {
    const jsonData = loadJSONSync('database/dining.json');
    console.log(jsonData);

    // Create a new array of objects with only the filtered keys
    const filteredData = jsonData.Locations
        .filter(location => location['ChildLocationsNames'] == null) // Filter out locations with non-null 'ChildLocationsNames'
        .map(location => {
            return Object.keys(location)
                .filter(key => ["Id", "DisplayName", "LocationImageUrl", "HoursOfOperations"].includes(key)) // Only include keys we need
                .reduce((obj, key) => {
                    obj[key] = location[key];
                    return obj;
                }, {});
        });

    // Loop through filteredData and update "LocationImageUrl"
    const container = document.getElementById('button-container');
    filteredData.forEach(location => {
        if (location.LocationImageUrl) {
            location.LocationImageUrl = updateImageUrl(location.LocationImageUrl);
        }

        // Modify display names for specific IDs
        if (location.Id == 704) {
            location.DisplayName = 'Newcomb Dining Room';
        } else if (location.Id == 701) {
            location.DisplayName = 'Runk Dining Room';
        } else if (location.Id == 6011) {
            location.DisplayName = '1819 Supply @ Newcomb';
        } 

        // Handle hours of operation
        if (location.HoursOfOperations == null) {
            location.HoursOfOperations = "Closed";
        } else {
            location.HoursOfOperations = location.HoursOfOperations.replace('All Day', '')
                .replaceAll(':00', ''); // Remove :00s
            const hourStartAndEnd = location.HoursOfOperations.split('-');
            if (hourStartAndEnd[0].trim() == hourStartAndEnd[1].trim()) {
                location.HoursOfOperations = "24 Hours";
            }
        }

        // Create and append buttons based on the filtered data
        const templateButton = document.getElementById('template-button');
        const newButton = templateButton.cloneNode(true);

        // Set the new button's content
        newButton.querySelector('.img-wrap').style.backgroundImage = `url(${location.LocationImageUrl})`;
        newButton.querySelector('h2').innerHTML = location.DisplayName;
        newButton.querySelector('p').innerHTML = location.HoursOfOperations.replace(' -', '-<br>');
        newButton.querySelector('p').id = `${location.Id}-times`;

        // Add click event to open the correct URL
        newButton.addEventListener('click', function () {
            openLocationWindow(location.Id);
        });

        // Append the new button to the container
        container.appendChild(newButton);
    });

    // Remove the original template button
    const templateButton = document.getElementById('template-button');
    templateButton.remove();

    // After appending all the buttons, update the IDs
    addIdsToButtons();

    // Add the back button after the IDs have been updated
    const backButton = document.getElementById('backbutton');
    container.appendChild(backButton);
}

// Call the function to update locations on page load
document.addEventListener('DOMContentLoaded', function() {
    updateLocations();
});
