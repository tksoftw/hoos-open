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

// Keys you want to filter for
const keysToFilter = ["Id", "DisplayName", "LocationImageUrl", "HoursOfOperations"];

// Function to get the nth index of a pattern pat occuring in a string str
function nthIndex(str, pat, n){
    var L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

// Function to extract JSON data from the HTML response
function extractBetween(htmlText, startStr, endStr, occurrence) {
    let startPos = nthIndex(htmlText, startStr, occurrence);
    if (startPos === -1) return '';
    startPos += startStr.length;
    let endPos = htmlText.indexOf(endStr, startPos);
    if (endPos === -1) return '';
    return htmlText.substring(startPos, endPos);
}


// Function to update the page with the data
function updateLocations() {
    const jsonData = loadJSONSync('database/dining.json');
    console.log(jsonData)

    // Create a new array of objects with only the filtered keys
    const filteredData = jsonData.Locations
        .filter(location => location['ChildLocationsNames'] == null) // Filter out locations with non-null 'ChildLocationsNames'
        .map(location => {
            return Object.keys(location)
                .filter(key => keysToFilter.includes(key)) // Only include keys in 'keysToFilter'
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

        // Add or update buttons based on the filtered data
        const templateButton = document.getElementById('template-button');
        const backButton = document.getElementById('backbutton');

        let existingButton = document.querySelector(`[id='${location.Id}-times']`);
        if (existingButton) {
            existingButton.innerHTML = location.HoursOfOperations.replace('-', '-<br>');
        } else {
            const newButton = templateButton.cloneNode(true);
            newButton.querySelector('.img-wrap').style.backgroundImage = `url(${location.LocationImageUrl})`;
            newButton.querySelector('h2').innerHTML = location.DisplayName;
            newButton.querySelector('p').innerHTML = location.HoursOfOperations.replace(' -', '-<br>');
            newButton.querySelector('p').id = `${location.Id}-times`;

            container.appendChild(newButton);
        }
    });

    // Remove the original template button and add the back button
    const templateButton = document.getElementById('template-button');
    templateButton.remove();
    const backButton = document.getElementById('backbutton');
    container.appendChild(backButton);
}

// Call the function to update locations on page load

updateLocations();