'use client';
import { useRef } from 'react';
import Image from 'next/image';
import everything1 from '@/public/everything-loqo/everything1.svg';
import everything2 from '@/public/everything-loqo/everything2.svg';
import everything3 from '@/public/everything-loqo/everything3.svg';
import everything4 from '@/public/everything-loqo/everything4.svg';

export const EverythingLOQO = () => {
    const ref = useRef(null);
    return (
        <section ref={ref} id='' className='pt-6 pb-5 flex flex-col justify-center'>
            <div className='flex flex-col gap-y-2 xl:w-1/2'>
                <h2 className='text-2xl font-normal'>Everything you need to track campaign ROIs</h2>
                <p className='text-pretty text-base font-light text-gray-500'>Enjoy LOQO’s powerful features and measure your ROIs with ease</p>
            </div>
            <div className='flex flex-col sm:flex-row gap-6 mt-8 sm:mt-12'>
                <div className='w-full sm:w-2/3 bg-[#F7F7F7] pt-6 shadow-lg rounded-lg border border-black'>
                    <div className='text-2xl font-semibold px-6'>
                        <span className='w-auto text-white bg-black px-4 py-2 rounded-3xl'>Post Previews</span>
                    </div>
                    <div className='text-lg font-light px-6 my-4'>Get campaign's all post previews directly on your dashboard</div>
                    <div className='flex w-full justify-end'>
                        <Image src={everything1} alt='everything1' className='w-[95%] -mt-6 sm:-mt-12' />
                    </div>
                </div>
                <div className='w-full sm:w-1/3 bg-[#F7F7F7] pt-6 shadow-lg rounded-lg border border-black'>
                    <div className='text-2xl font-semibold px-6'>
                        <span className='w-auto text-white bg-black px-4 py-2 rounded-3xl'>Spreadsheet enabled</span>
                    </div>
                    <div className='text-lg font-light px-6 my-4'>Upload your usual Spreadsheet & leave the detailed reporting to us</div>
                    <div className='flex w-full justify-end'>
                        <Image src={everything2} alt='everything2' className='w-[95%] -mt-16 sm:mt-[-66px]' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-6 mt-6'>
                <div className='w-full sm:w-1/3 bg-[#F7F7F7] pt-6 shadow-lg rounded-lg border border-black'>
                    <div className='text-2xl font-semibold px-6'>
                        <span className='w-auto text-white bg-black px-4 py-2 rounded-3xl'>Shareable Dashboard</span>
                    </div>
                    <div className='text-lg font-light px-6 my-4'>Skip the slide presentations with LOQO’s data-rich shareable dashboard.</div>
                    <div className='flex w-full justify-end'>
                        <Image src={everything3} alt='everything1' className='w-[95%] -mt-3 sm:-mt-12' />
                    </div>
                </div>
                <div className='w-full sm:w-2/3 bg-[#F7F7F7] pt-6 shadow-lg rounded-lg border border-black'>
                    <div className='text-2xl font-semibold px-6'>
                        <span className='w-auto text-white bg-black px-4 py-2 rounded-3xl'>Designed for Teams</span>
                    </div>
                    <div className='text-lg font-light px-6 my-4'>Collaborate and work like as if you’re right next to each other</div>
                    <div className='flex w-full justify-end'>
                        <Image src={everything4} alt='everything1' className='w-[95%] -mt-3 sm:-mt-12' />
                    </div>
                </div>
            </div>
        </section>
    );
};
