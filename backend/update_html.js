const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'public');

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        
        content = content.replace(/azadplyfurniture@gmail\.com/g, 'azadplyfurnitures@gmail.com');
        content = content.replace(/munmunazad14@gmail\.com/g, 'azadplyfurnitures@gmail.com');
        
        content = content.replace(/123 Hardware Street, Build City/g, 'Nagepur Sakaldiha, Chandauli');
        
        if(content.includes('Nagepur Sakaldiha, Chandauli') && !content.includes('9 AM to 8 PM')) {
            content = content.replace(/<li><span style="color: var\(--primary\);">📍<\/span> Nagepur Sakaldiha, Chandauli<\/li>/g, 
                '<li><span style="color: var(--primary);">📍</span> Nagepur Sakaldiha, Chandauli</li>\n          <li><span style="color: var(--primary);">🕒</span> 9 AM to 8 PM</li>');
        }

        if (!content.includes('href="/images/logo.png"')) {
            content = content.replace(/<\/title>/g, '</title>\n  <link rel="icon" type="image/png" href="/images/logo.png">');
        }

        fs.writeFileSync(path.join(dir, file), content);
    }
});
console.log('HTML files updated!');
