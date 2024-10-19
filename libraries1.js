let jsonData;
fetch('database/libraries.json')
    .then(response=> response.json())
    .then(data => {
        jsonData = data;
        console.log(jsonData);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });

async function loadLibraryTimes() {
  try {
    const response = await fetch('data.json'); // Fetch the JSON data
    const data = await response.json(); // Parse the JSON

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const formattedToday = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;
    console
    const libraryTimes = data[today]; // Get the open/close times for today's date

    if (libraryTimes) {
      // Update the HTML elements with the times
      document.getElementById('clem-times').textContent = libraryTimes.clem-times.open;
      document.getElementById('shannon-times').textContent = libraryTimes.shannon-times.open;
      document.getElementById('brown-times').textContent = libraryTimes.brown-times.open;
      document.getElementById('music-times').textContent = libraryTimes.music-times.open;
      document.getElementById('finearts-times').textContent = libraryTimes.finearts-time.open;
    } else {
      console.error('No data available for today');
    }
  } catch (error) {
    console.error('Error loading library times:', error);
  }
}

// Call the function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', loadLibraryTimes);
