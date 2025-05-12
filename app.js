// Load the tools we need
const express = require("express");         // Helps us build the website
const bodyParser = require("body-parser");  // Helps us read data from forms
const https = require("https");             // Helps us talk to other websites using HTTPS

const app = express(); // Start the app

// Tell the app to use the "public" folder to get images, CSS, etc.
app.use(express.static("public"));

// Tell the app to understand data that comes from a form (like text input)
app.use(bodyParser.urlencoded({ extended: true }));

// When someone goes to our homepage
app.get("/", (req, res) => {
  // Send them the signup form (signup.html file)
  res.sendFile(__dirname + "/signup.html");
});

// When someone fills out the form and clicks "submit"
app.post("/", (req, res) => {
  // Get the values they typed into the form
  const firstName = req.body.firstName;
  const secondName = req.body.secondName;
  const email = req.body.email;

  // Create a data object in the way Mailchimp wants it
  const data = {
    members: [
      {
        email_address: email,          // Their email
        status: "subscribed",          // We want to subscribe them
        merge_fields: {
          FNAME: firstName,            // First name
          LNAME: secondName            // Last name
        }
      }
    ]
  };

  // Turn the JavaScript object into a JSON string
  const jsonData = JSON.stringify(data);

  // Mailchimp API URL (the list you're adding the person to)
  const url = "https://us10.api.mailchimp.com/3.0/lists/9a3e8d7df9";

  // Some extra info needed to send the data correctly
  const options = {
    method: "POST", // We are *sending* data
    auth: "kriti123:d872cc3086000b39ff6d02b705ed8e73-us10" // Login info (use your real API key here)
  };

  // Send the data to Mailchimp
  const request = https.request(url, options, (response) => {
    console.log(response.statusCode);
    
    if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }
    
    // Show the Mailchimp response in the terminal (for debugging)
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  app.post("/failure", (req,res) => {
    res.redirect("/");
  })

  // Actually send the data we prepared
  request.write(jsonData);
  request.end(); // Done sending
});

// Start the app on port 3000
const port  = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});


//API Key
//d872cc3086000b39ff6d02b705ed8e73-us10

//Audience Id
//9a3e8d7df9