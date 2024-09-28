export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url, body) => {
    const api_url = baseUrl + url;
    try {
        const response = await fetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        });

        const data = await response.json();
        if (!response.ok) {
            const message = data?.message ? data.message : data;
            return {error: true, message};
        }
        return data;

    } catch (error) {
        alert("Something went wrong!!!");
    }
};


export const getRequest = async (url) => {
    const api_url = baseUrl + url;
    try {
        const response = await fetch(api_url);
        const data = await response.json();
        if (!response.ok) {
            const message = data?.message ? data.message : data;
            return {error: true, message};
        }
        return data;

    } catch (error) {
        alert("Something went wrong!!!");
    }
}