// const baseURL = "http://localhost:3000"
const baseURL = "https://cipherschools-383611.as.r.appspot.com"
const aboutMe = document.querySelector('#submitAboutMe')
const onTheWeb = document.querySelector('#onTheWeb')
const personalInfo = document.querySelector('#personalInfo')
const passwordChange = document.querySelector('#passwordChange')
const updateInterests = document.querySelector('.saveInterests')


function refreshPg() {
  location.reload()
}
function deleteCookie(name) {
  if (confirm("Are you sure you want to log out ?")) {
    $.ajax({
      url: `${baseURL}/logout`,
      method: 'GET',
      data: JSON.stringify(),
      contentType: 'application/json',
      success: function (response) {
        if (response.status === "success")
          location.reload()
      },
      error: function (error) {
        alert("Sorry some error occured please try again later")
      }
    })


  }
}


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
      if (response.status === "success")
        alert(response.message)
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
      if (response.status === "success")
        alert(response.message)
      else alert(response.message)
    },
    error: function (error) {
      alert("Sorry some error occured please try again later")
    }
  })
})
personalInfo.addEventListener('submit', (event) => {
  event.preventDefault()
  const button = document.querySelector('.editInfo')
  var formData = new FormData(personalInfo);
  const formValues = Object.fromEntries(formData.entries());
  console.log(formValues)
  button.innerHTML = "<div class='loader'></div>"

  $.ajax({
    url: `${baseURL}/personalInfo`,
    method: 'POST',
    data: JSON.stringify(formValues),
    contentType: 'application/json',
    success: function (response) {
      if (response.status === "success") {
        button.innerHTML = "Edit"
        alert(response.message)
      } else {

        alert(response.message)
      }
    },
    error: function (error) {
      alert("Sorry some error occured please try again later")
    }
  })
})
passwordChange.addEventListener('submit', (event) => {
  event.preventDefault()

  var formData = new FormData(passwordChange);
  const formValues = Object.fromEntries(formData.entries());
  console.log(formValues)


  $.ajax({
    url: `${baseURL}/passwordUpdate`,
    method: 'POST',
    data: JSON.stringify(formValues),
    contentType: 'application/json',
    success: function (response) {
      if (response.status === "success") {
        const form = document.getElementById('passwordChange');
        const inputFields = form.querySelectorAll('input');
        inputFields.forEach((field) => {
          field.value = '';
        });
        alert(response.message)
      } else {
        const form = document.getElementById('passwordChange');
        const inputFields = form.querySelectorAll('input');
        inputFields.forEach((field) => {
          field.value = '';
        });

        alert(response.message)
      }
    },
    error: function (error) {
      alert("Sorry some error occured please try again later")
    }
  })
})
const profileInfoChange = document.querySelector('#profileInfoChange')

profileInfoChange.addEventListener('submit', async (event) => {
  event.preventDefault()
  const button = document.querySelector('.savePersonalInfo')
  button.innerHTML = '<div class="loader"></div>'
  var formData = new FormData(profileInfoChange);
  const fileInput = document.querySelector('#file-input')
  const file = fileInput.files[0];
  var base64String = ""
  if (file !== undefined) {

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    base64String = await new Promise((resolve) => {
      reader.addEventListener('load', () => {
        resolve(btoa(reader.result));
      });
    });

    formData.append('base64String', base64String)
    formData.append('fileType', file.type)
  }

  const formValues = Object.fromEntries(formData.entries());
  console.log(formValues)


  $.ajax({
    url: `${baseURL}/profileInfoChange`,
    method: 'POST',
    data: JSON.stringify(formValues),
    contentType: 'application/json',
    success: function (response) {
      if (response.status === "success") {
        button.innerHTML = 'Save'
        alert(response.message)
        location.reload()
      } else {
        alert(response.message)
        location.reload()
      }
    },
    error: function (error) {
      alert("Sorry some error occured please try again later")
    }
  })
})



function dispalyFolllowers(event){
  event.preventDefault()
  document.querySelector('.auth').style.display = "none";
  document.querySelector('.followersContainer').style.display = "";
  $.ajax({
    url: `${baseURL}/followers`,
    method: 'GET',
    data: JSON.stringify(),
    contentType: 'application/json',
    success: function (response) {
      if (response.status === "success") {
        var html = ""
        if (response.followers.length !== 0) {
          response.followers.forEach((follower) => {
            html += `<div class="card m-2 " style="width: 14rem;">
                        <img src="${follower.profilePic}" class="card-img-top" alt="...">
                        <div class="card-body text-center">
                            <div class="col">
                                <h5 class="card-title">${follower.name}</h5>
                                <p class="card-text">${follower.personalInfo.currentJob}</p>
                                <button href="#" class="btn">Follow Back</button>
                            </div>
                        </div>
                    </div>`
          })
        } else {
          html += `
          <div class="container text-center m-5">
            <h1 class="text-secondary">You are not following anyone</h1>
          </div>
          `
        }
        document.querySelector('.displayFollower').innerHTML = html
        if (response.suggestions !== undefined) {
          html = ""
          response.suggestions.forEach((suggestion) => {
            html += `<div class="card m-2 " style="width: 14rem;">
                        <img src="${suggestion.profilePic}" class="card-img-top" alt="...">
                        <div class="card-body text-center">
                            <div class="col">
                                <h5 class="card-title">${suggestion.username}</h5>
                                <p class="card-text">${suggestion.email}</p>
                                <button href="#" class="btn">Follow</button>
                            </div>
                        </div>
                    </div>`
          })
          document.querySelector('.displaySuggestion').innerHTML = html
        }
      } else {
        alert(response.message)
        location.reload()
      }
    },
    error: function (error) {
      alert("Sorry some error occured please try again later")
    }
  })
}



const interestsButtons = document.querySelectorAll('.category');
const toggleButtons = document.querySelectorAll('.toggleBtn');
var previousInterests = document.querySelector('#intrests').value
var selectedCategories = [];
if (previousInterests !== "") {
  previousInterests = previousInterests.split(',')
  selectedCategories = previousInterests;
}

interestsButtons.forEach((button) => {
  interestField = button.innerText.replace(/\s+/g, ' ').trim();
  if (previousInterests.includes(interestField)) {
    button.classList.add("selected");
  }
})

interestsButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // toggle the 'selected' class on the button element
    button.classList.toggle('selected');



    // if the button is selected, add its inner value to the array
    interestField = button.innerText.replace(/\s+/g, ' ').trim();
    // if(previousInterests.includes(interestField)){
    //   button.classList.add("selected");
    // }
    if (button.classList.contains('selected') && !selectedCategories.includes(interestField)) {
      selectedCategories.push(interestField);
    }
    // if the button is not selected, remove its inner value from the array
    else {

      const index = selectedCategories.indexOf(interestField);
      if (index !== -1) {
        selectedCategories.splice(index, 1);
      }
    }
    selectedCategories = selectedCategories.map(str => str.trim());
    console.log(selectedCategories);
  });
});


// loop through each button and add an event listener
toggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // toggle the "active" class on the button
    button.classList.toggle('active');
  });
});


updateInterests.addEventListener('click', async (event) => {
  event.preventDefault()
  const button = document.querySelector('.saveInterests')
  button.innerHTML = '<div class="loader"></div>'

  $.ajax({
    url: `${baseURL}/updateInterests`,
    method: 'POST',
    data: JSON.stringify(selectedCategories),
    contentType: 'application/json',
    success: function (response) {
      if (response.status === "success") {
        button.innerHTML = 'Save'
        alert(response.message)
        location.reload()
      } else {
        alert(response.message)
        location.reload()
      }
    },
    error: function (error) {
      alert("Sorry some error occured please try again later")
    }
  })
})