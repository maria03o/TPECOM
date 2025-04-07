import { request } from '../lib/Request.js';
import { on_page_load } from '../lib/Dom.js';
console.log('test.js');


async function main() {
	let data = await request('https://jsonplaceholder.typicode.com/posts')
	console.log(data);
	
}

on_page_load(main);
