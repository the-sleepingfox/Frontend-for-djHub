document.addEventListener("DOMContentLoaded", () => {
  let loginBtn = document.getElementById("login--btn");
  let logoutBtn = document.querySelector("#logout--btn");
  
  token = localStorage.getItem("token");

  if (token) {
    if (loginBtn) loginBtn.remove();
  } else {
    if (logoutBtn) logoutBtn.remove();
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      localStorage.removeItem("token");
      window.location = "login.html";
    });
  }

  let projectsUrl = "http://127.0.0.1:8000/api/projects/";

  let getProjects = () => {
    fetch(projectsUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        buildProjects(data);
      })
      .catch((error) => console.log("Error: ", error));
  };

  let buildProjects = (projects) => {
    let projectsWrapper = document.getElementById("projects--wrapper");
    projectsWrapper.innerHTML = "";
    for (let i = 0; i < projects.length; i++) {
      let project = projects[i];
      let projectCard = `
            <div class="project--card">
                <img class="featured--image" src= "http://127.0.0.1:8000${project.featured_image}">
                <div>
                    <div class= "card--header" >
                        <a target="_top" rel="external" href="${project.demo_link}"><h3>${project.title}</h3></a>
                        <strong class= "vote--option" data-vote= "up" data-project= "${
                          project.id
                        }" >&#43;</strong>
                        <strong class= "vote--option" data-vote= "down" data-project= "${
                          project.id
                        }" >&#8722;</strong>
                    </div>
                    <i>${project.vote_ratio}% Positive feedback</i>
                    <p>${project.discription.substring(0, 150)}</p>
                </div>
            </div>
        `;
      projectsWrapper.innerHTML += projectCard;
    }

    // Add Event Listners
    addVoteEvents();
  };

  let addVoteEvents = () => {
    let voteBtns = document.getElementsByClassName("vote--option");
    for (let i = 0; i < voteBtns.length; i++) {
      voteBtns[i].addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        let vote = e.target.dataset.vote;
        let project = e.target.dataset.project;

        if (token) {
          fetch(`http://127.0.0.1:8000/api/projects/${project}/votes/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ value: vote }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Success: ", data);
              getProjects();
            })
            .catch((error) => {
              console.log("Error: ", error);
            });
        } else {
            alert("You have to Sign in before making a vote");
        }
      });
    }
  };

  getProjects();
});
