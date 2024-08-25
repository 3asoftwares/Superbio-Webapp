import DynamicLogo from '@/components/global-components/DynamicLogo';
import Link from 'next/link';
import React, { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <div className='flex flex-col w-full h-screen bg-white '>
            <div className='flex items-end w-full p-5 text-black  font-bold border-b text-3xl'>
                <div className='flex items-center space-x-3'>
                    <DynamicLogo />
                </div>
            </div>
            <div className='flex flex-col px-4 py-3'>{children}</div>
        </div>
    );
}
