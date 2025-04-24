export interface BaseVO
{
    id: string;
    name: string;
}

export interface UserVO extends BaseVO
{
    status: string
}

export interface DeviceVO extends BaseVO
{
    user: UserVO
    group: DeviceGroupVO
}

export interface DeviceGroupVO extends BaseVO
{
    user: UserVO
}