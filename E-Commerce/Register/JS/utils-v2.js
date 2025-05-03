const userAge = document.querySelector("#user-age");
const userAgeMsg = document.querySelector("#user-age-error")
const userFirstName = document.querySelector("#first-name")
const userLastName = document.querySelector("#last-name")
const userUserName = document.querySelector("#user-name")
const userEmail = document.querySelector("#email")
const userPassword = document.querySelector("#password")
const userConfirmPassword = document.querySelector("#confirm-password")


const ageValidator = ()=>{
    const currentYear =  new Date();
    const userDate = userAge.value.toString()
    const yearUserBorn = userDate.split('-')[0]
    let age =currentYear.getFullYear()-Number(yearUserBorn);
    if(!userDate.split[1] || !userDate.split[2])
        return false
    return (age >=18)? true :false
    }

const nameValidator = (name)=>{
    let regex= /[a-zA-Z]{3,20}/
    console.log(regex.test(name))
    return regex.test(name);
}

const emailValidator = ()=>{
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(userEmail.value)
}

const passwordChecker = ()=>{
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ ;
    return regex.test(userPassword.value)

}


userAge.addEventListener('change',()=>{

    if(!ageValidator()){
        userAgeMsg.style.display = "block";
    }
    else{
        userAgeMsg.style.display = "none"
    }

})
userFirstName.addEventListener('blur',function(){
    const fnameMsg = document.querySelector("#fname-error")
    nameValidator(this.value) ? fnameMsg.style.display = "none": fnameMsg.style.display = "block";

})

userLastName.addEventListener('blur',function(){
    const lnameMsg = document.querySelector("#lname-error")
    nameValidator(this.value) ? lnameMsg.style.display = "none": lnameMsg.style.display = "block";
      
})
userUserName.addEventListener('blur',function(){
    const usernameMsg = document.querySelector("#user-name-error")
    nameValidator(this.value) ? usernameMsg.style.display = "none": usernameMsg.style.display = "block";
})

userEmail.addEventListener('blur',function(){
    const emailMsg = document.querySelector("#email-error")
    emailValidator() ? emailMsg.style.display = "none": emailMsg.style.display = "block";
})