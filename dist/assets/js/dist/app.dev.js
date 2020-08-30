"use strict";

var currentUserUid;
var currentUserName;
var auth;
var loginStatus = JSON.parse(localStorage.getItem('loginStatus'));

if (!loginStatus) {
  window.location = 'login.html';
}

var greetings = document.querySelector('.greetings');
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // show user's name after sign in
    firebase.database().ref('/users/' + user.uid).once('value', function (success) {
      currentUserUid = success.val().userUid;
      currentUserName = success.val().signupName;

      if (currentUserUid !== user.uid) {
        window.location = 'login.html';
      }

      console.log(currentUserName);
      greetings.innerHTML = 'Howdy, ' + currentUserName + '.';
    }); // User is signed in.

    localStorage.setItem('auth', JSON.stringify(user));
  } else {
    localStorage.clear();
  }
});
var listInputForm = document.querySelector('.listInputForm');
var listItems = document.querySelector('.listItems');
var listInput = document.querySelector('.listInput');
var itemsArray = [];
var arrayInLocalStorage = JSON.parse(localStorage.getItem('itemsArray'));

if (arrayInLocalStorage && arrayInLocalStorage.length > 0) {
  itemsArray = arrayInLocalStorage;
} // rendering on load


window.onload = function () {
  var itemsArray = [];
  auth = JSON.parse(localStorage.getItem('auth'));
  console.log(auth.uid);
  listInput.focus();
  firebase.database().ref('/todo').on('child_added', function (success) {
    var todoItems = success.val();
    itemsArray.push(todoItems);
    listItems.innerHTML = "";

    for (var i = 0; i < itemsArray.length; i++) {
      listItems.innerHTML += "<li><input type=\"checkbox\" onclick=\"completedItem(this, ".concat(i, ")\" ").concat(itemsArray[i].completed ? "checked" : "", "><span class=\"").concat(itemsArray[i].completed ? "checked" : "", "\">").concat(itemsArray[i].todo, "</span><input type=\"text\" class=\"editField\"><button class=\"editItem\" onclick=\"editItem(this, ").concat(i, ")\">Edit</button><button class=\"saveItem\" onclick=\"saveItem(this, ").concat(i, ")\">Save</button><button class=\"delete\" onclick=\"deleteItem(this, ").concat(i, ")\">Delete</button><button class=\"cancelEdit\" onclick=\"cancelEdit(this)\">Cancel</button> - <span class=\"createdAt\">").concat(itemsArray[i].timeCreated, "</span></li>");
    }
  }); // rendering list 
  // for (var i = 0; i < itemsArray.length; i++) {
  //     if (itemsArray[i].user === currentUser.email) {
  //         listItems.innerHTML += `<li><input type="checkbox" onclick="completedItem(this, ${i})" ${(itemsArray[i].completed) ? "checked" : ""}><span class="${(itemsArray[i].completed) ? "checked" : ""}">${itemsArray[i].todo}</span><input type="text" class="editField"><button class="editItem" onclick="editItem(this, ${i})">Edit</button><button class="saveItem" onclick="saveItem(this, ${i})">Save</button><button class="delete" onclick="deleteItem(this, ${i})">Delete</button><button class="cancelEdit" onclick="cancelEdit(this)">Cancel</button> - <span class="createdAt">${itemsArray[i].timeCreated}</span></li>`;
  //     }
  // }
}; // rendering on submit


listInputForm.onsubmit = function () {
  // getting input value
  var inputValue = listInput.value;

  if (inputValue !== '') {
    // 12 hour format
    var rightNow = new Date();
    var hour = rightNow.getHours();
    var minutes = rightNow.getMinutes();

    if (hour > 12) {
      hour = '0' + hour - 12;
    }

    if (hour < 10) {
      hour = '0' + hour;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    var timeCreated = hour + ':' + minutes; // adding data in itemsArray

    itemsArray.unshift({
      todo: inputValue,
      timeCreated: timeCreated,
      completed: false
    });
    var todo = {
      todo: inputValue,
      timeCreated: timeCreated,
      completed: false
    };
    firebase.database().ref('/todo').push(todo); // setting and getting data from local storage
    // localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
    // clearing list so there won't be any duplicates
    // listItems.innerHTML = '';
    // rendering list 
    // for (var i = 0; i < itemsArray.length; i++) {
    //     if (itemsArray[i].user === currentUser.email) {
    //         listItems.innerHTML += `<li><input type="checkbox" onclick="completedItem(this, ${i})" ${(itemsArray[i].completed) ? "checked" : ""}><span class="${(itemsArray[i].completed) ? "checked" : ""}">${itemsArray[i].todo}</span><input type="text" class="editField"><button class="editItem" onclick="editItem(this, ${i})">Edit</button><button class="saveItem" onclick="saveItem(this, ${i})">Save</button><button class="delete" onclick="deleteItem(this, ${i})">Delete</button><button class="cancelEdit" onclick="cancelEdit(this)">Cancel</button> - <span class="createdAt">${itemsArray[i].timeCreated}</span></li>`;
    //     }
    // }
  } else {
    // calling dumb, dumb.
    alert('Sorry to call you dumb. But write something, you dumb.');
  } // clearing input when user add item in list


  listInput.value = ''; // so the <form> don't referesh the website on submit

  return false;
}; // eslint-disable-next-line no-unused-vars


var completedItem = function completedItem(_completedItem, index) {
  var itemTxt = _completedItem.nextSibling;

  if (_completedItem.checked === true) {
    itemsArray[index].completed = true;
    itemTxt.style.textDecoration = 'line-through';
  } else {
    itemsArray[index].completed = false;
    itemTxt.style.textDecoration = 'none';
  } // setting and getting data again from local storage


  localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
}; // eslint-disable-next-line no-unused-vars


var deleteItem = function deleteItem(_deleteItem, index) {
  itemsArray.splice(index, 1); // clearing list so there won't be any duplicates

  listItems.innerHTML = ''; // rendering list 

  for (var i = 0; i < itemsArray.length; i++) {
    if (itemsArray[i].user === currentUser.email) {
      listItems.innerHTML += "<li><input type=\"checkbox\" onclick=\"completedItem(this, ".concat(i, ")\" ").concat(itemsArray[i].completed ? "checked" : "", "><span class=\"").concat(itemsArray[i].completed ? "checked" : "", "\">").concat(itemsArray[i].todo, "</span><input type=\"text\" class=\"editField\"><button class=\"editItem\" onclick=\"editItem(this, ").concat(i, ")\">Edit</button><button class=\"saveItem\" onclick=\"saveItem(this, ").concat(i, ")\">Save</button><button class=\"delete\" onclick=\"deleteItem(this, ").concat(i, ")\">Delete</button><button class=\"cancelEdit\" onclick=\"cancelEdit(this)\">Cancel</button> - <span class=\"createdAt\">").concat(itemsArray[i].timeCreated, "</span></li>");
    }
  } // setting and getting data again from local storage


  localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
}; // eslint-disable-next-line no-unused-vars


var editItem = function editItem(_editItem) {
  var itemTxt = _editItem.previousSibling.previousSibling;
  var editField = _editItem.previousSibling;
  var saveBtn = _editItem.nextSibling;
  var cancelEdit = _editItem.nextSibling.nextSibling.nextSibling;
  var deleteBtn = _editItem.nextSibling.nextSibling;
  editField.value = itemTxt.innerHTML;
  _editItem.style.display = 'none';
  saveBtn.style.display = 'inline';
  cancelEdit.style.display = 'inline';
  deleteBtn.style.display = 'none';
  itemTxt.style.display = 'none';
  editField.style.display = 'inline';
}; // eslint-disable-next-line no-unused-vars


var saveItem = function saveItem(_saveItem, index) {
  var itemTxt = _saveItem.previousSibling.previousSibling.previousSibling;
  var editField = _saveItem.previousSibling.previousSibling;
  var editBtn = _saveItem.previousSibling;
  var cancelEdit = _saveItem.nextSibling.nextSibling;
  var deleteBtn = _saveItem.nextSibling;
  itemsArray[index].todo = editField.value;
  itemTxt.innerHTML = editField.value; // setting and getting data again from local storage

  localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
  editBtn.style.display = 'inline';
  _saveItem.style.display = 'none';
  cancelEdit.style.display = 'none';
  deleteBtn.style.display = 'inline';
  itemTxt.style.display = 'inline';
  editField.style.display = 'none';
}; // eslint-disable-next-line no-unused-vars


var cancelEdit = function cancelEdit(_cancelEdit) {
  var itemTxt = _cancelEdit.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling;
  var editField = _cancelEdit.previousSibling.previousSibling.previousSibling.previousSibling;
  var editBtn = _cancelEdit.previousSibling.previousSibling.previousSibling;
  var saveBtn = _cancelEdit.previousSibling.previousSibling;
  var deleteBtn = _cancelEdit.previousSibling;
  editBtn.style.display = 'inline';
  saveBtn.style.display = 'none';
  _cancelEdit.style.display = 'none';
  deleteBtn.style.display = 'inline';
  itemTxt.style.display = 'inline';
  editField.style.display = 'none';
};

var logout = document.querySelector('.logout');

logout.onclick = function () {
  firebase.auth().signOut().then(function () {
    localStorage.setItem('loginStatus', false);
    window.location = "login.html";
  })["catch"](function (error) {
    // An error happened.
    console.log(error);
  });
};