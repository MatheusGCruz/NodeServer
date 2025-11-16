const fs = require('fs');
const path = require('path');

const getTelegramConfig = require('./../dataFunctions/telegramConfig')
const telegramConfig = getTelegramConfig()

const metadataFolder = telegramConfig.metadataFolder;
const tempFolder = telegramConfig.tempFolder;

async function clearDownloadDirectory() {
  const files = await fs.promises.readdir(tempFolder);

  console.log("Donwload Files count: "+files.length);
  for (const file of files) {
    const filePath = path.join(tempFolder, file);
    const stat = await fs.promises.lstat(filePath);

    if (stat.isDirectory()) {
      await fs.promises.rm(filePath, { recursive: true, force: true });
    } else {
      await fs.promises.unlink(filePath);
    }
  }

  console.log("Download directory cleaned.");
}

async function clearMetadataDirectory() {
    const files = await fs.promises.readdir(metadataFolder);
  
    console.log("Metadata Files count: "+files.length);
    for (const file of files) {
      const filePath = path.join(metadataFolder, file);
      const stat = await fs.promises.lstat(filePath);
  
      if (stat.isDirectory()) {
        await fs.promises.rm(filePath, { recursive: true, force: true });
      } else {
        await fs.promises.unlink(filePath);
      }
    }

    console.log("Metadata directory cleaned.");
  }

  module.exports = { clearDownloadDirectory , clearMetadataDirectory};