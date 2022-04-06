const Aqua = require('../events');
const {MessageType, MessageOptions, Mimetype} = require('@adiwajshing/baileys');
const Config = require('../config');
let wk = Config.WORKTYPE == 'public' ? false : true
const Language = require('../language');

    Aqua.operate({ pattern: 'test', fromMe: wk,  deleteCommand: false, desc: 'Nothing'}, (async (message, match) => {
   var HANDLER = '';
    
                    if (/\[(\W*)\]/.test(Config.HANDLERS)) {
                        HANDLER = Config.HANDLERS.match(/\[(\W*)\]/)[1][0];
                    } else {
                        HANDLER = '.';
                    }

const sections = [
    {
	title: "Section 1",
	rows: [
	    {title: "Option 1", rowId: HANDLER + "menu"},
	    {title: "Option 2", rowId: HANDLER + "alive", description: "This is a description"}
	]
    },
   {
	title: "Section 2",
	rows: [
	    {title: "Option 3", rowId: HANDLER + "try"},
	    {title: "Option 4", rowId: HANDLER + "tes", description: "This is a description V2"}
	]
    },
]

const listMessage = {
  text: "This is a list",
  footer: "nice footer",
  title: "Amazing boldfaced list title",
  buttonText: "Options",
  sections
}

await message.client.sendMessageFromContent(message.jid, listMessage, MessageType.listMessage, {quoted: message.data});

}))
