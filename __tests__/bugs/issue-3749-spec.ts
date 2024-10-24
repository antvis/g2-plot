import { DualAxes } from '../../src';
import { createDiv } from '../utils/dom';

describe('#3749', () => {
  it('dual-axes', async () => {
    const data = [
      { time: '10:10', call: 4, waiting: 2, people: 2 },
      { time: '10:15', call: 2, waiting: 6, people: 3 },
      { time: '10:20', call: 13, waiting: 2, people: 5 },
      { time: '10:25', call: 9, waiting: 9, people: 1 },
      { time: '10:30', call: 5, waiting: 2, people: 3 },
      { time: '10:31', call: 6, waiting: 3, people: 4 },
      // { time: '10:32', call: 5, waiting: 3, people: 4 },
      // { time: '10:33', call: 5, waiting: 3, people: 4 },
      // { time: '10:34', call: 5, waiting: 3, people: 4 },
      // { time: '10:35', call: 5, waiting: 3, people: 4 },
      // { time: '10:36', call: 5, waiting: 3, people: 4 },
      // { time: '10:37', call: 5, waiting: 3, people: 4 },
      // { time: '10:38', call: 5, waiting: 3, people: 4 },
      // { time: '10:39', call: 5, waiting: 3, people: 4 },
      // { time: '10:40', call: 5, waiting: 3, people: 4 },
      // { time: '10:41', call: 5, waiting: 3, people: 4 },
      // { time: '10:42', call: 5, waiting: 3, people: 4 },
      // { time: '10:43', call: 5, waiting: 3, people: 4 },
      // { time: '10:44', call: 5, waiting: 3, people: 4 },
    ];

    const dualAxes = new DualAxes(createDiv(), {
      data: [data, data],
      xField: 'time',
      yField: ['waiting', 'people'],
      slider: {
        start: 0,
        end: 1,
      },
      tooltip: false,
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
    console.log('dualAxes: ', dualAxes);
  });
});
