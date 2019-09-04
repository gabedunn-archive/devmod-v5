/*
* Gabe Dunn 2018
* Command that sends a 'let me google that for you link'.
*/

import { blue } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { logError } from '../utils/log'
import { getAuthor } from '../utils/user'

const types = ['web','image']
const sites = ['google','yahoo','bing','ask','aol','duckduckgo']
const siteJson = {
  'google': 'g',
  'yahoo':'y',
  'bing': 'b',
  'ask': 'k',
  'aol': 'a',
  'duckduckgo': 'd'
}
const typeJson = {
  'web': 'w',
  'image': 'i'
}
// Export an object with command info and the function to execute.
export const lmgtfyCommand = {
  name: 'LMGTFY',
  aliases: ['lmgtfy'],
  category: 'fun',
  description: 'Sends a \'let me google that for you link\'.',
  permissions: ['SEND_MESSAGES'],
  usage: '<query> <web|image> <site>',
  exec: async (args, message) => {
    try {
      //if no options are specified google and web are default
      let t = 'w'
      let s = 'g'
      // If a query isn't specified, send an error message and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage(
          'No Query Specified', 'You need to specify a query.', message
        )
      }
      let options = args.slice(-2)

      //Loop through both the arrays to check the options specified
        sites.forEach(e => {
          if(options[0].toLowerCase() === e){
            s = siteJson[e]
        }
      })

      //lmgtfy only supports image for google searches
      if(s === 'g'){
        types.forEach(e => {
          if(options[1].toLowerCase() === e){
            t = typeJson[e]
        }
      })
    }
      
      
      


      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('LMGTFY', 'Failed to delete message', err, message)
      }

      try {
        // Send a let me google that for you link in an embedded message.
        // noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
        return message.channel.send({
          embed: {
            title: args.slice(0,args.length-2).join(' '),
            color: blue,
            url: `https://lmgtfy.com/?q=${args.slice(0,args.length-2).join('+')}&s=${s}&t=${t}`,
            description: 'Here you go!',
            author: getAuthor(message.member)
          }
        })
      } catch (err) {
        await logError('LMGTFY', 'Failed to send message', err, message)
      }
    } catch (err) {
      await logError('LMGTFY', 'Failed to run command', err, message)
    }
  }
}
