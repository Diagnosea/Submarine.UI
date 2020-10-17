import React, { useState } from "react";
import useAuthenticationContext from "../Contexts/Authentication/AuthenticationContext";
import Authentication from "./Authentication/Authentication";
import Loading from "./Loading/Loading";

export const Submarine = () => {
    const { identity } = useAuthenticationContext();
    const hasActiveIdentity = identity && !identity?.hasExpired();

    const [loadingPreview] = useState<boolean>(true);

    if (hasActiveIdentity && loadingPreview) {
        return <Loading  />
    } else if (hasActiveIdentity && !loadingPreview) {
        return <p>Loaded all data!</p>
    }

    return <Authentication />;
}

export default Submarine;
