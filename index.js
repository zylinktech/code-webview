const express = require('express');
const fs = require('fs');
const path = require('path');
const hljs = require('highlight.js'); // Syntax highlighting
const app = express();
const port = 3000;

// Serve static files (such as .js, .html) for the client
app.use(express.static('public'));

// Serve the highlighted code with dark background
app.get('/:file', (req, res) => {
  const filePath = path.join(__dirname, req.params.file);

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fileExtension = path.extname(filePath).slice(1); // Get the file extension
    const language = hljs.getLanguage(fileExtension) ? fileExtension : 'plaintext'; // Detect language

    const highlightedCode = hljs.highlight(language, fileContent).value; // Apply the detected language

    // Check if the request is from curl (i.e., it's asking for only code content, not HTML)
    if (req.headers['user-agent'] && req.headers['user-agent'].includes('curl')) {
      // If it's a curl request, just send the raw highlighted code content (without HTML)
      res.type('text/plain').send(fileContent); // This sends the raw code (no HTML)
    } else {
      // For browser requests, return the full HTML with highlighted code
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${req.params.file}</title>
          <style>
            body {
              background-color: #161616;
              color: white;
              font-family: monospace;
              padding: 20px;
            }

            pre {
              background-color: #080808;
              color: white;
              padding: 20px;
              overflow: auto;
              border: none;
            }

            code {
              font-size: 16px;
              white-space: pre-wrap;
            }

            .hljs {
              background-color: #080808;
              color: #f8f8f2;
            }

            /* Highlighting for general elements */
            .hljs-tag {
              color: #e06c75;
            }

            .hljs-attribute {
              color: #56b6c2;
            }

            .hljs-doctag {
              color: #98c379;
            }

            .hljs-string {
              color: #98c379;
            }

            .hljs-comment {
              color: #7f8c8d;
            }

            .hljs-keyword {
              color: #c678dd;
            }

            .hljs-variable {
              color: #d19a66;
            }

            .hljs-function {
              color: #61afef;
            }

            .hljs-number {
              color: #d19a66;
            }

            .hljs-selector-tag {
              color: #e06c75;
            }

            .hljs-title {
              color: #e5c07b;
            }

            .hljs-built_in {
              color: #56b6c2;
            }

            .hljs-class .hljs-title {
              color: #98c379;
            }

            .hljs-type {
              color: #c678dd;
            }

            .hljs-symbol {
              color: #d19a66;
            }

            .hljs-punctuation {
              color: #f8f8f2;
            }

            .hljs-section {
              color: #e5c07b;
            }

            .hljs-link {
              color: #61afef;
            }

            /* Styling for inline elements like bold/italic in text */
            .hljs-emphasis {
              font-style: italic;
            }

            .hljs-strong {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <pre><code class="hljs">${highlightedCode}</code></pre>
        </body>
        </html>
      `);
    }
  } else {
    res.status(404).send('File not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
