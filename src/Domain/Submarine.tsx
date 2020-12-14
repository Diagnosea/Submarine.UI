import React from "react";
import useAuthenticationContext from "../Contexts/Authentication/AuthenticationContext";
import Authentication from "./Authentication/Authentication";
import useTankContext from "../Contexts/Tank/TankContext";

export const Submarine = () => {
    const { identity } = useAuthenticationContext();
    const { tanksLoaded } = useTankContext();
    const hasActiveIdentity = identity && !identity?.hasExpired();

    if (hasActiveIdentity && tanksLoaded) {
        return <p>Authenticated.</p>
    }

    return <Authentication />;
}

export default Submarine;
