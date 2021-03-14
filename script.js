async function loadProducts() {
  let json = [];
  let load = false;
  if (mapItems.size === 0) {
    let response = await fetch(
      "https://gist.githubusercontent.com/jhonatan89/719f8a95a8dce961597f04b3ce37f97b/raw/4b7f1ac723a14b372ba6899ce63dbd7c2679e345/products-ecommerce",
    );
    json = await response.json();
    json = json.items;
    load = true;
  } else {
    mapItems.forEach((element) => {
      json.push(element);
    });
  }
  console.log(json);

  let list = document.querySelector("body > main > div.list-products");

  json.forEach((element) => {
    if (load) {
      mapItems.set(element.id, element);
    }

    let card = redenderObject(element);

    list.appendChild(card);
  });
}

function openDetail(id) {
  console.log(id);
  let list = document.querySelector("body > main > div.list-products");
  list.innerHTML = "";
  list.style.display = "none";

  let divFav = document.querySelector("body > main > div.favorites");
  divFav.innerHTML = "";
  divFav.style.display = "none";

  let detail = document.querySelector("body > main > div.detail");
  detail.innerHTML = "";
  detail.style.display = "block";

  let detailElement = mapItems.get(id);

  let breadcrumb = document.createElement("p");
  breadcrumb.innerText = detailElement.categories.join(" > ");
  breadcrumb.className = "breadcrumb";

  let content = document.createElement("div");
  content.className = "content";

  let img = document.createElement("img");
  img.src = detailElement.picture;
  img.className = "img-detail";

  let title_description = document.createElement("p");
  title_description.innerText = "Descipción del producto";
  title_description.className = "title-decription";

  let description = document.createElement("p");
  description.innerText = detailElement.description;
  description.className = "description";

  let extraInfo = document.createElement("p");
  extraInfo.innerText =
    detailElement.condition + " | " + detailElement.sold_quantity + " vendidos";
  extraInfo.className = "extraInfo";

  let title = document.createElement("p");
  title.innerText = detailElement.title;
  title.className = "title";

  let price = document.createElement("p");
  price.innerText =
    "$ " +
    new Intl.NumberFormat({
      style: "currency",
      currency: detailElement.price.currency,
    }).format(detailElement.price.amount);
  price.className = "price";

  let buy = document.createElement("div");
  buy.innerText = "Compra";
  buy.className = "buyBtn text-center pt-1";
  buy.setAttribute("data-bs-toggle", "modal");
  buy.setAttribute("data-bs-target", "#exampleModal");

  let fav = document.createElement("div");
  if (favorites.indexOf(id) === -1) {
    fav.innerText = "Añadir a favoritos";
  } else {
    fav.innerText = "Quitar de favoritos";
  }
  fav.className = "favBtn text-center pt-1";
  fav.addEventListener("click", () => {
    addFavorite(id, fav);
    console.log(favorites);
  });

  let popUp_title = document.querySelector(
    "#exampleModal > div > div > div.modal-body.text-center > p",
  );
  popUp_title.innerText = detailElement.title;

  content.appendChild(img);
  content.appendChild(title_description);
  content.appendChild(description);
  content.appendChild(extraInfo);
  content.appendChild(title);
  content.appendChild(price);
  content.appendChild(buy);
  content.appendChild(fav);

  detail.appendChild(breadcrumb);
  detail.appendChild(content);

  let offset = description.clientHeight - 170;
  console.log(offset);
  if (offset > 0) {
    content.style.height = 852 + offset + "px";
  } else {
    content.style.height = 852 + "px";
  }

  offset = title.clientHeight - 31;
  if (offset > 0) {
    price.style.top = 177 + offset + "px";
    buy.style.top = 258 + offset + "px";
    fav.style.top = 327 + offset + "px";
  } else {
    price.style.top = 177 + "px";
    buy.style.top = 258 + "px";
    fav.style.top = 327 + "px";
  }
}

function openFavorites() {
  let list = document.querySelector("body > main > div.list-products");
  list.innerHTML = "";
  list.style.display = "none";

  let detail = document.querySelector("body > main > div.detail");
  detail.innerHTML = "";
  detail.style.display = "none";

  let divFav = document.querySelector("body > main > div.favorites");
  divFav.innerHTML = "";
  divFav.style.display = "block";

  selected = [];
  inputCkecbox = [];

  let titleFavorite = document.createElement("b");
  titleFavorite.innerText = "Favoritos";
  titleFavorite.className = "titleFavorite";

  let headerFav = document.createElement("div");
  headerFav.className = "headerFav";

  let checkHeader = document.createElement("input");
  mainCheck = checkHeader;
  checkHeader.className = "form-check-input";
  checkHeader.type = "checkbox";
  checkHeader.value = "";
  checkHeader.addEventListener("click", () => {
    selectAll();
  });

  let deleteBtn = document.createElement("div");
  deleteBtn.innerText = "Eliminar";
  deleteBtn.className = "deleteBtn text-center";
  deleteBtn.addEventListener("click", () => {
    deleteSelected();
  });

  headerFav.appendChild(deleteBtn);
  headerFav.appendChild(checkHeader);

  divFav.appendChild(titleFavorite);
  divFav.appendChild(headerFav);

  favorites.forEach((element) => {
    let favList = document.createElement("div");
    favList.className = "favList";

    let elementList = mapItems.get(element);

    let checkList = document.createElement("input");
    checkList.className = "form-check-input";
    checkList.type = "checkbox";
    checkList.value = "";
    checkList.addEventListener("click", () => {
      selectItem(element);
    });
    inputCkecbox.push({ id: element, input: checkList });

    let imgList = document.createElement("img");
    imgList.src = elementList.picture;
    imgList.className = "imgList";

    let title = document.createElement("p");
    title.textContent = elementList.title;
    title.className = "title";

    let price = document.createElement("p");
    price.textContent =
      "$ " +
      new Intl.NumberFormat({
        style: "currency",
        currency: elementList.price.currency,
      }).format(elementList.price.amount);
    price.className = "price";

    if (elementList.free_shipping) {
      let shipping = document.createElement("img");
      shipping.src = "./static/Shipment.png";
      shipping.className = "shipping";
      favList.appendChild(shipping);
    }

    let openBtn = document.createElement("div");
    openBtn.innerText = "Ver articulo";
    openBtn.className = "openBtn text-center";
    openBtn.addEventListener("click", () => {
      openDetail(element);
    });

    favList.appendChild(title);
    favList.appendChild(price);
    favList.appendChild(imgList);
    favList.appendChild(checkList);
    favList.appendChild(openBtn);

    divFav.appendChild(favList);
  });
}

function deleteSelected() {
  favorites = favorites.filter((value) => {
    return !selected.includes(value);
  });

  openFavorites();
}

function selectAll() {
  let check = document.querySelector(
    "body > main > div.favorites > div.headerFav > input",
  );

  inputCkecbox.forEach((element) => {
    if (check.checked) {
      element.input.checked = true;
      selected.push(element.id);
    } else {
      element.input.checked = false;
      selected = selected.filter((value, index, arr) => {
        return value != element.id;
      });
    }
  });

  if (selected.length != 0) {
    enableBtn();
  } else {
    disableBtn();
  }
}

function selectItem(id) {
  inputCkecbox.forEach((element) => {
    if (element.id === id) {
      if (element.input.checked) {
        selected.push(id);
      } else {
        selected = selected.filter((value, index, arr) => {
          return value != element.id;
        });
      }
    }
  });

  console.log(selected);
  console.log(favorites);
  if (selected.length === favorites.length) {
    mainCheck.checked = true;
  } else {
    mainCheck.checked = false;
  }

  if (selected.length != 0) {
    enableBtn();
  } else {
    disableBtn();
  }
}

function enableBtn() {
  let btn = document.querySelector("body > main > div.favorites > div > div");
  btn.style.background = "#E1677D";
}
function disableBtn() {
  let btn = document.querySelector("body > main > div.favorites > div > div");
  btn.style.background = "";
}

function redenderObject(element) {
  let card = document.createElement("div");
  card.className = "card d-flex";

  let img = document.createElement("img");
  img.src = element.picture;
  img.className = "imgProduct";
  img.addEventListener("click", function () {
    openDetail(element.id);
  });

  let title = document.createElement("p");
  title.textContent = element.title;
  title.className = "title";

  let price = document.createElement("p");
  price.textContent =
    "$ " +
    new Intl.NumberFormat({
      style: "currency",
      currency: element.price.currency,
    }).format(element.price.amount);
  price.className = "price";

  if (element.free_shipping) {
    let shipping = document.createElement("img");
    shipping.src = "./static/Shipment.png";
    shipping.className = "shipping";
    card.appendChild(shipping);
  }

  let city = document.createElement("p");
  city.textContent = element.location;
  city.className = "city";

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(city);
  card.appendChild(price);

  return card;
}

function addFavorite(id, btn) {
  let size = favorites.length;
  favorites = favorites.filter((value, index, arr) => {
    return value !== id;
  });

  if (size !== favorites.length) {
    btn.innerText = "Añadir a favoritos";
  } else {
    favorites.push(id);
    btn.innerText = "Quitar de favoritos";
  }
}

function search() {
  let list = document.querySelector("body > main > div.list-products");
  list.innerHTML = "";
  list.style.display = "block";

  let detail = document.querySelector("body > main > div.detail");
  detail.innerHTML = "";
  detail.style.display = "none";

  let favorites = document.querySelector("body > main > div.favorites");
  favorites.innerHTML = "";
  favorites.style.display = "none";

  let input = document.querySelector(
    "body > header > nav > div > form > input",
  );
  input = input.value.toLowerCase();

  let found = [];
  mapItems.forEach((element) => {
    let find = false;
    for (let index = 0; index < element.categories.length && !find; index++) {
      const i = element.categories[index];
      find = i.toLowerCase().includes(input);
    }

    if (find) {
      found.push(element);
    }
  });

  if (found.length !== 0) {
    found.forEach((element) => {
      let card = redenderObject(element);
      list.append(card);
    });
  } else {
    let toast = document.querySelector("#liveToast");
    toast.className = toast.className.replace("hide", "show");
    setTimeout(() => {
      toast.className = toast.className.replace("show", "hide");
    }, 4000);
  }
}

function goHome() {
  let list = document.querySelector("body > main > div.list-products");
  list.innerHTML = "";
  list.style.display = "block";

  let detail = document.querySelector("body > main > div.detail");
  detail.innerHTML = "";
  detail.style.display = "none";

  let favorites = document.querySelector("body > main > div.favorites");
  favorites.style.display = "none";

  loadProducts();
}

let mapItems = new Map();
let mainCheck;
let favorites = [];
let selected = [];
let inputCkecbox = [];
let searchBtn = document.querySelector("#searchButton");
searchBtn.addEventListener("click", () => {
  search();
});
let logoBtn = document.querySelector("#logo");
logoBtn.addEventListener("click", () => {
  goHome();
});
let favoriteBtn = document.querySelector("#favorite");
favoriteBtn.addEventListener("click", () => {
  openFavorites();
});

loadProducts();
