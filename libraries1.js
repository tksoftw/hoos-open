async function loadLibraryTimes() {
  try {
    const response = await fetch('database/libraries_formatted.json'); // Fetch the JSON data
    const data = await response.json(); // Parse the JSON
    
    const today = new Date();
    const formattedToday = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;

    console.log("Today's date:", formattedToday);

    const libraryTimes = data[formattedToday]; // Get the open/close times for today's date


    if (libraryTimes) {
      // Update the HTML elements with the times
      document.getElementById('clem-times').innerHTML = libraryTimes.clem[0] == "Closed" | libraryTimes.clem[0] == "24H" ? libraryTimes.clem[0] : (libraryTimes.clem[0] + "-<br>" + libraryTimes.clem[1]);
      document.getElementById('shannon-times').innerHTML = libraryTimes.shannon[0] == "Closed" | libraryTimes.shannon[0] == "24H" ? libraryTimes.shannon[0] : (libraryTimes.shannon[0] + "-<br>" + libraryTimes.shannon[1]);
      document.getElementById('brown-times').innerHTML = libraryTimes.brown[0] == "Closed" | libraryTimes.brown[0] == "24H" ? libraryTimes.brown[0] : (libraryTimes.brown[0] + "-<br>" + libraryTimes.brown[1]);
      document.getElementById('music-times').innerHTML = libraryTimes.music[0] == "Closed" | libraryTimes.music[0] == "24H" ? libraryTimes.music[0] : (libraryTimes.music[0] + "-<br>" + libraryTimes.music[1]);
      document.getElementById('finearts-times').innerHTML = libraryTimes.finearts[0] == "Closed" | libraryTimes.finearts[0] == "24H" ? libraryTimes.finearts[0] : (libraryTimes.finearts[0] + "-<br>" + libraryTimes.finearts[1]);
    } else {
      console.error('No data available for today');
    }
  } catch (error) {
    console.error('Error loading library times:', error);
  }
  //console.log('hi')
}

// Call the function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', loadLibraryTimes);

document.getElementById('message').textContent = "Libraries are open from 9AM to 5PM";

