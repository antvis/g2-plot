import { clone, each, getRange, groupBy, hasKey, isEmpty, sortBy, valuesOfKey } from '@antv/util';
import { Data } from '../../types';

type StatisticData = {
  range: Array<number>;
  count: number;
};
type StatisticBin = {
  [key: string]: StatisticData;
};

// 进行转换得到值所在的 range
function getBinKey(value: number, binWidth: number, binNumber?: number): [number, number] {
  // 做一点特殊处理
  if (binNumber === 1) {
    return [0, binWidth];
  }
  const index = Math.floor(value / binWidth);
  return [binWidth * index, binWidth * (index + 1)];
}

// 默认 sturges 转换
function sturges(values: Array<number>): number {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
}

// 计算 binWidth
export function calculateBinWidth(data: Data, binField: string, binWidth: number, binNumber?: number) {
  const originData_copy = clone(data);

  // 根据 binField 对源数据进行排序
  sortBy(originData_copy, binField);

  // 获取源数据 binField 的 range
  const values = valuesOfKey(originData_copy, binField);
  const range = getRange(values);
  const rangeWidth = range.max - range.min;

  // 计算分箱，直方图分箱的计算基于 binWidth，如配置了 binNumber 则将其转为 binWidth 进行计算
  let _binWidth = binWidth;
  if (!binWidth && binNumber) {
    _binWidth = binNumber > 1 ? rangeWidth / (binNumber - 1) : range.max;
  }
  // 当 binWidth 和 binNumber 都没有指定的情况，采用 Sturges formula 自动生成 binWidth
  if (!binWidth && !binNumber) {
    const _defaultBinNumber = sturges(values);
    _binWidth = rangeWidth / _defaultBinNumber;
  }
  return {
    binWidth: _binWidth,
    sortData: originData_copy,
  };
}

/**
 * 对数据进行百分比化
 * @param data
 * @param binField
 * @param binWidth
 * @param binNumber
 * @param stackField
 */
export function binHistogram(data: Data, binField: string, binWidth: number, binNumber?: number, stackField?: string) {
  const { binWidth: _binWidth, sortData } = calculateBinWidth(data, binField, binWidth, binNumber);

  // 构建 key - StatisticData 结构
  const bins: StatisticBin = {};
  const groups = groupBy(sortData, stackField);
  // 判断分组是否为空，如果为空，说明没有 stackField 字段
  if (isEmpty(groups)) {
    each(sortData, (data: any) => {
      const value = data[binField];
      const bin = getBinKey(value, _binWidth, binNumber);
      const binKey = `${bin[0]}-${bin[1]}`;
      if (!hasKey(bins, binKey)) {
        bins[binKey] = { range: bin, count: 0 };
      }
      bins[binKey].count += 1;
    });
  } else {
    Object.keys(groups).forEach((groupKey: string) => {
      each(groups[groupKey], (data: any) => {
        const value = data[binField];
        const bin = getBinKey(value, _binWidth, binNumber);
        const binKey = `${bin[0]}-${bin[1]}`;
        const groupKeyBinKey = `${binKey}-${groupKey}`;
        if (!hasKey(bins, groupKeyBinKey)) {
          bins[groupKeyBinKey] = { range: bin, count: 0 };
          bins[groupKeyBinKey][stackField] = groupKey;
        }
        bins[groupKeyBinKey].count += 1;
      });
    });
  }
  // 将分箱数据转换为 plotData 才是图表所需要的
  const plotData: Array<StatisticData> = [];
  each(bins, (bin: StatisticData) => {
    plotData.push(bin);
  });
  return plotData;
}
