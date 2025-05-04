const usersBtn = document.querySelector("#Users-Btn")
const productsBtn = document.querySelector("#Products-Btn")
const profileEditBtn = document.querySelector("#ProfileEdit-Btn")

const usersTable = document.querySelector("#Users-Table")
const productsTable = document.querySelector("#Products-Table")
const profileTable = document.querySelector("#ProfileEdit-Table")

const showTable = (table)=>{
    //reset styles
    productsTable.style.display="none" 
    usersTable.style.display="none" 
    profileTable.style.display="none" 
    //apply style
    table.style.display= "block" ;
}
window.addEventListener('load',()=>{
    usersBtn.addEventListener('click',()=>{
        showTable(usersTable)
    })

    productsBtn.addEventListener('click',()=>{
        showTable(productsTable)
    })
    profileEditBtn.addEventListener('click',()=>{
        showTable(profileTable)
    })
})