#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs';
import minimist from 'minimist';

const globalIgnores = ['node_modules', '.git', 'yarn.lock', 'package-lock.json'];
const extensionsIgnores = [
  'tif',
  'tiff',
  'bmp',
  'jpg',
  'jpeg',
  'gif',
  'png',
  'eps',
  'raw',
  'cr2',
  'nef',
  'orf',
  'sr2',
  'mp4',
];

const extensionRegexMatch = /[^\\]*\.(\w+)$/;

const warning = chalk.keyword('orange');
const success = chalk.bold.keyword('green');
const info = chalk.keyword('white');

function getFiles(dir: string, ignores: string[], cwd: string, appendFiles_?: string[]) {
  const files_ = appendFiles_ || [];
  const files = fs.readdirSync(dir);

  const relativeDir = dir.replace(cwd, '');

  const matchIgnoredDirectory = ignores.filter((ignore) => relativeDir.includes(ignore));

  if (matchIgnoredDirectory.length > 0) {
    return files_;
  }

  for (const i in files) {
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

  const debug = commands.debug;

  const log = debug
    ? (...args: unknown[]) => console.log(...args, '\n')
    : () => {
        //doing nothing
      };

  let gitIgnores = [];

  try {
    log(info('Looking for git ignore file'));
    gitIgnores = fs.readFileSync('.gitignore').toString().split('\n');
  } catch {
    log(warning('Could not find a gitignore file'));
  }

  const ignoreDirs =
    commands.di || commands.dontIgnore
      ? []
      : commands.i || commands.ignore
      ? [...globalIgnores, ...gitIgnores, ...(commands.i || commands.ignore || [])]
      : [...globalIgnores, ...gitIgnores];

  const ignoreExtensions = [
    ...extensionsIgnores,
    ...(commands.e || commands.extensionsIgnores || []),
  ];

  log(info(`Directories and files that will ignored`, ignoreDirs));
  log(info(`Files with extensions that will be ignored`, ignoreExtensions));

  const outputFile = commands.o || commands.output || 'output.txt';

  const files = getFiles(currentDir, ignoreDirs, currentDir);

  log(info(`List of files found\n`, files.join('\n')));

  log(info(`Removing files that match ignores`));

  log(info(`Removing files that match extensions`));

  const filteredFiles = files
    .filter((file) => !ignoreDirs.includes(file.replace(currentDir, '').substring(1)))
    .filter((file) => !ignoreExtensions.includes(file.match(extensionRegexMatch)[1]));

  log(info(`Outputting to file`, outputFile));

  try {
    fs.unlinkSync(outputFile);
  } catch {
    log(info('Removing current output file failed'));
  }

  const writeStream = fs.createWriteStream(outputFile, { flags: 'a' });

  filteredFiles.forEach((file) => {
    const content = fs.readFileSync(file);

    writeStream.write(`File: ${file.replace(currentDir, '').substring(1)}\n\n${content}\n\n`);
  });

  console.log(success(`Your output is in ${outputFile}`));
};

main();
