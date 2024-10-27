import { animation, interaction, scale, state, theme, tooltip } from '../../adaptor/common';
import { interval } from '../../adaptor/geometries';
import { pattern } from '../../adaptor/pattern';
import { Params } from '../../core/adaptor';
import { deepAssign, findGeometry, flow, transformLabel } from '../../utils';
import { binHistogram, calculateBinWidth } from '../../utils/transform/histogram';
import { HISTOGRAM_X_FIELD, HISTOGRAM_Y_FIELD } from './constant';
import { HistogramOptions } from './types';

/**
 * geometry 处理
 * @param params
 */
function geometry(params: Params<HistogramOptions>): Params<HistogramOptions> {
  const { chart, options } = params;
  const { data, binField, binNumber, binWidth, color, stackField, legend, columnStyle } = options;

  // 处理数据
  const plotData = binHistogram(data, binField, binWidth, binNumber, stackField);

  chart.data(plotData);

  const p = deepAssign({}, params, {
    options: {
      xField: HISTOGRAM_X_FIELD,
      yField: HISTOGRAM_Y_FIELD,
      seriesField: stackField,
      isStack: true,
      interval: {
        color,
        style: columnStyle,
      },
    },
  });

  interval(p);

  // 图例
  if (legend && stackField) {
    chart.legend(stackField, legend);
  } else {
    chart.legend(false);
  }

  return params;
}

/**
 * meta 配置
 * @param params
 */
function meta(params: Params<HistogramOptions>): Params<HistogramOptions> {
  const { options } = params;
  const { data, binField, binWidth, binNumber, xAxis, yAxis } = options;

  const { binWidth: _binWidth } = calculateBinWidth(data, binField, binWidth, binNumber);

  return flow(
    scale({
      [HISTOGRAM_X_FIELD]: xAxis,
      [HISTOGRAM_Y_FIELD]: yAxis,
    }, {
      [HISTOGRAM_X_FIELD]: {
        // 分箱宽度和刻度线宽度默认保持一致
        tickInterval: _binWidth,
      },
    })
  )(params);
}

/**
 * axis 配置
 * @param params
 */
function axis(params: Params<HistogramOptions>): Params<HistogramOptions> {
  const { chart, options } = params;
  const { xAxis, yAxis } = options;

  // 为 false 则是不显示轴
  if (xAxis === false) {
    chart.axis(HISTOGRAM_X_FIELD, false);
  } else {
    chart.axis(HISTOGRAM_X_FIELD, xAxis);
  }

  if (yAxis === false) {
    chart.axis(HISTOGRAM_Y_FIELD, false);
  } else {
    chart.axis(HISTOGRAM_Y_FIELD, yAxis);
  }

  return params;
}

/**
 * label 配置
 * @param params
 */
function label(params: Params<HistogramOptions>): Params<HistogramOptions> {
  const { chart, options } = params;
  const { label } = options;

  const geometry = findGeometry(chart, 'interval');

  if (!label) {
    geometry.label(false);
  } else {
    const { callback, ...cfg } = label;
    geometry.label({
      fields: [HISTOGRAM_Y_FIELD],
      callback,
      cfg: transformLabel(cfg),
    });
  }

  return params;
}

/**
 * 直方图适配器
 * @param chart
 * @param options
 */
export function adaptor(params: Params<HistogramOptions>) {
  // flow 的方式处理所有的配置到 G2 API
  return flow(
    theme,
    pattern('columnStyle'),
    geometry,
    meta,
    axis,
    state,
    label,
    tooltip,
    interaction,
    animation
  )(params);
}
