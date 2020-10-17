import React from "react";
import styled, { keyframes } from "styled-components";
import LinearProgress from "@material-ui/core/LinearProgress";
import FishLogo from "../../Content/fishlogo.png";

const Container = styled.div`
    width: 50vw;
    height: 70vh;
    margin: auto;
    margin-top: 15vh;
`

const LinearProgressContainer = styled.div`
    margin: 1em;
`

const floating = keyframes`
    0% {
        transform: translatey(10px);
    }
    
    50% {
        transform: translatey(-20px);
    }
    
    100% {
        transform: translatey(10px);
    }
`

const FishLogoImg = styled.img`
    animation: ${floating} 6s ease-in-out infinite;
`

const Loading = () => (
    <Container>
        <FishLogoImg alt="Fish Logo" src={FishLogo} />
        <LinearProgressContainer>
            <LinearProgress color="primary" />
        </LinearProgressContainer>
    </Container>
);

export default Loading;
