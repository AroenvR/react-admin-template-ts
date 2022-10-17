import { AuthProvider } from "react-admin";

const domainUrl = process.env.REACT_APP_DOMAIN_URL || "";

interface LoginInput {
    username: string;
    password: string;
}

const authProvider: AuthProvider = {
    login: async ({ username, password }: LoginInput) => {

        // Remove the following two lines of code when you want to use an actual login API.
        sessionStorage.setItem("session_token", "token");
        return Promise.resolve();

        const request = new Request(`${domainUrl}/api/login`, {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: new Headers({ "Content-Type": "application/json" }),
        });
        return fetch(request)
            .then((response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ token }) => {
                sessionStorage.setItem("session_token", token);
            });        
    },

    logout: () => {
        localStorage.clear();
        sessionStorage.clear();
        return Promise.resolve();
    },

    checkError:  (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.clear();
            sessionStorage.clear();
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },

    // TODO:
    checkAuth: () =>
        sessionStorage.getItem('session_token') ? Promise.resolve() : Promise.reject(),

    getIdentity: () =>
        Promise.resolve({ id: "" }),

    getPermissions: () => Promise.resolve(''),
};

export default authProvider;