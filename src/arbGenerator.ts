// arbGenerator.ts

function generateArbDataFromSelection(frame: FrameNode) {
  const arbData: Record<string, any> = {
    "@@locale": "en",
  };

  const textNodes = frame.findAll(node => node.type === "TEXT" && node.visible && !isKeyboardText(node)) as TextNode[];

  textNodes.forEach((node, index) => {
    const key = toCamelCase(node.characters).slice(0, 30) || `text_${index}`;
    arbData[key] = node.characters;
    arbData[`@${key}`] = {
      "description": node.name || "No description"
    };
  });

  return arbData;
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
      const key = toCamelCase(node.characters).slice(0, 30) || `text_${index}`;
      arbData[key] = node.characters;
      arbData[`@${key}`] = {
        "description": node.name || "No description"
      };
    });
  });

  return arbData;
}
