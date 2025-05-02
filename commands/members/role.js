import { Colors, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"
import { defaultEmbed, generateEmbed, replyWithEmbed, successEmbedColor } from "../../utils/embed-creator.js";

const meta_data = {
    name: 'role',
    description: 'Manage a role of a user.'
}

const command = new SlashCommandBuilder()
    .setName(meta_data.name)
    .setDescription(meta_data.description)
    .addUserOption(option => option
        .setName('user')
        .setDescription('Select user')
        .setRequired(true))
    .addRoleOption(option => option
        .setName('role')
        .setDescription('Select the role to update')
        .setRequired(true))
    .addStringOption(option => option
        .setName('action')
        .setDescription('Choose the action for the user')
        .addChoices(
            { name: 'Add', value: '1' },
            { name: 'Remove', value: '2' }
        )
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .toJSON()


/**
* @param {import('discord.js').Interaction} interaction
*/
export const roleHandler = async (interaction) => {
    const interactedUser = interaction.options.getUser('user');
    const action = parseInt(interaction.options.getString('action'));
    let embed = defaultEmbed;

    if (interactedUser && interaction.member.permissions.has(PermissionFlagsBits.ManageRoles) && interactedUser.id !== interaction.member.id) {
        await interaction.guild.members.fetch();

        const user = interaction.guild.members.cache.get(interactedUser.id);
        const requestedRole = interaction.options.getRole('role');
        const allMembers = requestedRole.members;
        const botMembers = allMembers.filter(member => member.user.bot);
        const members = allMembers.filter(member => !member.user.bot);

        if (action == 1) {
            // checks if the member is not trying to get the bot role.

            if (members.size == 0 && botMembers.size > 0) {
                embed = generateEmbed(
                    'Cannot Assign Bot Role',
                    `The role ${requestedRole} appears to be assigned only to bots. You can't assign a bot-only role to a human member like ${user.displayName}.`,
                    Colors.DarkRed
                );
            } else if (user.roles.cache.has(requestedRole.id)) {
                embed = generateEmbed(
                    'The user already has the role',
                    `The user ${user.displayName} already has the ${requestedRole} role you can't set the role.`,
                    Colors.DarkRed
                );
            } else {
                await user.roles.add(requestedRole)
                    .then(() => {
                        embed = generateEmbed(
                            'The role has been updated for @' + interaction.options.getUser('user')?.globalName,
                            `The user role has been updated to ${interaction.options.getRole('role')}`,
                            successEmbedColor
                        );
                    })
                    .catch(() => { });
            }
        } else if (action == 2) {
            const member = await interaction.guild.members.fetch(interactedUser.id);
            const memberHasTheRole = member.roles.cache.has(requestedRole.id);

            if (memberHasTheRole) {
                await member.roles.remove(requestedRole.id);

                embed = generateEmbed(
                    'The role has been removed for @' + member.displayName,
                    `The role ${requestedRole} has been successfully removed from the user.`,
                    successEmbedColor
                );
            } else {
                embed = generateEmbed(
                    'Role Not Found for @' + member.displayName,
                    `The user does not have the ${requestedRole} role, so it cannot be removed.`,
                    Colors.DarkRed
                );
            }
        }
    }
    else {
        embed = generateEmbed(
            "Don't have enough permissions",
            `You do not have enough permissions to manage rolls or something went wrong.`,
            Colors.DarkRed
        );
    }

    return replyWithEmbed(embed, interaction);
}

export default command;