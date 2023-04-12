const baseURL = "http://localhost:3000"
const aboutMe = document.querySelector('#submitAboutMe')
const onTheWeb = document.querySelector('#onTheWeb')
const personalInfo = document.querySelector('#personalInfo')
const passwordChange = document.querySelector('#passwordChange')



aboutMe.addEventListener('submit', (event) => {
    event.preventDefault()

    var formData = new FormData(aboutMe);
    const formValues = Object.fromEntries(formData.entries());
    console.log(formValues)


    $.ajax({
        url: `${baseURL}/aboutMe`,
        method: 'POST',
        data: JSON.stringify(formValues),
        contentType: 'application/json',
        success: function (response) {
            console.log(response.status)
        },
        error: function (error) {
            alert("Sorry some error occured please try again later")
        }
    })
})
onTheWeb.addEventListener('submit', (event) => {
    event.preventDefault()

    var formData = new FormData(onTheWeb);
    const formValues = Object.fromEntries(formData.entries());
    console.log(formValues)


    $.ajax({
        url: `${baseURL}/onTheWeb`,
        method: 'POST',
        data: JSON.stringify(formValues),
        contentType: 'application/json',
        success: function (response) {
            console.log(response.status)
        },
        error: function (error) {
            alert("Sorry some error occured please try again later")
        }
    })
})
personalInfo.addEventListener('submit', (event) => {
    event.preventDefault()

    var formData = new FormData(personalInfo);
    const formValues = Object.fromEntries(formData.entries());
    console.log(formValues)


    $.ajax({
        url: `${baseURL}/personalInfo`,
        method: 'POST',
        data: JSON.stringify(formValues),
        contentType: 'application/json',
        success: function (response) {
            console.log(response.status)
        },
        error: function (error) {
            alert("Sorry some error occured please try again later")
        }
    })
})
passwordChange.addEventListener('submit', (event)=>{
    event.preventDefault()

    var formData = new FormData(passwordChange);
    const formValues = Object.fromEntries(formData.entries());
    console.log(formValues)


    $.ajax({
        url: `${baseURL}/personalInfo`,
        method: 'POST',
        data: JSON.stringify(formValues),
        contentType: 'application/json',
        success: function (response) {
            console.log(response.status)
        },
        error: function (error) {
            alert("Sorry some error occured please try again later")
        }
    })
})

