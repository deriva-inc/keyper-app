'use client';

import {
    apiFetch,
    DEFAULT_SERVER_URL,
    sanitizeClientServerUrl
} from '@/lib/api-client';
import { cryptoService } from '@/lib/crypto';
import { useDataStore } from '@/lib/data-store';
import {
    HTTP_STATUS_CODE,
    LoginResponse,
    SignUpResponse
} from '@/lib/types/api';
import { UI_STATE } from '@/lib/types/model';
import {
    getEnergyIllustrationPath,
    hexToUint8Array,
    uint8ArrayToHex
} from '@/lib/utils';
import { Brain, CloudSaas, LockerChest, Thought } from 'elementa-icons';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    Button,
    Checkbox,
    copyToClipboard,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    ENERGY_THEMES,
    EnergySwitcher,
    Field,
    FieldDescription,
    FieldLabel,
    FieldLegend,
    FieldSet,
    GradientASCII,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
    Label,
    LoadingState,
    logger,
    Text,
    TextVariant,
    ThemeSwitcher,
    useElementa
} from 'get-elementa-ui';
import { Check, Copy, EyeIcon, EyeOffIcon, Server } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AccountRecoveryDialog from './AccountRecoveryDialog';

/**
 * This page renders the landing and authentication screen of the Keyper application.
 *
 * @author Aayush Goyal
 * @modified 2026-11-18
 */
export default function HomePage() {
    // SECTION: Elementa Theme Hooks
    const { energy, theme } = useElementa();
    const currentThemeObj = ENERGY_THEMES.find((t) => t.id === energy);
    const colorCode = currentThemeObj?.colors?.primary?.code || 'tr';
    const logoSrc = energy
        ? `/icons/logo-small-${energy}.svg`
        : '/icons/logo-small-dusk-bloom.svg';

    const asciiColors = currentThemeObj?.colors
        ? [
              currentThemeObj.colors.primary.hexCode,
              currentThemeObj.colors.secondary.hexCode,
              currentThemeObj.colors.accent1.hexCode,
              currentThemeObj.colors.accent2.hexCode
          ]
        : ['#C1582F', '#70A073', '#9B6DF2', '#DD9C00'];

    const isLightMode =
        theme === 'light' ||
        (theme === 'system' &&
            typeof document !== 'undefined' &&
            !document.documentElement.classList.contains('dark'));
    // !SECTION: Elementa Theme Hooks

    // SECTION: Constants
    const router = useRouter();
    const isUserLoggedIn = useDataStore((state) => state.isUserLoggedIn);
    const dataActions = useDataStore((state) => state.actions);
    const securityFeatures = [
        {
            icon: LockerChest,
            title: 'AES-256 Encryption'
        },
        {
            icon: Brain,
            title: 'Open Source'
        },
        {
            icon: Thought,
            title: 'End-to-End Encryption'
        }
    ];
    // !SECTION: Constants

    // SECTION: States
    const [firstTimeLoad, setFirstTimeLoad] = useState<boolean>(false);
    const [isServerUrlDialogOpen, setIsServerUrlDialogOpen] =
        useState<boolean>(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);
    const [isLoginPage, setIsLoginPage] = useState<boolean>(true);
    const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(false);
    const [recoveryKey, setRecoveryKey] = useState<string>('');
    const [hasCopiedRecoveryKey, setHasCopiedRecoveryKey] =
        useState<boolean>(false);
    const [uiState, setUIState] = useState<UI_STATE>(UI_STATE.IDLE);
    const [isRecoveryDialogOpen, setIsRecoveryDialogOpen] =
        useState<boolean>(false);
    const [loginEmail, setLoginEmail] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [serverUrlInput, setServerUrlInput] =
        useState<string>(DEFAULT_SERVER_URL);
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
    // !SECTION: API Queries

    // SECTION: Event Handlers
    /**
     * This function handles the saving of the server URL entered by the user during the first time load.
     */
    const handleSaveServerUrl = () => {
        const trimmed = serverUrlInput.trim();
        if (!trimmed) {
            setIsServerUrlDialogOpen(false);
            setIsErrorDialogOpen(true);
            setUIState(UI_STATE.ERROR);
            return;
        }
        try {
            const sanitized = sanitizeClientServerUrl(trimmed);
            localStorage.setItem('serverUrl', sanitized);
            setServerUrlInput(sanitized);
            setIsServerUrlDialogOpen(false);
            setFirstTimeLoad(false);
            toast.success('Server URL updated.');
            fetchIsUserLoggedIn();
        } catch {
            toast.error('Please enter a valid http:// or https:// server URL.');
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
            const hashSaltRes = await apiFetch('/api/users/salt', {
                method: 'GET',
                headers: {
                    'x-email': email
                }
            });
            const hashSaltData = await hashSaltRes.json();
            const authKeySalt = hexToUint8Array(hashSaltData.data.authSalt);
            const encryptionKeySalt = hexToUint8Array(
                hashSaltData.data.encryptionSalt
            );

            const password = (
                document.getElementById('input-password') as HTMLInputElement
            )?.value;
            const authKey = await cryptoService.deriveAuthKey(
                password,
                authKeySalt
            );

            // Start the login process.
            const loginRes = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    authKey: authKey,
                    rememberMe: rememberMe
                })
            });

            const loginData = (await loginRes.json()) as LoginResponse;

            if (loginRes.status === HTTP_STATUS_CODE.CREATED) {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem(
                    'userDetails',
                    JSON.stringify(loginData.data.user)
                );

                const encryptionKey = await cryptoService.deriveEncryptionKey(
                    password,
                    encryptionKeySalt
                );
                localStorage.setItem(
                    'encryptionKey',
                    uint8ArrayToHex(encryptionKey)
                );

                // Smooth login transition animation
                setIsLoginSuccess(true);
                toast.success('Welcome back!');

                setTimeout(() => {
                    dataActions.setIsUserLoggedIn(true);
                    dataActions.setUserDetails(loginData.data.user);
                    router.push('/dashboard');
                }, 1200);
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
        const authKeySalt = cryptoService.generateSalt();
        const authKeyRaw = await cryptoService.deriveAuthKey(
            password,
            authKeySalt
        );

        const encryptionKeySalt = cryptoService.generateSalt();

        try {
            const signUpRes = await apiFetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    name: name,
                    email: email,
                    authSalt: uint8ArrayToHex(authKeySalt),
                    authKey: authKeyRaw,
                    encryptionSalt: uint8ArrayToHex(encryptionKeySalt),
                    avatarUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=${name.split(' ').join('-')}`
                })
            });

            const signUpData = (await signUpRes.json()) as SignUpResponse;
            if (signUpRes.ok) {
                toast.success(
                    'Sign-up successful! Setting up recovery credentials...'
                );
                const generatedKey = signUpData.data?.user?.recoveryKey;
                if (generatedKey) {
                    try {
                        const recoverySalt = cryptoService.generateSalt();
                        const { recoveryHash } =
                            await cryptoService.deriveRecoveryCredentials(
                                generatedKey,
                                recoverySalt
                            );
                        await apiFetch('/api/auth/recovery/setup', {
                            method: 'POST',
                            body: JSON.stringify({
                                email,
                                recoverySalt: uint8ArrayToHex(recoverySalt),
                                recoveryHash
                            })
                        });
                    } catch (recErr) {
                        logger.error(
                            'Failed to auto-setup recovery on signup:',
                            recErr
                        );
                    }
                }
                setRecoveryKey(generatedKey);
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
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    useEffect(() => {
        setUIState(UI_STATE.LOADING);
        const serverUrl = localStorage.getItem('serverUrl');

        if (serverUrl) {
            setServerUrlInput(serverUrl);
            fetchIsUserLoggedIn();
        } else {
            setServerUrlInput(DEFAULT_SERVER_URL);
            setUIState(UI_STATE.IDLE);
            setFirstTimeLoad(true);
            setIsServerUrlDialogOpen(true);
        }
    }, []);
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <div className="bg-bg-base-primary relative flex min-h-screen flex-col justify-between overflow-x-hidden px-4 sm:px-8">
            {/* SECTION: Full Page ASCII Gradient Background */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30">
                <GradientASCII
                    colors={asciiColors}
                    shape="horizon"
                    density={0.7}
                    cellSize={18}
                    glyphOpacity={0.6}
                    gradientOpacity={0.4}
                    mouseInteraction={true}
                    lightMode={isLightMode}
                />
            </div>
            {/* !SECTION: Full Page ASCII Gradient Background */}

            <div className="relative z-10 flex min-h-screen flex-col justify-between">
                {/* SECTION: Global Header */}
                <header className="mx-auto flex w-full max-w-6xl items-center justify-between py-2 sm:py-6">
                    {/* Left: Energy Switcher (with mobile label visibility) */}
                    <div className="[&_div.hidden]:!flex [&_div.hidden]:!flex-col">
                        <EnergySwitcher />
                    </div>

                    {/* Right: Server URL & Theme Switcher */}
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsServerUrlDialogOpen(true)}
                            className="text-text-secondary gap-1.5 text-xs"
                            aria-label="Configure Server URL"
                        >
                            <Server className="size-3.5" />
                            <Text className="hidden sm:inline">Server URL</Text>
                        </Button>
                        <ThemeSwitcher />
                    </div>
                </header>
                {/* !SECTION: Global Header */}

                {uiState === UI_STATE.LOADING && (
                    <LoadingState
                        text="Loading sanctuary..."
                        illustration={getEnergyIllustrationPath(
                            'loading-state',
                            energy
                        )}
                    />
                )}

                {/* SECTION: Server URL Setup & Error Dialogs */}
                <Dialog
                    open={isServerUrlDialogOpen}
                    onOpenChange={setIsServerUrlDialogOpen}
                >
                    <DialogContent
                        showCloseButton={true}
                        className="bg-bg-modal-primary/95 w-[92vw] max-w-160 rounded-2xl border-none p-6 shadow-2xl backdrop-blur-xl sm:w-full"
                    >
                        <DialogHeader>
                            <DialogTitle className="font-heading text-text-primary text-lg font-bold">
                                {firstTimeLoad
                                    ? 'Welcome to Keyper! Enter your server URL'
                                    : 'Configure Server URL'}
                            </DialogTitle>
                            <DialogDescription className="text-text-secondary text-sm">
                                Set up your private or production Keyper server
                                connection.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-2">
                            <Text
                                variant={TextVariant.Body}
                                className="text-text-tertiary text-sm leading-relaxed"
                            >
                                Keyper operates on a self-hosted or dedicated
                                server. If you do not have one, please visit{' '}
                                <a
                                    href="https://github.com/deriva-inc/keyper-go"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-text-accent-secondary hover:underline"
                                >
                                    keyper-go
                                </a>{' '}
                                to self-host a working instance.
                            </Text>
                            <div className="flex flex-col gap-2">
                                <Label className="text-text-secondary text-xs">
                                    Server URL:
                                </Label>
                                <Input
                                    id="input-server-url"
                                    value={serverUrlInput}
                                    onChange={(e) =>
                                        setServerUrlInput(e.target.value)
                                    }
                                    placeholder={DEFAULT_SERVER_URL}
                                    className="font-mono text-xs"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                className="shadow-md"
                                onClick={() => handleSaveServerUrl()}
                            >
                                Save Server URL
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {firstTimeLoad && uiState === UI_STATE.ERROR && (
                    <AlertDialog open={isErrorDialogOpen}>
                        <AlertDialogContent className="bg-bg-modal-primary/95 w-[92vw] max-w-160 rounded-2xl border-none p-6 shadow-2xl backdrop-blur-xl sm:w-full">
                            <AlertDialogHeader>
                                <AlertDialogMedia>
                                    <CloudSaas />
                                </AlertDialogMedia>
                                <AlertDialogTitle className="font-heading text-text-primary text-lg font-bold">
                                    Valid server URL required
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-text-secondary text-xs leading-relaxed">
                                    Keyper requires a valid server URL to
                                    authenticate and store encrypted records.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel
                                    size="sm"
                                    className="cursor-pointer shadow-sm"
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
                                    className="shadow-md"
                                    onClick={() =>
                                        router.push(
                                            'https://github.com/deriva-inc/keyper-go'
                                        )
                                    }
                                >
                                    Visit keyper-go GitHub
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                {/* !SECTION: Server URL Setup & Error Dialogs */}

                {/* SECTION: Main Content Area */}
                {!firstTimeLoad &&
                    !isUserLoggedIn &&
                    uiState === UI_STATE.IDLE && (
                        <main className="mx-auto my-auto flex w-full max-w-md flex-col gap-3.5 py-2 sm:gap-6 sm:py-6">
                            <div className="flex flex-col items-center justify-center gap-1.5 text-center sm:gap-2">
                                <div className="bg-bg-raised-primary flex size-12 items-center justify-center rounded-2xl shadow-sm sm:size-14">
                                    <img
                                        src={logoSrc}
                                        alt="Keyper"
                                        className="size-8 sm:size-9"
                                    />
                                </div>
                                <Text
                                    variant={TextVariant.H1}
                                    className="font-heading text-text-primary text-2xl font-bold tracking-tight sm:text-4xl"
                                >
                                    Welcome to{' '}
                                    <Text className="text-text-accent-primary">
                                        Keyper
                                    </Text>
                                </Text>
                                <Text
                                    variant={TextVariant.Body}
                                    className="text-text-tertiary text-xs sm:text-sm"
                                >
                                    Your own private digital sanctuary.
                                </Text>
                            </div>

                            {/* SECTION: Smooth Login Animation Transition */}
                            {isLoginSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{
                                        type: 'spring',
                                        damping: 22,
                                        stiffness: 280
                                    }}
                                    className="bg-bg-raised-primary flex flex-col items-center justify-center gap-6 rounded-2xl p-8 text-center shadow-xl"
                                >
                                    <div className="relative flex items-center justify-center">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.25, 1],
                                                rotate: [0, 180, 360]
                                            }}
                                            transition={{
                                                duration: 2.2,
                                                repeat: Infinity,
                                                ease: 'easeInOut'
                                            }}
                                            className="bg-bg-active-fill-accent-primary absolute size-24 rounded-full blur-xl"
                                        />
                                        <div className="bg-bg-raised-secondary relative flex size-16 items-center justify-center rounded-2xl shadow-md">
                                            <img
                                                src={logoSrc}
                                                alt="Keyper Sanctuary"
                                                className="size-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <Text
                                            variant={TextVariant.H2}
                                            className="font-heading text-text-primary text-2xl font-bold"
                                        >
                                            Access Granted
                                        </Text>
                                        <Text
                                            variant={TextVariant.Body}
                                            className="text-text-accent-primary text-sm font-medium"
                                        >
                                            Unlocking your private digital
                                            sanctuary...
                                        </Text>
                                    </div>
                                    <div className="bg-bg-raised-secondary h-1.5 w-48 overflow-hidden rounded-full shadow-inner">
                                        <motion.div
                                            initial={{ width: '0%' }}
                                            animate={{ width: '100%' }}
                                            transition={{
                                                duration: 1.1,
                                                ease: 'easeInOut'
                                            }}
                                            className="bg-bg-active-accent-primary h-full rounded-full"
                                        />
                                    </div>
                                </motion.div>
                            ) : isLoginPage ? (
                                /* SECTION: Login Form */
                                <motion.form
                                    key="login-form"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        type: 'spring',
                                        damping: 25,
                                        stiffness: 350
                                    }}
                                    className="bg-bg-raised-primary flex flex-col gap-3 rounded-2xl p-4 shadow-md sm:gap-4 sm:p-8"
                                    onSubmit={(e) => handleUserLogin(e)}
                                >
                                    <FieldSet>
                                        <FieldLegend className="font-heading text-text-primary text-lg font-bold">
                                            Login
                                        </FieldLegend>
                                        <FieldDescription className="text-text-secondary text-xs">
                                            Enter your credentials to access
                                            your vault.
                                        </FieldDescription>
                                        <Field>
                                            <FieldLabel htmlFor="input-email">
                                                Email
                                            </FieldLabel>
                                            <Input
                                                id="input-email"
                                                type="email"
                                                value={loginEmail}
                                                onChange={(e) =>
                                                    setLoginEmail(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <div className="flex items-center justify-between">
                                                <FieldLabel htmlFor="input-password">
                                                    Password
                                                </FieldLabel>
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    size="sm"
                                                    className="text-text-accent-secondary h-auto p-0 text-xs hover:underline"
                                                    onClick={() =>
                                                        setIsRecoveryDialogOpen(
                                                            true
                                                        )
                                                    }
                                                >
                                                    Forgot password?
                                                </Button>
                                            </div>
                                            <InputGroup>
                                                <InputGroupInput
                                                    id="input-password"
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    placeholder="Enter your password"
                                                    required
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupButton
                                                        type="button"
                                                        size="icon-xs"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                (prev) => !prev
                                                            )
                                                        }
                                                        aria-label={
                                                            showPassword
                                                                ? 'Hide password'
                                                                : 'Show password'
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <EyeOffIcon className="size-4" />
                                                        ) : (
                                                            <EyeIcon className="size-4" />
                                                        )}
                                                    </InputGroupButton>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </Field>

                                        <div className="flex items-center gap-2 pt-1">
                                            <Checkbox
                                                id="checkbox-remember-me"
                                                checked={rememberMe}
                                                onCheckedChange={(checked) =>
                                                    setRememberMe(
                                                        checked === true
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="checkbox-remember-me"
                                                className="text-text-secondary cursor-pointer text-xs font-medium"
                                            >
                                                Remember me for 7 days
                                            </Label>
                                        </div>

                                        {/* Elevated Zero-Knowledge Callout */}
                                        <Item
                                            size="default"
                                            className="bg-bg-raised-secondary my-1.5 rounded-xl p-2.5 shadow-md sm:my-3 sm:p-3.5"
                                        >
                                            <ItemMedia>
                                                <Thought className="text-text-accent-primary size-5 shrink-0 sm:size-6" />
                                            </ItemMedia>
                                            <ItemContent>
                                                <ItemTitle className="font-heading text-text-primary text-sm font-semibold">
                                                    Zero-Knowledge Architecture
                                                </ItemTitle>
                                                <ItemDescription className="text-text-tertiary text-xs leading-relaxed">
                                                    Your data is encrypted and
                                                    decrypted locally on your
                                                    device. Only you possess the
                                                    keys.
                                                </ItemDescription>
                                            </ItemContent>
                                        </Item>

                                        <Button
                                            type="submit"
                                            className="w-full shadow-md"
                                        >
                                            Login
                                        </Button>
                                        <div className="mx-auto flex items-center justify-center pt-2">
                                            <Text
                                                variant={TextVariant.Caption}
                                                className="text-text-tertiary"
                                            >
                                                New to Keyper?{' '}
                                            </Text>
                                            <Button
                                                variant="link"
                                                className="text-text-accent-secondary px-1.5 text-xs font-semibold hover:underline"
                                                onClick={() =>
                                                    setIsLoginPage(false)
                                                }
                                            >
                                                Sign Up
                                            </Button>
                                        </div>
                                    </FieldSet>
                                </motion.form>
                            ) : (
                                /* SECTION: Sign Up Form */
                                <motion.form
                                    key="signup-form"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        type: 'spring',
                                        damping: 25,
                                        stiffness: 350
                                    }}
                                    className="bg-bg-raised-primary flex flex-col gap-3 rounded-2xl p-4 shadow-md sm:gap-4 sm:p-8"
                                    onSubmit={(e) => handleUserSignUp(e)}
                                >
                                    <FieldSet>
                                        <FieldLegend className="font-heading text-text-primary text-lg font-bold">
                                            Sign Up
                                        </FieldLegend>
                                        <FieldDescription className="text-text-secondary text-xs">
                                            Set up your master account in
                                            seconds.
                                        </FieldDescription>
                                        <Field>
                                            <FieldLabel htmlFor="input-name">
                                                Name
                                            </FieldLabel>
                                            <Input
                                                id="input-name"
                                                type="text"
                                                placeholder="Enter your name"
                                                required
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
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="input-password">
                                                Password
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput
                                                    id="input-password"
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    placeholder="Enter your master password"
                                                    required
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupButton
                                                        type="button"
                                                        size="icon-xs"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                (prev) => !prev
                                                            )
                                                        }
                                                        aria-label={
                                                            showPassword
                                                                ? 'Hide password'
                                                                : 'Show password'
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <EyeOffIcon className="size-4" />
                                                        ) : (
                                                            <EyeIcon className="size-4" />
                                                        )}
                                                    </InputGroupButton>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </Field>

                                        {/* Elevated Zero-Knowledge Callout */}
                                        <Item
                                            size="default"
                                            className="bg-bg-raised-secondary my-1.5 rounded-xl p-2.5 shadow-md sm:my-3 sm:p-3.5"
                                        >
                                            <ItemMedia>
                                                <Thought className="text-text-accent-primary size-5 shrink-0 sm:size-6" />
                                            </ItemMedia>
                                            <ItemContent>
                                                <ItemTitle className="font-heading text-text-primary text-sm font-semibold">
                                                    Zero-Knowledge Architecture
                                                </ItemTitle>
                                                <ItemDescription className="text-text-tertiary text-xs leading-relaxed">
                                                    Your data is encrypted and
                                                    decrypted locally on your
                                                    device. Only you possess the
                                                    keys.
                                                </ItemDescription>
                                            </ItemContent>
                                        </Item>

                                        <Button
                                            type="submit"
                                            className="w-full shadow-md"
                                        >
                                            Sign Up
                                        </Button>
                                        <div className="mx-auto flex items-center justify-center pt-2">
                                            <Text
                                                variant={TextVariant.Caption}
                                                className="text-text-tertiary"
                                            >
                                                Existing member?{' '}
                                            </Text>
                                            <Button
                                                variant="link"
                                                className="text-text-accent-secondary px-1.5 text-xs font-semibold hover:underline"
                                                onClick={() =>
                                                    setIsLoginPage(true)
                                                }
                                            >
                                                Login
                                            </Button>
                                        </div>
                                    </FieldSet>
                                </motion.form>
                            )}

                            {/* SECTION: Security Badges Strip */}
                            <div className="grid grid-cols-3 gap-2 py-1 sm:gap-3 sm:py-2">
                                {securityFeatures.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-bg-raised-secondary flex flex-col items-center gap-1 rounded-xl p-2 text-center shadow-md sm:p-3"
                                    >
                                        <feature.icon className="text-text-accent-primary size-4 sm:size-5" />
                                        <Text
                                            variant={TextVariant.Caption}
                                            className="text-text-secondary text-center text-[11px] leading-tight font-medium sm:text-xs"
                                        >
                                            {feature.title}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                            {/* !SECTION: Security Badges Strip */}

                            {/* SECTION: Post-Signup Recovery Key Dialog */}
                            {recoveryKey && (
                                <AlertDialog open={recoveryKey !== ''}>
                                    <AlertDialogContent className="bg-bg-modal-primary/95 w-[92vw] max-w-160 rounded-2xl border-none p-6 shadow-2xl backdrop-blur-xl sm:w-full">
                                        {/* Storyset illustration banner */}
                                        <div className="bg-bg-raised-secondary mb-3 flex h-36 w-full items-center justify-center overflow-hidden rounded-2xl p-2 shadow-md">
                                            <img
                                                src={`/illus/recovery/${colorCode}.svg`}
                                                alt="Recovery Key"
                                                className="h-full max-h-32 w-auto object-contain"
                                            />
                                        </div>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="font-heading text-text-primary text-lg font-bold">
                                                Important: Save Your Recovery
                                                Key
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-text-secondary text-xs leading-relaxed">
                                                Keyper operates on
                                                zero-knowledge encryption. If
                                                you lose your password, you lose
                                                access to your data. Please save
                                                this recovery key in a safe
                                                place.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        {/* Highlighted recovery key with right-aligned copy button */}
                                        <div className="bg-bg-raised-secondary my-3 flex items-center justify-between gap-3 rounded-xl p-3.5 shadow-md">
                                            <Text className="text-text-accent-primary font-mono text-xs font-semibold tracking-wide break-all select-all">
                                                {recoveryKey}
                                            </Text>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="ml-auto shrink-0 shadow-sm"
                                                onClick={() => {
                                                    copyToClipboard(
                                                        recoveryKey
                                                    );
                                                    setHasCopiedRecoveryKey(
                                                        true
                                                    );
                                                    setTimeout(
                                                        () =>
                                                            setHasCopiedRecoveryKey(
                                                                false
                                                            ),
                                                        2000
                                                    );
                                                }}
                                            >
                                                {hasCopiedRecoveryKey ? (
                                                    <Check className="text-text-status-positive-primary size-4" />
                                                ) : (
                                                    <Copy className="size-4" />
                                                )}
                                            </Button>
                                        </div>

                                        <AlertDialogFooter>
                                            <AlertDialogAction
                                                className="w-full shadow-md"
                                                size="sm"
                                                onClick={() => {
                                                    copyToClipboard(
                                                        recoveryKey
                                                    );
                                                    setIsLoginPage(true);
                                                    setRecoveryKey('');
                                                }}
                                            >
                                                I Have Saved My Recovery Key
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                            {/* !SECTION: Post-Signup Recovery Key Dialog */}

                            <AccountRecoveryDialog
                                isOpen={isRecoveryDialogOpen}
                                onOpenChange={setIsRecoveryDialogOpen}
                                initialEmail={loginEmail}
                                onRecoverySuccess={(recoveredEmail) => {
                                    setLoginEmail(recoveredEmail);
                                    setIsLoginPage(true);
                                }}
                            />
                        </main>
                    )}
                {/* !SECTION: Main Content Area */}

                {/* SECTION: Centered Footer */}
                <footer className="flex w-full flex-col items-center justify-center gap-1 py-2 text-center sm:py-6">
                    <Text
                        variant={TextVariant.Caption}
                        className="text-text-tertiary text-center text-xs"
                    >
                        Copyright © 2026{' '}
                        <a
                            href="https://deriva.xyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-accent-secondary hover:text-text-primary underline transition-colors"
                        >
                            deriva Inc.
                        </a>{' '}
                        All rights reserved.
                    </Text>
                    <Text
                        variant={TextVariant.Caption}
                        className="text-text-tertiary text-center text-[11px]"
                    >
                        Illustrations by{' '}
                        <a
                            href="https://storyset.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-accent-secondary hover:text-text-primary underline transition-colors"
                        >
                            Storyset
                        </a>{' '}
                        · Icons by{' '}
                        <a
                            href="https://lucide.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-accent-secondary hover:text-text-primary underline transition-colors"
                        >
                            Lucide
                        </a>
                    </Text>
                </footer>
                {/* !SECTION: Centered Footer */}
            </div>
        </div>
    );
    // !SECTION: UI
}
