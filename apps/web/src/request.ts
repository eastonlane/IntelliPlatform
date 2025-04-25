const BASE_URL = 'http://localhost:5173';

const fetchWrapper = (endpoint: string, options = {}) => {
	const url = `${BASE_URL}${endpoint}`;
	const defaultOptions = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const combinedOptions = { ...defaultOptions, ...options };

	return fetch(url, combinedOptions)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.json();
		})
		.catch((error) => {
			console.error('Fetch error:', error);
			throw error;
		});
};

export default fetchWrapper;
