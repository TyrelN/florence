//references: https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.dotabuff.com/';
const Discord = require('discord.js');
//const { randomSelect } = require('../index.js');
module.exports = {
    name: 'dotastats',
    description: 'sends out dotabuff data',
    execute(message) {
        puppeteer
        .launch().then(function(browser){
            return browser.newPage();
        }).then(function(page){
            return page.goto(url).then(function(){
                return page.content();
            });
        }).then(function(html){
            const winrateEmbed = new Discord.MessageEmbed()
	        .setColor('#0099ff')
	        .setTitle('Dota 2 biggest win rate changes this week');
            
            const pickrateEmbed = new Discord.MessageEmbed()
	        .setColor('#0099ff')
	        .setTitle('Dota 2 largest trend changes this week');

            //first winrates
            const winrates = $('.home-hero-pulse', html).first();
            //console.log(winrates.contents().text());
            const pickrates = $('.home-hero-pulse', html).last();
            winrates.find('article > table > tbody > tr').each((index, element) => {
                const results = $(element).find('td');
                const change = $(element).find('.fa.fa-sort-up.color-stat-win.fa-space').length > 0 ? 'going up by' : 'going down by' 
                winrateEmbed.addField(results.eq(1).text(), `win rate of ${results.eq(2).text()}, ${change} ${results.eq(3).text()}`, false);
            });
            pickrates.find('article > table > tbody > tr').each((index, element) => {
                const results = $(element).find('td');
                const change = $(element).find('.fa.fa-sort-up.color-stat-win.fa-space').length > 0 ? 'going up by' : 'going down by' 
                pickrateEmbed.addField(results.eq(1).text(), `pick rate of ${results.eq(2).text()}, ${change} ${results.eq(3).text()}`, false);
            });
            message.channel.send(winrateEmbed);
            message.channel.send(pickrateEmbed);
        }).catch(function(err){
            console.log(`seems there was an error: ${err}`)
        });
    },
};