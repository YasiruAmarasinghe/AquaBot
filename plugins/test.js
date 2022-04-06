const Aqua = require('../events');
const {MessageType,Mimetype} = require('@adiwajshing/baileys');
const config = require('../config');
const fs = require('fs');
let wk = config.WORKTYPE == 'public' ? false : true
Aqua.operate({ pattern: 'test ?(.*)', fromMe: wk,  deleteCommand: false, desc: 'Bla bla bla'}, (async (message, match) => {
    const buttons = [
        {buttonId: '.video ', buttonText: {displayText: 'vidcmdtest' }, type: 1},
        {buttonId: '.song', buttonText: {displayText: 'songcmdtest' }, type: 1}
    ]
    const buttonMessage = {
        contentText: "Hi,its test of button",
        footerText: 'Aquabot',
        buttons: buttons,
        headerType: 1
    }

    await message.client.sendMessageFromContent(message.jid, buttonMessage, MessageType.buttonsMessage, {quoted: message.data});
}))
