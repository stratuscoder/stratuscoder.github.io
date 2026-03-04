// app.js

// Select form and input elements
const form = document.getElementById('redirectForm');
const id = document.getElementById('id');
const errorMsg = document.getElementById('errorMsg');

// Define the regex pattern: ^ = start, [A-Za-z]{3} = 3 letters, \d{5} = 5 digits, $ = end.
const codePattern = /^[A-Za-z]{3}\d{5}$/; 

form.addEventListener('submit', function(event) {
  event.preventDefault(); // Stop form from submitting normally

  const testValue = id.value.trim();
  let error = "";

  // 1. Check for empty input
  if (testValue === "") {
    error = "Please enter your tenant ID (cannot be empty).";
  }
  // 2. Check format against the regex pattern
  else if (!codePattern.test(testValue)) {
    error = "Invalid format. Use 3 letters followed by 5 digits (e.g., abc12345).";
  }

  if (error) {
    // Show error message
    errorMsg.textContent = error;
    errorMsg.style.display = "block";
    // (Optional) You could also add a class to input to highlight it, e.g., codeInput.classList.add('error')
  } else {
    // Hide any previous error
    errorMsg.textContent = "";
    errorMsg.style.display = "none";
    // Construct the destination URL using the input
    const tenantId = encodeURIComponent(testValue);
    const destinationURL = "https://" + tenantId + ".apps.dynatrace.com/ui/apps/dynatrace.dashboards";
    // Redirect to the new URL
    window.location.href = destinationURL;
  }
});
