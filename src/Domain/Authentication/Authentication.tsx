import React, {ChangeEvent, useState} from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Logo from "../../Content/logo.png";
import WhatYouCanDo from "../../Content/whatyoucando.png";
import Brand from "../../Theme/Brand";
import { useAuthenticationContext } from "../../Contexts/Authentication/AuthenticationContext";
import { useTankContext } from "../../Contexts/Tank/TankContext";
import SubmarineValidationError from "../../SubmarineHttp/Errors/SubmarineValidationError";
import Translations from "../../Translations/Translations";

const Container = styled(Paper)`
    width: 1028px;
    height: 696px;
    margin: auto;
    margin-top: 10vh;
`

const LeftColumn = styled(Grid)`
    border-right: 2px solid ${Brand.grey};
    height: 696px;
    padding-top: 6em;
`

const RightColumn = styled(Grid)`
    height: 70vh;
`

const LogoImg = styled.img`
    height: 7em;
    user-select: none;
`

const WhatYouCanDoImg = styled.img`
    margin: 5em;
    height: 30em;
    user-select: none;
`

const TextFieldContainer = styled.div`
    padding: 2em;
    padding-bottom: 1em;
`

const DetailsTextField = styled(TextField)`
    margin: .5em !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
`

const LeftColumnFooter = styled.div`
    margin-top: 2em;
    text-align: right;
    display: flex;
    justify-content: flex-end;
`

const ConfirmationButton = styled(Button)`
    text-align: right;
    margin: 2.4em !important;
    margin-left: 0 !important;
    margin-right: 0;
`

const ConfirmationLoader = styled(CircularProgress)`
    margin: 2em !important;
`


interface IAuthenticationCredentials {
    emailAddress?: string;
    password?: string;
}


export const Authentication = () => {
    const { identity, authenticate } = useAuthenticationContext();
    const { setIdentity, loadTanks } = useTankContext();

    if (identity && !identity?.hasExpired()) {
        setIdentity(identity);
    }

    const initialCredentials = { emailAddress: "", password: "" };
    const [credentials, setCredentials] = useState<IAuthenticationCredentials>(initialCredentials);
    const [loading, setLoading] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<SubmarineValidationError>();

    const onChange = (event: ChangeEvent) => {
        const { target: { name, value } }: any = event;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value,
        }))
    }

    const onConfirmationButtonClick = async () => {
        setLoading(true);

        try {
            await authenticate(credentials.emailAddress, credentials.password);
            await loadTanks();
        } catch (error: any) {
            if (error instanceof SubmarineValidationError) {
                setValidationError(error);
            }
            setLoading(false);
        }
    }

    const emailAddressValidationError: string|undefined = !!validationError
        ? validationError.getForField("emailAddress")
        : undefined;

    const passwordValidationError: string|undefined = !!validationError
        ? validationError.getForField("password")
        : undefined;

    return (
        <Container>
            <Grid container>
                <LeftColumn item xs={4}>
                    <LogoImg src={Logo} alt="logo" />
                    <TextFieldContainer>
                        <DetailsTextField
                            label="Email Address"
                            name="emailAddress"
                            value={credentials.emailAddress}
                            disabled={loading}
                            onChange={onChange}
                            error={!!emailAddressValidationError}
                            helperText={emailAddressValidationError ? Translations[emailAddressValidationError] : null}
                            fullWidth
                        />
                        <DetailsTextField
                            label="Password"
                            name="password"
                            type="password"
                            value={credentials.password}
                            disabled={loading}
                            onChange={onChange}
                            error={!!passwordValidationError}
                            helperText={passwordValidationError ? Translations[passwordValidationError] : null}
                            fullWidth
                        />
                    </TextFieldContainer>
                    <LeftColumnFooter>
                        {loading && <ConfirmationLoader />}
                        <ConfirmationButton
                            variant="contained"
                            color="primary"
                            onClick={onConfirmationButtonClick}
                        >
                            Sign In
                        </ConfirmationButton>
                    </LeftColumnFooter>
                </LeftColumn>
                <RightColumn item xs={8}>
                    <WhatYouCanDoImg alt="What You Can Do" src={WhatYouCanDo} />
                </RightColumn>
            </Grid>
        </Container>
    );
}

export default Authentication;
