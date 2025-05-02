import { Client, GatewayIntentBits, Events, Partials } from 'discord.js';
import { config } from 'dotenv';
import { initializeRegistrar } from './registrar.js';
import { handlers } from './utils/handlers.js';

config();

// initialy call the registrar with that we can register or lookup if the commands are registered
(async () => {
  await initializeRegistrar()
    .then(msg => console.log(msg))
    .catch(err => console.warn(err))
    .finally(() => console.log('Registrar Initializer has finished the work process.'));
})()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once(Events.ClientReady, async () => {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isCommand()) {
      return handlers[interaction.commandName](interaction);
    } else if(interaction.isButton()){
      return buttonHandlers[interaction.customId](interaction);
    }
  })
});

client.login(process.env.DISCORD_BOT_TOKEN);
