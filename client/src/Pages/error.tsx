export default function ErrorPage(props:{msg:string}) {
	return(
		<>
			<nav>
				<h1>Error</h1>
			</nav>
			<article>
				<p>{props.msg}</p>
			</article>
		</>
	)
}