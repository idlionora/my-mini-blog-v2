import axios, { AxiosError } from 'axios';
import { useRef, useState } from "react";

const ForgotPassword = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const [inputStatus, setInputStatus] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	async function submitEmail(event: React.FormEvent) {
		event.preventDefault()
		setIsLoading(true)

		const email = emailRef.current?.value;
		try {
			let res = await axios.post(`${import.meta.env.PUBLIC_APISITE}/users/forgotpassword`, {email});
			res = res.data;

			setIsLoading(false);
			setInputStatus('success');
		} catch(error) {
			const err = error as AxiosError;
			setIsLoading(false);
			if (err.response?.status === 404) {
				setInputStatus('emailNotFound')
			}
		}

	}
	return (
		<>
			{inputStatus === '' && (
				<p className="text-white text-lg mb-3">
					Enter your email address and we'll send you a password reset link.
				</p>
			)}
			{inputStatus === 'success' && (
				<div className="statusmsg success mb-2">
					Password reset link has been sent.
					<br />
					Please check your email.
				</div>
			)}
			{inputStatus === 'emailNotFound' && (
				<div className="statusmsg fail mb-2">
					This email has not been registered yet.<br/>Please enter your account's email.
				</div>
			)}
			<form className="w-full" onSubmit={(e) => submitEmail(e)}>
				<label htmlFor="email" className="auth-label">
					Email
				</label>
				<input
					type="email"
					name="email"
					id="email"
					ref={emailRef}
					className={`auth-input ${inputStatus === 'notRegistered' ? 'border-2 border-rose-400 focus:outline-rose-500' : 'focus:outline-blue-800'}`}
					placeholder="johndoe@email.com"
					required
				/>
				{inputStatus !== 'success' ? (
					<button
						type="submit"
						className={`auth-button mt-3.5 ${isLoading ? 'auth-loading' : ''}`}
					>
						{isLoading ? 'Please wait...' : 'Send Link'}
					</button>
				) : (
					<a href="/" className="auth-button mt-3 flex justify-center">
						Go Back
					</a>
				)}
			</form>
		</>
	);
};

export default ForgotPassword;
