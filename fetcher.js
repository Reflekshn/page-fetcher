'use strict';

// Import modules
const request = require('request');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

// Store CLI arguments for later use
const url = process.argv[2];
const localPath = process.argv[3];

// Send a GET request to the requested URL
request(url, (error, response, body) => {
  // Return an error if the URL is invalid
  if (error || response.statusCode !== 200) {
    console.error(`Error: ${error}`);
    return;
  }


  fs.writeFile(localPath, 'utf8', { flag: 'wx+' }, error => {
    // Check to see if the file already exists
    if (error) {
      // If so, would the user like to overwrite it?
      const rl = readline.createInterface({ input, output });
      rl.question('This file already exists. Would you like to overwrite it (Y/N)?', (answer) => {
        answer = answer.toUpperCase();
        if (answer === 'Y') {
          // If so, overwrite the file
          rl.close();
          fs.writeFile(localPath, body, error => {
            if (error) {
              console.error(`Error: ${error}`);
            }

            // Output the size to the console
            fs.readFile(localPath, 'utf8', (error, data) => {
              if (error) {
                console.error(`Error: ${error}`);
              }
              console.log(`Downloaded and saved ${data.length} bytes to ./index.html`);
            });
          });
        } else if (answer === 'N') {
          // If not, just output the size of the file to the console
          rl.close();

          fs.readFile(localPath, 'utf8', (error, data) => {
            if (error) {
              console.error(`Error: ${error}`);
            }

            console.log(`The size of the existing file is ${data.length} bytes`);
          });
        } else {
          // Terminate the program if an invalid answer is given
          rl.close();
          console.log('Invalid answer');
        }
      });
    } else {
      // If the file does not exists, create a new one and write the contents to it
      fs.writeFile(localPath, body, error => {
        if (error) {
          console.error(`Error: ${error}`);
        }

        // Output the size of the file to the console
        fs.readFile(localPath, 'utf8', (error, data) => {
          if (error) {
            console.error(`Error: ${error}`);
          }

          console.log(`Downloaded and saved ${data.length} bytes to ./index.html`);
        });
      });
    }
  });
});