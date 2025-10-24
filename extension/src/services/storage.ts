// Storage service for Chrome extension
export class StorageService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const result = await chrome.storage.sync.get(key);
      return result[key] || null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  static async set<T>(key: string, value: T): Promise<void> {
    try {
      await chrome.storage.sync.set({ [key]: value });
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await chrome.storage.sync.remove(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await chrome.storage.sync.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  static async getAll(): Promise<Record<string, any>> {
    try {
      return await chrome.storage.sync.get();
    } catch (error) {
      console.error('Storage get all error:', error);
      return {};
    }
  }
}
