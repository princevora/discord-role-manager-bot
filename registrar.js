import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { loadCommands } from "./utils/load-commands.js";

// run the config.
config();

const { CLIENT_ID, GUILD_ID } = process.env;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const rest = new REST({ version: '10' }).setToken(TOKEN);

export function initializeRegistrar() {
    return new Promise(async (resovle, reject) => {
        try {
            const commands = await loadCommands(path.join(__dirname, 'commands'));

            if (commands.length) {
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                    { body: commands }
                );
            }

            resovle('✅ Slash commands registered successfully!');
        } catch (err) {
            reject('❌ Error registering commands:' + err?.message);
        }
    })
}