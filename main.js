let elInput = document.querySelector(".header__input")
let elTemplate = document.querySelector("#bookTem").content
let elWrapper = document.querySelector(".books__list")
let elResult = document.querySelector(".result__num")
let elForm = document.querySelector(".header__input-wrapper")
let elBookmarkTemplate = document.querySelector("#bookmarkTem").content
let elBookmarkWrapper = document.querySelector(".bookmarks__list")
let localSaved = JSON.parse(localStorage.getItem("saved"))
let saved = []

if (localSaved) {
    saved = localSaved
    bookmarkRender(saved)
}else{
    saved = []
}


elForm.addEventListener("submit" , function (evt) {
    evt.preventDefault()
    
    if (elInput.value.length > 1) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${elInput.value}`)
        .then(req => req.json())
        .then(data => {
            render(data.items)
            elResult.textContent = data.totalItems
        })
    }
})

function render(array) {
    if (array) {
        elWrapper.innerHTML = null
        let fragment = document.createDocumentFragment()
        for (let i = 0; i < array.length; i++) {
            let template = elTemplate.cloneNode(true)
            
            if (array[i].volumeInfo.imageLinks) {
                template.querySelector(".books__top-img").src = array[i].volumeInfo.imageLinks.thumbnail
            }else{
                template.querySelector(".books__top-img").src = "https://picsum.photos/453/300"
            }
            template.querySelector(".books__item-heading").textContent = array[i].volumeInfo.title
            template.querySelector(".books__item-auth").textContent = array[i].volumeInfo.authors
            template.querySelector(".books__item-year").textContent = array[i].volumeInfo.publishedDate
            template.querySelector(".books__bookmark-btn").dataset.bookmarkId = array[i].id
            template.querySelector(".books__read-btn").href = array[i].accessInfo.webReaderLink
            template.querySelector(".books__info-btn").dataset.infoId = array[i].id
            template.querySelector(".books__read-btn").dataset.readId = array[i].id
            
            fragment.appendChild(template)
        }
        elWrapper.appendChild(fragment)
    }
}


function bookmarkRender(array) {
    elBookmarkWrapper.innerHTML = null
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < array.length; i++) {
        let template = elBookmarkTemplate.cloneNode(true)
        
        if (array[i].volumeInfo.title) {
            template.querySelector(".bookmarks__left-heading").textContent = array[i].volumeInfo.title
        }
        if (array[i].volumeInfo.authors) {
            template.querySelector(".bookmarks__left-auth").textContent = array[i].volumeInfo.authors[0]
        }
        if (array[i].accessInfo.webReaderLink) {
            template.querySelector(".bookmarks__bookmark-btn").href = array[i].accessInfo.webReaderLink
        }
        template.querySelector(".bookmarks__delete-btn").dataset.deleteId = array[i].id
        template.querySelector(".bookmarks__item").classList.add(`del${array[i].id}`)
        template.querySelector(".bookmarks__delete-icon").dataset.deleteId = array[i].id
        fragment.appendChild(template)
    }
    elBookmarkWrapper.appendChild(fragment)
}

elWrapper.addEventListener("click" , function (evt) {
    let current = evt.target.dataset 
    if (current.infoId) {
        document.querySelector(".modal__wrapper").style.transform = "translateX(0)"
        document.querySelector("html").style.overflowY = "hidden"
        document.querySelector("body").style.overflowY = "hidden"
        fetch(`https://www.googleapis.com/books/v1/volumes/${current.infoId}`)
        .then(req => req.json())
        .then(data => renderModal(data))
        
        function renderModal(array) {
            document.querySelector(".modal__heading").textContent = array.volumeInfo.title
            document.querySelector(".modal__middle-img").src = array.volumeInfo.imageLinks.thumbnail
            document.querySelector(".modal__middle-info").textContent = array.volumeInfo.description
            let wrapperAuth = document.querySelector(".author")
            wrapperAuth.innerHTML = null
            if (array.volumeInfo.authors) {
                for (let i = 0; i < array.volumeInfo.authors.length; i++) {
                    let newSpan = document.createElement("span")
                    newSpan.classList.add("modal__bottom-atrib")
                    newSpan.textContent = array.volumeInfo.authors[i]
                    wrapperAuth.appendChild(newSpan)
                }
            }
            let wrapperYear = document.querySelector(".year")
            wrapperYear.innerHTML = null
            if (array.volumeInfo.publishedDate) {
                for (let i = 0; i < 1; i++) {
                    let newSpan = document.createElement("span")
                    newSpan.classList.add("modal__bottom-atrib")
                    newSpan.textContent = array.volumeInfo.publishedDate.split("-")[0]
                    wrapperYear.appendChild(newSpan)
                }
            }
            let wrapperPublisher = document.querySelector(".publisher")
            wrapperPublisher.innerHTML = null
            if (array.volumeInfo.publisher) {
                for (let i = 0; i < 1; i++) {
                    let newSpan = document.createElement("span")
                    newSpan.classList.add("modal__bottom-atrib")
                    newSpan.textContent = array.volumeInfo.publisher.split("-")[0]
                    wrapperPublisher.appendChild(newSpan)
                }
            }
            let wrapperCategories = document.querySelector(".catergories")
            wrapperCategories.innerHTML = null
            if (array.volumeInfo.categories) {
                for (let i = 0; i < array.volumeInfo.categories[0].split("/").length; i++) {
                    let newSpan = document.createElement("span")
                    newSpan.classList.add("modal__bottom-atrib")
                    newSpan.textContent = array.volumeInfo.categories[0].split("/")[i]
                    wrapperCategories.appendChild(newSpan)
                }
            }
            let wrapperPage = document.querySelector(".page")
            wrapperPage.innerHTML = null
            if (array.volumeInfo.pageCount) {
                for (let i = 0; i < 1; i++) {
                    let newSpan = document.createElement("span")
                    newSpan.classList.add("modal__bottom-atrib")
                    newSpan.textContent = array.volumeInfo.pageCount
                    wrapperPage.appendChild(newSpan)
                }
            }
            let elBtn = document.querySelector(".modal__read-btn")
            elBtn.href = array.accessInfo.webReaderLink
            let elCross = document.querySelector(".modal__cross")
            elCross.addEventListener("click" , function () {
                document.querySelector(".modal__wrapper").style.transform = "translateX(100%)"
                document.querySelector("html").style.overflowY = "auto"
                document.querySelector("body").style.overflowY = "auto"
            })
        }
    }
    if (current.bookmarkId) {
        fetch(`https://www.googleapis.com/books/v1/volumes/${current.bookmarkId}`)
        .then(req => req.json())
        .then(data => {
            let isTrue = saved.find(function (item) {
                return item.id == current.bookmarkId
            })
            if (!isTrue) {
                saved.push(data)
                bookmarkRender(saved)
                localStorage.setItem("saved" , JSON.stringify(saved))
            }
        })
    }
})

let elOrder = document.querySelector(".result__btn")

elOrder.addEventListener("click" , function () {
    if (elInput.value.length > 1) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${elInput.value}&orderBy=newest`)
        .then(req => req.json())
        .then(data => {
            render(data.items)
            elResult.textContent = data.totalItems
        })
    }
})

elBookmarkWrapper.addEventListener("click" , function (evt) {
    let current = evt.target.dataset.deleteId

    if (current) {
        let elDel = document.querySelector(`.del${current}`)
        elDel.remove()
        let index = saved.indexOf(
            saved.find(function (item) {
                return item.id == current
            })
        )
        saved.splice(index , 1)
        localStorage.setItem("saved" , JSON.stringify(saved))
    }
})
