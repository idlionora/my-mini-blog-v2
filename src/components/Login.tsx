import axios, { AxiosError } from 'axios';
import { useState } from 'react';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setpassword] = useState('');
	const [submittedForm, setSubmittedForm] = useState({email: '', password: ''})
	const [loginStatus, setLoginStatus] = useState('');

	async function submitForm(event: React.FormEvent) {
		event.preventDefault();
		setSubmittedForm({email, password})
		try {
			setLoginStatus(`${loginStatus} loading`);
			let res = await axios.post(`${import.meta.env.PUBLIC_APISITE}/api/v1/users/login`, {
				email,
				password,
			});
			res = res.data;
			console.log(res.status);
			setLoginStatus('success');
		} catch (error) {
			const err = error as AxiosError;
			if (err.response?.status === 401) {
				setLoginStatus('incorrectFill');
			}
		}
	}

	if (loginStatus === "incorrectFill" && email !== submittedForm.email) setLoginStatus('isCorrecting');
	if (loginStatus === 'incorrectFill' && password !== submittedForm.password) setLoginStatus('isCorrecting');

	return (
		<section className="auth-container" aria-label="Form to log in">
			<h2 className="text-white font-heading font-bold leading-8 text-[26px] mb-4">
				Log in to myMiniBlog
			</h2>
			{loginStatus.includes('incorrectFill') || loginStatus.includes("isCorrecting") ? (
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
					className={`auth-input ${loginStatus === 'incorrectFill' ? 'border-2 border-rose-400 focus:outline-rose-500' : 'focus:outline-blue-800'}`}
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
					className={`auth-input ${loginStatus === 'incorrectFill' ? 'border-2 border-rose-400 focus:outline-rose-500' : 'focus:outline-blue-800'}`}
					placeholder="********"
					required
					onChange={(e) => setpassword(e.target.value)}
				/>
				<div className="flex justify-center mt-3.5 relative">
					<button
						type="submit"
						className={`auth-button ${loginStatus === 'loading' ? 'auth-loading' : ''}`}
					>
						{loginStatus === 'loading' ? 'Please wait...' : 'Log in'}
					</button>
				</div>
			</form>
		</section>
	);
};

export default Login;
