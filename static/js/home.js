// Get data from local storage
let data = getTaskData()

let points = getPoints()

// Insert data into input fields on form
const pointsForm = document.querySelector('#points')
for (let objective in data) {
    if (data.hasOwnProperty(objective)) {
        if (data[objective] > 0) {
            pointsForm.querySelector("input[name='" + objective + "']").value = data[objective]
        }
    }
}

// Check for change in points

// Submit points
// When user submits form, redirect to another page
pointsForm.addEventListener('change' , (event) => {
    saveData()
})

pointsForm.addEventListener('submit', (event) => {
    // Stop page from reloading (default)
    event.preventDefault()

    // Sends user to prize page
    window.location.href = "./final"

})

// This function runs every second and serves two purposes:
// * Save the user submitted data to localstorage
// * Update the total number of points and save that to local storage
function saveData() {
    
    // Set data to most recent user entered data
    for (var objective in data) {
        if (data.hasOwnProperty(objective)) {
            let val = pointsForm.querySelector("input[name='" + objective +"']").value
            console.log(val)
            if (val == "") {
                data[objective] = 0
            } else {
                data[objective] = parseInt(val)
            }
        }
    }

    // Save data object to local storage
    saveTaskData(data)

    let pointVals = {
        meditationClass: 1,
        fruits: 1,
        noSugaryDrinks: 1,
        fitnessClass: 1,
        homeLunch: 1,
        parkFar: 1,
        sleep: 1,
        upstairsBathroom: 1,
        seatbelt: 1,
        medications: 5,
        snackForOffice: 5,
        increaseSteps: 5,
        exercise: 5,
        lunchAndLearn: 25,
        read: 25,
        healthyBlog: 25,
        annualConsult: 50,
        annualPhysical: 50,
    }

    // Set initial points
    let points = 0;
    
    console.log()
    var total = 0
    for (var key in pointVals) {
        if (data[key] > 0) {
            total = total + (pointVals[key] * data[key]) 
        }
    }

    // Set #point-total tag to show points
    document.querySelector("#point-total").textContent = total

    savePoints(total)

    let points2 = getPoints()

 // determine length of progress bar
     

    let status1 = "none"

    let pointsLeft = 0
    if (points2 < 350) {
        withinPlat.style.display = "initial"
    }

    if (points2 <150) {
        let currentLevel = document.querySelector("#currentLevel")
        currentLevel.style.display = "none"
        pointsLeft = 150-points2
        status1 = "silver"
        let beyondPlat = document.getElementById("beyondPlat")
        beyondPlat.style.display = "none"
    }
    if (points2 >=150 && points2<250) {
        let currentLevel = document.querySelector("#currentLevel")
        currentLevel.style.display = "initial"
        document.querySelector("#levelValue").textContent = "Silver"
        let beyondPlat = document.getElementById("beyondPlat")
        beyondPlat.style.display = "none"
        pointsLeft = 250-points2
        status1 = "gold"
    }
    if (points2 >=250 && points2<350) {
        let currentLevel = document.querySelector("#currentLevel")
        currentLevel.style.display = "initial"
        document.querySelector("#levelValue").textContent = "Gold"
        let beyondPlat = document.getElementById("beyondPlat")
        beyondPlat.style.display = "none"
        
        pointsLeft=350-points2
        status1 = "platinum"
    }
    if (points2 >= 350) {
        let currentLevel = document.querySelector("#currentLevel")
        currentLevel.style.display = "initial"
        document.querySelector("#levelValue").textContent = "Platinum"
        let withinPlat = document.getElementById("withinPlat")
        beyondPlat.style.display = "initial"
        withinPlat.style.display = "none"
    }
    var progressbar = document.getElementById("progress-bar")
   if (points2 < 151) {
       percent = (points2) /150 *100
    percent_string = "" + percent + "%" 
    console.log(percent_string) 
    progressbar.style.width = percent_string 
   }
   else if (points2 > 150, points2 < 251 ){
    percent = (points2 -150)
    percent_string = "" + percent + "%" 
    console.log(percent_string) 
    progressbar.style.width = percent_string 
   }
   else if (points2 > 250 ){
    percent = (points2 -250)
    percent_string = "" + percent + "%" 
    console.log(percent_string) 
    progressbar.style.width = percent_string 
   }
    var progressbar = document.getElementById("progress-bar") 
        if (points2 < 150){
            progressbar.style.background = "black"
        }
   else if (points2 => 150, points2 < 250) {
    progressbar.style.background = "gray"
    }   
   else if (points2 => 250, points2 < 350) {
     progressbar.style.background = "gold"
    }   
    else if (points2 => 350 ) {
        progressbar.style.background = "rgb(175,238,238"
    }   
    document.querySelector("#pointsLeft").textContent = pointsLeft
    document.querySelector("#status1").textContent = status1
}
   
        
saveData()