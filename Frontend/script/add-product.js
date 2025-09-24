let addProductForm = document.getElementById("addProductForm")
let productName = document.getElementById("productName")
// let addProductForm = document.getElementById("addProductForm")
let productPrice = document.getElementById("productPrice")
let productDesc = document.getElementById("productDesc")
let productImage = document.getElementById("productImage")
let productStock = document.getElementById("productStock")
let submitbtn = document.querySelector(".submit-btn")
let formResults = document.getElementById("formResults")
let category = 685684876576564548

addProductForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    // if(checkproduct()){
        try {
            const formdata = {
                product_name : productName.value,
                price : productPrice.value,
                description : productDesc.value,
                productImg : productImage.value,
                category : category,
                stock : productStock.value,
            }

            const req = await fetch("http://localhost:4000/product/add",{
                method : "post",
                // headers : {
                //     "content-Type" : "application/json"
                // },
                body : JSON.stringify(formdata)
            })

            const result = await req.json()
            formResults.innerHTML = result.message;
            showsuccess()
            addProductForm.reset()

        } catch (error) {
            formResults.innerHTML = "Error"
            console.log(error)
        }
    // }
})
