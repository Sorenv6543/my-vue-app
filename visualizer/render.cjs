const markdownIt = require('markdown-it');
const markdownItPlantUML = require('markdown-it-plantuml');
const fs = require('fs');

// Initialize markdown-it with the PlantUML plugin
const md = markdownIt().use(markdownItPlantUML, { server:'http://www.plantuml.com/plantuml' });;

// Markdown content with PlantUML code
const markdownContent = `
# My Component Diagram

This is a class diagram for my Vue components:

\`\`\`plantuml
@startuml
class ParentComponent {
    +propA: String
    +methodX(): void
}

class ChildComponent {
    +propC: Number
    +methodY(): void
}

ParentComponent *-- ChildComponent
@enduml
\`\`\`
`;

// Render the Markdown content
const result = md.render(markdownContent);

// Output to HTML file for viewing
fs.writeFileSync('output.html', result);
console.log("Markdown has been rendered to output.html");
