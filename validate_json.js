
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend/data/listening-tests/test-3.json');

try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    console.log('JSON is valid');
} catch (e) {
    console.error('JSON is INVALID:', e.message);
}
