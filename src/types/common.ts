export type IRole = 'airbnb-user' | 'airbnb-admin';

export type IPermission = 'room:create' | 'room:book' | 'room:delete' | 'room:update';

export interface AccessPayload {
	permissions: IPermission[];
	role: IRole;
	sub: string;
}
