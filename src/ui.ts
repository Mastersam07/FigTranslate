// ui.ts
import { PluginMessage } from './types';

type MessageHandler = (msg: PluginMessage) => void;

export function setupUI(onMessage: MessageHandler) {
  figma.ui.onmessage = onMessage;
}
