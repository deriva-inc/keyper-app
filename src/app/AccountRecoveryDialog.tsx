'use client';

import { apiFetch } from '@/lib/api-client';
import { cryptoService } from '@/lib/crypto';
import { hexToUint8Array } from '@/lib/utils';
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    ENERGY_THEMES,
    Field,
    FieldDescription,
    FieldLabel,
    FieldSet,
    Input,
    logger,
    Text,
    TextVariant,
    useElementa
} from 'get-elementa-ui';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AccountRecoveryDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    initialEmail?: string;
    onRecoverySuccess?: (email: string) => void;
}

/**
 * This function renders the Account Recovery Dialog on the UI.
 *
 * @author Aayush Goyal
 * @modified 2026-11-18
 */
export default function AccountRecoveryDialog({
    isOpen,
    onOpenChange,
    initialEmail = '',
    onRecoverySuccess
}: AccountRecoveryDialogProps) {
    // SECTION: Elementa Theme Hooks
    const { energy } = useElementa();
    const colorCode =
        ENERGY_THEMES.find((t) => t.id === energy)?.colors?.primary?.code ||
        'tr';
    // !SECTION: Elementa Theme Hooks

    // SECTION: States
    const [recoveryStep, setRecoveryStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Reset password state
    const [email, setEmail] = useState<string>(initialEmail);
    const [recoveryKey, setRecoveryKey] = useState<string>('');
    const [restoreJwt, setRestoreJwt] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    // !SECTION: States

    // SECTION: Form Validation
    const isMatching = newPassword === confirmPassword;
    const isLongEnough = newPassword.length >= 8;
    const showMismatch = confirmPassword.length > 0 && !isMatching;
    const showLengthError = newPassword.length > 0 && !isLongEnough;
    const isResetFormValid = isLongEnough && isMatching;
    // !SECTION: Form Validation

    // SECTION: Side Effects
    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail);
        }
    }, [initialEmail]);

    useEffect(() => {
        if (!isOpen) {
            // Reset wizard state when closing
            setRecoveryStep(1);
            setRecoveryKey('');
            setRestoreJwt('');
            setNewPassword('');
            setConfirmPassword('');
        }
    }, [isOpen]);
    // !SECTION: Side Effects

    // SECTION: Event Handlers
    /**
     * Handles Step 1 of Recovery: verifies recovery key and initiates recovery.
     */
    const handleInitiateRecovery = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        const trimmedKey = recoveryKey.trim();

        if (!trimmedEmail || !trimmedKey) {
            toast.error('Please enter both your email and recovery key.');
            return;
        }

        try {
            setIsLoading(true);

            // 1. Fetch user salts
            const saltRes = await apiFetch(
                `/api/users/salt?email=${encodeURIComponent(trimmedEmail)}`,
                {
                    method: 'GET',
                    headers: {
                        'x-email': trimmedEmail
                    }
                }
            );

            if (!saltRes.ok) {
                toast.error('No account found for this email address.');
                setIsLoading(false);
                return;
            }

            const saltData = await saltRes.json();
            const recoverySalt = saltData.data?.recoverySalt;

            if (!recoverySalt) {
                toast.error(
                    'Recovery credentials not set for this account. Please set up recovery first.'
                );
                setIsLoading(false);
                return;
            }

            // 2. Derive recoveryHash client-side
            const { recoveryHash } =
                await cryptoService.deriveRecoveryCredentials(
                    trimmedKey,
                    hexToUint8Array(recoverySalt)
                );

            // 3. Initiate recovery
            const initiateRes = await apiFetch('/api/auth/recovery/initiate', {
                method: 'POST',
                body: JSON.stringify({
                    email: trimmedEmail,
                    recoveryHash
                })
            });

            const initiateData = await initiateRes.json();

            if (!initiateRes.ok || !initiateData.data?.restoreJwt) {
                logger.error(
                    'Recovery initiate failed:',
                    initiateData.error || initiateData.message
                );
                toast.error(
                    'Invalid recovery key or recovery initiate failed.'
                );
                setIsLoading(false);
                return;
            }

            const token = initiateData.data.restoreJwt as string;
            setRestoreJwt(token);

            toast.success(
                'Recovery key verified successfully! Enter your new password.'
            );
            setRecoveryStep(2);
        } catch (error: unknown) {
            logger.error('Error during recovery initiation:', String(error));
            toast.error('An unexpected error occurred during verification.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles Step 2 of Recovery: confirms reset and completes key re-encryption.
     */
    const handleCompleteRecovery = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isResetFormValid) {
            if (!isLongEnough) {
                toast.error('Password must be at least 8 characters long.');
            } else if (!isMatching) {
                toast.error('Passwords do not match.');
            }
            return;
        }

        try {
            setIsLoading(true);

            // 1. Confirm password reset and fetch salts
            const confirmRes = await apiFetch(
                '/api/auth/reset-password/confirm',
                {
                    method: 'POST',
                    body: JSON.stringify({ restoreJwt })
                }
            );

            const confirmData = await confirmRes.json();

            if (
                !confirmRes.ok ||
                !confirmData.data?.authSalt ||
                !confirmData.data?.encryptionSalt
            ) {
                toast.error('Failed to confirm password reset session.');
                setIsLoading(false);
                return;
            }

            const { authSalt } = confirmData.data;

            // 2. Derive new authKey client-side
            const newAuthKey = await cryptoService.deriveAuthKey(
                newPassword,
                hexToUint8Array(authSalt)
            );

            // 3. Complete recovery on server
            const completeRes = await apiFetch('/api/auth/recovery/complete', {
                method: 'POST',
                body: JSON.stringify({
                    restoreJwt,
                    authKey: newAuthKey
                })
            });

            const completeData = await completeRes.json();

            if (completeRes.ok) {
                toast.success(
                    'Master password successfully reset! You can now log in.'
                );
                onOpenChange(false);
                if (onRecoverySuccess) {
                    onRecoverySuccess(email);
                }
            } else {
                logger.error(
                    'Recovery complete failed:',
                    completeData.error || completeData.message
                );
                toast.error('Failed to finalize recovery. Please try again.');
            }
        } catch (error: unknown) {
            logger.error('Error completing recovery:', String(error));
            toast.error('An unexpected error occurred during password reset.');
        } finally {
            setIsLoading(false);
        }
    };
    // !SECTION: Event Handlers

    // SECTION: UI
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-bg-modal-primary/90 w-[92vw] max-w-160 rounded-2xl border-none p-6 shadow-2xl backdrop-blur-xl sm:w-full">
                {/* SECTION: Storyset Illustration Banner */}
                <div className="bg-bg-raised-secondary mb-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl p-2 shadow-md">
                    <img
                        src={`/illus/recovery/${colorCode}.svg`}
                        alt="Account Recovery Illustration"
                        className="h-full max-h-44 w-auto object-contain"
                    />
                </div>
                {/* !SECTION: Storyset Illustration Banner */}

                <DialogHeader className="mb-2">
                    <DialogTitle className="font-heading text-text-primary text-xl font-bold">
                        Recover Account
                    </DialogTitle>
                    <DialogDescription className="text-text-secondary text-sm">
                        Zero-knowledge account restoration using your recovery
                        seed.
                    </DialogDescription>
                </DialogHeader>

                {/* SECTION: Step 1 - Verification */}
                {recoveryStep === 1 ? (
                    <motion.form
                        key="step-1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 350
                        }}
                        onSubmit={handleInitiateRecovery}
                        className="flex flex-col gap-4"
                    >
                        <div className="bg-bg-warning text-text-tertiary flex items-start gap-2.5 rounded-xl p-3 text-xs shadow-sm">
                            <ShieldAlert className="text-text-accent-secondary mt-0.5 size-4 shrink-0" />
                            <Text
                                variant={TextVariant.Caption}
                                className="text-text-warning"
                            >
                                Enter the email associated with your account and
                                the recovery key issued to you on signup.
                            </Text>
                        </div>
                        <FieldSet>
                            <Field>
                                <FieldLabel htmlFor="recovery-email">
                                    Account Email
                                </FieldLabel>
                                <Input
                                    id="recovery-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="recovery-key">
                                    Recovery Key
                                </FieldLabel>
                                <Input
                                    id="recovery-key"
                                    type="text"
                                    value={recoveryKey}
                                    onChange={(e) =>
                                        setRecoveryKey(e.target.value)
                                    }
                                    placeholder="keyper-recovery-word-word-XX-word"
                                    className="font-mono text-xs"
                                    required
                                />
                                <FieldDescription>
                                    Example:
                                    keyper-recovery-apple-rocket-73-winter
                                </FieldDescription>
                            </Field>
                        </FieldSet>

                        <DialogFooter className="mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="shadow-sm"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !email || !recoveryKey}
                                className="shadow-md"
                            >
                                {isLoading
                                    ? 'Verifying...'
                                    : 'Verify Recovery Key'}
                            </Button>
                        </DialogFooter>
                    </motion.form>
                ) : (
                    /* SECTION: Step 2 - Set New Master Password */
                    <motion.form
                        key="step-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 350
                        }}
                        onSubmit={handleCompleteRecovery}
                        className="flex flex-col gap-4"
                    >
                        <div className="bg-bg-raised-secondary text-text-tertiary flex items-start gap-2.5 rounded-xl p-3 text-xs shadow-sm">
                            <ShieldCheck className="text-text-status-positive-primary mt-0.5 size-4 shrink-0" />
                            <Text>
                                Identity verified! Choose a new master password.
                                Your cryptographic vault keys will be securely
                                regenerated.
                            </Text>
                        </div>
                        <FieldSet>
                            <Field>
                                <FieldLabel htmlFor="new-password">
                                    New Master Password
                                </FieldLabel>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    placeholder="Enter at least 8 characters"
                                    required
                                />
                                {showLengthError && (
                                    <Text
                                        variant={TextVariant.Caption}
                                        className="text-text-status-negative-primary mt-1 font-medium"
                                    >
                                        Password must be at least 8 characters
                                        long.
                                    </Text>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirm-password">
                                    Confirm Master Password
                                </FieldLabel>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Re-enter your master password"
                                    required
                                />
                                {showMismatch && (
                                    <Text
                                        variant={TextVariant.Caption}
                                        className="text-text-status-negative-primary mt-1 font-medium"
                                    >
                                        Passwords do not match.
                                    </Text>
                                )}
                            </Field>
                        </FieldSet>

                        <DialogFooter className="mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="shadow-sm"
                                onClick={() => setRecoveryStep(1)}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !isResetFormValid}
                                className="shadow-md"
                            >
                                {isLoading
                                    ? 'Resetting...'
                                    : 'Reset Password & Restore Access'}
                            </Button>
                        </DialogFooter>
                    </motion.form>
                )}
                {/* !SECTION: Step 2 */}
            </DialogContent>
        </Dialog>
    );
    // !SECTION: UI
}
