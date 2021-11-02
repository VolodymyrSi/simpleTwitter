### Simple Twitter

[This app lives here](https://volodymyrsi.github.io/simpleTwitter/)

##### Welcome to my super minimalist and egoist *(as you can't read other's thoughts or share your thoughts with anyone)* app.

##### What this app does is it keeps track of user's inputs and allows the user to access their tweets after a page was closed or refreshed.


- The project is vanilla js and almost no css. I also challenged myself to use as little html as possible here, so, here comes. 

- Local storage is used to do most tasks, the tweets are stored as objects which are JSON stringified/parsed.

- The input is validated - tweets must be unique, they can't be empty or exceed 140 characters.

- User can like and unlike tweets(toggles a boolean variable in a tweet object). There is a favourites page where user gets to see the liked tweets only.

- Finally there is a remove button which deletes a tweet from the screen.
