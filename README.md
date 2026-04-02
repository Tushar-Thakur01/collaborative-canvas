<div align="center">

# ⚡ Collaborative Code Canvas

**The "Figma for Code" — A Real-Time Synchronous Development & Review Environment**

[![Live Demo](https://img.shields.io/badge/🔴_Live_Demo-View_Project-success?style=for-the-badge&logo=vercel)](https://collaborative-canvas1.vercel.app/)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-2C2C32?style=for-the-badge&logo=visual-studio-code&logoColor=007ACC)

</div>

<br />

## 📖 Overview

Collaborative Code Canvas is a full-stack, real-time development environment engineered to bridge the gap between coding and code-reviewing. Moving beyond standard text-sharing, it implements a custom **"Glass Pane" annotation architecture** that allows multiple developers to edit code, track remote cursors, and drop spatial "pin" comments directly onto logic blocks with sub-100ms latency.

## ✨ Key Features

* **🤝 Real-Time Synchronization:** Bi-directional WebSocket communication ensures that code edits appear instantly across all connected clients.
* **📍 Spatial Annotation (Glass Pane Architecture):** Switch between "Edit Mode" and "Comment Mode" to drop contextual pins directly onto specific coordinates of the code using an interactive UI overlay.
* **🖱️ Live Ghost Cursors:** Track where other developers are looking or typing in real-time, complete with responsive cursor smoothing.
* **👨‍💻 Professional Editor Core:** Powered by the Monaco Editor API (the exact engine behind VS Code), featuring full syntax highlighting and IDE-grade formatting.
* **📊 Live Session Tracking:** Dynamic active user counting integrated directly into the professional dark-themed UI.

## 🛠️ Technical Architecture

This application utilizes a modern, split-deployment microservices strategy to handle stateful concurrency.

### The Stack
* **Frontend:** React.js, Monaco Editor API, Socket.io-client
* **Backend:** Node.js, Express.js, Socket.io
* **Infrastructure:** * **Vercel:** Hosts the frontend for high-performance edge caching and fast static delivery.
  * **Render:** Hosts the Node.js backend as a continuous, stateful process to maintain persistent 24/7 WebSocket tunnels.

### System Design Highlights
* **Concurrency Handling:** Implements an event-driven architecture using `socket.broadcast` to prevent self-echoing while maintaining global state alignment.
* **Coordinate Mapping:** Transforms native DOM client bounding rectangles (`getBoundingClientRect`) into relative $x,y$ vectors to ensure annotation pins align perfectly over the Monaco editor instance.
* **State Management:** Dynamically toggles CSS `pointer-events` to route DOM clicks either into the Monaco text engine or the React-controlled Glass Pane layer without unmounting components.

## 👨‍💻 Author

**Tushar Thakur**
* GitHub: [@Tushar-Thakur01](https://github.com/Tushar-Thakur01)
* LinkedIn: [Tushar Thakur](https://www.linkedin.com/in/tushar-thakur-823a70221/) 
