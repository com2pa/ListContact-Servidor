// Regex
const REGEX_NAME = /^[A-Z][a-z]*[ ][A-Z][a-z]*$/;
const REGEX_NUMBER = /^[0](212|412|414|424|416|426)[0-9]{7}$/;

const form=document.querySelector('#form-todos')
const formInput= document.querySelector('#form-input')//nombre y apellido
const inputNumber=document.querySelector('#input-number') // num telf.
const formBtn = document.querySelector('#form-btn')//boton
const todosList = document.querySelector('#todos-list') //ul
const closeBtn= document.querySelector('#cerrar-btn')//cerrar sesion
const notification = document.querySelector('.notification')
const user = JSON.parse(localStorage.getItem('user'))
// validacion
                        // no existe datos - validando en el input
let namevalidation= false; //nombre y apellido
let numbervalidation= false; //num telf
                            // ya existe datos al momento de editar
let nameEditValidation = true;
let numberEditvalidation =true;

// data
// let Data=[]


// funciones
const validationInput =(input, validation)=>{
   const infoText =input.parentElement.children[1]
    if(input.value ===''){
        input.classList.remove('correct')
        infoText.classList.remove('show-info')        
        input.classList.remove('incorrect')
    }else if(validation){
        input.classList.add('correct')
        input.classList.remove('incorrect')
        infoText.classList.remove('show-info')
    }else{
        infoText.classList.add('show-info')
        input.classList.add('incorrect')
        input.classList.remove('correct')
    }
    if(namevalidation && numbervalidation){
       formBtn.disabled=false 
       formBtn.classList.add('active')
    }else{
        formBtn.disabled=true
    }
}

// evento para vlidar con el regex
formInput.addEventListener('input',e=>{
    namevalidation = REGEX_NAME.test(formInput.value)
    validationInput(formInput, namevalidation)
})

inputNumber.addEventListener('input', e => {
    numbervalidation = REGEX_NUMBER.test(inputNumber.value)
    validationInput(inputNumber, numbervalidation)
})


form.addEventListener('submit' , async e =>{
    e.preventDefault()

    // llevar a la base de datos
    const responseJSON = await fetch(`http://localhost:3000/Contactos`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            nombre:formInput.value,
            telefono:inputNumber.value,
            edit:false,
            user:user.username
        })
    })
    const response = await responseJSON.json()
    console.log(response)

    const listItem = document.createElement('li')

    notification.innerHTML='Se añadio un contacto !'
    notification.classList.add('show-notification')
    setTimeout(() => {
        notification.classList.remove('show-notification')
    }, 5000);

    listItem.innerHTML=`
        <li class="todo-item" id="${response.id}">
            <button class="delete-btn">&#10006;</button>
                <span>${response.nombre}</span> <span>${response.telefono}</span>
            <button class="edit-btn">&#x270E;</button>
        </li>
    `
    todosList.append(listItem)
    formInput.value=''
    inputNumber.value=''
}) 

// funcion asincrona para que cuando carge la pagina no se borre los contactos
const getContact = async()=>{
    const response = await fetch(`http://localhost:3000/Contactos`,{method:'GET'})
    const contacts = await response.json()
    console.log(contacts); 
    // console.log(user.username);
    // console.log(contact.nombre , contact.telefono);
    
    let userContacts = contacts.filter(contact => contact.user == user.username);
    // userContacts = contacts // revisar aqui ! el filtro 
    // console.log(userContacts);
    userContacts.forEach(contac => {
        const listItem = document.createElement('li')
        listItem.innerHTML=`
            <li class="todo-item" id="${contac.id}">
                <button class="delete-btn">&#10006;</button>
                    <span class"${nameEditValidation? 'incorrect' : 'correct'}">${contac.nombre}</span> <span>${contac.telefono}</span>          
                      
                <button class="edit-btn">&#x270E;</button>
            </li>
        `
        todosList.append(listItem)
        // class="${nameEditValidation? 'correct' : 'incorrect'}" contenteditable="true"
        // class="${numberEditvalidation? 'correct' : 'incorrect'}" contenteditable="true"
    });
}
getContact();


// funcion para eliminar y editar

todosList.addEventListener('click', async e=>{
    // eliminar por id
    

    if(e.target.classList.contains('delete-btn')){
        // buscar por id
        const id=e.target.parentElement.id
    
        await fetch(`http://localhost:3000/Contactos/${id}`,{
            method:'DELETE'
        })
        notification.innerHTML='Se Elimino un contacto  !'
        notification.classList.add('show-notification')
        setTimeout(() => {
            notification.classList.remove('show-notification')
        }, 3000);
        // borrando del html
        e.target.parentElement.remove()

    }else if(e.target.classList.contains('edit-btn')){
         const id= e.target.parentElement.id;
        //  const editBtn = e.target.parentElement.querySelector('.edit-btn');
         
        //  const editBtn = e.target.parentElement.querySelector('.edit-btn');
        const editBtn = e.target.closest('.edit-btn');
        const nameEdit =e.target.parentElement.children[1];
        const numberEdit = e.target.parentElement.children[2];

       await fetch(`http://localhost:3000/Contactos/${id}`,{
                method:'PATCH',
                
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    edit:nameEdit.classList.contains('check-todo') && numberEdit.classList.contains('check-todo')  ?false : true,
                    nombre:nameEdit.innerHTML ,
                    telefono:numberEdit.innerHTML 
                })
            });
            nameEdit.classList.toggle('check-todo')
            numberEdit.classList.toggle('check-todo')
        if (editBtn){
            const li = editBtn.parentElement;
            console.log(li);
            const nameEdit_1= li.children[1].innerHTML
            console.log(nameEdit_1,'aqui');
            const numberEdit_1= li.children[2].innerHTML
                if (li.classList.contains('editando')){
                li.classList.remove('editando')

                contacts=contacts.map(contact=>{
                    if(contact.id == li.id){
                        return{
                            id:contact.id,
                            nombre:nameEdit_1.innerHTML,
                            telefono:numberEdit_1.innerHTML,
                            edit:false,
                            user:user.username
                        }
                    }
                    return contact
                })
                    
                }else{
                    li.classList.add('editando')
                    nameEdit.setAttribute('contenteditable', 'true');
                    numberEdit.setAttribute('contenteditable', 'true');
                    // nameEdit.classList.toggle('check-todo')
                    // numberEdit.classList.toggle('check-todo')
                    editBtn.innerHTML = '&#10000;'
                   
                    notification.innerHTML=`Se va editar un contacto ! ${nameEdit_1} ${numberEdit_1} `
                    notification.classList.add('show-notification')
                    setTimeout(() => {
                        notification.classList.remove('show-notification')
                    }, 3000);

                    nameEdit.addEventListener('input',e=>{
                        nameEditValidation = REGEX_NAME.test(nameEdit.innerHTML )
                        validationInput(nameEdit, nameEditValidation)
                        if (nameEditValidation && numberEditvalidation) {
                          editBtn.disabled = false;
                          
                             
                        } else {
                          editBtn.disabled = true;
                          
                
                        }
                      });


                      numberEdit.addEventListener('input',e=>{
                        numberEditvalidation = REGEX_NUMBER.test(numberEdit.innerHTML)
                        validationInput(numberEdit, numberEditvalidation)
                        // const infoText = li.parentElement.children[3]
                        // console.log(infoText)
                        // console.log()       
                        if (nameEditValidation && numberEditvalidation) {
                          editBtn.disabled = false;
                          // infoText.classList.add('show-info');
                          
                             
                        } else {
                          editBtn.disabled = true;
                          
                        }
                      })
                      
                      
                    
                }
            
           

            
            
            
         
            
           
           
         
        }else{
            nameEdit.removeAttribute('contenteditable','true');
            numberEdit.removeAttribute('contenteditable','true');
        }
         

        
            
            
            
        

        

    }
    
})

// cerrando session 
// paso 11

closeBtn.addEventListener('click',async e =>{
    // paso 12 
    // borrarlo del localStoger
    localStorage.removeItem('user')
    // paso 13
    window.location.href='../home/index.html';
    
});