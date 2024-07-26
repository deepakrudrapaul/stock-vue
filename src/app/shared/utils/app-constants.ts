

export const AppConstants = {
    Routes: {
        HOME: 'home',
        OI_SCAN: 'oi-scan',
        OI_BUILD_UP: 'oi-buildup',
        OI_DIFF: 'oi-diff',
    },
    AUTO_REFRESH_ON: "Auto Refresh On",
    AUTO_REFRESH_OFF: "Auto Refresh Off",
    COLUMNS : [
        {
          label : 'Symbol',
          field: 'symbol',
          dataType: 'string'
        },
        {
          label : 'Price Change (%)',
          field: 'oneDayPriceChange',
          dataType: 'string'
        },
        {
          label : 'OI Change (%)',
          field: 'oneDayOiChange',
          dataType: 'string'
        },
        {
          label : 'Volume Change (%)',
          field: 'oneDayValueChange',
          dataType: 'string'
        },
        {
          label : 'Date',
          field: 'timestamp',
          dataType: 'date'
        }
      ]
}