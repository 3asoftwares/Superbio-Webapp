import React, { useState } from 'react';
import SheetNetworkService from '@/services/sheet.service';
import { cookies } from 'next/headers';
import { Params, SearchParams } from './layout';
import { v4 as uuidv4 } from 'uuid';
import { colors, icons } from './icons-colors';
import Link from 'next/link';
import FilterHandler from './FilterHandler';
import Reporting from './Reporting';
import DownloadHandler from './DownloadHandler';
import CampaignReportingFilter from './filter';
import FilterUi from './FilterUi';
import FilterPlatform from './FilterPlatform';

interface ISummary {
    totCount: number;
    count: number;
    icon: JSX.Element;
    color: string;
    title: string;
    basedOn: number | JSX.Element;
}

export default async function CampaignReporting({ searchParams, params }: { searchParams: SearchParams; params: Params }) {
    const sort = searchParams.sort ? searchParams.sort : 'analytics.likes';
    const order = searchParams.order ? parseInt(searchParams.order) : -1;
    const filter = searchParams.filter ? searchParams.filter : '';
    const value = searchParams.value ? searchParams.value : '';
    const campaignName = searchParams.campaignName ? searchParams.campaignName : '';
    
    let query: { [key: string]: string | number } = {
        page: 1,
        limit: 6,
        sortBy: sort || 'analytics.likes',
        sortOrder: order || -1,
    };
    if (filter && value) {
        query = {
            ...query,
            filterKeys: filter,
            filterValues: value,
        };
    }

    const calculateSummary = (count: number) => {
        let calSum = 0 as any;
        if (count !== undefined && count !== null && !isNaN(count)) {
            calSum = (count / 1000000).toFixed(1) + 'M';
            if (count > 1000 && count < 1000000) {
                calSum = (count / 1000).toFixed(1) + 'K';
            } else if (count < 1000) {
                calSum = count;
            }
        }
        return calSum;
    };

  const nextCookies = cookies();
  const token = nextCookies.get("token")?.value;
  let res = await SheetNetworkService.instance.getCampaignData(
    params.campaignId,
    query,
    token
  );

    const filters = await SheetNetworkService.instance.getSheetFilters(params.campaignId, token);
    const filterHandler = new CampaignReportingFilter(filters);
    const filterOptn = filterHandler.getAvailableFilters();

    let summary: ISummary[] = [];
    let shouldRefresh = false;

    if (res.meta.analytics) {
        let keys: string[] = ['views', 'likes', 'comments'];
        if (searchParams.isPublic) {
            keys = ['Posts', 'Estimated Reach'];
        } else {
            if (filterOptn.platform.includes('twitter')) {
                keys = ['views', 'likes', 'comments', 'reposts', 'quotes', 'bookmarks'];
            }
        }
        let result: (ISummary | null)[] = [];
        if (searchParams.isPublic) {
            result.push({
                totCount: res.meta.total,
                count: res.meta.total,
                icon: icons['Posts'],
                color: colors['Posts'],
                title: 'Posts',
                basedOn: (
                    <>
                        <span>{res.meta.total}</span>/<span className='text-sm'>{res.meta.total}</span>
                    </>
                ),
            });
            result.push({
                totCount: Number(res.meta.analytics.likes),
                count: calculateSummary(Number(res.meta.analytics.views) + Number(res.meta.analytics.likes) * 10),
                icon: icons['Estimated Reach'],
                color: colors['Estimated Reach'],
                title: 'Estimated Reach',
                basedOn: (
                    <>
                        <span>{res.meta.basedOnPosts.likes}</span>/<span className='text-sm'>{res.meta.total}</span>
                    </>
                ),
            });
        } else {
            result = keys.map((key) => {
                const { analytics, basedOnPosts } = res.meta;
                if (!(analytics as any)[key] && (analytics as any)[key] !== 0) return null;
                return {
                    totCount: (analytics as any)[key],
                    count: calculateSummary((analytics as any)[key]),
                    icon: icons[key],
                    color: colors[key],
                    title: key,
                    basedOn: (basedOnPosts as any)[key],
                };
            });
        }

        summary = result.filter((item) => item !== null) as ISummary[];
        if (summary.length === 0 || summary.every((item) => item.totCount === 0)) {
            shouldRefresh = true;
        }
        if (shouldRefresh) {
            delete query.sortBy;
            delete query.sortOrder;
            res = await SheetNetworkService.instance.getCampaignData(params.campaignId, query, token);
        }
    }

    return (
        <div className='flex'>
            <FilterUi filtersDefault={filters} filterOptn={filterOptn} />
            <div className={`flex flex-col sm:px-6 md:px-6 mx-3 md:mx-0 sm:mx-0 w-full`} id='camp-top'>
                {!res.data ||
                    (res.data.length === 0 && (
                        <div className='flex flex-col gap-5 items-center justify-center w-96 h-[500px] m-auto'>
                            <div className='flex items-center justify-center rounded-lg bg-[#F5F8FF] w-20 h-20'>
                                <div className='flex p-1 rounded-lg bg-[#F5F8FF]'>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 24 24' id='link'>
                                        <path
                                            fill='#0151A0'
                                            d='M8,12a1,1,0,0,0,1,1h6a1,1,0,0,0,0-2H9A1,1,0,0,0,8,12Zm2,3H7A3,3,0,0,1,7,9h3a1,1,0,0,0,0-2H7A5,5,0,0,0,7,17h3a1,1,0,0,0,0-2Zm7-8H14a1,1,0,0,0,0,2h3a3,3,0,0,1,0,6H14a1,1,0,0,0,0,2h3A5,5,0,0,0,17,7Z'></path>
                                    </svg>
                                </div>
                            </div>
                            <div className='text-3xl font-bold'>Add links for reporting</div>
                            <div className='text-sm text-[#959595]'>
                                Empower your reporting capabilities with a quick link addition for seamless campaign insights. Elevate your analytics game in
                                just one click!
                            </div>
                            <Link
                                href={`/${params.campaignType}/create-reporting/${params.campaignId}?campaignName=${campaignName}`}
                                className='bg-black flex items-center py-2 rounded-xl pl-4 pr-5 text-white text-sm gap-2'>
                                <svg
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='stroke-2 stroke-black'>
                                    <path
                                        d='M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z'
                                        fill='white'
                                    />
                                </svg>
                                <span className='flex'>Add Links</span>
                            </Link>
                        </div>
                    ))}

                {res.data && res.data.length > 0 && (
                    <DownloadHandler
                        meta={res.meta}
                        query={query}
                        isPublic={searchParams.isPublic}
                        columns={res.data}
                        params={params}
                        campaignName={campaignName}
                        summary={summary}
                    />
                )}
                {res.data && res.data.length > 0 && (
                    <div className='flex items-center justify-between gap-3 text-[#959595] sm:text-center md:text-left text-sm sm:text-sm mt-4'>
                        <div className='flex gap-3'>
                            {res.meta?.total && (
                                <div className='flex flex-col text-sm w-20'>
                                    {res.meta && res.meta?.total > 0 && (
                                        <>
                                            <span className='text-black font-semibold'>Total</span>
                                            <span className='text-[#959595]'>{res.meta?.total} posts</span>
                                        </>
                                    )}
                                </div>
                            )}
                            {res.meta?.stories && (
                                <div className='flex flex-col text-sm w-20'>
                                    {res.meta && res.meta?.total > 0 && (
                                        <>
                                            <span className='text-black font-semibold'>Stories</span>
                                            <span className='text-[#959595]'>{res.meta?.stories} posts</span>
                                        </>
                                    )}
                                </div>
                            )}
                            {res.meta?.private && (
                                <div className='flex flex-col text-sm w-20'>
                                    {res.meta && res.meta?.total > 0 && (
                                        <>
                                            <span className='text-black font-semibold'>Private</span>
                                            <span className='text-[#959595]'>{res.meta?.private} posts</span>
                                        </>
                                    )}
                                </div>
                            )}
                            <FilterPlatform filtersDefault={filters} filterOptn={filterOptn} />
                        </div>
                        <FilterHandler total={res.meta.total} shouldShowSort={!shouldRefresh} query={query} />
                    </div>
                )}

                {res.meta && res.data.length > 0 && (
                    <div className='flex'>
                        <div className='flex w-full flex-col '>
                            <div
                                className={`mt-3 sm:mt-6 grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-${
                                    !token ? '3' : '6'
                                } w-full gap-4`}>
                                {summary.length > 0 &&
                                    summary.filter((el)=>el.count !== 0).map((item) => (
                                        <div
                                            key={uuidv4()}
                                            className={`flex justify-start flex-col sm:justify-center sm:py-4 ${item.color} w-full px-4 py-4 sm:px-4 mx-auto sm:mx-0 rounded-xl bg-opacity-20`}>
                                            <div className='flex gap-2 justify-between sm:w-auto'>
                                                <div className={`flex items-center justify-center ${item.color} bg-opacity-60 w-10 h-10 mr-3 rounded-full`}>
                                                    {item.icon}
                                                </div>
                                                <div className='flex gap-2'>
                                                    <p className='text-2xl text-black-100'>{item?.count}</p>
                                                </div>
                                            </div>
                                            <div className='flex mr-3 h-9 items-end justify-between w-full'>
                                                <p className='text-xs mt-1 text-black-500'>
                                                    <span className='capitalize'>{item.title}</span> from {item.basedOn} posts
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {res.data && res.data.length > 0 && (
                    <Reporting
                        campaignId={params.campaignId}
                        initialColumns={res.data}
                        meta={query}
                        isPublic={searchParams.isPublic ? searchParams.isPublic : false}
                        total={res.meta.total}
                    />
                )}
            </div>
        </div>
    );
}
