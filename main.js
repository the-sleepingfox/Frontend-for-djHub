document.addEventListener('DOMContentLoaded', () => {let loginBtn= document.getElementById('login--btn')
let logoutBtn= document.getElementById('logout--btn')

token= localStorage.getItem('token')

if(token){
    if(loginBtn) loginBtn.remove();
}else{
    if(logoutBtn) logoutBtn.remove();
}

if(logoutBtn){
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        window.location= "login.html"
    })
}

let projectsUrl= "http://127.0.0.1:8000/api/projects/"

let getProjects= () => {
    fetch(projectsUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        buildProjects(data);
    })
    .catch(error => console.log('Error: ', error));
}

let buildProjects= (projects) => {
    let projectsWrapper= document.getElementById("projects--wrapper");
    projectsWrapper.innerHTML= "";
    for(let i= 0; i< projects.length; i++){
        let project = projects[i];
        let projectCard= `
            <div class="project--card">
                <img src= "http://127.0.0.1:8000${project.featured_image}">
                <div>
                    <div class= "card--header">
                        <h3>${project.title}</h3>
                        <strong class= "vote--option" data-vote= "up" data-project= "${project.id}" >&#43;</strong>
                        <strong class= "vote--option" data-vote= "down" data-project= "${project.id}" >&#8722;</strong>
                    </div>
                    <i>${project.vote_ratio}% Positive feedback</i>
                    <p>${project.discription.substring(0, 150)}</p>
                </div>
            </div>
        `;
        projectsWrapper.innerHTML += projectCard;
    }

    // Add Event Listners
    addVoteEvents()

}

let addVoteEvents = () => {
    let voteBtns= document.getElementsByClassName('vote--option');
    for (let i = 0; i < voteBtns.length; i++){
        voteBtns[i].addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            let vote= e.target.dataset.vote;
            let project= e.target.dataset.project;

            if(token){
                fetch(`http://127.0.0.1:8000/api/projects/${project}/votes/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({'value': vote})
                })
                .then(response => response.json())
                .then((data) => {
                    console.log('Success: ', data);
                })
                .catch((error) => console.log('Error: ', error));
            }else{
                console.log("Error: No token found, Please Login");
            }
        })
    }
}

getProjects()
});