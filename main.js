

let theInput = document.querySelector("header form input");
let getButton = document.querySelector("header form button");
let aside_section = document.querySelector("aside");
let showData = document.querySelector("main .show-data");



document.addEventListener('DOMContentLoaded', () => {
    // Define the default user
    const defaultUser = 'ShroukOuda';
    if (!theInput.value)
        theInput.value = defaultUser;
    displayUserProfile();
    getRepos();
   
});


// Prevent form submission and refresh
document.querySelector("header form").onsubmit = function(event) {
    event.preventDefault(); // Prevent the form from submitting
    displayUserProfile();
    getRepos();
};
let previousElement = null; 

// Helper function to handle click events and apply styles
function handleClick(selector, callback) {
    const element = document.querySelector(selector);
    element.onclick = function() {
        callback(); // Call the respective function (getRepos, getFollowing, etc.)

         // Reset the style of the previously clicked element if it exists
        if (previousElement) {
            previousElement.classList.remove('active');
        }

        // Apply styles to the currently clicked element
        element.classList.add('active');

        // Update previousElement to the current one
        previousElement = element;

    };
}
handleClick("main .links .repositry", getRepos);
handleClick("main .links .following", getFollowing);
handleClick("main .links .followers", getFollowers);


function check_link(link) {
    if (link)
        return link;
    else
        return 'Not Available'
}

function check_name(user, name) {
    if (name)
        return name;
    else
        return user.login;
}





function displayUserProfile() {
   
    fetch(`https://api.github.com/users/${theInput.value}`)
    .then((response) => response.json())

    .then((user) => {

        const dateObj = new Date(user.created_at);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('en-US', { month: 'long' });
        const year = dateObj.getFullYear();
        const joinDate = `${day} ${month} ${year}`;
        const bioSection = user.bio ? `<p>${user.bio}</p>` : '<p>This profile has no bio</p>';

        aside_section.innerHTML = `
        <section class="user-profile">
            <div class="flex">
                <picture>
                    <img src="${user.avatar_url}" alt="Avatar of ${user.login}" class="avatar">
                </picture>
                <header>
                    <h2>${check_name(user, user.name)}</h2>
                    <h4>@${user.login}</h4>
                    <p>Joined <time datetime="${joinDate}">${joinDate}</time></p>
                </header>
            </div>
            <section class="bio">
                <p>${bioSection}</p>
            </section>
            <section class="github-link">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <a target="_blank" href="https://github.com/${theInput.value}" aria-label="See ${user.login}'s profile on GitHub">See on GitHub</a>
            </section>
            <section class="assets">
                    <p><span>${user.public_repos}</span>Reops<p>
                    <p><span>${user.followers}</span>Followers<p>
                    <p><span>${user.following}</span>Following<p>
            </section>
            <section class="links">
                <div class="location">
                    <div class="location-icon"><i class="fa-solid fa-location-dot"></i></div>
                    <span>${check_link(user.location)}</span>
                </div>
                <div class="company">
                    <div class="company-icon"><i class="fa-solid fa-building"></i></div>
                    <span>${check_link(user.company)}</span>
                </div>
                <div class="website">
                    <div class="website-icon"><i class="fa-solid fa-globe"></i></div>
                    <a href="https://${user.blog}" target="_blank" rel="noopener" aria-label="Visit ${user.login} website">${check_link(user.blog)}</a>
                </div>
                <div class="twitter">
                    <div class="twitter-icon"><i class="fa-brands fa-twitter"></i></div>
                    <a href="https://twitter.com/${user.twitter_username}" target="_blank" rel="noopener" aria-label="Visit ${user.company}'s Twitter profile">${check_link(user.twitter_username)}</a>
                </div>
            </section>

        </section>
        `
    })
}


/***********************************************************************************************/
function getRepos() {
    if (!theInput.value) { // Check for empty input
        console.error("Username input is empty.");
        return;
    }
    else
    {
         // Empty the container
        showData.innerHTML = '';
        fetch(`https://api.github.com/users/${theInput.value}/repos`)
        .then((response) => response.json())
        .then((repos) => {
        // Loop through each repo
        repos.forEach(repo => {
            // Create the main div element
            let mainDiv = document.createElement("div");

            // Create Repo Name Div
            let repoDiv = document.createElement("div");

            // Create Repo Name Text
            let repoName = document.createTextNode(repo.name);

            // Append the Repo Name to the Repo Div
            repoDiv.appendChild(repoName);

            // Create Repo URL Anchor
            let theUrl = document.createElement('a');

            // Create Repo URL Text
            let theUrlText = document.createTextNode("See on GitHub");

            // Append the URL text to the anchor tag
            theUrl.appendChild(theUrlText);

            // Add the hyperlink reference (href)
            theUrl.href = `https://github.com/${theInput.value}/${repo.name}`;

            // Set target to open link in new tab
            theUrl.setAttribute('target', '_blank');
            // Create repoLink Div
            let repoLink = document.createElement("div");
            //Append icon 
            repoLink.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
            // Append the URL anchor to the repo-link
            repoLink.appendChild(theUrl);
            repoLink.className = "repo-link";
            // Append repoLinK TO repoDiv
            repoDiv.appendChild(repoLink);

            // Append the Repo Div to the Main Div
            mainDiv.appendChild(repoDiv);

            //Fetch languages used in the repo
        
            // fetch(`https://api.github.com/repos/${theInput.value}/${repo.name}/languages`)
            // .then((response) => response.json())
            // .then((langs) => {
            //     // Create a Languages Div
            //     let languagesDiv = document.createElement('div');

            //     // Get languages as a string
            //     let languagesText = document.createTextNode(`Languages: ${Object.keys(langs).join(', ')}`);

            //     // Append the languages text to the Languages Div
            //     languagesDiv.appendChild(languagesText);

            //     // Append the Languages Div to the Main Div
            //     mainDiv.appendChild(languagesDiv);

            //      // Create the div for stats (stars, forks, watchers)
            //     let statsDiv = document.createElement("div");

            //     // Create Stars Count Span
            //     let starsSpan = document.createElement('span');
            //     starsSpan.innerHTML = `<i class="fa-regular fa-star"></i> ${repo.stargazers_count}`;
            //     statsDiv.appendChild(starsSpan);

            //     // Create Forks Count Span
            //     let forksSpan = document.createElement('span');
            //     forksSpan.innerHTML = `<i class="fa-solid fa-code-fork"></i> ${repo.forks_count}`;
            //     statsDiv.appendChild(forksSpan);

            //     // Create Watchers Count Span
            //     let watchersSpan = document.createElement('span');
            //     watchersSpan.innerHTML = `<i class="fa-regular fa-eye"></i> ${repo.watchers_count}`;
            //     statsDiv.appendChild(watchersSpan);

            //     // Append the stats div to the Main Div
            //     mainDiv.appendChild(statsDiv);

            //    

            //     
            // });

            

           /******************************************************************************************/
           /******************************************************************************************/ 
            // Add class to the Main Div for styling
            mainDiv.className = 'repo-box';
            // Append Main Div To ShowData
            showData.appendChild(mainDiv);
        });
    });
}
}


/*********************************************************************************************/

function fetchAndDisplay(url, processData) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => processData(data))
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            showData.innerHTML = 'Failed to load data.';
        });
}

function displayFollowersOrFollowing(items) {
    showData.innerHTML = '';
    items.forEach(item => {
        showData.innerHTML += `
            <div class="follower-box">
                <div class="flex">
                    <picture>
                        <img src="${item.avatar_url}" alt="Avatar of ${item.login}" class="avatar">
                    </picture>
                    <header>
                        <h2>${check_name(item, item.name)}</h2>
                        <h4>@${item.login}</h4>
                    </header>
                </div>
                <section class="github-link">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <a target="_blank" href="https://github.com/${item.login}" aria-label="See ${item.login}'s profile on GitHub">See on GitHub</a>
                </section>
            </div>
        `;
    });
}

function getFollowers() {
    const url = `https://api.github.com/users/${theInput.value}/followers`;
    fetchAndDisplay(url, displayFollowersOrFollowing);
}

function getFollowing() {
    const url = `https://api.github.com/users/${theInput.value}/following`;
    fetchAndDisplay(url, displayFollowersOrFollowing);
}

