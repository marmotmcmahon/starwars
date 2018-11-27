
function fetchData(url) {
  return fetch(url).then((resp) => resp.json());
}

function constructElement(tagName, text, cssClasses) {
  const el = document.createElement(tagName);
  const content = document.createTextNode(text);
  el.appendChild(content);
  if (cssClasses) {
    el.classList.add(...cssClasses);
  }
  return el;
}

// Appends relevant data to be inserted into flex table
function constructTableContents({ name, height, mass, hair_color }) {
  const array = [];
  array.push(constructElement('div', name, [ 'flextable-cell' ]));
  array.push(constructElement('div', height, [ 'flextable-cell' ]));
  array.push(constructElement('div', mass, [ 'flextable-cell' ]));
  array.push(constructElement('div', hair_color, [ 'flextable-cell' ]));
  return array;
}

const swTable = document.querySelector('.sw-table');

function findAverage(data) {
  var total = 0;
  for (i = 0; i < data.results.length; i ++) {
    total += Number(data.results[i]['mass']);
  }
  return total / data.results.length;
}

function findTallest(data) {
  var tallestHeight = 0;
  for (i = 0; i < data.results.length; i ++) {
    if (Number(data.results[i].height) > Number(tallestHeight)) {
      tallestHeight = data.results[i].height;
      tallestCharacter = data.results[i];
    }
  }
  return tallestCharacter;
}

function commonestHair(data) {
  var array = [];
  for (i = 0; i < data.results.length; i ++) {
    // Removes bald or hairless characters
    if (data.results[i].hair_color != 'n/a') {
      array.push(data.results[i].hair_color)
    }
  }
  // Find most common
  function mode(array) {
      return array.sort((a,b) =>
            array.filter(v => v===a).length
          - array.filter(v => v===b).length
      ).pop();
  }

  return mode(array);
}

// Adds lastName property to each person
function addLastName(data) {
  for (i = 0; i < data.results.length; i++) {
    data.results[i].lastName = data.results[i].name.split(' ').reverse()[0];
  }
}

// Alphabetize by lastName
function alphabetize(data) {
  data.results.sort(function(a, b) {
    return a.lastName.localeCompare(b.lastName);
  });
}

fetchData('https://swapi.co/api/people/').then((data) => {

  // Find average mass
  var average = findAverage(data);

  // Find tallest person
  var tallestCharacter = findTallest(data);

  var hair = commonestHair(data);

  // Add lastName to each person
  addLastName(data);

  // Alphabetize by lastName
  alphabetize(data);

  // TODO: Add event listeners to toggle sorting by column :~)

  // "At a Glance" section insertions
  document.querySelector('#average').innerHTML = average + " kg";
  document.querySelector('#tallest').innerHTML = tallestCharacter.name + " at " + tallestCharacter.height / 100 + " m";
  document.querySelector('#commonest-hair').innerHTML = hair;

  // alphabetize data by last name prior to printing to table
  data.results.forEach(function(person) {
    constructTableContents(person).forEach(cell => swTable.appendChild(cell))
 });
  
});