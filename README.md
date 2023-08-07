# Scratch CLI

NOTE: This is just a fun project i'm working on, and should not be used for production !

![Logo of Scratch Frameword](https://djemai-samy.com/projects/personal/scratch/scratch.png)

The Scratch CLI is a command-line tool designed to enhance your workflow and simplify the process of starting and building React applications using Server-Side Rendering (SSR) and client-side rendering.

With a set of simple commands, you can create, configure, start and build your React App.

It's better used with Scratch Framework, [you can explore the official page for a quick start](https://djemai-samy.com/projects/scratch)

This document provides a detailed guide on installing and using the Scratch CLI.

## Table of Contents

1. Installation
2. Basic Usage
3. Development Workflow
4. Production Build
5. Integration with PHP
6. Deployment
7. Examples

---

## Installation

To use the Scratch CLI, you need to have Node.js installed.

You can install the CLI globally using the following command:

```bash
npm install -g scratch-sr-cli
```

Alternatively, you can use the CLI without installing it globally by running:

```bash
Copy code
npx scratch-sr-cli <command>
```

## Basic Usage

1. Create a Scratch App with all the necessary dependencies installed, run:

    ```bash
    scratch-cli create
    ```


2. Start Development Server
To start the development server, which serves the client assets and watches for changes, run:

    ```bash
    npx scratch-sr-cli start
    ```

    This command launches the webpack development server and also watches the server entry for changes.

3. Build for Production

    To build your Scratch app for production, use the following command:

    ```bash
    npx scratch-sr-cli scratch-cli build
    ```

    This command creates optimized production-ready assets in the public folder and generates the server entry in a specified folder.

---

## Development Workflow

For efficient development:

1. Start with scratch-cli start to launch the development server.
2. Make changes to your React app and PHP backend.
3. Use hot-reloading and browser refresh to see live updates.
4. Once development is complete, proceed to building for production.

---

## Configuration

This configuration file defines the server and client entry points, output paths, and development server settings.

```json
{
  "folder": "src/React",
  "server": {
    "entry": "main.js",
    "output": {
      "name": "server.js",
      "folder": ".scratch/entries"
    }
  },
  "client": {
    "entry": "main.js",
    "output": {
      "name": "client.js",
      "folder": "public",
      "styles": "styles.css"
    },
    "dev": {
      "url": "http://localhost:3000",
      "port": "3000"
    }
  }
}
```

---

## Integration

The Scratch CLI integrates seamlessly with Scratch PHP backend using scratch-ssr package.

Exemples of usage with multiple backends wil be added here soon.

---
