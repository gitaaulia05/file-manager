const fs = require('fs');
const path = require('path');

const metadataFilePath = path.join(__dirname, 'fileMetadata.json');

function readMetadata() {
    if (!fs.existsSync(metadataFilePath)) {
        return [];
    }
    const data = fs.readFileSync(metadataFilePath, 'utf8');
    return JSON.parse(data);
}

function writeMetadata(metadata) {
    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
}

function addMetadata(file) {
    const metadata = readMetadata();
    metadata.push(file);
    writeMetadata(metadata);
}

function getAllFiles() {
    return readMetadata();
}

function deleteFileMetadata(fileName) {
    const metadata = readMetadata();
    const updatedMetadata = metadata.filter(file => file.name !== fileName);
    writeMetadata(updatedMetadata);
}

module.exports = { addMetadata, getAllFiles, deleteFileMetadata };