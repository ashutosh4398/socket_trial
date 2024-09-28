import { useState, useEffect } from "react";
import { getRequest } from "../utils/services";

export const useFetchReceipentUser = (chat, user) => {
    const [receipentUser, setReceipentUser] = useState(null);
    const [error, setError] = useState(null);

    const receipentId = chat?.members?.find(memberId => memberId !== user._id);

    useEffect(() => {
        const getUser = async () => {
            if (!receipentId) {
                return;
            }
            const response = await getRequest(`/users/find/${receipentId}`);

            if (response.error) {
                return setError(response);
            }

            setReceipentUser(response);
        };

        getUser();
    }, []);

    return { receipentUser };
}