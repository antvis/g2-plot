import { Chart } from '@antv/g2';
import { each, isArray } from '@antv/util';
import { StatisticData } from './types';

export function getTotalValue(data: object[], field: string) {
  let total = null;
  each(data, (item) => {
    if (typeof item[field] === 'number') {
      total += item[field];
    }
  });
  return total;
}

export function getStatisticData(chart: Chart, data: object[] | object, color?: string): StatisticData {
  const { angleField, colorField } = chart.getOptions();
  const angleScale = chart.getScaleByField(angleField);
  const colorScale = chart.getScaleByField(colorField);

  if (isArray(data)) {
    const value = getTotalValue(data, angleField);
    // 全部数据
    return {
      title: '总计',
      value,
    };
  }

  return {
    title: colorScale ? colorScale.getText(data[colorField]) : null,
    value: angleScale.getText(data[angleField]),
    color,
  };
}
