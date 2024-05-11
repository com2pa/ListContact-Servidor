const formCreate = document.querySelector('#form-create')//form -crear usuario
const createInput = document.querySelector('#create-input')//input -crear usuario
const notification = document.querySelector('.notification')// nota refleja si el (user) esta creado o no 

const formLogin = document.querySelector('#form-login')
const loginInput = document.querySelector('#login-input')

// parte 1 -------
 
formCreate.addEventListener('submit',async e=>{
    e.preventDefault()
    
    const response = await fetch(`http://localhost:3000/users`, {method:'GET'})
    const users = await response.json()
    const user = users.find(user => user.username == createInput.value)
    
    // condicion para validar si el usuario esta vacio, si existe o creamos el mismo 
    if(createInput.value == ''){
        notification.innerHTML='El usuario  no puede estar vacio .-.'
        notification.classList.add('show-notification')
        setTimeout(() => {
            notification.classList.remove('show-notification')
        }, 3000);

    }else if(user){
        notification.innerHTML='El usuario  ya existe -.-! '
        notification.classList.add('show-notification')
        setTimeout(() => {
            notification.classList.remove('show-notification')
        }, 3000);
    }else{
         await fetch(`http://localhost:3000/users`, {
            method:'POST', 
            body:JSON.stringify({
                username: createInput.value
            }), 
            headers:{'Content-Type':'application/json'}})
        
        notification.innerHTML=`Usuario ${createInput.value} creado con exito :) `
        notification.classList.add('show-notification')
        setTimeout(() => {
            notification.classList.remove('show-notification')
        }, 3000);

        
    }
    createInput.value = '';//borrando el input
});

//  parte 2
// accediendo usuario
formLogin.addEventListener('submit', async e=>{
    e.preventDefault()

    const response = await fetch(`http://localhost:3000/users`, {method:'GET'})
    const users = await response.json()
    const user = users.find(user => user.username == loginInput.value)

    if(!user){
        notification.innerHTML='El usuario  no existe _-_'
        notification.classList.add('show-notification')
        setTimeout(() => {
            notification.classList.remove('show-notification')
        }, 3000);
    }else{
        localStorage.setItem('user',JSON.stringify(user))

        window.location.href = '../Contact/contactos.html'
    }
})