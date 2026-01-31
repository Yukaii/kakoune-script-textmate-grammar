// Example code snippets
const examples = {
  basic: `# Example Kakoune Script for Testing Syntax Highlighting
# This file demonstrates various Kakoune script features

# Comments
# ‾‾‾‾‾‾‾‾‾
# This is a single-line comment

# Strings
# ‾‾‾‾‾‾‾‾
echo 'single-quoted string'
echo "double-quoted string"
echo 'escaped '' quote'
echo "escaped "" quote"

# Expansions (Balanced Strings)
# ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
echo %opt{tabstop}
echo %val{session}
echo %reg{/}
echo %arg{1}

# Define a command
define-command -params 1.. -docstring "My command" my-cmd %{
    echo %arg{1}
}`,

  shell: `# Shell Expansion Examples
# ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾

# Basic shell expansion
echo %sh{echo "Hello from shell"}

# Shell with different delimiters
echo %sh{echo "braces"}
echo %sh(echo "parens")
echo %sh[echo "brackets"]
echo %sh<echo "angles">

# Complex shell script
%sh{
    echo "Current buffer: $kak_bufname"
    echo "Current file: $kak_buffile"
    date +%Y-%m-%d
}

# Shell-script completion
define-command -params 1 -shell-script-completion %{
    echo "option1 option2 option3"
} mycmd %{}`,

  complex: `# Complex Example from kakrc.kak
# ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾

hook global WinSetOption filetype=kak %{
    require-module kak
    
    set-option window static_words %opt{kak_static_words}
    
    hook window InsertChar \n -group kak-insert kak-insert-on-new-line
    hook window InsertChar \n -group kak-indent kak-indent-on-new-line
    
    hook -once -always window WinSetOption filetype=.* %{ 
        remove-hooks window kak-.+ 
    }
}

define-command -hidden kak-insert-on-new-line %~
    evaluate-commands -draft -itersel %=
        try %{ execute-keys -draft k x s ^\h*#\h* <ret> y jgh P }
    =
~

define-command -hidden kak-indent-on-new-line %~
    evaluate-commands -draft -itersel %=
        try %{ execute-keys -draft <semicolon> K <a-&> }
        try %{ execute-keys -draft k x s \h+$ <ret> d }
    =
~`
};

// Initialize the editor
async function initEditor() {
  // Dynamically import modules from CDN
  const [{ createHighlighter }, { shikiToMonaco }] = await Promise.all([
    import('https://esm.sh/shiki@3.22.0'),
    import('https://esm.sh/@shikijs/monaco@3.22.0')
  ]);

  // Load Monaco
  const monaco = await import('https://esm.sh/monaco-editor-core@0.52.0');

  // Load grammar
  const kakGrammar = await fetch('./kak.tmLanguage.json').then(r => r.json());

  // Create highlighter
  const highlighter = await createHighlighter({
    themes: ['github-dark', 'github-light', 'vitesse-dark', 'vitesse-light'],
    langs: [kakGrammar, 'bash', 'lua', 'python', 'javascript'],
  });

  // Register with Monaco
  monaco.languages.register({ id: 'kak' });
  shikiToMonaco(highlighter, monaco);

  // Create editor
  const editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: examples.basic,
    language: 'kak',
    theme: 'github-dark',
    automaticLayout: true,
    minimap: { enabled: true },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    padding: { top: 16 },
  });

  // Theme selector
  const themeSelector = document.getElementById('theme-selector');
  themeSelector.addEventListener('change', (e) => {
    const theme = e.target.value;
    monaco.editor.setTheme(theme);
    
    // Update body class for UI theme
    if (theme.includes('light')) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  });

  // Example selector
  const exampleSelector = document.getElementById('example-selector');
  exampleSelector.addEventListener('change', (e) => {
    const example = examples[e.target.value];
    if (example) {
      editor.setValue(example);
    }
  });

  // Initial theme check
  if (themeSelector.value.includes('light')) {
    document.body.classList.add('light-theme');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEditor);
} else {
  initEditor();
}
