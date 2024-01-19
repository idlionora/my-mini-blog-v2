import { useState } from 'react';

const Signup = () => {
	const [formInput, setFormInput] = useState({
		name: '',
		email: '',
		password: '',
		passwordConfirm: '',
	});
	const [isLoading, setIsLoading] = useState(false);

	function submitForm(event: React.FormEvent) {
		event.preventDefault();
	}
	return (
		<>
			<form className="w-full" onSubmit={(e) => submitForm(e)}>
				<label htmlFor="name" className="auth-label">
					Username
				</label>
				<input
					type="text"
					name="name"
					id="name"
					className={`auth-input`}
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
					className={`auth-input`}
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
					className={`auth-input`}
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
					className={`auth-input`}
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
