
import Cookies from 'js-cookie';
 
const TokenKey = 'token';
 
export function getTokens () {
	return Cookies.get(TokenKey);
}
 
export function setToken (token) {
	return Cookies.set(TokenKey, token);
}
 
export function removeToken () {
	return Cookies.remove(TokenKey);
}