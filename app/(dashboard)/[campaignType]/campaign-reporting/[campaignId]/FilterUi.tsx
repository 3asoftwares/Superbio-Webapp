'use client';
import React from 'react';
import CampaignReportingFilter, { FILTERS } from './filter';
import { Accordion, AccordionHeader, AccordionBody } from '@material-tailwind/react';
import { Icon } from './icons-colors';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/context';
import { setFitlersState } from '@/context/campaign';
import { v4 as uuidv4 } from 'uuid';

interface FilterUiProps {
    filtersDefault: FilterKeys[];
    filterOptn: AvailableFilters;
}

export default function FilterUi(props: FilterUiProps) {
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const { filtersDefault, filterOptn } = props;
    const [open, setOpen] = React.useState<number>(0);
    const [filters, setFilters] = React.useState<AvailableFilters | any>({});
    const [filtersOptions, setFiltersOptions] = React.useState<AvailableFilters>(filterOptn);

    React.useEffect(() => {
        dispatch(setFitlersState(props.filtersDefault));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const filter = searchParams.get('filter');
        const value = searchParams.get('value');
        if (filter && value) {
            if (filter !== 'platform') {
                document.getElementById('filterPanel')?.classList.remove('hidden');
            }
            let filteNames = filter.split('|');
            let filteValues = value.split('|');
            let filterObj: any = {};
            for (let i = 0; i < filteNames.length; i++) {
                if (filteNames[i] === 'platform' || filteNames[i] === 'postType') {
                    filterObj[filteNames[i]] = [filteValues[i]];
                } else {
                    filterObj[filteNames[i]] = filteValues[i].split('_');
                }
            }
            setFilters(filterObj);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        let filter = searchParams.get('filter');
        let value = searchParams.get('value');

        const filterHandler = new CampaignReportingFilter(filtersDefault);
        let filterOptions = filterHandler.getAvailableFilters();
        let filterKeys = Object.keys(filters);
        if (filterKeys.length > 0 && filter !== null && value !== null) {
            filterOptions = filterHandler.setSelectedFilters(filter?.split('|'), value?.split('|'));
            setFiltersOptions(filterOptions);
            return;
        }
        setFiltersOptions(filterOptions);
    }, [filters]);

    const selectFilter = (checked: boolean, key: string, value: string) => {
        let filter = { ...filters };
        if (filter[key] === undefined) {
            filter[key] = [];
        }
        if (value !== 'all') {
            if (checked) {
                if (key === 'platform' || key === 'postType') {
                    filter[key] = [value];
                } else {
                    if (filter[key].indexOf(value) === -1) {
                        filter[key].push(value);
                    }
                }
            } else {
                if (key === 'platform' || key === 'postType') {
                    delete filter[key];
                } else {
                    filter[key] = filter[key].filter((item: any) => item !== value);
                    if (filter[key].length === 0) {
                        delete filter[key];
                    }
                }
            }
        } else {
            filter[key] = [];
        }

        setFilters({ ...filter });
        for (var key in filter) {
            if (filter[key].length === 0) delete filter[key];
        }
        const filterKeys = Object.keys(filter).join('|');
        const filterValues = Object.values(filter).join('|').replaceAll(',', '_');

        const url = new URL(window.location.href);
        if (filterKeys && filterValues) {
            url.searchParams.set('filter', filterKeys);
            url.searchParams.set('value', filterValues);
        } else {
            url.searchParams.delete('filter');
            url.searchParams.delete('value');
        }

        window.location.href = url.href;
    };

    const handleOpen = (value: number) => setOpen(open === value ? 0 : value);
    const toggleFilter = () => {
        const panel = document.getElementById('filterPanel');
        if (panel) {
            panel.classList.toggle('hidden');
        }
    };

    const resetFilters = () => {
        setFilters({});
        const url = new URL(window.location.href);
        const filter = searchParams.get('filter')?.split('|') as string[];
        const filterIndex = filter?.indexOf('platform') as number;
        const value = searchParams.get('value')?.split('|') as string[];
        url.searchParams.delete('filter');
        url.searchParams.delete('value');
        if (filterIndex > -1) {
            url.searchParams.set('filter', filter[filterIndex]);
            url.searchParams.set('value', value[filterIndex]);
        }
        window.location.href = url.href;
    };

    return (
        <div id='filterPanel' className='w-1/5 hidden'>
            <div className='flex w-full min-w-[225px] flex-col border-r border-[#E6E6E6] py-4 px-3'>
                <p className='flex justify-between text-lg font-bold'>
                    <span className='flex gap-2 items-center mb-2'>
                        <svg width='20px' height='20px' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='#000'>
                            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                            <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                            <g id='SVGRepo_iconCarrier'>
                                <title>filter-vertical</title>
                                <g id='Layer_2' data-name='Layer 2'>
                                    <g id='invisible_box' data-name='invisible box'>
                                        <rect width='48' height='48' fill='none'></rect>
                                    </g>
                                    <g id='icons_Q2' data-name='icons Q2'>
                                        <path d='M8,6.2V26.3A6.2,6.2,0,0,0,4,32a6,6,0,0,0,4,5.6v4.2A2.1,2.1,0,0,0,10,44a2.1,2.1,0,0,0,2-2.2V37.6A6,6,0,0,0,16,32a6.2,6.2,0,0,0-4-5.7V6.2A2.1,2.1,0,0,0,10,4,2.1,2.1,0,0,0,8,6.2ZM12,32a2,2,0,1,1-2-2A2,2,0,0,1,12,32Z'></path>{' '}
                                        <path d='M22,6.2v4.1A6.2,6.2,0,0,0,18,16a6,6,0,0,0,4,5.6V41.8a2,2,0,1,0,4,0V21.6A6,6,0,0,0,30,16a6.2,6.2,0,0,0-4-5.7V6.2a2,2,0,1,0-4,0ZM26,16a2,2,0,1,1-2-2A2,2,0,0,1,26,16Z'></path>{' '}
                                        <path d='M36,6.2V23.3A6.2,6.2,0,0,0,32,29a6,6,0,0,0,4,5.6v7.2a2,2,0,1,0,4,0V34.6A6,6,0,0,0,44,29a6.2,6.2,0,0,0-4-5.7V6.2a2,2,0,1,0-4,0ZM40,29a2,2,0,1,1-2-2A2,2,0,0,1,40,29Z'></path>{' '}
                                    </g>
                                </g>
                            </g>
                        </svg>
                        Filters
                    </span>
                    <span className='-mr-1' onClick={() => toggleFilter()}>
                        <svg width='24px' height='24px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                            <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                            <g id='SVGRepo_iconCarrier'>
                                <path
                                    d='M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z'
                                    fill='#0F0F0F'></path>
                            </g>
                        </svg>
                    </span>
                </p>
                {Object.keys(filters).filter((item) => filters[item].length > 0).length > 0 && (
                    <button className='flex w-full justify-end text-black font-semibold' onClick={resetFilters}>
                        Reset all
                    </button>
                )}
                {filtersOptions && (
                    <>
                        {FILTERS.map((item, index) => {
                            let key = item;
                            let value = filtersOptions[key.key];
                            let radioEligible = ['platform', 'postType'].includes(key.key);
                            return (
                                value &&
                                value.length > 0 && (
                                    <Accordion open={open === 5 + index} key={uuidv4()} icon={<Icon id={5 + index} open={open} />}>
                                        <AccordionHeader onClick={() => handleOpen(5 + index)} className='text-md py-2'>
                                            <div className='flex items-center'>
                                                {item.name}{' '}
                                                {filters[key.key] && filters[key.key].length > 0 && (
                                                    <span className='w-2 h-2 ml-2 rounded-full bg-green-500'></span>
                                                )}
                                            </div>
                                        </AccordionHeader>
                                        <AccordionBody className='py-2'>
                                            <ul className='flex flex-col h-auto max-h-52 overflow-y-scroll'>
                                                <li key={'all-phase'} className={`flex items-center gap-3 pl-2 py-2 border-stroke`}>
                                                    <input
                                                        type={radioEligible ? 'radio' : 'checkbox'}
                                                        id={'all-phase'}
                                                        value={'all'}
                                                        className='h-[18px] w-[18px]'
                                                        checked={value?.length === 0 || filters[key.key] ? filters[key.key].length === 0 : true}
                                                        onChange={(e: any) => selectFilter(e?.currentTarget?.checked, key.key, 'all')}
                                                    />
                                                    <label className='capitalize' htmlFor={'all-phase'}>
                                                        All
                                                    </label>
                                                </li>
                                                {value?.map((item) =>
                                                    typeof item === 'string' ? (
                                                        <li key={item} className={`flex items-center gap-3 pl-2 py-2 border-stroke`}>
                                                            <input
                                                                type={radioEligible ? 'radio' : 'checkbox'}
                                                                id={item}
                                                                value={item}
                                                                className='h-[18px] w-[18px]'
                                                                checked={filters[key.key] ? filters[key.key].includes(item) : false}
                                                                onChange={(e: any) => selectFilter(e?.currentTarget?.checked, key.key, item)}
                                                            />
                                                            <label className='capitalize' htmlFor={item}>
                                                                {item}
                                                            </label>
                                                        </li>
                                                    ) : (
                                                        item &&
                                                        item._id && (
                                                            <li key={item._id.$oid} className={`flex items-center gap-3 pl-2 py-2 border-stroke`}>
                                                                <input
                                                                    type='checkbox'
                                                                    id={item._id.$oid}
                                                                    value={item._id.$oid}
                                                                    className='h-[18px] w-[18px]'
                                                                    checked={filters[key.key] ? filters[key.key].includes(item._id.$oid) : false}
                                                                    onChange={(e: any) => selectFilter(e?.currentTarget?.checked, key.key, item._id.$oid)}
                                                                />
                                                                <label className='capitalize' htmlFor={item.name}>
                                                                    {item.name}
                                                                </label>
                                                            </li>
                                                        )
                                                    )
                                                )}
                                            </ul>
                                        </AccordionBody>
                                    </Accordion>
                                )
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
}
