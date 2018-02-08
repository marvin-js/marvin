export const findAllCommand = /^(\$[a-z\s0-9\/\-]+?\s=\s)?([a-z\s0-9\/\-]+?)({[a-z\n\s0-9\/\-]*})?(\n|$)+?/gmi

export const isCommandWithSubCommand = /{([a-z\n\s0-9\/\-]*)}/gmi

export const getNameWithSubCommand = /([a-z\s0-9\/\-]*)/