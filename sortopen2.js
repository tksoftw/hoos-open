document.addEventListener("DOMContentLoaded", function () {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes(); 
    const backButton = document.querySelector('#backbutton');
    const libraryButtons = Array.from(document.querySelectorAll('button')).filter(button => button.id !== 'backbutton');

    function isOpen(timesString) {
        if (timesString === "Closed") {
            return false;
        }
        if (timesString === "24 Hours") {
            return true;
        }
        const [openTime, closeTime] = timesString.split('-');
        const { hour: openHour, minute: openMinute } = parseTimeTo24(openTime);
        const { hour: closeHour, minute: closeMinute } = parseTimeTo24(closeTime, openHour); // Pass openHour for next-day check

        // Check if the current time is within the opening hours
        if (openHour === closeHour && openMinute === closeMinute) {
            return true; // Handle 24-hour open scenario
        }

        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        const openTimeInMinutes = openHour * 60 + openMinute;
        const closeTimeInMinutes = closeHour * 60 + closeMinute;

        if (closeTimeInMinutes < openTimeInMinutes) {
            // Library closes after midnight, adjust for that
            return currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes < closeTimeInMinutes;
        }

        return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes;
    }

    function parseTimeTo24(timeStr, openHour = null) {
        const period = timeStr.slice(-2).toLowerCase(); // am or pm
        let [hourMinute, minute] = timeStr.slice(0, -2).split(':');
        let hour = parseInt(hourMinute);

        if (!minute) {
            minute = 0; // Default minute to 0 if not provided
        } else {
            minute = parseInt(minute);
        }

        if (period === 'pm' && hour !== 12) hour += 12;
        if (period === 'am' && hour === 12) hour = 0;

        // If close time is AM and earlier than open time, assume it's next day
        if (period === 'am' && openHour !== null && hour < openHour) {
            hour += 24; // Add 24 hours to count as next day
        }

        return { hour, minute };
    }

    function getOpeningHour(timesString) {
        if (timesString === "Closed" || timesString === "24 Hours") {
            return null;
        }
        const [openTime] = timesString.split('-');
        const { hour, minute } = parseTimeTo24(openTime);
        return hour * 60 + minute; // Return time in minutes
    }

    // Sort buttons based on whether the library is open, closed but will open later, and sort by opening time for closed ones
    libraryButtons.sort((a, b) => {
        const aTimes = a.querySelector('p').innerText;
        const bTimes = b.querySelector('p').innerText;
        const aOpen = isOpen(aTimes);
        const bOpen = isOpen(bTimes);

        const a24Hours = aTimes === "24 Hours";
        const b24Hours = bTimes === "24 Hours";

        const aOpeningHour = getOpeningHour(aTimes);
        const bOpeningHour = getOpeningHour(bTimes);

        // Prioritize open libraries first
        if (aOpen && !bOpen) return -1;
        if (!aOpen && bOpen) return 1;

        // Sort by 24 hours condition within the open libraries
        if (aOpen && bOpen) {
            if (a24Hours && !b24Hours) return 1; // Move 24-hour libraries below other open libraries
            if (!a24Hours && b24Hours) return -1;
        }

        // Sort closed libraries by when they will open today
        if (!aOpen && !bOpen) {
            if (aOpeningHour !== null && bOpeningHour === null) return -1; // If a opens later today and b doesn't, a goes first
            if (aOpeningHour === null && bOpeningHour !== null) return 1;
            if (aOpeningHour !== null && bOpeningHour !== null) {
                return aOpeningHour - bOpeningHour; // Sort by opening hour
            }
        }

        return 0; // Keep the same order if both are fully closed or both are open/24 hours
    });

    // Modify button background and append sorted buttons back to the container
    const container = document.querySelector('.flex');
    libraryButtons.forEach(button => {
        const timesString = button.querySelector('p').innerText;
        const openIndicator = button.querySelectorAll('.open-indicator');
        const closedIndicator = button.querySelectorAll('.closed-indicator');

        if (!isOpen(timesString)) {
            // Change background color to grey for closed libraries
            button.style.backgroundColor = 'grey';
            openIndicator.forEach(elem => elem.classList.add('hidden'));
            closedIndicator.forEach(elem => elem.classList.remove('hidden'));
        }

        container.appendChild(button); // Re-append to container
    });

    // After appending all library buttons, append the back button at the bottom
    if (backButton) {
        container.appendChild(backButton);
    }
});
