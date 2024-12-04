Welcome to recipe-organiser where you can discover, organise and create new recipes.

### Run locally
Make sure you've install
- `MongoDB` 
- `MongoDB Compass`
- Nodejs v18.x.x or above
- vscode

```bash 
git clone https://github.com/imrany/recipe-organiser
```

Open with vscode
```bash
cd recipe-organiser
code .
```

Open a vscode terminal
```bash
npm install
npm run dev
```
Open your browser [http://localhost:8000](http://localhost:8000)

Once you are on [http://localhost:8000](http://localhost:8000)

You would see our homepage where you would see differents availed by users on our platform, you can view them.
You can create an account by [registering](http://localhost:8000/register), or [login](http://localhost:8000/login) if you already have an account

Other authentication method availed to is `Github authentication`, you can use it instead of registering or login manually.

Once you are authenticated you can create, edit, view and delete the recipe you've add to the platform.

- You can login with these credentials
     email: admin@gmail.com
     password: 12345678

### How to create and edit recipes
While creating or editing a recipe use unorder list markdown format for ingredients and directions /steps that is:
>> Ingredients
`- Cocoa powder`
`- Water`
>> Directions
`- Warm the water`
`- Stir the hot water while adding cocoa powder`

### Development
- [/public]("./public") :- contains all static assets like images, css, js, svg and manifest.json
- [/src]("/src") :- contain all the code and logic
- All the routes are allocated in [/src/routes]("./src/routes")
    - `/src/routes/view.mjs` :- this contains all the views routes for rendering the handlebars templates in [/src/views]("/src/views")
    - `/src/routes/index.mjs` :- this contains all the api routes for controllers in [/src/controllers]("/src/controllers")
- `.env` :- contains all environment variables
- `/src/middleware.mjs` :- handle authentication logic 