// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma' || figma.editorType === 'dev') {
  figma.showUI(__html__, { width: 600, height: 250 });

  figma.ui.onmessage = async (msg) => {
    if (msg.type === 'export-text') {

      const { minWidth, minHeight } = msg;

      const arbData = generateArbData(minWidth, minHeight);

      figma.ui.postMessage({ type: 'download-arb', data: arbData });
    }
  };
}

// Helper function to convert a string to camel case
function toCamelCase(str: string): string {
  // Convert to camel case
  let camelCased = str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, ''); // Remove any remaining special characters

  // Ensure the key starts with a letter
  if (!/^[a-zA-Z]/.test(camelCased)) {
    camelCased = `text_${camelCased}`;
  }

  return camelCased;
}


function generateArbData(minWidth: number, minHeight: number) {
  const designScreens = figma.currentPage.children.filter(node => 
    node.type === "FRAME" && node.width >= minWidth && node.height >= minHeight
  ) as FrameNode[];

  const arbData: Record<string, any> = {
    "@@locale": "en",
  };

  designScreens.forEach(screen => {
    const textNodes = screen.findAll(node => 
      node.type === "TEXT" && node.visible && !isKeyboardText(node)
    ) as TextNode[];

    textNodes.forEach((node, index) => {
      let key = toCamelCase(node.characters).slice(0, 30) || `text_${index}`;
      arbData[key] = node.characters;
      arbData[`@${key}`] = {
        "description": node.name || "No description"
      };
    });
  });

  return JSON.stringify(arbData, null, 2);
}

// Helper function to determine if a text node is part of a keyboard component
function isKeyboardText(node: TextNode): boolean {

  console.log(node?.parent?.name)

  const keyboardPatterns = /^[a-z]$/i; // Pattern for single letters typical on keyboards
  const keyboardRelatedNames = ["keyboard", "key"];

  // Check if the node's name suggests it’s a keyboard
  if (keyboardRelatedNames.some(keyword => node.parent && node.parent.name.toLowerCase().includes(keyword))) {
    return true;
  }

  // Check if the text itself matches common keyboard key patterns
  if (keyboardPatterns.test(node.characters.trim())) {
    return true;
  }

  return false;
}