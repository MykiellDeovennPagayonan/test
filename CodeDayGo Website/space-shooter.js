const scoreBar = document.querySelector('#scoreBar')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//not fixed screen
/*
canvas.width = innerWidth
canvas.height = innerHeight
*/

//fixed screen  
canvas.width = window.innerWidth
canvas.height = canvas.width * 9 / 16

//-----------------------CLASSES-------------------------------
class Spaceship{
    constructor(){

        this.velocity = {x: 0, y: 0}
        this.rotation = 0
        this.opacity = 1

        const icon = new Image()
        icon.src =  './icons/triangle.png'
        icon.onload = () =>{
            this.icon = icon
            this.width = icon.width * 0.15
            this.height = icon.height * 0.06
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 40 ,
            }
        }   
    } 

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.translate(ss.position.x + ss.width/2, ss.position.y + ss.height /2 )
        c.rotate(this.rotation)
        c.translate(-ss.position.x - ss.width/2, -ss.position.y - ss.height /2 )
        c.drawImage(this.icon, this.position.x, this.position.y, this.width, this.height)
        c.restore()
    }

    update(){
        if(this.icon){
            this.draw()
            this.position.x += this.velocity.x
        }
        
    }
}

class Bullets {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 3
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'greenyellow'
        c.fill()
        c.closePath()

    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Effects {
    constructor({position, velocity, radius, color, fades}){
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }
    draw(){
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()

    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.fades){
            this.opacity -= 0.01}
    }
}

class LaserBeams {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.width = 2
        this.height = 12
    }
    draw(){
        c.fillStyle = 'magenta'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

}

class Targets{
    constructor({position}){
        this.velocity = {x: 0, y: 0}
        
        const icon = new Image()
        icon.src =  './icons/hexagon.png'
        icon.onload = () =>{
            this.icon = icon
            this.width = icon.width * 0.023
            this.height = icon.height * 0.023
            this.position = {
                x: position.x,
                y: position.y + 20
            }
        }
    } 

    draw() {
        c.drawImage(this.icon, this.position.x, this.position.y, this.width, this.height)
    }

    update({velocity}){
        if(this.icon){
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        } 
    }

    attack(beams){
        beams.push(new LaserBeams({position: {x: this.position.x + this.width / 2, y: this.position.y + this.height}, velocity: {x: 0, y: 5}}))
    }
}

class Groups{
    constructor(){
        this.position = {x: 0, y: 0}
        this.velocity = {x: 2, y: 0}

        this.targets = []
        const rowLimit = Math.floor(Math.random() * 3 + 2)
        const columnLimit = Math.floor(Math.random() * 7 + 2)

        this.width = columnLimit * 18.5
        for(let col = 0; col < columnLimit; col++){
            for(let row = 0; row < rowLimit; row++){
                this.targets.push(new Targets({position: {x: col * 18.5, y: row * 18.5}}))
            }
        }
    }

    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0

        if(this.position.x + this.width >= canvas.width || this.position.x <= 0 ){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 17
        }
    }
}

//----------------------CONSTANTS-FUNCTIONS--------------------------------
const ss = new Spaceship()
const groups = []
const bullets = []
const attackBeams = []
const effects = []
const controls = {
    a: {pressed: false},
    d: {pressed: false},
    space: {pressed: false}
} 

let intervals = 0
let intRandom = Math.floor((Math.random() * 500) + 500)
let play = {
    end: false,
    active: true
}

let scoreCount = 0

for(let i = 0; i < 100; i++){
    effects.push(new Effects({position: {x: Math.random() * canvas.width, y: Math.random() * canvas.height},
    velocity: {x: 0, y: 0.3}, radius: Math.random() * 2, color: '#00ffff'}))
}   

function burstEffects({obj, color, fades}){
    for(let i = 0; i < 15; i++){
        effects.push(new Effects({position: {x: obj.position.x + obj.width / 2, y: obj.position.y + obj.height / 2 },
        velocity: {x: (Math.random() -0.5) * 5, y: (Math.random() -0.5) * 5}, radius: Math.random() * 2, color: color, fades: true}))
    }    
}

const bgIcon = new Image()
bgIcon.onload = bgIcon
bgIcon.src =  './icons/neb.png'
//------------------------ACTIONS------------------------ 

function movement(){
    if (!play.active){return}
    requestAnimationFrame(movement)
    //c.fillStyle = 'black'
    //c.fillRect(0, 0, canvas.width, canvas.height)
    c.drawImage(bgIcon, canvas.width / 2 - (bgIcon.width * 0.25), canvas.height/2 - (bgIcon.height * 0.25))
    ss.update()


    effects.forEach((effect, effIndex) => {
        if(effect.opacity <= 0){
            setTimeout(() => {effects.splice(effIndex, 1)}, 0)
        }else {
          effect.update()  
        }
        
        if(effect.position.y - effect.radius >= canvas.height){
            effect.position.x = Math.random() * canvas.width
            effect.position.y = -effect.radius
        }
    })

    bullets.forEach((bullet, index) => {
        if(bullet.position.y + bullet.radius <= 0){
            setTimeout(() => {bullets.splice(index, 1)}, 0)
        }else {
            bullet.update()
        }
        
    })

    groups.forEach((group, groupIndex) => {
        group.update()
        if(intervals % 100 === 0 && group.targets.length > 0){
           group.targets[Math.floor(Math.random() * group.targets.length)].attack(attackBeams)
        }
        group.targets.forEach((target, t) => {target.update({velocity: group.velocity})
            bullets.forEach((bullet, b) => {
                if (bullet.position.y + bullet.radius >= target.position.y &&
                    bullet.position.y - bullet.radius <= target.position.y + target.height && 
                    bullet.position.x + bullet.radius >= target.position.x &&
                    bullet.position.x - bullet.radius <= target.position.x + target.width){
                    
                    setTimeout(() => {
                        const seeker = group.targets.find((target_2) => target_2 === target)
                        const detector = bullets.find((bullet_2) => bullet_2 === bullet)
                        if(seeker && detector){
                            scoreCount += 10
                            scoreBar.innerHTML = scoreCount
                            burstEffects({obj: target, color: 'greenyellow'})
                            group.targets.splice(t, 1)
                            bullets.splice(b, 1)

                            if (group.targets.length > 0) {
                                const targetBounceLeft = group.targets[0]
                                const targetBounceRight = group.targets[group.targets.length - 1]
                                group.width = targetBounceRight.position.x - targetBounceLeft.position.x + targetBounceLeft.width
                                group.position.x = targetBounceLeft.position.x
                            }else {
                                groups.splice(groupIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
        })
    })

    if (controls.a.pressed && ss.position.x >= 0){
        ss.velocity.x = -20
        ss.rotation = -0.15
    }else if (controls.d.pressed && ss.position.x + ss.width <= canvas.width){
        ss.velocity.x = 20
        ss.rotation = 0.15
    }else {
        ss.velocity.x = 0
        ss.rotation = 0
    }

    if(intervals % intRandom === 0){
        groups.push(new Groups())
        intRandom = Math.floor((Math.random() * 500) + 500)
        intervals = 0
    }

    if (intervals % 4 === 0) {
        let move = Math.floor(Math.random() * 2)
        if (move === 0){
            ss.velocity.x = -20
            ss.rotation = -0.15
        } else {
            ss.velocity.x = 20
            ss.rotation = 0.15
        }
        if (intervals % 10 === 0) {
            bullets.push(new Bullets({position: {x: ss.position.x + ss.width / 2, y: ss.position.y}, velocity: {x: 0, y: -10}}))
        }
    }

    intervals++
}
movement()

//--------------------KEYBOARD-CONTROLS---------------------
addEventListener('keydown', ({key}) => {
    if(play.end){
        return
    }else {
        switch (key){
            case 'a':
                controls.a.pressed = true
                break
            case 'd':
                controls.d.pressed = true
                break
            case ' ':
                controls.space.pressed = true
                bullets.push(new Bullets({position: {x: ss.position.x + ss.width / 2, y: ss.position.y}, velocity: {x: 0, y: -10}}))
                break
        }
    }
})

addEventListener('keyup', ({key}) => {
    switch (key){
        case 'a':
            controls.a.pressed = false
            break
        case 'd':
            controls.d.pressed = false
            break
        case ' ':
            controls.space.pressed = false
            break
    }
})
//---------------------------CODE-END-------------------------------