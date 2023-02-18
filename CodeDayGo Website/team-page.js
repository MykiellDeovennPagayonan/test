class Profile {
  name;
  title;
  pictureLink;

  constructor(name, title, pictureLink) {
    this.name = name;
    this.title = title;
    this.pictureLink = pictureLink
  }
}

const team = []

team.push(new Profile ("Prince Nesher Magno", "The Prince", "./resources/img/prince.png"))
team.push(new Profile ("Rhea Rizz Perocho", "The Rizzler", "./resources/img/Rhea.jpg"))
team.push(new Profile ("Ian Clyde Tejada", "The Tyrant", "./resources/img/Ian.png"))
team.push(new Profile ("John Patrick Pineda", "Chill Master", "./resources/img/pineda.png"))
team.push(new Profile ("Justine Marie Altar", "The Sidekick", "./resources/img/Marie.png"))
team.push(new Profile ("Mykiell Pagayonan", "Code Warrior", "./resources/img/Myk.png"))

let viewProfile = 0

document.getElementById('name').innerHTML = team[viewProfile].name
document.getElementById('title').innerHTML = team[viewProfile].title
document.getElementById('img').src = team[viewProfile].pictureLink

function next() {
  console.log(viewProfile)
  if (viewProfile < team.length - 1){
    viewProfile++
  } else {
    viewProfile = 0
  }
  document.getElementById('name').innerHTML = team[viewProfile].name
  document.getElementById('title').innerHTML = team[viewProfile].title
  document.getElementById('img').src = team[viewProfile].pictureLink
}

function prev() {
  if (viewProfile > 0){
    viewProfile--
  } else {
    viewProfile = team.length - 1
  }
  document.getElementById('name').innerHTML = team[viewProfile].name
  document.getElementById('title').innerHTML = team[viewProfile].title
  document.getElementById('img').src = team[viewProfile].pictureLink
}