//Event listners

document.addEventListener("DOMContentLoaded", displayStates);
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#password").addEventListener("click", sudgestUsername);
document.querySelector("#signupForm").addEventListener("submit", function(event) {
    validateForm(event);
});

//Functions

async function displayCity(){
    let zipCode = document.querySelector("#zip").value;
    // console.log(zipCode);
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();
    //console.log(data);
    if(data === false){
        document.querySelector("#zipNotFound").innerHTML = "Zipcode Not Found!";
    } else { 
        document.querySelector("#city").innerHTML = data.city;
        document.querySelector("#latitude").innerHTML = data.latitude;
        document.querySelector("#longitude").innerHTML = data.longitude;
    }
}

async function displayStates() {
  let url = "https://csumb.space/api/allStatesAPI.php";
  let response = await fetch(url);
  let data = await response.json();            
  let stateList = document.querySelector("#state");

  stateList.innerHTML = `<option value="">Select One</option>`;
  for (let i = 0; i < data.length; i++) {
    stateList.innerHTML += `<option value="${data[i].usps}">${data[i].state}</option>`;
  }
}


async function displayCounties() {
    let state = document.querySelector("#state").value;
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();
    let countyList = document.querySelector("#county");

    countyList.innerHTML = "<option> Select County</option>";
    for (let i = 0; i < data.length; i++) {
        countyList.innerHTML += `<option> ${data[i].county} </option>`;
    }
}

async function checkUsername() {
    let username = document.querySelector("#username").value;
    // let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let url = `https://csumb.space/api/usernamesAPI.php?username=eeny`;
    let response = await fetch(url);
    let data = await response.json();
    let usernameError = document.querySelector("#usernameError");
    if (data.available) {
        usernameError.innerHTML = " Username available!";
        usernameError.style.color = "green";
    }
    else {
        usernameError.innerHTML = " Username taken";
        usernameError.style.color = "red";
    }
}


function validateForm(e){
    let isValid = true;
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let passwordMatch = document.querySelector("#passwordMatch").value;

    if (username.length == 0) {
        document.querySelector("#usernameError").innerHTML = "Username Required!";
        usernameError.style.color = "red";
        isValid = false;
    }

    if (username.length < 3) {
        document.querySelector("#usernameLengthCheck").innerHTML = "Username Too Short!";
        usernameLengthCheck.style.color = "red";
        isValid = false;
    }
    
    if (password.length < 6) {
        document.querySelector("#passwordError").innerHTML = "Password must be at least six letters!";
        passwordError.style.color = "red";
        isValid = false;
    }

    if (password !== passwordMatch) {
        document.querySelector("#passwordMatchError").innerHTML = "Passwords do not match, Retype Password!";
        passwordMatchError.style.color = "red";
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
    }
}

function sudgestUsername() {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let sudgPass = "";

  for (let i = 0; i < 8; i++) {
    let add = Math.floor(Math.random() * chars.length);
    sudgPass += chars[add];
  }

  document.querySelector("#passwordSudgest").innerHTML = `Sudgested Password: ${sudgPass}`;
}

