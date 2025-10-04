function loadPage(url, containerId, callback) {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        document.getElementById(containerId).innerHTML = data;
        if (callback) callback();
      })
      .catch(error => console.error(`${url}:`, error));
}

window.onload = function() {
    loadPage('pages/left_side.html', 'container1', () => {
        loadPage('pages/mid_side.html', 'container2');
        loadPage('pages/right_side.html', 'container3', () => {
            if (typeof initRightSide === "function") initRightSide();
        });
    });
};
