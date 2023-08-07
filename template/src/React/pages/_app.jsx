import "../style.css";
import classes from "../App.module.css";
import { Head, Link } from "scratch-sr";
const index = ({ children }) => {
	return (
		<>
			<Head>
				<meta charset="UTF-8" />
				<meta data-react-helmet="true" name="description" content="APP META" />
			</Head>
			<nav>
				<Link className={({ isActive }) => (isActive ? "active" : "inactive")} to="/">
					Home
				</Link>
				<Link
					className={({ isActive }) => (isActive ? "active" : "inactive")}
					to="/random"
				>
					Random
				</Link>
			</nav>
			<main style={{minHeight:"100vh"}}>{children}</main>
		</>
	);
};
export default index;
