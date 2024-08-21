import React from 'react';
import { useEffect, useState } from 'react';
import { TwitterEmbed, InstagramEmbed, YouTubeEmbed } from 'react-social-media-embed';
import { v4 as uuidv4 } from 'uuid';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import SheetNetworkService from '@/services/sheet.service';
import { enqueueSnackbar } from 'notistack';
import dayjs from 'dayjs';
import Image from 'next/image';
import UpdateAnalyticsModal from '../modals/UpdateAnalyticsModal';
import { PlusCircleIcon, SquareArrowOutDownRightIcon, SquareArrowOutUpRightIcon, Trash2Icon, UploadIcon } from 'lucide-react';

export function fileToBase64(file: any) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}

export const calculateSummary = (count: number) => {
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

interface TweetProps {
    tweetID: string;
}

export function Tweet({ tweetID }: TweetProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if ((window as any).twttr) {
            (window as any).twttr.widgets
                .createTweet(tweetID, document.getElementById(tweetID), {
                    align: 'center',
                    conversation: 'none',
                    dnt: true,
                })
                .then(() => setIsLoading(false));
        }
    }, [tweetID]);

    return (
        <div className='w-full animate-fadeIn' id={tweetID}>
            {isLoading && <p className='text-sm'>Loading</p>}
        </div>
    );
}

export default function SocialCard({ item, isPublic, index }: { item: any; isPublic: boolean; index: number }) {
    const postedAt = item?.postedAt?.$date?.$numberLong;
    const link = item.socialLink;
    const postType = item.postType;
    const privateUrls = item?.privateUrls;
    const [values, setValues] = useState<any>([]);
    const [screenshots, setScreenShots] = useState<any>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [campFilters, setCampFilters] = useState<any>({ isGenerating: false });
    const [showAnalyticsModal, setshowAnalyticsModal] = useState(false);

    const openCloseAnalyticsModal = () => {
        setshowAnalyticsModal(!showAnalyticsModal);
    };

    const onImageChange = async (e: any) => {
        if (e.target.files && e.target.files[0]) {
            const value = [...values];
            const screen = [...screenshots];
            for (let i = 0; i < e.target.files.length; i++) {
                const fileBase64: any = await fileToBase64(e.target.files[i]);
                value.push(fileBase64.split(',')[1]);
                screen.push(e.target.files[i]);
            }
            setValues(value);
            setScreenShots(screen);
        }
    };

    const deleteScreenshots = async (name: string) => {
        const value: any = [];
        const filtered = screenshots.filter((item: any) => item.name !== name);
        for (let i = 0; i < filtered.length; i++) {
            const fileBase64: any = await fileToBase64(filtered[i]);
            value.push(fileBase64.split(',')[1]);
        }
        setValues(value);
        setScreenShots([...filtered]);
    };

    const uploadScreenShots = (id: any) => {
        setIsUploading(true);
        if (values.length > 0) {
            SheetNetworkService.instance
                .addScreenShotToReport({
                    id: id,
                    image: values,
                })
                .then((res) => {
                    setIsUploading(false);
                    setCampFilters({ ...campFilters, isGenerating: true });
                    enqueueSnackbar('Screenshots uploaded successfully', { variant: 'success' });
                })
                .catch((err) => {
                    setIsUploading(false);
                    enqueueSnackbar(err.response.data, { variant: 'error' });
                });
        }
    };

    let type = '',
        username = '';
    if (link.includes('twitter') || link.includes('x.com')) {
        type = 'twitter';
        username = link.split('/')[3];
    } else if (link.includes('youtube')) {
        type = 'youtube';
        username = link.split('/')[3];
    } else if (link.includes('instagram')) {
        type = 'instagram';
        if (link.includes('reel')) {
            username = link.split('/')[5];
        } else {
            username = link.split('/')[4];
        }
    }

    const posted = new Date(parseInt(postedAt));
    return (
        <div className='w-full mt-4'>
            <div className='flex bg-[#FAFAFA] rounded-xl p-4 flex-col shadow-inner mx-2 sm:mx-0'>
                <div className='flex items-center justify-between mb-1 w-full'>
                    <div className='flex items-center justify-between gap-2 px-1 text-[#8b8b8b] w-full'>
                        <div className='flex justify-center items-center w-8 h-8 px-3 bg-[#DAE4FF] text-sm text-[#033DD0] py-1 rounded-full'>{index + 1}</div>
                        {postedAt ? parseInt(postedAt) > 0 && <span>Posted on {dayjs(posted).format('D MMM, YYYY')}</span> : <span>Post Summary</span>}
                        <div className='flex gap-3'>
                            <a target='_blank' href={link} className='flex justify-center items-center cursor-pointer w-8 h-8 bg-gray-300 rounded-lg truncate'>
                                <SquareArrowOutUpRightIcon color='#8b8b8b' size={22} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className='flex w-full mb-1'>
                    <div className='grid grid-cols-3 rounded-2xl w-full'>
                        {Object.keys(item.analytics)
                            ?.filter(
                                (item) =>
                                    !item.toLowerCase().includes('plays') &&
                                    !item.toLowerCase().includes('deletedlink') &&
                                    !item.toLowerCase().includes('islinkdeleted')
                            )
                            .map((data: any, index) => (
                                <div
                                    key={uuidv4()}
                                    className={`flex flex-col justify-center items-center border-gray-300 p-2 ${[3, 4, 5].includes(index) ? 'border-t' : ''} ${[1, 2, 4, 5].includes(index) ? 'border-l' : ''}`}>
                                    <span className='text-[#000] text-sm font-semibold'>{calculateSummary(item.analytics[data])}</span>
                                    <span className='capitalize text-[#8b8b8b] text-sm drop-shadow-lg'>{data}</span>
                                </div>
                            ))}
                    </div>
                </div>
                {type === 'instagram' && postType !== 'public' ? (
                    !privateUrls && !isPublic ? (
                        <div className='flex flex-col gap-3 mb-4 px-3'>
                            <span className='text-sm text-[#8b8b8b]'>
                                Due to privacy setting of this post, we're unable to display this content directly. Kindly share a screenshot as a subtitle.
                            </span>
                            <input multiple type='file' id={username + 'upload'} accept='image/*' onChange={onImageChange} className={'hidden'} />
                            <div className='flex justify-between gap-4'>
                                <label
                                    htmlFor={username + 'upload'}
                                    className='w-[180px] flex items-center border border-[#cdcdcd] py-2 px-4 rounded-lg space-x-2'>
                                    <PlusCircleIcon color='#000' size={22} />
                                    <span className='text-sm'>Add screenshots</span>
                                </label>
                                <button className='w-[150px] border p-2 rounded-lg border-[#cdcdcd] text-sm' onClick={openCloseAnalyticsModal}>
                                    <span className='cursor-pointer'></span>
                                    <span>Update Analytics</span>
                                </button>
                            </div>
                            {screenshots?.length > 0 && (
                                <div className='flex flex-col gap-2'>
                                    {screenshots?.map((obj: any, i: number) => (
                                        <div key={uuidv4()} className='flex justify-between items-center border rounded-sm p-2'>
                                            <div className='flex items-center gap-2'>
                                                <Image src={URL.createObjectURL(obj)} alt={i.toString()} width={100} height={100} className='w-12 h-12' />
                                                <span className='text-[#0c8ce9] text-sm'>{obj?.name}</span>
                                            </div>
                                            <Trash2Icon color='#8b8b8b' size={22} onClick={() => deleteScreenshots(obj?.name)} />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {screenshots?.length > 0 && (
                                <div className='flex justify-center'>
                                    <button
                                        disabled={isUploading}
                                        onClick={() => uploadScreenShots(item?.id)}
                                        className='flex items-center border py-2 px-4 bg-black rounded-lg space-x-2 text-white disabled:text-[#898989]'>
                                        <UploadIcon color='#fff' size={18} />
                                        <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='flex justify-center items-center font-semibold gap-3 mb-4 px-3' id='crausel'>
                            {privateUrls?.length > 0 ? (
                                <Carousel className='h-[26rem]' showArrows={true} emulateTouch={true} infiniteLoop={true} showStatus={true}>
                                    {privateUrls?.map((obj: any, i: number) => (
                                        <Image alt={i.toString()} width={150} height={200} className=' object-contain' src={obj} key={uuidv4()} />
                                    ))}
                                </Carousel>
                            ) : (
                                <span className='text-center'>Manual post screenshot not uploaded for private/story post or so.</span>
                            )}
                        </div>
                    )
                ) : (
                    <div className='flex w-full' id='social-links'>
                        {type === 'instagram' && (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <InstagramEmbed url={link} width={'100%'} />
                            </div>
                        )}
                        {type === 'twitter' && (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <TwitterEmbed url={link} width={'100%'} />
                            </div>
                        )}
                        {type === 'youtube' && (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <YouTubeEmbed url={link} width={'100%'} height={275} />
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showAnalyticsModal && <UpdateAnalyticsModal postId={item.id} currentAnalytics={item.analytics} openCloseModal={openCloseAnalyticsModal} />}
        </div>
    );
}
