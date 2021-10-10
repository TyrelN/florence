

# Florence
A multi-faceted Discord bot using [discord.js](https://discord.js.org/#/).

Watch a video demo of the app [here](https://www.youtube.com/watch?v=c3mvTXFVl98)

## Features

### Music Functionality
Florence can play audio from youtube videos, and store a queue of videos to play in sequence with the ability to display a queue, stop a queue or skip a song.

### Simple Currency/Keyword Detection
local text files hold keywords that are consistently checked for in messages, which triggers a currency increase in a member's balance. The balance and member data is stored within an SQLite database. There are additional checks for mentions of the bot for cheeky retort purposes.

### Voice Channel Join Audio
When members join a voice channel, the bot will join as well and play a randomly chosen sound clip that was added to their account.<br>
### Shopping For Compliments
Users can "-buy" a variety of compliments and praise messages for other users that will spend your tokens.<br>
### Web-Scraped Statistics
Florence can grab win rate and pick rate data from Dota 2 statistics site, [dotabuff](https://www.dotabuff.com/), to display via a command.<br>
### Daily Announcements
Users can store any text input given with a command in a text file on the host server. Florence will check that text file at a specified time of day and send the message's contents to a specified channel. The textfile will be wiped after the message is broadcast.<br>
### Birthday Accounts
Users can add a birthday and a birthday message to another user's personal account within the SQLite database. Florence, in addition to announcements, checks daily for any server member's birthday on file, and sends them the message stored.

## Project Status and Limitations
The project for the most part is feature-complete and fully functional. On a code-base and usability level, however, there is plenty of room for improvement:
* Logic is tightly coupled within modules, making it difficult to read.
* There is no unit-testing, partially due to the point above.
* Keyword detection being hard-coded to a text file is not user friendly.

A code-refactoring and cleanup would greatly benefit the project and it's readability, in addition to making future improvements and updates easier.

# Setup Tips
* This program requires [Node.Js](https://nodejs.org/en/) on the host computer to function.
* A discord application account and project must be created [here](https://discord.com/developers/applications/ ). The unique token generated can be applied to a JSON file (ex. config.json) as environment variables that can then be accessed in index.js. The prefix value is also imported as an environment variable.
* type `node dbInit.js` to initialize the sqlite database.
* type `node index.js` to start the project.
* Keyword detection relies on a textfile where each word to be detected is comma-seprated. within the index.js file in the appropriate areas.<br><br>
## References
https://discordjs.guide/<br>
https://gabrieltanner.org/blog/dicord-music-bot<br>
https://medium.com/@andre.devries/how-to-create-a-task-scheduler-in-nodejs-ad67eadad467<br>
https://dev.to/masbagal/saving-image-from-url-using-node-js-5an6<br>
https://flaviocopes.com/node-download-image/<br>
https://medium.com/@stefanhyltoft/scraping-html-tables-with-nodejs-request-and-cheerio-e3c6334f661b<br>
https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/

