document.addEventListener('DOMContentLoaded', function () {
    const now = new Date();
    const currentHour = now.getHours();
    const libraryButtons = Array.from(document.querySelectorAll('button'));

    function isOpen(timesString) {
        // Example format: "9AM - 11PM"
        const [openTime, closeTime] = timesString.split('-');
        const openHour = parseTimeTo24(openTime);
        const closeHour = parseTimeTo24(closeTime, openHour); // Pass openHour for next-day check

        // Check if the current time is within the opening hours
        if (closeHour < openHour && currentHour < closeHour) {
            // Treat it as still open if the close time is early AM and now is after midnight
            return currentHour >= openHour || currentHour < closeHour;
        }

        return currentHour >= openHour && currentHour < closeHour;
    }

    function parseTimeTo24(timeStr, openHour = null) {
        const period = timeStr.slice(-2); // AM or PM
        let [hour, minute] = timeStr.slice(0, -2).split(':');
        hour = parseInt(hour);

        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        // If close time is AM and earlier than open time, assume it's next day
        if (period === 'AM' && openHour !== null && hour < openHour) {
            hour += 24; // Add 24 hours to count as next day
        }

        return hour;
    }

    // Sort buttons based on whether the library is currently open
    libraryButtons.sort((a, b) => {
        const aTimes = a.querySelector('p').innerText;
        const bTimes = b.querySelector('p').innerText;

        return isOpen(bTimes) - isOpen(aTimes); // Open libraries go on top
    });

    // Modify button background and append sorted buttons back to the container
    const container = document.querySelector('.flex');
    libraryButtons.forEach(button => {
        const timesString = button.querySelector('p').innerText;
        if (!isOpen(timesString)) {
            // Change background color to grey for closed libraries
            button.style.backgroundColor = 'grey';
        }

        container.appendChild(button); // Re-append to container
    });
});
