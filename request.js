
import { app_url } from './constants.js';
import { request as Request } from "./lib/Request.js";

export async function request(url, data={}) {
	return Request(app_url + url, data);
}