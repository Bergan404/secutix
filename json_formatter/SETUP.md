within folder we can run this

```
npm init -y
npm install electron --save-dev
```

Create main.js (your app launcher)
```
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

add to the package.json
```
"main": "main.js",
"scripts": {
  "start": "electron ."
},
```

running 
```
npm start
```
will run this as a real app

Install the builder
```
npm install electron-builder --save-dev
```

Add to package.json
```
"build": {
  "appId": "com.secutix.helper",
  "productName": "Secutix Helper"
},
```

TO build the application
```
npx electron-builder --win
```

in powershell
Run PowerShell as Administrator:

Click Start

Type PowerShell

Right-click → Run as Administrator

```
cd "C:\Users\oudb\Coding\secutix\json_formatter"
```

Then run this:
```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Press Y to confirm.


To generate a distributable Windows app:
```
npx electron-builder --win
```

The installer will appear in:
```
dist/
```

to add custom image

Create a folder in your project:
```
build/
```

Place your app icon in this folder named:
```
icon.ico
```

then update package.json
```
"build": {
  "appId": "com.yourcompany.secutixhelper",
  "productName": "Secutix Helper",
  "icon": "build/icon.ico",
  "win": {
    "icon": "build/icon.ico"
  }
}
```

then delete the dist folder and rebuild
```
npx electron-builder --win
```