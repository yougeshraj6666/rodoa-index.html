function calculateMonthlyLoggedAndActiveUsers(data) {
  // Convert timestamps to milliseconds for consistency
  const normalizedData = data.map(record => ({
    deviceId: record.deviceId,
    userId: record.userId,
    loggedIn: new Date(record.loggedIn).getTime(),
    loggedOut: record.loggedOut ? new Date(record.loggedOut).getTime() : Infinity, // Treat no logout as infinite
    lastOpenedAt: new Date(record.lastOpenedAt).getTime()
  }));

  const monthlyStats = {};

  normalizedData.forEach(record => {
    const loggedInMonth = new Date(record.loggedIn).getMonth();
    const currentMonth = new Date().getMonth();

    for (let month = loggedInMonth; month <= currentMonth; month++) {
      const monthStart = new Date(new Date().getFullYear(), month, 1).getTime();
      const monthEnd = new Date(new Date().getFullYear(), month + 1, 1).getTime();

      if (record.loggedOut >= monthStart) {
        monthlyStats[month] = monthlyStats[month] || { loggedIn: 0, active: new Set() };
        monthlyStats[month].loggedIn++;
        monthlyStats[month].active.add(record.userId);
      }
    }
  });

  // Calculate active users
  Object.values(monthlyStats).forEach(stats => {
    stats.active = stats.active.size;
  });

  return monthlyStats;
}
