// Regex
const REGEX_NAME = /^[A-Z][a-z]*[ ][A-Z][a-z]*$/;
const REGEX_NUMBER = /^[0](212|412|414|424|416|426)[0-9]{7}$/;

const form=document.querySelector('#form-todos')
const formInput= document.querySelector('#form-input')//nombre y apellido
const inputNumber=document.querySelector('#input-number') // num telf.
const formBtn = document.querySelector('#form-btn')//boton


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