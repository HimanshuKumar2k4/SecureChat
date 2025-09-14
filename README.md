🔒 SecureChat

A secure, temporary chat and file-sharing web application.
Users can send text messages, audio, video, images, and documents in real-time.
All data is automatically deleted once the conversation ends, ensuring privacy and security.

🚀 Features

💬 Real-time chat (text messages)

📂 File sharing (audio, video, images, docs)

⏳ Temporary conversations (data deleted when session ends)

🔑 End-to-end encryption for messages & files

🌐 Web-based (no authentication required)

📱 Access device contacts (via Contact Picker API, if supported)

🖥️ Clean and simple chat interface

🛠️ Tech Stack

Frontend: React, TailwindCSS, Socket.IO client

Backend: Node.js, Express, Socket.IO

Storage: Ephemeral / in-memory (no permanent DB)

Security: HTTPS + TLS + end-to-end encryption

📦 Installation
1️⃣ Clone the repository
git clone https://github.com/HimanshuKumar2k4/SecureChat.git
cd SecureChat

2️⃣ Install dependencies

If the project has separate client and server folders:

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install


If everything is in a single folder with one package.json:

npm install

▶️ Running the Project
Start Backend
cd server
npm start


Server will run on http://localhost:5000 (or configured port).

Start Frontend
cd client
npm start


Frontend will run on http://localhost:3000.

📖 Usage

Open the app in your browser: http://localhost:3000

Select a contact (if supported) or share a session link with another user.

Exchange messages and files securely in real time.

Once both users leave the chat → all data is deleted from server & client.

🔐 Security

All communication is encrypted with TLS/HTTPS.

Messages and files are stored only temporarily in memory.

Auto-deletion ensures no logs, no traces after conversation ends.

📌 Future Improvements

Add group chat support

Mobile PWA version

Self-hosted Docker deployment

🤝 Contributing

Pull requests are welcome!
If you’d like to suggest new features or report bugs, please open an issue
.

📜 License

This project is licensed under the MIT License.