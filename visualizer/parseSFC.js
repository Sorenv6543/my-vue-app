// parseSFC.js
import { readFileSync, readdirSync, statSync } from 'fs';
import { basename, join } from 'path';
import { parse } from '@vue/compiler-sfc';
import { parse as _parse } from '@babel/parser';
import { promises as fs } from 'fs';
/**
 * Parse Vue SFC to extract components and methods.
 */
function parseVueComponent(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const { descriptor } = parse(content);

  // Basic component details
  const componentDetails = {
    name: basename(filePath, '.vue'),
    props: [],
    methods: [],
    imports: []
  };

  // Parse script section
  if (descriptor.script) {
    const scriptContent = descriptor.script.content;
    const ast = _parse(scriptContent, { sourceType: 'module', plugins: ['typescript'] });

    ast.program.body.forEach((node) => {
      if (node.type === 'ImportDeclaration') {
        componentDetails.imports.push(node.source.value);
      }
      if (node.type === 'ExportDefaultDeclaration') {
        node.declaration.properties.forEach((prop) => {
          if (prop.key.name === 'props') {
            componentDetails.props = prop.value.properties.map((p) => p.key.name);
          }
          if (prop.key.name === 'methods') {
            componentDetails.methods = prop.value.properties.map((m) => m.key.name);
          }
        });
      }
    });
  }

  return componentDetails;
}

/**
 * Recursively parse components in a directory
 */
function parseComponents(dir) {
  const files = readdirSync(dir);
  const components = [];

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      components.push(...parseComponents(filePath));
    } else if (file.endsWith('.vue')) {
      components.push(parseVueComponent(filePath));
    }
  });

  return components;
}

// Example Usage
const components = parseComponents('../src/components');
console.log(JSON.stringify(components, null, 2));
fs.writeFile(
  'parsedVueComponents.json', 
  JSON.stringify(components, null, 2)
);

const app = Vue.createApp({
  // your Vue app definition
});
app.mount('#app');