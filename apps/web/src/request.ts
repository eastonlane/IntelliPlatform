import { PruneSuffix, PrunePrefix } from '$lib/helper/url-helper';
const baseUrl = normalizeBaseUrl(import.meta.env.BASE_URL);
function normalizeBaseUrl(url: string): string {
	if (url === '/') return '';
	return '/' + PrunePrefix(PruneSuffix(url, '/'), '/');
}

const fetchWrapper = (endpoint: string, options = {}) => {
	const url = `${baseUrl}/${PrunePrefix(endpoint, '/')}`;
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
