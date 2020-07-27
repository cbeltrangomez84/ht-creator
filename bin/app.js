#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');

const ARG_NAME = 2;
let TEMPLATE_NAME;
let TEMPLATE_PASCAL_NAME;

let new_name;
let new_pascal_name;

async function replaceTemplate(path) {

   if(fs.existsSync(path)) {
      let fileStr = fs.readFileSync(path,{encoding:'utf8', flag:'r'});
      fileStr = fileStr.replace(new RegExp(TEMPLATE_NAME,"g"),new_name)
                        .replace(new RegExp(TEMPLATE_PASCAL_NAME,"g"),new_pascal_name);
   
      let newPath = path.replace(TEMPLATE_NAME,new_name);
   
      console.log(chalk.blue('Convirtiendo'),chalk.yellow(path),chalk.green("-->"),chalk.yellow(newPath));
   
      fs.writeFileSync(path, fileStr);
      fs.renameSync(path, newPath);
   }
   else {
      console.log(chalk.red('Ignorando'), chalk.yellow(path),chalk.red("NO EXISTE"));
   }
}

async function main() {

   let files = fs.readdirSync("./");
   
   //Toma el nombre del html
   files.some(currentFile => {
      if(currentFile.endsWith("html")) {
         TEMPLATE_NAME = currentFile.match(/^(.*?)\./)[1]         
         return true;
      }
   })

   if(process.argv.length<ARG_NAME+1) {
      console.log(chalk.red('Debes ingresar como argumento el nuevo nombre del componente (new-name)'));
      return;
   }
   
   TEMPLATE_PASCAL_NAME = TEMPLATE_NAME.toPascalCase();
   new_name = process.argv[ARG_NAME];
   new_pascal_name = new_name.toPascalCase();

   replaceTemplate(`./${TEMPLATE_NAME}.module.ts`);
   replaceTemplate(`./${TEMPLATE_NAME}.component.ts`);
   replaceTemplate(`./${TEMPLATE_NAME}.component.spec.ts`);
   replaceTemplate(`./${TEMPLATE_NAME}.component.scss`);
   replaceTemplate(`./${TEMPLATE_NAME}.component.html`);   
}

String.prototype.toPascalCase = function(str) {
   return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toUpperCase() : word.toUpperCase();
    }).replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
}

main();