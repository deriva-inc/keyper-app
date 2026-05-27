'use client';

import { detectFieldType, formatKey } from '@/lib/utils';
import { Text, TextVariant } from '@/src/components/ui/text';

/**
 * This component is responsible for rendering the custom fields of a vault entry.
 *
 * @author Aayush Goyal
 * @created 2026-05-27
 */
// ------------------------------------------------------------------
// SUB-RENDERERS: One component per data type
// ------------------------------------------------------------------
/** Renders an array field as a numbered list. e.g., recovery codes */
function ArrayFieldRenderer({ value }: { value: unknown[] }) {
    return (
        <ol className="mt-1 grid grid-cols-2 items-center gap-2 space-y-1">
            {value.map((item, index) => (
                <li
                    key={index}
                    className="bg-bg-active-secondary font-body rounded px-2 py-1 font-medium"
                >
                    {String(item)}
                </li>
            ))}
        </ol>
    );
}

/** Renders an object field as nested key-value pairs. e.g., security question */
function ObjectFieldRenderer({ value }: { value: Record<string, unknown> }) {
    return (
        <div className="border-stroke-active-primary mt-1 space-y-2 border-l-2 pl-3">
            {Object.entries(value).map(([nestedKey, nestedValue]) => (
                <div key={nestedKey}>
                    <Text
                        variant={TextVariant.Body}
                        className="text-text-secondary"
                    >
                        {formatKey(nestedKey)}
                    </Text>
                    <Text className="text-text-primary font-medium">
                        {String(nestedValue)}
                    </Text>
                </div>
            ))}
        </div>
    );
}

/** Renders a primitive field (string, number, boolean) as plain text. */
function PrimitiveFieldRenderer({ value }: { value: unknown }) {
    const displayValue =
        typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);

    return (
        <Text variant={TextVariant.Body} className="mt-1">
            {displayValue}
        </Text>
    );
}

// ------------------------------------------------------------------
// MAIN CUSTOM FIELDS RENDERER
// ------------------------------------------------------------------
/**
 * Parses the `customFields` JSON string and renders each field with
 * the appropriate sub-renderer based on its detected type.
 */
function CustomFieldsRenderer({
    customFields
}: {
    customFields?: Record<string, unknown> | null;
}) {
    if (!customFields || Object.keys(customFields).length === 0) return null;

    // ✅ `customFields` is already a plain object — use it directly.
    const entries = Object.entries(customFields);

    return (
        <div className="space-y-4">
            <Text variant={TextVariant.H4} color="text-text-accent-primary">
                Custom Fields
            </Text>
            {entries.map(([key, value]) => {
                const type = detectFieldType(value);
                return (
                    <div key={key} className="space-y-1">
                        <Text variant={TextVariant.H6}>{formatKey(key)}</Text>
                        {type === 'array' && (
                            <ArrayFieldRenderer value={value as unknown[]} />
                        )}
                        {type === 'object' && (
                            <ObjectFieldRenderer
                                value={value as Record<string, unknown>}
                            />
                        )}
                        {type === 'primitive' && (
                            <PrimitiveFieldRenderer value={value} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export { CustomFieldsRenderer };
