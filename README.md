# Kakoune Script TextMate Grammar

A comprehensive TextMate grammar for Kakoune script (`.kak` files and `kakrc`) with support for embedded languages.

**[🚀 Try the Interactive Demo](https://Yukaii.github.io/kakoune-script-textmate-grammar)**

## Features

- **Complete syntax highlighting** for all Kakoune script constructs
- **Embedded language support** for shell scripts (`%sh{}`) and other languages
- **All expansion types**: `%opt{}`, `%val{}`, `%reg{}`, `%arg{}`, `%file{}`, `%exp{}`
- **All delimiters supported**: `{}`, `()`, `[]`, `<>`
- **Keywords, attributes, types, and values** from the official Kakoune syntax

## Supported File Types

- `.kak` - Kakoune script files
- `kakrc` - Kakoune configuration files

## Grammar Coverage

### Comments
- Line comments starting with `#`

### Strings
- Single-quoted strings: `'...'` with `''` escape
- Double-quoted strings: `"..."` with `""` escape (supports expansions inside)

### Expansions (Balanced Strings)
- **Shell expansion**: `%sh{}`, `%sh()`, `%sh[]`, `%sh<>` - embeds shell script
- **Option expansion**: `%opt{name}` - references Kakoune options
- **Value expansion**: `%val{name}` - internal Kakoune values
- **Register expansion**: `%reg{name}` - Kakoune registers
- **Argument expansion**: `%arg{n}` or `%arg{@}` - command arguments
- **File expansion**: `%file{path}` - reads file content
- **Recursive expansion**: `%exp{...}` - recursive expansion
- **Raw strings**: `%{...}` - literal text without expansion

### Embedded Languages
The grammar supports embedded languages in the format:
```kak
lua %{
    return "Hello from Lua!"
}
```

Currently supported:
- **lua** - Lua scripts
- **python** - Python scripts
- **javascript** - JavaScript code
- **ruby** - Ruby code
- **perl** - Perl code
- **Generic** - Any other language identifier followed by `%{...}`

### Keywords
All built-in Kakoune commands:
- `add-highlighter`, `alias`, `arrange-buffers`, `buffer`, `catch`
- `change-directory`, `colorscheme`, `debug`, `declare-option`
- `declare-user-mode`, `define-command`, `delete-buffer`, `echo`
- `edit`, `evaluate-commands`, `execute-keys`, `fail`, `hook`
- `info`, `kill`, `map`, `nop`, `on-key`, `prompt`
- `provide-module`, `quit`, `remove-highlighter`, `remove-hooks`
- `rename-buffer`, `require-module`, `select`, `set-face`
- `set-option`, `set-register`, `source`, `trigger-user-hook`
- `try`, `unalias`, `unmap`, `write`, `update-option`, etc.

### Attributes
Scopes, modes, and highlighter types:
- Scopes: `global`, `buffer`, `window`, `current`
- Modes: `normal`, `insert`, `prompt`, `goto`, `view`, `user`, `object`
- Highlighters: `number-lines`, `show-matching`, `regex`, `dynregex`, etc.

### Types
Option types:
- `int`, `bool`, `str`, `regex`
- `int-list`, `str-list`, `completions`
- `line-specs`, `range-specs`, `str-to-str-map`

### Values
Built-in constants:
- Colors: `default`, `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`
- Booleans: `yes`, `no`, `false`, `true`

### Switches
Command-line switches:
- `-params`, `-override`, `-hidden`, `-docstring`
- `-file-completion`, `-client-completion`, `-buffer-completion`
- `-shell-script-completion`, `-shell-script-candidates`
- `-group`, `-once`, `-always`
- `-add`, `-remove`, `-update`

### Numbers and Colors
- Numeric literals
- RGB/RGBA colors: `rgb:RRGGBB`, `rgba:RRGGBBAA`

## Installation

### VS Code
1. Copy `kak.tmLanguage.json` to your VS Code extension's syntaxes folder
2. Add file associations in `package.json`:
```json
"contributes": {
  "languages": [{
    "id": "kak",
    "aliases": ["Kakoune Script", "kak"],
    "extensions": [".kak"],
    "filenames": ["kakrc"],
    "configuration": "./language-configuration.json"
  }],
  "grammars": [{
    "language": "kak",
    "scopeName": "source.kak",
    "path": "./syntaxes/kak.tmLanguage.json",
    "embeddedLanguages": {
      "meta.embedded.block.shell.kak": "shellscript",
      "meta.embedded.block.lua.kak": "lua",
      "meta.embedded.block.python.kak": "python",
      "meta.embedded.block.javascript.kak": "javascript",
      "meta.embedded.block.ruby.kak": "ruby",
      "meta.embedded.block.perl.kak": "perl"
    }
  }]
}
```

### Other Editors
The grammar is compatible with any editor that supports TextMate grammars:
- Sublime Text
- Atom
- TextMate
- Any editor using the `vscode-textmate` library

## Example

```kak
# This is a comment

# Define a command with shell expansion
define-command -params 1.. -docstring "My command" my-cmd %{
    echo %arg{1}
    %sh{
        echo "This is shell code: $kak_bufname"
        date +%Y-%m-%d
    }
}

# Using lua embedding
lua %{
    return "Hello from Lua!"
}

# Set an option with RGB color
set-option global ui_options \
    ncurses_assistant=cat \
    ncurses_status_on_top=yes

# Define a hook
hook global WinCreate .*\.cc %{
    add-highlighter window/ number-lines -relative
    set-option window tabstop 4
}
```

## Testing

This project includes a Shiki-based test harness to validate the grammar.

### Setup

```bash
# Install dependencies (already done via bun init)
bun install

# Run the grammar test
bun run test-grammar.ts
```

### What the Test Does

The test script (`test-grammar.ts`):
1. Loads the `kak.tmLanguage.json` grammar file
2. Creates a Shiki highlighter with the custom grammar
3. Highlights the example code in `example.kak`
4. Generates HTML output for visual inspection
5. Tests individual syntax constructs

### Test Output

- `highlighted-output.html` - Full HTML page with highlighted code
- `highlighted-code.html` - Just the highlighted code block
- Console output with token statistics and construct test results

### View Results

Open `highlighted-output.html` in a browser to see the syntax highlighting:

```bash
open highlighted-output.html  # macOS
# OR
xdg-open highlighted-output.html  # Linux
```

## Development

The grammar was created based on:
- Kakoune's official syntax specification (`rc/filetype/kakrc.kak`)
- The markdown grammar's embedded language patterns
- TextMate grammar best practices

### Testing with Shiki

Shiki is a powerful syntax highlighter that uses TextMate grammars. To test with Shiki:

```typescript
import { createHighlighter } from 'shiki';
import kakGrammar from './kak.tmLanguage.json';

const highlighter = await createHighlighter({
  langs: [kakGrammar, 'bash', 'lua', 'python'],
  themes: ['github-dark'],
});

const html = highlighter.codeToHtml(code, {
  lang: 'kak',
  theme: 'github-dark',
});
```

## License

This grammar is provided as-is for use in any project supporting TextMate grammars.
