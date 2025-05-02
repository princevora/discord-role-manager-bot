import { readdir } from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

export async function loadCommands(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const commands = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            commands.push(...await loadCommands(fullPath));
        } else if (entry.name.endsWith('.js')) {
            const { default: command } = await import(pathToFileURL(fullPath).href);
            
            if (command) commands.push(command);
        }
    }

    return commands;
}