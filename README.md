# VaultSync

**Created by Muhammad Ikhwan Fathulloh**

## Overview
VaultSync is a lightweight file management system built with native JavaScript and Node.js. It demonstrates core concepts of memory handling, input/output operations, file manipulation, and basic security. The application is deployable on platforms like [Render.com](https://render.com) or [Vercel](https://vercel.com).

---

## Features
- **File Upload**: Upload files directly through the browser.
- **File Management**: View uploaded files, including metadata like size and upload time.
- **File Deletion**: Delete files from the server with a single click.
- **Metadata Storage**: Persist file information using JSON-based metadata.
- **Secure Operations**: Restrict file operations to prevent unauthorized access.

---

## Requirements
- [Node.js](https://nodejs.org/) (v14 or higher)
- A modern web browser (e.g., Chrome, Firefox)
- Internet connection for deployment (if deploying to Vercel)

---

## Folder Structure
```plaintext
project-folder/
├── server.js          // Main server file
├── fileStore.js       // Handles metadata storage
├── style.css          // Frontend styling
├── index.html         // Frontend interface
├── uploads/           // Directory for uploaded files
└── fileMetadata.json  // JSON file to store metadata
```

---

## Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Muhammad-Ikhwan-Fathulloh/VaultSync.git
   cd VaultSync
   ```
2. **Install dependencies**:
   ```bash
   npm init -y
   ```
3. **Ensure the `uploads/` directory exists**:
   ```bash
   mkdir uploads
   ```
4. **Run the server**:
   ```bash
   node server.js
   ```

---

## Usage
1. Start the server by running:
   ```bash
   node server.js
   ```
2. Open your browser and go to:
   ```
   http://localhost:3000/
   ```
3. Use the interface to:
   - Upload files.
   - View and manage uploaded files.
   - Delete files when no longer needed.

---

## Deployment to Vercel
1. **Install the Vercel CLI**:
   ```bash
   npm install -g vercel
   ```
2. **Login to Vercel**:
   ```bash
   vercel login
   ```
3. **Deploy the application**:
   ```bash
   vercel
   ```
4. Follow the prompts to complete the deployment.
5. Once deployed, access your application at the generated Vercel URL.

---

## Key Files

### 1. `server.js`
Handles server logic, including file uploads, retrieval, and deletion. It also serves the frontend files (`index.html` and `style.css`).

### 2. `fileStore.js`
Manages metadata for uploaded files, including saving and retrieving metadata from a JSON file (`fileMetadata.json`).

### 3. `index.html`
Frontend interface for interacting with the application.

### 4. `style.css`
Provides a clean and simple UI design for the application.

---

## Security Notes
- Ensure the `uploads/` directory is protected against unauthorized access when deploying to production.
- Validate file uploads to prevent malicious content from being stored on the server.
- Restrict access to server routes to authorized users only (future enhancement).

---

## Author
**Muhammad Ikhwan Fathulloh**  
Software Engineer | IoT Trainer | AI Mentor

Feel free to connect or collaborate:
- **Email**: muhammadikhwanfathulloh17@gmail.com
- **GitHub**: [Muhammad-Ikhwan-Fathulloh](https://github.com/Muhammad-Ikhwan-Fathulloh)

---

## License
This project is licensed under the MIT License. Feel free to use, modify, and distribute this project as needed.