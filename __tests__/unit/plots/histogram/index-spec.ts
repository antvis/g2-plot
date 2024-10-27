import { Histogram } from '../../../../src';
import { DEFAULT_OPTIONS } from '../../../../src/plots/histogram/constant';
import { histogramData, histogramStackData } from '../../../data/histogram-data';
import { createDiv } from '../../../utils/dom';

describe('histogram', () => {
  it('binWidth', () => {
    const histogram = new Histogram(createDiv(), {
      width: 400,
      height: 300,
      appendPadding: 10,
      data: histogramData,
      binField: 'value',
      binWidth: 2,
    });

    histogram.render();
    // @ts-ignore
    expect(histogram.getDefaultOptions()).toBe(Histogram.getDefaultOptions());

    const geometry = histogram.chart.geometries[0];
    const shapeOrigin = geometry.getShapes()[0].get('origin').data;
    expect(shapeOrigin.range[1] - shapeOrigin.range[0]).toBe(2);

    const elements = geometry.elements;
    expect(elements[0].shape.attr('stroke')).toBe('#FFFFFF');
    expect(histogram.chart.getController('legend').visible).toEqual(true);
    // @ts-ignore
    expect(histogram.chart.getController('legend').components.length).toEqual(0);
    // @ts-ignore
    expect(histogram.chart.options.axes.count).toEqual({
      nice: true,
      label: {
        autoHide: true,
        autoRotate: false,
      },
    });
    // @ts-ignore
    expect(histogram.chart.options.scales.range.tickInterval).toEqual(2);
    // @ts-ignore
    expect(histogram.chart.options.axes.range).toEqual({
      nice: true,
      label: {
        autoHide: {
          type: 'equidistance',
          cfg: {
            minGap: 6,
          },
        },
        autoRotate: false,
      },
    });

    histogram.destroy();
  });

  it('binNumber: shape 数量等于 分箱数量', () => {
    const histogram = new Histogram(createDiv(), {
      width: 400,
      height: 300,
      appendPadding: 10,
      data: histogramData,
      binNumber: 4,
      binField: 'value',
    });

    histogram.render();

    const geometry = histogram.chart.geometries[0];
    const shapes = geometry.getShapes();

    expect(shapes.length).toBe(4);

    // @ts-ignore
    expect(histogram.chart.options.scales.range.tickInterval).toEqual(7.3999999999999995);

    histogram.destroy();
  });

  it('automatic calculate binNumber', () => {
    const histogram = new Histogram(createDiv(), {
      width: 400,
      height: 300,
      appendPadding: 10,
      data: histogramData,
      binField: 'value',
    });

    histogram.render();

    const geometry = histogram.chart.geometries[0];
    const shapeOrigin = geometry.getShapes()[0].get('origin').data;

    // 最大值 - 最小值
    const width = 23.4 - 1.2;
    const binNumber = Math.ceil(Math.log(histogramData.length) / Math.LN2) + 1;
    const binWidth = width / binNumber;

    expect(shapeOrigin.range[1] - shapeOrigin.range[0]).toBe(binWidth);

    histogram.destroy();
  });

  it('color with binWidth', () => {
    const histogram = new Histogram(createDiv(), {
      width: 400,
      height: 300,
      appendPadding: 10,
      data: histogramData,
      binField: 'value',
      binWidth: 2,
      color: () => 'red',
    });

    histogram.render();

    const geometry = histogram.chart.geometries[0];
    const elements = geometry.elements;
    const shapeOrigin = geometry.getShapes()[0].get('origin').data;

    expect(shapeOrigin.range[1] - shapeOrigin.range[0]).toBe(2);
    expect(elements[0].getModel().color).toBe('red');

    histogram.destroy();
  });

  it('stackField: 层叠直方图', () => {
    const histogram = new Histogram(createDiv('legend * true * stackField'), {
      width: 400,
      height: 300,
      appendPadding: 10,
      data: histogramStackData,
      binField: 'value',
      binWidth: 4,
      legend: {},
      stackField: 'type',
    });

    histogram.render();

    const geometry = histogram.chart.geometries[0];

    // 如果没有 stackField 是没有adjustNames这个数组
    expect(geometry.getAdjust('stack')).toMatchObject({
      xField: 'range',
      yField: 'count',
    });
    //@ts-ignore
    expect(histogram.chart.getController('legend').components[0].extra.scale.field).toEqual('type');
    //@ts-ignore
    expect(histogram.chart.getController('legend').components.length).toEqual(1);

    histogram.destroy();
  });

  it('直方图 关闭 legend', () => {
    const histogram = new Histogram(createDiv('legend * true'), {
      width: 400,
      height: 300,
      appendPadding: 10,
      data: histogramStackData,
      binField: 'value',
      binWidth: 4,
      legend: false,
    });

    histogram.render();

    //@ts-ignore
    expect(histogram.chart.getController('legend').components.length).toEqual(0);

    histogram.destroy();
  });

  it('stackField with color', () => {
    const colors = ['red', 'blue'];
    const histogram = new Histogram(createDiv(), {
      width: 400,
      height: 300,
      appendPadding: 10,
      data: histogramStackData,
      binField: 'value',
      binWidth: 4,
      stackField: 'type',
      color: colors,
    });

    histogram.render();

    const geometry = histogram.chart.geometries[0];
    const colorAttribute = geometry.getAttribute('color');

    expect(colorAttribute.values).toEqual(colors);
    expect(geometry.getAdjust('stack')).toMatchObject({
      xField: 'range',
      yField: 'count',
    });

    histogram.destroy();
  });

  it('defaultOptions 保持从 constants 中获取', () => {
    expect(Histogram.getDefaultOptions()).toEqual(DEFAULT_OPTIONS);
  });
});
