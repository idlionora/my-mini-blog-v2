import { useState } from 'react';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setpassword] = useState('');

	function submitForm(event: React.FormEvent) {
		event.preventDefault();
	}
	return (
		<section className="auth-container" aria-label="Form to log in">
			<h2 className="text-white font-heading font-bold leading-8 text-[26px]">
				Log in to myMiniBlog
			</h2>
			<form className="w-full mt-4" onSubmit={(e) => submitForm(e)}>
				<label htmlFor="email" className="auth-label">
					Email
				</label>
				<input
					id="email"
					type="email"
					name="email"
					className={`auth-input`}
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
					className={`auth-input`}
					placeholder="********"
					required
					onChange={(e) => setpassword(e.target.value)}
				/>
			</form>
		</section>
	);
};

export default Login;
