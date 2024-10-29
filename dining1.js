// Function to get the current date formatted as "mm-dd-yyyy" in Eastern Time and store the day integer
function getCurrentDateAndDay() {
    const date = new Date();
    
    // Convert to Eastern Time
    const easternDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    
    // Format the date as "mm-dd-yyyy"
    let formattedDate = easternDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    // Replace slashes with -
    formattedDate = formattedDate.replaceAll('/', '-');
    
    // Save the day as an integer
    const day = easternDate.getDate();
    
    return { formattedDate, day };
}

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
    '695': 'https://maps.app.goo.gl/TLYpWmCLE3JboCph9',
    '704': 'https://maps.app.goo.gl/s8Uxk7jQ9WvNjaCy8',
    '701': 'https://maps.app.goo.gl/2P1x4p8W41FLfsY19',
    '1643': 'https://maps.app.goo.gl/2mVYvtRjoyNnaX6K9',
    '16752': 'https://maps.app.goo.gl/2VgGkor6SxpvnUV37',
    '3638': 'https://maps.app.goo.gl/PNaxyhDWuNgCCc5r5',
    '713': 'https://maps.app.goo.gl/u5ddW5zMY5dmqp7F9',
    '714': 'https://maps.app.goo.gl/pAvqmgS5VLf5Jq5j8',
    '709': 'https://maps.app.goo.gl/v6NUEG5SwJWvgiAo6',
    '5485': 'https://maps.app.goo.gl/7nEG5wGxk2UWXDGv9',
    '13903': 'https://maps.app.goo.gl/rhWFmGaseLGA5GSRA',
    '15120': 'https://maps.app.goo.gl/jE9rCWurxgNoBTmo9',
    '712': 'https://maps.app.goo.gl/vYhNtYudxEqU9zQB9',
    '7647': 'https://maps.app.goo.gl/B4cNvDEM3r2v1AgJ8',
    '1938': 'https://maps.app.goo.gl/Hi9kH5Y9vyydXuhu8',
    '4353': 'https://maps.app.goo.gl/v1KL93MHPvPXpNdK9',
    '6044': 'https://maps.app.goo.gl/aYt5S8URoN4JQ9ew6',
    '5433': 'https://maps.app.goo.gl/sp1gKFkeiZFQaPYT6',
    '708': 'https://maps.app.goo.gl/1SggTKf1ThSc5DdD7',
    '6011': 'https://maps.app.goo.gl/s8Uxk7jQ9WvNjaCy8',
    '84476': 'https://maps.app.goo.gl/wwm3THQ9u96UdSh38',
    '84472': 'https://maps.app.goo.gl/wwm3THQ9u96UdSh38',
    '84473': 'https://maps.app.goo.gl/wwm3THQ9u96UdSh38',
    '84474': 'https://maps.app.goo.gl/wwm3THQ9u96UdSh38',
    '84475': 'https://maps.app.goo.gl/wwm3THQ9u96UdSh38',
    '10760': 'https://maps.app.goo.gl/ChVQ4G72GzndWwWp7',
    '18240': 'https://maps.app.goo.gl/dJAnmrTSysUMnQHSA',
    '2692': 'https://maps.app.goo.gl/dJAnmrTSysUMnQHSA',
    '18070': 'https://maps.app.goo.gl/dJAnmrTSysUMnQHSA',
    '4041': 'https://maps.app.goo.gl/dJAnmrTSysUMnQHSA',
    '13148': 'https://maps.app.goo.gl/3M8LHHmDSKn1Ruzd9',
    '8750': 'https://maps.app.goo.gl/s8Uxk7jQ9WvNjaCy8',
    '15334': 'https://maps.app.goo.gl/s8Uxk7jQ9WvNjaCy8',
    '8751': 'https://maps.app.goo.gl/Bd7eNQozbrMu8Qb77'
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
    const { formattedDate, day } = getCurrentDateAndDay(); 
    const jsonData = loadJSONSync('database/dining.json');
    if (!jsonData[formattedDate]) return;

    // console.log(jsonData);

    // Create a new array of objects with only the filtered keys
    // const filteredData = jsonData.Locations
    //     .filter(location => location['ChildLocationsNames'] == null) // Filter out locations with non-null 'ChildLocationsNames'
    //     .map(location => {
    //         return Object.keys(location)
    //             .filter(key => ["Id", "DisplayName", "LocationImageUrl", "HoursOfOperations"].includes(key)) // Only include keys we need
    //             .reduce((obj, key) => {
    //                 obj[key] = location[key];
    //                 return obj;
    //             }, {});
    //     });

    // Loop through filteredData and update "LocationImageUrl"
    const locations = jsonData[formattedDate];
    const container = document.getElementById('button-container');
    Object.keys(locations).forEach(locationId => {
        const location = locations[locationId]
        
        if (location.LocationImageUrl) {
            location.LocationImageUrl = updateImageUrl(location.LocationImageUrl);
        }

        

        // Handle hours of operation
        let hoursHTML = (location.hours[1] == null) ? location.hours[0] : `${location.hours[0]}-${location.hours[1]}<br>`;

        // Create and append buttons based on the filtered data
        const templateButton = document.getElementById('template-button');
        const newButton = templateButton.cloneNode(true);

        // Set the new button's content
        newButton.querySelector('.img-wrap').style.backgroundImage = `url(${location.LocationImageUrl})`;
        newButton.querySelector('h2').innerHTML = location.DisplayName;
        newButton.querySelector('p').innerHTML = hoursHTML;
        newButton.querySelector('p').id = `${locationId}-times`;

        // Add click event to open the correct URL
        newButton.addEventListener('click', function () {
            openLocationWindow(locationId);
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

