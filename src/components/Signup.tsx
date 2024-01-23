import { useState } from 'react';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import setUserToLocalStorage from '@scripts/setUserToLocalStorage';

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

		if (formInput.password !== formInput.passwordConfirm) {
			setSignupStatus('diffPasswords');
			setIsLoading(false);
			return;
		}

		try {
			const res = (await axios.post(
				`${import.meta.env.PUBLIC_APISITE}/users/signup`,
				formInput
			)) as AxiosResponse;
			setUserToLocalStorage(res);

			setIsLoading(false);
			setSignupStatus('success');
		} catch (error) {
			const err = error as AxiosError;
			const errData = err.response?.data as { message: string; status: string };
			setIsLoading(false);
			if (err.response?.status === 400 && errData.message.includes('Duplicate')) {
				setSignupStatus('duplicateEmail');
			}
		}
	}

	if (signupStatus === 'diffPasswords' && formInput.passwordConfirm === formInput.password)
		setSignupStatus('');
	if (signupStatus === 'duplicateEmail' && submittedForm.email !== formInput.email)
		setSignupStatus('');

	return (
		<>
			{signupStatus === 'success' && (
				<div className="statusmsg success">
					Account is successfully created.
					<br />
					Please wait a moment...
				</div>
			)}
			{signupStatus === 'duplicateEmail' && (
				<div className="statusmsg fail">
					This email has already been registered.
					<br />
					Please log in!
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
					className={`auth-input ${signupStatus === 'duplicateEmail' ? 'fail' : ''}`}
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
					className={`auth-input ${signupStatus === 'diffPasswords' ? 'fail' : ''}`}
					placeholder="********"
					required
					minLength={8}
					onChange={(e) => setFormInput({ ...formInput, password: e.target.value })}
				/>
				<label htmlFor="passwordConfirm" className="auth-label">
					Confirm Password
				</label>
				<input
					type="password"
					name="passwordConfirm"
					id="passwordConfirm"
					className={`auth-input ${signupStatus === 'diffPasswords' ? 'fail' : ''}`}
					placeholder="********"
					required
					minLength={8}
					onChange={(e) =>
						setFormInput({ ...formInput, passwordConfirm: e.target.value })
					}
				/>
				<button
					type="submit"
					className={`auth-button mt-3.5 ${isLoading ? 'auth-loading' : ''}`}
				>
					{isLoading ? 'Please wait...' : 'Sign up'}
				</button>
			</form>
		</>
	);
};

export default Signup;
