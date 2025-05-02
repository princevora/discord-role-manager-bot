import { Colors, EmbedBuilder, MessageFlags } from "discord.js";

export const successEmbedColor = '#4CAF50';
export const generateEmbed = (title, description, color) => {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color);
}

export const replyWithEmbed = (embed, interaction, flags = MessageFlags.Ephemeral) => {
    return interaction.reply({
        embeds: [embed],
        flags
    });
}

export const defaultEmbed = generateEmbed(
    'Something went wrong',
    'There is something went wrong. we cannot process the request.',
    Colors.Yellow
)

export const noPermissionEmbed = generateEmbed(
    'Dont have permissions',
    'You do not have the permissions for managing the channels',
    Colors.DarkRed
);