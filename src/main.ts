// main.ts
import { PluginMessage } from './types';
import { generateArbData, generateArbDataFromSelection } from './arbGenerator';
import { setupUI } from './ui';

figma.showUI(__html__, { width: 600, height: 250 });

setupUI((msg: PluginMessage) => {
  if (msg.type === 'export-text') {
    const { minWidth, minHeight, useSelectedFrame } = msg;

    const arbData = useSelectedFrame && figma.currentPage.selection.length === 1 && figma.currentPage.selection[0].type === "FRAME"
      ? generateArbDataFromSelection(figma.currentPage.selection[0] as FrameNode)
      : generateArbData(minWidth!, minHeight!);

    figma.ui.postMessage({ type: 'download-arb', data: arbData });
  }
});
