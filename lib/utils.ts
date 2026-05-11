import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import logger from '@/lib/logger';
import { toast } from 'sonner';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const protectedRoutes = [
    '/dashboard',
    '/groups',
    '/entries',
    '/vault',
    '/profiles'
];

/**
 * This function converts a hex string to a Uint8Array.
 *
 * @param {string} hexString - The hex string to convert
 * @returns {Uint8Array} The resulting Uint8Array
 */
const hexToUint8Array = (hexString: string): Uint8Array => {
    const bytes = [];
    for (let i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
};

/**
 * This function converts a Uint8Array to a hex string.
 *
 * @param {Uint8Array} bytes - The Uint8Array to convert
 * @returns {string} The resulting hex string
 */
const uint8ArrayToHex = (bytes: Uint8Array): string => {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
};

/**
 * This function copies text to clipboard using the modern Clipboard API with fallback.
 *
 * @param {string} text - The text to copy to clipboard
 * @returns {Promise<void>} Promise that resolves when copy is successful
 */
const copyToClipboard = async (text: string): Promise<void> => {
    try {
        // Modern Clipboard API (preferred)
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard');
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        logger.error('Failed to copy text to clipboard:', error.toString());
        toast.error('Cannot copy to clipboard');
        throw new Error('Failed to copy to clipboard');
    }
};

export { protectedRoutes };
export { cn, hexToUint8Array, uint8ArrayToHex, copyToClipboard };
