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
import SubmarineValidationError from "../../SubmarineHttp/Errors/SubmarineValidationError";
import Translations from "../../Translations/Translations";

const Container = styled(Paper)`
    width: 50vw;
    height: 70vh;
    margin: auto;
    margin-top: 15vh;
`

const LeftColumn = styled(Grid)`
    border-right: 2px solid ${Brand.grey};
    height: 70vh;
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

const ConfirmationButtonContainer = styled.div`
    margin-top: 2em;
    text-align: right;
`

const ConfirmationButton = styled(Button)`
    text-align: right;
    margin: 2em !important;
    margin-left: 0 !important;
`

const LoadingContainer = styled.div`
    height: 176px;
`

const LoadingCircularProgress = styled(CircularProgress)`
    margin-top: 2.5em;
`


interface IAuthenticationCredentials {
    emailAddress?: string;
    password?: string;
}


export const Authentication = () => {
    const { authenticate } = useAuthenticationContext();

    const [credentials, setCredentials] = useState<IAuthenticationCredentials>({});
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
            setLoading(false);
        } catch (error: any) {
            if (error instanceof SubmarineValidationError) {
                setValidationError(error);
            }
            setLoading(false);
        }
    }

    const renderEmailAddressTextField = () => {
        const emailAddressValidationError: string|undefined = !!validationError
            ? validationError.getForField("emailAddress")
            : undefined;

        return (
            <DetailsTextField
                label="Email Address"
                name="emailAddress"
                value={credentials.emailAddress}
                onChange={onChange}
                error={!!emailAddressValidationError}
                helperText={emailAddressValidationError ? Translations[emailAddressValidationError] : null}
                fullWidth
            />
        )
    };

    const renderPasswordTextField = () => {
        const passwordValidationError: string|undefined = !!validationError
            ? validationError.getForField("password")
            : undefined;

        return (
            <DetailsTextField
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={onChange}
                error={!!passwordValidationError}
                helperText={passwordValidationError ? Translations[passwordValidationError] : null}
                fullWidth
            />
        )
    }

    return (
        <Container>
            <Grid container>
                <LeftColumn item xs={4}>
                    <LogoImg src={Logo} alt="logo" />
                    {
                        !loading &&
                        <TextFieldContainer>
                            {renderEmailAddressTextField()}
                            {renderPasswordTextField()}
                        </TextFieldContainer>
                    }
                    {
                        loading &&
                        <LoadingContainer>
                            <LoadingCircularProgress size={100} />
                        </LoadingContainer>
                    }
                    <ConfirmationButtonContainer>
                        <ConfirmationButton
                            variant="contained"
                            color="primary"
                            onClick={onConfirmationButtonClick}
                        >
                            Sign In
                        </ConfirmationButton>
                    </ConfirmationButtonContainer>
                </LeftColumn>
                <RightColumn item xs={8}>
                    <WhatYouCanDoImg alt="What You Can Do" src={WhatYouCanDo} />
                </RightColumn>
            </Grid>
        </Container>
    )
}

export default Authentication;
