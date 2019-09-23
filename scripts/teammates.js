let members;
let URL = 'https://api.myjson.com/bins/adpvt';

let rolesArray = [];

fetch(URL)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (json) {
    members = json.people;
    createTable(members);
    createCheckboxes();
    for (let i = 0; i < rolesArray.length; i++) {
      document.getElementById(rolesArray[i]).addEventListener('click', filterMembers);
    }
    for (let i = 0; i < members.length; i++) {
      document.getElementById('member' + i).addEventListener('click', function () { openModal(members, i) });
    }






  })
  .catch(function (error) {
    console.log('Request failed: ' + error.message);
  });

function createTable(data) {
  let membersData = document.getElementById('data');
  let template = '';

  for (let i = 0; i < data.length; i++) {
    template += `<tr>
    <td class='bold'>${data[i].name}</td>
    <td>${data[i].age}</td>
    <td>${data[i].role}</td>
    <td>${data[i].team}</td>
    <td class='extra-padding'>${data[i].seniority}</td>
    <td class='more-info no-padding'><button class='more-info bold' id=${'member' + i}>More Info</button></td>
    </tr>`;
  }

  if (data.length == 0) {
    template += `<tr>
    <td colspan=6>No data matching your search criteria</td>
    </tr>`;
  }

  membersData.innerHTML = template;
}

function filterMembers() {

  let textValue = document.getElementById('name-filter').value.toUpperCase();
  let checkboxes = Array.from(
    document.querySelectorAll('input[type=checkbox]:checked')
  ).map(c => c.value);

  let filteredMembers = members.filter(m => {
    let roleFilter = checkboxes.includes(m.role) || checkboxes.length == 0;
    let nameFilter = m.name.toUpperCase().indexOf(textValue) > -1 || m.contact_info.nickName.toUpperCase().indexOf(textValue) > -1;
    return roleFilter && nameFilter;
  });
  createTable(filteredMembers);

  for (let i = 0; i < filteredMembers.length; i++) {
    document.getElementById('member' + i).addEventListener('click', function () { openModal(filteredMembers, i) });
  }
}

function createCheckboxes() {

  let roleCheckbox = document.getElementById('roles');
  let roles = Array.from(new Set(members.map(m => m.role).sort()));

  let roleCheckboxes = '';

  for (let i = 0; i < roles.length; i++) {

    rolesArray.push(roles[i] + 'Checkbox');

    let fullCheckbox = `
    <div class='cb'>
    <label><input type='checkbox' value='${roles[i]}' id='${roles[i] + 'Checkbox'}' name=${roles[i]}'> ${roles[i]}</label>
    </div>`;

    roleCheckboxes += fullCheckbox;

  }

  roleCheckbox.innerHTML = roleCheckboxes;
}

function openModal(members, id) {

  let contact = members[id].contact_info;
  let modal = document.getElementById('contact-modal');
  let data = document.getElementById('contact-data');
  let closeButton = document.getElementById('close-button');

  document.getElementById('name').innerText = members[id].name;

  let email = '';

  if (contact.email) {
    email = `<button class='more-info bold'><a href='mailto:${contact.email}'>Send me an email</a></button>`;
  } else {
    email = "We don't have any contact info";
  }

  data.innerHTML = `
  <img class='profile' src=${contact.photo}>
  <table>
  <tbody class='white-table'>
  <tr>
    <td class='bold'>NickName</td>
    <td>${contact.nickName}</td>
    </tr>
    <tr>
    <td class='bold'>Phone</td>
    <td>${contact.phone}</td>
    </tr>
    <tr>
    <td class='bold'>Site</td>
    <td>${contact.site}</td>
    </tr>
    <tr>
    <td class='bold'>Contact</td>
    <td class='no-padding'>${email}</td>
    </tr>
  </tbody>`

  closeButton.innerHTML = `<button class='close-button more-info bold'>Close</button>`

  modal.style.display = 'block';

  document.getElementById('close-button').addEventListener('click', close);
  document.getElementsByClassName('close')[0].addEventListener('click', close);

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
}

function close() {
  let modal = document.getElementById('contact-modal');
  modal.style.display = 'none';
}


