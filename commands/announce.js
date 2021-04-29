fs = require ('fs');
module.exports = {
    name: 'announce',
    description: 'set up some text to store as an announcement for the next day!',
    execute(message, commandArgs) {
        fs.writeFile('announcement.txt', commandArgs, () => {console.log('announcement saved')});
    
    },
};