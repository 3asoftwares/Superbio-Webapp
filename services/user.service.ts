import axios from 'axios';
import BaseNetworkFramework from './base.service';
import { deleteCookie, setCookie } from 'cookies-next';
import { enqueueSnackbar } from 'notistack';
import { IUserReturn, ILoginResponse, IRegisterPayload, User, IUserListResponse, Orgs } from '@/interfaces/user';

export default class UserNetworkService extends BaseNetworkFramework {
    public static instance: UserNetworkService = new this();

    private constructor() {
        super();
    }

    public login = async (email: string, password: string): Promise<IUserReturn> => {
        try {
            const res = await axios.post<ILoginResponse>(`${this.rustUrl}/user/login`, { email, password });
            setCookie('token', res.data.token);
            setCookie('user', JSON.stringify(res.data.user));
            enqueueSnackbar('Logged In Successfully', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            window.location.reload();
            return {
                token: res.data.token,
                user: res.data.user,
            };
        } catch (err: any) {
            enqueueSnackbar(err.response.data, {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            throw err;
        }
    };

    public register = async (props: IRegisterPayload): Promise<string> => {
        try {
            const res = await axios.post<string>(`${this.rustUrl}/user/register`, props);
            enqueueSnackbar('Registered Successfully Please Verify Your Email', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            return res.data;
        } catch (err: any) {
            throw err;
        }
    };

    public getUser = async (): Promise<User> => {
        const res = await axios.get<User>(`${this.rustUrl}/user/info`, { headers: this.get_auth_header_rust() });
        return res.data;
    };

    public loginUsingGoogle = async (token: string, tokenType: string): Promise<IUserReturn> => {
        const res = await axios.post<ILoginResponse>(`${this.rustUrl}/user/google/login`, { token, token_type: tokenType });
        setCookie('token', res.data.token);
        setCookie('user', JSON.stringify(res.data.user));
        enqueueSnackbar('Logged In Successfully', {
            variant: 'success',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
            },
        });
        window.location.reload();
        return {
            user: res.data.user,
            token: res.data.token,
        };
    };

    public verifyEmail = async (otp: string, email: string): Promise<IUserReturn> => {
        const res = await axios.post<ILoginResponse>(`${this.rustUrl}/user/verify`, { otp, email });
        setCookie('token', res.data.token);
        setCookie('user', JSON.stringify(res.data.user));
        enqueueSnackbar('Email verified successfully', {
            variant: 'success',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
            },
        });
        window.location.reload();
        return {
            user: res.data.user,
            token: res.data.token,
        };
    };

    public forgotPassword = async (email: string): Promise<string> => {
        try {
            const res = await axios.post<string>(`${this.rustUrl}/user/forgot-password`, { email, password: '' });
            enqueueSnackbar('Reset passowrd link sent to your email', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            return res.data;
        } catch (err: any) {
            throw err;
        }
    };

    public resetPassword = async (token: string, password: string): Promise<string> => {
        try {
            const res = await axios.post<string>(`${this.rustUrl}/user/reset-password`, { token, password });
            return res.data;
        } catch (err: any) {
            throw err;
        }
    };

    public addPhoneToUser = async (mobileNo: string): Promise<User> => {
        try {
            const res = await axios.post<User>(`${this.rustUrl}/user/add-phone`, { mobileNo }, { headers: this.get_auth_header_rust() });
            deleteCookie('user');
            setCookie('user', JSON.stringify(res.data));
            window.location.reload();
            return res.data;
        } catch (err: any) {
            throw err;
        }
    };

    public getAllUsers = async ({ page, limit }: { page: number; limit: number }): Promise<IUserListResponse> => {
        try {
            const res = await axios.get<IUserListResponse>(`${this.rustUrl}/user/all`, { params: { page, limit }, headers: this.get_auth_header_rust() });
            return res.data;
        } catch (err: any) {
            throw err;
        }
    };

    public addMember = async (props: User): Promise<User> => {
        try {
            const res = await axios.post<User>(`${this.rustUrl}/user/add`, props, { headers: this.get_auth_header_rust() });
            return res.data;
        } catch (err: any) {
            throw err;
        }
    };

    public addOrgs = async (props: Orgs): Promise<{ token: string }> => {
        try {
            const res = await axios.post<{ token: string; user: User }>(`${this.rustUrl}/user/orgs`, props, { headers: this.get_auth_header_rust() });
            deleteCookie('token');
            deleteCookie('user');
            setCookie('token', res.data.token);
            setCookie('user', JSON.stringify(res.data.user));
            return res.data;
        } catch (err: any) {
            throw err;
        }
    };
}
