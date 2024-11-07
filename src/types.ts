export interface PluginMessage {
    type: 'export-text';
    minWidth?: number;
    minHeight?: number;
    useSelectedFrame: boolean;
  }