/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here
  const coffeeCounter = document.getElementById("coffee_counter");
  coffeeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  data.coffee++;
  const coffeeCounter = document.getElementById("coffee_counter");
  coffeeCounter.innerText = data.coffee;
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  for (let i = 0; i < producers.length; i++) {
    if (coffeeCount >= producers[i].price / 2) {
      producers[i].unlocked = true;
    }
  }
  return producers;
}
function getUnlockedProducers(data) {
  // your code here
  let arr = [];
  data.producers.forEach((element) => {
    if (element.unlocked == true) {
      arr.push(element);
    }
  });
  return arr;
}

function makeDisplayNameFromId(id) {
  // your code here
  return id
    .split("_")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  // parent.innerHTML = ''
  // Just let me use this damn it
}

function renderProducers(data) {
  // your code here
  const producerContainer = document.getElementById("producer_container");
  const unlockDivs = unlockProducers(data.producers, data.coffee);
  deleteAllChildNodes(producerContainer);
  unlockDivs.forEach((producer) => {
    const producerDivs = makeProducerDiv(producer);
    if (producer.unlocked === true) {
      producerContainer.appendChild(producerDivs);
    }
  });
}
/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  let id;
  data.producers.map((producer) => {
    if (producerId === producer.id) {
      id = producer;
    }
  });
  return id;
}

function canAffordProducer(data, producerId) {
  // your code here
  const getId = getProducerById(data, producerId);
  if (data.coffee >= getId.price) {
    return true;
  }
  return false;
}

function updateCPSView(cps) {
  // your code here
  const cpsView = document.getElementById("cps");
  cpsView.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  if (Number.isInteger(oldPrice)) {
    return Math.floor(oldPrice * 1.25);
  }
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  const affordable = canAffordProducer(data, producerId);
  const producer = getProducerById(data, producerId);
  const priceChange = updatePrice(producer.price);
  if (affordable === true) {
    producer.qty++;
    data.coffee -= producer.price;
    producer.price = priceChange;
    data.totalCPS += producer.cps;
    return true;
  }
  return false;
}

function buyButtonClick(event, data) {
  // your code here
  if (event.target.tagName !== "BUTTON") {
    return;
  } else {
    const currentButton = event.target.id;
    const currentId = currentButton.slice(4);
    const buy = attemptToBuyProducer(data, currentId);
    if (buy === false) {
      window.alert("Not enough coffee!");
    } else if (buy === true) {
      buy;
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  updateCPSView(data.totalCPS);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
