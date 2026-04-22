// /* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useState } from 'react';
import { Text } from '@/src/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * This interface defines the context for the Stepper component.
 */
interface StepperContextType {
    activeStep: number;
    setActiveStep: (step: number) => void;
    width: string;
    totalSteps: number;
    setTotalSteps: (steps: number) => void;
    flowStepper: boolean;
}
const StepperContext = createContext<StepperContextType>({
    activeStep: 0,
    setActiveStep: () => {},
    width: 'w-full',
    totalSteps: 0,
    setTotalSteps: () => {},
    flowStepper: false
});

/**
 * This component renders a connector line between two {@link StepperIndicatorListItem}s.
 */
const StepperConnector: React.FC<{ stepNumber: number }> = (props: {
    stepNumber: number;
}) => {
    const stepperContext = useContext(StepperContext);

    return (
        <div className="flex items-center">
            <div
                className={`${stepperContext.activeStep === props.stepNumber - 1 ? 'bg-bg-active-accent-primary' : 'bg-bg-active-secondary'} h-0.5 flex-1`}
            />
            <div className="bg-bg-active-secondary h-0.5 w-45 flex-1" />
        </div>
    );
};

/**
 * This component renders a stepper indicator list.
 */
interface StepperIndicatorListProps {
    children: React.ReactNode;
}

const StepperIndicatorList: React.FC<StepperIndicatorListProps> = (
    props: StepperIndicatorListProps
) => {
    const totalSteps = React.Children.count(props.children);
    const stepperContext = useContext(StepperContext);

    React.useEffect(() => {
        stepperContext.setTotalSteps(totalSteps);
    }, [totalSteps, stepperContext]);

    return <div className="flex items-center">{props.children}</div>;
};

/**
 * This component renders a stepper indicator list item within {@link StepperIndicatorList}.
 */
interface StepperIndicatorListItemProps {
    stepNumber: number;
    label: string;
    icon: React.ReactNode;
}

const StepperIndicatorListItem: React.FC<StepperIndicatorListItemProps> = (
    props: StepperIndicatorListItemProps
) => {
    const stepperContext = useContext(StepperContext);

    const handleClick = () => {
        if (!stepperContext.flowStepper) {
            stepperContext.setActiveStep(props.stepNumber - 1);
        }
    };

    return (
        <div className="flex items-center">
            <button
                className={`flex flex-col items-center ${
                    stepperContext.flowStepper
                        ? 'cursor-default'
                        : 'cursor-pointer'
                } ${stepperContext.activeStep === props.stepNumber - 1 ? 'text-text-accent-primary' : 'text-text-primary'}`}
                onClick={handleClick}
                disabled={stepperContext.flowStepper}
            >
                {props.icon}
                <Text
                    color={
                        stepperContext.activeStep === props.stepNumber - 1
                            ? 'text-text-accent-primary'
                            : 'text-text-primary'
                    }
                    className={`mt-2 font-medium`}
                >
                    {props.label}
                </Text>
            </button>
            {props.stepNumber < stepperContext.totalSteps && (
                <StepperConnector stepNumber={props.stepNumber} />
            )}
        </div>
    );
};

/**
 * This component renders the content of a particular {@link StepperIndicatorItem}.
 */
interface StepperContentProps {
    children: React.ReactNode[];
}

const StepperContent: React.FC<StepperContentProps> = (
    props: StepperContentProps
) => {
    const stepperContext = useContext(StepperContext);

    return (
        <div className={stepperContext.width}>
            {props.children.at(stepperContext.activeStep) || (
                <div>No content available for this step</div>
            )}
        </div>
    );
};

/**
 * This component renders a stepper content item within a {@link StepperContent} component.
 */
interface StepperContentItemProps {
    children: React.ReactNode;
    stepNumber: number;
}

const StepperContentItem: React.FC<StepperContentItemProps> = (
    props: StepperContentItemProps
) => {
    return <div className={`p-4`}>{props.children}</div>;
};

/**
 * This component renders a stepper UI component.
 */
interface StepperProps {
    children: React.ReactNode;
    className?: string;
    width?: string;
    flowStepper?: boolean;
    currentStep?: number;
    setCurrentStep?: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = (props) => {
    const [internalActiveStep, setInternalActiveStep] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);

    // Use external state when flowStepper is true, otherwise use internal state
    const activeStep = props.flowStepper
        ? (props.currentStep ?? 0)
        : internalActiveStep;
    const setActiveStep = props.flowStepper
        ? (props.setCurrentStep ?? (() => {}))
        : setInternalActiveStep;

    return (
        <StepperContext.Provider
            value={{
                activeStep,
                setActiveStep,
                width: props.width || 'w-full',
                totalSteps: totalSteps,
                setTotalSteps,
                flowStepper: props.flowStepper ?? false
            }}
        >
            <div
                className={cn(
                    'flex flex-col items-center',
                    props.width || 'w-full',
                    props.className
                )}
            >
                {props.children}
            </div>
        </StepperContext.Provider>
    );
};

// export default Stepper;
export {
    Stepper,
    StepperIndicatorList,
    StepperIndicatorListItem,
    StepperContent,
    StepperContentItem
};
