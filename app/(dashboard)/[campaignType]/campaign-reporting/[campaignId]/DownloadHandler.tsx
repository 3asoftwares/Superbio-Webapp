"use client";

import ADropdown from "@/components/ADropdown/ADropdown";
import SheetNetworkService, { IColumn } from "@/services/sheet.service";
import dayjs from "dayjs";
import React from "react";
import { Params } from "./layout";
import ConfirmLastRefresh from "@/components/Modals/ConfirmLastRefresh";
import { enqueueSnackbar } from "notistack";
import PublicNetworkService from "@/services/public.service";
import { CSVLink } from "react-csv";
import { useRouter } from "next/navigation";
import relativeTime from "dayjs/plugin/relativeTime";
import { useReactToPrint } from "react-to-print";
import PDFHandler, { ISummary } from "./PDFHandler";

dayjs.extend(relativeTime);

interface DownloadHandlerProps {
  meta: { [key: string]: any };
  isPublic: boolean | undefined;
  columns: IColumn[];
  params: Params;
  query: { [key: string]: any };
  campaignName: string;
  summary: ISummary[];
}

export default function DownloadHandler(props: DownloadHandlerProps) {
  const { meta, isPublic, columns, params, query, campaignName, summary } =
    props;
  const [valuesLoading, setValuesLoading] = React.useState(false);
  const [diffInMin, setDiffInMin] = React.useState(0);
  const [reportText, setReportText] = React.useState("Generate Report");
  const [generateStatus, setGenerateStatus] = React.useState("");
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [gradInx, setGradInx] = React.useState(0);
  const [isSheetExist, setIsSheetExist] = React.useState("yes");
  const [csvData, setCsvData] = React.useState({ columns: [], data: [] });
  const [pdfColumns, setPdfColumns] = React.useState<IColumn[]>([]);
  const csvLink = React.useRef<any>(null);
  const router = useRouter();
  const bodyRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => bodyRef.current,
  });

  const setLastRefresh = () => {
    const currentAt = dayjs(new Date()) as any;
    if (meta !== undefined) {
      const minutes = currentAt.diff(
        dayjs(parseInt(meta?.updatedAt?.$date?.$numberLong.toString())),
        "minutes",
      );
      setDiffInMin(isNaN(minutes) ? 0 : minutes);
      setReportText(
        meta?.analytics?.likes && meta?.analytics?.likes > "0"
          ? "Generated"
          : "Generate Report",
      );
    }
    setGenerateStatus("");
  };

  const getQueueData = () => {
    SheetNetworkService.instance
      .getQueueData()
      .then((res) => {
        const resp = res.filter(
          (item: any) => item?.campaign?._id?.$oid === params.campaignId,
        );
        if (resp?.length > 0) {
          const currentAt = dayjs(new Date()) as any;
          const minutes = currentAt.diff(
            dayjs(parseInt(resp[0].updatedAt?.$date?.$numberLong.toString())),
            "minutes",
          );
          setDiffInMin(minutes);
          setReportText("Generating...");
          if (resp[0]?.status.includes("processed")) {
            const str = resp[0]?.status;
            const num: any = str.split(" ")[0].split("/");
            const per = (num[0] * 100) / num[1];
            setGenerateStatus(`${per.toFixed(0)}%`);
          } else {
            setGenerateStatus(resp[0]?.status);
          }
        } else if (meta !== undefined) {
          setLastRefresh();
        }
      })
      .catch(() => {
        setLastRefresh();
      });
  };

  React.useEffect(() => {
    if (!isPublic) {
      if (columns !== undefined && reportText === "Generate Report") {
        getQueueData();
      }
    } else {
      setLastRefresh();
    }
  }, [columns]);

  const gradients = [
    "bg-gradient-to-b",
    "bg-gradient-to-l",
    "bg-gradient-to-t",
    "bg-gradient-to-r",
  ];

  const refreshStats = () => {
    if (reportText === "Generate Report" || diffInMin > 0) {
      setDiffInMin(0);
      setReportText("Generating...");
      SheetNetworkService.instance.syncSheet(params.campaignId);
    } else {
      openCloseConfirmModal();
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setGradInx(gradInx === 3 ? 0 : gradInx + 1);
    }, 100);
    return () => clearInterval(interval);
  });

  const openCloseConfirmModal = () => {
    setShowConfirmModal(!showConfirmModal);
  };

  let lastUpdate = dayjs(Number(meta?.updatedAt)).fromNow();
  if (diffInMin > 0) {
    lastUpdate = dayjs(new Date()).subtract(diffInMin, "minutes").fromNow();
  }

  const downloadCsv = () => {
    enqueueSnackbar("Please wait, we are preparing your csv file.", {
      variant: "success",
    });
    let data: any = [];
    let columns: any = [];
    SheetNetworkService.instance
      .getCampaignData(params.campaignId, { ...query, page: 1, limit: 1000 })
      .then((res) => {
        data = [];
        columns = !isPublic
          ? [
              {
                key: "id",
                label: "Sr.No",
              },
              {
                key: "socialLink",
                label: "Social Link",
              },
              {
                key: "postedAt",
                label: "Posted Date",
              },
              {
                key: "views",
                label: "Views",
              },
              {
                key: "likes",
                label: "Likes",
              },
              {
                key: "reposts",
                label: "Reposts",
              },
              {
                key: "quotes",
                label: "Quotes",
              },
              {
                key: "bookmarks",
                label: "Bookmarks",
              },
              {
                key: "comments",
                label: "Comments",
              },
            ]
          : [
              {
                key: "id",
                label: "Sr.No",
              },
              {
                key: "socialLink",
                label: "Social Link",
              },
              {
                key: "postedAt",
                label: "Posted Date",
              },
              {
                key: "reach",
                label: "Estimated Impression",
              },
            ];

        if (res?.data.length > 0) {
          let colAdded = false;
          data = res?.data.map((item: any, index: number) => {
            const dataObj = !isPublic
              ? {
                  id: index + 1,
                  socialLink: item.socialLink,
                  postedAt: item?.postedAt?.$date?.$numberLong
                    ? dayjs(
                        new Date(parseInt(item?.postedAt?.$date?.$numberLong)),
                      ).format("D MMM, YYYY")
                    : "",
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
                  postedAt: item?.postedAt?.$date?.$numberLong
                    ? dayjs(
                        new Date(parseInt(item?.postedAt?.$date?.$numberLong)),
                      ).format("D MMM, YYYY")
                    : "",
                  reach: item.analytics.views ? item.analytics.views : item.analytics.likes * 10,
                };

            const extraCol: any = {};
            if (item?.otherData?.length > 0 && !isPublic) {
              for (let i = 0; i < item?.otherData?.length; i++) {
                const dataProp =
                  "o" +
                  item?.otherData[i]?.columnName
                    ?.toLowerCase()
                    .replace(/\s/g, "");
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

  const downloadPdf = () => {
    enqueueSnackbar("Please wait, we are preparing your pdf file.", {
      variant: "success",
    });
    if (isPublic) {
      PublicNetworkService.instance
        .getCampaignReportData(params.campaignId, {
          ...query,
          page: 1,
          limit: 1000,
        })
        .then((res) => {
          setPdfColumns(res?.data);
        });
    } else {
      SheetNetworkService.instance
        .getCampaignData(params.campaignId, { ...query, page: 1, limit: 1000 })
        .then((res) => {
          setPdfColumns(res?.data);
        });
    }
  };

  React.useEffect(() => {
    if (csvData?.data?.length > 0) {
      csvLink.current.link.click();
      setCsvData({ columns: [], data: [] });
    }
  }, [csvData]);

  React.useEffect(() => {
    if (pdfColumns?.length > 0) {
      handlePrint();
      setPdfColumns([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfColumns]);

  React.useEffect(() => {
    if (reportText === "Generating...") {
      const interval = setInterval(async () => {
        const res = await SheetNetworkService.instance.getQueueData();
        const resp = res.filter(
          (item: any) => item?.campaign?._id?.$oid === params.campaignId,
        );
        if (resp?.length > 0) {
          if (resp[0]?.status.includes("processed")) {
            const str = resp[0]?.status;
            const num: any = str.split(" ")[0].split("/");
            const per = (num[0] * 100) / num[1];
            setGenerateStatus(`${per.toFixed(0)}%`);
          } else {
            setGenerateStatus(resp[0]?.status);
          }
        }
      }, 10000);
      return () => clearInterval(interval);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportText]);

  return (
    <div className="flex py-2 flex-col md:flex-row justify-between gap-4 items-center h-[60px]">
      {showConfirmModal && (
        <ConfirmLastRefresh openCloseModal={openCloseConfirmModal} />
      )}
      <div className="flex text-lg font-bold text-center md:text-left">
        <span className=" text-lg font-bold text-center md:text-left">
          LIVE Reporting for Campaign -{" "}
          {campaignName.toString().replaceAll("_", " ")}
        </span>
      </div>
      {!valuesLoading && isSheetExist === "yes" && meta && meta?.total > 0 && (
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="flex">
            {reportText === "Generate Report" && isPublic && (
              <div className="flex items-center gap-3 font-semibold text-black sm:text-center md:text-left text-[12px] sm:text-sm mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  id="like"
                  width="20"
                  height="20"
                  fill="#000"
                >
                  <path
                    fill="#000"
                    d="M0,1v8c0,0.552246 0.447693,1 1,1h3v-10h-3c-0.552307,8.88178e-16 -1,0.447693 -1,1Z"
                    transform="translate(0 5)"
                  ></path>
                  <path
                    fill="#000"
                    d="M9.15332,5.02979h-2.9541c-0.258301,0 -0.387695,-0.172363 -0.431152,-0.246582c-0.043457,-0.0737305 -0.131348,-0.270508 -0.0063477,-0.496094l1.0415,-1.87549c0.228516,-0.410645 0.251953,-0.893555 0.0649414,-1.32471c-0.187012,-0.43164 -0.556152,-0.744629 -1.0127,-0.858398l-0.734375,-0.183594c-0.178711,-0.0449219 -0.368164,0.0122071 -0.492676,0.150391l-3.9873,4.42969c-0.413574,0.460449 -0.641113,1.0542 -0.641113,1.67236v5.23242c0,1.37842 1.12158,2.5 2.5,2.5l4.97412,-0.0004883c1.12305,0 2.11475,-0.756348 2.41113,-1.83887l1.06738,-4.89844c0.03125,-0.13623 0.0473633,-0.275879 0.0473633,-0.415527c0,-1.01807 -0.828613,-1.84668 -1.84668,-1.84668Z"
                    transform="translate(5 .97)"
                  ></path>
                </svg>
                Report not generated yet
              </div>
            )}
            {reportText === "Generate Report" && !isPublic && (
              <div
                onClick={() => refreshStats()}
                className="flex items-center gap-3 font-semibold text-black sm:text-center md:text-left text-[12px] sm:text-sm mr-4 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  id="like"
                  width="20"
                  height="20"
                  fill="#000"
                >
                  <path
                    fill="#000"
                    d="M0,1v8c0,0.552246 0.447693,1 1,1h3v-10h-3c-0.552307,8.88178e-16 -1,0.447693 -1,1Z"
                    transform="translate(0 5)"
                  ></path>
                  <path
                    fill="#000"
                    d="M9.15332,5.02979h-2.9541c-0.258301,0 -0.387695,-0.172363 -0.431152,-0.246582c-0.043457,-0.0737305 -0.131348,-0.270508 -0.0063477,-0.496094l1.0415,-1.87549c0.228516,-0.410645 0.251953,-0.893555 0.0649414,-1.32471c-0.187012,-0.43164 -0.556152,-0.744629 -1.0127,-0.858398l-0.734375,-0.183594c-0.178711,-0.0449219 -0.368164,0.0122071 -0.492676,0.150391l-3.9873,4.42969c-0.413574,0.460449 -0.641113,1.0542 -0.641113,1.67236v5.23242c0,1.37842 1.12158,2.5 2.5,2.5l4.97412,-0.0004883c1.12305,0 2.11475,-0.756348 2.41113,-1.83887l1.06738,-4.89844c0.03125,-0.13623 0.0473633,-0.275879 0.0473633,-0.415527c0,-1.01807 -0.828613,-1.84668 -1.84668,-1.84668Z"
                    transform="translate(5 .97)"
                  ></path>
                </svg>
                Generate Report
              </div>
            )}
            {reportText === "Generating..." && (
              <div
                className={`flex gap-3 ${gradients[gradInx]} from-[#959595] to-white items-center rounded-lg p-[2px] text-[#959595] text-sm mr-3 cursor-not-allowed`}
              >
                <button className="flex items-center px-3 gap-3 h-full rounded-lg bg-white text-[#959595] text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    id="like"
                    width="20"
                    height="20"
                    fill="#000"
                  >
                    <path
                      fill="#959595"
                      d="M0,1v8c0,0.552246 0.447693,1 1,1h3v-10h-3c-0.552307,8.88178e-16 -1,0.447693 -1,1Z"
                      transform="translate(0 5)"
                    ></path>
                    <path
                      fill="#959595"
                      d="M9.15332,5.02979h-2.9541c-0.258301,0 -0.387695,-0.172363 -0.431152,-0.246582c-0.043457,-0.0737305 -0.131348,-0.270508 -0.0063477,-0.496094l1.0415,-1.87549c0.228516,-0.410645 0.251953,-0.893555 0.0649414,-1.32471c-0.187012,-0.43164 -0.556152,-0.744629 -1.0127,-0.858398l-0.734375,-0.183594c-0.178711,-0.0449219 -0.368164,0.0122071 -0.492676,0.150391l-3.9873,4.42969c-0.413574,0.460449 -0.641113,1.0542 -0.641113,1.67236v5.23242c0,1.37842 1.12158,2.5 2.5,2.5l4.97412,-0.0004883c1.12305,0 2.11475,-0.756348 2.41113,-1.83887l1.06738,-4.89844c0.03125,-0.13623 0.0473633,-0.275879 0.0473633,-0.415527c0,-1.01807 -0.828613,-1.84668 -1.84668,-1.84668Z"
                      transform="translate(5 .97)"
                    ></path>
                  </svg>
                  Generating Report (
                  {generateStatus !== ""
                    ? generateStatus
                    : "This may take a few minutes"}
                  )
                </button>
              </div>
            )}
            {reportText === "Generated" && (
              <div className="flex items-center gap-3 text-[#959595] font-semibold sm:text-center md:text-left text-[12px] sm:text-sm mr-3">
                <span>Last Refresh {lastUpdate}</span>
                {!isPublic && (
                  <div
                    onClick={() => refreshStats()}
                    className="flex items-center justify-center p-2 bg-[#e6e6e6] rounded-xl h-11 w-11 cursor-pointer"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.23291 7.78125H2.48291V4.03125"
                        stroke="#959595"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.13916 14.8594C6.10042 15.8214 7.32542 16.4768 8.65919 16.7425C9.99297 17.0082 11.3756 16.8724 12.6322 16.3522C13.8887 15.832 14.9628 14.9508 15.7185 13.8201C16.4741 12.6894 16.8775 11.36 16.8775 10C16.8775 8.64002 16.4741 7.31058 15.7185 6.17988C14.9628 5.04917 13.8887 4.16798 12.6322 3.64779C11.3756 3.12761 9.99297 2.99179 8.65919 3.25752C7.32542 3.52324 6.10042 4.17858 5.13916 5.14063L2.48291 7.78907"
                        stroke="#959595"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <ADropdown
                width={"w-32"}
                position="down"
                options={[
                  {
                    title: "CSV",
                    action: downloadCsv,
                  },
                  // {
                  //     title: 'PDF',
                  //     action: downloadPdf,
                  // },
                ]}
                header={
                  <div className="flex items-center bg-black py-2 px-4 rounded-lg space-x-2 cursor-pointer text-sm text-white h-11">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.0625 10.3125L12 14.25L15.9375 10.3125"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 3.75V14.25"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.25 14.25V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V14.25"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-opacity-80">Download all</span>
                  </div>
                }
              />
              <CSVLink
                ref={csvLink}
                target="_blank"
                className="hidden"
                data={csvData.data}
                headers={csvData.columns}
                filename={`${!isPublic ? campaignName.toString().replaceAll("_", " ").slice(0, -1) : "CampaignData"}.csv`}
              />
            </div>
          </div>
        </div>
      )}
      {!valuesLoading &&
        isSheetExist === "yes" &&
        meta &&
        meta?.total === 0 &&
        !isPublic && (
          <div className="flex items-center border border-[#df4040] bg-[#ffe3e2] rounded-lg">
            <span className="flex gap-3 w-full text-sm text-[#df4040] px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                id="like"
                width="20"
                height="20"
                fill="#959595"
              >
                <path
                  fill="#df4040"
                  d="M0,1v8c0,0.552246 0.447693,1 1,1h3v-10h-3c-0.552307,8.88178e-16 -1,0.447693 -1,1Z"
                  transform="translate(0 5)"
                ></path>
                <path
                  fill="#df4040"
                  d="M9.15332,5.02979h-2.9541c-0.258301,0 -0.387695,-0.172363 -0.431152,-0.246582c-0.043457,-0.0737305 -0.131348,-0.270508 -0.0063477,-0.496094l1.0415,-1.87549c0.228516,-0.410645 0.251953,-0.893555 0.0649414,-1.32471c-0.187012,-0.43164 -0.556152,-0.744629 -1.0127,-0.858398l-0.734375,-0.183594c-0.178711,-0.0449219 -0.368164,0.0122071 -0.492676,0.150391l-3.9873,4.42969c-0.413574,0.460449 -0.641113,1.0542 -0.641113,1.67236v5.23242c0,1.37842 1.12158,2.5 2.5,2.5l4.97412,-0.0004883c1.12305,0 2.11475,-0.756348 2.41113,-1.83887l1.06738,-4.89844c0.03125,-0.13623 0.0473633,-0.275879 0.0473633,-0.415527c0,-1.01807 -0.828613,-1.84668 -1.84668,-1.84668Z"
                  transform="translate(5 .97)"
                ></path>
              </svg>
              There are currently no links. To generate report you have to add
              links.
            </span>
            <button
              className="flex items-center gap-1 w-32 h-10 justify-end font-semibold text-sm text-[#ffe3e2] bg-[#df4040] rounded m-[2px]"
              onClick={() =>
                router.push(
                  `/${params.campaignType}/create-reporting/${params.campaignId}?campaignName=${campaignName.toString()}`,
                )
              }
            >
              Add Links
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M5 12H19M19 12L13 6M19 12L13 18"
                    stroke="#ffe3e2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </button>
          </div>
        )}

      <PDFHandler
        bodyRef={bodyRef}
        pdfColumns={pdfColumns}
        isPublic={isPublic}
        summary={summary}
      />
    </div>
  );
}
