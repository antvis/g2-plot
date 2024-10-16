import { DualAxes } from '../../src';
import { createDiv } from '../utils/dom';

describe('dual-axes slider', () => {
  const data = [
    { time: '2019-03', value: 350, count: 800 },
    { time: '2019-04', value: 900, count: 600 },
    { time: '2019-05', value: 300, count: 400 },
    { time: '2019-06', value: 450, count: 380 },
    { time: '2019-07', value: 470, count: 220 },
  ];

  it('slider left view should have data', () => {
    const dualAxes = new DualAxes(createDiv(), {
      data: [data, data],
      xField: 'time',
      yField: ['value', 'count'],
      slider: {
        end: 1,
      },
      geometryOptions: [
        {
          geometry: 'column',
        },
        {
          geometry: 'line',
          lineStyle: {
            lineWidth: 2,
          },
        },
      ],
    });

    dualAxes.render();
    const filterData = dualAxes.chart.views[1].getData();
    expect(filterData.length).toBeGreaterThan(0);
    expect(filterData).toEqual(data);

    dualAxes.destroy();
  });

  it('dual axes should have same data', () => {
    const dualAxes = new DualAxes(createDiv(), {
      data: [data, data],
      xField: 'time',
      yField: ['value', 'count'],
      slider: {
        end: 0.9,
      },
      geometryOptions: [
        {
          geometry: 'column',
        },
        {
          geometry: 'line',
          lineStyle: {
            lineWidth: 2,
          },
        },
      ],
    });

    dualAxes.render();

    const columnFilterData = dualAxes.chart.views[0].getData();
    const lineFilterData = dualAxes.chart.views[1].getData();
    expect(columnFilterData).toEqual(lineFilterData);

    dualAxes.destroy();
  });
});
