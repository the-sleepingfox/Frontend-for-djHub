console.log("hello")

let projectsUrl= "http://127.0.0.1:8000/api/projects/"

let getProjects= () => {
    fetch(projectsUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
}

getProjects()