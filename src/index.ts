#!/usr/bin/env node

import fs from 'fs';
import minimist from 'minimist';

const globalIgnores = ['node_modules', '.git', 'yarn.lock', 'package-lock.json'];

function getFiles(dir: string, ignores: string[], cwd: string, appendFiles_?: string[]) {
  const files_ = appendFiles_ || [];
  const files = fs.readdirSync(dir);

  const relativeDir = dir.replace(cwd, '');

  const matchIgnoredDirectory = ignores.filter((ignore) => relativeDir.includes(ignore));

  if (matchIgnoredDirectory.length > 0) {
    return files_;
  }

  for (const i in files) {
    const matchIgnore = ignores.filter((ignore) => files[i] === ignore);

    if (matchIgnore.length > 0) {
      continue;
    }

    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, ignores, cwd, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

const main = () => {
  const commands = minimist(process.argv);

  const currentDir = process.cwd();

  let gitIgnores = [];

  try {
    gitIgnores = fs.readFileSync('.gitignore').toString().split('\n');
  } catch {
    console.warn('Skipping .gitignore as we did not find one');
  }

  console.log(gitIgnores);

  const ignoreDirs =
    commands.di || commands.dontIgnore
      ? []
      : commands.i || commands.ignore
      ? [...globalIgnores, ...gitIgnores, ...(commands.i || commands.ignore)]
      : [...globalIgnores, ...gitIgnores];

  const outputFile = commands.o || commands.output || 'output.txt';

  const files = getFiles(currentDir, ignoreDirs, currentDir);

  fs.writeFileSync(outputFile, '');

  const writeStream = fs.createWriteStream(outputFile, { flags: 'a' });

  files.forEach((file) => {
    const content = fs.readFileSync(file);

    writeStream.write(`File: ${file.replace(currentDir, '').substring(1)}\n\n${content}\n\n`);
  });

  console.log(`Your output is in ${outputFile}`);
};

main();
