const API_KEY = "Dk-n1D3m0wr-1aFRRs5Lp4xq5Gc";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// wire up our button by adding Event listeners to our status key (check key) and our submit button (to postForm)
document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));


// 6. we will create a new function for processOptions to fix the issue of list options
// we need to  1)Iterate through the options.  2)Push each value into a temporary array.  3)Convert the array back to a string.
function processOptions(form) {
    
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    form.delete("options");     //deletes all occurences of options in our form data
    form.append("options", optArray.join());

    return form;
}


// 3. Make POST request
async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));   //our ElementByID is #checksform in the html line 29

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });

    // 4. Convert our POST response to json and display our response data via a new function (just like our GET method)
    const data = await response.json();
    
    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}
// 5. Display the response via our function above displayError() and display Error if there is any
function displayErrors(data) {
    
    let heading = `JSHint Results for ${data.file}`;   

    if (data.total_errors === 0) {
        results = `<div class= "no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`
        for (let error of data.error_list) {              // need to iterate the error list
            results += `<div> At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}


// 1. Make a GET request to the API URL with the API key
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

// 2. Pass the data to a display function (to display it)
function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}

function displayException(data) {
    
}


