import { Colors } from "discord.js";
import { config as envConfig } from "dotenv";

// env config.
envConfig();

export const config = {
    theme_color: Colors.DarkRed,
    guild: process.env.GUILD_ID,
    client_id: process.env.CLIENT_ID
}