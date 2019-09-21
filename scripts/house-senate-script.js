let members;
let URL = 'https://api.myjson.com/bins/adpvt';

let repCheckbox = document.getElementById('CTOCheckbox');
let demCheckbox = document.getElementById('dem-checkbox');
let indCheckbox = document.getElementById('ind-checkbox');
let stateDropdown = document.getElementById('states');
let readMoreButton = document.getElementById('more-button');
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
  })
  .catch(function (error) {
    console.log('Request failed: ' + error.message);
  });

function createTable(data) {
  let membersData = document.getElementById('data');
  let template = '';

  for (let i = 0; i < data.length; i++) {
    template += `<tr>
    <td>${data[i].name}</td>
    <td>${data[i].age}</td>
    <td>${data[i].role}</td>
    <td>${data[i].team}</td>
    <td>${data[i].seniority}</td>
    <td>More Info</td>
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
    document.querySelectorAll("input[type=checkbox]:checked")
  ).map(c => c.value);

  let filteredMembers = members.filter(m => {
    let roleFilter = checkboxes.includes(m.role) || checkboxes.length == 0;
    let nameFilter = m.name.toUpperCase().indexOf(textValue) > -1 || m.contact_info.nickName.toUpperCase().indexOf(textValue) > -1;
    return roleFilter && nameFilter;
  });
  createTable(filteredMembers);
}

function createCheckboxes() {

  let roleCheckbox = document.getElementById('roles');
  let roles = Array.from(new Set(members.map(m => m.role).sort()));

  for (let i = 0; i < roles.length; i++) {

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = roles[i];
    checkbox.value = roles[i];
    checkbox.id = roles[i] + 'Checkbox';
    rolesArray.push(checkbox.id);

    let label = document.createElement('label')
    label.htmlFor = roles[i];
    label.appendChild(document.createTextNode(roles[i]));

    roleCheckbox.appendChild(checkbox);
    roleCheckbox.appendChild(label);

  }
}