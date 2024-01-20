import axios, { AxiosError } from 'axios';
import { useState } from 'react';

const emptyForm = {
	name: '',
	email: '',
	password: '',
	passwordConfirm: '',
};

const Signup = () => {
	const [formInput, setFormInput] = useState(emptyForm);
	const [submittedForm, setSubmittedForm] = useState(emptyForm);
	const [isLoading, setIsLoading] = useState(false);
	const [signupStatus, setSignupStatus] = useState('');

	async function submitForm(event: React.FormEvent) {
		event.preventDefault();
		setIsLoading(true);
		setSubmittedForm(formInput);
		let recentError = ''

		if (formInput.password !== formInput.passwordConfirm) {
			recentError = 'diffPasswords'
		}

		if (formInput.password.length < 8) {
			recentError = 'passLengthMin'
		}

		if (recentError.length > 0) {
			setSignupStatus(recentError)
			setIsLoading(false);
			return
		}

		try {
			let res = await axios.post(`${import.meta.env.PUBLIC_APISITE}/users/signup`, formInput);
			res = res.data;
			
			setIsLoading(false);
			setSignupStatus('success');
		} catch (error) {
			const err = error as AxiosError;
			setIsLoading(false)
			console.log(err)
			if (err.response?.status === 400 && err.response?.data?.message.includes('Duplicate')) {
				setSignupStatus('duplicateEmail')
			} 
		}
	}

	if (signupStatus === 'passLengthMin' && submittedForm.password !== formInput.password) setSignupStatus('');
	if (signupStatus === 'diffPasswords' && formInput.passwordConfirm === formInput.password)
		setSignupStatus('');
	if (signupStatus === 'duplicateEmail' && submittedForm.email !== formInput.email)
		setSignupStatus('');
	console.log(signupStatus)
	return (
		<>
			{signupStatus === 'success' && (
				<div className="statusmsg success">
					Account is successfully created.<br/>Please wait a moment...
				</div>
			)}
			{signupStatus === 'duplicateEmail' && (
				<div className="statusmsg fail">
					This email has already been registered.
					<br />
					Please log in!
				</div>
			)}
			{signupStatus === 'passLengthMin' && (
				<div className="statusmsg fail">
					Please provide a password longer than 7 characters.
				</div>
			)}
			{signupStatus === 'diffPasswords' && (
				<div className="statusmsg fail">Passwords are not the same!</div>
			)}
			<form className="w-full" onSubmit={(e) => submitForm(e)}>
				<label htmlFor="name" className="auth-label">
					Username
				</label>
				<input
					type="text"
					name="name"
					id="name"
					className="auth-input"
					placeholder="John Doe"
					required
					onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
				/>
				<label htmlFor="email" className="auth-label">
					Email
				</label>
				<input
					type="email"
					name="email"
					id="email"
					className={`auth-input ${signupStatus === 'duplicateEmail' ? 'border-2 border-rose-400 focus:outline-rose-500' : 'focus:outline-blue-800'}`}
					placeholder="johndoe@email.com"
					required
					onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
				/>
				<label htmlFor="password" className="auth-label">
					Password
				</label>
				<input
					type="password"
					name="password"
					id="password"
					className={`auth-input ${signupStatus === 'diffPasswords' || signupStatus === 'passLengthMin' ? 'border-2 border-rose-400 focus:outline-rose-500' : 'focus:outline-blue-800'}`}
					placeholder="********"
					required
					onChange={(e) => setFormInput({ ...formInput, password: e.target.value })}
				/>
				<label htmlFor="passwordConfirm" className="auth-label">
					Confirm Password
				</label>
				<input
					type="password"
					name="passwordConfirm"
					id="passwordConfirm"
					className={`auth-input ${signupStatus === 'diffPasswords' ? 'border-2 border-rose-400 focus:outline-rose-500' : 'focus:outline-blue-800'}`}
					placeholder="********"
					required
					onChange={(e) =>
						setFormInput({ ...formInput, passwordConfirm: e.target.value })
					}
				/>
				<div className="flex justify-start mt-3.5 relative">
					<button
						type="submit"
						className={`auth-button ${isLoading ? 'auth-loading' : ''}`}
					>
						{isLoading ? 'Please wait...' : 'Sign up'}
					</button>
				</div>
			</form>
		</>
	);
};

export default Signup;
