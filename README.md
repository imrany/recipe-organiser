### Run locally
Make sure you've install
- `MongoDB` 
- `MongoDB Compass`
- Nodejs v18.x.x or above
- vscode

```bash 
git clone https://github.com/imrany/recipe-organiser
```
```bash
cd recipe-organiser&& code .
```
Start `MongoDB` in the backgrounf by run
```bash
mongod
```

Open a split vscode terminal
1. Terminal one
```bash
cd client
npm install
npm run dev
```

2. Terminal two
```bash
cd server
npm install
npm run dev
```

Open your browser [http://localhost:3000](http://localhost:3000)