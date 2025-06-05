let theInput = document.querySelector("header form input");
let getButton = document.querySelector("header form button");
let aside_section = document.querySelector("aside");
let showData = document.querySelector("main .show-data");


const defaultUser = 'ShroukOuda';

document.addEventListener('DOMContentLoaded', () => {
    if (!theInput.value) theInput.value = defaultUser;
    

    const repoTab = document.querySelector("main .links .repositry");
    if (repoTab) {
        repoTab.classList.add('active');
    }
    
    updateProfile();
});


async function updateProfile() {
    await displayUserProfile();
    
  
    const activeTab = document.querySelector('.active');
    if (activeTab) {
        if (activeTab.classList.contains('repositry')) {
            await getRepos();
        } else if (activeTab.classList.contains('following')) {
            getFollowing();
        } else if (activeTab.classList.contains('followers')) {
            getFollowers();
        }
    } else {
        await getRepos();
    }
}


document.querySelector("header form").onsubmit = function(event) {
    event.preventDefault();
    updateProfile();
};

const links = document.querySelector("main .links");
links.addEventListener('click', (e) => {
    const target = e.target.closest('.repositry, .following, .followers');
    if (!target) return;


    document.querySelector('.active')?.classList.remove('active');
    target.classList.add('active');


    if (target.classList.contains('repositry')) getRepos();
    else if (target.classList.contains('following')) getFollowing();
    else if (target.classList.contains('followers')) getFollowers();
});


const check_link = link => link || 'Not Available';
const check_name = (user, name) => name || user.login;


async function displayUserProfile() {
    try {
        const response = await fetch(`https://api.github.com/users/${theInput.value}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const user = await response.json();
        
        const dateObj = new Date(user.created_at);
        const joinDate = dateObj.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });

        const bioSection = user.bio || 'No bio available';

        aside_section.innerHTML = `
        <section class="user-profile">
            <div class="flex">
                <picture>
                    <img src="${user.avatar_url}" alt="Avatar of ${user.login}" class="avatar">
                </picture>
                <header>
                    <h2>${check_name(user, user.name)}</h2>
                    <h4>@${user.login}</h4>
                    <p>Joined <time datetime="${user.created_at}">${joinDate}</time></p>
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
                <p><span>${user.public_repos}</span>Repos</p>
                <p><span>${user.followers}</span>Followers</p>
                <p><span>${user.following}</span>Following</p>
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
                    <a href="https://twitter.com/${user.twitter_username}" target="_blank" rel="noopener" aria-label="Visit ${user.login}'s Twitter profile">${check_link(user.twitter_username)}</a>
                </div>
            </section>
        </section>
        `;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        aside_section.innerHTML = '<p>Error loading user profile</p>';
    }
}


async function getRepos() {
    if (!theInput.value) {
        console.error("Username input is empty.");
        return;
    }

    try {
        showData.innerHTML = '';
        const response = await fetch(`https://api.github.com/users/${theInput.value}/repos`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const repos = await response.json();
        
        const fragment = document.createDocumentFragment();
        
        repos.forEach(repo => {
            const mainDiv = document.createElement("div");
            mainDiv.className = 'repo-box';
            mainDiv.innerHTML = `
                <div>
                    ${repo.name}
                    <div class="repo-link">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        <a href="https://github.com/${theInput.value}/${repo.name}" target="_blank">See on GitHub</a>
                    </div>
                </div>
            `;
            fragment.appendChild(mainDiv);
        });
        
        showData.appendChild(fragment);
    } catch (error) {
        console.error('Error fetching repos:', error);
        showData.innerHTML = '<p>Error loading repositories</p>';
    }
}


async function fetchAndDisplay(url, processData) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        processData(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        showData.innerHTML = '<p>Failed to load data.</p>';
    }
}

function displayFollowersOrFollowing(items) {
    showData.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'follower-box';
        div.innerHTML = `
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
        `;
        fragment.appendChild(div);
    });
    
    showData.appendChild(fragment);
}

function getFollowers() {
    const url = `https://api.github.com/users/${theInput.value}/followers`;
    fetchAndDisplay(url, displayFollowersOrFollowing);
}

function getFollowing() {
    const url = `https://api.github.com/users/${theInput.value}/following`;
    fetchAndDisplay(url, displayFollowersOrFollowing);
}