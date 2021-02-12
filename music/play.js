//with reference to https://gabrieltanner.org/blog/dicord-music-bot
const ytdl = require('ytdl-core-discord');

module.exports = {
    name: 'play',
    description: 'plays the youtube video specified in the arguments',
    async execute(message, commandArgs, queue, serverQueue) {
        async function playSong(guild, song) {
            serverQueue = queue.get(message.guild.id); //acts as a reference for the queueConstruct object, meaning this is acting as the queueConstruct
            if(!song){
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }
            const dispatcher = serverQueue.connection.play(await ytdl(song.url), { type: 'opus'}).on('finish', () =>{
                serverQueue.songs.shift();
                playSong(guild, serverQueue.songs[0]);
            })
                .on("error", error => console.error(error));
            serverQueue.textChannel.send(`playing **${song.title}**`).then((reply) => reply.delete({timeout: 30000}));

        }
        if(message.member.voice.channel){
            const songInfo = await ytdl.getInfo(commandArgs);
            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };
            if(!serverQueue){//if the reference to queueConstruct is null, make a new one
                const queueConstruct = {//this is an object with the properties listed below
                    textChannel: message.channel,
                    voiceChannel: message.member.voice.channel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                };

                queue.set(message.guild.id, queueConstruct);//add this queueConstruct to our queue map with our server ID as the key
                queueConstruct.songs.push(song);

                try{
                    queueConstruct.connection = await message.member.voice.channel.join();
                    //play the song
                    await playSong(message.guild, queueConstruct.songs[0]);
                }catch(err){
                    console.log(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(err);
                }
                }else{
                serverQueue.songs.push(song);
                //console.log(serverQueue.songs);
                return message.channel.send(`**${song.title}** is in the queue!`).then((reply) => reply.delete({timeout: 5000}));
            }
            }else{
            message.reply('you need to be in a voice channel ya dingus').then((reply) => reply.delete({timeout: 10000}));
        }
    },
};



