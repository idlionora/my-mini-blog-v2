import type { AxiosResponse } from "axios";

export function setUserToLocalStorage (res:AxiosResponse) {
    const resData = res.data as {
		data: { user: object };
		token: string;
	};
	const userData = resData.data.user as { _id: string; name: string; photo: string };

	const userJWT = {
		value: resData.token,
		expires: new Date(Date.now() + import.meta.env.PUBLIC_JWT_EXP_IN * 24 * 60 * 60 * 1000),
	};
	const userInfo = { id: userData._id, name: userData.name, photo: userData.photo };
	localStorage.setItem('user_jwt', JSON.stringify(userJWT));
	localStorage.setItem('user_info', JSON.stringify(userInfo));
}

export default setUserToLocalStorage
