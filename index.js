

function redirect(searchText) {
    if (!searchText) return;
    localStorage.setItem("searchText",searchText)
    window.location.href = `${window.location.origin}./anime.html`;
}

function renderSearch(event) {
    event.preventDefault();
    const searchValue = document.getElementById('inputHome').value.trim()
    if (searchValue) {
        return redirect(searchValue)
    } 
}
