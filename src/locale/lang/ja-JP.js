const lang = {
  h: {
    locale: 'ja-JP',
    common: {
      cancel: 'キャンセル',
      confirm: '確認',
      clear: 'クリア',
      nullOptionText: '選択する',
      empty: 'empty',
      any: 'any'
    },
    confirm: {
      title: 'Confirm',
    },
    select: {
      nullOptionText: 'please choose',
      placeholder: 'select',
      emptyContent: 'no results found',
      searchPlaceHolder: 'search',
      limitSize: 'You can select up to {0} data.',
    },
    category: {
      placeholder: 'please choose',
      nullOptionText: 'please choose',
    },
    categoryModal: {
      limitWords: 'You can select up to {size} data.',
      emptyContent: 'No results found',
      total: 'total',
    },
    autoComplate: {
      placeholder: 'Search Input',
      emptyContent: 'No results found'
    },
    validation: {
      base: {
        required: ' can not be empty',
        maxLen: " text length can't exceed {value} bits",
        minLen: " text length can't be less than {value} bits",
        max: ' no more than {value}',
        min: " can't be less than {value}",
      },
      type: {
        int: ' is not the correct integer format',
        number: ' is not the correct digital format',
        email: ' is not the correct mailbox format',
        url: ' is not the correct URL format',
        tel: " is not the correct phone number format",
        mobile: ' is not the correct mobile number format',
        globalmobile: ' is not the correct international mobile number format',
      }
    },
    date: {
      today: '今日',
      yesterday: '昨日',
      year: '年',
      month: '月',
      week: '週',
      quarter: '四半期',
      day: '日',
      header: {
        year: '',
        month: '',
        day: '',
      },
      show: {
        week: '{year} {weeknum}th week {daystart} - {dayend}',
        weekInput: '{year} {week}th week',
        quarter: '{year} {quarter}th quarter',
      },
      months: {
        january: '1月',
        february: '2月',
        march: '3月',
        april: '4月',
        may: '5月',
        june: '6月',
        july: '7月',
        august: '8月',
        september: '9月',
        october: '10月',
        november: '11月',
        december: '12月',
      },
      weeks: {
        monday: '月',
        tuesday: '火',
        wednesday: '水',
        thursday: '木',
        friday: '金',
        saturday: '土',
        sunday: '日',
      }
    },
    datepicker: {
      placeholder: 'select date',
      startTime: '開始時間',
      endTime: '終了時間',
      customize: 'customize',
      start: '開始日',
      end: '終了日'
    },
    wordlimit: {
      warn: 'You are limited to enter {0} words'
    },
    wordcount: {
      warn: 'You have exceeded {0} words'
    },
    treepicker: {
      selectDesc: 'You have selected {0} items',
      placeholder: 'please select',
    },
    search: {
      placeholder: 'search...',
      searchText: 'Search'
    },
    taginput: {
      limitWords: 'You have exceeded the limit'
    },
    table: {
      empty: 'No results found'
    },
    uploader: {
      upload: 'Upload',
      reUpload: 'ReUpload'
    },
    pagination: {
      incorrectFormat: 'The format of the value you entered is incorrect',
      overSize: 'The value you entered exceeds the range',
      totalBefore: 'Total',
      totalAfter: 'items',
      sizeOfPage: '{size} items/page'
    }
  }
};


export default lang;
