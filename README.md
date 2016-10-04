# BasicLogin
A session-less authentication strategy in node js

Routes are defined in `routes/users.js`.

Command to start the server : `npm start`.

A post request to `/register` with params `username` and `password` creates a new user in the database.

A post request to `/login` with the same params logs in the user i.e. creates a cookie with the token signed with the user data.

A get request to `/authenticate` checks if cookie exists and if it does, gets the token and then extracts user data from it and shows. Otherwise throws error.

If a user let's say `foo` hasn't logged in, then when he calls the `/authenticate` route, two things can happen:

1. He gets an error when the relevant cookie hasn't been created at all.
2. He gets shown the data of the previous user who was logged in whose cookie/token hasn't expired yet. The expiry right now is 1 day for both token and cookie which can be changed.