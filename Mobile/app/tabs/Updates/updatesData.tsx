export const updatesData = {
  latestRelease: {
    titleKey: "latest_release.survey_title",
    dateKey: "latest_release.august_date",
    categoryKey: "categories.statistics",
  },
  upcomingReleases: [
    {
      date: { month: "Sep", day: "16" },
      titleKey: "upcoming_releases.residential_property_price",
      categoryKey: null,
    },
    {
      date: { month: "Sep", day: "17" },
      titleKey: "upcoming_releases.gaming_sector_survey",
      categoryKey: null,
    },
    {
      date: { month: "Sep", day: "17" },
      titleKey: "upcoming_releases.electronic_payment_statistics",
      categoryKey: null,
    },
    {
      date: { month: "Sep", day: "17" },
      titleKey: "upcoming_releases.industrial_production_index",
      categoryKey: null,
    },
  ],
};

// Helper function to add new upcoming release
export const addUpcomingRelease = (date, titleKey, categoryKey = null) => {
  updatesData.upcomingReleases.push({ date, titleKey, categoryKey });
};

// Helper function to update latest release
export const updateLatestRelease = (titleKey, dateKey, categoryKey) => {
  updatesData.latestRelease = { titleKey, dateKey, categoryKey };
};
