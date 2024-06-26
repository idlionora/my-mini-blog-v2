import { useState } from 'react';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import setUserToLocalStorage from '@scripts/setUserToLocalStorage';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submittedForm, setSubmittedForm] = useState({ email: '', password: '' });
	const [isLoading, setIsLoading] = useState(false);
	const [loginStatus, setLoginStatus] = useState('');

	async function submitForm(event: React.FormEvent) {
		event.preventDefault();
		setSubmittedForm({ email, password });
		try {
			setIsLoading(true);
			let res = (await axios.post(`${import.meta.env.PUBLIC_APISITE}/users/login`, {
				email,
				password,
			})) as AxiosResponse;
			setUserToLocalStorage(res);

			setIsLoading(false);
			setLoginStatus('');
			window.location.replace('/')
		} catch (error) {
			const err = error as AxiosError;
			setIsLoading(false);
			if (err.response?.status === 401) {
				setLoginStatus('incorrectFill');
			}
		}
	}

	if (loginStatus === 'incorrectFill' && email !== submittedForm.email)
		setLoginStatus('isCorrecting');
	if (loginStatus === 'incorrectFill' && password !== submittedForm.password)
		setLoginStatus('isCorrecting');

	return (
		<>
			{loginStatus === 'incorrectFill' || loginStatus === 'isCorrecting' ? (
				<div className="statusmsg fail">Email or password is invalid!</div>
			) : (
				''
			)}
			<form className="w-full" onSubmit={(e) => submitForm(e)}>
				<label htmlFor="email" className="auth-label">
					Email
				</label>
				<input
					id="email"
					type="email"
					name="email"
					className={`auth-input ${loginStatus === 'incorrectFill' ? 'fail' : ''}`}
					placeholder="user@email.com"
					required
					onChange={(e) => setEmail(e.target.value)}
				/>
				<label htmlFor="password" className="auth-label">
					Password
				</label>
				<input
					id="password"
					type="password"
					name="password"
					className={`auth-input ${loginStatus === 'incorrectFill' ? 'fail' : ''}`}
					placeholder="********"
					required
					minLength={8}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<div className="flex justify-center mt-3.5 relative">
					<button
						type="submit"
						className={`auth-button ${isLoading ? 'auth-loading' : ''}`}
					>
						{isLoading ? 'Please wait...' : 'Log in'}
					</button>
				</div>
			</form>
		</>
	);
};

export default Login;
