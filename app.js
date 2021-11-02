const root = document.getElementById('root');

const tweetItems = document.getElementById('tweetItems');
const modifyItem = document.getElementById('modifyItem');
const addTweetButton = document.querySelector('.addTweet');
const saveModifiedItem = document.getElementById('saveModifiedItem');
const textArea = document.getElementById('modifyItemInput');
const list = document.getElementById('list');
const navigationButtons = document.getElementById('navigationButtons');
const h1 = document.getElementsByTagName('h1')[0];
const modifyItemHeader = document.getElementById('modifyItemHeader');
const cancelModification = document.getElementById('cancelModification');

const backButton = document.createElement('button');
backButton.classList.add('back');
backButton.classList.add('hidden');
backButton.innerText = 'back';
navigationButtons.appendChild(backButton);

const likedButton = document.createElement('button');
likedButton.innerText = 'Go to liked';
isVisibleLikedButton();

navigationButtons.appendChild(likedButton);

cancelModification.addEventListener('click', () => {
  mainPage();
  textArea.value = '';
});

function isVisibleLikedButton() {
  const isVisible = Object.keys(localStorage).some(function (key) {
    let obj = localStorage.getItem(key);
    obj = JSON.parse(obj);
    const isLiked = obj.liked;
    return isLiked;
  });
  if (isVisible) {
    likedButton.classList.remove('hidden');
  } else {
    likedButton.classList.add('hidden');
  }
}

let state = {
  buttonText: 'Initial text'
};

function mainPage() {
  const tweetLi = document.querySelectorAll('.tweetLi');
  tweetLi.forEach((div) => {
    div.classList.remove('hidden');
  });
  tweetItems.classList.remove('hidden');
  modifyItem.classList.add('hidden');
  history.pushState({ link: 'mainPage' }, null, '');
}

function newTweetPage() {
  modifyItemHeader.innerText = 'New Tweet';
  const tweetLi = document.querySelectorAll('.tweetLi');
  tweetItems.classList.add('hidden');
  modifyItem.classList.remove('hidden');
  tweetLi.forEach((div) => {
    div.classList.add('hidden');
  });
  history.pushState({ link: 'add' }, null, '#add');
}

function editTweetPage(id) {
  modifyItemHeader.innerText = 'Edit Tweet';
  const tweetLi = document.querySelectorAll('.tweetLi');
  tweetItems.classList.add('hidden');
  modifyItem.classList.remove('hidden');
  tweetLi.forEach((div) => {
    div.classList.add('hidden');
  });
  history.pushState({ link: 'edit' }, null, '#edit/' + id);
}

addTweetButton.addEventListener('click', newTweetPage);

window.addEventListener('popstate', (e) => {
  if (e.state.link === 'mainPage') {
    tweetItems.classList.remove('hidden');
    modifyItem.classList.add('hidden');
  }
  if (e.state.link === 'add') {
    tweetItems.classList.add('hidden');
    modifyItem.classList.remove('hidden');
  }
});

function renderTweets() {
  Object.keys(localStorage)
    .sort(function (a, b) {
      return Number(a) - Number(b);
    })
    .forEach(function (key, i) {
      let obj = localStorage.getItem(key);
      obj = JSON.parse(obj);
      const text = obj.text;
      const isLiked = obj.liked;
      const id = i;
      if (obj.hidden) {
        return;
      }
      displayNewTweet(text, id, isLiked);
    });
}

window.onload = () => history.replaceState({ link: 'mainPage' }, null, '');
window.onload = () => renderTweets();

function displayNewTweet(text, id, isLiked = false) {
  const tweetLi = document.createElement('li');
  tweetLi.classList.add('tweetLi');
  tweetLi.classList.add('tweetLi-' + id);
  const tweetText = document.createElement('p');
  tweetText.classList.add('edit-' + id);
  tweetText.innerText = text;
  tweetText.addEventListener('click', () => edit(id));
  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-' + id);
  removeButton.innerText = 'remove';
  removeButton.addEventListener('click', () => remove(id));
  const likeButton = document.createElement('button');
  likeButton.classList.add('like-' + id);
  likeButton.innerText = isLiked ? 'unlike' : 'like';
  likeButton.addEventListener('click', () => like(id));
  tweetLi.appendChild(tweetText);
  tweetLi.appendChild(removeButton);
  tweetLi.appendChild(likeButton);
  list.appendChild(tweetLi);
}

function saveTweet(id) {
  const maxLength = 140;
  const text = textArea.value;
  if (text.length === 0) {
    return;
  }
  if (text.length > maxLength) {
    return;
  }
  let isSame = false;
  Object.keys(localStorage).forEach((key) => {
    let obj = localStorage.getItem(key);
    obj = JSON.parse(obj);
    const oldText = obj.text;
    if (oldText === text) {
      popUp('same', id);
      isSame = true;
    }
  });
  if (isSame) {
    return;
  }
  const value = { text: text, liked: false, id: id };
  localStorage.setItem(id, JSON.stringify(value));
  textArea.value = '';
}

saveModifiedItem.addEventListener('click', function () {
  let hash = window.location.hash;
  hash = hash.split('/')[1];
  let id;
  if (hash) {
    id = hash;
  } else {
    id = localStorage.length;
  }
  saveTweet(id);
  list.innerHTML = '';
  renderTweets();
  mainPage();
});

function like(id) {
  const tweetString = localStorage.getItem(id);
  const tweetObject = JSON.parse(tweetString);
  const isLiked = !tweetObject.liked;
  tweetObject.liked = isLiked;
  const likeButton = document.querySelector('.like-' + id);
  localStorage.setItem(id, JSON.stringify(tweetObject));
  likeButton.innerText = isLiked ? 'unlike' : 'like';
  popUp(isLiked, id);
  isVisibleLikedButton();
}

function remove(id) {
  const tweetLi = document.querySelector('.tweetLi-' + id);
  const value = { text: '', liked: false, id: id, hidden: true };
  localStorage.setItem(id, JSON.stringify(value));
  tweetLi.classList.add('hidden');
}

function edit(id) {
  editTweetPage(id);
  const tweetString = localStorage.getItem(id);
  const tweetObject = JSON.parse(tweetString);
  const tweetText = tweetObject.text;
  textArea.value = tweetText;
}

likedButton.addEventListener('click', displayLikedPage);

function displayLikedPage() {
  likedButton.classList.add('hidden');
  addTweetButton.classList.add('hidden');
  h1.innerText = 'Liked Tweets';
  list.innerHTML = '';
  backButton.classList.remove('hidden');
  backButton.addEventListener('click', () => {
    h1.innerText = 'Simple Twitter';
    list.innerHTML = '';
    backButton.classList.add('hidden');
    likedButton.classList.remove('hidden');
    addTweetButton.classList.remove('hidden');
    renderTweets();
  });
  renderLikedTweets();
  history.pushState({ link: 'liked' }, null, '#liked');
}

function renderLikedTweets() {
  Object.keys(localStorage)
    .sort(function (a, b) {
      return Number(a) - Number(b);
    })
    .forEach(function (key, i) {
      let obj = localStorage.getItem(key);
      obj = JSON.parse(obj);
      const text = obj.text;
      const isLiked = obj.liked;
      const id = i;
      if (obj.hidden) {
        return;
      }
      if (!obj.liked) {
        return;
      }
      displayNewTweet(text, id, isLiked);
    });
}

function popUp(why, id) {
  const timeOut = 2000;
  const message = document.createElement('div');
  root.appendChild(message);
  message.classList.add('popUp');
  if (why === 'same') {
    message.innerText = 'Error! You cannot tweet about that';
  }
  if (why === true) {
    message.innerText = `Hooray, You liked tweet with id ${id}`;
  }
  if (why === false) {
    message.innerText = `Sorry, you no longer like tweet with id ${id}`;
  }
  setTimeout(() => {
    root.removeChild(message);
  }, timeOut);
}
