const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'public');

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');

        if (!content.includes('<link rel="icon"')) {
            content = content.replace(/<\/title>/g, '</title>\n  <link rel="icon" type="image/png" href="/images/logo.png">');
        }

        fs.writeFileSync(path.join(dir, file), content);
    }
});
console.log('Favicons updated!');
