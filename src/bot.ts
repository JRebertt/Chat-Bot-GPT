import * as venom from 'venom-bot';
import OpenAI from "openai";

import dotenv from 'dotenv';
dotenv.config();



const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY });


venom
  .create({
    session: 'Test-GPT' 
  })
  .then(client => start(client))
  .catch(erro => {
    console.log(erro);
  });

  function start(client: any) {
    client.onMessage(async (message: { body: string; isGroupMsg: boolean; from: any; }) => {
      if (message.isGroupMsg === false) {  // Se a mensagem não é de um grupo
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message.body }  // Usando a mensagem recebida como input
          ],
          model: "gpt-3.5-turbo",
          temperature: 0,
          max_tokens: 256
        });
  
        const response = completion.choices[0].message.content;  // Obtendo a resposta do OpenAI
  
        client.sendText(message.from, response)  // Enviando a resposta do OpenAI de volta ao usuário do WhatsApp
          .then((result: any) => {
            console.log('Result: ', result);
          })
          .catch((erro: any) => {
            console.error('Error when sending: ', erro);
          });
      }
    });
  }
