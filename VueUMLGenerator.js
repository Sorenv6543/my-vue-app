/**
 * Class representing a generator for UML diagrams from Vue components.
 * 
 * This class processes Vue component files to extract props, methods, and components,
 * generating a UML representation of the component structure. It supports asynchronous
 * operations for reading files and processing content in parallel.
 */
class VueUMLGenerator {
    /**
     * Creates an instance of VueUMLGenerator.
     * Initializes an empty array to hold UML content.
     */
    constructor() {
        /**
         * @type {string[]} umlContent - Array to hold the generated UML content.
         */
        this.umlContent = [];
    }

    /**
     * Processes a Vue file to extract its UML representation.
     * 
     * @param {string} 'filePath' - The path to the Vue file to be processed.
     * @returns {Promise<void>} A promise that resolves when the file has been processed.
     */

    async processVueFile(filePath) {
        try {
            const fs = await import('fs/promises');
            const { parse } = await import('@vue/compiler-sfc');
            const { basename } = await import('path');
            const content = await fs.readFile(filePath, 'utf-8');
            const { descriptor } = parse(content);
            const componentName = basename(filePath, '.vue'); // Get component name dynamically
            // Add component class
            this.umlContent.push(`class ${componentName} {`);

            // Process props, methods, and components in parallel
            if (descriptor.script) {
                await Promise.all([
                    this.processProps(descriptor.script.content),
                    this.processMethods(descriptor.script.content),
                    this.processComponents(descriptor.script.content, componentName)
                ]);
            }

            this.umlContent.push('}\n');
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        }

    }

    /**     * Extracts props from the script content and adds them to the UML content.
     * 
     * @param {string} scriptContent - The script content of the Vue component.
     * @returns {Promise<void>} A promise that resolves when the props have been processed.
     */
    async processProps(scriptContent) {
        const propsMatch = scriptContent.match(/props:\s*{([^}]*)}/s);
        if (propsMatch) {
            propsMatch[1].trim().split('\n').forEach(prop => {
                const trimmedProp = prop.trim();
                if (trimmedProp) {
                    this.umlContent.push(`  +${trimmedProp.split(':')[0]} : prop`);
                }
            });
        }
    }

    /**
     * Extracts methods from the script content and adds them to the UML content.
     * 
     * @param {string} scriptContent - The script content of the Vue component.
     * @returns {Promise<void>} A promise that resolves when the methods have been processed.
     */
    async processMethods(scriptContent) {
        const methodsMatch = scriptContent.match(/methods:\s*{([^}]*)}/s);
        if (methodsMatch) {
            methodsMatch[1].trim().split('\n').forEach(method => {
                const trimmedMethod = method.trim();
                if (trimmedMethod) {
                    this.umlContent.push(`  +${trimmedMethod.split(':')[0]}()`);
                }
            });
        }
    }

    /**
     * Extracts child components from the script content and adds relationships to the UML content.
     * 
     * @param {string} scriptContent - The script content of the Vue component.
     * @param {string} componentName - The name of the component being processed.
     * @returns {Promise<void>} A promise that resolves when the components have been processed.
     */
    async processComponents(scriptContent, componentName) {
        
        const componentsMatch = scriptContent.match(/components:\s*{([^}]*)}/s);
        if (componentsMatch) {
            componentsMatch[1].trim().split('\n').forEach(component => {
                const trimmedComponent = component.trim();
                if (trimmedComponent) {
                    const childComponent = trimmedComponent.split(':')[0];
                    this.umlContent.push(`${componentName} --> ${childComponent}`);
                }
            });
        }
    }

    /**
     * Recursively walks through a directory to process all Vue files.
     * 
     * @param {string} dir - The directory to walk through.
     * @returns {Promise<void>} A promise that resolves when all Vue files have been processed.
     */
    async walkDir(dir) {
        try {
            const fs = await import('fs/promises');
            const { generate } = await import('plantuml-encoder');
            console.log(generate); // This should log the function definition
            const encode = await import('plantuml-encoder');
           
            

            const files = await fs.readdir(dir);
            await Promise.all(files.map(async file => {
                const { join, extname } = await import('path');
                const filePath = join(dir, file);


                const stats = await fs.stat(filePath);

                if (stats.isDirectory()) {
                    await this.walkDir(filePath);
                } else if (extname(file) === '.vue') {
                    await this.processVueFile(filePath);
                }
            }));        } catch (error) {
            console.error(`Error walking directory ${dir}:`, error);
        }
    }

    /**
     * Generates a UML diagram from the Vue components in the specified directory.
     * 
     * @param {string} [sourceDir='./src'] - The directory containing Vue components.
     * @returns {Promise<{ diagramPath: string, sourcePath: string }>} An object containing paths to the generated diagram and source files.
     */
    
    async generateUML(sourceDir = './src') {
        try {
            const fs = await import('fs/promises');
            const { join } = await import('path');
            const { encode } = await import('plantuml-encoder');
            const { createWriteStream } = await import('fs');

            // Validate input directory
            await fs.access(sourceDir);

            this.umlContent = ['@startuml\n'];
            await this.walkDir(sourceDir);
            this.umlContent.push('@enduml');

            const finalContent = this.umlContent.join('\n');
            const outputPath = join(await import('process').then(module => module.cwd()), 'vue-components-diagram');

          
        // Generate diagram
        const encodedDiagram = encode(finalContent);
        const diagramStream = createWriteStream(`${outputPath}.png`);
        
        // Assuming you have a function to handle the diagram generation
        await new Promise((resolve, reject) => {
            // Replace this with the actual diagram generation logic
            // For example, if using a different library to generate the PNG
            someDiagramGenerationFunction(encodedDiagram, diagramStream)
                .on('end', resolve)
                .on('error', reject);
        });

        // Save PlantUML source
        await fs.writeFile(`${outputPath}.puml`, finalContent);

        console.log(`UML diagram generated at: ${outputPath}.png`);
        return {
            diagramPath: `${outputPath}.png`,
            sourcePath: `${outputPath}.puml`
        };
    } catch (error) {
        console.error('Error generating UML:', error);
        throw error;
    }
}
/**
 * Exports the VueUMLGenerator class for use in other modules.
 */
export { VueUMLGenerator };
