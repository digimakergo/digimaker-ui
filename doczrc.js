export default {
    typescript: true,
    title: 'digimaker-ui',
    menu: [
      'Introduction',
      { name: 'Components', menu: [] },
      { name: 'Actions', menu: [] },
      { name: 'Fieldtypes', menu: [] }
    ],
    ignore:['README.md'],
    themeConfig: {
      menu: {
        headings: {
          rightSide: true,
          scrollspy: true,
          depth: 3,
        },
      },
    },
    notUseSpecifiers: true,
    filterComponents: files => files.filter(file => /([^d]\.tsx?)$/.test(file)),    
  }
