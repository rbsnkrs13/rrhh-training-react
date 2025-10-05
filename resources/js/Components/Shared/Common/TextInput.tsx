import { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    isFocused?: boolean;
}

export default forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => localRef.current!);

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
            ref={localRef}
        />
    );
});
