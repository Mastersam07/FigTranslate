// utils.ts

// Helper function to convert a string to camel case
export function toCamelCase(str: string): string {
    let camelCased = str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, ''); // Remove any remaining special characters
  
    if (!/^[a-zA-Z]/.test(camelCased)) {
      camelCased = `text_${camelCased}`;
    }
  
    return camelCased;
  }
  
  // Helper function to determine if a text node is part of a keyboard component
  export function isKeyboardText(node: TextNode): boolean {
    const keyboardPatterns = /^[a-z]$/i;
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
  