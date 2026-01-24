const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const basePath = path.resolve(__dirname); // Ajuste se precisar, ou informe a pasta principal aqui
const folders = [
  "m",
  "f"
];

async function copyFolder(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyFolder(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function convertPngToWebp(folder) {
  const files = fs.readdirSync(folder);
  for (const file of files) {
    const fullPath = path.join(folder, file);
    if (fs.statSync(fullPath).isFile() && path.extname(file).toLowerCase() === '.png') {
      const outputFile = path.join(folder, path.basename(file, '.png') + '.webp');
      await sharp(fullPath)
        .webp({ quality: 80 })
        .toFile(outputFile);
      // Opcional: apagar o arquivo PNG original depois da conversão
      fs.unlinkSync(fullPath);

      console.log(`Convertido: ${fullPath} -> ${outputFile}`);
    }
  }
}

async function main() {
  for (const folder of folders) {
    const mFolder = path.join(basePath, folder, 'm');

    if (fs.existsSync(mFolder)) {
      console.log(`Processando pasta: ${mFolder}`);

      // Converter PNG para WebP
      await convertPngToWebp(mFolder);

    } else {
      console.log(`Pasta não encontrada: ${mFolder}`);
    }
  }
  console.log('Processo finalizado.');
}

main().catch(console.error);
