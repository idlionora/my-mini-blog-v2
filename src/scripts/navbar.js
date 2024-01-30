
const userMenuButton = document.getElementById('nav-usermenu-button');
const userMenuArrow = document.getElementById('nav-usermenu-arrow');
const userMenu = document.getElementById('nav-usermenu');
const userMenuLogout = document.getElementById('nav-usermenu-logout');

const navLinksPosts = document.getElementById('nav-links-posts');
const navLinksLogin = document.getElementById('nav-links-login');

const mobileMenuButton = document.getElementById('nav-mobilemenu-button');
const mobileMenu = document.getElementById('nav-mobilemenu');
const mobileMenuPosts = document.getElementById('nav-mobilemenu-posts');
const mobileMenuProfile = document.getElementById('nav-mobilemenu-profile');
const mobileMenuLogout = document.getElementById('nav-mobilemenu-logout');
const mobileMenuLogin = document.getElementById('nav-mobilemenu-login');

const userPhoto = document.getElementById('userinfo-photo');
const userName = document.getElementById('userinfo-name');


// DROPDOWN BUTTON FUNCTIONS //
let isUserMenuActive = false;
let isMobileMenuActive = false;

const toggleUserMenu = () => {
    if (!isUserMenuActive) {
        userMenuArrow.classList.add('rotate-halfcircle');
        userMenu.classList.add('slide-down-full');
        userMenu.classList.remove('menu-disabled');
        isUserMenuActive = true;
    } else {
        userMenuArrow.classList.remove('rotate-halfcircle');
		userMenu.classList.remove('slide-down-full');
		userMenu.classList.add('menu-disabled');
        isUserMenuActive = false;
    }
}

const toggleMobileMenu = () => {
    console.log(mobileMenu.classList.value)
    if (!isMobileMenuActive) {
        mobileMenuButton.classList.add('shadow-whiteglow');
        mobileMenu.classList.replace('hidden', 'flex');
        setTimeout(() => {mobileMenu.classList.remove('slide-right-full')}, 10);
		isMobileMenuActive = true;
        
    } else {
        mobileMenuButton.classList.remove('shadow-whiteglow');
        mobileMenu.classList.add('slide-right-full')
        setTimeout(() => {mobileMenu.classList.replace('flex', 'hidden');}, 310)
        isMobileMenuActive = false;
    }
}

// LOGOUT FUNCTIONS //
function setNavbarLogout() {
	userMenuButton.classList.remove('sm-cursor-pointer');
	userMenuArrow.classList.remove('sm-block');
	userMenu.classList.remove('sm-button');

	if (navLinksPosts) navLinksPosts.classList.add('hidden');
	navLinksLogin.classList.remove('hidden');

	if (mobileMenuPosts) mobileMenuPosts.classList.add('hidden');
	mobileMenuProfile.classList.add('hidden');
	mobileMenuLogout.classList.add('hidden');
	navLinksLogin.classList.remove('hidden');

    userMenuLogout.removeEventListener('click', logout);
	mobileMenuLogout.removeEventListener('click', logout);
    userMenuButton.removeEventListener('click', toggleUserMenu);
}

const logout = () => {
	localStorage.removeItem('user_jwt');
	localStorage.removeItem('user_info');
	userName.innerHTML = 'Guest';
	userPhoto.src = '/images/noun-user-1256674-profile.png';
	setNavbarLogout();
}

// READ LOCALSTORAGE AND LOGIN //
function appendUserInfo({name, photo}) {
    userName.innerHTML = name;

    if (photo[1] ==='v') {
        userPhoto.src = `${import.meta.env.PUBLIC_IMG_HOST}${photo}`;
    } else {
        userPhoto.src = photo;
    }
    
}

function setNavbarLogin() {
    userMenuButton.classList.add('sm-cursor-pointer');
    userMenuArrow.classList.add('sm-block');
    userMenu.classList.add('sm-block');

    if (navLinksPosts) navLinksPosts.classList.remove('hidden');
    navLinksLogin.classList.add('hidden');

    if (mobileMenuPosts) mobileMenuPosts.classList.remove('hidden');
    mobileMenuProfile.classList.remove('hidden');
    console.log(mobileMenuLogout.classList.value)
    mobileMenuLogout.classList.remove('hidden');
    navLinksLogin.classList.add('hidden') 
    
    userMenuLogout.addEventListener('click', logout);
    mobileMenuLogout.addEventListener('click', logout);
    userMenuButton.addEventListener('click', toggleUserMenu);
}

const readUserInfo = () => {
    // check for token's expiration date
    let userJWT = localStorage.getItem('user_jwt');
    if (!userJWT) {
        return
    }
    userJWT = JSON.parse(userJWT);
	const dateExp = new Date(userJWT.expires);

    // delete user's data from localStorage if expired
	if (Date.now() > dateExp) {
        localStorage.removeItem('user_jwt');
        localStorage.removeItem('user_info');
        return        
    }

    // set current user as logged in
    let userInfo = localStorage.getItem('user_info');
    if (!userInfo) {
        return
    }
    userInfo = JSON.parse(userInfo);
    appendUserInfo(userInfo)
    setNavbarLogin()    
}

const navbarInit = () => {
    readUserInfo();
    mobileMenuButton.addEventListener('click', toggleMobileMenu)
}

navbarInit()
