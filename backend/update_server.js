const fs = require('fs');

let serverCode = fs.readFileSync('./server.js', 'utf8');

const productsArrayRegex = /const products = \[[\s\S]*?\];/;
const newProductsArray = `const products = [
    { name: 'Green Ply 18mm Commercial', price: 1800, category: 'Green Ply', image: '/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
    { name: 'Green Ply 19mm Marine (BWP)', price: 2450, category: 'Green Ply', image: '/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
    { name: 'Green Ply 12mm Commercial', price: 1200, category: 'Green Ply', image: '/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
    { name: 'Green Ply 6mm Flexible', price: 850, category: 'Green Ply', image: '/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
    { name: 'Century Ply 18mm Marine', price: 2600, category: 'Ply', image: '/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
    { name: 'Century Ply 12mm BWP', price: 1500, category: 'Ply', image: '/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
    { name: 'Local Plywood 18mm MR', price: 1400, category: 'Ply', image: '/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
    { name: 'Block Board 19mm Pine', price: 1950, category: 'Ply', image: '/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
    { name: 'MDF Board 18mm', price: 1100, category: 'Ply', image: '/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
    { name: 'Particle Board 18mm', price: 800, category: 'Ply', image: '/images/cat_plywood_1777179257274.png', sizeDescription: '8x4 sqft' },
    { name: 'Merino 1mm High Gloss Laminate', price: 1250, category: 'Mica', image: '/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
    { name: 'Merino 1mm Matte Finish Laminate', price: 1100, category: 'Mica', image: '/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
    { name: 'Greenlam 1mm Texture Laminate', price: 1350, category: 'Mica', image: '/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
    { name: 'Greenlam 0.8mm Wood Grain', price: 850, category: 'Mica', image: '/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
    { name: 'Sunmica 1mm Solid Color', price: 950, category: 'Mica', image: '/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
    { name: 'Sunmica 0.8mm White', price: 700, category: 'Mica', image: '/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
    { name: 'CenturyLaminates 1mm Metallic', price: 1500, category: 'Mica', image: '/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
    { name: 'CenturyLaminates 0.8mm Fabric', price: 900, category: 'Mica', image: '/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
    { name: 'Virgo 1mm Digital Print', price: 1800, category: 'Mica', image: '/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
    { name: 'Virgo 0.8mm Gloss', price: 800, category: 'Mica', image: '/images/cat_mica_1777179353524.png', sizeDescription: '8x4 sqft' },
    { name: 'Fevicol SH Marine 1kg', price: 420, category: 'Fevicol', image: '/images/fevicol_1777180710788.png', sizeDescription: '1 Kg Bucket' },
    { name: 'Fevicol SH Marine 5kg', price: 1950, category: 'Fevicol', image: '/images/fevicol_1777180710788.png', sizeDescription: '5 Kg Bucket' },
    { name: 'Fevicol HeatX 1L', price: 550, category: 'Fevicol', image: '/images/fevicol_1777180710788.png', sizeDescription: '1 Litre Tin' },
    { name: 'Fevicol SR 998 1L', price: 480, category: 'Fevicol', image: '/images/fevicol_1777180710788.png', sizeDescription: '1 Litre Tin' },
    { name: 'Fevicol Probond 1kg', price: 380, category: 'Fevicol', image: '/images/fevicol_1777180710788.png', sizeDescription: '1 Kg Pack' },
    { name: 'Clear Toughened Glass 12mm', price: 150, category: 'Glass', image: '/images/cat_glass_1777179301984.png', sizeDescription: 'Per Sqft' },
    { name: 'Clear Toughened Glass 10mm', price: 120, category: 'Glass', image: '/images/cat_glass_1777179301984.png', sizeDescription: 'Per Sqft' },
    { name: 'Frosted Glass 8mm', price: 90, category: 'Glass', image: '/images/cat_glass_1777179301984.png', sizeDescription: 'Per Sqft' },
    { name: 'Tinted Grey Glass 10mm', price: 140, category: 'Glass', image: '/images/cat_glass_1777179301984.png', sizeDescription: 'Per Sqft' },
    { name: 'Mirror Glass 5mm', price: 70, category: 'Glass', image: '/images/cat_glass_1777179301984.png', sizeDescription: 'Per Sqft' },
    { name: 'Aluminium Sliding Track 2 Track', price: 150, category: 'Aluminium', image: '/images/cat_alum_1777179318925.png', sizeDescription: 'Per Running Ft' },
    { name: 'Aluminium Sliding Track 3 Track', price: 200, category: 'Aluminium', image: '/images/cat_alum_1777179318925.png', sizeDescription: 'Per Running Ft' },
    { name: 'Aluminium Partition Section', price: 120, category: 'Aluminium', image: '/images/cat_alum_1777179318925.png', sizeDescription: 'Per Running Ft' },
    { name: 'Aluminium Window Interlock', price: 80, category: 'Aluminium', image: '/images/cat_alum_1777179318925.png', sizeDescription: 'Per Running Ft' },
    { name: 'Aluminium Handle Section', price: 90, category: 'Aluminium', image: '/images/cat_alum_1777179318925.png', sizeDescription: 'Per Running Ft' },
    { name: 'Niva Solid Teak Wood Door', price: 12500, category: 'Niva Door', image: '/images/cat_doors_1777179276618.png', sizeDescription: 'Standard 7x3 ft' },
    { name: 'Milenium Flush Door 30mm', price: 4500, category: 'Milenium Door', image: '/images/cat_doors_1777179276618.png', sizeDescription: 'Standard 7x3 ft' },
    { name: 'Membrane Door Carved', price: 5500, category: 'Door', image: '/images/cat_doors_1777179276618.png', sizeDescription: 'Standard 7x3 ft' },
    { name: 'Laminated Flush Door', price: 5000, category: 'Door', image: '/images/cat_doors_1777179276618.png', sizeDescription: 'Standard 7x3 ft' },
    { name: 'PVC Bathroom Door', price: 2200, category: 'Door', image: '/images/cat_doors_1777179276618.png', sizeDescription: 'Standard 7x2.5 ft' },
    { name: 'Tesa Mortise Lock & Handle Set', price: 1850, category: 'Tesa Handle', image: '/images/door_handle_1777180690929.png', sizeDescription: 'Per Set' },
    { name: 'Europa Main Door Lock', price: 2400, category: 'Handle', image: '/images/door_handle_1777180690929.png', sizeDescription: 'Per Piece' },
    { name: 'Godrej Navtal Padlock', price: 850, category: 'Handle', image: '/images/door_handle_1777180690929.png', sizeDescription: 'Per Piece' },
    { name: 'SS Pull Handle 12 inch', price: 600, category: 'Handle', image: '/images/door_handle_1777180690929.png', sizeDescription: 'Per Pair' },
    { name: 'Brass Antique Mortise Handle', price: 2200, category: 'Handle', image: '/images/door_handle_1777180690929.png', sizeDescription: 'Per Set' },
    { name: 'Jaguar Pillar Cock Tap', price: 1250, category: 'Taps', image: '/images/door_handle_1777180690929.png', sizeDescription: 'Per Piece' },
    { name: 'Cera Wall Mixer Set', price: 3500, category: 'Taps', image: '/images/door_handle_1777180690929.png', sizeDescription: 'Per Set' },
    { name: 'Hindware Bib Cock', price: 650, category: 'Taps', image: '/images/door_handle_1777180690929.png', sizeDescription: 'Per Piece' },
    { name: 'Plumber Angle Valve', price: 350, category: 'Taps', image: '/images/door_handle_1777180690929.png', sizeDescription: 'Per Piece' },
    { name: 'Health Faucet Gun with Pipe', price: 800, category: 'Taps', image: '/images/door_handle_1777180690929.png', sizeDescription: 'Per Set' }
];`;

serverCode = serverCode.replace(productsArrayRegex, newProductsArray);
serverCode = serverCode.replace(/azadplyfurniture@gmail\.com/g, 'azadplyfurnitures@gmail.com');
fs.writeFileSync('./server.js', serverCode);
console.log('server.js updated with new products and admin email!');
