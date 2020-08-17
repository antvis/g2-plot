import { isFunction } from '@antv/util';
import { deepMix } from '@antv/util';
import { Params } from '../../core/adaptor';
import { interval } from '../../adaptor/geometries';
import { tooltip, interaction, animation, theme } from '../../adaptor/common';
import { flow } from '../../utils';
import { processData } from './utils';
import { WaterfallOptions } from './types';

/** 数据处理 */
function dataHandler(params: Params<WaterfallOptions>) {
  const { chart, options } = params;
  const { data = [], xField, yField, showTotal, totalLabel } = options;

  return params;
}

/** 字段处理 */
function field(params: Params<WaterfallOptions>) {
  const { chart, options } = params;
  const { xField, yField, color, data = [], showTotal, totalLabel } = options;

  // 数据处理
  const newData = processData(data, xField, yField, showTotal, totalLabel);
  chart.data(newData);

  const geometry = chart.interval().position(`${xField}*${yField}`);
  geometry.color(xField, isFunction(color) ? color() : color);
  geometry.shape('waterfall');
  return params;
}

/** 样式处理 */
function style(params: Params<WaterfallOptions>) {
  const { options } = params;
  const { waterfallStyle } = options;
  /*******************/
  /**@todo 连接线样式 */
  /*******************/
  if (waterfallStyle) {
    flow(interval)(
      deepMix({}, params, {
        options: {
          interval: {
            style: waterfallStyle,
          },
        },
      })
    );
  }

  return params;
}

/**
 * @desc legend 配置
 * @param params
 */
function legend(params: Params<WaterfallOptions>) {
  const { chart, options } = params;
  const { legend } = options;

  // 存在主题才设置主题
  if (legend) {
    chart.legend(legend);
  }
  return params;
}

export function adaptor(param: Params<WaterfallOptions>) {
  return flow(field, tooltip, interaction, animation, theme, legend, style)(param);
}
