import { menuArray } from "./data.js";

let orderList = [];
renderMenuList();
function renderMenuList() {
  let mealsListHtml = "";

  menuArray.forEach((meal) => {
    const ingredients = meal.ingredients.toString();
    mealsListHtml += `
    <div class="meal">
        <div class="meal-item">
        <div class="meal-icon">${meal.emoji}</div>
        <div class="meal-details">
          <p>${meal.name}</p>
          <small>${ingredients}</small>
          <span>${meal.price}$</span>
        </div>
      </div>
      <div class="meal-action">
      <button data-meal="${meal.id}" data-add="add" type="button" class="action-btn"> + </button> 
      <button data-meal="${meal.id}" id="${meal.id}" data-remove="remove" type="button" class="action-btn"> - </button>      
      </div>
      </div>
      <hr />

        `;
  });
  document.getElementById("meals-list").innerHTML = mealsListHtml;
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    handleOrderedMeal(e.target.dataset.meal, e.target.dataset.add);
  } else if (e.target.dataset.remove) {
    handleOrderedMeal(e.target.dataset.meal, e.target.dataset.remove);
  } else if (e.target.id == "complete-order") {
    document.getElementById("pay-modal").style.display = "block";
  } else if (e.target.id == "Pay-btn") {
    document.getElementById("pay-modal").style.display = "none";
    document.getElementById("bill").innerHTML = `
    <h3>Rate Us</h3>
    <div class="stars">
    <center class="rate">
    <input type="radio" id="star5" name="rate" value="5" />
    <label for="star5" title="text">5 stars</label>
    <input type="radio" id="star4" name="rate" value="4" />
    <label for="star4" title="text">4 stars</label>
    <input type="radio" id="star3" name="rate" value="3" />
    <label for="star3" title="text">3 stars</label>
    <input type="radio" id="star2" name="rate" value="2" />
    <label for="star2" title="text">2 stars</label>
    <input type="radio" id="star1" name="rate" value="1" />
    <label for="star1" title="text">1 star</label>
  </center>
  </div>
    `;
  }
});

function handleOrderedMeal(mealId, operation) {
  const targetedMeal = menuArray.filter((meal) => {
    return mealId == meal.id;
  })[0];

  createOrderList(targetedMeal, operation);
}
function createOrderList(MealObj, operation) {
  var order = orderList.find((x) => x.name == MealObj.name);
  if (operation == "add") {
    if (order == null) {
      MealObj.number = 1;
      orderList.push(MealObj);
    } else {
      order.number++;
    }
  } else if (operation == "remove") {
    order.number--;
    if (order.number == 0) {
      orderList = orderList.filter((x) => x.name != MealObj.name);
      document.getElementById(order.id).disabled = true;
    }
  }

  renderBill(operation);
}
function renderBill(operation) {
  let BillHtml = "";
  let OrderHtml = "";
  console.log(orderList);
  // let totalPrice = orderList.sum(x => x.number * x.price);
  let totalPrice = orderList
    .map((x) => x.number * x.price)
    .reduce((partialSum, a) => partialSum + a, 0);
  orderList.forEach((order) => {
    OrderHtml += `
    <div class="pill-item">
    <p>${order.number} ${order.name}</p>
    <span>${order.price}</span>
    </div>
    `;

    BillHtml = `
    <p class="bill-title">Your order</p>
    <div id="pill-list">
    ${OrderHtml}
    </div>
    <div class=" total-price pill-item">
      <p>Total price:</p>
      <span id="total-price">${totalPrice}$</span>
    </div>
    <button id="complete-order" class="btn order-btn">Complete order</button>
    `;
  });

  document.getElementById("bill").innerHTML = BillHtml;
}
