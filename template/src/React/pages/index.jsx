import React from "react";
import { Head, useData } from "scratch-ssr";
import phpLogo from "../assets/scratch_logo.svg";
import reactLogo from "../assets/react-logo.svg";
export default function index(props) {
	console.log("props", props);

	return (
		<>
			<Head>
				<title>Scratch SSR</title>
				<meta
					name="description"
					content="Scratch is a modern PHP framework inspired by Symfony, designed for building web applications with seamless integration of React on both server-side rendering and client-side navigation."
				/>
			</Head>

			<div className="hero">
				<h1>Scratch SSR</h1>

				<p className="read-the-docs">Click on the Scratch logo to learn more</p>

				<a href="https://djemai-samy.com" target="_blank" style={{ width: "200px" }}>
					<div className="logo-container">
						<img src={phpLogo} alt="" style={{ width: "100%", height: "100%" }} />
						<img src={reactLogo} alt="" className="react-logo" />
					</div>
				</a>
			</div>

			<h2 className="logo-label">
				<span className="PHP">PHP</span> + <span className="React">React</span>
			</h2>
		</>
	);
}
