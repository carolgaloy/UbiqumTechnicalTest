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
    <td class='more-info bold'>More Info</td>
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

  console.log(checkboxes);

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