import { promises as fs } from 'fs';
import { join } from 'path';
import { parse } from '@vue/compiler-sfc';
import { fs } from 'fs';

// Pre-compile regex patterns
const PATTERNS = {
    props: /defineProps\(([^)]+)\)/,
    emits: /defineEmits\(([^)]+)\)/,
    computed: /computed\(([^)]+)\)/g,
    watch: /watch\(([^)]+)\)/g,
    ref: /const\s+(\w+)\s*=\s*ref\(/g,
    reactive: /const\s+(\w+)\s*=\s*reactive\(/g,
    methods: /function\s+(\w+)/g
};

function normalizeLineEndings(content) {
    return content.replace(/\r\n/g, '\n');
}

function extractMatches(content, pattern, isGlobal = false) {
    if (!isGlobal) {
        const match = content.match(pattern);
        return match ? match[1] : '';
    }
    return Array.from(content.matchAll(pattern), match => match[1]);
}
  async function parseVueFile(filePath) {
      try {
          const content = normalizeLineEndings(await fs.readFile('../src/components/HouseList.vue', 'utf8'));
          const parsed = parse(content);
          const scriptContent = normalizeLineEndings(
              parsed.descriptor.scriptSetup?.content || 
              parsed.descriptor.script?.content || 
              ''
          );

          // Improved structure with better organization
          return {
              filePath: filePath.replace(/^\.\.\//, ''),
              components: {
                  template: parsed.descriptor.template?.content || '',
                  script: scriptContent,
                  composition: {
                      props: extractMatches(scriptContent, PATTERNS.props).trim(),
                      emits: extractMatches(scriptContent, PATTERNS.emits).trim(),
                      computed: extractMatches(scriptContent, PATTERNS.computed, true).filter(Boolean),
                      watchers: extractMatches(scriptContent, PATTERNS.watch, true).filter(Boolean),
                      state: {
                          reactive: extractMatches(scriptContent, PATTERNS.reactive, true).filter(Boolean),
                          refs: extractMatches(scriptContent, PATTERNS.ref, true).filter(Boolean)
                      },
                      methods: extractMatches(scriptContent, PATTERNS.methods, true).filter(Boolean)
                  }
              }
          };
      } catch (error) {
          console.error(`Error parsing ${filePath}:`, error);
          return null;
      }
  }
async function* walkDirectory(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
        const filePath = join(dir, file).replace(/\\/g, '/'); // Normalize path separators
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            yield* walkDirectory(filePath);
        } else if (file.endsWith('.vue')) {
            yield filePath;
        }
    }
}
async function parseAllVueFiles(dir) {
    const results = [];
    try {
        for await (const filePath of walkDirectory(dir)) {
            const parsed = await parseVueFile(filePath);
            if (parsed) results.push(parsed);
        }
    } catch (error) {
        console.error(`Error processing directory ${dir}:`, error);
    }

    return results;
}

async function main() {
    try {
        const rootDir = '../src/components/';
        const allParsedFiles = await parseAllVueFiles(rootDir);
         fs.writeFile(
            'parsedVueComponents.json', 
            JSON.stringify(allParsedFiles, null, 2)
        );
        console.log("Generated parsedVueComponents.json");
    } catch (error) {
        console.error("Failed to process Vue files:", error);
    }
};

main();