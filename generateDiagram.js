// Import the VueUMLGenerator class
import { VueUMLGenerator } from './VueUMLGenerator.js';

// Initialize the generator
const umlGenerator = new VueUMLGenerator();

// Define a function to run the UML generation process
async function createDiagram() {
    try {
        // Specify the directory where your .vue files are located
        const sourceDir = 'src/components'; // Adjust the path as needed

        // Generate the UML diagram
        const result = await umlGenerator.generateUML(sourceDir);

        // Output the result paths
        console.log(`UML Diagram PNG: ${result.diagramPath}`);
        console.log(`PlantUML Source File: ${result.sourcePath}`);
    } catch (error) {
        console.error('Error creating UML diagram:', error);
    }
}

// Run the function
createDiagram();
