// Dados iniciais de exemplo com tweets falsos
let tweets = [
    {
        id: 1,
        author: "Laitzkado",
        handle: "@KauaLeitzke",
        time: "Sep 26",
        text: "Alguém me dá uma makita? <3",
        likes: 1250,
        retweets: 320,
        comments: 89,
        avatar: "/img/leitzkado.png",
        liked: false,
        retweeted: false
    },
    {
        id: 2,
        author: "Paulada",
        handle: "@PauloHQ",
        time: "2h",
        text: "Doando makita véia...",
        likes: 42,
        retweets: 15,
        comments: 8,
        avatar: "/img/paulada.png",
        liked: false,
        retweeted: false
    },
    {
        id: 3,
        author: "Random",
        handle: "@RandonzinhoSilva",
        time: "4h",
        text: "Yasuo melhor hero",
        likes: 128,
        retweets: 64,
        comments: 32,
        avatar: "/img/ramdom.png",
        liked: false,
        retweeted: false
    },
    {
        id: 4,
        author: "Predo",
        handle: "@Pedro",
        time: "6h",
        text: "Sukuna sola gojo ☝🤓",
        likes: 89,
        retweets: 23,
        comments: 12,
        avatar: "/img/predo.png",
        liked: false,
        retweeted: false
    },
    {
        id: 5,
        author: "Aleatorio",
        handle: "@AleatorioSilvestre",
        time: "1d",
        text: "Alguem PT? sou main Hanabi",
        likes: 245,
        retweets: 78,
        comments: 45,
        avatar: "/img/aleatorio.png",
        liked: false,
        retweeted: false
    },
];

// Seu usuário fixo
const myUser ={
    author: "Carlos Jhonne",
    handle: "@Jones",
    avatar: "/img/jone.png"
};

// Elementos DOM
const tweetText = document.getElementById('tweet-text');
const postTweetBtn = document.getElementById('post-tweet');
const tweetFeed = document.getElementById('tweet-feed');
const charCount = document.getElementById('char-count');
const modalTweetText = document.getElementById('modal-tweet-text');
const modalPostTweetBtn = document.getElementById('modal-post-tweet');
const modalCharCount = document.getElementById('modal-char-count');
const tweetModal = document.getElementById('tweet-modal');
const closeModal = document.querySelector('.close-modal');
const tweetBtn = document.querySelector('.tweet-btn');

// Atualizar informações do usuário no sidebar
function updateUserInfo() {
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');
    const userHandle = document.querySelector('.user-handle');
    
    if (userAvatar) userAvatar.src = myUser.avatar;
    if (userName) userName.textContent = myUser.author;
    if (userHandle) userHandle.textContent = myUser.handle;
}

// Inicializar feed
document.addEventListener('DOMContentLoaded', function() {
    renderTweets();
    updateUserInfo();
    
    // Configurar eventos para o compositor de tweet principal
    setupTweetComposer(tweetText, postTweetBtn, charCount);
    
    // Configurar eventos para o compositor de tweet modal
    setupTweetComposer(modalTweetText, modalPostTweetBtn, modalCharCount);
    
    // Eventos do modal
    tweetBtn.addEventListener('click', function() {
        tweetModal.classList.add('active');
        modalTweetText.focus();
    });
    
    closeModal.addEventListener('click', function() {
        tweetModal.classList.remove('active');
    });
    
    tweetModal.addEventListener('click', function(e) {
        if (e.target === tweetModal) {
            tweetModal.classList.remove('active');
        }
    });
    
    // Permitir fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            tweetModal.classList.remove('active');
        }
    });
    
    // Configurar botões de seguir
    setupFollowButtons();
});

// Configurar compositor de tweet
function setupTweetComposer(textArea, postBtn, counter) {
    // Habilitar/desabilitar botão de postar baseado no conteúdo
    textArea.addEventListener('input', function() {
        const text = textArea.value.trim();
        const remainingChars = 280 - text.length;
        
        // Atualizar contador
        counter.textContent = remainingChars;
        
        // Mudar cor do contador baseado no número de caracteres
        if (remainingChars < 0) {
            counter.classList.add('error');
            counter.classList.remove('warning');
        } else if (remainingChars <= 20) {
            counter.classList.add('warning');
            counter.classList.remove('error');
        } else {
            counter.classList.remove('warning', 'error');
        }
        
        // Habilitar/desabilitar botão
        if (text.length > 0 && text.length <= 280) {
            postBtn.disabled = false;
        } else {
            postBtn.disabled = true;
        }
    });
    
    // Postar tweet
    postBtn.addEventListener('click', function() {
        const text = textArea.value.trim();
        if (text.length > 0 && text.length <= 280) {
            addNewTweet(text);
            textArea.value = '';
            postBtn.disabled = true;
            counter.textContent = '280';
            counter.classList.remove('warning', 'error');
            
            // Fechar modal se estiver aberto
            if (textArea === modalTweetText) {
                tweetModal.classList.remove('active');
            }
        }
    });
    
    // Permitir postar com Enter (Ctrl+Enter)
    textArea.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            const text = textArea.value.trim();
            if (text.length > 0 && text.length <= 280) {
                addNewTweet(text);
                textArea.value = '';
                postBtn.disabled = true;
                counter.textContent = '280';
                counter.classList.remove('warning', 'error');
                
                // Fechar modal se estiver aberto
                if (textArea === modalTweetText) {
                    tweetModal.classList.remove('active');
                }
            }
        }
    });
}

// Renderizar tweets no feed
function renderTweets() {
    tweetFeed.innerHTML = '';
    
    tweets.forEach(tweet => {
        const tweetElement = createTweetElement(tweet);
        tweetFeed.appendChild(tweetElement);
    });
}

// Criar elemento de tweet
function createTweetElement(tweet) {
    const tweetDiv = document.createElement('div');
    tweetDiv.className = 'tweet';
    tweetDiv.dataset.id = tweet.id;
    
    // Determinar classes para ações ativas
    const likeClass = tweet.liked ? 'like active' : 'like';
    const retweetClass = tweet.retweeted ? 'retweet active' : 'retweet';
    
    tweetDiv.innerHTML = `
        <div class="tweet-avatar">
            <img src="${tweet.avatar}" alt="Avatar de ${tweet.author}" onerror="this.src='/img/default-avatar.png'">
        </div>
        <div class="tweet-content">
            <div class="tweet-header">
                <span class="tweet-author">${tweet.author}</span>
                <span class="tweet-handle">${tweet.handle}</span>
                <span class="tweet-time">· ${tweet.time}</span>
            </div>
            <div class="tweet-text">${formatTweetText(tweet.text)}</div>
            <div class="tweet-actions">
                <div class="tweet-action comment">
                    <i class="far fa-comment"></i>
                    <span>${tweet.comments}</span>
                </div>
                <div class="tweet-action ${retweetClass}">
                    <i class="fas fa-retweet"></i>
                    <span>${tweet.retweets}</span>
                </div>
                <div class="tweet-action ${likeClass}">
                    <i class="${tweet.liked ? 'fas' : 'far'} fa-heart"></i>
                    <span>${tweet.likes}</span>
                </div>
                <div class="tweet-action share">
                    <i class="far fa-share-square"></i>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar eventos de interação
    const likeBtn = tweetDiv.querySelector('.tweet-action.like');
    likeBtn.addEventListener('click', function() {
        toggleLike(tweet.id);
    });
    
    const retweetBtn = tweetDiv.querySelector('.tweet-action.retweet');
    retweetBtn.addEventListener('click', function() {
        toggleRetweet(tweet.id);
    });
    
    const commentBtn = tweetDiv.querySelector('.tweet-action.comment');
    commentBtn.addEventListener('click', function() {
        // Focar no compositor de tweet e adicionar menção
        tweetText.focus();
        tweetText.value = `@${tweet.handle} `;
        tweetText.dispatchEvent(new Event('input'));
    });
    
    return tweetDiv;
}

// Formatar texto do tweet (destacar hashtags e menções)
function formatTweetText(text) {
    // Destacar hashtags
    text = text.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
    
    // Destacar menções
    text = text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
    
    // Destacar links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<span class="link">$1</span>');
    
    return text;
}

// Adicionar novo tweet
function addNewTweet(text) {
    const newTweet = {
        id: tweets.length + 1,
        author: myUser.author,
        handle: myUser.handle,
        time: "Agora",
        text: text,
        likes: 0,
        retweets: 0,
        comments: 0,
        avatar: myUser.avatar,
        liked: false,
        retweeted: false
    };
    
    tweets.unshift(newTweet);
    renderTweets();
    
    // Mostrar mensagem de sucesso
    showNotification("Tweet postado com sucesso!");
}

// Alternar curtida
function toggleLike(tweetId) {
    const tweetIndex = tweets.findIndex(tweet => tweet.id === tweetId);
    if (tweetIndex !== -1) {
        const tweet = tweets[tweetIndex];
        const likeBtn = document.querySelector(`.tweet[data-id="${tweetId}"] .tweet-action.like`);
        const likeIcon = likeBtn.querySelector('i');
        const likeCount = likeBtn.querySelector('span');
        
        if (!tweet.liked) {
            // Curtir
            likeIcon.classList.remove('far');
            likeIcon.classList.add('fas');
            likeBtn.classList.add('active');
            tweet.likes += 1;
            tweet.liked = true;
        } else {
            // Descurtir
            likeIcon.classList.remove('fas');
            likeIcon.classList.add('far');
            likeBtn.classList.remove('active');
            tweet.likes -= 1;
            tweet.liked = false;
        }
        
        likeCount.textContent = tweet.likes;
    }
}

// Alternar retweet
function toggleRetweet(tweetId) {
    const tweetIndex = tweets.findIndex(tweet => tweet.id === tweetId);
    if (tweetIndex !== -1) {
        const tweet = tweets[tweetIndex];
        const retweetBtn = document.querySelector(`.tweet[data-id="${tweetId}"] .tweet-action.retweet`);
        const retweetCount = retweetBtn.querySelector('span');
        
        if (!tweet.retweeted) {
            // Fazer retweet
            retweetBtn.classList.add('active');
            tweet.retweets += 1;
            tweet.retweeted = true;
            
            // Mostrar mensagem de sucesso
            showNotification("Retweet realizado!");
        } else {
            // Desfazer retweet
            retweetBtn.classList.remove('active');
            tweet.retweets -= 1;
            tweet.retweeted = false;
        }
        
        retweetCount.textContent = tweet.retweets;
    }
}

// Configurar botões de seguir
function setupFollowButtons() {
    document.querySelectorAll('.follow-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent === 'Seguir') {
                this.textContent = 'Seguindo';
                this.classList.add('following');
                
                // Mostrar mensagem de sucesso
                const username = this.closest('.follow-suggestion').querySelector('.username').textContent;
                showNotification(`Agora você está seguindo ${username}`);
            } else {
                this.textContent = 'Seguir';
                this.classList.remove('following');
            }
        });
    });
}

// Mostrar notificação
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}