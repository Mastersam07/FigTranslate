// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma') {
  figma.showUI(__html__);

  figma.ui.onmessage =  (msg: {type: string, count: number}) => {
    if (msg.type === 'export-text') {
      const arbData = generateArbData();
      
      console.log(arbData)

      figma.ui.postMessage({ type: 'download-arb', data: arbData });
    }
  };
}

function generateArbData() {
  const textNodes = figma.root.findAll(node => node.type === "TEXT") as TextNode[];
  const arbData: Record<string, any> = {};

  arbData['@@locale'] = 'en';

  textNodes.forEach((node, index) => {
    const key = `text_${index}`;
    arbData[key] = node.characters;
    arbData[`@${key}`] = {
      "description": node.name || "No description"
    };
  });

  return JSON.stringify(arbData, null, 2);
}

