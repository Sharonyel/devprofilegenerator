var fs = require("fs");
var inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");
const convertFactory = require("electron-html-to")

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  inquirer.prompt([
    {
      type: "input",
      message: "What is your Github Username?",
      name: "username"
    },
    {
      type: "list",
      message: "Choose a color",
      name: "color",
      choices: [
        "red",
        "green",
        "pink",
        "blue"
      ]
    }

  ]).then(function ({ username, color }) {
    const queryUrl = `https://api.github.com/users/${username}`;

    axios.get(queryUrl).then(function (res) {
      const html = generateHTML(res, color);

      const conversion = convertFactory({
        converterPath: convertFactory.converters.PDF
      });
      conversion({ html }, function(err, result) {
        if (err) {
          return console.error(err);
        }
        result.stream.pipe(fs.createWriteStream("./profile.pdf"));
        conversion.kill();
        writeFileAsync("index.html", html);
      })

      // return writeFileAsync("index.html", html);
    }).then(function () {
      console.log("Successfully wrote to index.html");
    })
      .catch(function (err) {
        console.log(err);
      });

  });

}
const colors = {
  green: {
    wrapperBackground: "#E6E1C3",
    headerBackground: "#C1C72C",
    headerColor: "black",
    photoBorderColor: "#black"
  },
  blue: {
    wrapperBackground: "#5F64D3",
    headerBackground: "#26175A",
    headerColor: "white",
    photoBorderColor: "#73448C"
  },
  pink: {
    wrapperBackground: "#879CDF",
    headerBackground: "#FF8374",
    headerColor: "white",
    photoBorderColor: "#FEE24C"
  },
  red: {
    wrapperBackground: "#DE9967",
    headerBackground: "#870603",
    headerColor: "white",
    photoBorderColor: "white"
  }
};

function generateHTML(res, color) {
  return `<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
      <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
      <title>Document</title>
      <style>
          @page {
            margin: 0;
          }
         *,
         *::after,
         *::before {
         box-sizing: border-box;
         }
         html, body {
         padding: 0;
         margin: 0;
         }
         html, body, .wrapper {
         height: 100%;
         }
         .wrapper {
         background-color: ${colors[color].wrapperBackground};
         padding-top: 100px;
         }
         body {
         background-color: white;
         -webkit-print-color-adjust: exact !important;
         font-family: 'Cabin', sans-serif;
         }
         main {
         background-color: #E9EDEE;
         height: auto;
         padding-top: 30px;
         }
         h1, h2, h3, h4, h5, h6 {
         font-family: 'BioRhyme', serif;
         margin: 0;
         }
         h1 {
         font-size: 3em;
         }
         h2 {
         font-size: 2.5em;
         }
         h3 {
         font-size: 2em;
         }
         h4 {
         font-size: 1.5em;
         }
         h5 {
         font-size: 1.3em;
         }
         h6 {
         font-size: 1.2em;
         }
         .photo-header {
         position: relative;
         margin: 0 auto;
         margin-bottom: -50px;
         display: flex;
         justify-content: center;
         flex-wrap: wrap;
         background-color: ${colors[color].headerBackground};
         color: ${colors[color].headerColor};
         padding: 10px;
         width: 95%;
         border-radius: 6px;
         }
         .photo-header img {
         width: 250px;
         height: 250px;
         border-radius: 50%;
         object-fit: cover;
         margin-top: -75px;
         border: 6px solid ${colors[color].photoBorderColor};
         box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
         }
         .photo-header h1, .photo-header h2 {
         width: 100%;
         text-align: center;
         }
         .photo-header h1 {
         margin-top: 10px;
         }
         .links-nav {
         width: 100%;
         text-align: center;
         padding: 20px 0;
         font-size: 1.1em;
         }
         .nav-link {
         display: inline-block;
         margin: 5px 10px;
         }
         .workExp-date {
         font-style: italic;
         font-size: .7em;
         text-align: right;
         margin-top: 10px;
         }
         .container {
         padding: 50px;
         padding-left: 100px;
         padding-right: 100px;
         }

         .row {
           display: flex;
           flex-wrap: wrap;
           justify-content: space-between;
           margin-top: 20px;
           margin-bottom: 20px;
         }

         .card {
           padding: 20px;
           border-radius: 6px;
           background-color: ${colors[color].headerBackground};
           color: ${colors[color].headerColor};
           margin: 20px;
         }
         
         .col {
         flex: 1;
         text-align: center;
         }

         a, a:hover {
         text-decoration: none;
         color: inherit;
         font-weight: bold;
         }

         @media print { 
          body { 
            zoom: .75; 
          } 
         }
      </style>
      <body>
      <div class="wrapper">
      <div class="container photo-header">
      <img src="${res.data.avatar_url}" alt="pic of Sharon Yelverton"></img>
          <h1>Hi!</h1>
          <h1>My name is ${res.data.name}</h1>
          <div class="links-nav">
          <a class="nav-link" href="${res.data.location}">${res.data.location}</a>
          <a class="nav-link" href= ${res.data.html_url}><i class="fa fa-github fa-1x"
          aria-hidden="true"></i>GitHub</a>
          </div>
          </div>
      <main>        
      <div class="container">
      <h5>${res.data.bio}</h5>
      <div class="row">
          <div class="col">
            <div class="card"><h3>Public Repos:</h3> <h3>${res.data.public_repos}</h3></div>
          </div>
          <div class="col">
            <div class="card"><h3>Followers:</h3> <h3>${res.data.followers}</h3></div>
          </div>
            
       </div> 
       <div class="row">   
          <div class="col"> 
            <div class="card"><h3>Github Stars</h3> <h3>${res.data.public_gists}</h3></div>
          </div>
​
          <div class="col">
            <div class="card"><h3>Following:</h3> <h3>${res.data.following}</h3></div>
          </div>
            
      </div>
      </div>
      </main>
      </div>
      </body>
      </html>`}

promptUser()


