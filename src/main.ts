// main.ts


// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma' || figma.editorType === 'dev') {
  figma.showUI(__html__, { width: 600, height: 250 });

  figma.ui.onmessage = async (msg) => {
    if (msg.type === 'export-text') {

      const { minWidth, minHeight, useSelectedFrame } = msg;

      const arbData = useSelectedFrame && figma.currentPage.selection.length === 1 && figma.currentPage.selection[0].type === "FRAME"
      ? generateArbDataFromSelection(figma.currentPage.selection[0] as FrameNode)
      : generateArbData(minWidth, minHeight);

      figma.ui.postMessage({ type: 'download-arb', data: arbData });
    }
  };
}