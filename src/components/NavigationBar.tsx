import { useEffect, useState } from "react"

const emptyUser = { id: '', name: '', photo: '' };

const NavigationBar = () => {
    const pathname = window.location.pathname
    const [userInfo, setUserInfo] = useState(emptyUser)

    useEffect(() => {       
        const localUser : (string | null) = localStorage.getItem('user_info');
        if (!localUser) return;

        let localObj = JSON.parse(localUser)  
        if (localObj.photo[1] === 'v') {
            setUserInfo({ ...localObj, photo: `${import.meta.env.PUBLIC_IMG_HOST}${localObj.photo}` });
        } else {
            setUserInfo(localObj)
        }
    }, [])
    
    return (
		<nav className="w-screen h-14 bg-theme-purple px-4 sm:px-5 flex justify-center">
			<div className="w-full max-w-screen-xl h-full flex justify-between relative">
				<div
					id="nav-section-1"
					className="w-full h-full flex items-center bg-theme-purple z-20"
				>
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
					<button id="nav-user-menu" className="pl-2 flex items-center">
						<p className="mr-1">Welcome, {userInfo.name || 'Guest'}!</p>
						<img src="/icons/chevron-down.svg" alt="" className={`w-4 h-fit`} />
					</button>
				</div>
				<ul className="h-full flex items-center whitespace-nowrap bg-theme-purple z-[21]">
					{pathname.length > 1 ? (
						<li>
							<button className="nav-link hidden sm:block">Home</button>
						</li>
					) : (
						''
					)}
					<li>
						<button className="nav-link hidden sm:block">About</button>
					</li>
					{pathname !== 'manage-posts' ? (
						<li>
							<button className="nav-link hidden sm:block">Manage Posts</button>
						</li>
					) : (
						''
					)}
				</ul>
			</div>
		</nav>
	);
}

export default NavigationBar
