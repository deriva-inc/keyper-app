import { clsx, type ClassValue } from 'clsx';
import {
    Airplane,
    Briefcase,
    CreditCard,
    DogPaw,
    Fingerprint,
    Flag,
    Gear,
    Home1,
    IdCard,
    Import,
    MediaPlayback,
    MoneyInstitution2,
    Notepad,
    OpenBook,
    PiggyBank,
    Pills,
    Rocket,
    RupeeCash1,
    ShoppingBags,
    ToolBox,
    World1
} from 'elementa-icons';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';
import logger from '@/lib/logger';
import { EntryCustomFieldValueType } from './types/model';

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

const profileIcons = [
    {
        id: 'id-card',
        icon: IdCard
    },
    {
        id: 'briefcase',
        icon: Briefcase
    },
    {
        id: 'piggy-bank',
        icon: PiggyBank
    },
    {
        id: 'home',
        icon: Home1
    },
    {
        id: 'rocket',
        icon: Rocket
    },
    {
        id: 'shopping-bags',
        icon: ShoppingBags
    },
    {
        id: 'gear',
        icon: Gear
    },
    {
        id: 'flag',
        icon: Flag
    },
    {
        id: 'dog-paw',
        icon: DogPaw
    },
    {
        id: 'airplane',
        icon: Airplane
    },
    {
        id: 'tool-box',
        icon: ToolBox
    },
    {
        id: 'open-book',
        icon: OpenBook
    },
    {
        id: 'world',
        icon: World1
    },
    {
        id: 'media-playback',
        icon: MediaPlayback
    },
    {
        id: 'pills',
        icon: Pills
    },
    {
        id: 'import',
        icon: Import
    }
];

const groupProviders = [
    {
        id: 'google',
        name: 'Google',
        icon: '/icons/providers/google.svg'
    },
    {
        id: 'amazon',
        name: 'Amazon',
        icon: '/icons/providers/amazon.svg'
    },
    {
        id: 'microsoft',
        name: 'Microsoft',
        icon: '/icons/providers/microsoft.svg'
    },
    {
        id: 'github',
        name: 'GitHub',
        icon: '/icons/providers/github.svg'
    },
    {
        id: 'hdfc',
        name: 'HDFC Bank',
        icon: '/icons/providers/hdfc.svg'
    },
    {
        id: 'kotak',
        name: 'Kotak Mahindra Bank',
        icon: '/icons/providers/kotak_mahindra.svg'
    },
    {
        id: 'indusind',
        name: 'IndusInd Bank',
        icon: '/icons/providers/indusind.svg'
    },
    {
        id: 'rbl',
        name: 'RBL Bank',
        icon: '/icons/providers/rbl.svg'
    }
];

const groupCategories = [
    {
        id: 'social',
        name: 'Social',
        icon: 'https://storage.googleapis.com/elementa-icons/social-people/friends.svg'
    },
    {
        id: 'travel',
        name: 'Travel',
        icon: 'https://storage.googleapis.com/elementa-icons/transportation/airplane.svg'
    },
    {
        id: 'health-wellness',
        name: 'Health & Wellness',
        icon: 'https://storage.googleapis.com/elementa-icons/medical-health/pills.svg'
    }
];

const entryTypeIcons = [
    {
        type: 'login',
        icon: Fingerprint
    },
    {
        type: 'credit_card',
        icon: CreditCard
    },
    {
        type: 'debit_card',
        icon: CreditCard
    },
    {
        type: 'bank_account',
        icon: MoneyInstitution2
    },
    {
        type: 'upi_id',
        icon: RupeeCash1
    },
    {
        type: 'identity_card',
        icon: IdCard
    },
    {
        type: 'secure_note',
        icon: Notepad
    }
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

/**
 * This function detects the underlying JSON type of a custom field value.
 * - 'array'     → e.g., recovery codes ["abcd-1234", "efgh-5678"]
 * - 'object'    → e.g., security question { question: "...", answer: "..." }
 * - 'primitive' → e.g., a special number, string, or boolean
 */
function detectFieldType(value: unknown): EntryCustomFieldValueType {
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    return 'primitive';
}

// Utility: converts a camelCase or snake_case key to a human-readable label.
// e.g., "security_question_1" -> "Security Question 1"
// e.g., "twoFactorBackupCodes" -> "Two Factor Backup Codes"
function formatKey(key: string): string {
    return key
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export {
    protectedRoutes,
    profileIcons,
    groupProviders,
    groupCategories,
    entryTypeIcons
};
export {
    cn,
    hexToUint8Array,
    uint8ArrayToHex,
    copyToClipboard,
    detectFieldType,
    formatKey
};
