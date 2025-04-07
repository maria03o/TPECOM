import * as dom from './lib/Dom.js';
import {request} from './request.js';
import * as components from './components.js';
import * as storage from './lib/Storage.js';

let div = components.div;


let remarks = null;


async function get_remakrs() {
	return request('/get_remarks').then(data => {
		remarks = data;
		storage.set_local_storage('remarks', data);
	});
}


async function main() {
	
	console.log('Page loaded');
	
	await get_remakrs();
	
	let body = dom.get_body();
	body.append_children([
		
		components.menu_component(remarks),
		
		components.result_element,
		
	]);

	components.show_all_students();
}
dom.on_page_load(main);