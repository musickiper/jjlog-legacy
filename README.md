# jjlog-legacy

This is the first version of my blog application. 
This application allowed me 
to do authentication, to upload my posts of projects, to get comments from other people, and to get email from other people.

## Table of contents
- [Demo](#demo)
- [Quick Start](#quick-start)
- [Documentation](#documentation)

## Demo
![screencast](demo.gif)

## Quick Start
### To run locally:
```
git clone https://github.com/musickiper/jjlog-legacy.git
cd jjlog-legacy/
npm install
npm start
```

### To get started developing right away:
```
install all project dependencies with npm install
start the development server with npm start or yarn start
```

### To build & deploy on firebase:
```
npm run build && npm run deploy
```

## Documentation

### Tach Stack
#### Front
- HTML
- CSS
- JavaScript
- EJS Template
- CKEditor

#### Back
- Express.js
- Passport.js
- JWT
- Facebook Token
- MongoDB
- NodeMailer

### Functionality (requirements)
* Write, edit, and delete a post
* Get feedback on the post by other users
* Get an email from other users
* Auth using `Passport.js`, `JWT`, and `Facebook Token`
