import axios from "axios";
import Cookies from 'js-cookie';


export const api = axios.create({
	baseURL: 'http://baka.docker/api',
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'X-CSRFTOKEN': Cookies.get('csrftoken')!,
	},
});
