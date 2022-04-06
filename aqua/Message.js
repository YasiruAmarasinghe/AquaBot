/* Copyright (C) 2020 Yusuf Usta.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
WhatsAsena - Yusuf Usta
*/

const {MessageType, Presence, MessageOptions} = require('@adiwajshing/baileys');
const Base = require('./Base');
const ReplyMessage = require('./ReplyMessage');

class Message extends Base {
    constructor(client, data) {
        super(client);
        if (data) this._patch(data);
    }

    _patch(data) {
        this.id = data.key.id === undefined ? undefined : data.key.id;
        this.jid = data.key.remoteJid;
        this.fromMe = data.key.fromMe;
        this.message = data.message.extendedTextMessage === null ? data.message.conversation : data.message.extendedTextMessage.text;
        this.unreadCount = data.unreadCount;
        this.timestamp = typeof(data.messageTimestamp) === 'object' ? data.messageTimestamp.low : data.messageTimestamp;
        this.data = data;
        
        if (data.message.hasOwnProperty('extendedTextMessage') &&
                data.message.extendedTextMessage.hasOwnProperty('contextInfo') === true && 
                data.message.extendedTextMessage.contextInfo.hasOwnProperty('quotedMessage')) { 
            this.reply_message = new ReplyMessage(this.client, data.message.extendedTextMessage.contextInfo); } else {
                this.reply_message = false;
            }
        
        if (data.message.hasOwnProperty('extendedTextMessage') &&
        data.message.extendedTextMessage.hasOwnProperty('contextInfo') === true && 
        data.message.extendedTextMessage.contextInfo.hasOwnProperty('mentionedJid')) {
            this.mention = data.message.extendedTextMessage.contextInfo.mentionedJid;
        } else {
            this.mention = false;
        }
        
        return super._patch(data);
    }

    async delete() {
        return await this.client.deleteMessage(this.jid, {id: this.id, remoteJid: this.jid, fromMe: true})
    }

    async reply(text) {
        var message = await this.client.sendMessage(this.jid, text, MessageType.text);
        return new Message(this.client, message)
    }

    async sendMessage(content, type = MessageType.text, options) {
        return await this.client.sendMessage(this.jid, content, type, options)
    }

    async sendTyping() {
        return await this.client.updatePresence(this.jid, Presence.composing) ;
    }

    async sendRead() {
        return await this.client.chatRead(this.jid);
    }
async sendMessageFromContent(jid,obj,opt={}){
     let prepare = await this.prepareMessageFromContent(jid,obj,opt)
    await this.relayWAMessage(prepare)
    return prepare
     }
     async fakeReply(jid,message,type,opt,fakeJid,participant,fakeMessage){
     return await this.sendMessage(jid,message,type,{
  quoted: { key: {fromMe: jid == this.user.jid, participant,remoteJid: fakeJid },
"message": fakeMessage}, 
...opt
})
     }
     getMentionedJidList(text){
		try{
			return text.match(/@(\d*)/g).map(x => x.replace('@', '')+'@s.whatsapp.net')||[];
		} catch(e){
			return []
		}
  	}
async sendButton(jid, message, type, button = [], opt = {}) {
        message = (
            await this.prepareMessage(`0@s.whatsapp.net`, message, type, opt).catch(async(e) => {
          let err = util.format(e).toLowerCase()
          if (err.includes('marker')){
          return await this.prepareMessage(`0@s.whatsapp.net`,message,type,{...opt,thumbnail:await this.resizeImage(message,'48x48')})
          } else if (err.includes('this.isZero')){
            return await this.prepareMessage(`0@s.whatsapp.net`,message,type,{...opt,quoted:null})
          }
        })
        ).message;
        let isMedia = !(type == 'conversation' || type == 'extendedTextMessage');
        message = message[type] || message;
        let headerType = type
            .toUpperCase()
            .replace('MESSAGE', '')
            .replace(`EXTENDED`, '')
            .replace(`CONVERSATION`, 'EMPTY')
            .trim();
        let buttons = [];
        for (let a of button) {
            buttons.push({ type: 'RESPONSE', buttonText: { displayText: a.text }, buttonId: a.id });
        }
        let contentText =
            opt.content || (type == baileys.MessageType?.text
                ? message.extendedTextMessage?.text
                : Object.keys(message).includes('caption')
                ? message.caption
                : ' ');
        let footerText = opt.footer;
        let content = isMedia ? { [type]: message } : headerType == 'TEXT' ? { ...message } : {};
        return this.sendMessageFromContent(
            jid,
            { buttonsMessage: { contentText, footerText, headerType, buttons, ...content } },
            { ...opt },
        );
     }
};

module.exports = Message;
