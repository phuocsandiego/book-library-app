# Personal Library Application
## A Refined, Local-First Book Collection Manager

### 📖 Overview

This is a serverless, privacy-focused web application for tracking and curating your personal book collection. Everything lives on your local machine—no servers, no tracking, complete portability.

**Design Philosophy**: Elegant simplicity. The app prioritizes thoughtful curation, visual beauty, and the joy of owning a well-organized collection.

---

## 🚀 Quick Start

### 1. **Folder Structure**

Create a folder on your machine (e.g., `~/my-book-app/`) with this structure:

```
/my-book-app/
├── index.html          # Main application (the only required file to start)
├── app.js              # Enhanced logic module (optional but recommended)
├── library.json        # Your book database (auto-created on first save)
└── /covers/            # Local cover images (auto-created on first use)
```

### 2. **Getting Started**

1. **Download the files**:
   - Save `index.html` and `app.js` to your `my-book-app/` folder
   - Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)

2. **First Load**:
   - The app loads with 3 sample books to get you familiar with the interface
   - Click the **Load** button (bottom right) to select your own `library.json` file
   - Or click **Save** to create a new `library.json` file in your folder

3. **Add Books**:
   - Click **+ Add Book** to add a new book
   - Enter ISBN-13 and click **Lookup** to auto-fetch metadata from OpenLibrary
   - Fill in optional details: format, location in your home, status
   - Save and enjoy the growing gallery

---

## 🎨 Features

### **Smart ISBN Lookup**
- Enter any ISBN-13
- Click **Lookup** to auto-fetch:
  - Book title
  - Author name
  - Cover image from OpenLibrary
- No metadata typing required

### **Visual Gallery View**
- Grid-based display of book covers
- Hover effects for elegant interactivity
- Click any book to view full details
- Status badges (To-Read, Currently Reading, Finished)

### **Status Tracking**
- **To-Read**: Books on your wishlist
- **Currently Reading**: What you're in the middle of
- **Finished**: Completed books with optional dates and personal ratings

### **Deep Categorization**
- ISBN-13 (unique identifier)
- Author
- Format (Hardcover, Paperback, E-book, Audiobook)
- Physical location in your home
- Reading history with dates
- Personal ratings (1-5 stars)

### **Dual View Modes**
- **Gallery View**: Visual browsing by book covers (default)
- **List View**: Compact text-based list with ratings and format info

### **Search & Filter**
- Filter by reading status (To-Read, Currently Reading, Finished)
- Search by title or author name
- Real-time filtering as you type

### **Dark Mode**
- Toggle dark/light theme with the moon/sun button (top right)
- Preference persists across sessions in localStorage
- Refined color palette for both themes

### **Local File Persistence**
- **Save**: Saves your entire library to `library.json`
- **Load**: Load a previously saved `library.json` file
- No internet required after initial setup
- Full data portability—move the folder between devices

---

## 📋 Data Schema

Your `library.json` contains an array of book objects:

```json
{
  "id": "uuid-abc123",
  "isbn_13": "9780140028300",
  "title": "One Hundred Years of Solitude",
  "author": "Gabriel García Márquez",
  "status": "Finished",
  "dates_finished": ["2024-03-15"],
  "rating": 5,
  "format": "Hardcover",
  "location": "Shelf A",
  "cover_path": "covers/uuid-abc123.jpg"
}
```

**Field Descriptions**:
- `id`: Unique internal identifier (UUID)
- `isbn_13`: Primary key for metadata lookups
- `title`: Book title
- `author`: Author name
- `status`: One of "To-Read", "Currently Reading", "Finished"
- `dates_finished`: Array of dates when book was completed (ISO format)
- `rating`: Personal rating 0-5 (0 = not rated)
- `format`: Physical or digital format
- `location`: Where you store it at home
- `cover_path`: Relative path to cover image in /covers/ folder

---

## 🔄 Persistence Workflow

### The "Load & Save" Cycle

1. **Load** (`📂 Load` button):
   - Browser requests permission to access a file
   - Select your `library.json` file
   - App reads and displays your entire collection in memory

2. **Edit** (in the app):
   - Alpine.js holds the library in RAM
   - Filter, search, add, edit, rate books
   - Changes exist only in memory until you save

3. **Save** (`💾 Save` button):
   - App serializes the in-memory library as JSON
   - Browser writes it back to your file
   - All changes persist to disk

### Why This Design?

- **Privacy**: No data leaves your machine
- **Portability**: Move your entire library across devices (just sync the folder)
- **Simplicity**: Single JSON file, no complex database
- **Control**: You own the data, not a service

---

## 🛠️ Technical Architecture

### Frontend Stack
- **HTML5**: Semantic structure and File System Access API
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Alpine.js**: Lightweight state management and reactivity
- **Vanilla JavaScript**: No build process, pure browser

### Key APIs Used
- **File System Access API**: Read/write local files with user permission
- **OpenLibrary API**: Free ISBN metadata lookup
- **LocalStorage**: Remember dark mode preference
- **Fetch API**: HTTP requests for ISBN lookups

### Browser Requirements
- Modern browsers with File System Access API support:
  - Chrome 86+
  - Edge 86+
  - Opera 72+
  - Firefox 100+ (with `dom.filesystem.enabled` flag)
  - Safari 16.4+ (limited support)

> **Note**: If using an older browser, you can still use the app by manually entering ISBN, title, and author. The Save/Load buttons may have limited functionality.

---

## 🎯 Usage Tips

### **Organizing Your Collection**

Use the **Location** field to track where books live:
- "Shelf A, Top Row"
- "Nightstand"
- "Bookcase in Study"
- "Living Room Corner"

This makes finding physical copies quick and intuitive.

### **Building Your Rating System**

Rate only **Finished** books. Use the 5-star system:
- ⭐ : Didn't finish / Disliked
- ⭐⭐ : It was okay
- ⭐⭐⭐ : Good, worth reading
- ⭐⭐⭐⭐ : Excellent, highly recommended
- ⭐⭐⭐⭐⭐ : Masterpiece, life-changing

### **ISBN Lookup Tips**

Find ISBNs at:
- [OpenLibrary.org](https://openlibrary.org) (free, comprehensive)
- Your book's back cover (ISBN-13 is the barcode)
- [ISBN Search](https://www.isbndb.com)
- Amazon product pages

**Pro Tip**: Copy the ISBN-13 number (without hyphens or spaces) for fastest lookup.

### **Cover Images**

The app automatically fetches covers from OpenLibrary for most books. If a cover isn't available:
- Manually upload an image via the **Add Book** form
- The app stores it locally in `/covers/`

### **Exporting Your Data**

Your `library.json` is standard JSON—you can:
- Open it in any text editor
- Import it into other book apps
- Convert to CSV using a script
- Back it up anywhere

---

## 🔧 Advanced Usage

### **Using the app.js Module** (Optional)

The included `app.js` provides utility classes:

```javascript
// ISBN lookup with error handling
const metadata = await ISBNLookup.lookupISBN('9780140028300');

// Generate library statistics
const stats = LibraryStats.calculateStats(books);
// Returns: { total, toRead, currentlyReading, finished, averageRating, ... }

// Export library as CSV
const csvBlob = await LibraryExport.exportAsCSV(books);
LibraryExport.downloadBlob(csvBlob, 'my-library.csv');

// Validate ISBN
const isValid = Validator.isValidISBN13('9780140028300');
```

### **Extending the App**

The modular structure makes it easy to add features:

1. **Add a new modal** for book reviews (edit `index.html`)
2. **Integrate a different API** for metadata (update `ISBNLookup` class)
3. **Add analytics** (use `LibraryStats` to visualize reading habits)
4. **Create backups** (implement auto-save to cloud storage)

### **Syncing Across Devices**

1. Store your `/my-book-app/` folder in a sync service:
   - iCloud Drive
   - Google Drive
   - Dropbox
   - OneDrive
   - Synology, etc.

2. Open `index.html` on any device with the synced folder

3. Your library is always in sync

> **Note**: The File System Access API requires explicit permission on each device. You'll grant access the first time you click Load/Save on each machine.

---

## 🎨 Design Customization

The app uses CSS variables for theming. Edit these in `index.html` to customize colors:

```css
:root {
  --color-cream: #fefcf7;
  --color-dark: #1a1815;
  --color-sage: #8b9b7f;
  --color-gold: #c8a574;
  --color-accent: #d4704d;
}
```

Change the fonts by editing the Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Libre+Baskerville:ital@0;1&display=swap" rel="stylesheet">
```

---

## 📝 Keyboard Shortcuts

- **Escape**: Close modals and detail view
- **Click on book**: Open full details
- **Enter in search**: Filter results in real-time

---

## ⚠️ Important Notes

### **Data Backup**

Your library is stored only on your machine. Implement regular backups:
- Copy `/my-book-app/` to an external drive monthly
- Use cloud sync (Dropbox, iCloud, etc.) for continuous backup
- Manually export to CSV as an additional safeguard

### **Browser Security**

The File System Access API is sandboxed:
- Browsers ask for permission before reading/writing files
- The app can only access files and directories you explicitly allow
- No background access or tracking

### **No Warranty**

This app is provided as-is. Always maintain backups of your `library.json` file before major updates.

---

## 🐛 Troubleshooting

### **"File not found" or permission errors**
- Ensure the browser has permission to access your folder
- Try clicking **Save** to request fresh permissions
- Some browsers require you to explicitly grant File System Access

### **ISBN lookup returns "Not Found"**
- Verify the ISBN-13 is correct (13 digits only)
- Try looking up the book on [OpenLibrary.org](https://openlibrary.org) to confirm it exists
- Manually enter title and author if lookup fails

### **Cover images aren't showing**
- The app automatically fetches from OpenLibrary
- If not available, manually upload a cover image
- Check that `/covers/` folder exists and has write permissions

### **Dark mode not persisting**
- Clear browser localStorage: Settings → Storage → Clear Site Data
- Reload the page and toggle dark mode again

### **Can't save files (Mac/Safari)**
- Safari has limited File System Access API support
- Try saving manually via the **Save** button instead
- Update to Safari 16.4+ for full support

---

## 📚 Example Workflow

1. **Install the app**: Save `index.html` and `app.js` to `/my-book-app/`

2. **Open in browser**: Navigate to `/my-book-app/index.html`

3. **Create your first library**:
   - Click **+ Add Book**
   - Enter ISBN: `9780140028300`
   - Click **Lookup** → Auto-fills title and author
   - Click **Add Book**

4. **Save your library**:
   - Click **💾 Save** (bottom right)
   - Select where to save `library.json`
   - App saves your collection to disk

5. **Add more books**:
   - Click **+ Add Book** again
   - Repeat for each book in your collection

6. **Track your reading**:
   - Click a book to view details
   - Change status to "Currently Reading" or "Finished"
   - Rate finished books

7. **Search and filter**:
   - Use the search box to find books by title/author
   - Filter by status (To-Read, Currently Reading, Finished)
   - Switch between Gallery and List views

8. **Next session**:
   - Open `index.html` again
   - Click **📂 Load**
   - Select your saved `library.json`
   - Your entire library reappears

---

## 🎓 Learning Resources

### File System Access API
- [MDN Web Docs: File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)

### Alpine.js
- [Alpine.js Documentation](https://alpinejs.dev/)

### OpenLibrary API
- [OpenLibrary API Docs](https://openlibrary.org/developers/api)

### Tailwind CSS
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 💭 Philosophy

This app is designed for people who:
- Value privacy and ownership over convenience
- Appreciate thoughtful, refined design
- Want their tools to last (no subscriptions, no data harvesting)
- Enjoy curation and organization
- Prefer local-first, portable software

It's a love letter to book lovers everywhere.

---

## 📄 License

This application is free to use and modify. No restrictions.

---

**Enjoy building your collection! 📚**
