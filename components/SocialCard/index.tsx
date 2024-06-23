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

interface TweetProps {
    tweetID: string;
}

export default function SocialCard({
    item,
    isPublic,
    index,
}: {
    item: any;
    isPublic: boolean;
    index: number;
}) {
    const postedAt = item?.postedAt?.$date?.$numberLong;
    const link = item.socialLink;
    const postType = item.postType;
    const privateUrls = item?.privateUrls;
    const [values, setValues] = useState<any>([]);
    const [screenshots, setScreenShots] = useState<any>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [campFilters, setCampFilters] = useState<any>({ isGenerating: false });

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
                    _id: id,
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
    if (link.includes('twitter')) {
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
console.log(item)
    return (
        <div className='w-full mt-4'>
            <div className='flex bg-[#FAFAFA] rounded-xl p-4 flex-col '>
                <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2 px-1 text-[#959595]'>
                        <div className='flex justify-center items-center w-9 h-9 px-3 bg-[#DAE4FF] text-sm text-[#033DD0] py-1 rounded-full'>{index + 1}</div>
                        {postedAt && <span>Posted on {dayjs(posted).format('D MMM, YYYY')}</span>}
                    </div>
                    <div className='flex gap-3'>
                        <a target='_blank' href={link} className='flex justify-center items-center cursor-pointer w-9 h-9 bg-gray-300 rounded-lg truncate'>
                            <svg width='24px' height='24px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                                <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                                <g id='SVGRepo_iconCarrier'>
                                    <path
                                        d='M21 9.00001L21 3.00001M21 3.00001H15M21 3.00001L12 12M10 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V14'
                                        stroke='#374151'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'></path>
                                </g>
                            </svg>
                        </a>
                    </div>
                </div>

                <div className='flex gap-3 mb-3'>
                    <div className='flex flex-wrap gap-3'>
                        {Object.keys(item.analytics)?.map((data: any) => (
                            <div key={uuidv4()} className='flex flex-col'>
                                <span className='bg-[#F5F8FF] captilize text-[#0151A0] text-sm px-3 py-1 rounded-2xl'>
                                    {data}: {item.analytics[data]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                {type === 'instagram' && postType !== 'public' ? (
                    !privateUrls && !isPublic ? (
                        <div className='flex flex-col gap-3 mb-4 px-3'>
                            <span className='text-sm text-[#959595]'>
                                Due to privacy setting of this post, we're unable to display this content directly. Kindly share a screenshot as a subtitle.
                            </span>
                            <input multiple type='file' id={username + 'upload'} accept='image/*' onChange={onImageChange} className={'hidden'} />
                            <label
                                htmlFor={username + 'upload'}
                                className='flex items-center w-[172px] border py-2 px-4 rounded-lg space-x-2 disabled:opacity-40'>
                                <svg
                                    width='20'
                                    height='20'
                                    viewBox='0 0 24 24'
                                    fill='#959595'
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='stroke-2 stroke-black'>
                                    <path
                                        d='M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z'
                                        fill='none'
                                    />
                                </svg>
                                <span className='text-sm'>Add screenshots</span>
                            </label>
                            {screenshots?.length > 0 && (
                                <div className='flex flex-col gap-2'>
                                    {screenshots?.map((obj: any, i: number) => (
                                        <div key={uuidv4()} className='flex justify-between items-center border rounded-sm p-2'>
                                            <div className='flex items-center gap-2'>
                                                <img alt={i.toString()} className='w-12 h-12' src={URL.createObjectURL(obj)} />
                                                <span className='text-[#0c8ce9] text-sm'>{obj?.name}</span>
                                            </div>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='24px'
                                                height='24px'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                                onClick={() => deleteScreenshots(obj?.name)}>
                                                <path
                                                    d='M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17'
                                                    stroke='#959595'
                                                    strokeWidth='2'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                />
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {screenshots?.length > 0 && (
                                <div className='flex justify-center'>
                                    <button
                                        disabled={isUploading}
                                        onClick={() => uploadScreenShots(item?._id)}
                                        className='flex items-center border py-2 px-4 bg-black rounded-lg space-x-2 text-white disabled:opacity-40'>
                                        <svg
                                            fill='#fff'
                                            height='14px'
                                            width='16px'
                                            version='1.1'
                                            id='Capa_1'
                                            viewBox='0 0 384.97 384.97'
                                            xmlns='http://www.w3.org/2000/svg'>
                                            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                                            <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                                            <g id='SVGRepo_iconCarrier'>
                                                <g>
                                                    <g id='Upload'>
                                                        <path d='M372.939,264.641c-6.641,0-12.03,5.39-12.03,12.03v84.212H24.061v-84.212c0-6.641-5.39-12.03-12.03-12.03 S0,270.031,0,276.671v96.242c0,6.641,5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03v-96.242 C384.97,270.019,379.58,264.641,372.939,264.641z'></path>{' '}
                                                        <path d='M117.067,103.507l63.46-62.558v235.71c0,6.641,5.438,12.03,12.151,12.03c6.713,0,12.151-5.39,12.151-12.03V40.95 l63.46,62.558c4.74,4.704,12.439,4.704,17.179,0c4.74-4.704,4.752-12.319,0-17.011l-84.2-82.997 c-4.692-4.656-12.584-4.608-17.191,0L99.888,86.496c-4.752,4.704-4.74,12.319,0,17.011 C104.628,108.211,112.327,108.211,117.067,103.507z'></path>{' '}
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
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
        </div>
    );
}
