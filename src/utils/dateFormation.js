import { formatDistanceToNow } from 'date-fns';

export const calculateTimeAgo = (dateString) => {
    const timeDifference = formatDistanceToNow(new Date(dateString), { addSuffix: false });
    const parts = timeDifference.split(' '); // Split the formatted string

    if (timeDifference.includes('minute')) return parts[0] + 'm';
    if (timeDifference.includes('hour')) return parts[1] + 'h';
    if (timeDifference.includes('day')) return parts[0] + 'd';
    if (timeDifference.includes('month')) return parts[1] + 'mo';
    if (timeDifference.includes('year')) return parts[1] + 'y';

    return 'Just now'; // Default case for seconds or unknown cases
};
