
const books = [];
const RENDER_EVENT = 'render-book'
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function(){
    const submitDone = document.getElementById('inputBuku');
    submitDone.addEventListener('submit', function(event){
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function generateID() {
    return +new Date();
}

function addBook(){
    const title = document.getElementById('inputJudul').value;
    const author = document.getElementById('inputPenulis').value; 
    const year = document.getElementById('inputTahun').value;
    let isCompleted = document.getElementById('inputCheckclist');
    if (isCompleted.checked == true){
        isCompleted = true
    }else {
        isCompleted = false;
    }

    const generatedID = generateID();
    const bookObjek = generateBookObjek(generatedID, title, author, year, isCompleted);

    books.push(bookObjek);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveChanges();
}

function generateBookObjek(id, title, author, year, isCompleted){
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function(){
    
    const uncompletedBook = document.getElementById('belumSelesai');
    uncompletedBook.innerHTML = '';

    const completedBook = document.getElementById('sudahSelesai');
    completedBook.innerHTML = '';

    const editingBook = document.getElementById('')
    for (const bookItem of books) {
        const shelf = makeShelves(bookItem);
        if (!bookItem.isCompleted){
            uncompletedBook.append(shelf);
        }else{
            completedBook.append(shelf);
        }
        
    }
});

function makeShelves(bookObjek) {
    const textTitle = document.createElement('h3');
    textTitle.classList.add('judul')
    textTitle.innerText = bookObjek.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis : " + bookObjek.author;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun : " + bookObjek.year;

    const article = document.createElement('article');
    article.classList.add('book_item');
    
    
    const buttonCover = document.createElement('div');
    buttonCover.classList.add('action');
    
    if (bookObjek.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Belum Selesai';
        undoButton.addEventListener('click', function(){
            undoBookFromDone(bookObjek.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus';
        trashButton.addEventListener('click', function(){
            if (confirm('Apakah anda yakin ingin menghapus ?') == true) {
                removeBookFromDone(bookObjek.id);
                alert("Buku Berhasil Dihapus");
            }else {
                alert("Anda Membatalkan");
            }            
        });

        const editButton = document.createElement('button');
        editButton.classList.add('yellow');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', function(){
            editBook(bookObjek);
            alert('Anda mengedit buku, jg lupa untuk meng-submit kembali');
        });

        buttonCover.append(undoButton,editButton,trashButton);

    }else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = 'Selesai';

        checkButton.addEventListener('click', function(){
            addBookToDone(bookObjek.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus';
        trashButton.addEventListener('click', function(){
            if (confirm('Apakah anda yakin ingin menghapus ?') == true) {
                removeBookFromDone(bookObjek.id);
                alert("Buku Berhasil Dihapus");
            }else {
                alert("Anda Membatalkan");
            }
        });
        const editButton = document.createElement('button');
        editButton.classList.add('yellow');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', function(){
            editBook(bookObjek);
            alert('Anda mengedit buku, jg lupa untuk meng-submit kembali');
        });

        buttonCover.append(checkButton,editButton,trashButton);
    }
    article.append(textTitle,textAuthor,textYear,buttonCover);
    article.setAttribute('id', `book-${bookObjek.id}`);

    return article;
}

function addBookToDone(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveChanges();
}
function editBook(bookObjek) {
    const editDetail = bookObjek;
    console.log(editDetail);
    const editTitle = document.getElementById('inputJudul');
    editTitle.setAttribute('value', editDetail.title);
    const editAuthor = document.getElementById('inputPenulis');
    editAuthor.setAttribute('value', editDetail.author);
    const editYear = document.getElementById('inputTahun');
    editYear.setAttribute('value', editDetail.year);
    removeBookFromDone(bookObjek.id);
}
function findBook(bookId){
    for (const bookItem of books){
        if (bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function removeBookFromDone(bookId) {
    const bookTarget = findBookIndex(bookId);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveChanges();
}
   
function undoBookFromDone(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveChanges();
}

function findBookIndex(bookId){
    for (const index in books){
        if (books[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function saveChanges() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const saveData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(saveData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook() {
    let input = document.getElementById('searchBookTitle').value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName('judul');
    let y = document.getElementsByClassName('book_item');
    for (i = 0; i < x.length; i++) { 
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            y[i].style.display="none";
        }
        else {
            y[i].style.display="";                 
        }
    }
}
