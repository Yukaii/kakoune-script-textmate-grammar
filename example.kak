# Example Kakoune Script for Testing Syntax Highlighting
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

# Shell expansion with different delimiters
echo %sh{echo "shell with braces"}
echo %sh(echo "shell with parens")
echo %sh[echo "shell with brackets"]
echo %sh<echo "shell with angles">

# Option expansion
echo %opt{tabstop}
echo %opt{BOM}

# Value expansion
echo %val{session}
echo %val{client}
echo %val{bufname}
echo %val{buffile}
echo %val{cursor_line}
echo %val{cursor_column}
echo %val{selection}
echo %val{selections}
echo %val{selection_desc}
echo %val{selection_count}
echo %val{window_width}
echo %val{window_height}
echo %val{version}
echo %val{hook_param}
echo %val{hook_param_capture_1}

# Register expansion
echo %reg{/}
echo %reg{slash}

# Argument expansion
echo %arg{1}
echo %arg{@}

# File expansion
echo %file{/etc/passwd}

# Recursive expansion
echo %exp{...}

# Raw strings (no expansion)
echo %{this is a raw string with no expansion}
echo %|this is also a raw string|

# Shell-script completion
-complete-command edit file
evaluate-commands %sh{
    echo "Shell code with kak_ variables:"
    echo "Buffer: $kak_bufname"
    echo "File: $kak_buffile"
    echo "Session: $kak_session"
    echo "Selection: $kak_selection"
}

# Embedded Languages
# ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾

# Lua embedding
lua %{
    local name = "Kakoune"
    return "Hello from " .. name .. "!"
}

# Python embedding
python %{
    import os
    return f"Current directory: {os.getcwd()}"
}

# JavaScript embedding
javascript %{
    const version = "1.0";
    return `JavaScript ${version}`;
}

# Ruby embedding
ruby %{
    puts "Hello from Ruby!"
    "return value"
}

# Perl embedding
perl %{
    my $var = "Perl";
    return "Hello from $var!";
}

# Keywords
# ‾‾‾‾‾‾‾‾

# Core commands
add-highlighter global/my_highlight regex \w+ 0:default
alias global myalias mycmd
arrange-buffers
buffer-next
buffer-previous
catch %{
    echo "Error caught"
}
change-directory %sh{pwd}
colorscheme default
declare-option str myopt "value"
declare-user-mode mymode
define-command -params 1.. -docstring "My command" my-cmd %{
    echo %arg{1}
}
delete-buffer
echo "Hello, World!"
edit ~/.config/kak/kakrc
evaluate-commands %{
    echo "Evaluated"
}
execute-keys gt
fail "Error message"
hook global WinCreate .* %{
    echo "Window created"
}
info "Some information"
kill
map global normal <key> <command>
nop
on-key %{
    echo %val{key}
}
prompt -shell-script-candidates %{ ls } filename %{
    edit %val{text}
}
provide-module mymodule %{
    # module code
}
quit
remove-highlighter global/my_highlight
remove-hooks global my-hooks
require-module mymodule
select 1.1,1.2
set-face global MyFace rgb:ff0000
set-option global myopt newvalue
set-register a "content"
source ~/.config/kak/myconfig.kak
trigger-user-hook MyHook
try %{
    # something that might fail
} catch %{
    # handle error
}
unalias global myalias
unmap global normal <key>
write
write-quit
update-option global myopt

# Attributes and Types
# ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
set-option global int myint 42
set-option global bool mybool yes
set-option global str mystr "text"
set-option global regex myregex \w+
declare-option int-list mylist
declare-option str-list mystrlist
declare-option completions mycomps
declare-option line-specs mylines
declare-option range-specs myranges
declare-option str-to-str-map mymap

# Scope attributes
set-option global myopt value
set-option buffer myopt value
set-option window myopt value

# Values
# ‾‾‾‾‾‾
set-face global Keyword rgb:ff0000
set-face global Keyword rgb:00ff00
set-face global Keyword rgb:0000ff
set-face global Keyword black
set-face global Keyword red
set-face global Keyword green
set-face global Keyword yellow
set-face global Keyword blue
set-face global Keyword magenta
set-face global Keyword cyan
set-face global Keyword white
set-option global mybool yes
set-option global mybool no
set-option global mybool true
set-option global mybool false

# Switches
# ‾‾‾‾‾‾‾‾
define-command -params 1 -override -hidden -docstring "desc" mycmd %{}
define-command -params 1..3 -file-completion -client-completion -buffer-completion mycmd %{}
define-command -params 1 -shell-script-completion %{ echo a b c } mycmd %{}
define-command -params 1 -shell-script-candidates %{ echo a b c } mycmd %{}
hook -group mygroup -once -always global WinCreate .* %{}
set-option -add global mylist item
set-option -remove global mylist item
set-option -update global myopt

# Numbers and Colors
# ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
echo 42
echo 12345
set-face global Keyword rgb:ff0000
set-face global Keyword rgb:00ff00
set-face global Keyword rgba:ff000080

# Complex Example from kakrc.kak
# ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
hook global WinSetOption filetype=kak %{
    require-module kak
    
    set-option window static_words %opt{kak_static_words}
    
    hook window InsertChar \n -group kak-insert kak-insert-on-new-line
    hook window InsertChar \n -group kak-indent kak-indent-on-new-line
    hook window InsertChar [>)\}\]] -group kak-indent kak-indent-on-closing-matching
    hook window InsertChar (?![[{(<>)\}\]])[^\s\w] -group kak-indent kak-indent-on-closing-char
    
    hook -once -always window WinSetOption filetype=.* %{ remove-hooks window kak-.+ }
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
        try %{ execute-keys -draft k x <a-k> \%\w*[^\s\w]$ <ret> j <a-gt> }
        try %_ execute-keys -draft -itersel x <a-k> ^\h*([>)\}\]]) <ret> gh / <c-r>1 <ret> m <a-S> 1<a-&> _
        try %{ execute-keys -draft -itersel x <a-k> ^\h*([^\s\w]) <ret> gh / <c-r>1 <ret> <a-?> <c-r>1 <ret> <a-T>% <a-k> \w*<c-r>1$ <ret> <a-S> 1<a-&> }
    =
~
