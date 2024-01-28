import { useEffect, useRef, useState } from 'react';

interface LocalUserObj {
	id: string;
	name: string;
	photo: string;
}

function setLocalUser() {
	const localUser: string | null = localStorage.getItem('user_info');
	if (!localUser) return;

	let localObj: LocalUserObj;
	localObj = JSON.parse(localUser);
	if (localObj.photo[1] === 'v') {
		return {
			...localObj,
			photo: `${import.meta.env.PUBLIC_IMG_HOST}${localObj.photo}`,
		};
	} else {
		return localObj;
	}
}

const emptyUser = { id: '', name: '', photo: '' };

const NavigationBar = () => {
	const pathname = window.location.pathname;
	const navbarRef = useRef<HTMLElement>(null);
	const userMenuRef = useRef<HTMLDivElement>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const [userInfo, setUserInfo] = useState(setLocalUser() || emptyUser);
	const [activeDropdown, setActiveDropdown] = useState('');

	function toggleDropdown(menu:string) {
		if (activeDropdown !== menu) {
			setActiveDropdown(menu);
		} else {
			setActiveDropdown('');
		}
	}

	function logout() {
		setActiveDropdown('');
		localStorage.removeItem('user_info');
		localStorage.removeItem('user_jwt');
		setUserInfo(emptyUser)
	}

	useEffect(() => {
		document.addEventListener('mousedown', closeDropdown);
		
		return () => {
			document.removeEventListener('mousedown', closeDropdown)
		};
	}, [activeDropdown])

	function closeDropdown(event: MouseEvent) {
		const clickTarget = event.target as Node;
		const dropdownRefs = [{ref: userMenuRef, activeLabel: 'userMenu'}, {ref: mobileMenuRef, activeLabel: 'mobileMenu'}]

		function deactivateDropdownByClick(ref: React.RefObject<HTMLDivElement>, activeLabel: string) {
			if (activeDropdown !== activeLabel || navbarRef.current?.contains(clickTarget)) {
				return
			}
			if (!ref.current?.contains(clickTarget)) {
				setActiveDropdown('')
			}
		}
		dropdownRefs.forEach(({ref, activeLabel}) => deactivateDropdownByClick(ref, activeLabel))
	}


	return (
		<>
			<nav
				ref={navbarRef}
				className="w-screen h-14 px-4 sm:px-5 flex justify-center absolute left-0 top-0 bg-theme-purple z-[18]"
			>
				<div className="w-full max-w-screen-xl h-full flex justify-between items-center relative">
					<div id="nav-section-1" className="w-fit h-full relative">
						<div className="w-fit h-full min-w-[12rem] flex items-center bg-theme-purple z-20 relative">
							<div
								id="nav-photo"
								className="w-10 h-10 bg-white rounded-full shrink-0 overflow-hidden flex justify-center items-center"
							>
								<img
									src={userInfo.photo || '/images/noun-user-1256674-profile.png'}
									alt="User photo"
									className="w-11 h-11 object-cover object-center"
								/>
							</div>
							<button
								id="nav-user-menu"
								className={`pl-2 flex items-center min-w-[9.5rem] relative cursor-default ${userInfo.id ? 'sm:cursor-pointer' : ''}`}
								onClick={() => toggleDropdown('userMenu')}
							>
								<div className="pr-6">Welcome, {userInfo.name || 'Guest'}!</div>
								<img
									src="/icons/chevron-down.svg"
									alt=""
									className={`w-4 h-fit absolute right-0 transition-all duration-250 ease-in-out ${!userInfo.id ? 'hidden' : 'hidden sm:block '} ${activeDropdown === 'userMenu' ? 'rotate-180' : ''}`}
								/>
							</button>
						</div>
						<div
							ref={userMenuRef}
							className={`hidden ${userInfo.id ? 'sm:block ' : ''}absolute left-0 bottom-0 bg-white w-full border-x border-b border-violet-400 rounded-b-lg overflow-hidden transition-all duration-250 ease-in-out z-[19] ${activeDropdown === 'userMenu' ? 'translate-y-[100%]' : ''}`}
						>
							{userInfo.id ? (
								<>
									<a
										href="/profile"
										className={`button-usermenu ${activeDropdown !== 'userMenu' ? 'disabled' : ''}`}
									>
										Edit Profile
									</a>
									<button
										className={`button-usermenu ${activeDropdown !== 'userMenu' ? 'disabled' : ''}`}
										onClick={() => logout()}
									>
										Log Out
									</button>
								</>
							) : (
								''
							)}
						</div>
					</div>
					<ul className="h-full flex items-center whitespace-nowrap">
						{pathname.length > 1 && (
							<li>
								<a href="/" className="nav-link hidden sm:block">
									Home
								</a>
							</li>
						)}
						<li>
							<a href="/about" className="nav-link hidden sm:block">
								About
							</a>
						</li>
						{pathname !== '/manage-posts' && userInfo.id && (
							<li>
								<a href="/manage-posts" className="nav-link hidden sm:block">
									Manage Posts
								</a>
							</li>
						)}
						{!userInfo.id && (
							<li>
								<a href="/login" className="nav-link hidden sm:block">
									Log In
								</a>
							</li>
						)}
					</ul>
					<button
						id="nav-mobile-menu"
						className={`border rounded border-violet-500 sm:hidden ${activeDropdown === 'mobileMenu' ? 'shadow shadow-white' : 'shadow'}`}
						aria-label="Main menu"
						onClick={() => toggleDropdown('mobileMenu')}
					>
						<img src="/icons/hamburger-menu.svg" alt="" className="w-5 h-5 m-1" />
					</button>
				</div>
			</nav>
			<div
				ref={mobileMenuRef}
				className={`absolute right-0 bg-neutral-01 h-dvh w-full max-w-40 flex flex-col gap-3 z-[17] pt-16 px-1 border-l border-violet-300 transition-all duration-300 ease-in-out sm:hidden ${activeDropdown === 'mobileMenu' ? '' : 'translate-x-[100%]'}`}
			>
				{pathname.length > 1 && (
					<a href="/" className="button-mobilemenu">
						Home
					</a>
				)}
				<a href="/about" className="button-mobilemenu">
					About
				</a>
				{pathname !== '/manage-posts' && userInfo.id && (
					<a href="/manage-posts" className="button-mobilemenu">
						Manage Posts
					</a>
				)}
				{userInfo.id ? (
					<>
						<a href="/profile" className="button-mobilemenu">
							Edit Profile
						</a>
						<button className="button-mobilemenu text-start" onClick={() => logout()}>Log Out</button>
					</>
				) : (
					<a href="/login" className="button-mobilemenu">
						Log In
					</a>
				)}
			</div>
		</>
	);
};

export default NavigationBar;
