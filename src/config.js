export const user_storage_name = '_TRO_ADMIN_DAT_SSPYRBN__';
export const user_storage_token = '_TRO_ADMIN_DAT_SSPYRBN__TOKEN__';
export const user_storage_type = '_TRO_ADMIN_DAT_SSPYRBN__USER_TYPE__';
export const ACCESS_DENIED = 'Access Denied';
export const UNAUHTORIZED = 'Unauthorized Access';

export const host = process.env.REACT_APP_LIVE;
export const host2 = process.env.REACT_APP_LIVE2;
// export const host = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL : process.env.REACT_APP_LIVE

export const PasswordCheck = async (password) => {
	const check = new RegExp(
		/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
	);
	if (check.test(password)) {
		return true;
	} else {
		return false;
	}
};

export const dateFormat = (date) => {
	const newDate = new Date(date);
	const year = newDate.getFullYear();
	let month = newDate.getMonth() + 1;
	let day = newDate.getDate();
	month = month < 10 ? `0${month}` : month;
	day = day < 10 ? `0${day}` : day;
	return `${day}/${month}/${year}`;
};

export const convertToThousand = (value) => {
	value = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0;
	return `${Naira}${value}`;
};

export const Naira = '₦';
export const defaultImage =
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSySSYZ8Vr_66g-cqvEwxmn8qA2KRRTrbcAPA&usqp=CAU';

export const calculateRevenueTotal = (collection) => {
	let total = 0;
	collection.map((item) => {
		return (total += item);
	});
	return total;
};
export const calculateRevenueTotalObject = (collection) => {
	let total = 0;
	collection.map((item) => {
		return (total += item.total);
	});
	return total;
};
