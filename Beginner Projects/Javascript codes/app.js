//Regular function 
function main(USD) {
    const AUD = USD * 1.5
    return(AUD)
}

console.log(main(1000))
//trying to abapt to things properly 


//arrow fucntion 
const convert = (dollars) => {
    return dollars * 1.5;
}

console.log(convert(1000))

//arrays
let array = ["apple", "mango", "eggs", "milk","water"]

//getting the last element in an array or list 
console.log(array[array.length - 1])

// adding to array (array methods)
array.push("bread")

console.log(array)
//second array method .filter
array.filter((element) => {
    console.log(element);
    if (element.length >== 4 ){
        return true
    }

})

