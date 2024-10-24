'use client';
import Dropdown from '@/components/global-components/Dropdown';
import {
    ArrowDownAZIcon,
    ArrowDownZAIcon,
    ArrowUpDownIcon,
    CalendarCheck2Icon,
    EyeIcon,
    HeartIcon,
    InfoIcon,
    Instagram,
    MessageCircleIcon,
    Repeat2Icon,
    SlidersHorizontalIcon,
} from 'lucide-react';
import TwitterIcon from '../../../icons/TwitterIcon';
import InstagramIcon from '../../../icons/InstagramIcon';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { AvailableFilters } from '@/interfaces/filter';
import CustomAnalyticsModal from '@/components/modals/CustomAnalyticsModal';
import PostNetworkService from '@/services/post.service';
import { enqueueSnackbar } from 'notistack';

interface FilterAndSortingProps {
    meta: any;
    shouldShowSort: boolean;
    query: any;
    filters: any;
    selectFilter: any;
    filtersOptions: AvailableFilters;
    isFilter: any;
    setIsFilter: any;
    refreshCampData: any;
    isPublic: boolean;
}

export default function FilterAndSorting(props: FilterAndSortingProps) {
    const { meta, shouldShowSort, query, filters, selectFilter, filtersOptions, isFilter, setIsFilter, refreshCampData, isPublic } = props;
    const sortBy = query.sortBy;
    const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
    const [showCustomAnalyticsModal, setshowCustomAnalyticsModal] = useState(false);

    const openCloseCustomAnalyticsModal = () => {
        setshowCustomAnalyticsModal(!showCustomAnalyticsModal);
    };

    const updateCustomAnalytics = (analytics: any) => {
        const analysisStatDtos = analytics.map((item: any) => {
            return { ...item, statsType: item.statsType.toUpperCase() };
        });
        const params = {
            campaignId: meta.campaignDto.id,
            analysisStatDtos: analysisStatDtos,
        };
        PostNetworkService.instance.updateCustomAnalytics(meta.campaignDto.id, params).then((res) => {
            enqueueSnackbar('Custom analytics upadated successfully', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            openCloseCustomAnalyticsModal();
            refreshCampData();
        });
    };

    const resetCustomAnalytics = () => {
        const analysisStatDtos = meta.analytics.map((item: any) => {
            return { ...item, customEstimatedValue: null, hideInPublicView: true, statsType: item.statsType.toUpperCase() };
        });
        const params = {
            campaignId: meta.campaignDto.id,
            analysisStatDtos: analysisStatDtos,
        };
        PostNetworkService.instance.updateCustomAnalytics(meta.campaignDto.id, params).then((res) => {
            enqueueSnackbar('Custom analytics upadated successfully', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            openCloseCustomAnalyticsModal();
            refreshCampData();
        });
    };

    const setOpenFilter = (open: boolean) => {
        setIsFilter(open);
    };

    const setCampFilters = (filters: { sortBy: string; sortDirection: string }) => {
        const url = new URL(window.location.href);
        url.searchParams.set('sortBy', filters.sortBy);
        url.searchParams.set('sortDirection', filters.sortDirection);
        window.location.href = url.href;
    };

    const changePlatform = (platform: string) => {
        selectFilter(true, 'platform', platform);
    };

    useEffect(() => {
        if (filters) {
            const index = Object.keys(filters)?.filter((item: any) => filters[item].length > 0);
            if (index.length > 0 && !isSmallDevice) {
                setIsFilter(true);
            }
        }
    }, []);

    const isInstagram = filters && filters['platform']?.includes('instagram');
    const sortByOptions = [
        {
            id: 'likes',
            title: 'Likes',
            action: () => setCampFilters({ sortBy: 'likes', sortDirection: query.sortDirection }),
            icon: <HeartIcon color={'#8b8b8b'} size={20} />,
        },
        {
            id: 'views',
            title: 'Views',
            action: () => setCampFilters({ sortBy: 'views', sortDirection: query.sortDirection }),
            icon: <EyeIcon color={'#8b8b8b'} size={20} />,
        },
        {
            id: 'comments',
            title: 'Comments',
            action: () => setCampFilters({ sortBy: 'comments', sortDirection: query.sortDirection }),
            icon: <MessageCircleIcon color={'#8b8b8b'} size={20} />,
        },
        {
            id: 'reposts',
            title: isInstagram ? 'Video Shares' : 'Reposts',
            action: () => setCampFilters({ sortBy: 'reposts', sortDirection: query.sortDirection }),
            icon: <Repeat2Icon color={'#8b8b8b'} size={20} />,
        },
        {
            id: 'postedAt',
            title: 'Posted Time',
            action: () => setCampFilters({ sortBy: 'postedAt', sortDirection: query.sortDirection }),
            icon: <CalendarCheck2Icon color={'#8b8b8b'} size={20} />,
        },
    ];

    const sorted = sortByOptions.find((item) => item.id === sortBy);

    return (
        <div className='flex flex-col sm:flex-row items-center justify-between gap-3 text-[#8b8b8b] sm:text-center md:text-left text-sm sm:text-sm mb-1'>
            <div className='flex gap-3'>
                <div className='flex gap-1 sm:gap-3'>
                    <div
                        onClick={() => changePlatform('all')}
                        className={`flex gap-2 items-center p-3 cursor-pointer rounded-md h-9 ${
                            filters && filters['platform']?.length === 0 ? 'text-white bg-black' : 'text-black'
                        }`}>
                        All
                    </div>
                    {filtersOptions && filtersOptions['platform']?.includes('instagram') && (
                        <div
                            onClick={() => changePlatform('instagram')}
                            className={`flex gap-2 items-center p-3 cursor-pointer rounded-md h-9 ${
                                filters && filters['platform']?.includes('instagram') ? 'text-white instagram' : 'text-black'
                            }`}>
                            {filters && filters['platform']?.includes('instagram') ? (
                                <Instagram color={'#fff'} size={20} />
                            ) : (
                                <InstagramIcon color={'#fff'} size={20} />
                            )}
                            <span>Instagram</span>
                        </div>
                    )}
                    {filtersOptions && filtersOptions['platform']?.includes('twitter') && (
                        <div
                            onClick={() => changePlatform('twitter')}
                            className={`flex gap-2 items-center p-3 cursor-pointer rounded-md h-9 ${
                                filters && filters['platform']?.includes('twitter') ? 'text-white bg-[#1257a0]' : 'text-black'
                            }`}>
                            <TwitterIcon color={filters && filters['platform']?.includes('twitter') ? '#ffffff' : '#1257a0'} size={20} />
                            <span>Twitter</span>
                        </div>
                    )}
                    {!isPublic && (
                        <span className='flex items-center justify-end text-sm gap-2'>
                            <span
                                className={`flex rounded-lg py-1 px-3 items-center gap-2 text-sm cursor-pointer text-[#8b8b8b] underline italic`}
                                onClick={() => setshowCustomAnalyticsModal(true)}>
                                <span className='sm:flex hidden gap-1 items-center' title='Customised your public view with custom estimated stats.'>
                                    <InfoIcon size={16} />
                                    Update estimated analytics
                                </span>
                                <span className='flex sm:hidden'>Analytics</span>
                            </span>
                        </span>
                    )}
                </div>
            </div>
            {meta?.total > 0 && (
                <span className='flex gap-3 justify-center items-center'>
                    {meta?.filterValueResp && Object.keys(meta?.filterValueResp).length > 0 && (
                        <span className='flex items-center justify-end text-sm gap-2 h-12'>
                            <span
                                className={`flex items-center gap-2 text-base font-semibold cursor-pointer ${isFilter ? 'text-black' : 'text-[#8b8b8b]'}`}
                                onClick={() => setOpenFilter(!isFilter)}>
                                <SlidersHorizontalIcon color={isFilter ? '#000' : '#8b8b8b'} size={20} />
                                Filter by
                            </span>
                        </span>
                    )}
                    {shouldShowSort && (
                        <>
                            <Dropdown
                                width={'w-40'}
                                position='down'
                                options={sortByOptions}
                                header={
                                    <div className='flex h-12 w-auto items-center justify-center gap-2 rounded-lg cursor-pointer text-sm text-[#9A9AB0] font-semibold'>
                                        <ArrowUpDownIcon color={'#8b8b8b'} size={20} />
                                        <span className='capitalize text-[#8b8b8b]'>Sort By:</span>
                                        <span
                                            className='flex items-center gap-2 w-auto min-w-120 border border-gray-300 text-[#8b8b8b] rounded-md py-1 px-3 h-9'
                                            onClick={() => document.getElementById('date-dropdown')?.classList.toggle('hidden')}>
                                            {sorted?.icon}
                                            <span>{sorted?.title}</span>
                                            <svg
                                                className='-mr-1 h-5 w-5'
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 20 20'
                                                fill='currentColor'
                                                aria-hidden='true'>
                                                <path
                                                    fillRule='evenodd'
                                                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                        </span>
                                        <span
                                            title={query.sortDirection === 'ASC' ? 'Sort Descending' : 'Sort Ascending'}
                                            className='flex items-center gap-2 w-auto min-w-120 border border-gray-300 text-[#000] rounded-md py-1 px-3 h-9'
                                            onClick={() =>
                                                setCampFilters({ sortBy: query.sortBy, sortDirection: query.sortDirection === 'ASC' ? 'DESC' : 'ASC' })
                                            }>
                                            {query.sortDirection === 'ASC' ? (
                                                <ArrowDownAZIcon color={'#8b8b8b'} size={20} />
                                            ) : (
                                                <ArrowDownZAIcon color={'#8b8b8b'} size={20} />
                                            )}
                                        </span>
                                    </div>
                                }
                            />
                        </>
                    )}
                </span>
            )}
            {showCustomAnalyticsModal && (
                <CustomAnalyticsModal
                    analytics={meta.analytics}
                    openCloseModal={openCloseCustomAnalyticsModal}
                    resetCustomAnalytics={resetCustomAnalytics}
                    updateCustomAnalytics={updateCustomAnalytics}
                />
            )}
        </div>
    );
}
