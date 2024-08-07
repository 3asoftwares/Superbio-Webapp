'use client';
import { useAppDispatch, useAppSelector } from '@/context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUsers } from 'react-icons/fa';
import { HiOutlineQueueList } from 'react-icons/hi2';
import DynamicLogo from '../DynamicLogo';
import { setCampaignType } from '@/context/user';
import { logout } from '@/lib/utils';

interface SideBarProps {
    sidebarOpen?: boolean;
    onCloseSidebar?: () => void;
}

export const sidebarItems = [
    {
        name: 'Home',
        icon: ({ isActive }: { isActive: boolean }) => (
            <svg width='32' height='32' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M20.04 7.31774L14.28 3.28774C12.71 2.18774 10.3 2.24774 8.78999 3.41774L3.77999 7.32774C2.77999 8.10774 1.98999 9.70774 1.98999 10.9677V17.8677C1.98999 20.4177 4.05999 22.4977 6.60999 22.4977H17.39C19.94 22.4977 22.01 20.4277 22.01 17.8777V11.0977C22.01 9.74774 21.14 8.08774 20.04 7.31774ZM12.75 18.4977C12.75 18.9077 12.41 19.2477 12 19.2477C11.59 19.2477 11.25 18.9077 11.25 18.4977V15.4977C11.25 15.0877 11.59 14.7477 12 14.7477C12.41 14.7477 12.75 15.0877 12.75 15.4977V18.4977Z'
                    fill={isActive ? '#000000' : '#CDCDCD'}
                />
            </svg>
        ),
        link: '/',
    },
    {
        name: 'Users',
        icon: ({ isActive }: { isActive: boolean }) => <FaUsers size={32} color={isActive ? '#000000' : '#CDCDCD'} />,
        link: '/users',
    },
    {
        name: 'Live Reports',
        icon: ({ isActive }: { isActive: boolean }) => <HiOutlineQueueList size={32} color={isActive ? '#000000' : '#CDCDCD'} />,
        link: '/queue',
    },
];

export default function SideBar({ sidebarOpen, onCloseSidebar }: SideBarProps) {
    const path = usePathname();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.user);

    return (
        <>
            {sidebarOpen && (
                <div className='absolute top-[256px] left-[218px]' onClick={onCloseSidebar}>
                    <svg xmlns='http://www.w3.org/2000/svg' enable-background='new 0 0 32 32' viewBox='0 0 32 32' id='cross' width='20' height='20'>
                        <path d='M31.5,2.42828c0-0.51752-0.20148-1.00427-0.56763-1.36987c-0.73224-0.73224-2.00751-0.73224-2.73975,0L16,13.25104L3.80737,1.05841c-0.73224-0.73224-2.00751-0.73224-2.73975,0C0.70154,1.42401,0.5,1.91077,0.5,2.42828c0,0.51746,0.20154,1.00421,0.56763,1.36987l12.19263,12.19263L1.06763,28.18341C0.70154,28.54901,0.5,29.03577,0.5,29.55328c0,0.51746,0.20154,1.00421,0.56763,1.36987c0.73224,0.73224,2.00751,0.73224,2.73975,0L16,18.73053l12.19263,12.19263c0.36615,0.36609,0.85242,0.56763,1.36987,0.56763c0.51752,0,1.00378-0.20154,1.36987-0.56763C31.29852,30.5575,31.5,30.07074,31.5,29.55328c0-0.51752-0.20148-1.00427-0.56763-1.36987L18.73975,15.99078L30.93237,3.79816C31.29852,3.4325,31.5,2.94574,31.5,2.42828z'></path>
                    </svg>
                </div>
            )}
            <div className='flex flex-col items-center w-16 border-r px-2 py-6 w-16 shadow-md shadow-[#CDCDCD] h-screen'>
                <div className='flex h-full'>
                    <div className='flex flex-col space-y-6'>
                        {sidebarItems.map((item) =>
                            item?.name === 'Users' ? (
                                user.role === 'admin' && (
                                    <Link href={item.link} key={item.name} className='flex items-center space-x-3'>
                                        <item.icon isActive={path === item.link} />
                                    </Link>
                                )
                            ) : (
                                <Link href={item.link} key={item.name} className='flex items-center space-x-3'>
                                    <item.icon isActive={path === item.link} />
                                </Link>
                            )
                        )}
                    </div>
                </div>
                <div className='flex items-center flex-col space-y-6 mb-[80px]'>
                    <Link href={'/profile'} key={'profile'} className='flex items-center space-x-3'>
                        <svg
                            fill={path === '/profile' ? '#000000' : '#CDCDCD'}
                            width='32px'
                            height='32px'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'>
                            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                            <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                            <g id='SVGRepo_iconCarrier'>
                                <circle cx='12' cy='6' r='4' fill={path === '/profile' ? '#000000' : '#CDCDCD'}></circle>{' '}
                                <ellipse cx='12' cy='17' rx='7' ry='4' fill={path === '/profile' ? '#000000' : '#CDCDCD'}></ellipse>
                            </g>
                        </svg>
                    </Link>
                    <Link href={'/contacts'} key={'contacts'} className='flex items-center space-x-3'>
                        <svg
                            id='svg'
                            fill={path === '/contacts' ? '#000000' : '#CDCDCD'}
                            width='32px'
                            height='32px'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM7.67 5.5C7.67 5.09 8.01 4.75 8.42 4.75C8.83 4.75 9.17 5.09 9.17 5.5V9.4C9.17 9.81 8.83 10.15 8.42 10.15C8.01 10.15 7.67 9.81 7.67 9.4V5.5ZM9.52282 16.4313C9.31938 16.5216 9.17 16.7132 9.17 16.9358V18.5C9.17 18.91 8.83 19.25 8.42 19.25C8.01 19.25 7.67 18.91 7.67 18.5V16.9358C7.67 16.7132 7.5206 16.5216 7.31723 16.4311C6.36275 16.0064 5.7 15.058 5.7 13.95C5.7 12.45 6.92 11.22 8.42 11.22C9.92 11.22 11.15 12.44 11.15 13.95C11.15 15.0582 10.4791 16.0066 9.52282 16.4313ZM16.33 18.5C16.33 18.91 15.99 19.25 15.58 19.25C15.17 19.25 14.83 18.91 14.83 18.5V14.6C14.83 14.19 15.17 13.85 15.58 13.85C15.99 13.85 16.33 14.19 16.33 14.6V18.5ZM15.58 12.77C14.08 12.77 12.85 11.55 12.85 10.04C12.85 8.93185 13.5209 7.98342 14.4772 7.55873C14.6806 7.46839 14.83 7.27681 14.83 7.05421V5.5C14.83 5.09 15.17 4.75 15.58 4.75C15.99 4.75 16.33 5.09 16.33 5.5V7.06421C16.33 7.28681 16.4794 7.47835 16.6828 7.56885C17.6372 7.9936 18.3 8.94195 18.3 10.05C18.3 11.55 17.08 12.77 15.58 12.77Z'
                                fill={path === '/contacts' ? '#000000' : '#CDCDCD'}></path>
                        </svg>
                    </Link>

                    <span
                        onClick={() => {
                            logout();
                            dispatch(setCampaignType(''));
                        }}
                        className='text-[#CCCCCC] group-hover:text-black text-xs'>
                        <svg width='32' height='32' viewBox='0 0 24 24' fill='none' className='mr-2' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                className='fill-[#CCCCCC] group-hover:fill-black'
                                d='M16.8 2H14.2C11 2 9 4 9 7.2V11.25H15.25C15.66 11.25 16 11.59 16 12C16 12.41 15.66 12.75 15.25 12.75H9V16.8C9 20 11 22 14.2 22H16.79C19.99 22 21.99 20 21.99 16.8V7.2C22 4 20 2 16.8 2Z'
                            />
                            <path
                                d='M4.55994 11.2538L6.62994 9.18375C6.77994 9.03375 6.84994 8.84375 6.84994 8.65375C6.84994 8.46375 6.77994 8.26375 6.62994 8.12375C6.33994 7.83375 5.85994 7.83375 5.56994 8.12375L2.21994 11.4738C1.92994 11.7638 1.92994 12.2438 2.21994 12.5338L5.56994 15.8838C5.85994 16.1738 6.33994 16.1738 6.62994 15.8838C6.91994 15.5938 6.91994 15.1137 6.62994 14.8238L4.55994 12.7538H8.99994V11.2538H4.55994Z'
                                className='fill-[#CCCCCC] group-hover:fill-black'
                            />
                        </svg>
                    </span>
                </div>
            </div>
        </>
    );
}

