import { getCookie } from './CookieUtil';


export const isLogin = () => {
    const token = getCookie('accessToken');
    return token === null ? false : true;
}

export const reissue = (accessToken) => {
    axios.post('http://gachon-adore.duckdns.org:8111/auth/reissue', {
        withCredentials: true,
    }).then((res) => {
    }).catch((err) => {
        console.error(err);
    });
}

export const extractRole = () => {
    const token = getCookie('accessToken');
    if (token === undefined || token === null) {
        return 'GUEST';
    } else {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        const parsedPayload = JSON.parse(decodedPayload);
        return parsedPayload.role;
    }
}