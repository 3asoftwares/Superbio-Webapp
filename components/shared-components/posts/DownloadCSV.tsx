'use client';

import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { CSVLink } from 'react-csv';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DownloadIcon } from 'lucide-react';
import PostNetworkService from '@/services/post.service';

dayjs.extend(relativeTime);

interface GenerateReportProps {
    total: number;
    fileName: string;
    campaignId: string;
    isPublic: boolean | undefined;
}

export default function DownloadCSV(props: GenerateReportProps) {
    const { campaignId, isPublic, total, fileName } = props;
    const [isDownloading, setIsDownloading] = useState(false);
    const [csvData, setCsvData] = useState({ columns: [], data: [] });
    const csvLink = useRef<any>(null);

    const downloadCsv = () => {
        setIsDownloading(true);
        enqueueSnackbar('Please wait, we are preparing your csv file.', {
            variant: 'success',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
            },
        });
        let data: any = [];
        let columns: any = [];
        const params = `?page=1&size=${total}&sortBy=sNo&sortDirection=ASC`;
        PostNetworkService.instance.getPostsData(campaignId, params).then((res: any) => {
            data = [];
            columns = !isPublic
                ? [
                      {
                          key: 'id',
                          label: 'Sr.No',
                      },
                      {
                          key: 'socialLink',
                          label: 'Social Link',
                      },
                      {
                          key: 'postedAt',
                          label: 'Posted Date',
                      },
                      {
                          key: 'views',
                          label: 'Views',
                      },
                      {
                          key: 'likes',
                          label: 'Likes',
                      },
                      {
                          key: 'reposts',
                          label: 'Reposts',
                      },
                      {
                          key: 'quotes',
                          label: 'Quotes',
                      },
                      {
                          key: 'bookmarks',
                          label: 'Bookmarks',
                      },
                      {
                          key: 'comments',
                          label: 'Comments',
                      },
                  ]
                : [
                      {
                          key: 'id',
                          label: 'Sr.No',
                      },
                      {
                          key: 'socialLink',
                          label: 'Social Link',
                      },
                      {
                          key: 'postedAt',
                          label: 'Posted Date',
                      },
                      {
                          key: 'reach',
                          label: 'Estimated Impression',
                      },
                  ];
            if (res?.items.length > 0) {
                let colAdded = false;
                data = res?.items.map((item: any, index: number) => {
                    const dataObj = !isPublic
                        ? {
                              id: index + 1,
                              socialLink: item.socialLink,
                              postedAt: item?.postedAt ? dayjs(new Date(item?.postedAt)).format('D MMM, YYYY') : '',
                              views: item.analytics.views,
                              likes: item.analytics.likes,
                              reposts: item.analytics.reposts,
                              quotes: item.analytics.quotes,
                              bookmarks: item.analytics.bookmarks,
                              comments: item.analytics.comments,
                          }
                        : {
                              id: index + 1,
                              socialLink: item.socialLink,
                              postedAt: item?.postedAt ? dayjs(new Date(item?.postedAt)).format('D MMM, YYYY') : '',
                              reach: item.analytics.views ? item.analytics.views : item.analytics.likes * 10,
                          };

                    const extraCol: any = {};
                    if (item?.otherData?.length > 0 && !isPublic) {
                        for (let i = 0; i < item?.otherData?.length; i++) {
                            const dataProp = 'o' + item?.otherData[i]?.columnName?.toLowerCase().replace(/\s/g, '');
                            extraCol[dataProp] = item?.otherData[i]?.value;
                            if (!colAdded) {
                                columns.push({
                                    key: dataProp,
                                    label: item?.otherData[i]?.columnName,
                                });
                            }
                        }
                        if (!colAdded) {
                            colAdded = true;
                        }
                    }
                    return { ...dataObj, ...extraCol };
                });
            }
            setCsvData({ columns: columns, data: data });
        });
    };

    useEffect(() => {
        if (csvData?.data?.length > 0) {
            csvLink.current.link.click();
            setIsDownloading(false);
            setCsvData({ columns: [], data: [] });
        }
    }, [csvData]);

    return (
        <div className='flex gap-3'>
            <button
                onClick={downloadCsv}
                disabled={isDownloading}
                className='flex items-center bg-black py-2 px-4 rounded-lg space-x-2 cursor-pointer text-sm text-white h-10 disabled:opacity-50 disabled:cursor-not-allowed'>
                <DownloadIcon color='#fff' size={20} />
                <span className='text-opacity-80'>{isDownloading ? 'Downloading...' : 'Download CSV'}</span>
            </button>
            <CSVLink
                ref={csvLink}
                target='_blank'
                className='hidden'
                data={csvData.data}
                headers={csvData.columns}
                filename={`${fileName.toString().replaceAll(' ', '_')}.csv`}
            />
        </div>
    );
}
