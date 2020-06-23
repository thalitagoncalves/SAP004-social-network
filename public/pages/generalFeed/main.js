import {
  logOut,
  createPost,
  readPost,
  editPost,
  deletePost,
  sendImageToDatabase,
  changeProfileImage,
} from './data.js';

// Funções auxiliares chamadas na criação do template da página (function generalFeed())
const setLogOutOnButton = () => {
  document.querySelector('.signOut').addEventListener('click', (event) => {
    event.preventDefault();
    logOut();
  });
};

const getTextToPublish = () => {
  document.querySelector('#publish-btn').addEventListener('click', () => {
    const text = document.querySelector('#postText').value;
    createPost(text);
  });
};

const setUserData = () => {
  firebase.auth().onAuthStateChanged((user) => {
    document.querySelector('#name-user').innerHTML = user.displayName;
    document.querySelector('.photo').src = user.photoURL;
  });
};

const deleteEvent = (postBox, code) => {
  const deleteBtn = postBox.querySelector(`button[data-id="${code}"]`);
  deleteBtn.addEventListener('click', () => deletePost(code));
};


const setNewProfileImg = (newfile) => {
  document.querySelector('.photo').src = newfile;
};

const sendNewProfileImg = (callbackToSetNewImage) => {
  document.querySelector('.photo').addEventListener('click', () => {
    const inputFile = document.querySelector('#input-file-profileImg');
    inputFile.style.opacity = 1;
    inputFile.onchange = (event) => {
      changeProfileImage(event.target.files[0], callbackToSetNewImage);
      inputFile.style.opacity = 0;
    };
  });
};

const showUrlOfImagesToPublish = (urlFile) => {
  document.querySelector('#postText').value = `${urlFile}`;
};

const uploadImage = () => {
  document.querySelector('.publish-img-form-box').style.opacity = 1;
  document.querySelector('#image_uploads').onchange = event => sendImageToDatabase(event.target.files[0], showUrlOfImagesToPublish);
};

const getUpLoadImgClick = () => document.querySelector('#publish-img-btn').addEventListener('click', uploadImage);


// Funções auxiliares chamadas na criação dos posts individuais (loadPostTemplate)
const getValuesFromEditedPost = (listener, newText, postID) => listener.addEventListener('click', () => {
  editPost(newText.value, postID.value);
});

const setEditPostClick = (element) => {
  element.querySelector('.edit-btn').addEventListener('click', () => {
    element.querySelector('.text').removeAttribute('disabled');
    element.querySelector('.save-btn-area').classList.remove('display-none');
    getValuesFromEditedPost(element.querySelector('.edit-save-btn'), element.querySelector('.text'), element.getElementsByTagName('data')[0]);
  });
};

const visibilityOfElementsToCurrentUser = (postBox, user) => {
  if (user !== firebase.auth().currentUser.email) {
    postBox.querySelector('.delete-btn').classList.add('visibility');
    postBox.querySelector('.edit-btn').classList.add('visibility');
  }
};


// Criação dos templates das postagens individuais
const loadPostTemplate = (postList) => {
  document.querySelector('#post-area').innerHTML = '';
  postList.forEach(({
    user,
    data,
    text,
    code,
  }) => {
    const postBox = document.createElement('div');
    postBox.innerHTML = `
  <data value=${code}></data>
  <header class='title-post-box'>
    <div>
      <div>${user}</div>
      <div>${data}</div>
    </div>
    <div>
      <button class='delete-btn' data-id='${code}'><img class='post-area-icon-del' src="../../assets/quit.png" alt="Edit Icon">
      </button>
    </div>
  </header>

  <textarea disabled class='text post-area-text'>${text}</textarea>
  <div class='save-btn-area display-none''>
    <button class='edit-save-btn' type='button'>Salvar</button>
  </div>
  
  <footer class='footer-post-box'>
    <div><img id='comment-btn' class='post-area-icon' src="../../assets/comments.png" alt="Comments Icon"></div>
    <div><img class='post-area-icon' id='like-icon' src="../../assets/like.png" alt="Like Icon"></div>
    <div class='post-area-icon' id='likes-counter'></div>
    <div class='edit-btn'><img class='post-area-icon' src="../../assets/pencil.png" alt="Edit Icon"></div>
  </footer>
  `;
    postBox.classList.add('post-area');
    document.querySelector('#post-area').appendChild(postBox);

    // Chamada das funções
    visibilityOfElementsToCurrentUser(postBox, user);
    deleteEvent(postBox, code);
    setEditPostClick(postBox);
  });
};

// Função executada com o carregamento da página:
export const generalFeed = () => {
  document.querySelector('#root').innerHTML = '';
  const containerFeed = document.createElement('div');
  containerFeed.innerHTML = `
  <header>
    <nav class='navbar-page-feed'>
      <div>
        <button class='circle orange'>
        <img class='icon-circle' src='../../assets/settings.png'>
        </button>
      </div>
      <figure class='navbar-page-item-logo'>
        <img class='icon-logo' src="../../assets/logo_small.jpg" alt="Logotipo">
        <span>Rainbow!</span>
      </figure>
      <div>
        <button class='circle signOut yellow'>
        <img class='icon-circle' src='../../assets/logout.png'>
        </button>
      </div>
    </nav>
  </header>
  <div class='box-feed'>
    <section class='profile-area'>
      <div class='profile-area-theme'></div>
        <figure class='profile-area-photo-box'>
           <img class='photo'>
           <input type="file" id="input-file-profileImg" class='input-file-profileImg transparency' accept=".jpg, .jpeg, .png">
        </figure>
        <div class='name-profile-area'>
          <h3 id='name-user'></h3>
          <h4>[Descrição]</h4>
        </div>
    </section>
      <div class='share-and-post'>
        <section class='share-area'>
          <textarea id='postText' placeholder='O que você quer compartilhar?'></textarea>
           <div class='share-area-buttons'>
            <button id='publish-img-btn' class='circle violet'><img class='icon-circle' src='../../assets/camera.png'></button>
            <div class='publish-img-form-box transparency'>
              <form method="post">
                <input type="file" id="image_uploads" class='share-area-img-btn' accept=".jpg, .jpeg, .png">
               </form>
            </div>
            <button id='publish-btn' class='btn btn-small publish-btn purple'>Publicar</button>
          </div>
        </section>
        <section id='post-area' class='posts-container'>
        </section>
      </div>
  </div>
  `;
  document.querySelector('#root').appendChild(containerFeed);

  // Chamada das funções
  setLogOutOnButton();
  setUserData();
  sendNewProfileImg(setNewProfileImg);
  getTextToPublish();
  getUpLoadImgClick();
  readPost(loadPostTemplate);
};