export const BrandLogo = () => (
	<svg
		width={36}
		height={36}
		viewBox="0 0 36 36"
		xmlns="http://www.w3.org/2000/svg"
		className="fill-primary stroke-primary"
	>
		<path
			d="M10.5 30H25.5"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M15 30C23.25 26.25 16.2 20.4 19.5 15"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M14.25 14.0999C15.9 15.2999 16.95 17.3999 17.7 19.6499C14.7 20.2499 12.45 20.2499 10.5 19.1999C8.7 18.2999 7.05 16.3499 6 12.8999C10.2 12.1499 12.6 12.8999 14.25 14.0999Z"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M21.1502 9C20.0065 10.7873 19.4313 12.8792 19.5002 15C22.3502 14.85 24.4502 14.1 25.9502 12.9C27.4502 11.4 28.3502 9.45 28.5002 6C24.4502 6.15 22.5002 7.5 21.1502 9Z"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const Brand = () => (
	<div className="flex items-center justify-center">
		<BrandLogo />
		<h1 className="font-bold text-foreground">Growy</h1>
	</div>
)

