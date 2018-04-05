- Add `.od#` files to your `.gitignore` file

- In`server.js`:
  - If you are going to use group variable assignment then include ` express`, `app`, and `db` as well.
  - why are you creating a global variable in line 21 that is used only once?
  - indent lines 16 - 22 properly
  - indent lines 44 - 46 properly
  - remove unused or commented out code at line 56
  - why are you switching to es6 from lines 64 - 83?
  - indent line 87 properly
  - fix the whole weird indentation from lines 106 - 130
  - if a user doesn't log in correctly they only get a 400 error? redirect them to the form again.
  - remove unused or commented out code at line 175 - 183
  - fix your indentation from lines 197 to 245. This code is unreadable and is not clean.
  - it doesn't make sense to use a `put` request for this action.
  - in `GET /trips/:id` you are calling your db twice - one for Trip and one for Post. You set up a join table Post - call `populate('trip_id')` on your Post that you've found via user_id. Use your database to its fullest potential.
  - what is `POST /search` doing?
  - don't use loose equality in javascript on line 381
  - your indentation is ruining the ability to read this file.  I highly suggest you turn on a linter or beautifier to improve your code appearance.


- In `/models`:
  - use proper indentation in all of these files.
  - if you're going to set up a join table for Post then use it properly (calling populate when necessary)

- In `/public/scripts/app.js`:
  - indent 18 - 47 properly
  - your ajax requests... indent them properly

- In `/public/scripts/home.js`:
  - indent all of your code properly.
  - assign your string literals to variables and pass the variables in your append calls to make your function smaller and easier to read.
  - using the route `/trips/null` is a bad idea. refactor this.
  - are you using `map` and `map_id` anywhere?

- In `/public/scripts/home.js`:
  - you need to insert blank space between event listeners.  It is really difficult to read.
  - avoid alerts. they have no function and don't help the user ultimately.


-In `views/`:
  - if you're going to use `ejs` templating then you should strongly consider creating a layout system that houses the html head, footer, etc. instead of each file reloading head files and dependencies.


- Using the application:
  - I am unable to successfully upload images.
  - When I go to search and a place, then what do i do?
  - the password and password confirm can be different and I can still create a user
  - As a user am I able to see other user's trips?
  - The description input field is too small. Use a text-area instead.
  - There are no instructions or indication how I should use this app.
