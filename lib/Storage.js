
export function set_local_storage(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

export function get_local_storage(key) {
	return JSON.parse(localStorage.getItem(key));
}

export function remove_local_storage(key) {
	localStorage.removeItem(key);
}

