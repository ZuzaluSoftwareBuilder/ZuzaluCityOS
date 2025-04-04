/**
 * LocalStorage Utility Class
 * Provides CRUD operations for browser's localStorage with reactive capabilities
 */
export class LocalStorage {
  private static listeners: Map<string, Set<(newValue: any) => void>> =
    new Map();

  /**
   * Set a value in localStorage with event emission
   * @param key The key to store the value under
   * @param value The value to store
   */
  static set<T>(key: string, value: T): void {
    try {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      this.notifyListeners(key, value);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Get a value from localStorage
   * @param key The key to retrieve
   * @returns The stored value, or null if not found
   */
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage with event emission
   * @param key The key to remove
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
      this.notifyListeners(key, null);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Clear all items from localStorage with event emission
   */
  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      localStorage.clear();
      keys.forEach((key) => this.notifyListeners(key, null));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Update an existing localStorage item with event emission
   * @param key The key to update
   * @param updater Function that takes the previous value and returns the new value
   */
  static update<T>(key: string, updater: (prevValue: T | null) => T): void {
    try {
      const currentValue = this.get<T>(key);
      const newValue = updater(currentValue);
      this.set(key, newValue);
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  }

  /**
   * Subscribe to changes of a specific localStorage key
   * @param key The key to watch
   * @param callback Function to be called when the value changes
   * @returns Unsubscribe function
   */
  static subscribe<T>(
    key: string,
    callback: (newValue: T | null) => void,
  ): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    const keyListeners = this.listeners.get(key)!;
    keyListeners.add(callback);

    // Return unsubscribe function
    return () => {
      keyListeners.delete(callback);
      if (keyListeners.size === 0) {
        this.listeners.delete(key);
      }
    };
  }

  /**
   * Watch for changes to a specific localStorage key and get its current value
   * @param key The key to watch
   * @param callback Function to be called when the value changes
   * @returns Object containing current value and unsubscribe function
   */
  static watch<T>(
    key: string,
    callback: (newValue: T | null) => void,
  ): {
    value: T | null;
    unsubscribe: () => void;
  } {
    const value = this.get<T>(key);
    const unsubscribe = this.subscribe(key, callback);
    return { value, unsubscribe };
  }

  /**
   * Notify all listeners of a key about value changes
   * @param key The key that changed
   * @param newValue The new value
   */
  private static notifyListeners(key: string, newValue: any): void {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach((listener) => listener(newValue));
    }
  }
}
