# WTWR (What to Wear?): Back End

Here are the technologies that are used to make up the application

Express JS Express.js is responsible for creating the sever, creating routes, listening for http requests, & then routing those requests appropriately.

Database & Mapper MongoDB is used in conjunction with a mapper called Mongoose that's used to interact with MongoDB since Javascript is incapable of interacting with documents on its own. In this app Mongoose is used to define the shape of the documents that get stored in MongoDB via Mongoose.Schema(). Models in Mongoose are used to create, cast, store, delete, & query data.

Validation Validator.js is used to verify that certain properties in the schemas, avatar & imageUrl, are valid URLs. A 400 status code is sent if either of the two aren't legitimate with the message 'You must enter a valid URL'

Hot Reload SE Project Express uses nodemon to enable hot reloading, or the ability for the server to refresh itself whenever source code is changed.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

# Plans for Improvement

The eventual goal is to create a server with an API and user authorization. It's also be great to add additional clarity in server responses so the user is especially clear on what the probilem is and what their next steps are.

# Domain Name

saumya.jumpingcrab.com
www.saumya.jumpingcrab.com
api.saumya.jumpingcrab.com
