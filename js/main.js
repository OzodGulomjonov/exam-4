let btnSun = document.querySelector(".header__btn");

btnSun.addEventListener("click", () => {
    btnSun.classList.toggle("header__btn--active");
    document.body.classList.toggle("body--dark");
});

let searchInput = document.querySelector(".form__input");
let list = document.querySelector(".list");
let templateBook = document.querySelector("#card__book").content;

let elForm = document
.querySelector(".form")
.addEventListener("submit", (event) => {
    event.preventDefault();
    
    let nameValue = searchInput.value.trim();
    
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${nameValue}`, {
    method: "GET",
})
.then((res) => res.json())
.then((data) => {
    renderLanguages(data.items, list);
});
});

function renderLanguages(array, wrapper) {
    wrapper.innerHTML = null;
    
    let span = document.querySelector(".span").textContent = array.length
    
    let fragment = document.createDocumentFragment();
    
    for (const item of array) {
        let templateItem = templateBook.cloneNode(true);
        
        templateItem.querySelector(".item__heading").textContent =
        item.volumeInfo.title;
        templateItem.querySelector(
            ".item__more-info"
            ).dataset.moreinfo = `${item.id}`;
            templateItem.querySelector(".item__img").src =
            item.volumeInfo.imageLinks.thumbnail;
            templateItem.querySelector(".item__bookmark").dataset.bookmark = item.id =
            item.volumeInfo.imageLinks.thumbnail;
            templateItem.querySelector(".item__text").textContent =
            item.volumeInfo.authors;
            templateItem.querySelector(".item__year").textContent =
            item.volumeInfo.publishedDate;
            templateItem.querySelector(".item__read").href =
            item.volumeInfo.previewLink;
            
            fragment.appendChild(templateItem);
        }
        
        wrapper.appendChild(fragment);
    }
    
    let moreInfoTemp = document.querySelector("#more-info__temp").content;
    let moreInfoWrapper = document.querySelector(".more-info__body");
    
    let item = document.querySelector(".list");
    
    list.addEventListener("click", (event) => {
        let target = event.target.dataset.moreinfo;
        
        fetch(`https://www.googleapis.com/books/v1/volumes/${target}`, {
        method: "GET",
    })
    .then((res) => res.json())
    .then((data) => {
        renderMoreInfo(data, moreInfoWrapper);
    });
});

function renderMoreInfo(array, wrapper) {
    wrapper.innerHTML = null;
    
    console.log(array);
    let fragment = document.createDocumentFragment();
    
    console.log(item.volumeInfo);
    
    let templateItem = moreInfoTemp.cloneNode(true);
    
    templateItem.querySelector(".bookmark__title").textContent =
    array.volumeInfo.authors;
    templateItem.querySelector(".item__img").src =
    array.volumeInfo.imageLinks.thumbnail;
    templateItem.querySelector(".list__item-btn").textContent =
    array.volumeInfo.authors;
    templateItem.querySelector("#qale").textContent =
    array.volumeInfo.publishedDate;
    templateItem.querySelector("#qales").textContent = array.volumeInfo.publisher;
    templateItem.querySelector("#qalesn").textContent =
    array.volumeInfo.categories;
    templateItem.querySelector("#qalesan").textContent =
    array.volumeInfo.pageCount;
    templateItem.querySelector(".item__text").textContent =
    array.volumeInfo.description;
    templateItem.querySelector("#qalesan-bro").href =
    array.volumeInfo.previewLink;
    
    fragment.appendChild(templateItem);
    
    wrapper.appendChild(fragment);
}


let orderBtn = document.querySelector(".order__btn")

orderBtn.addEventListener("click", () => {
    
    
    fetch(`https://www.googleapis.com/books/v1/volumes?q=$%7B${searchInput.value}%7D&orderBy=newest`, {
    method: "GET",
})
.then((res) => res.json())
.then((data) => {
    renderLanguages(data.items , list)
});
}
)
