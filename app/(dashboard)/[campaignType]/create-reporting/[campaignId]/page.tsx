'use client';
import React, { useState } from 'react';
import SheetNetworkService from '@/services/sheet.service';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/context';
import { setSheet, setSheetLoading } from '@/context/campaign';
import { enqueueSnackbar } from 'notistack';
import ConfirmSheetUpdateModal from '@/components/Modals/ConfirmSheetUpdateModal';
import { SheetDetails } from './SheetDetails';

const getSheetInfo = () => {
    return { index: 1, open: false, title: '', url: '', sheetName: '', columnName: '', sheets: [], selectedSheet: {} };
};

export default function CreateReporting() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const state = useAppSelector((state) => state?.campaign);
    const router = useRouter();
    const [mode, setMode] = React.useState('view');
    const [selSheetData, setSelSheetData] = React.useState<ISheet[]>([]);
    const [sheetData, setSheetData] = React.useState<any>([]);
    const [initialSheetData, setInitialSheetData] = React.useState<any>([]);
    const [isSheetLoading, setIsSheetLoading] = React.useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState<boolean>(false);
    const [isError, setIsError] = useState(false);

    const openCloseConfirmModal = () => {
        setShowConfirmModal(!showConfirmModal);
    };

    const handleSheet = (item: any, sheetInfo: any) => {
        if (item.columns.length === 0) {
            enqueueSnackbar('No columns found', { variant: 'error' });
            return;
        }
        if (mode !== 'add') {
            setMode(sheetInfo?.sheetName !== item?.sheetName ? 'edit' : 'view');
        }
        sheetData[sheetInfo?.index - 1].sheetName = item?.sheetName;
        sheetData[sheetInfo?.index - 1].selectedSheet = item;
        setSheetData([...sheetData]);
    };

    const handleColumn = (column: string, sheetInfo: any) => {
        if (mode !== 'add') {
            setMode(sheetInfo.columnName !== column ? 'edit' : 'view');
        }
        sheetData[sheetInfo?.index - 1].columnName = column;
        setSheetData([...sheetData]);
    };

    const addUpdateSheet = () => {
        if (mode === 'add') {
            handleSheetSelect();
        } else if (mode === 'edit') {
            openCloseConfirmModal();
        } else if (mode === 'view') {
            router.push(`/${params.campaignType}/campaign-reporting/${params.campaignId}?campaignName=${searchParams.get('campaignName')!.toString()}`);
        }
    };

    const refreshSheet = (item: any) => {
        SheetNetworkService.instance
            .addSheetToCampaign({
                title: item?.title,
                sheetId: item?.selectedSheet!.sheetId!,
                name: item?.sheetName!,
                linkColumn: item?.columnName,
                campaignId: params.campaignId,
                range: 'A1:Z',
                id: item?.id ? item?.id : null,
            })
            .then((res) => {
                enqueueSnackbar('Sheet refeshed successfully', { variant: 'success' });
            });
    };

    const handleSheetSelect = () => {
        let error = false;
        const emptyUrl = sheetData.filter((item: any) => item.url === '');
        const emptyTitle = sheetData.filter((item: any) => item.title === '');
        if (emptyUrl.length > 0 || emptyTitle.length > 0) {
            error = true;
            setIsError(true);
        }
        if (!error) {
            const promises: any = [];
            dispatch(setSheetLoading(true));
            sheetData.forEach((item: any) => {
                const ind = initialSheetData.findIndex((sh: any) => item.index === sh?.index);
                if (ind === -1) {
                    promises.push(
                        SheetNetworkService.instance.addSheetToCampaign({
                            title: item?.title,
                            sheetId: item?.selectedSheet!.sheetId!,
                            name: item?.selectedSheet!.sheetName!,
                            linkColumn: item?.columnName,
                            campaignId: params.campaignId,
                            range: 'A1:Z',
                            id: item?.id ? item?.id : null,
                        })
                    );
                }
            });
            Promise.all(promises)
                .then((res) => {
                    router.push(`/${params.campaignType}/campaign-reporting/${params.campaignId}?campaignName=${searchParams.get('campaignName')!.toString()}`);
                    dispatch(setSheet(res));
                    enqueueSnackbar('Sheet added successfully', { variant: 'success' });
                })
                .finally(() => {
                    dispatch(setSheetLoading(false));
                    router.push(`/${params.campaignType}/campaign-reporting/${params.campaignId}?campaignName=${searchParams.get('campaignName')!.toString()}`);
                });
        }
    };

    const addSheet = () => {
        setMode('add');
        const sheets = sheetData.map((item: any) => {
            return { ...item, open: false };
        });
        sheets.push({ ...getSheetInfo(), open: true, index: sheetData.length + 1 });
        setSheetData([...sheets]);
    };

    const setTitle = (id: number, value: string) => {
        const index = sheetData.findIndex((item: any) => item.index === id);
        sheetData[index].title = value;
        setSheetData([...sheetData]);
    };

    const setUrl = (id: number, value: string) => {
        const index = sheetData.findIndex((item: any) => item.index === id);
        sheetData[index].url = value;
        setSheetData([...sheetData]);
    };

    const fetchSheets = async (data: any) => {
        if (data?.url !== '') {
            dispatch(setSheetLoading(true));
            SheetNetworkService.instance
                .getSheet(data?.url)
                .then((res: any) => {
                    const sheet = res.find((item: any) => item.sheetName === data?.sheetName);
                    data['sheets'] = res;
                    data['selectedSheet'] = sheet;
                    const ind = sheetData.findIndex((item: any) => item.index === data?.index);
                    if (ind === -1) {
                        sheetData.push(data);
                    } else {
                        sheetData[ind] = data;
                    }
                    setSheetData([...sheetData]);
                })
                .finally(() => {
                    dispatch(setSheetLoading(false));
                });
        } else {
            enqueueSnackbar('Please enter google sheet link', { variant: 'error' });
        }
    };

    const deleteSheet = (index: string) => {
        const data = sheetData.filter((item: any) => item?.index !== index);
        setSheetData([...data]);
        setMode('edit');
    };

    React.useEffect(() => {
        if (selSheetData.length > 0) {
            setIsSheetLoading(true);
            const data: any = [];
            const promises: any = [];
            selSheetData.forEach((item, index) => {
                const url = `https://docs.google.com/spreadsheets/d/${item?.sheetId}`;
                promises.push(SheetNetworkService.instance.getSheet(url));
                data.push({
                    ...getSheetInfo(),
                    index: index + 1,
                    open: false,
                    url: url,
                    title: item?.title,
                    sheetName: item?.name,
                    columnName: item?.linkColumn,
                    id: item?._id,
                });
            });
            Promise.all(promises).then((res) => {
                for (let i = 0; i <= res.length - 1; i++) {
                    const sheet = res.find((item: any) => item.sheetName === sheetData[i]?.sheetName);
                    data[i]['sheets'] = res[i];
                    data[i]['selectedSheet'] = sheet[0];
                }
                setSheetData([...data]);
                setIsSheetLoading(false);
                setInitialSheetData([...data]);
                dispatch(setSheetLoading(false));
            });
            setMode('view');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selSheetData]);

    React.useLayoutEffect(() => {
        setSheetData([]);
        setIsSheetLoading(true);
        SheetNetworkService.instance
            .checkSheetExists(params.campaignId)
            .then((res) => {
                if (res.length > 0) {
                    setSelSheetData(res);
                } else {
                    setMode('add');
                    setSheetData([{ ...getSheetInfo(), open: true }]);
                }
            })
            .catch((err) => {
                setMode('add');
            })
            .finally(() => {
                setIsSheetLoading(false);
                dispatch(setSheetLoading(false));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='flex w-full h-full flex-col px-8 py-4 lg:items-start'>
            <div className='flex w-full flex-col'>
                <div className='flex items-center'>
                    <div className='flex flex-col'>
                        <div className='flex p-4 rounded-lg bg-[#F5F8FF]'>
                            <svg width='24' height='24' viewBox='0 0 24 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
                    <div className='flex flex-col pl-3'>
                        <span className='text-2xl font-semibold'>Campaign Reporting</span>
                    </div>
                </div>
                {!isSheetLoading ? (
                    <div className='flex justify-between mb-6'>
                        <div className='w-full flex flex-col gap-4 mt-2'>
                            {sheetData.map((item: any, index: number) => (
                                <>
                                    <div className='flex flex-col gap-3 justify-between items-center w-2/3 border-[1.5px] px-3 py-2 rounded-md'>
                                        <div className='flex items-center justify-between w-full h-7 text-sm font-normal'>
                                            <span
                                                style={{ width: 'calc(100% - 154px)' }}
                                                onClick={() => {
                                                    document.getElementById(item?.title.replaceAll(' ', '_') + index)?.classList.toggle('hidden');
                                                    document.getElementById(item?.title.replaceAll(' ', '_') + index + 1)?.classList.toggle('rotate-180');
                                                }}>
                                                {item?.title ? item?.title : 'Paste Google sheets link'}
                                            </span>{' '}
                                            <span className='flex items-center justify-end w-[154px] gap-2'>
                                                <svg
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth={2}
                                                    stroke='currentColor'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    className={`h-5 w-5 transition-transform`}
                                                    id={item?.title.replaceAll(' ', '_') + index + 1}>
                                                    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                                                </svg>
                                                {sheetData.length > 1 && (
                                                    <div
                                                        className='flex items-center justify-center w-6 h-10 rounded-t-lg'
                                                        onClick={() => deleteSheet(item?.index)}>
                                                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' id='trash' width='24px' height='24px'>
                                                            <g data-name='Layer 2'>
                                                                <path
                                                                    d='M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 16a1 1 0 0 1-2 0v-4a1 1 0 0 1 2 0zm0-11.67c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM16 16a1 1 0 0 1-2 0v-4a1 1 0 0 1 2 0z'
                                                                    data-name='trash-2'></path>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                )}
                                                {item?.index <= selSheetData.length && (
                                                    <div
                                                        onClick={() => {
                                                            refreshSheet(item);
                                                        }}
                                                        className='cursor-pointer text-sm text-[#0151A0]'>
                                                        Refresh sheet
                                                    </div>
                                                )}
                                            </span>
                                        </div>
                                        <div id={item?.title.replaceAll(' ', '_') + index} className='w-full'>
                                            <SheetDetails
                                                mode={mode}
                                                state={state}
                                                sheetInfo={item}
                                                isError={isError}
                                                setUrl={setUrl}
                                                setTitle={setTitle}
                                                handleSheet={handleSheet}
                                                fetchSheets={fetchSheets}
                                                handleColumn={handleColumn}
                                                selSheetData={selSheetData}
                                                sheetLoading={state?.sheetLoading}
                                            />
                                        </div>
                                    </div>
                                </>
                            ))}

                            <div className='flex flex-col mt-6 items-center min-w-[210] w-1/2'>
                                <button
                                    onClick={() => addUpdateSheet()}
                                    className='bg-black flex justify-center items-center py-3 rounded-xl px-6 text-white text-sm'>
                                    <svg width='20' height='20' className='mr-2' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            d='M19.7158 3.36572L2.24081 8.28759C2.09205 8.32826 1.95945 8.4138 1.86106 8.53256C1.76267 8.65131 1.70329 8.79751 1.69099 8.95123C1.67869 9.10496 1.71408 9.25874 1.79233 9.39162C1.87059 9.52451 1.98791 9.63004 2.12831 9.69384L10.1533 13.4907C10.3105 13.5635 10.4368 13.6898 10.5096 13.847L14.3064 21.872C14.3702 22.0124 14.4758 22.1297 14.6087 22.2079C14.7415 22.2862 14.8953 22.3216 15.049 22.3093C15.2028 22.297 15.349 22.2376 15.4677 22.1392C15.5865 22.0408 15.672 21.9082 15.7127 21.7595L20.6346 4.28447C20.6719 4.15695 20.6742 4.02174 20.6412 3.89302C20.6083 3.7643 20.5414 3.64681 20.4474 3.55286C20.3535 3.45891 20.236 3.39197 20.1073 3.35904C19.9785 3.32611 19.8433 3.32842 19.7158 3.36572V3.36572Z'
                                            stroke='white'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                        />
                                        <path d='M10 13.2375L14.2375 9' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                                    </svg>
                                    {mode === 'view' && 'View Report'}
                                    {mode === 'edit' && 'Update Report'}
                                    {mode === 'add' && 'Create Campaign using google sheet'}
                                </button>
                            </div>
                        </div>
                        <button onClick={addSheet} className='flex w-64 h-12 py-3 rounded-xl px-6 text-black font-semibold gap-2'>
                            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z'
                                    fill='#000'
                                />
                            </svg>
                            <span className='flex'>Add New Sheet</span>
                        </button>
                    </div>
                ) : (
                    <div className='flex items-center justify-center w-full h-[420px] my-6 mx-auto'>
                        <div className='flex items-center justify-center w-32 h-32'>
                            <div className='border-t-transparent border-solid animate-spin rounded-full border-black border-8 w-full h-full'></div>
                        </div>
                    </div>
                )}
            </div>
            {showConfirmModal && <ConfirmSheetUpdateModal handleConfirm={handleSheetSelect} openCloseModal={openCloseConfirmModal} />}
        </div>
    );
}
