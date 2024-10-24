declare interface ISheet {
    id: { $oid: string };
    sheetId: string;
    name: string;
    title: string;
    linkColumn: string;
    campaignId: { $oid: string };
    socialmedias: string;
    range: string;
    lastSyncedAt: MongoDate;
    createdAt: MongoDate;
    updatedAt: MongoDate;
}

export interface ISheetDetails {
    sheetId: string;
    sheetName: string;
    rows: string[];
    columns: string[];
}

export interface IColumnDetails {
    column_name: string;
    values: string[];
}

export interface ISheetPayload {
    id?: string;
    sheetId: string;
    name: string;
    linkColumn: string;
    campaignId: string;
    range?: string;
    title?: string;
}

export interface IColumn {
    socialLink: string;
    analytics: {
        [key: string]: number | string;
    };
    otherData: {
        columnName?: string;
        value: string;
    }[];
    postedAt: MongoDate;
    internalSheetId: { $oid: string };
    campaignId: { $oid: string };
    createdAt: MongoDate;
    updatedAt: MongoDate;
    isPrivate: boolean;
}

export interface IColumnDataResponse {
    data: IColumn[];
    meta: {
        total: number;
        page: number;
        limit: number;
        analytics: {
            likes: string;
            quotes: string;
            reposts: string;
            views: string;
            bookmarks: string;
        };
        basedOnPosts: {
            likes: string;
            quotes: string;
            reposts: string;
            views: string;
            bookmarks: string;
        };
    };
}
export interface IPostsResponse {
    postDtoPaginatedResponse: any;
}

export interface IAnalyticsReportingResponse {
    customReportCards: any;
    campaignViewsReportCard: any;
    postCountAnalysisReportCard: any;
    campaignEngagementReportCard: any;
    dailyMetricsTimelineReportCard: any;
}

export interface IPostsReportingResponse {
    queueDto: any;
    campaignDto: any;
    postSummaryResp: any;
    filterValueResp: any;
    campaignAnalyticsInfo: any;
    postDtoPaginatedResponse: any;
}

export interface IProfilesResponse {
    postDtoPaginatedResponse: any;
}
export interface IProfilesReportingResponse {
    queueDto: any;
    campaignDto: any;
    postSummaryResp: any;
    profileAnalyticsResp: any;
    igProfileAnalyticsResp: any;
    twitterFilterValueResp: any;
    instagramFilterValueResp: any;
    profilePaginatedResponse: any;
}
