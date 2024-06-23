'use client';
import { useAppDispatch, useAppSelector } from '@/context';
import { deleteCookie } from 'cookies-next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUsers } from 'react-icons/fa';
import { HiOutlineQueueList } from 'react-icons/hi2';
import DynamicLogo from '../DynamicLogo';
import { setCampaignType } from '@/context/user';

interface SideBarProps {
    sidebarOpen?: boolean;
    onCloseSidebar?: () => void;
}

const items = [
    {
        name: 'Home',
        icon: ({ isActive }: { isActive: boolean }) => (
            <svg width='26' height='26' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
        icon: ({ isActive }: { isActive: boolean }) => <FaUsers size={26} color={isActive ? '#000000' : '#CDCDCD'} />,
        link: '/users',
    },
    {
        name: 'Live Reports',
        icon: ({ isActive }: { isActive: boolean }) => <HiOutlineQueueList size={26} color={isActive ? '#000000' : '#CDCDCD'} />,
        link: '/queue',
    },
];
//df

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
            <div className='flex flex-col items-center w-16 border-r px-2 py-6 h-full w-28'>
                <div className='flex flex-col w-10 items-center'>
                    <Link href={'/'} className='w-20'>
                        <DynamicLogo />
                    </Link>
                </div>
                <div className='flex h-full'>
                    <div className='flex flex-col space-y-6 mt-10'>
                        {items.map((item) =>
                            item?.name === 'Users' ? (
                                user.role === 'admin' && (
                                    <Link href={item.link} key={item.name} className='flex items-center space-x-3'>
                                        <item.icon isActive={path === item.link} />
                                        {/* <span className={`text-base font-bold ${path === item.link ? 'text-black' : 'text-[#676767]'}`}>{item.name}</span> */}
                                    </Link>
                                )
                            ) : (
                                <Link href={item.link} key={item.name} className='flex items-center space-x-3'>
                                    <item.icon isActive={path === item.link} />
                                    {/* <span className={`text-base font-bold ${path === item.link ? 'text-black' : 'text-[#676767]'}`}>{item.name}</span> */}
                                </Link>
                            )
                        )}
                    </div>
                </div>
                <div className='flex items-center flex-col space-y-6 r'>
                    {/* {user.profilePic !== '' ? (
                        <div
                            className='w-11 h-11 bg-[#e2e8f0] rounded-full border border-gray-300 bg-cover bg-center'
                            style={{ backgroundImage: `url("${user.profilePic}")` }}></div>
                    ) : (
                        <div
                            key={'profilepic'}
                            className='relative inline-flex items-center justify-center w-16 h-16 overflow-hidden rounded-full border border-gray-300 bg-cover bg-[#e2e8f0]'>
                            <span className='font-medium text-2xl text-gray-600 '>{user.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                    )} */}
                    {/* <span className='text-base  font-bold mt-3'>{user.name}</span> */}
                    {/* <span className='text-sm text-[#919191] font-bold'>{user.email}</span> */}
                    <Link href={'/profile'} key={'profile'} className='flex items-center space-x-3'>
                        <svg
                            fill={path === '/profile' ? '#000000' : '#CDCDCD'}
                            width='26px'
                            height='26px'
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
                            fill={path === '/contacts' ? '#000000' : '#CDCDCD'}
                            width='26px'
                            height='26px'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'>
                            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                            <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                            <g id='SVGRepo_iconCarrier'>
                                <g id='style=fill'>
                                    <g id='setting'>
                                        <path
                                            id='Subtract'
                                            fillRule='evenodd'
                                            clipRule='evenodd'
                                            d='M10.8946 3.00654C10.2226 1.87704 8.75191 1.45656 7.59248 2.14193L5.86749 3.12906C4.59518 3.85639 4.16378 5.48726 4.8906 6.74522L4.89112 6.74611C5.26606 7.39298 5.20721 7.8062 5.09018 8.00929C4.97308 8.21249 4.64521 8.47001 3.9 8.47001C2.43322 8.47001 1.25 9.66837 1.25 11.12V12.88C1.25 14.3317 2.43322 15.53 3.9 15.53C4.64521 15.53 4.97308 15.7875 5.09018 15.9907C5.20721 16.1938 5.26606 16.607 4.89112 17.2539L4.8906 17.2548C4.16378 18.5128 4.59558 20.1439 5.8679 20.8712L7.59257 21.8581C8.75199 22.5434 10.2226 22.123 10.8946 20.9935L11.0091 20.7958C11.3841 20.1489 11.773 19.9925 12.0087 19.9925C12.2434 19.9925 12.6293 20.1476 12.9993 20.793L13.0009 20.7958L13.1109 20.9858L13.1154 20.9935C13.7874 22.123 15.258 22.5434 16.4174 21.8581L18.1425 20.871C19.4157 20.1431 19.8444 18.5235 19.1212 17.2579L19.1189 17.2539C18.7439 16.607 18.8028 16.1938 18.9198 15.9907C19.0369 15.7875 19.3648 15.53 20.11 15.53C21.5768 15.53 22.76 14.3317 22.76 12.88V11.12C22.76 9.65323 21.5616 8.47001 20.11 8.47001C19.3648 8.47001 19.0369 8.21249 18.9198 8.00929C18.8028 7.8062 18.7439 7.39298 19.1189 6.74611L19.1194 6.74522C19.8463 5.48713 19.4147 3.85604 18.1421 3.12883L16.4175 2.14193C15.2581 1.45656 13.7874 1.877 13.1154 3.00651L13.0009 3.20423C12.6259 3.85115 12.237 4.00751 12.0012 4.00751C11.7666 4.00751 11.3807 3.85247 11.0107 3.20701L11.0091 3.20423L10.8991 3.01421L10.8946 3.00654ZM15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z'
                                            fill={path === '/contacts' ? '#000000' : '#CDCDCD'}></path>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </Link>

                    <span
                        onClick={() => {
                            deleteCookie('token');
                            deleteCookie('user');
                            window.location.reload();
                            dispatch(setCampaignType(''));
                        }}
                        className='text-[#CCCCCC] group-hover:text-black text-xs'>
                        <svg width='26' height='26' viewBox='0 0 24 24' fill='none' className='mr-2' xmlns='http://www.w3.org/2000/svg'>
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
