# 🗓 Interview Scheduler 

## 🔎 Overview

Interview Scheduler is a simple, single page app built in React.js that allows a user to book, edit and cancel interviews. Using Web Sockets, concurrent users can see changes made by other users instantaneously. 

The database of the app has been uploaded to Heroku, while the client side has been set up for continuous integration through CircleCI, which uploads the production build to Netlify.

To see and interact with the app, simply visit the following link:

https://5de6c763d46ef00007b351aa--flamboyant-kirch-ec7525.netlify.com/

Please allow up to 10 seconds for the Heroku database to wake up from standby and render the page with information.

## 📸 Snapshots 

### Add a new interview

!["Adding an interview"](https://i.imgur.com/dH1DFRR.gif)

_____
### Delete an interview

!["Deleting an interview"](https://i.imgur.com/ZRst6yz.gif)

_____
### Select different days

!["Changing days"](https://i.imgur.com/Pi3xGnX.gif)
_____

## 🛠 Setup

To play around with and edit the code, follow these instructions:

1. Clone the repository in a local folder

2. Install dependencies with `npm install`

3. Clone and setup the server side from https://github.com/hexular/scheduler-api

4. Once the Scheduler-api is set up, run it from the root directory with `npm start`

5. Run the Scheduler app from its root directory with `npm start`

6. Go to http://localhost:8000 in your browser to interact with the app

## ⚙️ Dependencies 

- axios: ^0.19.0
- classnames: ^2.2.6
- cypress: ^3.7.0
- normalize.css: ^8.0.1
- react: ^16.12.0
- react-dom: ^16.9.0
- react-scripts: 3.0.0
- @babel/core: ^7.4.3
- @storybook/addon-actions: ^5.0.10
- @storybook/addon-backgrounds: ^5.0.10
- @storybook/addon-links: ^5.0.10
- @storybook/addons: ^5.0.10
- @storybook/react: ^5.0.10
- @testing-library/jest-dom: ^4.0.0
- @testing-library/react: ^8.0.7
- @testing-library/react-hooks: ^3.2.1
- babel-loader: ^8.0.5
- node-sass: ^4.13.0
- prettier: ^1.19.1
- prop-types: ^15.7.2
- react-test-renderer: ^16.12.0
