// Get the elements from the document
const length = document.getElementById("length");
const symbols = document.getElementById("symbols");
const numbers = document.getElementById("numbers");
const letters = document.getElementById("letters");
const generate = document.getElementById("generate");
const password = document.getElementById("password");
const number = document.getElementById("number");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const resultContainer = document.getElementById("result-container");
const copyLink = document.getElementById("copy-link");

// Define a function to read the URL parameters and set the input values and checkboxes
// Modify the readURLParams() function
// Modify the readURLParams() function

function copyLinkToClipboard() {
  // Get the base address of the website
  // Get the base address of the website
  let base = window.location.origin + window.location.pathname;
  // Create a new URLSearchParams object
  let urlParams = new URLSearchParams();
  // Set the parameters with the input values and checkboxes
  urlParams.set("length", length.value);
  urlParams.set("number", number.value);
  urlParams.set("symbols", symbols.checked);
  urlParams.set("numbers", numbers.checked);
  urlParams.set("letters", letters.checked);
  urlParams.set("uppercase", uppercase.checked);
  urlParams.set("lowercase", lowercase.checked);
  // Delete the parameters that have the default values
  if (length.value==="16") urlParams.delete("length");
  if (number.value==="1") urlParams.delete("number");
  if (symbols.checked) urlParams.delete("symbols");
  if (numbers.checked) urlParams.delete("numbers");
  if (letters.checked) urlParams.delete("letters");
  if (uppercase.checked) urlParams.delete("uppercase");
  if (lowercase.checked) urlParams.delete("lowercase");
  // Get the query string from the urlParams object
  let queryString = urlParams.toString();
  // Create the full link by appending the query string to the base address
  let link
  if (queryString==="") link = base;
  else link = base + "?" + queryString;

  // Copy the link to the clipboard using the Clipboard API
  navigator.clipboard.writeText(link).then(
    function () {
      // Show a success alert
      showAlert("cgltc!");
    },
    function () {
      // Show an error alert
      showAlert("error");
    }
  );
}

copyLink.addEventListener("click", copyLinkToClipboard);

// Define the character sets
const symbolSet = "!@#$%^&*()_+-=[]{};:'\"\\|,.<>/?";
const numberSet = "0123456789";
const letterSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Define a function to generate a random password
function generatePassword() {
  // Get the user input
  let len = parseInt(length.value);
  let useSymbols = symbols.checked;
  let useNumbers = numbers.checked;
  let useLetters = letters.checked;
  let useUppercase = uppercase.checked;
  let useLowercase = lowercase.checked;

  // Create an empty password and a possible character set
  let pwd = "";
  let possible = "";

  // Add the selected character sets to the possible set
  if (useSymbols) possible += symbolSet;
  if (useNumbers) possible += numberSet;

  // Check the selected letter cases and add them to the possible set
  if (useLetters) {
    if (useUppercase) possible += letterSet.toUpperCase();
    if (useLowercase) possible += letterSet.toLowerCase();
  }

  // Loop through the length and add a random character from the possible set
  for (let i = 0; i < len; i++) {
    let index = Math.floor(Math.random() * possible.length);
    pwd += possible[index];
  }
  // Create an array of the selected character sets
  let sets = [];
  if (useSymbols) sets.push(symbolSet);
  if (useNumbers) sets.push(numberSet);
  if (useLetters && useUppercase) sets.push(letterSet.toUpperCase());
  if (useLetters && useLowercase) sets.push(letterSet.toLowerCase());

  // Loop through the array and ensure that each set is represented in the password
  for (let set of sets) {
    // Check if the password contains any character from the set
    if (!pwd.match(new RegExp("[" + set + "]"))) {
      // If not, replace a random character in the password with a random character from the set
      let pwdIndex = Math.floor(Math.random() * pwd.length);
      let setIndex = Math.floor(Math.random() * set.length);
      pwd = pwd.slice(0, pwdIndex) + set[setIndex] + pwd.slice(pwdIndex + 1);
    }
  }

  // Return the password
  return pwd;
}

function copyToClipboard(pwd) {
  // Create a temporary textarea element
  let textarea = document.createElement("textarea");
  // Set its value to the password
  textarea.value = pwd;
  // Append it to the document body
  document.body.appendChild(textarea);
  // Select its content
  textarea.select();
  // Copy the content
  document.execCommand("copy");
  // Remove the element
  document.body.removeChild(textarea);
}

function readURLParams() {
  // Create a new URLSearchParams object from the current URL query string
  const urlParams = new URLSearchParams(window.location.search);
  // Loop through the keys of the urlParams object
  for (let key of urlParams.keys()) {
    // Get the value of the key
    let value = urlParams.get(key);
    // Check if the key matches any of the input ids
    if (key == "length" || key == "number") {
      // Set the input value to the value
      document.getElementById(key).value = value;
    } else if (
      key == "symbols" ||
      key == "numbers" ||
      key == "letters" ||
      key == "uppercase" ||
      key == "lowercase"
    ) {
      // Set the checkbox checked to the boolean value
      document.getElementById(key).checked = value == "true";
      // Trigger the change event of the checkbox
      document.getElementById(key).dispatchEvent(new Event("change"));
    } else if (key == "generate") {
      // Check if the value is true
      if (value == "true") {
        let num = parseInt(number.value);
        let len = parseInt(length.value);
        let useSymbols = symbols.checked;
        let useNumbers = numbers.checked;
        let useLetters = letters.checked;
        let onePassword;
        if (isNaN(len) || len < 1 || len > 4096) {
          showAlert("length_too_long");
          return;
        }
        // Check if any settings are selected
        if (!useSymbols && !useNumbers && !useLetters) {
          // Show a warning alert
          showAlert("no_options");
          return;
        }

        // Validate the number
        if (isNaN(num) || num < 1 || num > 10) {
          return;
        }

        // Clear the result container
        resultContainer.innerHTML = "";

        // Loop through the number of passwords and create result elements
        for (let i = 0; i < num; i++) {
          // Generate a password and display it
          let pwd = generatePassword();

          // Check if the password is empty
          if (!pwd) return;

          // Create a new result element
          let result = document.createElement("div");
          // Set its class name and text content
          result.className = "result";
          result.textContent = pwd;
          // Append it to the result container element
          resultContainer.appendChild(result);
          onePassword = pwd;
        }

        // Check if the number of passwords is one
        if (num == 1) {
          // Copy the password to the clipboard
          copyToClipboard(onePassword);
          // Show a success alert
          showAlert("cptc!");
        }
      }
    }
  }
}

window.addEventListener("load", readURLParams);

// Get the alert element from the document
// Get the alert-container element from the document
const alertContainer = document.getElementById("alert-container");

// Define a function to create and show an alert element
function showAlert(type) {
  // Create a new alert element
  let alert = document.createElement("div");
  // Set its class name and text content
  alert.className = "alert";
  // Check the type of alert and set the text content and background color accordingly
  if (type == "cptc!") {
    alert.textContent = "copied password to clipboard!";
    alert.style.backgroundColor = "#00ff00";
  } else if (type == "no_options") {
    alert.textContent = "please select at least one option.";
    alert.style.backgroundColor = "#ff0000";
  } else if (type == "length_too_long") {
    alert.textContent =
      "please make sure your number is in the range of 1-4096.";
    alert.style.backgroundColor = "#ff0000";
  } else if (type == "cgltc!") {
    alert.textContent = "copied generation link to clipboard!";
    alert.style.backgroundColor = "#00ff00";
  }
  // Append it to the alert-container element
  alertContainer.appendChild(alert);
  // Show the alert element
  alert.style.display = "block";
  // Set a timeout to fade out the alert element after 3 seconds
  setTimeout(function () {
    alert.style.opacity = 0;
    // Set another timeout to remove the alert element after it fades out
    setTimeout(function () {
      alertContainer.removeChild(alert);
    }, 500);
  }, 3000);
}

// Add an event listener to the lowercase checkbox
lowercase.addEventListener("change", function () {
  // Check if the lowercase checkbox is checked
  if (lowercase.checked) {
    // Check the letters checkbox
    letters.checked = true;
  } else {
    // Check if the uppercase checkbox is also unchecked
    if (!uppercase.checked) {
      // Uncheck the letters checkbox
      letters.checked = false;
    }
  }
});

// Add an event listener to the uppercase checkbox
uppercase.addEventListener("change", function () {
  // Check if the uppercase checkbox is checked
  if (uppercase.checked) {
    // Check the letters checkbox
    letters.checked = true;
  } else {
    // Check if the lowercase checkbox is also unchecked
    if (!lowercase.checked) {
      // Uncheck the letters checkbox
      letters.checked = false;
    }
  }
});

// Add an event listener to the letters checkbox
letters.addEventListener("change", function () {
  // Check if the letters checkbox is checked
  if (letters.checked) {
    // Check the lowercase and uppercase checkboxes
    lowercase.checked = true;
    uppercase.checked = true;
  } else {
    // Uncheck the lowercase and uppercase checkboxes
    lowercase.checked = false;
    uppercase.checked = false;
  }
});

// Replace the showAlert function with the new one in the generate button click event listener
// Modify the generate button click event listener
generate.addEventListener("click", function () {
  // Get the number of passwords
  let num = parseInt(number.value);
  let len = parseInt(length.value);
  let useSymbols = symbols.checked;
  let useNumbers = numbers.checked;
  let useLetters = letters.checked;
  let onePassword;
  if (isNaN(len) || len < 1 || len > 4096) {
    showAlert("length_too_long");
    return;
  }
  // Check if any settings are selected
  if (!useSymbols && !useNumbers && !useLetters) {
    // Show a warning alert
    showAlert("no_options");
    return;
  }

  // Validate the number
  if (isNaN(num) || num < 1 || num > 10) {
    return;
  }

  // Clear the result container
  resultContainer.innerHTML = "";

  // Loop through the number of passwords and create result elements
  for (let i = 0; i < num; i++) {
    // Generate a password and display it
    let pwd = generatePassword();

    // Check if the password is empty
    if (!pwd) return;

    // Create a new result element
    let result = document.createElement("div");
    // Set its class name and text content
    result.className = "result";
    result.textContent = pwd;
    // Append it to the result container element
    resultContainer.appendChild(result);
    onePassword = pwd;
  }

  // Check if the number of passwords is one
  if (num == 1) {
    // Copy the password to the clipboard
    copyToClipboard(onePassword);
    // Show a success alert
    showAlert("cptc!");
  }
});