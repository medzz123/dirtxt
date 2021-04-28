# Convert your project code into one txt file

### How to use

1. Make sure you have node installed in the system https://nodejs.org/en/
2. Go to the root folder of your project
3. Run `npx dirtxt`

### Commands available

| Commands                  |              Description              |              Usage |
| ------------------------- | :-----------------------------------: | -----------------: |
| --debug                   |     Adds debug logs while running     |                n/a |
| --di or --dontIgnore      | Doesn't ignore any directory or file  |                n/a |
| --i or --ignore           | Ignores directories or files inputted | --i={dir,one,file} |
| --e or --extensionsIgnore |      Ignores extensions inputted      |  --e={png,jpg,mp4} |
| --o or --output           | Output file, default is `output.txt`  |  --o somewhere.txt |


#### Default settings
- Directories and files ignored by default: node_modules, .git, yarn.lock, package-lock.json
- Extensions ignored by default: tif, tiff, bmp, jpg, jpeg, gif, png, eps, raw, cr2, nef, orf, sr2, mp4
- Reads .gitignore file if it exits and ignores all the directories and files listed there
- Outputs by default to output.txt
