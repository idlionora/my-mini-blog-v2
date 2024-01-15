type LoginSignupProps = {
	compType: string;
};

const LoginSignup = ({ compType }: LoginSignupProps) => {
	return (
		<main>
			<section>{compType}</section>
		</main>
	);
};

export default LoginSignup;
