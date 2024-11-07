
import { join } from 'path';
import { parse } from '@vue/compiler-sfc';
import fs from 'fs';
import { promises as fsPromises } from 'fs';

// Function to parse a single Vue file and extract key parts
function parseVueFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = parse(content);
  
    return {
        filePath,
        template: parsed.descriptor.template?.content,
        script: parsed.descriptor.script?.content,
        props: parsed.descriptor.script?.content.match(/props: {([^}]+)}/)?.[1],
        methods: parsed.descriptor.script?.content.match(/methods: {([^}]+)}/)?.[1],
    };
}

// Function to recursively traverse directories and parse .vue files
async function parseAllVueFiles(dir) {
    const results = [];

  try {
    // Read the directory contents
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = join(dir, file);

try {
  const stats = await fsPromises.stat(filePath);
        
  if (stats.isDirectory()) {
          results.push(...await parseAllVueFiles(filePath));
        } else if (file.endsWith('.vue')) {
            try {
                const parsed = parseVueFile(filePath);
                results.push(parsed);
            } catch (error) {
                console.error(`Error parsing ${filePath}:`, error.message);
            }
        }
      } catch (error) {
        console.error('Error checking directory:', error);
        }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    }

    return results;
}

// Specify the root directory of your project
const rootDir = './'; // Change this to the root folder of your Vue project

// Parse all Vue files
async function main() {
  try {
    const allParsedFiles = await parseAllVueFiles(rootDir);
const outputFilePath = './parsed_vue_files.json'; // Path to save the JSON file
    
fs.writeFileSync(outputFilePath, JSON.stringify(allParsedFiles, null, 2), 'utf8');
console.log(`Parsed data has been saved to ${outputFilePath}`);
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

main();