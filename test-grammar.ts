import { createHighlighter } from 'shiki';
import { codeToHast } from 'shiki/core';
import { readFileSync } from 'node:fs';

// Load the Kakoune grammar
const kakGrammar = JSON.parse(readFileSync('./kak.tmLanguage.json', 'utf-8'));

// Example Kakoune script to test
const exampleCode = readFileSync('./example.kak', 'utf-8');

async function testGrammar() {
  console.log('Testing Kakoune Script Grammar with Shiki...\n');
  console.log('Grammar name:', kakGrammar.name);
  console.log('Grammar scopeName:', kakGrammar.scopeName);

  // Create highlighter with custom grammar
  // According to docs: langs array can contain grammar objects directly
  const highlighter = await createHighlighter({
    langs: [
      'bash',
      'lua', 
      'python',
      'javascript',
      'ruby',
      'perl',
      kakGrammar,  // Load custom grammar directly
    ],
    themes: ['github-dark', 'github-light'],
  });

  // Generate highlighted HTML
  const html = highlighter.codeToHtml(exampleCode, {
    lang: 'kak',  // This matches kakGrammar.name
    theme: 'github-dark',
  });

  // Write the HTML output
  const htmlOutput = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Kakoune Script Syntax Test</title>
  <style>
    body {
      font-family: 'SF Mono', Monaco, 'Courier New', monospace;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #0d1117;
      color: #c9d1d9;
    }
    h1 {
      color: #58a6ff;
      border-bottom: 2px solid #30363d;
      padding-bottom: 10px;
    }
    pre {
      background: #161b22;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      border: 1px solid #30363d;
    }
    .info {
      background: #238636;
      color: white;
      padding: 10px 15px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <h1>Kakoune Script Syntax Highlighting Test</h1>
  <div class="info">
    ✓ Grammar loaded successfully: ${kakGrammar.displayName || kakGrammar.name} (${kakGrammar.scopeName})
  </div>
  <pre><code>${html.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
  <hr>
  <h2>Raw HTML Output</h2>
  <pre>${html.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;

  // Save HTML output
  const outputPath = './highlighted-output.html';
  await Bun.write(outputPath, htmlOutput);
  console.log(`\n✓ HTML output saved to: ${outputPath}`);

  // Also save just the highlighted code
  const codeOnlyPath = './highlighted-code.html';
  await Bun.write(codeOnlyPath, html);
  console.log(`✓ Highlighted code saved to: ${codeOnlyPath}`);

  // Method 2: Using codeToHast for AST output
  console.log('\n--- Testing codeToHast ---');
  const hast = highlighter.codeToHast(exampleCode, {
    lang: 'kak',
    theme: 'github-dark',
  });

  // Count tokens by type
  const tokenCount = countTokens(hast);
  console.log('\nToken statistics:');
  for (const [type, count] of Object.entries(tokenCount).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }

  // Test specific constructs
  console.log('\n--- Testing Specific Constructs ---');
  testSpecificConstructs(highlighter);

  console.log('\n✓ All tests completed successfully!');
  console.log('\nOpen highlighted-output.html in a browser to see the result.');
}

interface HastNode {
  type: string;
  properties?: {
    class?: string | string[];
  };
  children?: HastNode[];
}

function countTokens(node: HastNode, counts: Record<string, number> = {}): Record<string, number> {
  if (node.type === 'element' && node.properties?.class) {
    const classes = Array.isArray(node.properties.class) 
      ? node.properties.class 
      : [node.properties.class];
    for (const cls of classes) {
      counts[cls] = (counts[cls] || 0) + 1;
    }
  }
  if (node.children) {
    for (const child of node.children) {
      countTokens(child, counts);
    }
  }
  return counts;
}

interface Highlighter {
  codeToHtml: (code: string, options: { lang: string; theme: string }) => string;
}

function testSpecificConstructs(highlighter: Highlighter) {
  const tests = [
    { name: 'Comment', code: '# This is a comment' },
    { name: 'Single-quoted string', code: "echo 'hello world'" },
    { name: 'Double-quoted string', code: 'echo "hello world"' },
    { name: 'Shell expansion', code: '%sh{ echo hello }' },
    { name: 'Option expansion', code: '%opt{tabstop}' },
    { name: 'Value expansion', code: '%val{session}' },
    { name: 'Keyword', code: 'define-command' },
    { name: 'Attribute', code: 'global' },
    { name: 'Type', code: 'int' },
    { name: 'Value', code: 'rgb:ff0000' },
    { name: 'Lua embedding', code: 'lua %{ return "hello" }' },
    { name: 'Number', code: '42' },
  ];

  console.log('\nIndividual construct tests:');
  for (const test of tests) {
    try {
      const html = highlighter.codeToHtml(test.code, {
        lang: 'kak',
        theme: 'github-dark',
      });
      const hasHighlight = html.includes('<span');
      console.log(`  ${hasHighlight ? '✓' : '✗'} ${test.name}: "${test.code.substring(0, 40)}${test.code.length > 40 ? '...' : ''}"`);
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      console.log(`  ✗ ${test.name}: ERROR - ${error.message}`);
    }
  }
}

// Run the test
testGrammar().catch(console.error);
