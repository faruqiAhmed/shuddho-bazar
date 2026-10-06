// Dynamic real-time date formatters (clears all static demo dates)

export function getTodayFormatted(isBengali = false): string {
  const now = new Date();
  if (isBengali) {
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const bnNums = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    const day = String(now.getDate()).split('').map(c => bnNums[+c] ?? c).join('');
    const year = String(now.getFullYear()).split('').map(c => bnNums[+c] ?? c).join('');
    return `${day} ${months[now.getMonth()]}, ${year}`;
  }
  return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getCurrentDateRange(isBengali = false): string {
  const end = new Date();
  const start = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

  if (isBengali) {
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const bnNums = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    const toBn = (num: number) => String(num).split('').map(c => bnNums[+c] ?? c).join('');

    const sDay = toBn(start.getDate());
    const sMonth = months[start.getMonth()];
    const eDay = toBn(end.getDate());
    const eMonth = months[end.getMonth()];
    const year = toBn(end.getFullYear());

    if (start.getMonth() === end.getMonth()) {
      return `${sDay} - ${eDay} ${eMonth}, ${year}`;
    }
    return `${sDay} ${sMonth} - ${eDay} ${eMonth}, ${year}`;
  }

  const sMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const eMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const sDay = start.getDate();
  const eDay = end.getDate();
  const year = end.getFullYear();

  if (sMonth === eMonth) {
    return `${sMonth} ${sDay} - ${eDay}, ${year}`;
  }
  return `${sMonth} ${sDay} - ${eMonth} ${eDay}, ${year}`;
}

export function getDynamicOrderDate(daysAgo = 0, timeStr = '11:45 AM'): string {
  const d = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month} ${day}, ${year} ${timeStr}`;
}
