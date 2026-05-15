'use client';

import { Brain, CloudSaas, Locker, LockerChest, Thought } from 'elementa-icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { cryptoService } from '@/lib/crypto';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { HTTP_STATUS_CODE, SignUpResponse } from '@/lib/types/api';
import { UI_STATE } from '@/lib/types/model';
import useUIStore from '@/lib/ui-store';
import { copyToClipboard, hexToUint8Array, uint8ArrayToHex } from '@/lib/utils';
import LoadingState from '@/src/components/blocks/loading-state';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle
} from '@/src/components/ui/alert-dialog';
import { Button } from '@/src/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/src/components/ui/dialog';
import {
    Field,
    FieldDescription,
    FieldLabel,
    FieldLegend,
    FieldSet
} from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle
} from '@/src/components/ui/item';
import { Label } from '@/src/components/ui/label';
import { Text, TextVariant } from '@/src/components/ui/text';

/**
 * This function renders the landing page of the app.
 */
export default function HomePage() {
    // SECTION: Constants
    const router = useRouter();
    const isUserLoggedIn = useDataStore((state) => state.isUserLoggedIn);
    const dataActions = useDataStore((state) => state.actions);
    const securityFeatures = [
        {
            icon: Locker,
            title: 'AES-256 Encryption'
        },
        {
            icon: Brain,
            title: 'Open Source'
        },
        {
            icon: LockerChest,
            title: 'End-to-End Encryption'
        }
    ];
    // !SECTION: Constants

    // SECTION: States
    const [firstTimeLoad, setFirstTimeLoad] = useState<boolean>(false);
    const [isServerUrlDialogOpen, setIsServerUrlDialogOpen] =
        useState<boolean>(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);
    const [isLoginPage, setIsLoginPage] = useState<boolean>(false);
    const [recoveryKey, setRecoveryKey] = useState<string>('');
    const [uiState, setUIState] = useState<UI_STATE>(UI_STATE.IDLE);
    // !SECTION: States

    // SECTION: API Queries
    /**
     * This function checks if the user is already logged in.
     */
    const fetchIsUserLoggedIn = async () => {
        try {
            setUIState(UI_STATE.LOADING);
            const isUserLoggedIn = JSON.parse(
                localStorage.getItem('loggedIn') as string
            ) as boolean;
            if (isUserLoggedIn) {
                dataActions.setIsUserLoggedIn(true);
                router.push('/dashboard');
            } else {
                localStorage.setItem('loggedIn', 'false');
                dataActions.setIsUserLoggedIn(false);
                setUIState(UI_STATE.IDLE);
            }
        } catch (error: any) {
            logger.error();
            toast.error('Cannot initialize the app. Please try again.');
        }
    };
    // !SECTION

    // SECTION: Event Handlers
    /**
     * This function handles the saving of the server URL entered by the user during the first time load.
     * It validates the input and updates the UI state accordingly.
     */
    const handleSaveServerUrl = () => {
        const serverUrlInput = document.getElementById(
            'input-server-url'
        ) as HTMLInputElement;
        const serverUrl = serverUrlInput.value;
        setIsServerUrlDialogOpen(false);
        if (serverUrl) {
            localStorage.setItem('serverUrl', serverUrl);
            setFirstTimeLoad(false);
            fetchIsUserLoggedIn();
        } else {
            setIsErrorDialogOpen(true);
            setUIState(UI_STATE.ERROR);
        }
    };

    /**
     * This function handles the user login process.
     */
    const handleUserLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email = (
            document.getElementById('input-email') as HTMLInputElement
        )?.value;

        try {
            // Get user's salt to derive auth hash.
            const hashSaltRes = await fetch('/api/users/salt', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-email': email
                }
            });
            const hashSaltData = await hashSaltRes.json();
            const authHashSalt = hexToUint8Array(hashSaltData.data.authSalt);
            const encryptionKeySalt = hexToUint8Array(
                hashSaltData.data.encryptionSalt
            );

            const password = (
                document.getElementById('input-password') as HTMLInputElement
            )?.value;
            const authKey = await cryptoService.deriveAuthHash(
                password,
                authHashSalt
            );
            const encryptionKey = await cryptoService.deriveEncryptionKey(
                password,
                encryptionKeySalt
            );

            // Start the login process.
            const loginRes = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    authKey: authKey
                })
            });

            const loginData = await loginRes.json();

            if (loginRes.status === HTTP_STATUS_CODE.CREATED) {
                localStorage.setItem('jwtToken', loginData.data.accessToken);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem(
                    'userDetails',
                    JSON.stringify(loginData.data.user)
                );

                localStorage.setItem(
                    'encryptionKey',
                    uint8ArrayToHex(encryptionKey)
                );
                dataActions.setIsUserLoggedIn(true);
                dataActions.setUserDetails(loginData.data.user);
                router.push('/dashboard');
            } else {
                logger.error(
                    'Login failed with response:',
                    (loginData.error as string) ||
                        loginData.message ||
                        loginRes.statusText
                );
                toast.error('Login failed. Please check your credentials.');
            }
        } catch (error: any) {
            logger.error(
                'An error occurred during user login:',
                error.toString()
            );
            toast.error('Login failed. Please try again.');
        }
    };

    /**
     * This function handles the user sign-up process.
     *
     * @param e - The form submission event.
     */
    const handleUserSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const name = (document.getElementById('input-name') as HTMLInputElement)
            ?.value;
        const email = (
            document.getElementById('input-email') as HTMLInputElement
        )?.value;
        const password = (
            document.getElementById('input-password') as HTMLInputElement
        )?.value;

        // Hash password with Argon2 before sending to the server.
        const authHashSalt = cryptoService.generateSalt();
        const authKeyRaw = await cryptoService.deriveAuthHash(
            password,
            authHashSalt
        );

        // Hash password with Argon2 to generate the encryption key, which will
        // be used for encrypting the user's data.
        const encryptionHashSalt = cryptoService.generateSalt();
        const encryptionKeyRaw = await cryptoService.deriveEncryptionKey(
            password,
            encryptionHashSalt
        );

        try {
            const signUpRes = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    authSalt: uint8ArrayToHex(authHashSalt),
                    authKey: authKeyRaw,
                    encryptionSalt: uint8ArrayToHex(encryptionHashSalt),
                    encryptionKey: encryptionKeyRaw.toHex(),
                    avatarUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=${name.split(' ').join('-')}`
                })
            });

            const signUpData = (await signUpRes.json()) as SignUpResponse;
            if (signUpRes.ok) {
                toast.success('Sign-up successful! Please log in to continue.');
                setRecoveryKey(signUpData.data.user.recoveryKey);
            } else {
                logger.error(
                    'Sign-up failed with response:',
                    (signUpData.error as string) ||
                        signUpData.message ||
                        signUpRes.statusText
                );
                toast.error('Sign-up failed. Please try again.');
            }
        } catch (error: any) {
            logger.error(
                'An error occurred during user sign-up:',
                error.toString()
            );
            toast.error('Sign-up failed. Please try again.');
        }
    };
    // !SECTION

    // SECTION: Side Effects
    useEffect(() => {
        setUIState(UI_STATE.LOADING);
        const serverUrl = localStorage.getItem('serverUrl') as string;

        if (serverUrl) {
            fetchIsUserLoggedIn();
        } else {
            setUIState(UI_STATE.IDLE);
            setFirstTimeLoad(true);
            setIsServerUrlDialogOpen(true);
        }
    }, []);
    // !SECTION

    // SECTION: UI
    // !SECTION
    return (
        <div className="px-4 md:px-12 lg:px-20 xl:px-32 2xl:px-44">
            {uiState === UI_STATE.LOADING && <LoadingState text="Loading..." />}
            {firstTimeLoad &&
                (uiState === UI_STATE.IDLE ? (
                    <Dialog open={isServerUrlDialogOpen}>
                        <DialogContent showCloseButton={true}>
                            <DialogHeader>
                                <DialogTitle className="font-code">
                                    Welcome to Keyper! Please enter your server
                                    URL to get started.
                                </DialogTitle>
                                <DialogDescription>
                                    Kya baat hain bhaijaan. Aapne to macha diya!
                                </DialogDescription>
                            </DialogHeader>
                            <div>
                                <Text variant={TextVariant.Body}>
                                    Keyper needs a server URL to work with. If
                                    you don't have one, please visit{' '}
                                    <a
                                        href="https://github.com/deriva-inc/keyper-go"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-text-info underline"
                                    >
                                        keyper-go
                                    </a>{' '}
                                    to self-host a working server.
                                </Text>
                                <div className="mt-6 flex flex-col gap-3">
                                    <Label>Please enter a server URL:</Label>
                                    <Input
                                        id="input-server-url"
                                        placeholder="http://127.0.0.1:8080/api/v1"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    onClick={() => handleSaveServerUrl()}
                                >
                                    Save Server URL
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ) : uiState === UI_STATE.ERROR ? (
                    <AlertDialog open={isErrorDialogOpen}>
                        <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                                <AlertDialogMedia>
                                    <CloudSaas />
                                </AlertDialogMedia>
                                <AlertDialogTitle>
                                    Please enter a valid server URL to proceed.
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Keyper needs a server URL to work with.
                                    Unfortunately you will not be able to
                                    benefit from the app without providing a
                                    valid server URL. If you don't have one,
                                    please visit the keyper-go GitHub code for
                                    more information.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setIsErrorDialogOpen(false);
                                        setIsServerUrlDialogOpen(true);
                                        setUIState(UI_STATE.IDLE);
                                    }}
                                >
                                    Re-enter URL
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    size="sm"
                                    onClick={() =>
                                        router.push(
                                            'https://github.com/deriva-inc/keyper-go'
                                        )
                                    }
                                >
                                    Visit keyper-go Github
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : null)}
            {!firstTimeLoad && !isUserLoggedIn && uiState === UI_STATE.IDLE && (
                <div className="relative mx-auto h-screen max-w-sm py-8 lg:max-w-md">
                    <div className="flex flex-col items-center justify-center">
                        <Text variant={TextVariant.H1} className="text-center">
                            Welcome to{' '}
                            <span className="text-text-accent-primary">
                                Keyper
                            </span>
                        </Text>
                        <Text variant={TextVariant.H3} className="text-center">
                            Create your own private digital sanctuary.
                        </Text>
                    </div>
                    {isLoginPage ? (
                        // Login Form
                        <form
                            className="bg-bg-flat-primary my-[8%] rounded-md px-4 py-8 shadow-sm"
                            onSubmit={(e) => handleUserLogin(e)}
                        >
                            <FieldSet>
                                <FieldLegend>Login</FieldLegend>
                                <FieldDescription>
                                    Enter your credentials to log in.
                                </FieldDescription>
                                <Field>
                                    <FieldLabel htmlFor="input-email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        id="input-email"
                                        type="email"
                                        placeholder="Enter your email"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="input-password">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        id="input-password"
                                        type="password"
                                        placeholder="Enter your password"
                                    />
                                </Field>
                                <Item
                                    size="default"
                                    className="my-8 border-2"
                                    variant="outline"
                                >
                                    <ItemMedia>
                                        <Thought height="24px" width="24px" />
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle>
                                            Zero-Knowledge Architecture
                                        </ItemTitle>
                                        <ItemDescription>
                                            Your data is encrypted and decrypted
                                            on your device, ensuring that only
                                            you have access to your sensitive
                                            information.
                                        </ItemDescription>
                                    </ItemContent>
                                </Item>
                                <Button type="submit">Login</Button>
                                <Text className="mx-auto flex items-center">
                                    New to Keyper?{' '}
                                    <Button
                                        variant="link"
                                        className="px-1.5 hover:underline"
                                        onClick={() => setIsLoginPage(true)}
                                    >
                                        Sign Up
                                    </Button>
                                </Text>
                            </FieldSet>
                        </form>
                    ) : (
                        // Sign Up Form
                        <form
                            className="bg-bg-flat-primary my-[4%] rounded-md px-4 py-8 shadow-sm"
                            onSubmit={(e) => handleUserSignUp(e)}
                        >
                            <FieldSet>
                                <FieldLegend>Sign Up</FieldLegend>
                                <FieldDescription>
                                    2 mins, no more!
                                </FieldDescription>
                                <Field>
                                    <FieldLabel htmlFor="input-email">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        id="input-name"
                                        type="text"
                                        placeholder="Enter your name"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="input-email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        id="input-email"
                                        type="email"
                                        placeholder="Enter your email"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="input-password">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        id="input-password"
                                        type="password"
                                        placeholder="Enter your password"
                                    />
                                </Field>
                                <Item
                                    size="default"
                                    className="my-4 border-2"
                                    variant="outline"
                                >
                                    <ItemMedia>
                                        <Thought height="24px" width="24px" />
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle>
                                            Zero-Knowledge Architecture
                                        </ItemTitle>
                                        <ItemDescription>
                                            Your data is encrypted and decrypted
                                            on your device, ensuring that only
                                            you have access to your sensitive
                                            information.
                                        </ItemDescription>
                                    </ItemContent>
                                </Item>
                                <Button type="submit">Sign Up</Button>
                                <Text className="mx-auto flex items-center">
                                    Existing member?{' '}
                                    <Button
                                        variant="link"
                                        className="px-1.5 hover:underline"
                                        onClick={() => setIsLoginPage(true)}
                                    >
                                        Login
                                    </Button>
                                </Text>
                            </FieldSet>
                        </form>
                    )}
                    <div className="flex items-center justify-around gap-2">
                        {securityFeatures.map((feature) => (
                            <div
                                key={feature.title}
                                className="flex flex-col items-center"
                            >
                                {feature.icon({
                                    height: '24px',
                                    width: '24px'
                                })}
                                <Text
                                    variant={TextVariant.Caption}
                                    className="text-center"
                                >
                                    {feature.title}
                                </Text>
                            </div>
                        ))}
                    </div>
                    <Text
                        variant={TextVariant.Caption}
                        className="absolute bottom-6 mx-auto w-full text-center"
                    >
                        Copyright © 2024{' '}
                        <a
                            href="https://deriva.xyz"
                            className="text-text-info underline"
                        >
                            deriva Inc.
                        </a>{' '}
                        All rights reserved.
                    </Text>
                    {recoveryKey && (
                        <AlertDialog open={recoveryKey !== ''}>
                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                    <AlertDialogMedia>
                                        <CloudSaas />
                                    </AlertDialogMedia>
                                    <AlertDialogTitle>
                                        Wola! This message is important.
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Keyper works only with your password. No
                                        one can ever see your passwords until
                                        they have your password. This also means
                                        that if you lose your password, you lose
                                        access to your data. Please save this
                                        recovery key in a safe place. You can
                                        use it to regain access to your account
                                        if you forget your password.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="bg-bg-active-primary mx-auto w-full p-2">
                                    <Text className="font-code mx-auto text-center">
                                        {recoveryKey}
                                    </Text>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogAction
                                        className="w-full"
                                        size="sm"
                                        onClick={() => {
                                            copyToClipboard(recoveryKey);
                                            setIsLoginPage(true);
                                            setRecoveryKey('');
                                        }}
                                    >
                                        Copy Recovery Key
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            )}
        </div>
    );
}
