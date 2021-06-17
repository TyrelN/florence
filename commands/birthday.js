const {createUser}  = require('../index.js');
const { Users } = require('../dbObjects');
module.exports = {
    name: 'birthday',
    description: 'set the birthday for a given user',
    async execute(message, commandArgs) {
        const args = commandArgs.split(' ');
        const birthday = args.shift().toLowerCase();
        const birthdayMessage = args.join(' ').trim();
        const target = message.mentions.users.first() || message.author;    
        const finalMessage = birthdayMessage.length > 0 ? birthdayMessage : `I wish for you a lovely birthday ${target}`;
        console.log(`${finalMessage} <- the message being set for this birthday`);
        let user = await Users.findOne({ where: { user_id: target.id}});
        if(!user){
                user = await createUser(target.id, 0);
                console.log('created and obtained the user');
            }
            //now we need to add a birthday to this user and a birthday message
            await user.update({birthday: birthday, birthday_message: finalMessage})
            console.log('birthday data added!')
    },
};