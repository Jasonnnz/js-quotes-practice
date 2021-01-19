//global constants
const quoteList = document.querySelector('ul#quote-list');
const form = document.querySelector('form#new-quote-form');

//functions 
fetchAllQuotes();
formEventListener();
likeDeleteEvent();

function fetchAllQuotes(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json()) //parse the Promise into readable JS code
    .then(arrOfQuotes => {
        // console.log(arrOfQuotes)
        arrOfQuotes.forEach(quote => renderQuote(quote)) //method on arrOfQuotes
        // globalArrOfQuotes = arrOfQuotes;
    })          //[quote1, quote2, quote3, ...]
}

function renderQuote(quote){ //function to render each Quote
    const li = document.createElement('li');
    li.className = 'quote-card';
    li.dataset.id = quote.id;
    const blockQuote = document.createElement('blockquote');
    blockQuote.className = 'blockquote';
    const p = document.createElement('p');
    p.className = "mb-0";
    const footer = document.createElement('footer');
    footer.className = "blockquote-footer";
    const br = document.createElement('br');
    const likeBtn = document.createElement('button');
    likeBtn.className = 'btn-success';
    const likeSpan = document.createElement('span');
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-danger';
    p.textContent = quote.quote;
    footer.textContent = quote.author;
    likeBtn.textContent = 'Likes: ';
    if (!quote.likes){
        quote.likes = []
    }
    likeSpan.textContent = quote.likes.length;
    deleteBtn.textContent = 'Delete';
    likeBtn.append(likeSpan);
    blockQuote.append(p, footer, br, likeBtn, deleteBtn);
    li.append(blockQuote);
    quoteList.append(li);
}

function formEventListener(){
    form.addEventListener('submit', function(e){
        e.preventDefault();
        // e.target.quote.value same as line below
        const newQuoteText = form.querySelector('#new-quote').value;
        const newAuthor = form.querySelector('input[name="author"]').value; //another way of getting inputfield.
        const newQuote = {
            quote: newQuoteText,
            author: newAuthor,
            // id: quoteList.childElementCount + 1,
            // likes: []
        }
        e.target.reset();
        updateDB(newQuote);
    })
}

function updateDB(newQuote){
    fetch(`http://localhost:3000/quotes/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuote),
    })
    .then(res => res.json())
    .then(data => {renderQuote(data)})
}

function likeDeleteEvent(){
    quoteList.addEventListener('click', function(e){
        if(e.target.matches('button.btn-danger')){
            let selectedQuote = e.target.closest('li');
            selectedQuote.remove();
            removeFromDB(selectedQuote);
        } else if (e.target.matches('button.btn-success')){
            let selectedQuote = e.target.closest('li');
            let newLike = {
                quoteId: parseInt(selectedQuote.dataset.id),
                createdAt: Date.now()
            }
            addLikeToDB(newLike);
            e.target.querySelector('SPAN').innerText = parseInt(e.target.querySelector('SPAN').innerText) + 1;
        }
    })
}

function removeFromDB(selectedQuote){
    fetch(`http://localhost:3000/quotes/${selectedQuote.dataset.id}`, {
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(data => console.log('Success:', data))
}

function addLikeToDB(newLike){
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLike),
    })
    .then(res => res.json())
    .then(data => console.log(data))
}
