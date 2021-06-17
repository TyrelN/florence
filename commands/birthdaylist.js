const { Users } = require('../dbObjects');
module.exports = {
    name: 'birthdaylist',
    description: 'get the birthdays for all users with one',
    async execute(message, commandArgs) {
        const members = await Users.findAll();
        let birthdayList = [];
        //need to get the username of each User ID 
        await members.forEach(element => {
            message.guild.members.fetch(element.user_id).then((result) => {
                const birthday = element.birthday;
                if(birthday.length > 0){
                    let listEntry = `${result.displayName}: ${birthday}`;
                    birthdayList.push(listEntry);
                    console.log('a date has been pushed');
                }
            });
           
         
        });
        //return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.item_id}`).join(', ')}`);
        return await message.channel.send(`Birthdays on file: ${birthdayList.join(', ')}`);
        
    },
};