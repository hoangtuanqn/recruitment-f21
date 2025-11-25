export class Helper {
    static formatTimeAgo = (pastTime: string | Date | number): string => {
        const date = pastTime instanceof Date ? pastTime : new Date(pastTime);

        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();

        const MS_PER_SECOND = 1000;
        const MS_PER_MINUTE = 60 * MS_PER_SECOND;
        const MS_PER_HOUR = 60 * MS_PER_MINUTE;
        const MS_PER_DAY = 24 * MS_PER_HOUR;
        const MS_PER_WEEK = 7 * MS_PER_DAY;
        const MS_PER_MONTH = 30 * MS_PER_DAY;
        const MS_PER_YEAR = 365 * MS_PER_DAY;

        if (diffInMs < MS_PER_MINUTE) {
            const seconds = Math.round(diffInMs / MS_PER_SECOND);
            return seconds <= 1 ? "vài giây trước" : `${seconds} giây trước`;
        } else if (diffInMs < MS_PER_HOUR) {
            const minutes = Math.round(diffInMs / MS_PER_MINUTE);
            return `${minutes} phút trước`;
        } else if (diffInMs < MS_PER_DAY) {
            const hours = Math.round(diffInMs / MS_PER_HOUR);
            return `${hours} giờ trước`;
        } else if (diffInMs < MS_PER_WEEK) {
            const days = Math.round(diffInMs / MS_PER_DAY);
            return `${days} ngày trước`;
        } else if (diffInMs < MS_PER_MONTH) {
            const weeks = Math.round(diffInMs / MS_PER_WEEK);
            return `${weeks} tuần trước`;
        } else if (diffInMs < MS_PER_YEAR) {
            const months = Math.round(diffInMs / MS_PER_MONTH);
            return `${months} tháng trước`;
        } else {
            const years = Math.round(diffInMs / MS_PER_YEAR);
            return `${years} năm trước`;
        }
    };
}
