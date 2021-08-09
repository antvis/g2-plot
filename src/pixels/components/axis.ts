import { Axis } from '@antv/component';
import { deepMix, get } from '@antv/util';
import { DIRECTION } from '../type';
import { Axis as AxisOption } from '../../types/axis';
import { PixelPlot } from '../index';
import { getAxisRegion, getVerticalFactor } from '../util/axis';
import { getTicks } from '../util/scale';
import { Controller } from './base';

export class AxisController extends Controller<AxisOption> {
  /** 轴的配置项 */
  public options: AxisOption;
  /** 横竖轴 */
  public xAxisComponent: Axis.Line; // 暂定line类型
  public yAxisComponent: Axis.Line;
  /** 整个plot */
  public pixelPlot: PixelPlot;

  protected init(): void {
    const { xField, yField, xAxis, yAxis } = this.pixelPlot.options;

    const xAxisComponent = this.createLineAxis(xField, xAxis, DIRECTION.BOTTOM);
    xAxisComponent.init();

    const yAxisComponent = this.createLineAxis(yField, yAxis, DIRECTION.LEFT);
    yAxisComponent.init();

    this.xAxisComponent = xAxisComponent;
    this.yAxisComponent = yAxisComponent;
  }

  /**
   * 渲染所有轴
   */
  public render() {
    if (this.xAxisComponent) this.xAxisComponent.render();
    if (this.yAxisComponent) this.yAxisComponent.render();
  }

  public clear() {
    if (this.xAxisComponent) this.xAxisComponent.clear();
    if (this.yAxisComponent) this.yAxisComponent.clear();
  }

  /**
   * 销毁所有轴
   */
  public destroy() {
    if (this.xAxisComponent) this.xAxisComponent.destroy();
    if (this.yAxisComponent) this.yAxisComponent.destroy();
  }

  /**
   * 创建轴方法
   */
  private createLineAxis(field: string, axisOption: AxisOption, direction: string) {
    const axisCfg = this.getAxisCfg(field, axisOption, direction);

    return new Axis.Line(axisCfg);
  }

  /**
   * 获取轴的配置
   */
  protected getAxisCfg(field: string, axisOption: AxisOption, direction: string) {
    const pixelBBox = this.pixelPlot.pixelBBox;
    // 默认渲染在背景层
    const canvas = axisOption['top'] ? 'foregroundCanvas' : 'backgroundCanvas';
    // 根据字段生成对应的比例尺, 以生成 ticks
    let scale = this.pixelPlot.getScale(field);
    if (!scale) {
      scale = this.pixelPlot.createScale(field, axisOption);
    }
    // 如果是 brush 交互，使用 临时的 tempScales
    scale = this.pixelPlot.getTempScale(field) || scale;

    // 确定轴的方向：x或y
    const dir = get(axisOption, 'position', direction);
    // 轴的刻度和文字方向
    const verticalFactor = getVerticalFactor(dir);
    // 轴的位置
    const region = getAxisRegion(pixelBBox, dir);
    // 融合配置
    const cfg = deepMix(
      {
        id: field,
        container: this.pixelPlot[canvas].addGroup(),
        ...region,
        ticks: getTicks(scale),
        verticalFactor,
        animate: true,
        label: {
          autoHide: true,
        },
      },
      axisOption
    );

    return cfg;
  }

  /**
   * 更新所有轴
   */
  public update() {
    const { xAxis, yAxis, xField, yField } = this.pixelPlot.options;

    const xAxisCfg = this.getAxisCfg(xField, xAxis, DIRECTION.BOTTOM);
    const yAxisCfg = this.getAxisCfg(yField, yAxis, DIRECTION.LEFT);

    if (this.xAxisComponent) this.xAxisComponent.update(xAxisCfg);
    if (this.yAxisComponent) this.yAxisComponent.update(yAxisCfg);
  }
}
