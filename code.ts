// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma' || figma.editorType === 'dev') {
  figma.showUI(__html__, { width: 600, height: 250 });

  figma.ui.onmessage = async  (msg) => {
    if (msg.type === 'export-text') {

      const { minWidth, minHeight } = msg;

      const arbData = generateArbData(minWidth, minHeight);

      figma.ui.postMessage({ type: 'download-arb', data: arbData });
    }
  };
}

function generateArbData(minWidth: number, minHeight: number) {

  const designScreens = figma.currentPage.children.filter(node => 
    node.type === "FRAME"  && node.width >= minWidth && node.height >= minHeight
  ) as FrameNode[];

  const arbData: Record<string, any> = {
    "@@locale": "en",
  };

  // Iterate through each design screen and extract visible text nodes
  designScreens.forEach(screen => {
    console.log(screen.name)
    const textNodes = screen.findAll(node => node.type === "TEXT" && node.visible) as TextNode[];

    textNodes.forEach((node, index) => {
      const key = `${screen.name.replace(/\s+/g, '_')}_text_${index}`;
      arbData[key] = node.characters;
      arbData[`@${key}`] = {
        "description": node.name || "No description"
      };
    });
  });

  return JSON.stringify(arbData, null, 2);
}


