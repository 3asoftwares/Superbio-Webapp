'use client';
import CampaignCard from '@/components/CampaignCard';
import CreateCampaignModal from '@/components/Modals/CreateCampaignModal';
import { useAppDispatch, useAppSelector } from '@/context';
import { setCampaignType, setMembers } from '@/context/user';
import UserNetworkService from '@/services/user.service';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import CampaignNetworkService from '@/services/campaign.service';
import useSWR from 'swr';
import Image from 'next/image';

export default function Home() {
    const dispatch = useAppDispatch();
    const { user, campaignType } = useAppSelector((state) => state.user);
    const [mode, setMode] = useState('add');
    const [campaignDetails, setCampaignDetails] = useState({});
    const [openCampaingModal, setOpenCampaingModal] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [currentSearchText, setCurrentSearchText] = useState('');
    const [campaignImg] = useState('/images/reset.png');
    const [influncerImg] = useState('/images/reset.png');
    const [selectType, setSelectType] = useState('campaign');

    const { data: activeCampaign, isLoading } = useSWR(
        `?page=1&limit=3&status=active&ownerType=own${searchText !== '' ? '&q=' + searchText : ''}`,
        CampaignNetworkService.instance.fetcher
    );
    const { data: sharedCampaignData } = useSWR(
        `?page=1&limit=3&status=active&ownerType=shared${searchText !== '' ? '&q=' + searchText : ''}`,
        CampaignNetworkService.instance.fetcher
    );
    const { data: archivedCampaignData } = useSWR('?page=1&limit=3&status=archived&ownerType=own', CampaignNetworkService.instance.fetcher);

    const editCampaign = (campaign: any) => {
        setMode('edit');
        setOpenCampaingModal(true);
        setCampaignDetails(campaign);
    };

    const resetSearch = () => {
        setIsSearch(false);
        setSearchText('');
        setCurrentSearchText('');
    };

    React.useEffect(() => {
        UserNetworkService.instance
            .getAllUsers({ page: 1, limit: 100 })
            .then((res) => {
                dispatch(setMembers([user, ...res.data]));
            })
            .catch((err) => {
                enqueueSnackbar('You are not authorized to view this page', { variant: 'error' });
            });
    }, []);

    const shouldShowNoCampaign =
        (activeCampaign && activeCampaign.length > 0) ||
        (sharedCampaignData && sharedCampaignData.length > 0) ||
        (archivedCampaignData && archivedCampaignData.length > 0);

    return (
        <div className='flex flex-col w-full overflow-hidden'>
            {openCampaingModal && (
                <CreateCampaignModal
                    mode={mode}
                    campaignDetails={campaignDetails}
                    closeModal={() => {
                        setOpenCampaingModal(false);
                    }}
                />
            )}
            {campaignType === '' && (
                <div className='flex gap-4 h-screen w-full justify-start items-start p-10'>
                    <div
                        className={`flex flex-col aspect-square rounded-xl p-10 pr-0 pb-6 ${selectType === 'campaign' ? 'bg-[#323232]' : 'bg-[#F6F6F6]'}`}
                        onClick={() => setSelectType('campaign')}>
                        <Image src={campaignImg} width={288} height={288} alt='Campaign' className='w-72 h-72 p-4 pr-0' />
                        <div className={`flex flex-col ${selectType === 'campaign' ? 'mb-0' : 'mb-6'}`}>
                            <span className={`${selectType === 'campaign' ? 'text-white' : 'text-black'}`}>Campaign Reporting</span>
                            <span className='text-[#7D7D7D] text-sm'>Description</span>
                        </div>
                        {selectType === 'campaign' && (
                            <button onClick={() => dispatch(setCampaignType('campaign'))} className='flex items-center justify-end px-3'>
                                <div className={`w-full flex gap-3 justify-end ${selectType === 'campaign' ? 'text-white' : 'text-black'}`}>
                                    <span className='hidden sm:flex'>Get Started</span>
                                    <svg width='24px' height='24px' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' fill='none'>
                                        <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
                                        <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
                                        <g id='SVGRepo_iconCarrier'>
                                            <path
                                                fill={selectType === 'campaign' ? '#fff' : '#000'}
                                                d='M8.235 4.045a.75.75 0 111.03-1.09l4.5 4.25a.75.75 0 010 1.09l-4.5 4.25a.75.75 0 01-1.03-1.09L11.364 8.5H2.75a.75.75 0 010-1.5h8.614L8.235 4.045z'></path>
                                        </g>
                                    </svg>
                                </div>
                            </button>
                        )}
                    </div>
                    <div
                        className={`flex flex-col aspect-square rounded-xl p-10 pr-0 pb-6 ${selectType === 'influncer' ? 'bg-[#323232]' : 'bg-[#F6F6F6]'}`}
                        onClick={() => setSelectType('influncer')}>
                        <Image src={influncerImg} width={288} height={288} alt='influncer' className='w-72 h-72 p-4 pr-0' />
                        <div className={`flex flex-col ${selectType === 'influncer' ? 'mb-0' : 'mb-6'}`}>
                            <span className={`${selectType === 'influncer' ? 'text-white' : 'text-black'}`}>Influencer Analysis</span>
                            <span className='text-[#7D7D7D] text-sm'>Description</span>
                        </div>
                        {selectType === 'influncer' && (
                            <button onClick={() => dispatch(setCampaignType('influncer'))} className='flex items-center justify-end px-3'>
                                <div className={`w-full flex gap-3 justify-end ${selectType === 'influncer' ? 'text-white' : 'text-black'}`}>
                                    <span className='hidden sm:flex'>Get Started</span>
                                    <svg width='24px' height='24px' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' fill='none'>
                                        <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
                                        <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
                                        <g id='SVGRepo_iconCarrier'>
                                            <path
                                                fill={selectType === 'influncer' ? '#fff' : '#000'}
                                                d='M8.235 4.045a.75.75 0 111.03-1.09l4.5 4.25a.75.75 0 010 1.09l-4.5 4.25a.75.75 0 01-1.03-1.09L11.364 8.5H2.75a.75.75 0 010-1.5h8.614L8.235 4.045z'></path>
                                        </g>
                                    </svg>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            )}
            {campaignType !== '' && (
                <>
                    <div className='flex w-full items-center justify-between pl-8 pr-4 py-3 border-b h-[88px]'>
                        <span className='text-xl font-semibold lg:ml-0 xl:ml-0'>Your campaigns</span>
                        <div className='flex gap-3'>
                            <div className='flex justify-between pl-4 items-center bg-[#F7F7F7] rounded-lg'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' viewBox='0 0 24 24' fill='none'>
                                    <path
                                        d='M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z'
                                        stroke='#7D7D7D'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                                <input
                                    type='text'
                                    name={`input_name}`}
                                    placeholder={'Search for campaigns'}
                                    value={currentSearchText}
                                    onChange={(e: any) => setCurrentSearchText(e.target.value)}
                                    onKeyDown={(e: any) => {
                                        if (e.key === 'Enter') {
                                            setSearchText(currentSearchText);
                                            setIsSearch(true);
                                        }
                                    }}
                                    className='flex outline-none bg-[#F7F7F7] p-3 h-10 text-sm w-full'
                                />
                                <div
                                    onClick={() => {
                                        if (currentSearchText !== '') {
                                            setSearchText(currentSearchText);
                                            setIsSearch(true);
                                        }
                                    }}
                                    className='cursor-pointer pr-4 h-10 py-2'>
                                    <svg width='24px' height='24px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                                        <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                                        <g id='SVGRepo_iconCarrier'>
                                            <path
                                                d='M5 12H19M19 12L13 6M19 12L13 18'
                                                stroke='#7D7D7D'
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'></path>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            {searchText !== '' && isSearch && (
                                <div className='flex justify-between px-1 items-center bg-[#F7F7F7] rounded-lg' onClick={resetSearch}>
                                    <svg width='30px' height='30px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                                        <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                                        <g id='SVGRepo_iconCarrier'>
                                            <path
                                                d='M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z'
                                                fill='#0F0F0F'></path>
                                        </g>
                                    </svg>
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    setMode('add');
                                    setOpenCampaingModal(true);
                                }}
                                className='bg-black flex items-center py-3 rounded-xl px-6 text-white text-sm gap-2'>
                                <svg
                                    width='20'
                                    height='20'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='stroke-2 stroke-black'>
                                    <path
                                        d='M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z'
                                        fill='white'
                                    />
                                </svg>
                                <span className='hidden sm:flex'>Create Campaigns</span>
                            </button>
                        </div>
                    </div>
                    <div className='flex px-8 py-4 w-full h-full flex-col overflow-y-auto'>
                        {searchText !== '' && isSearch && <div className='flex py-3 uppercase text-[#7D7D7D] text-sm'>Showing results for {searchText}</div>}
                        {isLoading ? (
                            <div className='flex items-center justify-center w-full h-[500px] my-6 mx-auto'>
                                <div className='flex items-center justify-center w-32 h-32'>
                                    <div className='border-t-transparent border-solid animate-spin rounded-full border-black border-8 w-full h-full'></div>
                                </div>
                            </div>
                        ) : shouldShowNoCampaign ? (
                            <>
                                {activeCampaign && activeCampaign?.length > 0 && (
                                    <div className='flex flex-col w-full mb-10'>
                                        <div className='flex w-full justify-between mb-5'>
                                            <span className='font-semibold text-xl text-opacity-80'>Active campaigns</span>
                                            <Link href={`/active-campaign`} className='text-[#676767] cursor-pointer text-base font-semibold'>
                                                See More
                                            </Link>
                                        </div>
                                        {activeCampaign?.length > 0 ? (
                                            <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4'>
                                                {activeCampaign?.map((data, index) => (
                                                    <CampaignCard
                                                        key={index}
                                                        campaign={data}
                                                        setMode={editCampaign}
                                                        status='active-campaign'
                                                        color={'#F5F8FF'}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className='flex flex-col w-full'>
                                                <div className='flex h-48 justify-center items-center w-full text-[#676767]'>Campaign not Found.</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {sharedCampaignData && sharedCampaignData?.length > 0 && (
                                    <div className='flex flex-col w-full mb-10'>
                                        <div className='flex w-full justify-between mb-5'>
                                            <span className='capitalize font-semibold text-xl text-opacity-80'>
                                                {user.role !== 'admin' ? 'Shared Campaigns' : 'Created by other members'}
                                            </span>
                                            <Link href={'/shared-campaign'} className='text-[#676767] cursor-pointer text-base font-semibold'>
                                                See More
                                            </Link>
                                        </div>
                                        {sharedCampaignData?.length > 0 ? (
                                            <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4'>
                                                {sharedCampaignData?.map((data, index) => (
                                                    <CampaignCard
                                                        key={index}
                                                        campaign={data}
                                                        setMode={editCampaign}
                                                        status='active-campaign'
                                                        color={'#F5F8FF'}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className='flex flex-col w-full'>
                                                <div className='flex h-48 justify-center items-center w-full text-[#676767]'>Campaign not Found.</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {archivedCampaignData && archivedCampaignData?.length > 0 && (
                                    <div className='flex flex-col w-full'>
                                        <div className='flex w-full justify-between mb-5'>
                                            <span className='capitalize font-semibold text-xl text-opacity-80'>Archived Campaign</span>

                                            <Link href={'/archived-campaign'} className='text-[#676767] cursor-pointer text-base font-semibold'>
                                                See More
                                            </Link>
                                        </div>
                                        {archivedCampaignData?.length > 0 ? (
                                            <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4'>
                                                {archivedCampaignData?.map((data, index) => (
                                                    <CampaignCard
                                                        key={index}
                                                        campaign={data}
                                                        setMode={editCampaign}
                                                        status='shared-campaign'
                                                        color={'#FEF7E6'}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className='flex flex-col w-full'>
                                                <div className='flex h-48 justify-center items-center w-full text-[#676767]'>Campaign not Found.</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className='flex flex-col gap-5 items-center justify-center w-96 h-screen m-auto'>
                                <div className='flex items-center justify-center rounded-lg bg-[#F5F8FF] w-20 h-20'>
                                    <div className='flex p-1 rounded-lg bg-[#F5F8FF]'>
                                        <svg width='40' height='40' viewBox='0 0 24 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                            <path
                                                d='M21.3329 0H2.66673C1.95936 0 1.28125 0.301101 0.781025 0.836812C0.281027 1.37276 0 2.09932 0 2.85721V8.57139C0 9.32904 0.281027 10.0558 0.781025 10.5918C1.28124 11.1275 1.95936 11.4286 2.66673 11.4286H21.3329C22.0403 11.4286 22.7184 11.1275 23.2186 10.5918C23.7186 10.0558 23.9996 9.32904 23.9996 8.57139V2.85721C23.9996 2.09932 23.7186 1.37277 23.2186 0.836812C22.7184 0.301101 22.0403 0 21.3329 0ZM2.66673 8.57139V2.85721H21.3329V8.57139H2.66673Z'
                                                fill='#0151A0'
                                            />
                                            <path
                                                d='M10.6667 12.8594H2.66673C1.95936 12.8594 1.28125 13.1605 0.781025 13.6962C0.281027 14.2321 0 14.9587 0 15.7166V22.8596V22.8594C0 23.6173 0.281027 24.3438 0.781025 24.8798C1.28124 25.4155 1.95936 25.7166 2.66673 25.7166H10.6667C11.3738 25.7166 12.0522 25.4155 12.5522 24.8798C13.0524 24.3438 13.3332 23.6173 13.3332 22.8594V15.717C13.3332 14.9591 13.0524 14.2325 12.5522 13.6966C12.0522 13.1608 11.3738 12.8597 10.6667 12.8597V12.8594ZM2.66673 22.8591V15.7167H10.6667V22.8597L2.66673 22.8591Z'
                                                fill='#0151A0'
                                            />
                                            <path
                                                d='M21.3325 12.8594H17.3325C16.6254 12.8594 15.947 13.1605 15.447 13.6962C14.9468 14.2321 14.666 14.9587 14.666 15.7166V22.8596V22.8594C14.666 23.6173 14.9468 24.3438 15.447 24.8798C15.947 25.4155 16.6254 25.7166 17.3325 25.7166H21.3325C22.0399 25.7166 22.718 25.4155 23.2182 24.8798C23.7182 24.3438 23.9992 23.6173 23.9992 22.8594V15.717C23.9992 14.9591 23.7182 14.2325 23.2182 13.6966C22.718 13.1608 22.0399 12.8597 21.3325 12.8597V12.8594ZM17.3325 22.8591V15.7167H21.3325V22.8597L17.3325 22.8591Z'
                                                fill='#0151A0'
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className='text-3xl font-bold'>New Campaign</div>
                                <div className='text-sm text-[#959595]'>
                                    Seize the moment! Hit that CTA button to launch your campaign and dive into the world of campaign reporting.
                                </div>
                                <button
                                    onClick={() => {
                                        setMode('add');
                                        setOpenCampaingModal(true);
                                    }}
                                    className='bg-black flex items-center py-3 rounded-xl px-6 text-white text-sm gap-2'>
                                    <svg
                                        width='20'
                                        height='20'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='stroke-2 stroke-black'>
                                        <path
                                            d='M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z'
                                            fill='white'
                                        />
                                    </svg>
                                    <span className='flex'>Create a new Campaigns</span>
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
