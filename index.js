const { Client, Intents } = require('discord.js');
const PREFIX = '!'
const TOKEN = 'NzIxMDM5NzI0MTQ3NTA3MzEw.XuOukg.GV9O7B9qe1wdhnzATUrM4gYmqUU'
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const axios = require("axios");
const cheerio = require("cheerio");
const amazonLadderUrl = "https://tsw.median-xl.com/ladder?lc=1";
const sorceressLadderUrl = "https://tsw.median-xl.com/ladder?lc=2";
const necromancerLadderUrl = "https://tsw.median-xl.com/ladder?lc=3";
const paladinLadderUrl = "https://tsw.median-xl.com/ladder?lc=4";
const barbarianLadderUrl = "https://tsw.median-xl.com/ladder?lc=5";
const druidLadderUrl = "https://tsw.median-xl.com/ladder?lc=6";
const assassinLadderUrl = "https://tsw.median-xl.com/ladder?lc=7";
const urlArr = [amazonLadderUrl,sorceressLadderUrl, necromancerLadderUrl, paladinLadderUrl, barbarianLadderUrl, druidLadderUrl, assassinLadderUrl ];
const ajaxArr = urlArr.map(item => axios.get(item));
const classArr = ['amazon(亞馬)','sorceress(法師)','necromancer(死靈)','paladin(聖騎)','barbarian(野人)','druid(德魯依)','assassin(刺客)']


client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	const { commandName } = interaction;
	if (!interaction.isCommand()) return;    
	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'ladder') {     
        const result = await ladderInfo('#scladder');  
		await interaction.reply(result);
    } else if (commandName === 'ladder-hc') {     
        const result = await ladderInfo('#hcladder');  
		await interaction.reply(result);
    }    
});


async function ladderInfo(type){
    const literator = await Promise.allSettled(ajaxArr);
    const arr = Array.from(literator).map(item => cb(item.value.data, type))
    const result = arr.reduce((acc, cur, index )=> {
        const className = classArr[index];
        acc = acc + `${className}:\r\n`;
        for (const prop in cur) {
            acc = acc + `${prop}: ${cur[prop]}\r\n`
        }
        acc = acc + '\r\n'
        return acc
    },'')
    return result;
}


function cb(data, type) {    
    const $ = cheerio.load(data);
    const lvArr = Array.from($(`${type} tr:not(:first-child)`)).slice(0,30).map(item => $(item).find('td:nth-of-type(6)').text())
    const obj = lvArr.reduce((acc, cur) => {
        if (!cur) return acc;
        const index = `lv${cur}`;
        acc[index] = acc[index] ? Number(acc[index]) + 1 : 1
        return acc;
    },{});

    return obj
}    



client.login(TOKEN);