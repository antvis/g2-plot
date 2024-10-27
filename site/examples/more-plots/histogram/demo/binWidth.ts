import { Histogram } from '@antv/g2plot';

fetch('https://gw.alipayobjects.com/os/antfincdn/RoliHq%2453S/histogram.json')
  .then((data) => data.json())
  .then((data) => {
    const histogramPlot = new Histogram('container', {
      data,
      binField: 'value',
      binWidth: 4,
      tooltip: {
        showMarkers: false,
        position: 'top',
      },
      interactions: [
        {
          type: 'element-highlight',
        },
      ],
      /** range 为 x 轴代表字段，count 为 y 轴统计个数字段 */
      meta: {
        range: {
          min: 0,
          tickInterval: 2,
        },
        count: {
          max: 20,
          nice: true,
        },
      },
    });
    
    histogramPlot.render();
  });