# Florence
A multi-purpose discord bot using discord.js!  
This bot was built mostly for my own amusement. All of the features however can easily be repurposed for general use!<br><br>
# Features:<br>
-Basic music functionality: can play a youtube video's audio, add videos to a queue, skip current playing video, and stop playing, wipe queue and disconnect.<br>
-Simple currency/keyword detection system: whenever a server member sends a message that contains a keyword detected in a local text file, they will gain one currency token. Too many tokens and using detected keywords will mean the message is deleted and a warning is relayed. This functionality would be well suited to a censorship system.<br>
-Voice Channel audio notification: when members join a voice channel that already holds a user, the bot will join as well and play a designated local mp3 file (must be placed in the same directory as index.js)<br>
-Shopping for compliments: Can "-buy" a variety of compliments and praise messages for other users that will spend your tokens, which in turn will put you in good standing with the bot!<br><br>     
# Planned Features:<br>
-Web-scraped/API-Fethed data: Grab data from various cites such as a dictionary site or funny-quotes archive to 
display via command or perhaps as a daily message.<br>
-Member specific audio notifications: keep a map of various members of a server, and assign a specific audio file for the bot to play as their notification in a voice channel.<br><br>
# Setup Tips:<br>
-In a terminal at the root project folder, type: "Node dbInit.js" To initialize a local database for the currency/shop system.<br>
-To use the local audio and keyword detection functionality, you will need to provide your own mp3 and text files (text file must have keywords seperated by a comma) and link them within the index.js file in the appropriate areas.<br><br>
# References:<br>
https://discordjs.guide/
https://gabrieltanner.org/blog/dicord-music-bot


