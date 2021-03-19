"use strict";

let searchUser = document.getElementById("avatarName"),
	searchPreview = document.getElementById("avatar"),
	userInfo = document.querySelector('.user-info'),
	followersList = document.getElementById("followers-list"),
	subscriptionsList = document.getElementById("subscriptions-list");

searchUser.focus();

searchUser.addEventListener("change", ()=>getUser(searchUser.value))

async function getUser(name) {
	let response = await fetch(`https://api.github.com/users/${name}`);

	if(response.ok) {
		let result   = await response.json();
		searchUser.value = result.login;
		setAvatar(result.avatar_url);
		setInfo(result);
		setFollowers(result.followers_url);
		setTimeout(()=>setSubscriptions(result.subscriptions_url), 0);
	}
}
function setInfo(info) {
	if(info) {
		for(let i=0;i<userInfo.children[0].children.length;i++) {
			userInfo.children[0].children[i].children[1].textContent = info[userInfo.children[0].children[i].dataset.info];
		}	} 
	else {
		for(let i=0;i<userInfo.children[0].children.length;i++) {
			userInfo.children[0].children[i].children[1].textContent = "Undefined";
		}}
}
function setAvatar(src) {
	src = src || "https://im0-tub-ru.yandex.net/i?id=8c41602e8b341c22e4dcadd79f2c00a7&n=13&exp=1";
	// Set avatar
	console.log(src);
	avatar.src = src;
}
async function setFollowers(followersURL) {
	let response = await fetch(followersURL);
	if (response.ok) {
		let followers = await response.json();
		followersList.innerHTML = null;
		for(let i=0;i<followers.length-1;i++) {
			let newFollow = document.createElement("li");
			newFollow.classList.add("follower");
			newFollow.setAttribute("data-login", followers[i].login);
			// Follower avatar
			let followAvatar = document.createElement("img");
			followAvatar.src = followers[i].avatar_url;

			// Follower login
			let followLogin = document.createElement("span");
			followLogin.classList.add("name");
			/*
			 * Check login length
			 * if > 11 symbols, then cut
			 */  

			if (followers[i].login) 
				followLogin.textContent = (followers[i].login.length <= 11) ? followers[i].login : followers[i].login.split('').splice(0, 10).join('') + "...";

			newFollow.appendChild(followAvatar);
			newFollow.appendChild(followLogin);
			followersList.appendChild(newFollow);
		}
	}
}
async function setSubscriptions(subscriptionsURL) {
	let response = await fetch(subscriptionsURL);
	if (response.ok) {
		let subscriptions = await response.json();
		subscriptionsList.innerHTML = null;
		for(let i=0;i<subscriptions.length;i++) {
			let newSubscription = document.createElement("a");
			newSubscription.href = subscriptions[i].html_url;
			newSubscription.target = "_blank";
			newSubscription.classList.add("subscription");

			if (subscriptions[i].name) 
				newSubscription.textContent =  subscriptions[i].name;

			subscriptionsList.appendChild(newSubscription);
		}
	}
}
function inView(elem, inElem) {
	let elemPos = elem.getBoundingClientRect();
	let inElemPos = inElem.getBoundingClientRect();
	if (elemPos.top >= inElemPos.top && elemPos.bottom <= inElemPos.bottom
		&&
		elemPos.right <= inElemPos.right && elemPos.left >= inElemPos.left) {
		return true;
	} else {
		return false;
	}
}

followersList.addEventListener("click", function(e) {
	if(e.target.closest('li')) getUser(e.target.closest("li").dataset.login);
});
