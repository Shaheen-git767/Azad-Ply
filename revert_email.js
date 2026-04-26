const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'public');

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        content = content.replace(/azadplyfurnitures@gmail\.com/g, 'azadplyfurniture@gmail.com');
        fs.writeFileSync(path.join(dir, file), content);
    }
});

let serverContent = fs.readFileSync('./server.js', 'utf8');
serverContent = serverContent.replace(/azadplyfurnitures@gmail\.com/g, 'azadplyfurniture@gmail.com');
fs.writeFileSync('./server.js', serverContent);

console.log('Email reverted to azadplyfurniture@gmail.com successfully!');
