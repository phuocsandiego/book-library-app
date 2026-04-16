/**
 * Personal Library Application
 * Enhanced logic module for local-first book collection management
 */

class LibraryManager {
  constructor() {
    this.fileHandle = null;
    this.coversDirectory = null;
  }

  /**
   * Initialize File System Access API
   * Request permission to read/write to the library.json and /covers/ directory
   */
  async initializeFileSystem() {
    try {
      // Request access to the directory
      this.rootDirectory = await window.showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'documents'
      });
      
      // Get or create covers subdirectory
      this.coversDirectory = await this.rootDirectory.getDirectoryHandle('covers', { create: true });
      
      // Verify library.json exists
      try {
        this.fileHandle = await this.rootDirectory.getFileHandle('library.json');
      } catch {
        // Create new library.json if it doesn't exist
        this.fileHandle = await this.rootDirectory.getNewFileHandle('library.json');
        await this.writeLibraryFile([]);
      }

      console.log('✓ File system initialized successfully');
      return true;
    } catch (error) {
      if (error.name !== 'NotAllowedError') {
        console.error('File system initialization error:', error);
      }
      return false;
    }
  }

  /**
   * Load library from the JSON file
   */
  async loadLibrary() {
    if (!this.fileHandle) return [];

    try {
      const file = await this.fileHandle.getFile();
      const text = await file.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Error loading library:', error);
      return [];
    }
  }

  /**
   * Save library to the JSON file
   */
  async writeLibraryFile(books) {
    if (!this.fileHandle) return false;

    try {
      const writable = await this.fileHandle.createWritable();
      await writable.write(JSON.stringify(books, null, 2));
      await writable.close();
      return true;
    } catch (error) {
      console.error('Error saving library:', error);
      return false;
    }
  }

  /**
   * Save book cover image to /covers/ directory
   */
  async saveCoverImage(bookId, imageData) {
    if (!this.coversDirectory) return null;

    try {
      const fileName = `${bookId}.jpg`;
      const fileHandle = await this.coversDirectory.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();

      // Convert data URL to blob if necessary
      let data = imageData;
      if (imageData.startsWith('data:')) {
        const base64 = imageData.split(',')[1];
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        data = bytes;
      }

      await writable.write(data);
      await writable.close();

      return `covers/${fileName}`;
    } catch (error) {
      console.error('Error saving cover image:', error);
      return null;
    }
  }

  /**
   * Retrieve cover image from /covers/ directory
   */
  async getCoverImage(coverPath) {
    if (!this.coversDirectory || !coverPath) return null;

    try {
      const fileName = coverPath.split('/').pop();
      const fileHandle = await this.coversDirectory.getFileHandle(fileName);
      const file = await fileHandle.getFile();
      return URL.createObjectURL(file);
    } catch {
      return null;
    }
  }

  /**
   * Delete cover image from /covers/ directory
   */
  async deleteCoverImage(coverPath) {
    if (!this.coversDirectory || !coverPath) return false;

    try {
      const fileName = coverPath.split('/').pop();
      await this.coversDirectory.removeEntry(fileName);
      return true;
    } catch (error) {
      console.error('Error deleting cover image:', error);
      return false;
    }
  }
}

/**
 * ISBN Lookup Service
 * Fetch metadata from OpenLibrary API
 */
class ISBNLookup {
  static async lookupISBN(isbn) {
    try {
      const response = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`
      );

      if (!response.ok) throw new Error('OpenLibrary API error');

      const data = await response.json();
      const bookKey = `ISBN:${isbn}`;

      if (!data[bookKey]) {
        return null;
      }

      const book = data[bookKey];
      return {
        title: book.title || '',
        author: book.authors?.[0]?.name || '',
        publishYear: book.publish_date?.split(' ').pop() || '',
        coverUrl: book.cover?.medium || book.cover?.small || null,
        description: book.description || ''
      };
    } catch (error) {
      console.error('ISBN lookup error:', error);
      return null;
    }
  }

  /**
   * Get cover image from OpenLibrary
   */
  static async fetchCoverImage(isbn) {
    try {
      const response = await fetch(
        `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
      );
      if (!response.ok) throw new Error('Cover not found');

      return await response.blob();
    } catch {
      return null;
    }
  }
}

/**
 * Library Statistics
 * Generate insights from collection
 */
class LibraryStats {
  static calculateStats(books) {
    return {
      total: books.length,
      toRead: books.filter(b => b.status === 'To-Read').length,
      currentlyReading: books.filter(b => b.status === 'Currently Reading').length,
      finished: books.filter(b => b.status === 'Finished').length,
      averageRating: this.calculateAverageRating(books),
      byFormat: this.groupByFormat(books),
      byAuthor: this.countByAuthor(books),
      recentlyFinished: books
        .filter(b => b.status === 'Finished' && b.dates_finished?.length > 0)
        .sort((a, b) => new Date(b.dates_finished[0]) - new Date(a.dates_finished[0]))
        .slice(0, 5)
    };
  }

  static calculateAverageRating(books) {
    const ratedBooks = books.filter(b => b.rating > 0);
    if (ratedBooks.length === 0) return 0;
    const sum = ratedBooks.reduce((acc, b) => acc + b.rating, 0);
    return (sum / ratedBooks.length).toFixed(1);
  }

  static groupByFormat(books) {
    return books.reduce((acc, book) => {
      acc[book.format] = (acc[book.format] || 0) + 1;
      return acc;
    }, {});
  }

  static countByAuthor(books) {
    const authors = {};
    books.forEach(book => {
      authors[book.author] = (authors[book.author] || 0) + 1;
    });
    return Object.entries(authors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }
}

/**
 * Export utilities for data portability
 */
class LibraryExport {
  static async exportAsJSON(books) {
    const dataStr = JSON.stringify(books, null, 2);
    return new Blob([dataStr], { type: 'application/json' });
  }

  static async exportAsCSV(books) {
    const headers = ['Title', 'Author', 'ISBN', 'Status', 'Rating', 'Format', 'Location', 'Date Finished'];
    const rows = books.map(book => [
      book.title,
      book.author,
      book.isbn_13,
      book.status,
      book.rating,
      book.format,
      book.location,
      book.dates_finished?.[0] || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new Blob([csv], { type: 'text/csv' });
  }

  static downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Validation utilities
 */
class Validator {
  static isValidISBN13(isbn) {
    const cleaned = isbn.replace(/\D/g, '');
    if (cleaned.length !== 13) return false;

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleaned[i]) * (i % 2 === 0 ? 1 : 3);
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return parseInt(cleaned[12]) === checkDigit;
  }

  static isValidBook(book) {
    return (
      book.title &&
      book.author &&
      book.isbn_13 &&
      ['To-Read', 'Currently Reading', 'Finished'].includes(book.status) &&
      typeof book.rating === 'number' &&
      book.rating >= 0 &&
      book.rating <= 5
    );
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LibraryManager,
    ISBNLookup,
    LibraryStats,
    LibraryExport,
    Validator
  };
}
