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

      figma.ui.postMessage({ type: 'download-arb', data: arbData });
    }
  };
}

function generateArbData() {

  // Threshold for minimum frame dimensions
  const MIN_WIDTH = 430;
  const MIN_HEIGHT = 932;

  const designScreens = figma.currentPage.children.filter(node => 
    node.type === "FRAME" &&
    node.width >= MIN_WIDTH &&
    node.height >= MIN_HEIGHT
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


