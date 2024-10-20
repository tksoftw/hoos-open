fetch('libraries-formatted.json')
    .then(response => response.json)
    .then(data => showInfo(data))

    function showInfo(data) {
        alert(data)
    }